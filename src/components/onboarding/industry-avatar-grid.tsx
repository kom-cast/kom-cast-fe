import { Check } from 'lucide-react'

import {
  DEFAULT_INDUSTRY_ICON,
  INDUSTRY_ICONS,
} from '@/data/onboarding-industries'
import { cn } from '@/lib/utils'

export function IndustryAvatarGrid({
  options,
  selected,
  onChange,
  scrollable = true,
}: {
  options: string[]
  selected: string[]
  onChange: (next: string[]) => void
  // NOTE: 온보딩은 위아래 고정 영역(헤더/버튼) 사이에 낀 레이아웃이라 내부 스크롤이 필요하지만,
  // 설정 페이지처럼 페이지 자체가 스크롤되는 곳에서는 굳이 높이를 제한할 필요 없음.
  scrollable?: boolean
}) {
  function toggleIndustry(name: string) {
    onChange(
      selected.includes(name)
        ? selected.filter((s) => s !== name)
        : [...selected, name],
    )
  }

  const grid = (
    <div
      className={cn(
        'grid grid-cols-3 gap-x-2.5 gap-y-4.5 p-1',
        scrollable && 'pr-3',
      )}
    >
      {options.map((name) => {
        const Icon = INDUSTRY_ICONS[name] ?? DEFAULT_INDUSTRY_ICON
        const isSelected = selected.includes(name)
        return (
          <button
            key={name}
            type='button'
            onClick={() => toggleIndustry(name)}
            className='flex flex-col items-center gap-2 active:scale-[0.94]'
          >
            <span
              className={cn(
                'relative flex h-22 w-22 items-center justify-center rounded-full transition-colors',
                isSelected
                  ? 'bg-brand shadow-[0_0_0_3px_white,0_0_0_5px_var(--brand)]'
                  : 'bg-[#191f28]',
              )}
            >
              <Icon className='h-7 w-7 text-white' strokeWidth={1.8} />
              {isSelected && (
                <span className='absolute -top-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-[0_0_0_2px_rgba(15,23,42,0.12)]'>
                  <Check
                    className='h-2.5 w-2.5 text-[#111]'
                    strokeWidth={3.5}
                  />
                </span>
              )}
            </span>
            <span
              className={cn(
                'text-center text-[12.5px] leading-tight font-bold',
                isSelected ? 'text-[#191f28]' : 'text-[#8b95a1]',
              )}
            >
              {name}
            </span>
          </button>
        )
      })}
    </div>
  )

  if (!scrollable) {
    return grid
  }

  return (
    <div
      className={cn(
        '-mr-3 max-h-110 overflow-y-auto',
        '[&::-webkit-scrollbar]:w-1',
        '[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#e5e8eb]',
      )}
    >
      {grid}
    </div>
  )
}
