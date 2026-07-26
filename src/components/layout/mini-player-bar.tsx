import { Pause, Play } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { usePlayer } from '@/context/player-context'
import { KomiMascot, KosMascot } from '@/components/icons'

export function MiniPlayerBar() {
  const navigate = useNavigate()
  const {
    activeId,
    briefing,
    hasStartedPlayback,
    isPlaying,
    headline,
    togglePlay,
  } = usePlayer()

  if (!briefing || !activeId || !hasStartedPlayback) return null

  return (
    <div className='flex items-center gap-3 bg-[#191f28] px-4 py-3'>
      <button
        type='button'
        onClick={() => navigate(`/player/${activeId}`)}
        className='flex min-w-0 flex-1 items-center gap-3 text-left'
      >
        <span className='flex h-10 w-14 mt-1 shrink-0 items-center justify-center overflow-hidden'>
          <KosMascot className='h-11 w-auto -translate-y-1 -scale-x-100' />
          <KomiMascot className='-ml-3 h-11 w-auto -translate-y-1' />
        </span>
        <span className='min-w-0 flex-1'>
          <span className='block truncate text-sm font-bold text-white'>
            {headline}
          </span>
          <span className='flex items-center gap-1 text-xs text-white/50'>
            <span
              aria-hidden='true'
              className='h-1.5 w-1.5 rounded-full bg-brand'
              style={{
                animation: isPlaying
                  ? 'live-pulse 1.4s ease-in-out infinite'
                  : undefined,
              }}
            />
            {isPlaying ? '재생 중' : '일시정지'}
          </span>
        </span>
      </button>

      <button
        type='button'
        aria-label={isPlaying ? '일시정지' : '재생'}
        onClick={togglePlay}
        className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#191f28]'
      >
        {isPlaying ? (
          <Pause className='h-4 w-4 fill-current' />
        ) : (
          <Play className='ml-0.5 h-4 w-4 fill-current' />
        )}
      </button>
    </div>
  )
}
