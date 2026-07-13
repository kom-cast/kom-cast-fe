import { useState } from 'react'

import { useOnboarding } from '@/context/onboarding-context'
import OnboardingComplete from '@/components/onboarding/onboarding-complete'
import OnboardingLayout from '@/components/onboarding/onboarding-layout'
import BriefingTimeContent from '@/components/onboarding/steps/briefing-time-content'
import InterestsStepContent from '@/components/onboarding/steps/interests-step-content'
import KeywordsStepContent from '@/components/onboarding/steps/keywords-step-content'
import PortfolioStepContent from '@/components/onboarding/steps/portfolio-step-content'
import { Button } from '@/components/ui/button'

const STEPS = [
  {
    key: 'portfolio',
    title: <>보유종목을 등록해주세요</>,
    description: '보유 중인 종목의 뉴스만 골라 브리핑해드려요',
    skippable: true,
    Content: PortfolioStepContent,
  },
  {
    key: 'interests',
    title: <>관심종목 · 관심분야</>,
    description: '관심 있는 종목과 산업 분야를 알려주세요',
    skippable: true,
    Content: InterestsStepContent,
  },
  {
    key: 'keywords',
    title: <>관심 키워드</>,
    description: '포함하거나 제외하고 싶은 키워드를 알려주세요',
    skippable: true,
    Content: KeywordsStepContent,
  },
  {
    key: 'briefing-time',
    title: <>브리핑 시간대를 정해주세요</>,
    description: '매일 이 시간에 맞춰 브리핑을 준비해드려요',
    skippable: false,
    Content: BriefingTimeContent,
  },
] as const

function OnboardingFlow() {
  const { markSkipped } = useOnboarding()
  const [stepIndex, setStepIndex] = useState(0)
  const [completed, setCompleted] = useState(false)

  if (completed) {
    return <OnboardingComplete />
  }

  const step = STEPS[stepIndex]
  const isLast = stepIndex === STEPS.length - 1
  const Content = step.Content

  function goNext() {
    if (isLast) {
      setCompleted(true)
    } else {
      setStepIndex((i) => i + 1)
    }
  }

  function goBack() {
    setStepIndex((i) => i - 1)
  }

  function handleSkip() {
    markSkipped()
    goNext()
  }

  return (
    <OnboardingLayout
      stepIndex={stepIndex}
      totalSteps={STEPS.length}
      title={step.title}
      description={step.description}
      onBack={stepIndex > 0 ? goBack : undefined}
      actions={
        <>
          <Button
            type='button'
            className='h-14 w-full rounded-2xl bg-[#ec6d1e] text-base font-semibold text-white hover:bg-[#d9600f]'
            onClick={goNext}
          >
            다음
          </Button>
          {step.skippable && (
            <Button
              type='button'
              variant='secondary'
              className='h-14 w-full rounded-2xl text-base font-semibold'
              onClick={handleSkip}
            >
              지금은 건너뛸게요
            </Button>
          )}
        </>
      }
    >
      <Content />
    </OnboardingLayout>
  )
}

export default OnboardingFlow
