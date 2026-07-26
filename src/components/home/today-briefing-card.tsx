import { Maximize2, Pause, Play } from 'lucide-react'
import { Link } from 'react-router-dom'

import { TODAY_BRIEFING_ID, usePlayer } from '@/context/player-context'
import { formatMinutesSeconds } from '@/lib/format-time'
import { DialogueBubbleRow } from '@/components/dialogue-bubble-row'
import { KomiMascot, KosMascot } from '@/components/icons'

export function TodayBriefingCard() {
  const {
    briefing,
    loadError,
    headline,
    subtitle,
    isPlaying,
    elapsed,
    durationSeconds,
    segments,
    currentSegmentIndex,
    retryLoad,
    togglePlay,
    seek,
  } = usePlayer()

  const previousSegment =
    currentSegmentIndex > 0 ? segments[currentSegmentIndex - 1] : undefined
  const currentSegment = segments[currentSegmentIndex]

  return (
    <div className='relative mb-8 flex h-80 flex-col overflow-hidden rounded-3xl bg-[#191f28] p-6 text-white'>
      <div
        aria-hidden
        className='pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-brand/25 blur-3xl'
      />

      <div className='absolute top-5 right-5 flex'>
        <KosMascot className='h-9 w-auto -scale-x-100' />
        <KomiMascot className='-ml-2.5 h-9 w-auto' />
      </div>

      <div className='relative pr-16'>
        <p className='text-lg leading-snug font-bold break-keep'>{headline}</p>
        <p className='mt-1 text-xs text-white/50'>{subtitle}</p>
      </div>

      <div className='relative flex min-h-0 flex-1 flex-col gap-4'>
        <div className='flex min-h-0 flex-1 flex-col justify-center'>
          {loadError ? (
            <div className='flex items-center justify-between gap-3 rounded-2xl bg-white/5 px-3.5 py-3'>
              <p className='text-xs text-white/50'>
                브리핑을 불러오지 못했어요
              </p>
              <button
                type='button'
                onClick={retryLoad}
                className='shrink-0 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold hover:bg-white/15'
              >
                다시 시도
              </button>
            </div>
          ) : !briefing ? (
            <div className='flex items-center gap-2.5 rounded-2xl bg-white/5 px-3.5 py-3'>
              <span
                aria-hidden='true'
                className='h-1.5 w-1.5 shrink-0 rounded-full bg-brand'
                style={{
                  animation: 'live-pulse 1.4s ease-in-out infinite',
                }}
              />
              <p className='text-xs text-white/50'>
                코스와 코미가 오늘 브리핑을 준비하고 있어요...
              </p>
            </div>
          ) : (
            currentSegment && (
              <div key={currentSegmentIndex} className='space-y-2'>
                {previousSegment && (
                  <DialogueBubbleRow
                    segment={previousSegment}
                    active={false}
                    elapsed={elapsed}
                    onSeekWord={seek}
                    size='sm'
                  />
                )}
                <div
                  className='opacity-0'
                  style={{ animation: 'fade-up 0.4s ease both' }}
                >
                  <DialogueBubbleRow
                    segment={currentSegment}
                    active
                    elapsed={elapsed}
                    onSeekWord={seek}
                    size='sm'
                  />
                </div>
              </div>
            )
          )}
        </div>

        {briefing && !loadError && (
          <div className='flex shrink-0 items-center gap-3'>
            <button
              type='button'
              onClick={togglePlay}
              aria-label={isPlaying ? '일시정지' : '재생'}
              className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand'
            >
              {isPlaying ? (
                <Pause className='h-4 w-4 fill-white text-white' />
              ) : (
                <Play className='ml-0.5 h-4 w-4 fill-white text-white' />
              )}
            </button>

            <div className='min-w-0 flex-1'>
              <span className='font-mono text-xs text-white/50'>
                총 {formatMinutesSeconds(durationSeconds)} 브리핑
              </span>
            </div>

            <Link
              to={`/player/${TODAY_BRIEFING_ID}`}
              aria-label='전체 화면으로 보기'
              className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/50 hover:bg-white/10 hover:text-white'
            >
              <Maximize2 className='h-4 w-4' />
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
