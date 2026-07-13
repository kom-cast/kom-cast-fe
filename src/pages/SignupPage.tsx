import { Link, useNavigate } from 'react-router-dom'

import AuthLayout from '@/components/auth/auth-layout'
import GoogleIcon from '@/components/icons/google-icon'
import KakaoIcon from '@/components/icons/kakao-icon'
import { Button } from '@/components/ui/button'

function SignupPage() {
  const navigate = useNavigate()

  function handleSocialSignup() {
    navigate('/onboarding')
  }

  return (
    <AuthLayout
      footer={
        <>
          이미 계정이 있으신가요?{' '}
          <Link
            to='/login'
            className='font-medium text-[#ec6d1e] underline underline-offset-4'
          >
            로그인
          </Link>
        </>
      }
    >
      <Button
        type='button'
        variant='outline'
        size='lg'
        className='h-12 w-full gap-2 text-base'
        onClick={handleSocialSignup}
      >
        <GoogleIcon className='h-5 w-5' />
        Google로 시작하기
      </Button>
      <Button
        type='button'
        size='lg'
        className='h-12 w-full gap-2 bg-[#FEE500] text-base text-black hover:bg-[#FCDA00]'
        onClick={handleSocialSignup}
      >
        <KakaoIcon className='h-5 w-5' />
        카카오로 시작하기
      </Button>
    </AuthLayout>
  )
}

export default SignupPage
