import { type ReactNode } from 'react'
import { ChevronLeft } from 'lucide-react'

function OnboardingLayout({
  stepIndex,
  totalSteps,
  title,
  description,
  onBack,
  children,
  actions,
}: {
  stepIndex: number
  totalSteps: number
  title: ReactNode
  description?: string
  onBack?: () => void
  children: ReactNode
  actions: ReactNode
}) {
  const progress = ((stepIndex + 1) / totalSteps) * 100

  return (
    <div className='flex min-h-svh flex-col bg-background'>
      <div className='h-1 w-full bg-muted'>
        <div
          className='h-full rounded-r-full bg-[#ec6d1e] transition-all duration-300 ease-out'
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className='mx-auto flex w-full max-w-sm flex-1 flex-col px-5 py-6'>
        <div className='mb-4 h-10'>
          {onBack && (
            <button
              type='button'
              onClick={onBack}
              aria-label='이전 단계'
              className='-ml-2 flex h-10 w-10 items-center justify-center rounded-full text-foreground hover:bg-muted'
            >
              <ChevronLeft className='h-6 w-6' />
            </button>
          )}
        </div>

        <div className='mb-8 space-y-2'>
          <p className='text-sm font-bold tracking-wide text-[#ec6d1e] uppercase'>
            Step {stepIndex + 1} / {totalSteps}
          </p>
          <h1 className='text-[28px] leading-tight font-extrabold tracking-tight text-foreground'>
            {title}
          </h1>
          {description && (
            <p className='text-base text-muted-foreground'>{description}</p>
          )}
        </div>

        <div className='flex-1'>{children}</div>

        <div className='mt-8 space-y-2 pb-2'>{actions}</div>
      </div>
    </div>
  )
}

export default OnboardingLayout
