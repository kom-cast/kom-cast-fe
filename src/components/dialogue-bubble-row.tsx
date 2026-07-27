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

  // NOTE: word.endSec까지 확인하면 배속이 빠르거나 단어가 짧을 때
  // timeupdate 틱 사이로 그 단어의 구간 전체를 건너뛰어 하이라이트가 안 되는
  // 경우가 생김. 그래서 "지금까지 시작한 마지막 단어"를 활성 단어로 잡아서,
  // 한번 시작한 단어는 다음 단어가 시작하기 전까지 계속 하이라이트되게 함.
  const activeWordIndex = active
    ? segment.words.reduce(
        (acc, word, i) => (elapsed >= word.startSec ? i : acc),
        -1,
      )
    : -1

  return (
    <div
      className={cn(
        'flex items-start gap-2',
        !isKos && 'flex-row-reverse',
        !active && 'opacity-40',
      )}
    >
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
          'max-w-[85%] rounded-2xl px-3 py-2 font-semibold break-keep',
          isKos ? 'rounded-tl-lg' : 'rounded-tr-lg',
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
              i === activeWordIndex
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
