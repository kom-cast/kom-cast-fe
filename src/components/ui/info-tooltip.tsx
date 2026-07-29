import { useEffect, useRef, useState } from 'react'
import { Info } from 'lucide-react'

import { cn } from '@/lib/utils'

export function InfoTooltip({
  text,
  className,
}: {
  text: string
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  return (
    <div ref={ref} className={cn('relative inline-flex', className)}>
      <button
        type='button'
        onClick={() => setOpen((prev) => !prev)}
        className='flex h-4 w-4 items-center justify-center text-muted-foreground'
        aria-label='정보'
      >
        <Info className='h-3.5 w-3.5' />
      </button>
      {open && (
        <div className='absolute top-full left-0 z-10 mt-1.5 w-max max-w-60 rounded-lg bg-foreground px-3 py-2 text-xs leading-relaxed whitespace-pre-line text-background shadow-lg'>
          {text}
        </div>
      )}
    </div>
  )
}
