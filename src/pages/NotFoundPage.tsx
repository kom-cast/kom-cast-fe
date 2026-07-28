import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'

const LEFT_BARS = [10, 18, 12, 22]
const RIGHT_BARS = [22, 12, 18, 10]

export function NotFoundPage() {
  return (
    <div className='min-h-svh bg-background sm:min-h-full'>
      <div className='relative mx-auto flex min-h-svh w-full max-w-sm flex-col items-center justify-center overflow-hidden px-5 py-10 text-center sm:min-h-full'>
        <div
          aria-hidden
          className='pointer-events-none absolute left-1/2 top-0 h-105 w-105 -translate-x-1/2 -translate-y-1/3 rounded-full bg-brand/15 blur-3xl'
        />

        <div className='relative flex flex-col items-center gap-7'>
          <div className='flex items-center gap-2'>
            <div className='flex h-10 items-end gap-1'>
              {LEFT_BARS.map((h, i) => (
                <span
                  key={i}
                  style={{ height: `${h}px` }}
                  className='w-1.5 rounded-full bg-muted-foreground/25'
                />
              ))}
            </div>
            <span className='mx-1 h-1.5 w-1.5 rounded-full bg-brand' />
            <div className='flex h-10 items-end gap-1'>
              {RIGHT_BARS.map((h, i) => (
                <span
                  key={i}
                  style={{ height: `${h}px` }}
                  className='w-1.5 rounded-full bg-muted-foreground/25'
                />
              ))}
            </div>
          </div>

          <div className='space-y-3'>
            <p
              className='text-5xl font-bold tracking-tight text-brand'
              style={{ fontFamily: "'Space Grotesk Variable', sans-serif" }}
            >
              404
            </p>
            <div className='space-y-1.5'>
              <h1 className='text-xl font-bold tracking-tight text-[#191f28]'>
                페이지를 찾을 수 없어요
              </h1>
              <p className='text-sm text-[#8b95a1]'>
                요청하신 페이지가 존재하지 않거나 이동됐어요
              </p>
            </div>
          </div>

          <Button
            render={<Link to='/home' />}
            size='lg'
            className='h-12 rounded-2xl bg-[#191f28] px-6 text-base font-semibold text-white hover:bg-[#191f28]/90'
          >
            홈으로 돌아가기
          </Button>
        </div>
      </div>
    </div>
  )
}
