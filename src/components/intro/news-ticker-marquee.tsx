import { Marquee } from './marquee'

const HEADLINES = [
  { text: '삼성전자, 3분기 영업이익 컨센서스 상회', tag: '#f04452' },
  { text: 'SK하이닉스, HBM 공급 확대 발표', tag: 'var(--brand)' },
  { text: '2차전지주, 원자재 가격 안정에 강세', tag: '#f04452' },
  { text: '금통위, 기준금리 동결 발표', tag: '#3182f6' },
  { text: 'NAVER, AI 검색 기능 신규 출시', tag: 'var(--brand)' },
]

export function NewsTickerMarquee({
  durationSeconds = 46,
}: {
  durationSeconds?: number
}) {
  return (
    <Marquee durationSeconds={durationSeconds} direction='right'>
      {HEADLINES.map((headline) => (
        <span
          key={headline.text}
          className='flex shrink-0 items-center gap-2 rounded-xl bg-[#f4f6f8] px-3 py-2 text-[11.5px] font-semibold whitespace-nowrap text-[#333d4b]'
        >
          <span
            aria-hidden='true'
            className='h-1.5 w-1.5 shrink-0 rounded-full'
            style={{ backgroundColor: headline.tag }}
          />
          {headline.text}
        </span>
      ))}
    </Marquee>
  )
}
