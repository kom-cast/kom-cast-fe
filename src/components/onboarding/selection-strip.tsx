import { useLayoutEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

const PX_PER_SECOND = 45

export function SelectionStrip({
  items,
  emptyLabel,
}: {
  items: string[]
  emptyLabel: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [scrollDistance, setScrollDistance] = useState(0)

  useLayoutEffect(() => {
    const container = containerRef.current
    const content = contentRef.current
    if (!container || !content) return

    const measure = () => {
      const overflow = content.scrollWidth - container.clientWidth
      setScrollDistance(overflow > 0 ? content.scrollWidth : 0)
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(container)
    observer.observe(content)
    return () => observer.disconnect()
  }, [items])

  const shouldScroll = scrollDistance > 0
  const duration = shouldScroll ? scrollDistance / PX_PER_SECOND : 0

  return (
    <div className='flex shrink-0 items-center gap-3 border-t border-[#eef1f4] bg-white py-3 pl-5'>
      {items.length === 0 ? (
        <span className='text-[12.5px] text-[#8b95a1]'>{emptyLabel}</span>
      ) : (
        <>
          <span className='flex shrink-0 items-center gap-1.5'>
            <span
              aria-hidden='true'
              className='h-1.5 w-1.5 rounded-full bg-brand'
              style={{ animation: 'live-pulse 1.6s ease-in-out infinite' }}
            />
            <span className='font-mono text-[9.5px] font-bold tracking-wide whitespace-nowrap text-[#8b95a1]'>
              MY LINEUP
            </span>
          </span>

          <div
            ref={containerRef}
            className='min-w-0 flex-1 overflow-hidden'
            style={
              shouldScroll
                ? {
                    WebkitMaskImage:
                      'linear-gradient(90deg, #000 0%, #000 85%, transparent)',
                    maskImage:
                      'linear-gradient(90deg, #000 0%, #000 85%, transparent)',
                  }
                : undefined
            }
          >
            <div
              className={cn('flex items-center gap-2', shouldScroll && 'w-max')}
              style={
                shouldScroll
                  ? {
                      animation: `marquee-scroll ${duration}s linear infinite`,
                      willChange: 'transform',
                    }
                  : undefined
              }
            >
              <div
                ref={contentRef}
                className='flex shrink-0 items-center gap-2'
              >
                {items.map((item) => (
                  <span
                    key={item}
                    className='flex shrink-0 items-center rounded-full bg-[#191f28] px-3 py-1.5 text-xs font-bold whitespace-nowrap text-white'
                  >
                    {item}
                  </span>
                ))}
              </div>
              {shouldScroll && (
                <div
                  className='flex shrink-0 items-center gap-2 pr-2'
                  aria-hidden='true'
                >
                  {items.map((item) => (
                    <span
                      key={item}
                      className='flex shrink-0 items-center rounded-full bg-[#191f28] px-3 py-1.5 text-xs font-bold whitespace-nowrap text-white'
                    >
                      {item}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
