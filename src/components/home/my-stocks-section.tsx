import { Plus } from 'lucide-react'
import { Link } from 'react-router-dom'

import { type RemoteStock } from '@/lib/api'
import { PortfolioStockList } from '@/components/stocks'

export function MyStocksSection({
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
  return (
    <>
      <div className='mb-3 flex items-center justify-between'>
        <p className='text-base font-semibold text-foreground'>내 종목</p>
        <Link to='/portfolio' className='text-sm text-muted-foreground'>
          전체보기
        </Link>
      </div>
      {!isLoading && !error && stocks.length === 0 ? (
        <Link
          to='/settings/stocks'
          className='mb-8 flex items-center justify-between rounded-2xl bg-muted/50 px-4 py-3.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted'
        >
          아직 등록한 종목이 없어요
          <span className='flex shrink-0 items-center gap-1 text-brand'>
            <Plus className='h-4 w-4' />
            추가하기
          </span>
        </Link>
      ) : (
        <div className='mb-8'>
          <PortfolioStockList
            stocks={stocks}
            isLoading={isLoading}
            error={error}
            onRetry={onRetry}
          />
        </div>
      )}
    </>
  )
}
