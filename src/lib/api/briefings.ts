import { isAxiosError } from 'axios'

import { TTS_API_BASE_URL, ttsApiClient } from './tts-client'

export type BriefingTarget =
  | { type: 'STOCK'; stock_code: string }
  | { type: 'INDUSTRY'; industry_code: string }
  | { type: 'USER' }

export interface DialogueLine {
  speaker: '코스' | '코미'
  target: BriefingTarget
  text: string
}

export interface WordTiming {
  text: string
  startSec: number
  endSec: number
}

export interface BriefingSegment {
  speaker: '코스' | '코미'
  target: BriefingTarget
  text: string
  fraction: number | null
  startSec: number
  words: WordTiming[]
}

export interface Briefing {
  audioUrl: string
  durationSec: number
  segments: BriefingSegment[]
}

// komcast-tts mixer.py의 GAP_BETWEEN_LINES_MS(400ms)와 반드시 맞춰야 함 -
// 라인 사이 무음 간격이 바뀌면 여기서 계산하는 세그먼트 실제 끝 지점도 같이
// 어긋남.
const SEGMENT_GAP_SEC = 0.4

// NOTE: TTS가 내려주는 단어별 타이밍은 세그먼트가 길어질수록 뒤로 갈수록
// 오차가 누적돼 실제 오디오보다 빠르게 흘러가는 경향이 있음(시작 지점은
// 대체로 정확, 끝은 앵커로 강제로 맞춰짐). 그래서 세그먼트 시작(startSec)과
// 실제 끝(다음 세그먼트 시작에서 gap을 뺀 값 - 마지막 세그먼트는 전체 길이)
// 두 앵커는 그대로 두고, 그 사이 위치를 sin(π·u^SKEW) 혹(hump)으로 밀어서
// 느리게 만든다. SKEW>1이면 u^SKEW가 작은 u에서 더 작아져서(u=0 근처는 거의
// 안 밀림) 혹의 정점이 뒤쪽으로 쏠림 - 원래 안 어긋나던 앞부분은 그대로
// 두고, 갈수록 벌어지는 뒷부분 위주로 지연을 더 준다. 어디서도 sin 값이
// 음수가 되지 않아 원래보다 빨라지는 구간은 생기지 않고, u=1에서 정확히
// 앵커로 돌아온다.
const MIDDLE_SLOWDOWN_STRENGTH = 0.03
const MIDDLE_SLOWDOWN_SKEW = 2

function warpMiddleSlower(fraction: number): number {
  const u = Math.min(1, Math.max(0, fraction))
  return (
    u + MIDDLE_SLOWDOWN_STRENGTH * Math.sin(Math.PI * u ** MIDDLE_SLOWDOWN_SKEW)
  )
}

export function normalizeSegmentTimings(
  segments: BriefingSegment[],
  durationSec: number,
): BriefingSegment[] {
  return segments.map((segment, i) => {
    if (segment.words.length === 0) return segment

    const realStart = segment.startSec
    const realEnd =
      i < segments.length - 1
        ? segments[i + 1].startSec - SEGMENT_GAP_SEC
        : durationSec

    if (realEnd <= realStart) return segment

    if (segment.words.length === 1) {
      const [word] = segment.words
      return {
        ...segment,
        words: [{ ...word, startSec: realStart, endSec: realEnd }],
      }
    }

    const firstStart = segment.words[0].startSec
    const lastEnd = segment.words[segment.words.length - 1].endSec
    const originalSpan = lastEnd - firstStart
    if (originalSpan <= 0) return segment

    const remap = (t: number) =>
      realStart +
      warpMiddleSlower((t - firstStart) / originalSpan) * (realEnd - realStart)

    return {
      ...segment,
      words: segment.words.map((word) => ({
        ...word,
        startSec: remap(word.startSec),
        endSec: remap(word.endSec),
      })),
    }
  })
}

function targetKey(target: BriefingTarget): string {
  switch (target.type) {
    case 'STOCK':
      return `STOCK:${target.stock_code}`
    case 'INDUSTRY':
      return `INDUSTRY:${target.industry_code}`
    case 'USER':
      return 'USER'
  }
}

type SectionType = 'OPENING' | 'INDUSTRY' | 'BRIDGE' | 'STOCK' | 'CLOSING'

interface ScriptSection {
  script_type: SectionType
  target: BriefingTarget
  lines: { speaker: '코스' | '코미'; text: string }[]
}

// script_type은 komcast-tts가 현재 요청 바디에서 검증/사용하진 않지만(스펙엔
// target/lines만 required), kom-cast-be가 TTS를 호출할 때 쓰는 것과 같은 필드명
// (TtsRequestDto.TtsSection.sectionType → @JsonProperty("script_type"))으로
// 맞춰서 보냄. 값은 target과 위치 기준으로 채움: 맨 앞/맨 뒤 USER 구간은
// OPENING/CLOSING, STOCK·INDUSTRY 구간은 그대로, 중간에 낀 USER 구간(진행자
// 전환 멘트)은 BRIDGE.
function sectionTypeOf(
  target: BriefingTarget,
  index: number,
  total: number,
): SectionType {
  if (target.type === 'STOCK') return 'STOCK'
  if (target.type === 'INDUSTRY') return 'INDUSTRY'
  if (index === 0) return 'OPENING'
  if (index === total - 1) return 'CLOSING'
  return 'BRIDGE'
}

// NOTE: komcast-tts의 /briefings는 대상(target)이 line이 아니라 section 단위로
// 묶인 스펙(Script { script_id, sections: [{ script_type, target, lines }] })을
// 받음. 여기 DialogueLine[]는 프론트에서 다루기 편한 평평한 형태라 요청 직전에
// 같은 target이 연속되는 구간끼리 section으로 묶어서 보냄.
function groupIntoSections(lines: DialogueLine[]): ScriptSection[] {
  const groups: { target: BriefingTarget; lines: DialogueLine[] }[] = []

  for (const line of lines) {
    const last = groups[groups.length - 1]
    if (last && targetKey(last.target) === targetKey(line.target)) {
      last.lines.push(line)
    } else {
      groups.push({ target: line.target, lines: [line] })
    }
  }

  return groups.map((group, index) => ({
    script_type: sectionTypeOf(group.target, index, groups.length),
    target: group.target,
    lines: group.lines.map(({ speaker, text }) => ({ speaker, text })),
  }))
}

// NOTE: komcast-tts를 프론트에서 직접 호출하는 mock 경로 전용. 실제 서비스에서는
// kom-cast-be가 이 역할을 대신 해주고 fetchTodayBriefing/fetchBriefingById로
// 받아오기만 하면 됨 (mock-briefing.ts, player-context.tsx 참고).
export async function createBriefing(
  scriptId: string,
  lines: DialogueLine[],
): Promise<Briefing> {
  try {
    const { data } = await ttsApiClient.post(`/briefings`, {
      script_id: scriptId,
      sections: groupIntoSections(lines),
    })

    const segments = (data.segments as BriefingSegment[]).map((segment) => ({
      ...segment,
      fraction: segment.fraction ?? null,
    }))

    return {
      audioUrl: `${TTS_API_BASE_URL}${data.audioUrl}`,
      durationSec: data.durationSec,
      segments: normalizeSegmentTimings(segments, data.durationSec),
    }
  } catch (err) {
    if (isAxiosError(err)) {
      throw new Error(
        `브리핑 생성 실패 (${err.response?.status ?? 'network error'})`,
      )
    }
    throw err
  }
}
