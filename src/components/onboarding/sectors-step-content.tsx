import { IndustryAvatarGrid } from './industry-avatar-grid'

export function SectorsStepContent({
  sectors,
  selected,
  onChange,
  isLoading,
  error,
  onRetry,
  scrollable = true,
}: {
  sectors: string[]
  selected: string[]
  onChange: (next: string[]) => void
  isLoading: boolean
  error: string | null
  onRetry: () => void
  scrollable?: boolean
}) {
  if (isLoading) {
    return (
      <div className='grid grid-cols-3 gap-x-2.5 gap-y-4.5'>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className='flex flex-col items-center gap-2'>
            <span className='h-22 w-22 animate-pulse rounded-full bg-[#f4f6f8]' />
            <span className='h-3 w-12 animate-pulse rounded-full bg-[#f4f6f8]' />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex flex-col items-center gap-3 py-10 text-center'>
        <p className='text-[13px] text-[#8b95a1]'>
          산업군 목록을 불러오지 못했어요
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
    <IndustryAvatarGrid
      options={sectors}
      selected={selected}
      onChange={onChange}
      scrollable={scrollable}
    />
  )
}
