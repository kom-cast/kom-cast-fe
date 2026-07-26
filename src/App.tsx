import { Route, Routes } from 'react-router-dom'

import { OnboardingProvider } from '@/context/onboarding-context'
import { PlayerProvider } from '@/context/player-context'
import LibraryPage from '@/pages/LibraryPage'
import MyPage from '@/pages/MyPage'
import NotificationsPage from '@/pages/NotificationsPage'
import BriefingTimeSettingsPage from '@/pages/settings/BriefingTimeSettingsPage'
import NotificationSettingsPage from '@/pages/settings/NotificationSettingsPage'
import SectorsSettingsPage from '@/pages/settings/SectorsSettingsPage'
import StocksSettingsPage from '@/pages/settings/StocksSettingsPage'
import StubSettingsPage from '@/pages/settings/StubSettingsPage'
import VoiceSettingsPage from '@/pages/settings/VoiceSettingsPage'
import {
  HomePage,
  IntroPage,
  NotFoundPage,
  OnboardingFlow,
  PlayerPage,
} from '@/pages'

function App() {
  return (
    <OnboardingProvider>
      <PlayerProvider>
        <Routes>
          <Route path='/' element={<IntroPage />} />
          <Route path='/onboarding' element={<OnboardingFlow />} />
          <Route path='/home' element={<HomePage />} />
          <Route path='/library' element={<LibraryPage />} />
          <Route path='/player/:briefingId' element={<PlayerPage />} />
          <Route path='/my' element={<MyPage />} />
          <Route path='/notifications' element={<NotificationsPage />} />
          <Route path='/settings/stocks' element={<StocksSettingsPage />} />
          <Route path='/settings/sectors' element={<SectorsSettingsPage />} />
          <Route path='/settings/voice' element={<VoiceSettingsPage />} />
          <Route
            path='/settings/briefing-time'
            element={<BriefingTimeSettingsPage />}
          />
          <Route
            path='/settings/notifications'
            element={<NotificationSettingsPage />}
          />
          <Route
            path='/settings/mydata'
            element={<StubSettingsPage title='마이데이터 연동 상태' />}
          />
          <Route
            path='/settings/subscription'
            element={<StubSettingsPage title='구독 플랜 관리' />}
          />
          <Route
            path='/settings/privacy'
            element={<StubSettingsPage title='개인정보 및 보안' />}
          />
          <Route path='*' element={<NotFoundPage />} />
        </Routes>
      </PlayerProvider>
    </OnboardingProvider>
  )
}

export default App
