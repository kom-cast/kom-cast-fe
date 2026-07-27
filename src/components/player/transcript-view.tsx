import { useEffect, useRef } from 'react'

import { type BriefingSegment } from '@/lib/api'
import { formatTime } from '@/lib/format-time'
import { cn } from '@/lib/utils'
import { DialogueBubbleRow } from '@/components/dialogue-bubble-row'

function groupByStock(segments: BriefingSegment[]) {
  return segments.reduce<
    { stock: string; items: { segment: BriefingSegment; index: number }[] }[]
  >((groups, segment, index) => {
    const last = groups[groups.length - 1]
    if (last && last.stock === segment.stock) {
      last.items.push({ segment, index })
    } else {
      groups.push({ stock: segment.stock, items: [{ segment, index }] })
    }
    return groups
  }, [])
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2
}

// NOTE: scrollIntoView({ behavior: 'smooth' })는 브라우저마다 속도/이징이 달라
// 부드러운 정도를 맞출 수 없어서, 직접 duration/이징을 주는 스크롤 애니메이션을 사용함.
// 이전 애니메이션이 끝나기 전에 다시 호출되면(예: StrictMode의 effect 이중 실행,
// 짧은 세그먼트 연속 재생) 둘이 동시에 scrollTop을 덮어쓰며 버벅이므로 cancel 함수를
// 반환해 호출부에서 항상 이전 애니메이션을 취소하도록 함.
function smoothScrollTo(
  container: HTMLElement,
  targetTop: number,
  duration = 500,
) {
  const startTop = container.scrollTop
  const distance = targetTop - startTop
  let cancelled = false
  if (Math.abs(distance) < 1) return () => {}

  const startTime = performance.now()

  function step(now: number) {
    if (cancelled) return
    const progress = Math.min((now - startTime) / duration, 1)
    container.scrollTop = startTop + distance * easeInOutCubic(progress)
    if (progress < 1) requestAnimationFrame(step)
  }

  requestAnimationFrame(step)
  return () => {
    cancelled = true
  }
}

export function TranscriptView({
  segments,
  currentSegmentIndex,
  elapsed,
  onSeek,
}: {
  segments: BriefingSegment[]
  currentSegmentIndex: number
  elapsed: number
  onSeek: (seconds: number) => void
}) {
  const groups = groupByStock(segments)
  const containerRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef<HTMLDivElement>(null)

  // NOTE: 같은 종목이 대본 중간에 여러 번 등장할 수 있어서(예: 2차전지 얘기가
  // 두 번 나옴) 종목 칩은 이름 기준으로 한 번씩만, 탭하면 그 종목이 "처음"
  // 등장하는 위치로 이동함.
  const firstStartSecByStock = new Map<string, number>()
  for (const segment of segments) {
    if (!firstStartSecByStock.has(segment.stock)) {
      firstStartSecByStock.set(segment.stock, segment.startSec)
    }
  }
  const stocks = [...firstStartSecByStock.keys()]
  const activeStock = segments[currentSegmentIndex]?.stock

  useEffect(() => {
    const container = containerRef.current
    const active = activeRef.current
    if (!container || !active) return

    const targetTop =
      active.offsetTop - container.clientHeight / 2 + active.clientHeight / 2
    return smoothScrollTo(container, Math.max(0, targetTop))
  }, [currentSegmentIndex])

  return (
    <div className='relative z-10 flex min-h-0 flex-1 flex-col'>
      {stocks.length > 1 && (
        <div className='flex shrink-0 gap-1.5 overflow-x-auto px-5 pt-4 pb-2 [&::-webkit-scrollbar]:hidden'>
          {stocks.map((stock) => (
            <button
              key={stock}
              type='button'
              onClick={(e) => {
                e.stopPropagation()
                onSeek(firstStartSecByStock.get(stock) ?? 0)
              }}
              className={cn(
                'shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors',
                stock === activeStock
                  ? 'bg-brand text-white'
                  : 'bg-white/10 text-white/60 hover:bg-white/15',
              )}
            >
              {stock}
            </button>
          ))}
        </div>
      )}

      <div
        ref={containerRef}
        className='relative min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5 [&::-webkit-scrollbar]:hidden'
      >
        {groups.map((group, gi) => (
          <div key={gi} className='space-y-2.5'>
            <button
              type='button'
              onClick={(e) => {
                e.stopPropagation()
                onSeek(group.items[0].segment.startSec)
              }}
              className='flex w-full items-center gap-2 text-left'
            >
              <span className='shrink-0 text-[11px] font-bold text-white/50 hover:text-white/80'>
                {group.stock}
              </span>
              <span className='h-px flex-1 bg-white/10' />
            </button>
            <div className='space-y-3'>
              {group.items.map(({ segment, index }) => {
                const isActive = index === currentSegmentIndex
                const isKos = segment.speaker === '코스'
                return (
                  <div
                    key={`${segment.startSec}-${index}`}
                    ref={isActive ? activeRef : undefined}
                    className={cn(
                      'flex flex-col gap-1',
                      isKos ? 'items-start' : 'items-end',
                    )}
                  >
                    <button
                      type='button'
                      onClick={(e) => {
                        e.stopPropagation()
                        onSeek(segment.startSec)
                      }}
                      className={cn(
                        'flex items-center gap-1.5 text-xs font-medium tabular-nums',
                        isActive ? 'text-white/60' : 'text-white/25',
                      )}
                    >
                      <span className='font-semibold'>{segment.speaker}</span>
                      <span>{formatTime(segment.startSec)}</span>
                    </button>
                    <DialogueBubbleRow
                      segment={segment}
                      active={isActive}
                      elapsed={elapsed}
                      onSeekWord={onSeek}
                      size='sm'
                    />
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
