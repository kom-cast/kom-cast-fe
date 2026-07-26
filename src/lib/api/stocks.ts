import { apiClient } from './client'
import { toError } from './to-error'

export interface RemoteStock {
  name: string
  code: string
  price: number
  change: number
}

export async function getAllStocks(): Promise<RemoteStock[]> {
  try {
    const { data } = await apiClient.get<RemoteStock[]>('/stocks')
    return data
  } catch (err) {
    throw toError(err, '전체 종목 조회')
  }
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
