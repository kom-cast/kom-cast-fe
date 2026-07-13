import { ChevronDown, ChevronUp } from 'lucide-react'

import { useOnboarding } from '@/context/onboarding-context'
import { BRIEFING_DURATIONS } from '@/data/briefing'
import { cn } from '@/lib/utils'

function wrap(value: number, step: number, span: number) {
  return (((value + step) % span) + span) % span
}

function TimeDial({
  value,
  onChange,
  step,
  span,
}: {
  value: number
  onChange: (next: number) => void
  step: number
  span: number
}) {
  return (
    <div className='flex flex-col items-center gap-1'>
      <button
        type='button'
        onClick={() => onChange(wrap(value, step, span))}
        aria-label='증가'
        className='flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted'
      >
        <ChevronUp className='h-5 w-5' />
      </button>
      <span className='text-4xl font-bold tabular-nums text-foreground'>
        {String(value).padStart(2, '0')}
      </span>
      <button
        type='button'
        onClick={() => onChange(wrap(value, -step, span))}
        aria-label='감소'
        className='flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted'
      >
        <ChevronDown className='h-5 w-5' />
      </button>
    </div>
  )
}

function BriefingTimePicker() {
  const {
    briefingHour,
    setBriefingHour,
    briefingMinute,
    setBriefingMinute,
    briefingDuration,
    setBriefingDuration,
  } = useOnboarding()

  return (
    <div className='space-y-7'>
      <div className='space-y-2.5'>
        <p className='text-sm font-medium text-foreground'>브리핑 시간</p>
        <div className='flex items-center justify-center gap-4 rounded-2xl bg-muted/50 py-5'>
          <TimeDial
            value={briefingHour}
            onChange={setBriefingHour}
            step={1}
            span={24}
          />
          <span className='text-4xl font-bold text-muted-foreground'>:</span>
          <TimeDial
            value={briefingMinute}
            onChange={setBriefingMinute}
            step={30}
            span={60}
          />
        </div>
      </div>

      <div className='space-y-2.5'>
        <p className='text-sm font-medium text-foreground'>브리핑 분량</p>
        <div className='grid grid-cols-3 gap-2'>
          {BRIEFING_DURATIONS.map((duration) => {
            const isSelected = briefingDuration === duration
            return (
              <button
                key={duration}
                type='button'
                onClick={() => setBriefingDuration(duration)}
                className={cn(
                  'rounded-2xl py-3 text-sm font-semibold transition-colors',
                  isSelected
                    ? 'bg-[#ec6d1e] text-white'
                    : 'bg-muted text-foreground hover:bg-muted/70',
                )}
              >
                {duration}분
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default BriefingTimePicker
