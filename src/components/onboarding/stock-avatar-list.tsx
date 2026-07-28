import { useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Search } from 'lucide-react'

import { type Stock } from '@/data/stocks'
import { getAllStocks } from '@/lib/api'
import { cn } from '@/lib/utils'
import { Pagination } from '@/components/ui/pagination'

import { StockButton } from './stock-button'

const BROWSE_PAGE_SIZE = 10

// NOTE: 백엔드 /stocks 응답 순서에 의존하면 정렬이 바뀔 때마다 "인기 종목"이
// 달라지므로, 인기 종목은 코드로 고정해두고 응답에서 매칭되는 종목만 보여줌.
const POPULAR_STOCK_CODES = [
  '005930', // 삼성전자
  '000660', // SK하이닉스
  '005380', // 현대자동차
  '042660', // 한화오션
  '035420', // NAVER
  '051910', // LG화학
  '006400', // 삼성SDI
  '035720', // 카카오
  '207940', // 삼성바이오로직스
  '373220', // LG에너지솔루션
]

export function StockAvatarList({
  options,
  selected,
  onChange,
  showPopular = true,
  excludeNames = [],
}: {
  options: Stock[]
  selected: string[]
  onChange: (next: string[]) => void
  // NOTE: 온보딩은 처음 고르는 화면이라 "인기 종목" 지름길이 유용하지만, 설정(관리)
  // 화면은 이미 보유 종목을 뺀 목록이라 "인기"라는 말이 매번 달라져서 헷갈림 —
  // 그래서 설정 쪽은 전체 목록만 보여줌.
  showPopular?: boolean
  // NOTE: 설정 화면에서 이미 보유 중인 종목은 "전체 종목" 페이지네이션
  // 그리드에서 빼야 해서, 제외할 이름 목록을 부모(선택 상태)에서 받음.
  excludeNames?: string[]
}) {
  const [query, setQuery] = useState('')
  const [browsePage, setBrowsePage] = useState(0)

  const { data: browseData, isPlaceholderData } = useQuery({
    queryKey: ['stocks', 'browse', browsePage],
    queryFn: () => getAllStocks({ page: browsePage, size: BROWSE_PAGE_SIZE }),
    placeholderData: keepPreviousData,
  })
  const browseStocks = (browseData?.content ?? []).filter(
    (stock) => !excludeNames.includes(stock.name),
  )
  const browseTotalPages = browseData?.totalPages ?? 0

  const normalizedQuery = query.trim().toLowerCase()
  const stocksByCode = new Map(options.map((stock) => [stock.code, stock]))
  const popularStocks = POPULAR_STOCK_CODES.map((code) =>
    stocksByCode.get(code),
  ).filter((stock): stock is Stock => stock !== undefined)
  const searchResults = options.filter(
    (stock) =>
      stock.name.toLowerCase().includes(normalizedQuery) ||
      stock.code.toLowerCase().includes(normalizedQuery),
  )

  function toggleStock(name: string) {
    onChange(
      selected.includes(name)
        ? selected.filter((s) => s !== name)
        : [...selected, name],
    )
  }

  return (
    <div>
      <div className='mb-4 flex items-center gap-2.5 rounded-full bg-[#f4f6f8] px-4 py-3'>
        <Search className='h-4 w-4 shrink-0 text-black/45' />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='종목명 또는 티커 검색'
          className='w-full bg-transparent text-sm text-[#191f28] outline-none placeholder:text-[#9a9a9a]'
        />
      </div>

      {normalizedQuery ? (
        <div className='flex flex-wrap gap-2'>
          {searchResults.length === 0 && (
            <p className='w-full py-8 text-center text-[13px] text-[#8b95a1]'>
              검색 결과가 없어요
            </p>
          )}
          {searchResults.map((stock) => (
            <StockButton
              key={stock.name}
              stock={stock}
              isSelected={selected.includes(stock.name)}
              onToggle={() => toggleStock(stock.name)}
            />
          ))}
        </div>
      ) : showPopular ? (
        <>
          <p className='mb-2.5 text-[12.5px] font-semibold text-[#8b95a1]'>
            인기 종목
          </p>
          <div className='mb-5 flex flex-wrap gap-2'>
            {popularStocks.map((stock) => (
              <StockButton
                key={stock.name}
                stock={stock}
                isSelected={selected.includes(stock.name)}
                onToggle={() => toggleStock(stock.name)}
              />
            ))}
          </div>

          <p className='mb-2.5 text-[12.5px] font-semibold text-[#8b95a1]'>
            전체 종목
          </p>
          <div
            className={cn(
              'mb-4 flex flex-wrap gap-2 transition-opacity',
              isPlaceholderData && 'opacity-50',
            )}
          >
            {browseStocks.map((stock) => (
              <StockButton
                key={stock.name}
                stock={stock}
                isSelected={selected.includes(stock.name)}
                onToggle={() => toggleStock(stock.name)}
              />
            ))}
          </div>
          <Pagination
            page={browsePage}
            totalPages={browseTotalPages}
            onPrev={() => setBrowsePage((p) => Math.max(0, p - 1))}
            onNext={() =>
              setBrowsePage((p) => Math.min(browseTotalPages - 1, p + 1))
            }
          />
        </>
      ) : (
        <>
          <div
            className={cn(
              'flex flex-wrap gap-2 transition-opacity',
              isPlaceholderData && 'opacity-50',
            )}
          >
            {browseStocks.length === 0 && (
              <p className='w-full py-8 text-center text-[13px] text-[#8b95a1]'>
                추가할 수 있는 종목이 없어요
              </p>
            )}
            {browseStocks.map((stock) => (
              <StockButton
                key={stock.name}
                stock={stock}
                isSelected={selected.includes(stock.name)}
                onToggle={() => toggleStock(stock.name)}
              />
            ))}
          </div>
          <Pagination
            page={browsePage}
            totalPages={browseTotalPages}
            onPrev={() => setBrowsePage((p) => Math.max(0, p - 1))}
            onNext={() =>
              setBrowsePage((p) => Math.min(browseTotalPages - 1, p + 1))
            }
          />
        </>
      )}
    </div>
  )
}
