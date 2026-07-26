import { Bell, Play } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

import { useOnboarding } from '@/context/onboarding-context'
import { MOCK_STOCKS } from '@/data/stocks'
import { VOICES } from '@/data/voices'
import { cn } from '@/lib/utils'
import { AnimatedLogo } from '@/components/icons/animated-logo'
import BottomNav from '@/components/layout/bottom-nav'

function HomePage() {
  const navigate = useNavigate()
  const { nickname, skippedAny, portfolio, briefingDuration, voice } =
    useOnboarding()

  const portfolioStocks = MOCK_STOCKS.filter((s) => portfolio.includes(s.name))
  const voiceName = VOICES.find((v) => v.id === voice)?.name ?? VOICES[0].name
  const dateLabel = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })

  const headline =
    portfolioStocks.length > 0
      ? `${portfolioStocks
          .slice(0, 2)
          .map((s) => s.name)
          .join('·')} 브리핑이 도착했어요`
      : '오늘의 증시 브리핑이 도착했어요'

  const subtitle =
    portfolioStocks.length > 0
      ? `${portfolioStocks
          .slice(0, 3)
          .map((s) => s.name)
          .join('·')} 외 ${Math.max(portfolioStocks.length - 3, 0)}개 종목`
      : '관심 종목을 등록하면 더 정확해져요'

  return (
    <div className='min-h-svh bg-background pb-24'>
      <div className='mx-auto w-full max-w-sm px-5 py-6'>
        <div className='mb-6 flex items-center justify-between'>
          <div>
            <p className='text-xs text-muted-foreground'>{dateLabel}</p>
            <p className='text-xl font-bold text-foreground'>
              안녕하세요, {nickname}님
            </p>
          </div>
          <button
            type='button'
            aria-label='알림'
            onClick={() => navigate('/notifications')}
            className='relative flex h-10 w-10 items-center justify-center rounded-full bg-muted'
          >
            <Bell className='h-5 w-5 text-foreground' />
            <span className='absolute top-2.5 right-2.5 h-1.5 w-1.5 rounded-full bg-[#ec6d1e]' />
          </button>
        </div>

        {skippedAny && (
          <Link
            to='/onboarding'
            className='mb-4 block rounded-2xl bg-[#ec6d1e]/10 px-4 py-3 text-sm font-medium text-[#E85D00]'
          >
            필터를 완성하면 더 정확해져요 →
          </Link>
        )}

        <div className='relative mb-6 overflow-hidden rounded-3xl bg-[#12141c] p-5 text-white'>
          <div
            aria-hidden
            className='pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-[#ec6d1e]/30 blur-3xl'
          />

          <div className='relative space-y-3'>
            <div className='flex items-center gap-2'>
              <span className='inline-block rounded-full bg-[#ec6d1e] px-2.5 py-1 text-xs font-semibold text-white'>
                AI 브리핑
              </span>
              <span className='text-xs text-white/50'>
                {briefingDuration}분 브리핑
              </span>
            </div>

            <p className='text-lg leading-snug font-bold'>{headline}</p>
            <p className='text-sm text-white/50'>{subtitle}</p>

            <div className='flex items-center justify-between pt-1'>
              <Link to='/player' className='flex items-center gap-3'>
                <span className='flex h-11 w-11 items-center justify-center rounded-full bg-[#ec6d1e]'>
                  <Play className='h-5 w-5 fill-white text-white' />
                </span>
                <span className='text-left'>
                  <span className='block text-sm font-semibold'>지금 재생</span>
                  <span className='block text-xs text-white/50'>
                    목소리: {voiceName} · 1.0x
                  </span>
                </span>
              </Link>
              <AnimatedLogo className='h-8 w-8 opacity-80' />
            </div>
          </div>
        </div>

        <div className='mb-3 flex items-center justify-between'>
          <p className='text-base font-semibold text-foreground'>보유 종목</p>
          <span className='text-sm text-muted-foreground'>전체보기</span>
        </div>
        <div className='overflow-hidden rounded-2xl bg-muted/50'>
          {portfolioStocks.length === 0 && (
            <p className='px-4 py-6 text-center text-sm text-muted-foreground'>
              등록된 종목이 없어요
            </p>
          )}
          {portfolioStocks.map((stock, i) => (
            <div
              key={stock.name}
              className={cn(
                'flex items-center gap-3 px-4 py-3.5',
                i !== 0 && 'border-t border-background',
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
      </div>

      <BottomNav />
    </div>
  )
}

export default HomePage
