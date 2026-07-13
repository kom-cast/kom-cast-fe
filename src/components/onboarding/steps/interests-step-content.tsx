import { useOnboarding } from '@/context/onboarding-context'
import { MOCK_STOCKS } from '@/data/stocks'
import SectorPicker from '@/components/onboarding/steps/sector-picker'
import StockSearchPicker from '@/components/onboarding/stock-search-picker'

function InterestsStepContent() {
  const { interests, setInterests } = useOnboarding()

  return (
    <div className='space-y-6'>
      <StockSearchPicker
        options={MOCK_STOCKS}
        selected={interests}
        onChange={setInterests}
        placeholder='예: 카카오'
      />
      <SectorPicker />
    </div>
  )
}

export default InterestsStepContent
