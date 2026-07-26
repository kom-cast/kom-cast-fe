import { Play, Volume2 } from 'lucide-react'
import { Link } from 'react-router-dom'

import { type RemoteBriefingListItem } from '@/lib/api'
import { formatDate } from '@/lib/format-time'

export function RecentLibrarySection({
  items,
  isLoading,
  error,
  onRetry,
}: {
  items: RemoteBriefingListItem[]
  isLoading: boolean
  error: string | null
  onRetry: () => void
}) {
  return (
    <>
      <div className='mb-3 flex items-center justify-between'>
        <p className='text-base font-semibold text-foreground'>최근 보관함</p>
        <Link to='/library' className='text-sm text-muted-foreground'>
          전체보기
        </Link>
      </div>
      {isLoading ? (
        <div className='space-y-2'>
          {Array.from({ length: 2 }).map((_, i) => (
            <span
              key={i}
              className='block h-17.5 animate-pulse rounded-2xl bg-muted/50'
            />
          ))}
        </div>
      ) : error ? (
        <div className='flex flex-col items-center gap-3 rounded-2xl bg-muted/50 py-8 text-center'>
          <p className='text-[13px] text-muted-foreground'>
            보관함을 불러오지 못했어요
          </p>
          <button
            type='button'
            onClick={onRetry}
            className='rounded-full bg-background px-4 py-2 text-xs font-semibold text-foreground'
          >
            다시 시도
          </button>
        </div>
      ) : items.length === 0 ? (
        <p className='rounded-2xl bg-muted/50 py-8 text-center text-sm text-muted-foreground'>
          아직 보관된 브리핑이 없어요
        </p>
      ) : (
        <div className='space-y-2'>
          {items.map((item) => (
            <Link
              key={item.id}
              to={`/player/${item.id}`}
              className='flex items-center gap-3 rounded-2xl bg-muted/50 px-4 py-3.5 transition-colors hover:bg-muted'
            >
              <span className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-background text-muted-foreground'>
                <Volume2 className='h-4 w-4' />
              </span>
              <div className='min-w-0 flex-1'>
                <p className='text-xs text-muted-foreground'>
                  {formatDate(item.date)}
                </p>
                <p className='truncate text-sm font-medium text-foreground'>
                  {item.headline}
                </p>
                <p className='text-xs text-muted-foreground'>
                  {item.duration}분 브리핑
                </p>
              </div>
              <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand'>
                <Play className='h-4 w-4 fill-current' />
              </span>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
