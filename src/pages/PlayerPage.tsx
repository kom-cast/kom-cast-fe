import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { TODAY_BRIEFING_ID, usePlayer } from '@/context/player-context'
import { PlayerControls, PlayerHeader, PlayerHero } from '@/components/player'

export function PlayerPage() {
  const navigate = useNavigate()
  const { briefingId = TODAY_BRIEFING_ID } = useParams<{
    briefingId: string
  }>()
  const {
    dateLabel,
    briefing,
    loadError,
    elapsed,
    isPlaying,
    speed,
    headline,
    subtitle,
    durationSeconds,
    progress,
    currentSegmentIndex,
    isTodayNotYetReady,
    ensureBriefing,
    retryLoad,
    togglePlay,
    seek,
    setSpeed,
  } = usePlayer()
  const [showScript, setShowScript] = useState(true)

  const isHistorical = briefingId !== TODAY_BRIEFING_ID
  const notFound = isHistorical && loadError !== null

  useEffect(() => {
    ensureBriefing(briefingId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [briefingId])

  function toggleScript() {
    setShowScript((prev) => !prev)
  }

  return (
    <div className='h-svh bg-[#0b0d16]'>
      <div className='mx-auto flex h-svh w-full max-w-sm flex-col px-5 py-6 text-white'>
        <PlayerHeader
          dateLabel={dateLabel}
          isPlaying={isPlaying}
          showScript={showScript}
          onBack={() => navigate(-1)}
          onToggleScript={toggleScript}
        />

        <div className='flex min-h-0 flex-1 flex-col justify-center gap-6'>
          <PlayerHero
            briefing={briefing}
            loadError={loadError}
            notFound={notFound}
            showScript={showScript}
            isPlaying={isPlaying}
            currentSegmentIndex={currentSegmentIndex}
            elapsed={elapsed}
            isTodayNotYetReady={isTodayNotYetReady}
            onToggleScript={toggleScript}
            onRetry={retryLoad}
            onSeek={seek}
          />

          {briefing && !isTodayNotYetReady && (
            <div className='space-y-0.5'>
              <p className='text-base leading-snug font-bold break-keep'>
                {headline}
              </p>
              <p className='text-xs text-white/50'>{subtitle}</p>
            </div>
          )}
        </div>

        <PlayerControls
          elapsed={elapsed}
          durationSeconds={durationSeconds}
          progress={progress}
          isPlaying={isPlaying}
          speed={speed}
          disabled={!briefing || isTodayNotYetReady}
          onSeek={seek}
          onTogglePlay={togglePlay}
          onSetSpeed={setSpeed}
        />
      </div>
    </div>
  )
}
