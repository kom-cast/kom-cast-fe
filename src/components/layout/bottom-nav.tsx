import { Bookmark, Home, User } from 'lucide-react'
import { NavLink } from 'react-router-dom'

import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { to: '/home', label: '홈', Icon: Home },
  { to: '/library', label: '보관함', Icon: Bookmark },
  { to: '/my', label: '마이', Icon: User },
]

function BottomNav() {
  return (
    <nav className='fixed inset-x-0 bottom-0 border-t border-border bg-background'>
      <div className='mx-auto flex max-w-sm items-center justify-around py-2'>
        {NAV_ITEMS.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-1 px-4 py-1',
                isActive ? 'text-[#ec6d1e]' : 'text-muted-foreground',
              )
            }
          >
            <Icon className='h-5 w-5' />
            <span className='text-xs font-medium'>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default BottomNav
