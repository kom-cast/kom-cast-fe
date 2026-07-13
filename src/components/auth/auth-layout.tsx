import { type ReactNode } from 'react'

import AnimatedLogo from '@/components/icons/animated-logo'

function AuthLayout({
  children,
  footer,
}: {
  children: ReactNode
  footer: ReactNode
}) {
  return (
    <div className='relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-4 py-10 sm:px-6'>
      <div
        aria-hidden
        className='pointer-events-none absolute left-1/2 top-0 h-105 w-105 -translate-x-1/2 -translate-y-1/3 rounded-full bg-[#ec6d1e]/20 blur-3xl'
      />

      <div className='relative flex w-full max-w-sm flex-col items-center gap-10'>
        <div className='flex flex-col items-center gap-4 text-center mb-10'>
          <AnimatedLogo className='h-14 w-14' />
          <p
            className='text-2xl font-bold tracking-tight text-[#E85D00]'
            style={{ fontFamily: "'Space Grotesk Variable', sans-serif" }}
          >
            Komcast
          </p>
          <div className='space-y-1.5'>
            <h1 className='text-lg font-semibold text-foreground sm:text-xl'>
              내 종목만 골라 듣는 아침 브리핑
            </h1>
            <p className='text-sm text-muted-foreground'>
              보유종목과 관심종목 뉴스만, 원하는 관점으로 매일 아침 들려드려요
            </p>
          </div>
        </div>

        <div className='w-full space-y-3'>{children}</div>

        <p className='text-center text-sm text-muted-foreground'>{footer}</p>
      </div>
    </div>
  )
}

export default AuthLayout
