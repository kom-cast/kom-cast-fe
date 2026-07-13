import { Navigate, Route, Routes } from 'react-router-dom'

import { OnboardingProvider } from '@/context/onboarding-context'
import LoginPage from '@/pages/LoginPage'
import NotFoundPage from '@/pages/NotFoundPage'
import OnboardingFlow from '@/pages/OnboardingFlow'
import SignupPage from '@/pages/SignupPage'

function App() {
  return (
    <OnboardingProvider>
      <Routes>
        <Route path='/' element={<Navigate to='/login' replace />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/onboarding' element={<OnboardingFlow />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </OnboardingProvider>
  )
}

export default App
