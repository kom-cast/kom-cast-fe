import { apiClient } from './client'
import { type Page } from './pagination'
import { toError } from './to-error'

export interface RemoteStock {
  name: string
  code: string
  price: number
  change: number
}

export interface GetStocksParams {
  page?: number
  size?: number
  keyword?: string
}

export async function getAllStocks(
  params: GetStocksParams = {},
): Promise<Page<RemoteStock>> {
  const { page = 0, size = 20, keyword } = params
  try {
    const { data } = await apiClient.get<Page<RemoteStock>>('/stocks', {
      params: { page, size, keyword },
    })
    return data
  } catch (err) {
    throw toError(err, '전체 종목 조회')
  }
}

// NOTE: 종목명/코드 검색이나 이름->코드 변환처럼 페이지 구분 없이 전체
// 목록이 필요한 곳에서 쓰는 헬퍼. 첫 페이지의 totalPages를 보고 남은
// 페이지를 마저 가져와서, 종목 수와 무관하게 항상 전체를 반환함.
const FULL_FETCH_PAGE_SIZE = 200

export async function getAllStocksFull(): Promise<RemoteStock[]> {
  const first = await getAllStocks({ page: 0, size: FULL_FETCH_PAGE_SIZE })
  if (first.totalPages <= 1) return first.content

  const rest = await Promise.all(
    Array.from({ length: first.totalPages - 1 }, (_, i) =>
      getAllStocks({ page: i + 1, size: FULL_FETCH_PAGE_SIZE }),
    ),
  )
  return [first.content, ...rest.map((p) => p.content)].flat()
}

export async function getMyStocks(): Promise<RemoteStock[]> {
  try {
    const { data } = await apiClient.get<RemoteStock[]>('/stocks/my')
    return data
  } catch (err) {
    throw toError(err, '보유 종목 조회')
  }
}

export async function registerMyStock(
  code: string,
  type: 'PORTFOLIO' | 'INTEREST',
): Promise<void> {
  try {
    await apiClient.post('/stocks/my', { code, type })
  } catch (err) {
    throw toError(err, '종목 등록')
  }
}

export async function registerMyStocksBatch(
  codes: string[],
  type: 'PORTFOLIO' | 'INTEREST',
): Promise<void> {
  try {
    await apiClient.post('/stocks/my/batch', { codes, type })
  } catch (err) {
    throw toError(err, '종목 등록')
  }
}

export async function deleteMyStock(code: string): Promise<void> {
  try {
    await apiClient.delete(`/stocks/my/${code}`)
  } catch (err) {
    throw toError(err, '종목 삭제')
  }
}
