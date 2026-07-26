import { useId } from 'react'

export function KomiMascot({ className }: { className?: string }) {
  const gradId = useId()

  return (
    <svg viewBox='0 0 220 260' className={className} aria-hidden='true'>
      <defs>
        <linearGradient id={gradId} x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor='#7dd3fc' />
          <stop offset='100%' stopColor='#0ea5e9' />
        </linearGradient>
      </defs>
      <ellipse cx='112' cy='243' rx='24' ry='5' fill='#000' opacity='0.22' />
      <g transform='rotate(-6 110 160)'>
        <rect
          x='42'
          y='88'
          width='132'
          height='140'
          rx='66'
          fill={`url(#${gradId})`}
        />
        <rect
          x='66'
          y='52'
          width='14'
          height='30'
          rx='7'
          fill={`url(#${gradId})`}
          transform='rotate(-10 73 67)'
        />
        <rect
          x='100'
          y='34'
          width='14'
          height='46'
          rx='7'
          fill={`url(#${gradId})`}
        />
        <rect
          x='134'
          y='44'
          width='14'
          height='36'
          rx='7'
          fill={`url(#${gradId})`}
          transform='rotate(8 141 62)'
        />
        <path
          d='M58 96 Q110 44 162 96'
          stroke='#0c3a52'
          strokeWidth='5'
          fill='none'
          strokeLinecap='round'
        />
        <circle cx='58' cy='104' r='11' fill='#0c3a52' />
        <circle cx='162' cy='104' r='11' fill='#0c3a52' />
        <circle cx='88' cy='148' r='7' fill='#053349' />
        <circle cx='91' cy='145' r='2' fill='#bff0ff' />
        <circle cx='122' cy='148' r='7' fill='#053349' />
        <circle cx='125' cy='145' r='2' fill='#bff0ff' />
        <ellipse cx='105' cy='174' rx='10' ry='12' fill='#053349' />
      </g>
      <circle cx='176' cy='152' r='15' fill={`url(#${gradId})`} />
      <g transform='translate(176 118) rotate(8)'>
        <rect x='-16' y='-14' width='32' height='26' rx='4' fill='#f5fbff' />
        <polyline
          points='-11,4 -4,-4 3,0 11,-8'
          stroke='#0ea5e9'
          strokeWidth='2.4'
          fill='none'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </g>
    </svg>
  )
}
