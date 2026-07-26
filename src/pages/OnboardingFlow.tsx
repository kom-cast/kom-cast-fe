import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { ChevronLeft } from 'lucide-react'

import { useOnboarding } from '@/context/onboarding-context'
import {
  getAllSectors,
  getAllStocks,
  registerMySector,
  registerMyStock,
} from '@/lib/api'
import { cn } from '@/lib/utils'
import {
  OnboardingComplete,
  OnboardingLayout,
  PortfolioStepContent,
  SectorsStepContent,
  SelectionStrip,
} from '@/components/onboarding'

const STEPS = ['portfolio', 'sectors'] as const

export function OnboardingFlow() {
  const { portfolio, setPortfolio, sectors, setSectors } = useOnboarding()
  const [stepIndex, setStepIndex] = useState(0)
  const [completed, setCompleted] = useState(false)

  const isSectorsStep = STEPS[stepIndex] === 'sectors'
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
    data: sectorOptions = [],
    isLoading: sectorsLoading,
    error: sectorsError,
    refetch: loadSectors,
  } = useQuery({
    queryKey: ['sectors'],
    queryFn: getAllSectors,
  })

  const submitMutation = useMutation({
    mutationFn: async () => {
      const codesByName = new Map(stocks.map((s) => [s.name, s.code]))
      const codes = portfolio
        .map((name) => codesByName.get(name))
        .filter((code): code is string => Boolean(code))

      // TODO(backend): POST /stocks/my 배치 등록 엔드포인트 있으면 좋음 (현재 단건 반복 호출)
      if (codes.length > 0) {
        try {
          await Promise.all(
            codes.map((code) => registerMyStock(code, 'PORTFOLIO')),
          )
        } catch (err) {
          console.warn('보유 종목 등록 실패', err)
        }
      }

      // TODO(backend): POST /sectors/my 아직 없어서 항상 실패 (실패해도 온보딩 완료는 진행)
      try {
        await Promise.all(sectors.map((sector) => registerMySector(sector)))
      } catch (err) {
        console.warn('관심 산업군 등록 실패 (백엔드 엔드포인트 준비 전)', err)
      }
    },
    onSuccess: () => setCompleted(true),
  })

  if (completed) {
    return <OnboardingComplete />
  }

  const selectedCount = isSectorsStep ? sectors.length : portfolio.length
  const isReady = isSectorsStep || selectedCount > 0

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
        isSectorsStep ? (
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
          items={isSectorsStep ? sectors : portfolio}
          emptyLabel={
            isSectorsStep
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
      {isSectorsStep ? (
        <SectorsStepContent
          sectors={sectorOptions}
          selected={sectors}
          onChange={setSectors}
          isLoading={sectorsLoading}
          error={sectorsError instanceof Error ? sectorsError.message : null}
          onRetry={() => loadSectors()}
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
