import { useNavigate } from 'react-router-dom'

import { useOnboarding } from '@/context/onboarding-context'
import { MascotBubble } from '@/components/mascot-bubble'

export function OnboardingComplete() {
  const navigate = useNavigate()
  const { portfolio, industries } = useOnboarding()
  const summary = [...portfolio, ...industries]

  function handleDone() {
    navigate('/home', { replace: true })
  }

  return (
    <div className='flex min-h-svh flex-col bg-white'>
      <div className='flex flex-1 flex-col items-center justify-center px-8 text-center'>
        <div className='mb-6 flex items-end justify-center gap-3'>
          <MascotBubble
            mascot='kos'
            color='var(--brand)'
            text='내일 아침에 만나요!'
            delaySeconds={0}
            flip
          />
          <MascotBubble
            mascot='komi'
            color='#3e9bff'
            text='준비하고 있을게요!'
            delaySeconds={0.15}
          />
        </div>

        <h1
          className='mb-2.5 text-xl font-extrabold tracking-tight text-[#191f28] opacity-0'
          style={{ animation: 'fade-up 0.4s ease 0.35s both' }}
        >
          설정이 모두 끝났어요!
        </h1>
        <p
          className='mb-6.5 text-[13.5px] leading-[1.6] text-[#8b95a1] opacity-0'
          style={{ animation: 'fade-up 0.4s ease 0.45s both' }}
        >
          선택하신 종목과 산업군으로 만든
          <br />첫 브리핑을 내일 아침 6시에 보내드릴게요
        </p>

        <div
          className='mb-7 flex flex-wrap justify-center gap-1.5 opacity-0'
          style={{ animation: 'fade-up 0.4s ease 0.55s both' }}
        >
          {(summary.length > 0 ? summary : ['전체 시황 브리핑']).map((item) => (
            <span
              key={item}
              className='rounded-full bg-[#f4f6f8] px-2.5 py-1.5 font-mono text-[11px] text-[#333d4b]'
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className='shrink-0 px-5.5 pt-3.5 pb-7'>
        <button
          type='button'
          onClick={handleDone}
          className='flex w-full items-center justify-center gap-2 rounded-2xl bg-[#191f28] py-4 text-[15px] font-extrabold text-white'
        >
          완료
        </button>
      </div>
    </div>
  )
}
