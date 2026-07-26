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

  return (
    <div className='relative z-10 min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5 [&::-webkit-scrollbar]:hidden'>
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
                <div key={`${segment.startSec}-${index}`}>
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
