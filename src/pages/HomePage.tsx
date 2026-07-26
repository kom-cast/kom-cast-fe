import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'

import { useOnboarding } from '@/context/onboarding-context'
import { usePlayer } from '@/context/player-context'
import { fetchBriefingHistory, getMyStocks } from '@/lib/api'
import {
  BriefingArrivalToast,
  GreetingHeader,
  MyStocksSection,
  RecentLibrarySection,
  TodayBriefingCard,
} from '@/components/home'
import { BottomNav } from '@/components/layout'

export function HomePage() {
  const { nickname } = useOnboarding()
  const { ensureBriefing } = usePlayer()

  const {
    data: myStocks = [],
    isLoading: myStocksLoading,
    error: myStocksError,
    refetch: refetchMyStocks,
  } = useQuery({
    queryKey: ['myStocks'],
    queryFn: getMyStocks,
  })

  const {
    data: recentBriefingsPage,
    isLoading: recentBriefingsLoading,
    error: recentBriefingsError,
    refetch: refetchRecentBriefings,
  } = useQuery({
    queryKey: ['briefingHistory', 'recent'],
    queryFn: () => fetchBriefingHistory(0, 2),
  })

  useEffect(() => {
    ensureBriefing()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const dateLabel = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })

  const recentBriefings = recentBriefingsPage?.content ?? []

  return (
    <div className='min-h-svh bg-background pb-40'>
      <BriefingArrivalToast />
      <div className='mx-auto w-full max-w-sm px-5 py-6'>
        <GreetingHeader nickname={nickname} dateLabel={dateLabel} />

        <TodayBriefingCard />

        <MyStocksSection
          stocks={myStocks}
          isLoading={myStocksLoading}
          error={myStocksError instanceof Error ? myStocksError.message : null}
          onRetry={() => refetchMyStocks()}
        />

        <RecentLibrarySection
          items={recentBriefings}
          isLoading={recentBriefingsLoading}
          error={
            recentBriefingsError instanceof Error
              ? recentBriefingsError.message
              : null
          }
          onRetry={() => refetchRecentBriefings()}
        />
      </div>

      <BottomNav />
    </div>
  )
}
