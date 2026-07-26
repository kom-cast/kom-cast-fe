import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { ChevronLeft } from 'lucide-react'

import { useOnboarding } from '@/context/onboarding-context'
import {
  getAllIndustries,
  getAllStocks,
  registerMyIndustriesBatch,
  registerMyStocksBatch,
} from '@/lib/api'
import { cn } from '@/lib/utils'
import {
  IndustriesStepContent,
  OnboardingComplete,
  OnboardingLayout,
  PortfolioStepContent,
  SelectionStrip,
} from '@/components/onboarding'

const STEPS = ['portfolio', 'industries'] as const

export function OnboardingFlow() {
  const { portfolio, setPortfolio, industries, setIndustries } = useOnboarding()
  const [stepIndex, setStepIndex] = useState(0)
  const [completed, setCompleted] = useState(false)

  const isIndustriesStep = STEPS[stepIndex] === 'industries'
  const isLastStep = stepIndex === STEPS.length - 1

  const {
    data: stocks = [],
    isLoading: stocksLoading,
    error: stocksError,
    refetch: loadStocks,
  } = useQuery({
    queryKey: ['stocks'],
    queryFn: getAllStocks,
  })

  const {
    data: allIndustries = [],
    isLoading: industriesLoading,
    error: industriesError,
    refetch: loadIndustries,
  } = useQuery({
    queryKey: ['industries'],
    queryFn: getAllIndustries,
  })
  const industryOptions = allIndustries.map((i) => i.name)

  const submitMutation = useMutation({
    mutationFn: async () => {
      const codesByName = new Map(stocks.map((s) => [s.name, s.code]))
      const codes = portfolio
        .map((name) => codesByName.get(name))
        .filter((code): code is string => Boolean(code))

      if (codes.length > 0) {
        await registerMyStocksBatch(codes, 'PORTFOLIO')
      }

      if (industries.length > 0) {
        await registerMyIndustriesBatch(industries)
      }
    },
    onSuccess: () => setCompleted(true),
  })

  if (completed) {
    return <OnboardingComplete />
  }

  const selectedCount = isIndustriesStep ? industries.length : portfolio.length
  const isReady = isIndustriesStep || selectedCount > 0

  function goNext() {
    if (isLastStep) {
      submitMutation.mutate()
    } else {
      setStepIndex((i) => i + 1)
    }
  }

  function goBack() {
    setStepIndex((i) => i - 1)
  }

  return (
    <OnboardingLayout
      stepIndex={stepIndex}
      totalSteps={2}
      title={
        isIndustriesStep ? (
          <>
            관심 있는 산업군을
            <br />
            골라주세요
          </>
        ) : (
          <>
            보유하신 종목을
            <br />
            선택해주세요
          </>
        )
      }
      strip={
        <SelectionStrip
          items={isIndustriesStep ? industries : portfolio}
          emptyLabel={
            isIndustriesStep
              ? '아직 선택한 산업군이 없어요'
              : '아직 선택한 종목이 없어요'
          }
        />
      }
      actions={
        <div className='flex w-full flex-col gap-2.5'>
          {isLastStep && submitMutation.isError && (
            <div className='flex items-center justify-between gap-3 rounded-2xl bg-red-50 px-3.5 py-3'>
              <p className='text-xs text-red-500'>
                {submitMutation.error instanceof Error
                  ? submitMutation.error.message
                  : '설정 저장에 실패했어요'}
              </p>
              <button
                type='button'
                onClick={() => submitMutation.mutate()}
                className='shrink-0 rounded-full bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-600'
              >
                다시 시도
              </button>
            </div>
          )}
          <div className='flex items-center gap-2.5'>
            {stepIndex > 0 && (
              <button
                type='button'
                onClick={goBack}
                className='flex shrink-0 items-center gap-0.5 rounded-2xl px-3 py-4 text-[13px] font-bold text-[#8b95a1] underline decoration-[#b0b8c1] underline-offset-4 transition-colors hover:text-[#191f28] active:bg-black/5'
              >
                <ChevronLeft className='h-3.5 w-3.5' />
                이전
              </button>
            )}
            <button
              type='button'
              disabled={!isReady || (isLastStep && submitMutation.isPending)}
              onClick={goNext}
              className={cn(
                'flex flex-1 items-center justify-center gap-2 rounded-2xl py-4 text-[15px] font-extrabold transition-colors',
                isReady
                  ? 'bg-[#191f28] text-white'
                  : 'cursor-not-allowed bg-[#eef1f4] text-[#b0b8c1]',
              )}
            >
              {isLastStep && submitMutation.isPending
                ? '저장하는 중...'
                : isLastStep
                  ? '팟캐스트 만들기'
                  : '다음'}
              {!(isLastStep && submitMutation.isPending) && (
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 font-mono text-xs',
                    isReady ? 'bg-white/15' : 'bg-black/5',
                  )}
                >
                  {selectedCount}개 선택
                </span>
              )}
            </button>
          </div>
        </div>
      }
    >
      {isIndustriesStep ? (
        <IndustriesStepContent
          industries={industryOptions}
          selected={industries}
          onChange={setIndustries}
          isLoading={industriesLoading}
          error={
            industriesError instanceof Error ? industriesError.message : null
          }
          onRetry={() => loadIndustries()}
        />
      ) : (
        <PortfolioStepContent
          stocks={stocks}
          selected={portfolio}
          onChange={setPortfolio}
          isLoading={stocksLoading}
          error={stocksError instanceof Error ? stocksError.message : null}
          onRetry={() => loadStocks()}
        />
      )}
    </OnboardingLayout>
  )
}
