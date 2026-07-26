import { apiClient } from './client'
import { toError } from './to-error'

export interface RemoteIndustry {
  code: string
  name: string
}

export async function getAllIndustries(): Promise<RemoteIndustry[]> {
  try {
    const { data } = await apiClient.get<RemoteIndustry[]>('/industries')
    return data
  } catch (err) {
    throw toError(err, '산업군 조회')
  }
}

export async function getMyIndustries(): Promise<RemoteIndustry[]> {
  try {
    const { data } = await apiClient.get<RemoteIndustry[]>('/industries/my')
    return data
  } catch (err) {
    throw toError(err, '관심 산업군 조회')
  }
}

export async function registerMyIndustry(code: string): Promise<void> {
  try {
    await apiClient.post('/industries/my', { code })
  } catch (err) {
    throw toError(err, '관심 산업군 등록')
  }
}

export async function registerMyIndustriesBatch(
  codes: string[],
): Promise<void> {
  try {
    await apiClient.post('/industries/my/batch', { codes })
  } catch (err) {
    throw toError(err, '관심 산업군 등록')
  }
}

export async function deleteMyIndustry(code: string): Promise<void> {
  try {
    await apiClient.delete(`/industries/my/${encodeURIComponent(code)}`)
  } catch (err) {
    throw toError(err, '관심 산업군 삭제')
  }
}
