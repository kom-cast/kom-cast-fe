import { MOCK_STOCKS } from '@/data/stocks'
import { cn } from '@/lib/utils'

import { Marquee } from './marquee'

export function StockTickerMarquee({
  durationSeconds = 42,
}: {
  durationSeconds?: number
}) {
  const stocks = MOCK_STOCKS.slice(0, 7)

  return (
    <Marquee durationSeconds={durationSeconds} direction='left'>
      {stocks.map((stock) => {
        const isUp = stock.change >= 0
        return (
          <span
            key={stock.name}
            className='flex shrink-0 items-center gap-2 rounded-xl border border-[#eef1f4] bg-white px-3 py-2 shadow-[0_2px_10px_rgba(15,23,42,0.04)]'
          >
            <span>
              <span className='block text-[12px] font-bold whitespace-nowrap text-[#191f28]'>
                {stock.name}
              </span>
              <span className='block font-mono text-[9px] text-[#b0b8c1]'>
                {stock.code}
              </span>
            </span>
            <span
              className={cn(
                'rounded-md px-1.5 py-0.5 font-mono text-[11px] font-bold whitespace-nowrap',
                isUp
                  ? 'bg-[#feeced] text-[#f04452]'
                  : 'bg-[#eaf2ff] text-[#3182f6]',
              )}
            >
              {isUp ? '▲' : '▼'} {Math.abs(stock.change)}%
            </span>
          </span>
        )
      })}
    </Marquee>
  )
}
