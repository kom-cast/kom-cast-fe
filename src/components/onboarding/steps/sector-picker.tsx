import { useOnboarding } from '@/context/onboarding-context'
import { SECTORS } from '@/data/sectors'
import { cn } from '@/lib/utils'

function SectorPicker() {
  const { sectors, setSectors } = useOnboarding()

  function toggleSector(sector: string) {
    setSectors(
      sectors.includes(sector)
        ? sectors.filter((s) => s !== sector)
        : [...sectors, sector],
    )
  }

  return (
    <div className='space-y-2.5'>
      <p className='text-sm font-medium text-foreground'>관심 분야</p>
      <div className='flex flex-wrap gap-2'>
        {SECTORS.map((sector) => {
          const isSelected = sectors.includes(sector)
          return (
            <button
              key={sector}
              type='button'
              onClick={() => toggleSector(sector)}
              className={cn(
                'rounded-full px-3.5 py-2 text-sm font-medium transition-colors',
                isSelected
                  ? 'bg-[#ec6d1e] text-white'
                  : 'bg-muted text-foreground hover:bg-muted/70',
              )}
            >
              {sector}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default SectorPicker
