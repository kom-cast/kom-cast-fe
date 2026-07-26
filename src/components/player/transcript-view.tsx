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

  useEffect(() => {
    const container = containerRef.current
    const active = activeRef.current
    if (!container || !active) return

    const targetTop =
      active.offsetTop - container.clientHeight / 2 + active.clientHeight / 2
    return smoothScrollTo(container, Math.max(0, targetTop))
  }, [currentSegmentIndex])

  return (
    <div
      ref={containerRef}
      className='relative z-10 min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5 [&::-webkit-scrollbar]:hidden'
    >
      {groups.map((group, gi) => (
        <div key={gi} className='space-y-2.5'>
          <div className='flex items-center gap-2'>
            <span className='shrink-0 text-[11px] font-bold text-white/50'>
              {group.stock}
            </span>
            <span className='h-px flex-1 bg-white/10' />
          </div>
          <div className='space-y-3'>
            {group.items.map(({ segment, index }) => {
              const isActive = index === currentSegmentIndex
              return (
                <div
                  key={`${segment.startSec}-${index}`}
                  ref={isActive ? activeRef : undefined}
                >
                  <button
                    type='button'
                    onClick={(e) => {
                      e.stopPropagation()
                      onSeek(segment.startSec)
                    }}
                    className={cn(
                      'mb-1 ml-9 flex items-center gap-1.5 text-xs font-medium tabular-nums',
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
  )
}
