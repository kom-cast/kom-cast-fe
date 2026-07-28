import { Podcast, Sparkles } from 'lucide-react'

// NOTE: 실제 마이데이터 연동은 아직 없음. 연동하면 어떤 걸 보여줄 수 있는지 미리
// 보여주는 홍보용 목업 화면 — 데이터는 전부 가짜고 실제 API 호출/동의 처리 없음.

// 자산 구성(주식/채권/예금/파생) 비율 — 원형 차트용. dataviz 팔레트에서
// 어두운 배경(#191f28)에 검증된 색만 골라 씀.
const ASSET_MIX = [
  { name: '주식', pct: 65, color: '#3987E5' },
  { name: '채권', pct: 20, color: '#199E70' },
  { name: '예금', pct: 10, color: '#C98500' },
  { name: '파생', pct: 5, color: '#9085E9' },
]

// 도넛 차트: SVG stroke-dashoffset을 0으로 애니메이션(donut-draw, index.css)
// 시켜서 링이 그려지는 느낌을 줌. rotation은 각 구간을 12시 방향부터
// 시계방향으로 이어붙이기 위한 값(conic-gradient의 기본 시작각과 동일).
const DONUT_RADIUS = 40
const DONUT_STROKE_WIDTH = 15
const DONUT_CIRCUMFERENCE = 2 * Math.PI * DONUT_RADIUS

function buildDonutSegments() {
  let cursorDeg = 0
  return ASSET_MIX.map((asset) => {
    const length = (asset.pct / 100) * DONUT_CIRCUMFERENCE
    const rotation = cursorDeg - 90
    cursorDeg += asset.pct * 3.6
    return { ...asset, length, rotation }
  })
}

// 보유 종목 리스트 — 아바타 이니셜/색, 수량, 평가금액, 손익(+빨강/-파랑, 국내
// 증권 앱 관례)까지 실제 서비스 느낌으로.
const MOCK_STOCK_HOLDINGS = [
  {
    name: '삼성전자',
    initial: '삼',
    color: '#1428A0',
    qty: 12,
    amount: 891600,
    change: 72200,
    changePct: 8.8,
  },
  {
    name: 'SK하이닉스',
    initial: 'SK',
    color: '#EE3524',
    qty: 3,
    amount: 567000,
    change: -12110,
    changePct: -2.1,
  },
  {
    name: '카카오',
    initial: '카',
    color: '#3C1E1E',
    qty: 8,
    amount: 410400,
    change: 3500,
    changePct: 0.9,
  },
  {
    name: 'NAVER',
    initial: 'N',
    color: '#03C75A',
    qty: 2,
    amount: 425000,
    change: 17700,
    changePct: 4.3,
  },
  {
    name: '현대차',
    initial: '현',
    color: '#0A3161',
    qty: 4,
    amount: 940000,
    change: -18800,
    changePct: -2.0,
  },
]

function formatWon(n: number) {
  return `${n.toLocaleString('ko-KR')}원`
}

function formatChange(change: number, pct: number) {
  const sign = change >= 0 ? '+' : ''
  return `${sign}${change.toLocaleString('ko-KR')} (${sign}${pct.toFixed(1)}%)`
}

export function MyDataPreviewCard() {
  const donutSegments = buildDonutSegments()

  return (
    <div className='rounded-3xl bg-[#191f28] p-6 text-white'>
      <p className='mb-5 flex items-center gap-1 text-xs font-semibold text-brand'>
        <Sparkles className='h-3.5 w-3.5' />
        연동하면 이렇게 보여요
      </p>

      <div className='mb-6 flex items-center gap-5'>
        <div
          className='relative h-28 w-28 shrink-0 opacity-0'
          style={{
            animation: 'mascot-pop 0.5s cubic-bezier(0.16,1,0.3,1) both',
          }}
        >
          <svg viewBox='0 0 100 100' className='relative h-full w-full'>
            {donutSegments.map((seg, i) => (
              <circle
                key={seg.name}
                cx={50}
                cy={50}
                r={DONUT_RADIUS}
                fill='none'
                stroke={seg.color}
                strokeWidth={DONUT_STROKE_WIDTH}
                strokeDasharray={`${seg.length} ${DONUT_CIRCUMFERENCE}`}
                strokeDashoffset={seg.length}
                transform={`rotate(${seg.rotation} 50 50)`}
                style={{
                  animation:
                    'donut-draw 0.8s cubic-bezier(0.16,1,0.3,1) forwards',
                  animationDelay: `${0.25 + i * 0.15}s`,
                }}
              />
            ))}
          </svg>
          <div
            className='absolute inset-[22%] flex flex-col items-center justify-center rounded-full bg-[#191f28] text-center opacity-0'
            style={{ animation: 'fade-up 0.4s ease 0.9s both' }}
          >
            <span className='text-[10px] text-white/50'>자산 구성</span>
          </div>
        </div>

        <ul className='min-w-0 flex-1 space-y-1.5'>
          {ASSET_MIX.map((a, i) => (
            <li
              key={a.name}
              className='flex items-center gap-1.5 text-xs text-white/70 opacity-0'
              style={{ animation: `fade-up 0.4s ease ${0.5 + i * 0.08}s both` }}
            >
              <span
                aria-hidden
                className='h-2 w-2 shrink-0 rounded-full'
                style={{ backgroundColor: a.color }}
              />
              <span className='flex-1 font-semibold'>{a.name}</span>
              <span className='font-mono text-white/50'>{a.pct}%</span>
            </li>
          ))}
        </ul>
      </div>

      <div className='mb-5 h-px bg-white/10' />

      <ul className='space-y-4'>
        {MOCK_STOCK_HOLDINGS.map((s) => (
          <li key={s.name} className='flex items-center gap-3'>
            <span
              aria-hidden
              className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white'
              style={{ backgroundColor: s.color }}
            >
              {s.initial}
            </span>
            <div className='min-w-0 flex-1'>
              <p className='truncate text-sm font-bold'>{s.name}</p>
              <p className='text-xs text-white/40'>{s.qty}주</p>
            </div>
            <div className='shrink-0 text-right'>
              <p className='text-sm font-bold'>{formatWon(s.amount)}</p>
              <p
                className={
                  s.change >= 0
                    ? 'text-xs font-medium text-red-400'
                    : 'text-xs font-medium text-blue-400'
                }
              >
                {formatChange(s.change, s.changePct)}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <div className='mt-5 flex items-start gap-2 rounded-2xl bg-white/5 p-3'>
        <Podcast className='mt-0.5 h-4 w-4 shrink-0 text-brand' />
        <p className='text-xs leading-snug text-white/70'>
          모아온 자산 구성에 맞춰 코스와 코미가 매일 아침 나만의 브리핑을
          만들어드려요.
        </p>
      </div>
    </div>
  )
}
