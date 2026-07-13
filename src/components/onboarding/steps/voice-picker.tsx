import { Check, Mic } from 'lucide-react'

import { useOnboarding } from '@/context/onboarding-context'
import { VOICES } from '@/data/voices'
import { cn } from '@/lib/utils'

function VoicePicker() {
  const { voice, setVoice } = useOnboarding()

  return (
    <div className='space-y-2.5'>
      <p className='text-sm font-medium text-foreground'>목소리 선택</p>
      <div className='grid grid-cols-2 gap-3'>
        {VOICES.map((v) => {
          const isSelected = voice === v.id
          return (
            <button
              key={v.id}
              type='button'
              onClick={() => setVoice(v.id)}
              className={cn(
                'relative flex flex-col items-start gap-2 rounded-2xl border-2 p-3.5 text-left transition-colors',
                isSelected
                  ? 'border-[#ec6d1e] bg-[#ec6d1e]/5'
                  : 'border-transparent bg-muted/50 hover:bg-muted',
              )}
            >
              {isSelected && (
                <span className='absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#ec6d1e] text-white'>
                  <Check className='h-3 w-3' strokeWidth={3} />
                </span>
              )}
              <span className='flex h-9 w-9 items-center justify-center rounded-full bg-background text-muted-foreground'>
                <Mic className='h-4 w-4' />
              </span>
              <span className='text-sm font-semibold text-foreground'>
                {v.name}
              </span>
              <span className='text-xs text-muted-foreground'>
                {v.description}
              </span>
              <span className='text-xs font-medium text-[#E85D00]'>
                미리듣기
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default VoicePicker
