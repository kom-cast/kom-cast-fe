import { type BriefingSegment } from '@/lib/api'
import { cn } from '@/lib/utils'
import { KomiMascot, KosMascot } from '@/components/icons'

// NOTE: TTS 타임스탬프가 실제 오디오와 어긋나던 문제(komcast-tts 쪽 라인
// 이어붙이기 offset 누적)는 mixer.py에서 수정됨. 필요하면 다시 끌 수 있게
// 스위치는 남겨둠.
const WORD_HIGHLIGHT_ENABLED = true

// NOTE: 예전엔 mixer.py의 라인 앞부분 프라이밍 무음 문제를 프론트에서
// 임시로 가리려고 고정 지연을 뒀었는데, 그 문제 자체가 mixer.py에서
// 고쳐졌고(리딩 무음 제거) 세그먼트별 타이밍도 normalizeSegmentTimings에서
// 보정하고 있어서 지금은 이 고정값이 오히려 앞부분을 불필요하게 더
// 느리게 만듦. 필요해지면 이 값만 조정.
const HIGHLIGHT_OFFSET_SEC = 0

// NOTE: active면 단어 단위로 재생헤드 강조 + 탭 seek 지원
const LINE_CLAMP_CLASS = {
  1: 'line-clamp-1',
  2: 'line-clamp-2',
  3: 'line-clamp-3',
} as const

export function DialogueBubbleRow({
  segment,
  active,
  elapsed,
  onSeekWord,
  size = 'lg',
  lineClamp,
}: {
  segment: BriefingSegment
  active: boolean
  elapsed: number
  onSeekWord: (seconds: number) => void
  size?: 'sm' | 'lg'
  lineClamp?: 1 | 2 | 3
}) {
  const isKos = segment.speaker === '코스'

  // NOTE: word.endSec까지 확인하면 배속이 빠르거나 단어가 짧을 때
  // timeupdate 틱 사이로 그 단어의 구간 전체를 건너뛰어 하이라이트가 안 되는
  // 경우가 생김. 그래서 "지금까지 시작한 마지막 단어"를 활성 단어로 잡아서,
  // 한번 시작한 단어는 다음 단어가 시작하기 전까지 계속 하이라이트되게 함.
  const activeWordIndex =
    active && WORD_HIGHLIGHT_ENABLED
      ? segment.words.reduce(
          (acc, word, i) =>
            elapsed >= word.startSec + HIGHLIGHT_OFFSET_SEC ? i : acc,
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
          lineClamp && LINE_CLAMP_CLASS[lineClamp],
        )}
      >
        {segment.words.length > 0 ? (
          segment.words.map((word, i) => (
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
          ))
        ) : (
          // NOTE: 백엔드에 words(단어별 타이밍) 채워달라고 요청해둠. 아직 비어
          // 오는 세그먼트가 있을 수 있어 그 경우엔 단어 단위 하이라이트/탭 대신
          // 문장 전체를 그냥 보여주는 폴백을 유지함.
          <span className='px-0.5 text-white/85'>{segment.text}</span>
        )}
      </span>
    </div>
  )
}
