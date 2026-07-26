import { type RemoteStock } from '@/lib/api'
import { cn } from '@/lib/utils'

export function PortfolioStockList({
  stocks,
  isLoading,
  error,
  onRetry,
}: {
  stocks: RemoteStock[]
  isLoading: boolean
  error: string | null
  onRetry: () => void
}) {
  if (isLoading) {
    return (
      <div className='space-y-2'>
        {Array.from({ length: 3 }).map((_, i) => (
          <span
            key={i}
            className='block h-16.5 animate-pulse rounded-2xl bg-muted/50'
          />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex flex-col items-center gap-3 rounded-2xl bg-muted/50 py-8 text-center'>
        <p className='text-[13px] text-muted-foreground'>
          보유 종목을 불러오지 못했어요
        </p>
        <button
          type='button'
          onClick={onRetry}
          className='rounded-full bg-background px-4 py-2 text-xs font-semibold text-foreground'
        >
          다시 시도
        </button>
      </div>
    )
  }

  return (
    <div className='space-y-2'>
      {stocks.map((stock) => (
        <div
          key={stock.name}
          className='flex items-center gap-3 rounded-2xl bg-muted/50 px-4 py-3.5'
        >
          <span className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#191f28] text-sm font-semibold text-white'>
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
                stock.change >= 0 ? 'text-red-500' : 'text-blue-500',
              )}
            >
              {stock.change >= 0 ? '+' : ''}
              {stock.change}%
            </span>
          </span>
        </div>
      ))}
    </div>
  )
}
