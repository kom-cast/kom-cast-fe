import { ChevronLeft, ChevronRight, Database, ListChecks } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function OnboardingStartPage() {
  const navigate = useNavigate()

  return (
    <div className='flex min-h-svh flex-col bg-white sm:min-h-full'>
      <div className='mx-auto flex min-h-svh w-full max-w-sm flex-1 flex-col sm:min-h-full'>
        <div className='shrink-0 px-5.5 pt-13 pb-3.5'>
          <button
            type='button'
            onClick={() => navigate('/')}
            aria-label='뒤로'
            className='-ml-2 mb-5 flex h-10 w-10 items-center justify-center rounded-full hover:bg-black/5'
          >
            <ChevronLeft className='h-5 w-5 text-[#191f28]' />
          </button>

          <h1 className='text-[23px] leading-[1.3] font-extrabold tracking-tight text-[#191f28]'>
            종목을 어떻게
            <br />
            등록할까요?
          </h1>
          <p className='mt-2 break-keep text-[13.5px] leading-[1.55] text-[#8b95a1]'>
            둘 중 편한 방법으로 시작해보세요
          </p>
        </div>

        <div className='flex-1 space-y-3 px-5.5 pt-4'>
          <button
            type='button'
            onClick={() => navigate('/onboarding/mydata')}
            className='flex w-full items-center gap-4 rounded-3xl border border-[#eef1f4] p-5 text-left transition-colors hover:bg-[#f9fafb] active:bg-[#f4f6f8]'
          >
            <span className='flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand/10 text-brand'>
              <Database className='h-5 w-5' />
            </span>
            <span className='min-w-0 flex-1'>
              <span className='block text-[15px] font-bold text-[#191f28]'>
                마이데이터로 연동할게요
              </span>
              <span className='mt-0.5 block text-[12.5px] leading-[1.5] break-keep text-[#8b95a1]'>
                보유 중인 계좌를 연결하면 종목이 자동으로 채워져요
              </span>
            </span>
            <ChevronRight className='h-4 w-4 shrink-0 text-[#b0b8c1]' />
          </button>

          <button
            type='button'
            onClick={() => navigate('/onboarding')}
            className='flex w-full items-center gap-4 rounded-3xl border border-[#eef1f4] p-5 text-left transition-colors hover:bg-[#f9fafb] active:bg-[#f4f6f8]'
          >
            <span className='flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#f4f6f8] text-[#333d4b]'>
              <ListChecks className='h-5 w-5' />
            </span>
            <span className='min-w-0 flex-1'>
              <span className='block text-[15px] font-bold text-[#191f28]'>
                직접 고를게요
              </span>
              <span className='mt-0.5 block text-[12.5px] leading-[1.5] break-keep text-[#8b95a1]'>
                관심 있는 종목과 산업군을 하나씩 선택해요
              </span>
            </span>
            <ChevronRight className='h-4 w-4 shrink-0 text-[#b0b8c1]' />
          </button>
        </div>
      </div>
    </div>
  )
}
