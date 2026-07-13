import { Link, useNavigate } from 'react-router-dom'

import AuthLayout from '@/components/auth/auth-layout'
import GoogleIcon from '@/components/icons/google-icon'
import KakaoIcon from '@/components/icons/kakao-icon'
import { Button } from '@/components/ui/button'

function LoginPage() {
  const navigate = useNavigate()

  function handleSocialLogin() {
    navigate('/home')
  }

  return (
    <AuthLayout
      footer={
        <>
          계정이 없으신가요?{' '}
          <Link
            to='/signup'
            className='font-medium text-[#ec6d1e] underline underline-offset-4'
          >
            회원가입
          </Link>
        </>
      }
    >
      <Button
        type='button'
        variant='outline'
        size='lg'
        className='h-12 w-full gap-2 text-base'
        onClick={handleSocialLogin}
      >
        <GoogleIcon className='h-5 w-5' />
        Google로 시작하기
      </Button>
      <Button
        type='button'
        size='lg'
        className='h-12 w-full gap-2 bg-[#FEE500] text-base text-black hover:bg-[#FCDA00]'
        onClick={handleSocialLogin}
      >
        <KakaoIcon className='h-5 w-5' />
        카카오로 시작하기
      </Button>
    </AuthLayout>
  )
}

export default LoginPage
