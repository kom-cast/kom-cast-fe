import { Route, Routes } from 'react-router-dom'

import { OnboardingProvider } from '@/context/onboarding-context'
import { PlayerProvider } from '@/context/player-context'
import { DeviceFrame } from '@/components/device-frame'
import {
  HomePage,
  IndustriesSettingsPage,
  IntroPage,
  LibraryPage,
  MyDataSettingsPage,
  MyPage,
  MyStocksPage,
  NotFoundPage,
  NotificationSettingsPage,
  NotificationsPage,
  OnboardingFlow,
  OnboardingMyDataPreviewPage,
  OnboardingStartPage,
  PlayerPage,
  StocksSettingsPage,
  StubSettingsPage,
} from '@/pages'

function App() {
  return (
    <OnboardingProvider>
      <PlayerProvider>
        <DeviceFrame>
          <Routes>
            <Route path='/' element={<IntroPage />} />
            <Route path='/onboarding/start' element={<OnboardingStartPage />} />
            <Route
              path='/onboarding/mydata'
              element={<OnboardingMyDataPreviewPage />}
            />
            <Route path='/onboarding' element={<OnboardingFlow />} />
            <Route path='/home' element={<HomePage />} />
            <Route path='/library' element={<LibraryPage />} />
            <Route path='/portfolio' element={<MyStocksPage />} />
            <Route path='/player/:briefingId' element={<PlayerPage />} />
            <Route path='/my' element={<MyPage />} />
            <Route path='/notifications' element={<NotificationsPage />} />
            <Route path='/settings/stocks' element={<StocksSettingsPage />} />
            <Route
              path='/settings/industries'
              element={<IndustriesSettingsPage />}
            />
            <Route
              path='/settings/subscription'
              element={<StubSettingsPage title='구독 플랜 관리' />}
            />
            <Route
              path='/settings/notifications'
              element={<NotificationSettingsPage />}
            />
            <Route path='/settings/mydata' element={<MyDataSettingsPage />} />
            <Route path='*' element={<NotFoundPage />} />
          </Routes>
        </DeviceFrame>
      </PlayerProvider>
    </OnboardingProvider>
  )
}

export default App
