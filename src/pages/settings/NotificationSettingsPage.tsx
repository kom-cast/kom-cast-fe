import { useOnboarding } from '@/context/onboarding-context'
import SettingsLayout from '@/components/settings/settings-layout'
import { Switch } from '@/components/ui/switch'

function NotificationSettingsPage() {
  const {
    notifyBriefing,
    setNotifyBriefing,
    notifyPriceAlert,
    setNotifyPriceAlert,
    notifyMarketing,
    setNotifyMarketing,
  } = useOnboarding()

  const rows = [
    {
      label: '브리핑 알림',
      description: '매일 아침 브리핑이 준비되면 알려드려요',
      checked: notifyBriefing,
      onCheckedChange: setNotifyBriefing,
    },
    {
      label: '급등락 알림',
      description: '보유종목이 크게 변동하면 알려드려요',
      checked: notifyPriceAlert,
      onCheckedChange: setNotifyPriceAlert,
    },
    {
      label: '마케팅 알림',
      description: '이벤트, 혜택 소식을 알려드려요',
      checked: notifyMarketing,
      onCheckedChange: setNotifyMarketing,
    },
  ]

  return (
    <SettingsLayout title='알림 설정'>
      <div className='overflow-hidden rounded-2xl bg-muted/50'>
        {rows.map((row, i) => (
          <div
            key={row.label}
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
              onCheckedChange={row.onCheckedChange}
              className='data-checked:bg-[#ec6d1e]'
            />
          </div>
        ))}
      </div>
    </SettingsLayout>
  )
}

export default NotificationSettingsPage
