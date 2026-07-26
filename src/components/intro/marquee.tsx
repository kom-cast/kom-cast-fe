import { type ReactNode } from 'react'

export function Marquee({
  children,
  durationSeconds,
  direction = 'left',
  className,
}: {
  children: ReactNode
  durationSeconds: number
  direction?: 'left' | 'right'
  className?: string
}) {
  return (
    <div
      className={`-mx-4 overflow-hidden px-4 sm:-mx-6 sm:px-6 ${className ?? ''}`}
      style={{
        WebkitMaskImage:
          'linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)',
        maskImage:
          'linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)',
      }}
      aria-hidden='true'
    >
      <div
        className='flex w-max items-center gap-2.5'
        style={{
          animation: `${direction === 'left' ? 'marquee-scroll' : 'marquee-scroll-reverse'} ${durationSeconds}s linear infinite`,
          willChange: 'transform',
        }}
      >
        <div className='flex items-center gap-2.5'>{children}</div>
        <div className='flex items-center gap-2.5'>{children}</div>
      </div>
    </div>
  )
}
