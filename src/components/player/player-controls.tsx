import { useState } from 'react'
import { ChevronUp, Pause, Play, SkipBack, SkipForward } from 'lucide-react'

import { formatTime } from '@/lib/format-time'
import { cn } from '@/lib/utils'

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2, 3]

// NOTE: 실제 오디오 진폭 데이터가 아니라 장식용 웨이브폼 패턴. 여러 개의 sine을
// 겹쳐서 매번 똑같이 재생성되는 자연스러운 굴곡을 만들고, 컴포넌트 밖에 상수로
// 둬서 렌더할 때마다 다시 계산하지 않게 함.
const WAVEFORM_BAR_COUNT = 56
const WAVEFORM_BAR_HEIGHTS = Array.from(
  { length: WAVEFORM_BAR_COUNT },
  (_, i) => {
    const wave =
      Math.sin(i * 0.5) * 0.45 +
      Math.sin(i * 1.3 + 1.5) * 0.3 +
      Math.sin(i * 0.17) * 0.25
    return 28 + ((wave + 1) / 2) * 72
  },
)

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
  const [isSpeedMenuOpen, setIsSpeedMenuOpen] = useState(false)

  return (
    <div className='space-y-3 pt-2'>
      <div className='space-y-1'>
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
          className='flex h-7 cursor-pointer items-end gap-0.75'
        >
          {WAVEFORM_BAR_HEIGHTS.map((h, i) => {
            const isPlayed = (i + 0.5) / WAVEFORM_BAR_COUNT <= progress
            return (
              <span
                key={i}
                className={cn(
                  'flex-1 rounded-full transition-colors',
                  isPlayed ? 'bg-brand' : 'bg-white/15',
                )}
                style={{ height: `${h}%` }}
              />
            )
          })}
        </div>
        <div className='flex items-center justify-between text-xs text-white/40'>
          <span>{formatTime(elapsed)}</span>

          <div className='flex items-center gap-1'>
            <span>{formatTime(durationSeconds)}</span>
            <div className='relative'>
              <button
                type='button'
                onClick={() => setIsSpeedMenuOpen((v) => !v)}
                aria-label='재생 속도'
                className='-my-1 flex items-center gap-0.5 rounded-full py-1 pr-1 pl-1.5 font-bold text-white/40 hover:text-white/70'
              >
                · {speed}×
                <ChevronUp
                  className={cn(
                    'h-3 w-3 transition-transform',
                    isSpeedMenuOpen && 'rotate-180',
                  )}
                />
              </button>

              {isSpeedMenuOpen && (
                <>
                  <button
                    type='button'
                    aria-label='닫기'
                    className='fixed inset-0 z-20 cursor-default'
                    onClick={() => setIsSpeedMenuOpen(false)}
                  />
                  <div className='absolute right-0 bottom-full z-30 mb-2 flex flex-col-reverse gap-0.5 rounded-2xl bg-[#20262f] p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.4)]'>
                    {SPEEDS.map((s) => (
                      <button
                        key={s}
                        type='button'
                        onClick={() => {
                          onSetSpeed(s)
                          setIsSpeedMenuOpen(false)
                        }}
                        className={cn(
                          'rounded-full px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-colors',
                          speed === s
                            ? 'bg-brand text-white'
                            : 'text-white/60 hover:bg-white/10 hover:text-white',
                        )}
                      >
                        {s}×
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className='flex items-center justify-center gap-3'>
        <button
          type='button'
          aria-label='처음으로'
          className='flex h-8 w-8 items-center justify-center text-white/50 hover:text-white'
          onClick={() => onSeek(0)}
        >
          <SkipBack className='h-4 w-4' />
        </button>
        <button
          type='button'
          onClick={() => onSeek(elapsed - 15)}
          className='text-sm font-bold text-white/50 hover:text-white'
        >
          -15
        </button>
        <button
          type='button'
          onClick={onTogglePlay}
          disabled={disabled}
          aria-label={isPlaying ? '일시정지' : '재생'}
          className='flex h-14 w-14 items-center justify-center rounded-full bg-brand shadow-[0_0_14px_rgba(255,122,56,0.35)] disabled:opacity-40'
        >
          {isPlaying ? (
            <Pause className='h-6 w-6 fill-white text-white' />
          ) : (
            <Play className='ml-0.5 h-6 w-6 fill-white text-white' />
          )}
        </button>
        <button
          type='button'
          onClick={() => onSeek(elapsed + 15)}
          className='text-sm font-bold text-white/50 hover:text-white'
        >
          +15
        </button>
        <button
          type='button'
          aria-label='끝으로'
          className='flex h-8 w-8 items-center justify-center text-white/50 hover:text-white'
          onClick={() => onSeek(durationSeconds)}
        >
          <SkipForward className='h-4 w-4' />
        </button>
      </div>
    </div>
  )
}
