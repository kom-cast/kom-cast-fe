import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from 'react'

import { useOnboarding } from '@/context/onboarding-context'
import { MOCK_STOCKS } from '@/data/stocks'
import {
  fetchBriefingById,
  fetchTodayBriefing,
  type Briefing,
  type BriefingSegment,
} from '@/lib/api'
import { createMockBriefing } from '@/lib/mock-briefing'

export const TODAY_BRIEFING_ID = 'today'

// NOTE: 스위치. true면 오늘의 브리핑을 kom-cast-be(fetchTodayBriefing) 대신
// komcast-tts를 직접 호출하는 mock으로 받아옴. kom-cast-be가 아직 불안정할 때
// API 테스트용으로 켜둘 수 있게 남겨둠.
const USE_MOCK_TODAY_BRIEFING =
  import.meta.env.VITE_USE_MOCK_TODAY_BRIEFING === 'true'

interface PlayerContextValue {
  activeId: string | null
  dateLabel: string
  briefing: Briefing | null
  loadError: string | null
  elapsed: number
  isPlaying: boolean
  speed: number
  headline: string
  subtitle: string
  durationSeconds: number
  progress: number
  segments: BriefingSegment[]
  currentSegmentIndex: number
  hasStartedPlayback: boolean
  audioRef: RefObject<HTMLAudioElement | null>
  ensureBriefing: (id?: string) => void
  retryLoad: () => void
  togglePlay: () => void
  seek: (seconds: number) => void
  setSpeed: (speed: number) => void
}

const PlayerContext = createContext<PlayerContextValue | null>(null)

function todayDateLabel() {
  return new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })
}

export function PlayerProvider({ children }: { children: ReactNode }) {
  const { portfolio } = useOnboarding()
  const portfolioStocks = MOCK_STOCKS.filter((s) => portfolio.includes(s.name))

  const audioRef = useRef<HTMLAudioElement>(null)
  const requestIdRef = useRef<string | null>(null)

  const [activeId, setActiveId] = useState<string | null>(null)
  const [dateLabel, setDateLabel] = useState('')
  const [customHeadline, setCustomHeadline] = useState<string | null>(null)
  const [customSubtitle, setCustomSubtitle] = useState<string | null>(null)
  const [briefing, setBriefing] = useState<Briefing | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [hasStartedPlayback, setHasStartedPlayback] = useState(false)

  const stock0 = portfolioStocks[0]?.name ?? '삼성전자'
  const stock1 = portfolioStocks[1]?.name ?? 'SK하이닉스'
  const stock2 = portfolioStocks[2]?.name

  function fetchBriefing(id: string) {
    requestIdRef.current = id
    setBriefing(null)
    setLoadError(null)
    setElapsed(0)
    setIsPlaying(false)
    setHasStartedPlayback(false)

    if (id === TODAY_BRIEFING_ID) {
      const request = USE_MOCK_TODAY_BRIEFING
        ? createMockBriefing(id, stock0, stock1, stock2)
        : fetchTodayBriefing().then((remote) => ({
            audioUrl: remote.audioUrl,
            durationSec: remote.durationSeconds,
            segments: remote.segments,
          }))

      request
        .then((result) => {
          if (requestIdRef.current !== id) return
          setBriefing(result)
        })
        .catch((err: Error) => {
          if (requestIdRef.current !== id) return
          setLoadError(err.message)
        })
      return
    }

    // NOTE: 보관함 항목의 제목/날짜는 로컬에서 미리 알 수 없고 응답에 들어있어서,
    // 조회에 성공한 뒤에야 헤더에 반영함.
    const numericId = Number(id)
    if (Number.isNaN(numericId)) {
      setLoadError('브리핑을 찾을 수 없어요')
      return
    }

    fetchBriefingById(numericId)
      .then((remote) => {
        if (requestIdRef.current !== id) return
        setCustomHeadline(remote.headline)
        setCustomSubtitle(`${Math.round(remote.durationSeconds / 60)}분 브리핑`)
        setDateLabel(remote.date)
        setBriefing({
          audioUrl: remote.audioUrl,
          durationSec: remote.durationSeconds,
          segments: remote.segments,
        })
      })
      .catch((err: Error) => {
        if (requestIdRef.current !== id) return
        setLoadError(err.message)
      })
  }

  function ensureBriefing(id: string = TODAY_BRIEFING_ID) {
    if (activeId === id) return

    setActiveId(id)
    setCustomHeadline(null)
    setCustomSubtitle(null)
    setDateLabel(todayDateLabel())
    fetchBriefing(id)
  }

  function retryLoad() {
    if (!activeId) return
    fetchBriefing(activeId)
  }

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onTimeUpdate = () => setElapsed(audio.currentTime)
    const onPlay = () => {
      setIsPlaying(true)
      setHasStartedPlayback(true)
    }
    const onPause = () => setIsPlaying(false)
    const onEnded = () => setIsPlaying(false)

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('ended', onEnded)
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('ended', onEnded)
    }
  }, [briefing])

  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = speed
  }, [speed])

  function seek(seconds: number) {
    const audio = audioRef.current
    if (!audio || !briefing) return
    audio.currentTime = Math.min(Math.max(seconds, 0), briefing.durationSec)
    setElapsed(audio.currentTime)
  }

  function togglePlay() {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      audio.play()
    } else {
      audio.pause()
    }
  }

  const defaultHeadline =
    portfolioStocks.length > 0
      ? `${portfolioStocks
          .slice(0, 2)
          .map((s) => s.name)
          .join('·')} 실적 서프라이즈`
      : '오늘의 증시 브리핑'

  const defaultSubtitle =
    portfolioStocks.length > 0
      ? `2차전지 반등 · ${portfolioStocks[0].name} 외 ${Math.max(portfolioStocks.length - 1, 0)}개 종목`
      : '관심 종목을 등록하면 더 정확해져요'

  const headline = customHeadline ?? defaultHeadline
  const subtitle = customSubtitle ?? defaultSubtitle

  const durationSeconds = briefing?.durationSec ?? 0
  const progress = durationSeconds > 0 ? elapsed / durationSeconds : 0
  const segments = useMemo(() => briefing?.segments ?? [], [briefing])
  const currentSegmentIndex = segments.reduce((acc, seg, i) => {
    return elapsed >= seg.startSec ? i : acc
  }, 0)

  const value: PlayerContextValue = {
    activeId,
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
    segments,
    currentSegmentIndex,
    hasStartedPlayback,
    audioRef,
    ensureBriefing,
    retryLoad,
    togglePlay,
    seek,
    setSpeed,
  }

  return (
    <PlayerContext.Provider value={value}>
      {briefing && (
        <audio ref={audioRef} src={briefing.audioUrl} preload='auto' />
      )}
      {children}
    </PlayerContext.Provider>
  )
}

export function usePlayer() {
  const ctx = useContext(PlayerContext)
  if (!ctx) {
    throw new Error('usePlayer must be used within PlayerProvider')
  }
  return ctx
}
