import { useState } from 'react'
import { Search } from 'lucide-react'

import { type Stock } from '@/data/stocks'

import { StockButton } from './stock-button'

const POPULAR_COUNT = 8

export function StockAvatarList({
  options,
  selected,
  onChange,
}: {
  options: Stock[]
  selected: string[]
  onChange: (next: string[]) => void
}) {
  const [query, setQuery] = useState('')

  const normalizedQuery = query.trim().toLowerCase()
  const popularStocks = options.slice(0, POPULAR_COUNT)
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
      ) : (
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
        </>
      )}
    </div>
  )
}
