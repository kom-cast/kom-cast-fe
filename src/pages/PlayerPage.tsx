import { useEffect, useMemo, useState } from 'react'
import {
  ChevronLeft,
  FileText,
  Pause,
  Play,
  SkipBack,
  SkipForward,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { useOnboarding } from '@/context/onboarding-context'
import { MOCK_STOCKS } from '@/data/stocks'
import { cn } from '@/lib/utils'
import AnimatedLogo from '@/components/icons/animated-logo'

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5]
const WAVE_HEIGHTS = [
  10, 22, 14, 30, 18, 26, 12, 34, 20, 16, 28, 22, 12, 30, 18, 24, 14, 32, 20,
  16, 26, 12, 22, 18, 30, 14, 24, 20, 16, 28,
]

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60)
  const s = Math.floor(totalSeconds % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

const NUMBER_PATTERN = /^\d+(?:\.\d+)?(?:%|조원|억원|만원|원)$/

function PlayerPage() {
  const navigate = useNavigate()
  const { portfolio, briefingDuration } = useOnboarding()
  const portfolioStocks = MOCK_STOCKS.filter((s) => portfolio.includes(s.name))

  const durationSeconds = Number(briefingDuration) * 60
  const [elapsed, setElapsed] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [showScript, setShowScript] = useState(false)

  useEffect(() => {
    if (!isPlaying) return
    const timer = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + speed
        if (next >= durationSeconds) {
          setIsPlaying(false)
          return durationSeconds
        }
        return next
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [isPlaying, speed, durationSeconds])

  const progress = durationSeconds > 0 ? elapsed / durationSeconds : 0

  const headline =
    portfolioStocks.length > 0
      ? `${portfolioStocks
          .slice(0, 2)
          .map((s) => s.name)
          .join('·')} 실적 서프라이즈`
      : '오늘의 증시 브리핑'

  const subtitle =
    portfolioStocks.length > 0
      ? `2차전지 반등 · ${portfolioStocks[0].name} 외 ${Math.max(portfolioStocks.length - 1, 0)}개 종목`
      : '관심 종목을 등록하면 더 정확해져요'

  const stock0 = portfolioStocks[0]?.name ?? '삼성전자'
  const stock1 = portfolioStocks[1]?.name ?? 'SK하이닉스'
  const stock2 = portfolioStocks[2]?.name

  const segments = useMemo(
    () => [
      {
        fraction: 0,
        stock: stock0,
        text: `${stock0} 관련 주요 소식으로 오늘의 브리핑을 시작합니다.`,
      },
      {
        fraction: 0.18,
        stock: stock0,
        text: `${stock0}가 2분기 잠정 실적을 발표했습니다. 매출은 전년 동기 대비 23% 증가한 74조원을 기록했습니다.`,
      },
      {
        fraction: 0.4,
        stock: stock1,
        text: `${stock1}는 메모리 가격 상승에 힘입어 목표주가가 상향 조정됐습니다.`,
      },
      {
        fraction: 0.62,
        stock: '2차전지',
        text: '2차전지 섹터 전반이 반등하며 관련주들이 강세를 보이고 있습니다.',
      },
      {
        fraction: 0.85,
        stock: stock2 ?? '시장 전체',
        text: `${stock2 ?? '시장'} 관련 주요 이슈를 마지막으로 오늘의 브리핑을 마칩니다.`,
      },
    ],
    [stock0, stock1, stock2],
  )

  const currentSegmentIndex = segments.reduce((acc, seg, i) => {
    return progress >= seg.fraction ? i : acc
  }, 0)

  function segmentEnd(index: number) {
    return segments[index + 1]?.fraction ?? 1
  }

  const waveBars = useMemo(() => WAVE_HEIGHTS, [])

  function seek(fraction: number) {
    setElapsed(clamp(fraction * durationSeconds, 0, durationSeconds))
  }

  function clamp(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, value))
  }

  return (
    <div className='min-h-svh bg-[#0b0d16]'>
      <div className='mx-auto flex min-h-svh w-full max-w-sm flex-col px-5 py-6 text-white'>
        <div className='mb-6 flex items-center justify-between'>
          <button
            type='button'
            onClick={() => navigate(-1)}
            aria-label='뒤로'
            className='flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/15'
          >
            <ChevronLeft className='h-5 w-5' />
          </button>
          <div className='text-center'>
            <p className='text-sm font-semibold'>오늘의 브리핑</p>
            <p className='text-xs text-white/40'>
              {new Date().toLocaleDateString('ko-KR')}
            </p>
          </div>
          <button
            type='button'
            onClick={() => setShowScript((v) => !v)}
            aria-label='스크립트 보기'
            aria-pressed={showScript}
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/15',
              showScript ? 'bg-[#ec6d1e]' : 'bg-white/10',
            )}
          >
            <FileText className='h-5 w-5' />
          </button>
        </div>

        {showScript ? (
          <div className='flex-1 space-y-4 overflow-y-auto py-2'>
            {segments.map((segment, i) => {
              const isActive = i === currentSegmentIndex
              const end = segmentEnd(i)
              const words = segment.text.split(' ')
              return (
                <div key={segment.fraction} className='rounded-xl px-3 py-1'>
                  <button
                    type='button'
                    onClick={() => seek(segment.fraction)}
                    className={cn(
                      'mb-1 block text-xs font-medium tabular-nums',
                      isActive ? 'text-[#ec6d1e]' : 'text-white/30',
                    )}
                  >
                    {formatTime(segment.fraction * durationSeconds)} ·{' '}
                    {segment.stock}
                  </button>
                  <p
                    className={cn(
                      'text-base leading-snug',
                      isActive ? 'text-white' : 'text-white/35',
                    )}
                  >
                    {words.map((word, w) => {
                      const wordFraction =
                        segment.fraction +
                        (w / words.length) * (end - segment.fraction)
                      const isNumber = NUMBER_PATTERN.test(word)
                      return (
                        <button
                          key={w}
                          type='button'
                          onClick={() => seek(wordFraction)}
                          className={cn(
                            'mr-1 rounded px-0.5 hover:bg-white/10',
                            isActive ? 'font-semibold' : 'font-normal',
                            isNumber && 'font-semibold text-[#ec6d1e]',
                          )}
                        >
                          {word}
                        </button>
                      )
                    })}
                  </p>
                </div>
              )
            })}
          </div>
        ) : (
          <div className='flex flex-1 flex-col items-center justify-center gap-8 py-4'>
            <div className='relative flex h-64 w-64 items-center justify-center'>
              <div className='absolute inset-0 rounded-full border border-white/10' />
              <div className='absolute inset-4 rounded-full border border-white/10' />
              <div className='absolute inset-8 rounded-full border border-[#ec6d1e]/40' />
              <div className='flex h-40 w-40 items-center justify-center rounded-full bg-[#161a2c] shadow-[0_0_60px_rgba(236,109,30,0.28)]'>
                <AnimatedLogo className='h-16 w-16' />
              </div>
            </div>

            <div className='space-y-1.5 text-center'>
              <p className='text-xl font-bold'>{headline}</p>
              <p className='text-sm text-white/50'>{subtitle}</p>
            </div>

            <div className='flex h-8 w-full items-end justify-center gap-0.75'>
              {waveBars.map((h, i) => (
                <span
                  key={i}
                  style={{ height: `${h}px` }}
                  className={cn(
                    'w-0.75 rounded-full',
                    i / waveBars.length < progress
                      ? 'bg-[#ec6d1e]'
                      : 'bg-white/15',
                  )}
                />
              ))}
            </div>
          </div>
        )}

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
                seek((e.clientX - rect.left) / rect.width)
              }}
              className='h-1.5 w-full cursor-pointer rounded-full bg-white/15'
            >
              <div
                className='h-full rounded-full bg-[#ec6d1e]'
                style={{ width: `${progress * 100}%` }}
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
              onClick={() => seek(0)}
            >
              <SkipBack className='h-5 w-5' />
            </button>
            <button
              type='button'
              onClick={() =>
                setElapsed((e) => clamp(e - 15, 0, durationSeconds))
              }
              className='flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xs font-semibold hover:bg-white/15'
            >
              -15
            </button>
            <button
              type='button'
              onClick={() => setIsPlaying((p) => !p)}
              aria-label={isPlaying ? '일시정지' : '재생'}
              className='flex h-16 w-16 items-center justify-center rounded-full bg-[#ec6d1e] shadow-[0_0_30px_rgba(236,109,30,0.5)]'
            >
              {isPlaying ? (
                <Pause className='h-7 w-7 fill-white text-white' />
              ) : (
                <Play className='ml-0.5 h-7 w-7 fill-white text-white' />
              )}
            </button>
            <button
              type='button'
              onClick={() =>
                setElapsed((e) => clamp(e + 15, 0, durationSeconds))
              }
              className='flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xs font-semibold hover:bg-white/15'
            >
              +15
            </button>
            <button
              type='button'
              aria-label='끝으로'
              className='flex h-10 w-10 items-center justify-center text-white/60 hover:text-white'
              onClick={() => seek(1)}
            >
              <SkipForward className='h-5 w-5' />
            </button>
          </div>

          <div className='flex justify-center gap-2'>
            {SPEEDS.map((s) => (
              <button
                key={s}
                type='button'
                onClick={() => setSpeed(s)}
                className={cn(
                  'rounded-full px-3 py-1.5 text-xs font-semibold transition-colors',
                  speed === s
                    ? 'bg-[#ec6d1e] text-white'
                    : 'bg-white/10 text-white/60 hover:bg-white/15',
                )}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlayerPage
