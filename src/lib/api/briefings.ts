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

// NOTE: komcast-tts를 프론트에서 직접 호출하는 mock 경로 전용. 실제 서비스에서는
// kom-cast-be가 이 역할을 대신 해주고 fetchTodayBriefing/fetchBriefingById로
// 받아오기만 하면 됨 (mock-briefing.ts, player-context.tsx 참고).
export async function createBriefing(
  briefingId: string,
  lines: DialogueLine[],
): Promise<Briefing> {
  try {
    const { data } = await ttsApiClient.post(`/briefings`, {
      briefing_id: briefingId,
      lines,
    })

    return {
      audioUrl: `${TTS_API_BASE_URL}${data.audioUrl}`,
      durationSec: data.durationSec,
      segments: data.segments,
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
