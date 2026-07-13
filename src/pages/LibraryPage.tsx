import { Play, Volume2 } from 'lucide-react'
import { Link } from 'react-router-dom'

import { cn } from '@/lib/utils'
import BottomNav from '@/components/layout/bottom-nav'

const SAVED_BRIEFINGS = [
  {
    date: '2025.07.11',
    headline: '삼성전자 실적 발표, 반도체 업황 개선',
    duration: '10',
  },
  {
    date: '2025.07.10',
    headline: '2차전지 섹터 반등, NAVER 신규 서비스 발표',
    duration: '10',
  },
  {
    date: '2025.07.09',
    headline: '금리 동결 소식, 금융주 강세',
    duration: '5',
  },
  {
    date: '2025.07.08',
    headline: '카카오 신사업 발표, 게임 섹터 조정',
    duration: '15',
  },
]

function LibraryPage() {
  return (
    <div className='min-h-svh bg-background pb-24'>
      <div className='mx-auto w-full max-w-sm px-5 py-6'>
        <div className='mb-6'>
          <h1 className='text-xl font-bold text-foreground'>보관함</h1>
          <p className='text-sm text-muted-foreground'>
            총 {SAVED_BRIEFINGS.length}개의 브리핑
          </p>
        </div>

        <div className='overflow-hidden rounded-2xl bg-muted/50'>
          {SAVED_BRIEFINGS.map((item, i) => (
            <Link
              key={item.date}
              to='/player'
              className={cn(
                'flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-muted',
                i !== 0 && 'border-t border-background',
              )}
            >
              <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-background text-muted-foreground'>
                <Volume2 className='h-4 w-4' />
              </span>
              <div className='min-w-0 flex-1'>
                <p className='text-xs text-muted-foreground'>{item.date}</p>
                <p className='truncate text-sm font-medium text-foreground'>
                  {item.headline}
                </p>
                <p className='text-xs text-muted-foreground'>
                  {item.duration}분 브리핑
                </p>
              </div>
              <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ec6d1e]/10 text-[#E85D00]'>
                <Play className='h-4 w-4 fill-current' />
              </span>
            </Link>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}

export default LibraryPage
