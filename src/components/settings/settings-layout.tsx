import { type ReactNode } from 'react'
import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function SettingsLayout({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  const navigate = useNavigate()

  return (
    <div className='min-h-svh bg-background sm:min-h-full'>
      <div className='mx-auto w-full max-w-sm px-5 py-6'>
        <div className='mb-6 flex items-center gap-2'>
          <button
            type='button'
            onClick={() => navigate(-1)}
            aria-label='뒤로'
            className='-ml-2 flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted'
          >
            <ChevronLeft className='h-5 w-5' />
          </button>
          <h1 className='text-xl font-bold text-foreground'>{title}</h1>
        </div>

        {children}
      </div>
    </div>
  )
}
