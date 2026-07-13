import { useState } from 'react'
import { Heart } from 'lucide-react'

import { type Stock } from '@/data/stocks'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'

const POPULAR_COUNT = 8

function StockSearchPicker({
  options,
  selected,
  onChange,
  placeholder = '종목명 또는 코드 검색',
}: {
  options: Stock[]
  selected: string[]
  onChange: (next: string[]) => void
  placeholder?: string
}) {
  const [query, setQuery] = useState('')

  const listSource = query
    ? options.filter(
        (stock) => stock.name.includes(query) || stock.code.includes(query),
      )
    : options.slice(0, POPULAR_COUNT)

  function toggleStock(name: string) {
    onChange(
      selected.includes(name)
        ? selected.filter((s) => s !== name)
        : [...selected, name],
    )
  }

  return (
    <div className='space-y-4'>
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className='h-14 rounded-2xl border-transparent bg-muted px-4 text-base'
      />

      <div className='space-y-1'>
        {!query && (
          <p className='px-1 pb-1 text-sm font-medium text-muted-foreground'>
            인기 종목
          </p>
        )}
        <div className='overflow-hidden rounded-2xl bg-muted/50'>
          {listSource.length === 0 && (
            <p className='px-4 py-6 text-center text-sm text-muted-foreground'>
              검색 결과가 없어요
            </p>
          )}
          {listSource.map((stock, i) => {
            const isSelected = selected.includes(stock.name)
            const isUp = stock.change >= 0
            return (
              <button
                key={stock.name}
                type='button'
                onClick={() => toggleStock(stock.name)}
                className={cn(
                  'flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors',
                  i !== 0 && 'border-t border-background',
                  isSelected ? 'bg-[#ec6d1e]/10' : 'hover:bg-muted',
                )}
              >
                <span className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-background text-sm font-semibold text-foreground'>
                  {stock.name.slice(0, 1)}
                </span>
                <span className='min-w-0 flex-1'>
                  <span className='block truncate text-base font-medium text-foreground'>
                    {stock.name}
                  </span>
                  <span className='block text-xs text-muted-foreground'>
                    {stock.code}
                  </span>
                </span>
                <span className='shrink-0 text-right'>
                  <span className='block text-sm font-semibold text-foreground'>
                    {stock.price.toLocaleString()}
                  </span>
                  <span
                    className={cn(
                      'block text-xs font-medium',
                      isUp ? 'text-red-500' : 'text-blue-500',
                    )}
                  >
                    {isUp ? '+' : ''}
                    {stock.change}%
                  </span>
                </span>
                <Heart
                  className={cn(
                    'h-5 w-5 shrink-0',
                    isSelected
                      ? 'fill-[#ec6d1e] text-[#ec6d1e]'
                      : 'text-muted-foreground/40',
                  )}
                />
              </button>
            )
          })}
        </div>
      </div>

      {selected.length > 0 && (
        <div className='space-y-2'>
          <p className='px-1 text-sm text-muted-foreground'>
            선택한 종목 {selected.length}개
          </p>
          <div className='flex flex-wrap gap-2'>
            {selected.map((name) => (
              <span
                key={name}
                className='inline-flex items-center gap-1.5 rounded-full bg-[#ec6d1e]/10 px-3.5 py-2 text-sm font-medium text-[#E85D00]'
              >
                {name}
                <button
                  type='button'
                  onClick={() => toggleStock(name)}
                  aria-label={`${name} 제거`}
                  className='text-[#E85D00]/70 hover:text-[#E85D00]'
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default StockSearchPicker
