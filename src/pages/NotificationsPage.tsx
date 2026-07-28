import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Bell,
  ChevronLeft,
  TrendingUp,
  Volume2,
  type LucideIcon,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  type RemoteNotification,
} from '@/lib/api'
import { cn } from '@/lib/utils'

// NOTE: 모르는 type은 DEFAULT_NOTIFICATION_STYLE로 대체
const NOTIFICATION_STYLES: Record<
  string,
  { icon: LucideIcon; className: string }
> = {
  BRIEFING: { icon: Bell, className: 'bg-[#ec6d1e]/10 text-[#E85D00]' },
  STOCK_ALERT: { icon: TrendingUp, className: 'bg-red-500/10 text-red-500' },
  VOICE_UPDATE: { icon: Volume2, className: 'bg-blue-500/10 text-blue-500' },
}

const DEFAULT_NOTIFICATION_STYLE = {
  icon: Bell,
  className: 'bg-[#ec6d1e]/10 text-[#E85D00]',
}

export function NotificationsPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const {
    data: notifications = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['notifications'],
    queryFn: getNotifications,
  })

  const hasUnread = notifications.some((n) => n.unread)

  // NOTE: 응답을 기다리지 않고 목록에 바로 반영(낙관적 업데이트)하고,
  // 실패하면 onError에서 원래 상태로 되돌림.
  const markReadMutation = useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] })
      const previous = queryClient.getQueryData<RemoteNotification[]>([
        'notifications',
      ])
      queryClient.setQueryData<RemoteNotification[]>(
        ['notifications'],
        (old = []) =>
          old.map((n) => (n.id === id ? { ...n, unread: false } : n)),
      )
      return { previous }
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['notifications'], context.previous)
      }
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  })

  const markAllReadMutation = useMutation({
    mutationFn: () => markAllNotificationsRead(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] })
      const previous = queryClient.getQueryData<RemoteNotification[]>([
        'notifications',
      ])
      queryClient.setQueryData<RemoteNotification[]>(
        ['notifications'],
        (old = []) => old.map((n) => ({ ...n, unread: false })),
      )
      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['notifications'], context.previous)
      }
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  })

  return (
    <div className='min-h-svh bg-background sm:min-h-full'>
      <div className='mx-auto w-full max-w-sm px-5 py-6'>
        <div className='mb-6 flex items-center justify-between gap-2'>
          <div className='flex items-center gap-2'>
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
          {hasUnread && (
            <button
              type='button'
              onClick={() => markAllReadMutation.mutate()}
              disabled={markAllReadMutation.isPending}
              className='text-sm font-medium text-muted-foreground disabled:opacity-50'
            >
              모두 읽음
            </button>
          )}
        </div>

        {isLoading ? (
          <div className='space-y-2'>
            {Array.from({ length: 4 }).map((_, i) => (
              <span
                key={i}
                className='block h-19 animate-pulse rounded-2xl bg-muted/50'
              />
            ))}
          </div>
        ) : error ? (
          <div className='flex flex-col items-center gap-3 rounded-2xl bg-muted/50 py-10 text-center'>
            <p className='text-[13px] text-muted-foreground'>
              알림을 불러오지 못했어요
            </p>
            <button
              type='button'
              onClick={() => refetch()}
              className='rounded-full bg-background px-4 py-2 text-xs font-semibold text-foreground'
            >
              다시 시도
            </button>
          </div>
        ) : notifications.length === 0 ? (
          <p className='py-10 text-center text-sm text-muted-foreground'>
            아직 알림이 없어요
          </p>
        ) : (
          <div className='overflow-hidden rounded-2xl bg-muted/50'>
            {notifications.map((item, i) => {
              const { icon: Icon, className: iconClassName } =
                NOTIFICATION_STYLES[item.type] ?? DEFAULT_NOTIFICATION_STYLE
              return (
                <button
                  key={item.id}
                  type='button'
                  onClick={() =>
                    item.unread && markReadMutation.mutate(item.id)
                  }
                  className={cn(
                    'flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors hover:bg-muted',
                    i !== 0 && 'border-t border-background',
                  )}
                >
                  <span
                    className={cn(
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
                      iconClassName,
                    )}
                  >
                    <Icon className='h-5 w-5' />
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
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
