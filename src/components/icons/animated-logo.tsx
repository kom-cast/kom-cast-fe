import { type CSSProperties } from 'react'

const bars = [
  { x: 43.2, y: 219.6, w: 33.6, h: 72.8, duration: 0.9, delay: 0 },
  { x: 99.2, y: 160.8, w: 33.6, h: 190.4, duration: 1.1, delay: 0.15 },
  { x: 155.2, y: 194.4, w: 33.6, h: 123.2, duration: 0.8, delay: 0.3 },
  { x: 211.2, y: 102.0, w: 33.6, h: 308.0, duration: 1.3, delay: 0.05 },
  { x: 267.2, y: 146.8, w: 33.6, h: 218.4, duration: 1.0, delay: 0.25 },
  { x: 323.2, y: 79.6, w: 33.6, h: 352.8, duration: 1.2, delay: 0.1 },
  { x: 379.2, y: 183.2, w: 33.6, h: 145.6, duration: 0.95, delay: 0.35 },
  { x: 435.2, y: 225.2, w: 33.6, h: 61.6, duration: 1.05, delay: 0.2 },
]

export function AnimatedLogo({
  className,
  paused = false,
}: {
  className?: string
  paused?: boolean
}) {
  const playState = paused ? 'paused' : 'running'

  return (
    <svg
      width='512'
      height='512'
      viewBox='0 0 512 512'
      className={className}
      aria-hidden='true'
    >
      <defs>
        <radialGradient id='logo-glow' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#ff7a38' stopOpacity='0.22' />
          <stop offset='100%' stopColor='#ff7a38' stopOpacity='0' />
        </radialGradient>
        <linearGradient id='logo-bar' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor='#FFB067' />
          <stop offset='100%' stopColor='#ff7a38' />
        </linearGradient>
        <filter id='logo-blur' x='-50%' y='-50%' width='200%' height='200%'>
          <feGaussianBlur stdDeviation='16' />
        </filter>
      </defs>

      <circle
        cx='256'
        cy='256'
        r='200'
        fill='url(#logo-glow)'
        filter='url(#logo-blur)'
        style={
          {
            transformBox: 'fill-box',
            transformOrigin: 'center',
            animation: 'wave-glow 2.4s ease-in-out infinite',
            animationPlayState: playState,
            willChange: 'transform, opacity',
          } as CSSProperties
        }
      />

      {bars.map((bar) => (
        <rect
          key={bar.x}
          x={bar.x}
          y={bar.y}
          width={bar.w}
          height={bar.h}
          rx={bar.w / 2}
          fill='url(#logo-bar)'
          style={
            {
              transformBox: 'fill-box',
              transformOrigin: 'center',
              animation: `wave-bounce ${bar.duration}s ease-in-out ${bar.delay}s infinite`,
              animationPlayState: playState,
              willChange: 'transform',
            } as CSSProperties
          }
        />
      ))}
    </svg>
  )
}
