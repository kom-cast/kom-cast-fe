import { ChevronDown, FileText } from 'lucide-react'

import { cn } from '@/lib/utils'

export function PlayerHeader({
  dateLabel,
  isPlaying,
  showScript,
  onBack,
  onToggleScript,
}: {
  dateLabel: string
  isPlaying: boolean
  showScript: boolean
  onBack: () => void
  onToggleScript: () => void
}) {
  return (
    <div className='mb-4 flex items-center justify-between'>
      <button
        type='button'
        onClick={onBack}
        aria-label='닫기'
        className='flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/15'
      >
        <ChevronDown className='h-5 w-5' />
      </button>
      <div className='text-center'>
        <p className='text-sm font-semibold'>{dateLabel}</p>
        <p className='text-xs text-white/40'>
          {isPlaying ? '재생 중' : '일시정지'} · AI 브리핑
        </p>
      </div>
      <button
        type='button'
        onClick={onToggleScript}
        aria-label='스크립트 보기'
        aria-pressed={showScript}
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/15',
          showScript ? 'bg-brand' : 'bg-white/10',
        )}
      >
        <FileText className='h-5 w-5' />
      </button>
    </div>
  )
}
