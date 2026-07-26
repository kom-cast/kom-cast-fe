import { useQuery } from '@tanstack/react-query'
import { Bell } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { getNotifications } from '@/lib/api'

export function GreetingHeader({
  nickname,
  dateLabel,
}: {
  nickname: string
  dateLabel: string
}) {
  const navigate = useNavigate()

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: getNotifications,
  })
  const hasUnread = notifications.some((n) => n.unread)

  return (
    <div className='mb-6 flex items-center justify-between gap-3'>
      <div className='min-w-0'>
        <p className='text-xs font-medium text-muted-foreground'>{dateLabel}</p>
        <p className='mt-0.5 text-[22px] leading-tight font-extrabold tracking-tight break-keep text-foreground'>
          {nickname}
          <span className='font-semibold text-muted-foreground'>
            님, 오늘도 좋은 하루 보내세요
          </span>
        </p>
      </div>
      <button
        type='button'
        aria-label='알림'
        onClick={() => navigate('/notifications')}
        className='relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted'
      >
        <Bell className='h-5 w-5 text-foreground' />
        {hasUnread && (
          <span className='absolute top-2.5 right-2.5 h-1.5 w-1.5 rounded-full bg-brand' />
        )}
      </button>
    </div>
  )
}
