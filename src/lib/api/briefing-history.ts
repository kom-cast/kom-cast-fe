import {
  type Briefing,
  type BriefingSegment,
  type BriefingTarget,
  type WordTiming,
} from './briefings'
import { apiClient } from './client'
import { type Page } from './pagination'
import { toError } from './to-error'

// NOTE: kom-cast-be의 BriefingTargetDto는 @JsonInclude(NON_NULL)이라 안 쓰는
// 코드 필드는 null로 채워 보내는 게 아니라 응답에서 아예 빠짐(STOCK이면
// industry_code 자체가 없음). 그래서 둘 다 optional로 잡음. 화면에서 쓰기 편한
// 판별 유니온(BriefingTarget)은 toBriefing()에서 변환해서 만듦.
export interface RemoteBriefingTarget {
  type: 'STOCK' | 'INDUSTRY' | 'USER'
  stock_code?: string | null
  industry_code?: string | null
}

export interface RemoteBriefingSegment {
  fraction: number | null
  speaker: '코스' | '코미'
  target: RemoteBriefingTarget
  text: string
  startSec: number
  words: WordTiming[]
}

export interface RemoteBriefing {
  id: string
  date: string
  headline: string
  audioUrl: string
  durationSeconds: number
  segments: RemoteBriefingSegment[]
}

export interface RemoteBriefingListItem {
  id: string
  date: string
  headline: string
  duration: string
}

export async function fetchTodayBriefing(): Promise<RemoteBriefing> {
  try {
    const { data } = await apiClient.get<RemoteBriefing>('/briefings/today')
    return data
  } catch (err) {
    throw toError(err, '오늘의 브리핑 조회')
  }
}

export async function fetchBriefingHistory(
  page = 0,
  size = 10,
): Promise<Page<RemoteBriefingListItem>> {
  try {
    const { data } = await apiClient.get<Page<RemoteBriefingListItem>>(
      '/briefings',
      { params: { page, size } },
    )
    return data
  } catch (err) {
    throw toError(err, '브리핑 이력 조회')
  }
}

export async function fetchBriefingById(id: string): Promise<RemoteBriefing> {
  try {
    const { data } = await apiClient.get<RemoteBriefing>(`/briefings/${id}`)
    return data
  } catch (err) {
    throw toError(err, '브리핑 상세 조회')
  }
}

function toBriefingTarget(remote: RemoteBriefingTarget): BriefingTarget {
  if (remote.type === 'STOCK' && remote.stock_code) {
    return { type: 'STOCK', stock_code: remote.stock_code }
  }
  if (remote.type === 'INDUSTRY' && remote.industry_code) {
    return { type: 'INDUSTRY', industry_code: remote.industry_code }
  }
  return { type: 'USER' }
}

function toBriefingSegment(remote: RemoteBriefingSegment): BriefingSegment {
  return {
    speaker: remote.speaker,
    target: toBriefingTarget(remote.target),
    text: remote.text,
    fraction: remote.fraction,
    startSec: remote.startSec,
    words: remote.words,
  }
}

export function toBriefing(remote: RemoteBriefing): Briefing {
  return {
    audioUrl: remote.audioUrl,
    durationSec: remote.durationSeconds,
    segments: remote.segments.map(toBriefingSegment),
  }
}
