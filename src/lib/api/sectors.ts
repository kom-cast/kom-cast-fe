import { apiClient } from './client'
import { toError } from './to-error'

export async function getAllSectors(): Promise<string[]> {
  try {
    const { data } = await apiClient.get<string[]>('/sectors')
    return data
  } catch (err) {
    throw toError(err, '산업군 조회')
  }
}

// TODO(backend): GET /sectors/my 엔드포인트 추가 요청 (종목의 GET /stocks/my와 대칭)
export async function getMySectors(): Promise<string[]> {
  try {
    const { data } = await apiClient.get<string[]>('/sectors/my')
    return data
  } catch (err) {
    throw toError(err, '관심 산업군 조회')
  }
}

// TODO(backend): POST /sectors/my {sector} 단건 등록 엔드포인트 추가 요청
// (종목의 POST /stocks/my {code, type}과 대칭, PATCH /preferences/sectors 대체)
export async function registerMySector(sector: string): Promise<void> {
  try {
    await apiClient.post('/sectors/my', { sector })
  } catch (err) {
    throw toError(err, '관심 산업군 등록')
  }
}

// TODO(backend): DELETE /sectors/my/:sector 엔드포인트 추가 요청 (종목의 DELETE /stocks/my/:code와 대칭)
export async function deleteMySector(sector: string): Promise<void> {
  try {
    await apiClient.delete(`/sectors/my/${encodeURIComponent(sector)}`)
  } catch (err) {
    throw toError(err, '관심 산업군 삭제')
  }
}
