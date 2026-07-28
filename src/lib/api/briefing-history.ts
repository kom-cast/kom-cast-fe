import {
  type Briefing,
  type BriefingSegment,
  type BriefingTarget,
  type WordTiming,
} from './briefings'
import { apiClient } from './client'
import { toError } from './to-error'

// NOTE: 실제 응답은 STOCK/INDUSTRY/USER 상관없이 stock_code/industry_code가
// 항상 둘 다 내려오고(안 쓰는 쪽은 null) 구분되는 유니온이 아님. 화면에서 쓰기
// 편한 판별 유니온(BriefingTarget)은 toBriefing()에서 변환해서 만듦.
export interface RemoteBriefingTarget {
  type: 'STOCK' | 'INDUSTRY' | 'USER'
  stock_code: string | null
  industry_code: string | null
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

export interface Page<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
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
