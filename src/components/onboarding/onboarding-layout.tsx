import { type ReactNode } from 'react'

export function OnboardingLayout({
  stepIndex,
  totalSteps,
  title,
  children,
  strip,
  actions,
}: {
  stepIndex: number
  totalSteps: number
  title: ReactNode
  children: ReactNode
  strip?: ReactNode
  actions: ReactNode
}) {
  const progress = ((stepIndex + 1) / totalSteps) * 100

  return (
    <div className='flex min-h-svh flex-col bg-white'>
      <div className='mx-auto flex min-h-svh w-full max-w-sm flex-1 flex-col'>
        <div className='shrink-0 px-5.5 pt-13 pb-3.5'>
          <div className='mb-5 flex items-center gap-2'>
            <div className='h-0.75 flex-1 overflow-hidden rounded-full bg-[#eef1f4]'>
              <div
                className='h-full rounded-full bg-brand transition-all duration-500 ease-out'
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className='font-mono text-[11px] text-[#8b95a1]'>
              {stepIndex + 1} / {totalSteps}
            </p>
          </div>

          <h1 className='text-[23px] leading-[1.3] font-extrabold tracking-tight text-[#191f28]'>
            {title}
          </h1>
        </div>

        <div className='min-h-0 flex-1 overflow-y-auto px-5.5 pt-1 pb-4 [&::-webkit-scrollbar]:hidden'>
          {children}
        </div>

        {strip}

        <div className='flex shrink-0 items-center gap-2.5 px-5.5 py-3.5 pb-7'>
          {actions}
        </div>
      </div>
    </div>
  )
}
