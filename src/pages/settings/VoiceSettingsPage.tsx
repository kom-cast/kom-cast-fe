import VoicePicker from '@/components/onboarding/steps/voice-picker'
import SettingsLayout from '@/components/settings/settings-layout'

function VoiceSettingsPage() {
  return (
    <SettingsLayout title='목소리 재설정'>
      <VoicePicker />
    </SettingsLayout>
  )
}

export default VoiceSettingsPage
