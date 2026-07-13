import BriefingTimePicker from '@/components/onboarding/steps/briefing-time-picker'
import SettingsLayout from '@/components/settings/settings-layout'

function BriefingTimeSettingsPage() {
  return (
    <SettingsLayout title='브리핑 시간 재설정'>
      <BriefingTimePicker />
    </SettingsLayout>
  )
}

export default BriefingTimeSettingsPage
