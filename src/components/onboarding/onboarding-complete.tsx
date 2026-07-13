import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import AnimatedLogo from '@/components/icons/animated-logo'

function OnboardingComplete() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/home', { replace: true })
    }, 1800)
    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className='relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-4 py-10 sm:px-6'>
      <div
        aria-hidden
        className='pointer-events-none absolute left-1/2 top-0 h-105 w-105 -translate-x-1/2 -translate-y-1/3 rounded-full bg-[#ec6d1e]/20 blur-3xl'
      />
      <div className='relative flex flex-col items-center gap-4 text-center'>
        <AnimatedLogo className='h-16 w-16' />
        <p className='text-lg font-semibold text-foreground'>
          모든 준비가 끝났어요
        </p>
        <p className='text-sm text-muted-foreground'>
          내일 아침부터 나만의 브리핑을 들려드릴게요
        </p>
      </div>
    </div>
  )
}

export default OnboardingComplete
