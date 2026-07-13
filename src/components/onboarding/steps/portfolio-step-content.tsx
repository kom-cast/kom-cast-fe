import { useOnboarding } from '@/context/onboarding-context'
import { MOCK_STOCKS } from '@/data/stocks'
import StockSearchPicker from '@/components/onboarding/stock-search-picker'

function PortfolioStepContent() {
  const { portfolio, setPortfolio } = useOnboarding()

  return (
    <StockSearchPicker
      options={MOCK_STOCKS}
      selected={portfolio}
      onChange={setPortfolio}
      placeholder='예: 삼성전자'
    />
  )
}

export default PortfolioStepContent
