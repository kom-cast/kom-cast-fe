import { type BriefingTarget } from './briefings'
import { getAllIndustries } from './industries'
import { getAllStocks } from './stocks'

export interface TargetNameMaps {
  stocks: Map<string, string>
  industries: Map<string, string>
}

// NOTE: 종목/산업군 전체 목록은 자주 바뀌지 않아서 세션 동안 한 번만 불러와
// code -> name 조회에 재사용함.
let cache: Promise<TargetNameMaps> | null = null

export function loadTargetNameMaps(): Promise<TargetNameMaps> {
  cache ??= Promise.all([getAllStocks(), getAllIndustries()]).then(
    ([stocks, industries]) => ({
      stocks: new Map(stocks.map((s) => [s.code, s.name])),
      industries: new Map(industries.map((i) => [i.code, i.name])),
    }),
  )
  return cache
}

export function resolveTargetName(
  target: BriefingTarget,
  maps: TargetNameMaps | null,
): string | null {
  if (target.type === 'STOCK') {
    return maps?.stocks.get(target.stock_code) ?? target.stock_code
  }
  if (target.type === 'INDUSTRY') {
    return maps?.industries.get(target.industry_code) ?? target.industry_code
  }
  return null
}

export function targetKey(target: BriefingTarget): string {
  switch (target.type) {
    case 'STOCK':
      return `STOCK:${target.stock_code}`
    case 'INDUSTRY':
      return `INDUSTRY:${target.industry_code}`
    case 'USER':
      return 'USER'
  }
}
