import { type ComponentType } from 'react'
import {
  Bell,
  ChevronRight,
  Clock,
  CreditCard,
  Database,
  Heart,
  Mic,
  Shield,
  Star,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

import { useOnboarding } from '@/context/onboarding-context'
import { cn } from '@/lib/utils'
import BottomNav from '@/components/layout/bottom-nav'
import { Button } from '@/components/ui/button'

interface SettingRow {
  Icon: ComponentType<{ className?: string }>
  label: string
  to: string
}

const SETTING_ROWS: SettingRow[] = [
  { Icon: Heart, label: '관심/보유종목 관리', to: '/settings/stocks' },
  { Icon: Star, label: '관심분야 수정', to: '/settings/sectors' },
  { Icon: Mic, label: '목소리 재설정', to: '/settings/voice' },
  { Icon: Clock, label: '브리핑 시간 재설정', to: '/settings/briefing-time' },
  { Icon: Database, label: '마이데이터 연동 상태', to: '/settings/mydata' },
  { Icon: Bell, label: '알림 설정', to: '/settings/notifications' },
  { Icon: CreditCard, label: '구독 플랜 관리', to: '/settings/subscription' },
  { Icon: Shield, label: '개인정보 및 보안', to: '/settings/privacy' },
]

function MyPage() {
  const navigate = useNavigate()
  const { nickname, portfolio } = useOnboarding()

  return (
    <div className='min-h-svh bg-background pb-24'>
      <div className='mx-auto w-full max-w-sm px-5 py-6'>
        <h1 className='mb-6 text-xl font-bold text-foreground'>마이페이지</h1>

        <div className='mb-4 flex items-center gap-3 rounded-2xl bg-muted/50 p-4'>
          <span className='flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#ec6d1e] text-lg font-semibold text-white'>
            {nickname.slice(0, 1)}
          </span>
          <div className='min-w-0 flex-1'>
            <p className='truncate text-base font-semibold text-foreground'>
              {nickname}님
            </p>
            <p className='truncate text-sm text-muted-foreground'>
              {nickname}@komcast.app
            </p>
            <span className='mt-1 inline-block rounded-full bg-[#ec6d1e]/10 px-2 py-0.5 text-xs font-medium text-[#E85D00]'>
              프리미엄
            </span>
          </div>
        </div>

        <div className='mb-6 grid grid-cols-3 gap-2'>
          <div className='rounded-2xl bg-muted/50 py-4 text-center'>
            <p className='text-lg font-bold text-foreground'>47회</p>
            <p className='text-xs text-muted-foreground'>총 브리핑</p>
          </div>
          <div className='rounded-2xl bg-muted/50 py-4 text-center'>
            <p className='text-lg font-bold text-foreground'>
              {portfolio.length}개
            </p>
            <p className='text-xs text-muted-foreground'>보유종목</p>
          </div>
          <div className='rounded-2xl bg-muted/50 py-4 text-center'>
            <p className='text-lg font-bold text-foreground'>12일</p>
            <p className='text-xs text-muted-foreground'>연속청취</p>
          </div>
        </div>

        <p className='mb-2 px-1 text-sm font-medium text-foreground'>설정</p>
        <div className='mb-6 overflow-hidden rounded-2xl bg-muted/50'>
          {SETTING_ROWS.map((row, i) => (
            <Link
              key={row.label}
              to={row.to}
              className={cn(
                'flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-muted',
                i !== 0 && 'border-t border-background',
              )}
            >
              <span className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-background text-muted-foreground'>
                <row.Icon className='h-4 w-4' />
              </span>
              <span className='flex-1 text-sm text-foreground'>
                {row.label}
              </span>
              <ChevronRight className='h-4 w-4 text-muted-foreground' />
            </Link>
          ))}
        </div>

        <Button
          type='button'
          variant='secondary'
          className='h-12 w-full rounded-2xl text-sm font-semibold'
          onClick={() => navigate('/login')}
        >
          로그아웃
        </Button>
      </div>

      <BottomNav />
    </div>
  )
}

export default MyPage
