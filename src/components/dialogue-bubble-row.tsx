import { type BriefingSegment } from '@/lib/api'
import { cn } from '@/lib/utils'
import { KomiMascot, KosMascot } from '@/components/icons'

// NOTE: TTS 타임스탬프가 실제 오디오와 어긋나던 문제(komcast-tts 쪽 라인
// 이어붙이기 offset 누적)는 mixer.py에서 수정됨. 필요하면 다시 끌 수 있게
// 스위치는 남겨둠.
const WORD_HIGHLIGHT_ENABLED = true

// NOTE: TTS(Typecast) 라인 오디오 앞에 실제 무음이 0.3~0.5초 정도 붙어서
// 나오는데, tts-service(mixer.py)는 우리가 배포/수정할 수 없는 영역이라
// 프론트에서 고정 지연으로 흡수함. 문장 길이와 무관하게 매 라인마다
// 균일하게 어긋나는 것으로 확인됨(길어질수록 더 벌어지는 드리프트가
// 아님) - 그래서 세그먼트 내 위치를 늘리는 재보정(normalizeSegmentTimings)
// 대신 이 고정 오프셋 하나로 처리. 체감 어긋남이 바뀌면 이 값만 조정.
const HIGHLIGHT_OFFSET_SEC = 2

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
