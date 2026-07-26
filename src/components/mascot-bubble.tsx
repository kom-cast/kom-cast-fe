import { KomiMascot, KosMascot } from '@/components/icons'

export function MascotBubble({
  mascot,
  color,
  text,
  delaySeconds,
  flip,
}: {
  mascot: 'komi' | 'kos'
  color: string
  text: string
  delaySeconds: number
  flip?: boolean
}) {
  const Mascot = mascot === 'kos' ? KosMascot : KomiMascot

  return (
    <div
      className='flex flex-col items-center opacity-0'
      style={{
        animation: `mascot-pop 0.5s ease-out ${delaySeconds}s forwards`,
      }}
    >
      <span
        className={`mb-1.5 rounded-2xl px-3 py-2 text-xs font-bold whitespace-nowrap text-white ${flip ? 'rounded-br-lg' : 'rounded-bl-lg'}`}
        style={{ backgroundColor: color }}
      >
        {text}
      </span>
      <Mascot className={`h-14 w-auto ${flip ? '-scale-x-100' : ''}`} />
    </div>
  )
}
