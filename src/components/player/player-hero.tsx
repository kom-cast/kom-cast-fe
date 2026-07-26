import { useNavigate } from 'react-router-dom'

import { type Briefing } from '@/lib/api'
import { cn } from '@/lib/utils'
import { AnimatedLogo, KomiMascot, KosMascot } from '@/components/icons'
import { MascotBubble } from '@/components/mascot-bubble'

import { TranscriptView } from './transcript-view'

export function PlayerHero({
  briefing,
  loadError,
  notFound,
  showScript,
  isPlaying,
  currentSegmentIndex,
  elapsed,
  isTodayNotYetReady,
  onToggleScript,
  onRetry,
  onSeek,
}: {
  briefing: Briefing | null
  loadError: string | null
  notFound: boolean
  showScript: boolean
  isPlaying: boolean
  currentSegmentIndex: number
  elapsed: number
  isTodayNotYetReady: boolean
  onToggleScript: () => void
  onRetry: () => void
  onSeek: (seconds: number) => void
}) {
  const navigate = useNavigate()
  const isInteractive = briefing && !isTodayNotYetReady

  return (
    <div
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={() => isInteractive && onToggleScript()}
      onKeyDown={(e) => {
        if (isInteractive && (e.key === 'Enter' || e.key === ' ')) {
          onToggleScript()
        }
      }}
      aria-label={isInteractive ? '탭해서 대본 보기 전환' : undefined}
      className={cn(
        'relative flex max-h-95 flex-1 flex-col overflow-hidden rounded-3xl bg-[#191f28]',
        isInteractive && 'cursor-pointer',
      )}
    >
      <div
        aria-hidden
        className='pointer-events-none absolute -top-16 -right-10 h-56 w-56 rounded-full opacity-40 blur-3xl'
        style={{
          background: 'radial-gradient(circle, var(--brand), transparent 70%)',
        }}
      />

      {isTodayNotYetReady && (
        <div className='relative z-10 flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center'>
          <div className='flex items-end justify-center gap-3'>
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
          <p className='text-sm font-bold break-keep'>
            오늘의 브리핑은 아침 7시에 준비돼요
          </p>
        </div>
      )}

      {!isTodayNotYetReady && !briefing && !loadError && !notFound && (
        <div className='relative z-10 flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center text-white/60'>
          <AnimatedLogo className='h-12 w-12 animate-pulse' />
          <p className='text-sm'>코스와 코미가 브리핑을 준비하고 있어요...</p>
        </div>
      )}

      {!isTodayNotYetReady && loadError && !notFound && (
        <div className='relative z-10 flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center'>
          <p className='text-sm text-white/60'>브리핑을 불러오지 못했어요.</p>
          <button
            type='button'
            onClick={(e) => {
              e.stopPropagation()
              onRetry()
            }}
            className='rounded-full bg-brand px-4 py-2 text-sm font-semibold'
          >
            다시 시도
          </button>
        </div>
      )}

      {!isTodayNotYetReady && briefing && !showScript && (
        <div className='relative z-10 flex flex-1 flex-col items-center justify-center px-6'>
          <AnimatedLogo className='h-36 w-36' paused={!isPlaying} />

          <div className='mt-4 flex items-end gap-1'>
            <KosMascot className='h-16 w-auto -scale-x-100' />
            <KomiMascot className='h-16 w-auto' />
          </div>
          <p className='mt-2 text-xs font-medium text-white/50'>코스 & 코미</p>
        </div>
      )}

      {!isTodayNotYetReady && briefing && showScript && (
        <TranscriptView
          segments={briefing.segments}
          currentSegmentIndex={currentSegmentIndex}
          elapsed={elapsed}
          onSeek={onSeek}
        />
      )}

      {notFound && (
        <div className='relative z-10 flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center text-white/60'>
          <p className='text-sm'>브리핑을 찾을 수 없어요</p>
          <button
            type='button'
            onClick={(e) => {
              e.stopPropagation()
              navigate('/library')
            }}
            className='rounded-full bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/15'
          >
            보관함으로 이동
          </button>
        </div>
      )}
    </div>
  )
}
