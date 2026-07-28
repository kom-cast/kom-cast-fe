import { ChevronLeft, ChevronRight } from 'lucide-react'

export function Pagination({
  page,
  totalPages,
  onPrev,
  onNext,
}: {
  page: number
  totalPages: number
  onPrev: () => void
  onNext: () => void
}) {
  if (totalPages <= 1) return null

  return (
    <div className='mt-4 flex items-center justify-between'>
      <button
        type='button'
        onClick={onPrev}
        disabled={page === 0}
        aria-label='이전 페이지'
        className='flex h-9 w-9 items-center justify-center rounded-full bg-muted/50 text-foreground disabled:opacity-40'
      >
        <ChevronLeft className='h-4 w-4' />
      </button>
      <span className='font-mono text-xs text-muted-foreground'>
        {page + 1} / {totalPages}
      </span>
      <button
        type='button'
        onClick={onNext}
        disabled={page + 1 >= totalPages}
        aria-label='다음 페이지'
        className='flex h-9 w-9 items-center justify-center rounded-full bg-muted/50 text-foreground disabled:opacity-40'
      >
        <ChevronRight className='h-4 w-4' />
      </button>
    </div>
  )
}
