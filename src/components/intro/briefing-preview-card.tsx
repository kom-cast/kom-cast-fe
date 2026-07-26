import { cn } from '@/lib/utils'
import { AnimatedLogo, KomiMascot, KosMascot } from '@/components/icons'

import { MessageText } from './message-text'

type Speaker = 'kos' | 'komi'

interface PreviewMessage {
  speaker: Speaker
  text: string
  highlight?: boolean
  faded?: boolean
}

const MESSAGES: PreviewMessage[] = [
  { speaker: 'kos', text: '코미님, 오늘 가장 큰 이슈는 뭔가요?' },
  {
    speaker: 'komi',
    text: '[삼성전자]가 3분기 잠정 실적을 발표했는데요, 매출이 전년 동기 대비 23% 증가한 74조원을 기록했습니다.',
    highlight: true,
  },
  { speaker: 'kos', text: '오늘의 체크리스트 3개 짚어드릴게요.', faded: true },
]

export function BriefingPreviewCard() {
  return (
    <div className='relative overflow-hidden rounded-3xl bg-[#191f28] px-5 py-5'>
      <div
        aria-hidden='true'
        className='pointer-events-none absolute -top-16 -right-10 h-56 w-56 rounded-full opacity-35 blur-2xl'
        style={{
          background: 'radial-gradient(circle, var(--brand), transparent 70%)',
        }}
      />
      <div className='relative flex items-center justify-between'>
        <span className='rounded-full bg-white/10 px-2 py-0.5 text-[10.5px] font-bold tracking-tight text-brand/80'>
          예시
        </span>
        <AnimatedLogo className='h-6 w-6' />
        <span className='text-[11px] font-medium text-[#6b7280]'>5분 30초</span>
      </div>

      <div className='relative mt-4 space-y-2.5'>
        {MESSAGES.map((message, i) => {
          const isKos = message.speaker === 'kos'
          return (
            <div
              key={i}
              className={cn(
                'flex items-start gap-2',
                message.faded && 'opacity-50',
              )}
            >
              {isKos ? (
                <KosMascot className='h-8 w-auto shrink-0 -scale-x-100' />
              ) : (
                <KomiMascot className='h-8 w-auto shrink-0' />
              )}
              <span
                className={cn(
                  'max-w-[75%] rounded-2xl px-3 py-2 text-xs font-semibold break-keep',
                  isKos
                    ? 'rounded-tl-lg bg-brand/20 text-white'
                    : 'rounded-tl-lg bg-[#3e9bff]/18',
                )}
              >
                <MessageText text={message.text} animated={message.highlight} />
              </span>
            </div>
          )
        })}
      </div>
      <p className='relative mt-3.5 text-[11px] font-medium text-[#6b7280]'>
        두 진행자, '코스'와 '코미'가 내 종목을 읽어드려요
      </p>
    </div>
  )
}
