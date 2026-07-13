import { Navigate, Route, Routes } from 'react-router-dom'

import { OnboardingProvider } from '@/context/onboarding-context'
import HomePage from '@/pages/HomePage'
import LibraryPage from '@/pages/LibraryPage'
import LoginPage from '@/pages/LoginPage'
import MyPage from '@/pages/MyPage'
import NotFoundPage from '@/pages/NotFoundPage'
import NotificationsPage from '@/pages/NotificationsPage'
import OnboardingFlow from '@/pages/OnboardingFlow'
import PlayerPage from '@/pages/PlayerPage'
import BriefingTimeSettingsPage from '@/pages/settings/BriefingTimeSettingsPage'
import NotificationSettingsPage from '@/pages/settings/NotificationSettingsPage'
import SectorsSettingsPage from '@/pages/settings/SectorsSettingsPage'
import StocksSettingsPage from '@/pages/settings/StocksSettingsPage'
import StubSettingsPage from '@/pages/settings/StubSettingsPage'
import VoiceSettingsPage from '@/pages/settings/VoiceSettingsPage'
import SignupPage from '@/pages/SignupPage'

function App() {
  return (
    <OnboardingProvider>
      <Routes>
        <Route path='/' element={<Navigate to='/login' replace />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/onboarding' element={<OnboardingFlow />} />
        <Route path='/home' element={<HomePage />} />
        <Route path='/library' element={<LibraryPage />} />
        <Route path='/player' element={<PlayerPage />} />
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
    </OnboardingProvider>
  )
}

export default App
