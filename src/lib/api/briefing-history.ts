import { type WordTiming } from './briefings'
import { apiClient } from './client'
import { toError } from './to-error'

// NOTE: kom-cast-be가 komcast-tts(실시간 합성) 응답을 받아 그대로 릴레이해주는
// 형태라, 세그먼트 형식이 komcast-tts의 BriefingSegment와 동일함.
export interface RemoteBriefingSegment {
  speaker: '코스' | '코미'
  stock: string
  text: string
  startSec: number
  words: WordTiming[]
}

export interface RemoteBriefing {
  id: number
  date: string
  headline: string
  audioUrl: string
  durationSeconds: number
  segments: RemoteBriefingSegment[]
}

export interface RemoteBriefingListItem {
  id: number
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

export async function fetchBriefingById(id: number): Promise<RemoteBriefing> {
  try {
    const { data } = await apiClient.get<RemoteBriefing>(`/briefings/${id}`)
    return data
  } catch (err) {
    throw toError(err, '브리핑 상세 조회')
  }
}
