import { Bell, ChevronLeft, TrendingUp, Volume2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { cn } from '@/lib/utils'

const NOTIFICATIONS = [
  {
    Icon: Bell,
    title: '오늘의 브리핑이 준비됐어요',
    description: '오전 7:30 브리핑을 들어보세요',
    time: '방금 전',
    unread: true,
  },
  {
    Icon: TrendingUp,
    title: '삼성전자 +5% 급등',
    description: '보유종목 삼성전자가 급등했습니다',
    time: '1시간 전',
    unread: true,
  },
  {
    Icon: Volume2,
    title: '새로운 목소리가 추가됐어요',
    description: '마이페이지에서 새 목소리를 들어보세요',
    time: '어제',
    unread: false,
  },
  {
    Icon: Bell,
    title: '어제의 브리핑을 놓치셨어요',
    description: '보관함에서 다시 들어보세요',
    time: '2일 전',
    unread: false,
  },
]

function NotificationsPage() {
  const navigate = useNavigate()

  return (
    <div className='min-h-svh bg-background'>
      <div className='mx-auto w-full max-w-sm px-5 py-6'>
        <div className='mb-6 flex items-center gap-2'>
          <button
            type='button'
            onClick={() => navigate(-1)}
            aria-label='뒤로'
            className='-ml-2 flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted'
          >
            <ChevronLeft className='h-5 w-5' />
          </button>
          <h1 className='text-xl font-bold text-foreground'>알림</h1>
        </div>

        <div className='overflow-hidden rounded-2xl bg-muted/50'>
          {NOTIFICATIONS.map((item, i) => (
            <div
              key={item.title}
              className={cn(
                'flex items-start gap-3 px-4 py-3.5',
                i !== 0 && 'border-t border-background',
              )}
            >
              <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ec6d1e]/10 text-[#E85D00]'>
                <item.Icon className='h-5 w-5' />
              </span>
              <div className='min-w-0 flex-1'>
                <p className='text-sm font-medium text-foreground'>
                  {item.title}
                </p>
                <p className='text-sm text-muted-foreground'>
                  {item.description}
                </p>
                <p className='mt-0.5 text-xs text-muted-foreground/70'>
                  {item.time}
                </p>
              </div>
              {item.unread && (
                <span className='mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#ec6d1e]' />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default NotificationsPage
