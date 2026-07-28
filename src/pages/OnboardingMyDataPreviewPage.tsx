import { ArrowRight, ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { MyDataPreviewCard } from '@/components/mydata/mydata-preview-card'

export function OnboardingMyDataPreviewPage() {
  const navigate = useNavigate()

  return (
    <div className='flex min-h-svh flex-col bg-white sm:min-h-full'>
      <div className='mx-auto flex min-h-svh w-full max-w-sm flex-1 flex-col sm:min-h-full'>
        <div className='shrink-0 px-5.5 pt-13 pb-3.5'>
          <button
            type='button'
            onClick={() => navigate('/onboarding/start')}
            aria-label='뒤로'
            className='-ml-2 mb-5 flex h-10 w-10 items-center justify-center rounded-full hover:bg-black/5'
          >
            <ChevronLeft className='h-5 w-5 text-[#191f28]' />
          </button>

          <h1 className='text-[23px] leading-[1.3] font-extrabold tracking-tight text-[#191f28]'>
            연동하면
            <br />
            이렇게 보여드릴 수 있어요
          </h1>
          <p className='mt-2 break-keep text-[13.5px] leading-[1.55] text-[#8b95a1]'>
            아직 실제 연동은 준비 중이라, 지금은 예상 화면만 먼저 보여드려요
          </p>
        </div>

        <div className='min-h-0 flex-1 overflow-y-auto px-5.5 pt-1 pb-4 [&::-webkit-scrollbar]:hidden'>
          <MyDataPreviewCard />
        </div>

        <div className='shrink-0 px-5.5 py-3.5 pb-7'>
          <button
            type='button'
            onClick={() => navigate('/onboarding')}
            className='group flex w-full items-center justify-center gap-2 rounded-2xl bg-[#191f28] py-4 text-[15px] font-extrabold text-white'
          >
            종목 등록하러 가기
            <ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-0.5' />
          </button>
        </div>
      </div>
    </div>
  )
}
