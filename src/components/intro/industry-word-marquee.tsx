import { Marquee } from './marquee'

const WORDS = [
  '반도체',
  '2차전지',
  '바이오',
  'AI/플랫폼',
  '자동차',
  '금융',
  '에너지',
  '건설/인프라',
  '코스피',
  '코스닥',
]

export function IndustryWordMarquee({
  durationSeconds = 44,
}: {
  durationSeconds?: number
}) {
  return (
    <Marquee durationSeconds={durationSeconds} direction='left'>
      {WORDS.map((word, i) => (
        <span
          key={word}
          className={
            i % 3 === 0
              ? 'shrink-0 px-1 py-1.5 text-[12px] font-bold whitespace-nowrap text-[#191f28] dark:text-foreground'
              : 'shrink-0 px-1 py-1.5 text-[12px] font-bold whitespace-nowrap text-[#b0b8c1]'
          }
        >
          {word}
        </span>
      ))}
    </Marquee>
  )
}
