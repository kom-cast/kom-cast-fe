import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  getNotificationSettings,
  updateNotificationSettings,
  type NotificationSettings,
} from '@/lib/api'
import { SettingsLayout } from '@/components/settings'
import { Switch } from '@/components/ui/switch'

export function NotificationSettingsPage() {
  const queryClient = useQueryClient()

  const {
    data: settings,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['notificationSettings'],
    queryFn: getNotificationSettings,
  })

  const updateMutation = useMutation({
    mutationFn: (payload: NotificationSettings) =>
      updateNotificationSettings(payload),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: ['notificationSettings'] })
      const previous = queryClient.getQueryData<NotificationSettings>([
        'notificationSettings',
      ])
      queryClient.setQueryData<NotificationSettings>(
        ['notificationSettings'],
        payload,
      )
      return { previous }
    },
    onError: (_err, _payload, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['notificationSettings'], context.previous)
      }
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ['notificationSettings'] }),
  })

  function toggle(key: keyof NotificationSettings, checked: boolean) {
    if (!settings) return
    updateMutation.mutate({ ...settings, [key]: checked })
  }

  if (isLoading) {
    return (
      <SettingsLayout title='알림 설정'>
        <div className='overflow-hidden rounded-2xl bg-muted/50'>
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className={
                'flex items-center gap-3 px-4 py-3.5' +
                (i !== 0 ? ' border-t border-background' : '')
              }
            >
              <div className='h-9 flex-1 animate-pulse rounded-full bg-background' />
            </div>
          ))}
        </div>
      </SettingsLayout>
    )
  }

  if (error || !settings) {
    return (
      <SettingsLayout title='알림 설정'>
        <div className='flex flex-col items-center gap-3 rounded-2xl bg-muted/50 py-8 text-center'>
          <p className='text-[13px] text-muted-foreground'>
            알림 설정을 불러오지 못했어요
          </p>
          <button
            type='button'
            onClick={() => refetch()}
            className='rounded-full bg-background px-4 py-2 text-xs font-semibold text-foreground'
          >
            다시 시도
          </button>
        </div>
      </SettingsLayout>
    )
  }

  const rows = [
    {
      key: 'notifyBriefing' as const,
      label: '브리핑 알림',
      description: '매일 아침 브리핑이 준비되면 알려드려요',
      checked: settings.notifyBriefing,
    },
    {
      key: 'notifyPriceAlert' as const,
      label: '급등락 알림',
      description: '보유종목이 크게 변동하면 알려드려요',
      checked: settings.notifyPriceAlert,
    },
    {
      key: 'notifyMarketing' as const,
      label: '마케팅 알림',
      description: '이벤트, 혜택 소식을 알려드려요',
      checked: settings.notifyMarketing,
    },
  ]

  return (
    <SettingsLayout title='알림 설정'>
      <div className='overflow-hidden rounded-2xl bg-muted/50'>
        {rows.map((row, i) => (
          <div
            key={row.key}
            className={
              'flex items-center gap-3 px-4 py-3.5' +
              (i !== 0 ? ' border-t border-background' : '')
            }
          >
            <div className='min-w-0 flex-1'>
              <p className='text-sm font-medium text-foreground'>{row.label}</p>
              <p className='text-sm text-muted-foreground'>{row.description}</p>
            </div>
            <Switch
              checked={row.checked}
              onCheckedChange={(checked) => toggle(row.key, checked)}
              className='data-checked:bg-brand'
            />
          </div>
        ))}
      </div>
    </SettingsLayout>
  )
}
