import SectorPicker from '@/components/onboarding/steps/sector-picker'
import SettingsLayout from '@/components/settings/settings-layout'

function SectorsSettingsPage() {
  return (
    <SettingsLayout title='관심분야 수정'>
      <SectorPicker />
    </SettingsLayout>
  )
}

export default SectorsSettingsPage
