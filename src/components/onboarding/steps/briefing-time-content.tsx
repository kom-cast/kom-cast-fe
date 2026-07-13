import BriefingTimePicker from '@/components/onboarding/steps/briefing-time-picker'
import VoicePicker from '@/components/onboarding/steps/voice-picker'

function BriefingTimeContent() {
  return (
    <div className='space-y-7'>
      <BriefingTimePicker />
      <VoicePicker />
    </div>
  )
}

export default BriefingTimeContent
