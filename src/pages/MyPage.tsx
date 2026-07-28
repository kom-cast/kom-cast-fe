import { type ComponentType } from 'react'
import {
  Bell,
  ChevronRight,
  CreditCard,
  Database,
  Heart,
  Star,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import { useOnboarding } from '@/context/onboarding-context'
import { cn } from '@/lib/utils'
import { BottomNav } from '@/components/layout'

interface SettingRow {
  Icon: ComponentType<{ className?: string }>
  label: string
  to: string
}

const SETTING_ROWS: SettingRow[] = [
  { Icon: Heart, label: '보유종목 관리', to: '/settings/stocks' },
  { Icon: Star, label: '관심 산업군 관리', to: '/settings/industries' },
  { Icon: CreditCard, label: '구독 플랜 관리', to: '/settings/subscription' },
  { Icon: Bell, label: '알림 설정', to: '/settings/notifications' },
  { Icon: Database, label: '마이데이터 연동 상태', to: '/settings/mydata' },
]

export function MyPage() {
  const { nickname } = useOnboarding()

  return (
    <div className='min-h-svh bg-background pb-40 sm:min-h-full'>
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
      </div>

      <BottomNav />
    </div>
  )
}
