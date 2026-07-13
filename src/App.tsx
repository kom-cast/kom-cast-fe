import { Navigate, Route, Routes } from 'react-router-dom'

import { OnboardingProvider } from '@/context/onboarding-context'
import HomePage from '@/pages/HomePage'
import LibraryPage from '@/pages/LibraryPage'
import LoginPage from '@/pages/LoginPage'
import MyPage from '@/pages/MyPage'
import NotFoundPage from '@/pages/NotFoundPage'
import OnboardingFlow from '@/pages/OnboardingFlow'
import PlayerPage from '@/pages/PlayerPage'
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
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </OnboardingProvider>
  )
}

export default App
