import { Pause, Play, SkipBack, SkipForward } from 'lucide-react'

import { formatTime } from '@/lib/format-time'
import { cn } from '@/lib/utils'

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5]

export function PlayerControls({
  elapsed,
  durationSeconds,
  progress,
  isPlaying,
  speed,
  disabled,
  onSeek,
  onTogglePlay,
  onSetSpeed,
}: {
  elapsed: number
  durationSeconds: number
  progress: number
  isPlaying: boolean
  speed: number
  disabled: boolean
  onSeek: (seconds: number) => void
  onTogglePlay: () => void
  onSetSpeed: (speed: number) => void
}) {
  return (
    <div className='space-y-6 pt-4'>
      <div className='space-y-1.5'>
        <div
          role='slider'
          aria-label='재생 위치'
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
          tabIndex={0}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            onSeek(((e.clientX - rect.left) / rect.width) * durationSeconds)
          }}
          className='relative h-1.5 w-full cursor-pointer rounded-full bg-white/15'
        >
          <div
            className='h-full rounded-full bg-brand'
            style={{ width: `${progress * 100}%` }}
          />
          <span
            aria-hidden='true'
            className='absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-white shadow-[0_0_4px_rgba(0,0,0,0.4)]'
            style={{ left: `calc(${progress * 100}% - 6px)` }}
          />
        </div>
        <div className='flex justify-between text-xs text-white/40'>
          <span>{formatTime(elapsed)}</span>
          <span>{formatTime(durationSeconds)}</span>
        </div>
      </div>

      <div className='flex items-center justify-center gap-4'>
        <button
          type='button'
          aria-label='처음으로'
          className='flex h-10 w-10 items-center justify-center text-white/60 hover:text-white'
          onClick={() => onSeek(0)}
        >
          <SkipBack className='h-5 w-5' />
        </button>
        <button
          type='button'
          onClick={() => onSeek(elapsed - 15)}
          className='flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xs font-semibold hover:bg-white/15'
        >
          -15
        </button>
        <button
          type='button'
          onClick={onTogglePlay}
          disabled={disabled}
          aria-label={isPlaying ? '일시정지' : '재생'}
          className='flex h-16 w-16 items-center justify-center rounded-full bg-brand shadow-[0_0_30px_rgba(255,122,56,0.5)] disabled:opacity-40'
        >
          {isPlaying ? (
            <Pause className='h-7 w-7 fill-white text-white' />
          ) : (
            <Play className='ml-0.5 h-7 w-7 fill-white text-white' />
          )}
        </button>
        <button
          type='button'
          onClick={() => onSeek(elapsed + 15)}
          className='flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xs font-semibold hover:bg-white/15'
        >
          +15
        </button>
        <button
          type='button'
          aria-label='끝으로'
          className='flex h-10 w-10 items-center justify-center text-white/60 hover:text-white'
          onClick={() => onSeek(durationSeconds)}
        >
          <SkipForward className='h-5 w-5' />
        </button>
      </div>

      <div className='flex justify-center gap-2'>
        {SPEEDS.map((s) => (
          <button
            key={s}
            type='button'
            onClick={() => onSetSpeed(s)}
            className={cn(
              'rounded-full px-3 py-1.5 text-xs font-semibold transition-colors',
              speed === s
                ? 'bg-brand text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/15',
            )}
          >
            {s}x
          </button>
        ))}
      </div>
    </div>
  )
}
