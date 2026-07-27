import { Podcast, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { SettingsLayout } from '@/components/settings'

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

function buildConicGradient() {
  let cursor = 0
  const stops = ASSET_MIX.map(({ color, pct }) => {
    const start = cursor
    cursor += pct
    return `${color} ${start}% ${cursor}%`
  })
  return `conic-gradient(${stops.join(', ')})`
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

export function MyDataSettingsPage() {
  const navigate = useNavigate()

  return (
    <SettingsLayout title='마이데이터 연동'>
      <div className='mb-6 rounded-3xl bg-[#191f28] p-6 text-white'>
        <p className='mb-4 text-xl leading-snug font-extrabold break-keep'>
          흩어진 내 자산,
          <br />
          모아서 관리할 수 있게 도와드릴게요
        </p>

        <div className='mb-4 h-px bg-white/10' />

        <p className='mb-2 text-sm font-bold'>연결 전에 확인해요</p>
        <ul className='mb-5 space-y-1.5 text-xs leading-relaxed text-white/60'>
          <li>
            · 마이데이터로 정보를 연결하기 전에 신중하게 고민하고 필요한
            서비스만 이용해주세요.
          </li>
          <li>
            · 안 쓰는 서비스에서는 언제든지 정보를 지울 수 있으니 안심하세요.
          </li>
        </ul>

        <div className='flex items-center gap-2.5'>
          <button
            type='button'
            onClick={() => navigate('/my')}
            className='flex-1 rounded-2xl bg-white/10 py-3.5 text-sm font-bold text-white/70 hover:bg-white/15'
          >
            다음에
          </button>
          <button
            type='button'
            className='flex-1 rounded-2xl bg-brand py-3.5 text-sm font-bold text-white'
          >
            동의하고 연결
          </button>
        </div>
      </div>

      <div className='mb-6 rounded-3xl bg-[#191f28] p-6 text-white'>
        <p className='mb-5 flex items-center gap-1 text-xs font-semibold text-brand'>
          <Sparkles className='h-3.5 w-3.5' />
          연동하면 이렇게 보여요
        </p>

        <div className='mb-6 flex items-center gap-5'>
          <div className='relative h-28 w-28 shrink-0'>
            <div
              className='h-full w-full rounded-full'
              style={{ background: buildConicGradient() }}
            />
            <div className='absolute inset-[22%] flex flex-col items-center justify-center rounded-full bg-[#191f28] text-center'>
              <span className='text-[10px] text-white/50'>자산 구성</span>
            </div>
          </div>

          <ul className='min-w-0 flex-1 space-y-1.5'>
            {ASSET_MIX.map((a) => (
              <li
                key={a.name}
                className='flex items-center gap-1.5 text-xs text-white/70'
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

      <div className='mb-6 space-y-3'>
        <p className='text-[13px] font-semibold text-foreground'>
          연동하면 뭐가 달라지나요?
        </p>
        <div className='space-y-2 text-[13px] text-[#8b95a1]'>
          <p>· 여러 계좌를 각각 앱을 열지 않고 한 곳에서 확인해요</p>
          <p>· 보유 종목을 매번 직접 등록하지 않아도 자동으로 채워져요</p>
          <p>· 실제 보유 비중에 맞춰 브리핑에서 다루는 비중도 조정돼요</p>
        </div>
      </div>

      <div className='rounded-2xl bg-muted/50 p-4 text-center'>
        <p className='text-sm font-semibold text-foreground'>
          아직 준비 중이에요
        </p>
        <p className='mt-1 text-xs text-muted-foreground'>
          마이데이터 연동은 곧 만나보실 수 있어요.
        </p>
      </div>
    </SettingsLayout>
  )
}
