import { useState, type KeyboardEvent } from 'react'

import { useOnboarding } from '@/context/onboarding-context'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

type Mode = 'include' | 'exclude'

function KeywordsStepContent() {
  const {
    includeKeywords,
    setIncludeKeywords,
    excludeKeywords,
    setExcludeKeywords,
    freeText,
    setFreeText,
  } = useOnboarding()

  const [mode, setMode] = useState<Mode>('include')
  const [draft, setDraft] = useState('')

  const activeKeywords = mode === 'include' ? includeKeywords : excludeKeywords
  const setActiveKeywords =
    mode === 'include' ? setIncludeKeywords : setExcludeKeywords

  function addKeyword() {
    const value = draft.trim()
    if (!value || activeKeywords.includes(value)) return
    setActiveKeywords([...activeKeywords, value])
    setDraft('')
  }

  function removeKeyword(keyword: string) {
    setActiveKeywords(activeKeywords.filter((k) => k !== keyword))
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      e.preventDefault()
      addKeyword()
    }
  }

  return (
    <div className='space-y-6'>
      <div className='flex w-full gap-2 rounded-2xl bg-muted p-1'>
        <button
          type='button'
          onClick={() => setMode('include')}
          className={cn(
            'flex-1 rounded-xl py-2.5 text-sm font-medium transition-colors',
            mode === 'include'
              ? 'bg-[#ec6d1e] text-white'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          포함
        </button>
        <button
          type='button'
          onClick={() => setMode('exclude')}
          className={cn(
            'flex-1 rounded-xl py-2.5 text-sm font-medium transition-colors',
            mode === 'exclude'
              ? 'bg-foreground text-background'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          제외
        </button>
      </div>

      <div className='space-y-3'>
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            mode === 'include' ? '예: 실적 발표, 신제품' : '예: 루머, 단순 시황'
          }
          className='h-14 rounded-2xl border-transparent bg-muted px-4 text-base'
        />
        {activeKeywords.length > 0 && (
          <div className='flex flex-wrap gap-2'>
            {activeKeywords.map((keyword) => (
              <span
                key={keyword}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium',
                  mode === 'include'
                    ? 'bg-[#ec6d1e]/10 text-[#E85D00]'
                    : 'bg-muted text-foreground',
                )}
              >
                {keyword}
                <button
                  type='button'
                  onClick={() => removeKeyword(keyword)}
                  aria-label={`${keyword} 제거`}
                  className='opacity-70 hover:opacity-100'
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className='space-y-2'>
        <p className='text-sm font-medium text-foreground'>
          자유롭게 설명해주셔도 좋아요
        </p>
        <Textarea
          value={freeText}
          onChange={(e) => setFreeText(e.target.value)}
          placeholder='예: 실적 발표와 신사업 소식 위주로 듣고 싶어요'
          rows={4}
          className='rounded-2xl border-transparent bg-muted px-4 py-3 text-base'
        />
      </div>
    </div>
  )
}

export default KeywordsStepContent
