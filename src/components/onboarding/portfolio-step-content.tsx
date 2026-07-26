import { type RemoteStock } from '@/lib/api'

import { StockAvatarList } from './stock-avatar-list'

export function PortfolioStepContent({
  stocks,
  selected,
  onChange,
  isLoading,
  error,
  onRetry,
}: {
  stocks: RemoteStock[]
  selected: string[]
  onChange: (next: string[]) => void
  isLoading: boolean
  error: string | null
  onRetry: () => void
}) {
  if (isLoading) {
    return (
      <div className='flex flex-wrap gap-2'>
        {Array.from({ length: 8 }).map((_, i) => (
          <span
            key={i}
            className='h-10 w-20 shrink-0 animate-pulse rounded-full bg-[#f4f6f8]'
          />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex flex-col items-center gap-3 py-10 text-center'>
        <p className='text-[13px] text-[#8b95a1]'>
          종목 목록을 불러오지 못했어요
        </p>
        <button
          type='button'
          onClick={onRetry}
          className='rounded-full bg-[#f4f6f8] px-4 py-2 text-xs font-semibold text-[#333d4b]'
        >
          다시 시도
        </button>
      </div>
    )
  }

  return (
    <StockAvatarList options={stocks} selected={selected} onChange={onChange} />
  )
}
