import { useEffect, useMemo, useState } from 'react'

import { cn } from '@/lib/utils'

interface MessageToken {
  text: string
  kind: 'word' | 'token' | 'space'
}

// NOTE: "[삼성전자]가 ..." 처럼 대괄호 구간은 종목명 토큰으로, 나머지는 공백/단어로 쪼갬
function tokenizeMessage(text: string): MessageToken[] {
  const chunks = text.match(/\[[^\]]+\]|\s+|[^\s[\]]+/g) ?? []
  return chunks.map((chunk) => {
    if (chunk.startsWith('[') && chunk.endsWith(']')) {
      return { text: chunk.slice(1, -1), kind: 'token' }
    }
    if (/^\s+$/.test(chunk)) return { text: chunk, kind: 'space' }
    return { text: chunk, kind: 'word' }
  })
}

export function MessageText({
  text,
  animated,
  wordDelayMs = 480,
  loopPauseMs = 1400,
}: {
  text: string
  animated?: boolean
  wordDelayMs?: number
  loopPauseMs?: number
}) {
  const tokens = useMemo(() => tokenizeMessage(text), [text])
  const stepCount = useMemo(
    () => tokens.filter((t) => t.kind !== 'space').length,
    [tokens],
  )
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    if (!animated || stepCount === 0) return

    let i = 0
    let timeout: ReturnType<typeof setTimeout>

    const step = () => {
      setActiveStep(i)
      const isLast = i === stepCount - 1
      i = (i + 1) % stepCount
      timeout = setTimeout(step, isLast ? loopPauseMs : wordDelayMs)
    }
    step()

    return () => clearTimeout(timeout)
  }, [animated, stepCount, wordDelayMs, loopPauseMs])

  let step = -1
  return (
    <>
      {tokens.map((token, i) => {
        if (token.kind === 'space') return token.text

        if (token.kind === 'token') {
          step += 1
          return (
            <span
              key={i}
              className='rounded bg-white/15 px-0.5 py-0.5 font-bold text-[#3e9bff]'
            >
              {token.text}
            </span>
          )
        }

        step += 1
        const isActive = step === activeStep
        return (
          <span
            key={i}
            className={cn(
              animated && 'transition-colors duration-200',
              animated && (isActive ? 'text-white' : 'text-white/55'),
            )}
          >
            {token.text}
          </span>
        )
      })}
    </>
  )
}
