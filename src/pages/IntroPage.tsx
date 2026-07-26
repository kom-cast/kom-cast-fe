import { ArrowRight, Info } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { AnimatedLogo } from '@/components/icons'
import {
  BriefingPreviewCard,
  IndustryWordMarquee,
  NewsTickerMarquee,
  StockTickerMarquee,
} from '@/components/intro'
import { Button } from '@/components/ui/button'

export function IntroPage() {
  const navigate = useNavigate()

  function handleStart() {
    navigate('/onboarding')
  }

  return (
    <div className='flex min-h-svh items-center justify-center overflow-x-hidden bg-background'>
      <div className='flex min-h-[min(100svh,800px)] w-full max-w-sm flex-col py-10'>
        <div className='space-y-3 px-4 sm:px-6'>
          <div className='flex items-center gap-1.5'>
            <AnimatedLogo className='h-6 w-6' />
            <span
              className='text-sm font-bold tracking-tight text-brand'
              style={{ fontFamily: "'Space Grotesk Variable', sans-serif" }}
            >
              Komcast
            </span>
          </div>

          <h1 className='text-[32px] leading-[1.22] font-extrabold tracking-tight text-[#191f28] dark:text-foreground'>
            내 종목만 듣는
            <br />
            <span className='text-brand'>팟캐스트, Komcast</span>
          </h1>

          <p className='break-keep text-[15px] leading-[1.55] font-medium text-[#8b95a1]'>
            보유종목과 관심산업군만 고르면
            <br />
            관련 뉴스와 공시를 매일 아침 브리핑으로 들려드려요
          </p>
        </div>

        <div className='my-6 flex flex-1 flex-col justify-center gap-2.5'>
          <div className='origin-left scale-[0.94] space-y-2.5 opacity-70'>
            <StockTickerMarquee />
            <NewsTickerMarquee />
            <IndustryWordMarquee />
          </div>
        </div>

        <div className='space-y-4 px-4 sm:px-6'>
          <BriefingPreviewCard />

          <div className='space-y-2'>
            <Button
              type='button'
              size='lg'
              className='group h-14 w-full gap-2 rounded-2xl bg-[#191f28] text-base text-white shadow-none hover:bg-[#191f28]/90'
              onClick={handleStart}
            >
              종목 고르고 시작하기
              <ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-0.5' />
            </Button>

            <p className='flex items-center justify-center gap-1 pt-1 pb-2 text-center text-xs font-medium text-[#b0b8c1]'>
              <Info className='h-3 w-3 shrink-0' />
              <span className='leading-none'>
                매일 아침 7시에 브리핑이 도착해요
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
