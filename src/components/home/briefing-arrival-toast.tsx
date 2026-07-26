import { Volume2 } from 'lucide-react'

import { usePlayer } from '@/context/player-context'

export function BriefingArrivalToast() {
  const { showArrivalToast, dismissArrivalToast } = usePlayer()

  if (!showArrivalToast) return null

  return (
    <div className='pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-5'>
      <button
        type='button'
        onClick={dismissArrivalToast}
        className='pointer-events-auto flex items-center gap-2.5 rounded-full bg-[#191f28] py-3 pr-4 pl-3.5 text-white shadow-lg'
        style={{ animation: 'fade-up 0.35s ease both' }}
      >
        <span className='flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand/20 text-brand'>
          <Volume2 className='h-3.5 w-3.5' />
        </span>
        <span className='text-[13px] font-semibold whitespace-nowrap'>
          오늘의 브리핑이 도착했어요
        </span>
      </button>
    </div>
  )
}
