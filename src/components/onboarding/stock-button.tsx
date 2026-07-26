import { Check } from 'lucide-react'

import { type Stock } from '@/data/stocks'
import { cn } from '@/lib/utils'

export function StockButton({
  stock,
  isSelected,
  onToggle,
}: {
  stock: Stock
  isSelected: boolean
  onToggle: () => void
}) {
  return (
    <button
      type='button'
      onClick={onToggle}
      className={cn(
        'flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2.5 text-left transition-colors active:scale-[0.96]',
        isSelected ? 'border-brand bg-brand/10' : 'border-[#e5e8eb] bg-white',
      )}
    >
      <span
        className={cn(
          'flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border-[1.5px]',
          isSelected ? 'border-brand bg-brand' : 'border-[#c7ccd3]',
        )}
      >
        {isSelected && (
          <Check className='h-2.5 w-2.5 text-white' strokeWidth={3.5} />
        )}
      </span>
      <span className='text-sm font-bold text-[#191f28]'>{stock.name}</span>
      <span className='font-mono text-[10.5px] text-[#8b95a1]'>
        {stock.code}
      </span>
    </button>
  )
}
