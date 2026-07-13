import { Navigate, Route, Routes } from 'react-router-dom'

import LoginPage from '@/pages/LoginPage'
import NotFoundPage from '@/pages/NotFoundPage'
import SignupPage from '@/pages/SignupPage'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Navigate to='/login' replace />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/signup' element={<SignupPage />} />
      <Route path='*' element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
