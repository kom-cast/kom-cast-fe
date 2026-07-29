import { Plus } from 'lucide-react'
import { Link } from 'react-router-dom'

import { type RemoteStock } from '@/lib/api'
import { PortfolioStockList } from '@/components/stocks'
import { InfoTooltip } from '@/components/ui/info-tooltip'

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
        <div className='flex items-center gap-1'>
          <p className='text-base font-semibold text-foreground'>내 종목</p>
          <InfoTooltip
            text={
              '전날 종가 기준이에요.\nCHECK API를 활용해서 받아온 데이터에요.'
            }
          />
        </div>
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
