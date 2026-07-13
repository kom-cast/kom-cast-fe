import { useOnboarding } from '@/context/onboarding-context'
import { MOCK_STOCKS } from '@/data/stocks'
import StockSearchPicker from '@/components/onboarding/stock-search-picker'
import SettingsLayout from '@/components/settings/settings-layout'

function StocksSettingsPage() {
  const { portfolio, setPortfolio, interests, setInterests } = useOnboarding()

  return (
    <SettingsLayout title='관심/보유종목 관리'>
      <div className='space-y-8'>
        <div className='space-y-2.5'>
          <p className='text-sm font-medium text-foreground'>보유종목</p>
          <StockSearchPicker
            options={MOCK_STOCKS}
            selected={portfolio}
            onChange={setPortfolio}
            placeholder='예: 삼성전자'
          />
        </div>
        <div className='space-y-2.5'>
          <p className='text-sm font-medium text-foreground'>관심종목</p>
          <StockSearchPicker
            options={MOCK_STOCKS}
            selected={interests}
            onChange={setInterests}
            placeholder='예: 카카오'
          />
        </div>
      </div>
    </SettingsLayout>
  )
}

export default StocksSettingsPage
