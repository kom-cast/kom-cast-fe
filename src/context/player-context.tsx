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
import { MOCK_STOCKS, type Stock } from '@/data/stocks'
import {
  fetchBriefingById,
  fetchTodayBriefing,
  toBriefing,
  type Briefing,
  type BriefingSegment,
} from '@/lib/api'
import { formatDate } from '@/lib/format-time'
import { createMockBriefing } from '@/lib/mock-briefing'

export const TODAY_BRIEFING_ID = 'today'

// NOTE: 스위치. true면 오늘의 브리핑을 kom-cast-be(fetchTodayBriefing) 대신
// komcast-tts를 직접 호출하는 mock으로 받아옴. kom-cast-be가 아직 불안정할 때
// API 테스트용으로 켜둘 수 있게 남겨둠.
const USE_MOCK_TODAY_BRIEFING =
  import.meta.env.VITE_USE_MOCK_TODAY_BRIEFING === 'true'

// NOTE: 오늘의 브리핑이 도착했다는 토스트는 세션(탭)당 한 번만 보여줌.
const ARRIVAL_TOAST_SHOWN_KEY = 'komcast-today-briefing-toast-shown'
const ARRIVAL_TOAST_DURATION_MS = 3500

// NOTE: 임시 추정치. 백엔드가 "아직 생성 전"과 "생성됐지만 로딩 중"을 구분해서
// 안 주고 항상 뭔가(더미 포함) 즉시 내려주기 때문에, 프론트에서 실제로는 뭘 받았든
// 아침 6시 이전엔 무조건 "아직 준비 안 됨"으로 취급함. 백엔드가 생성 여부를 구분해서
// 내려주면 이 시간 추정 로직은 지우고 그 값을 쓰면 됨.
const BRIEFING_READY_HOUR = 6

// NOTE: <audio>.currentTime을 세그먼트의 startSec으로 정확히 seek해도 오디오
// 디코더가 그 근처(대개 살짝 이전)로 스냅하는 경우가 있어서(코덱 프레임 경계 등),
// elapsed가 목표 seg.startSec보다 아주 조금 작게 나올 수 있음. 그대로 등호 없는
// 비교를 하면 방금 seek한 세그먼트가 아니라 그 이전 세그먼트가 "현재"로 계산돼서
// 뱃지/구간 라벨을 눌러도 다른 구간이 활성화되는 것처럼 보임. 여유를 조금 둠.
const SEGMENT_SEEK_EPSILON_SEC = 0.03

const DEFAULT_MOCK_STOCK_0: Stock = MOCK_STOCKS[0]
const DEFAULT_MOCK_STOCK_1: Stock = MOCK_STOCKS[1]

function isBeforeBriefingReadyTime(): boolean {
  return new Date().getHours() < BRIEFING_READY_HOUR
}

interface PlayerContextValue {
  activeId: string | null
  dateLabel: string
  briefing: Briefing | null
  loadError: string | null
  elapsed: number
  isPlaying: boolean
  speed: number
  headline: string
  durationSeconds: number
  progress: number
  segments: BriefingSegment[]
  currentSegmentIndex: number
  hasStartedPlayback: boolean
  isTodayNotYetReady: boolean
  showArrivalToast: boolean
  audioRef: RefObject<HTMLAudioElement | null>
  ensureBriefing: (id?: string) => void
  retryLoad: () => void
  togglePlay: () => void
  seek: (seconds: number) => void
  setSpeed: (speed: number) => void
  dismissArrivalToast: () => void
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
  const [briefing, setBriefing] = useState<Briefing | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [hasStartedPlayback, setHasStartedPlayback] = useState(false)
  const [showArrivalToast, setShowArrivalToast] = useState(false)

  const stock0 = portfolioStocks[0] ?? DEFAULT_MOCK_STOCK_0
  const stock1 = portfolioStocks[1] ?? DEFAULT_MOCK_STOCK_1
  const stock2 = portfolioStocks[2]

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
        : fetchTodayBriefing().then(toBriefing)

      request
        .then((result) => {
          if (requestIdRef.current !== id) return
          setBriefing(result)
          if (sessionStorage.getItem(ARRIVAL_TOAST_SHOWN_KEY) !== 'true') {
            sessionStorage.setItem(ARRIVAL_TOAST_SHOWN_KEY, 'true')
            setShowArrivalToast(true)
          }
        })
        .catch((err: Error) => {
          if (requestIdRef.current !== id) return
          setLoadError(err.message)
        })
      return
    }

    // NOTE: 보관함 항목의 제목/날짜는 로컬에서 미리 알 수 없고 응답에 들어있어서,
    // 조회에 성공한 뒤에야 헤더에 반영함.
    fetchBriefingById(id)
      .then((remote) => {
        if (requestIdRef.current !== id) return
        setDateLabel(formatDate(remote.date))
        setBriefing(toBriefing(remote))
      })
      .catch((err: Error) => {
        if (requestIdRef.current !== id) return
        setLoadError(err.message)
      })
  }

  function ensureBriefing(id: string = TODAY_BRIEFING_ID) {
    if (activeId === id) return

    setActiveId(id)
    setDateLabel(todayDateLabel())
    fetchBriefing(id)
  }

  function retryLoad() {
    if (!activeId) return
    fetchBriefing(activeId)
  }

  function dismissArrivalToast() {
    setShowArrivalToast(false)
  }

  useEffect(() => {
    if (!showArrivalToast) return
    const timer = setTimeout(
      () => setShowArrivalToast(false),
      ARRIVAL_TOAST_DURATION_MS,
    )
    return () => clearTimeout(timer)
  }, [showArrivalToast])

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

  // NOTE: timeupdate 이벤트는 브라우저가 대략 초당 4번 정도로만 쏴줘서,
  // 배속이 빠르거나 단어 길이가 짧으면 두 틱 사이에 여러 단어의 시작 시각을
  // 한꺼번에 지나쳐버려 일부 단어가 하이라이트될 기회를 못 받음. 재생 중엔
  // requestAnimationFrame으로 훨씬 촘촘하게 elapsed를 갱신해서 이 문제를 줄임.
  useEffect(() => {
    if (!isPlaying) return
    const audio = audioRef.current
    if (!audio) return

    let frameId: number
    const tick = () => {
      setElapsed(audio.currentTime)
      frameId = requestAnimationFrame(tick)
    }
    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [isPlaying])

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

  const headline = '오늘의 증시 브리핑'

  const durationSeconds = briefing?.durationSec ?? 0
  const progress = durationSeconds > 0 ? elapsed / durationSeconds : 0
  const segments = useMemo(() => briefing?.segments ?? [], [briefing])
  const currentSegmentIndex = segments.reduce((acc, seg, i) => {
    return elapsed >= seg.startSec - SEGMENT_SEEK_EPSILON_SEC ? i : acc
  }, 0)

  const isTodayNotYetReady =
    activeId === TODAY_BRIEFING_ID && isBeforeBriefingReadyTime()

  const value: PlayerContextValue = {
    activeId,
    dateLabel,
    briefing,
    loadError,
    elapsed,
    isPlaying,
    speed,
    headline,
    durationSeconds,
    progress,
    segments,
    currentSegmentIndex,
    hasStartedPlayback,
    isTodayNotYetReady,
    showArrivalToast,
    audioRef,
    ensureBriefing,
    retryLoad,
    togglePlay,
    seek,
    setSpeed,
    dismissArrivalToast,
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
