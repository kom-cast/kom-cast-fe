import { useId } from 'react'

export function KosMascot({ className }: { className?: string }) {
  const gradId = useId()

  return (
    <svg viewBox='0 0 220 260' className={className} aria-hidden='true'>
      <defs>
        <linearGradient id={gradId} x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor='#ffb067' />
          <stop offset='100%' stopColor='#e85d00' />
        </linearGradient>
      </defs>
      <ellipse cx='110' cy='243' rx='22' ry='5' fill='#000' opacity='0.25' />
      <rect
        x='45'
        y='90'
        width='130'
        height='140'
        rx='65'
        fill={`url(#${gradId})`}
      />
      <rect
        x='70'
        y='46'
        width='14'
        height='34'
        rx='7'
        fill={`url(#${gradId})`}
      />
      <rect
        x='103'
        y='38'
        width='14'
        height='42'
        rx='7'
        fill={`url(#${gradId})`}
      />
      <rect
        x='136'
        y='46'
        width='14'
        height='34'
        rx='7'
        fill={`url(#${gradId})`}
      />
      <circle cx='150' cy='176' r='16' fill={`url(#${gradId})`} />
      <rect x='140' y='150' width='20' height='20' rx='10' fill='#2a1c12' />
      <circle cx='150' cy='150' r='13' fill='#2a1c12' />
      <circle cx='146' cy='147' r='1.6' fill='#5a4230' />
      <circle cx='151' cy='145' r='1.6' fill='#5a4230' />
      <circle cx='154' cy='150' r='1.6' fill='#5a4230' />
      <circle cx='148' cy='153' r='1.6' fill='#5a4230' />
      <path
        d='M78 148 q6 7 12 0'
        stroke='#5a2e0c'
        strokeWidth='3'
        fill='none'
        strokeLinecap='round'
      />
      <path
        d='M104 148 q6 7 12 0'
        stroke='#5a2e0c'
        strokeWidth='3'
        fill='none'
        strokeLinecap='round'
      />
      <path
        d='M88 172 q14 8 28 0'
        stroke='#5a2e0c'
        strokeWidth='3'
        fill='none'
        strokeLinecap='round'
      />
    </svg>
  )
}
