import { type BriefingSegment } from '@/lib/api'
import { cn } from '@/lib/utils'
import { KomiMascot, KosMascot } from '@/components/icons'

// NOTE: active면 단어 단위로 재생헤드 강조 + 탭 seek 지원
export function DialogueBubbleRow({
  segment,
  active,
  elapsed,
  onSeekWord,
  size = 'lg',
}: {
  segment: BriefingSegment
  active: boolean
  elapsed: number
  onSeekWord: (seconds: number) => void
  size?: 'sm' | 'lg'
}) {
  const isKos = segment.speaker === '코스'

  return (
    <div className={cn('flex items-start gap-2', !active && 'opacity-40')}>
      {isKos ? (
        <KosMascot
          className={cn(
            size === 'lg' ? 'h-9' : 'h-7',
            'w-auto shrink-0 -scale-x-100',
          )}
        />
      ) : (
        <KomiMascot
          className={cn(size === 'lg' ? 'h-9' : 'h-7', 'w-auto shrink-0')}
        />
      )}
      <span
        className={cn(
          'max-w-[85%] rounded-2xl rounded-tl-lg px-3 py-2 font-semibold break-keep',
          size === 'lg' ? 'text-base leading-snug' : 'text-sm leading-snug',
          isKos ? 'bg-brand/20 text-white' : 'bg-[#3e9bff]/18 text-white',
        )}
      >
        {segment.words.map((word, i) => (
          <button
            key={i}
            type='button'
            onClick={(e) => {
              e.stopPropagation()
              onSeekWord(word.startSec)
            }}
            className={cn(
              'rounded px-0.5 hover:bg-white/10',
              elapsed >= word.startSec && elapsed < word.endSec
                ? isKos
                  ? 'text-brand'
                  : 'text-sky-300'
                : 'text-white/85',
            )}
          >
            {word.text}
          </button>
        ))}
      </span>
    </div>
  )
}
