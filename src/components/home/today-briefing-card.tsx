import { AlertCircle, Maximize2, Pause, Play } from 'lucide-react'
import { Link } from 'react-router-dom'

import { TODAY_BRIEFING_ID, usePlayer } from '@/context/player-context'
import { formatMinutesSeconds } from '@/lib/format-time'
import { DialogueBubbleRow } from '@/components/dialogue-bubble-row'
import { KomiMascot, KosMascot } from '@/components/icons'
import { MascotBubble } from '@/components/mascot-bubble'

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
    isTodayNotYetReady,
    retryLoad,
    togglePlay,
    seek,
  } = usePlayer()

  const previousSegment =
    currentSegmentIndex > 0 ? segments[currentSegmentIndex - 1] : undefined
  const currentSegment = segments[currentSegmentIndex]

  if (isTodayNotYetReady) {
    return (
      <div className='relative mb-8 flex h-64 flex-col items-center justify-center gap-4 overflow-hidden rounded-3xl bg-[#191f28] px-6 text-center text-white'>
        <div
          aria-hidden
          className='pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-brand/25 blur-3xl'
        />
        <div className='relative flex items-end justify-center gap-3'>
          <MascotBubble
            mascot='kos'
            color='var(--brand)'
            text='조금만 기다려주세요'
            delaySeconds={0}
            flip
          />
          <MascotBubble
            mascot='komi'
            color='#3e9bff'
            text='준비하고 있어요!'
            delaySeconds={0.15}
          />
        </div>
        <p className='relative text-sm font-bold break-keep'>
          오늘의 브리핑은 아침 7시에 준비돼요
        </p>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className='relative mb-8 flex h-64 flex-col items-center justify-center gap-3 overflow-hidden rounded-3xl bg-[#191f28] px-6 text-center text-white'>
        <div
          aria-hidden
          className='pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-brand/25 blur-3xl'
        />
        <span className='relative flex h-12 w-12 items-center justify-center rounded-full bg-white/5'>
          <AlertCircle className='h-5 w-5 text-white/60' />
        </span>
        <p className='relative text-sm font-bold break-keep'>
          오늘의 브리핑을 불러오지 못했어요
        </p>
        <button
          type='button'
          onClick={retryLoad}
          className='relative rounded-full bg-white/10 px-4 py-2 text-xs font-semibold hover:bg-white/15'
        >
          다시 시도
        </button>
      </div>
    )
  }

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
          {!briefing ? (
            <div className='space-y-2' aria-label='브리핑 준비 중'>
              <div className='flex items-start gap-2'>
                <span className='h-7 w-7 shrink-0 animate-pulse rounded-full bg-white/10' />
                <span className='h-8 w-3/4 animate-pulse rounded-2xl rounded-tl-lg bg-white/10' />
              </div>
              <div className='flex items-start gap-2'>
                <span className='h-7 w-7 shrink-0 animate-pulse rounded-full bg-white/10' />
                <span className='h-8 w-1/2 animate-pulse rounded-2xl rounded-tl-lg bg-white/10' />
              </div>
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

        {briefing && (
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
