import { useQuery } from '@tanstack/react-query'
import { ArrowRight, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'

import { getMyIndustries, getMyStocks } from '@/lib/api'
import { BottomNav } from '@/components/layout'
import { PortfolioStockList } from '@/components/stocks'
import { InfoTooltip } from '@/components/ui/info-tooltip'

export function MyStocksPage() {
  const {
    data: portfolioStocks = [],
    isLoading: stocksLoading,
    error: stocksError,
    refetch: refetchStocks,
  } = useQuery({
    queryKey: ['myStocks'],
    queryFn: getMyStocks,
  })

  const {
    data: myIndustries = [],
    isLoading: industriesLoading,
    error: industriesError,
    refetch: refetchIndustries,
  } = useQuery({
    queryKey: ['myIndustries'],
    queryFn: getMyIndustries,
  })
  const industries = myIndustries.map((i) => i.name)

  return (
    <div className='min-h-svh bg-background pb-40 sm:min-h-full'>
      <div className='mx-auto w-full max-w-sm px-5 py-6'>
        <h1 className='mb-5 text-xl font-bold text-foreground'>내 종목</h1>

        {!industriesLoading && !industriesError && industries.length === 0 && (
          <Link
            to='/settings/industries'
            className='mb-6 flex items-center justify-between rounded-2xl bg-brand/10 px-4 py-3 text-sm font-medium text-brand'
          >
            관심 산업군을 추가하면 더 정확해져요
            <ArrowRight className='h-4 w-4 shrink-0' />
          </Link>
        )}

        <div className='mb-3 flex items-center justify-between'>
          <div className='flex items-center gap-1'>
            <p className='text-base font-semibold text-foreground'>보유 종목</p>
            <InfoTooltip
              text={
                '전날 종가 기준이에요.\nCHECK API를 활용해서 받아온 데이터에요.'
              }
            />
          </div>
          <span className='text-sm text-muted-foreground'>
            {portfolioStocks.length}개
          </span>
        </div>

        <div className='mb-2.5'>
          <PortfolioStockList
            stocks={portfolioStocks}
            isLoading={stocksLoading}
            error={stocksError instanceof Error ? stocksError.message : null}
            onRetry={() => refetchStocks()}
          />
        </div>

        <Link
          to='/settings/stocks'
          className='mb-8 flex items-center justify-center gap-1.5 rounded-2xl border border-dashed border-[#e5e8eb] py-3.5 text-sm font-medium text-muted-foreground'
        >
          <Plus className='h-4 w-4' />
          종목 추가하기
        </Link>

        <div className='mb-3 flex items-center justify-between'>
          <p className='text-base font-semibold text-foreground'>관심 산업군</p>
          <span className='text-sm text-muted-foreground'>
            {industries.length}개
          </span>
        </div>

        {industriesLoading ? (
          <div className='mb-2.5 flex flex-wrap gap-2'>
            {Array.from({ length: 4 }).map((_, i) => (
              <span
                key={i}
                className='h-9 w-20 animate-pulse rounded-full bg-muted/50'
              />
            ))}
          </div>
        ) : industriesError ? (
          <div className='mb-2.5 flex flex-col items-center gap-3 rounded-2xl bg-muted/50 py-8 text-center'>
            <p className='text-[13px] text-muted-foreground'>
              관심 산업군을 불러오지 못했어요
            </p>
            <button
              type='button'
              onClick={() => refetchIndustries()}
              className='rounded-full bg-background px-4 py-2 text-xs font-semibold text-foreground'
            >
              다시 시도
            </button>
          </div>
        ) : (
          industries.length > 0 && (
            <div className='mb-2.5 flex flex-wrap gap-2'>
              {industries.map((industry) => (
                <span
                  key={industry}
                  className='rounded-full bg-muted/50 px-3.5 py-2 text-sm font-medium text-foreground'
                >
                  {industry}
                </span>
              ))}
            </div>
          )
        )}

        <Link
          to='/settings/industries'
          className='flex items-center justify-center gap-1.5 rounded-2xl border border-dashed border-[#e5e8eb] py-3.5 text-sm font-medium text-muted-foreground'
        >
          <Plus className='h-4 w-4' />
          산업군 추가하기
        </Link>
      </div>

      <BottomNav />
    </div>
  )
}
