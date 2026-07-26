import { useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight, Play, Volume2 } from 'lucide-react'
import { Link } from 'react-router-dom'

import { fetchBriefingHistory } from '@/lib/api'
import { formatDate } from '@/lib/format-time'
import { cn } from '@/lib/utils'
import { BottomNav } from '@/components/layout'

const PAGE_SIZE = 10

export function LibraryPage() {
  const [page, setPage] = useState(0)

  const { data, isLoading, error, refetch, isPlaceholderData } = useQuery({
    queryKey: ['briefingHistory', page],
    queryFn: () => fetchBriefingHistory(page, PAGE_SIZE),
    placeholderData: keepPreviousData,
  })

  const items = data?.content ?? []
  const totalElements = data?.totalElements ?? 0
  const totalPages = data?.totalPages ?? 0

  return (
    <div className='min-h-svh bg-background pb-40'>
      <div className='mx-auto w-full max-w-sm px-5 py-6'>
        <div className='mb-6'>
          <h1 className='text-xl font-bold text-foreground'>보관함</h1>
          <p className='text-sm text-muted-foreground'>
            총 {totalElements}개의 브리핑
          </p>
        </div>

        {isLoading ? (
          <div className='space-y-2'>
            {Array.from({ length: 4 }).map((_, i) => (
              <span
                key={i}
                className='block h-17.5 animate-pulse rounded-2xl bg-muted/50'
              />
            ))}
          </div>
        ) : error ? (
          <div className='flex flex-col items-center gap-3 rounded-2xl bg-muted/50 py-10 text-center'>
            <p className='text-[13px] text-muted-foreground'>
              브리핑 목록을 불러오지 못했어요
            </p>
            <button
              type='button'
              onClick={() => refetch()}
              className='rounded-full bg-background px-4 py-2 text-xs font-semibold text-foreground'
            >
              다시 시도
            </button>
          </div>
        ) : items.length === 0 ? (
          <p className='py-10 text-center text-sm text-muted-foreground'>
            아직 보관된 브리핑이 없어요
          </p>
        ) : (
          <>
            <div
              className={cn(
                'mb-4 overflow-hidden rounded-2xl bg-muted/50 transition-opacity',
                isPlaceholderData && 'opacity-50',
              )}
            >
              {items.map((item, i) => (
                <Link
                  key={item.id}
                  to={`/player/${item.id}`}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-muted',
                    i !== 0 && 'border-t border-background',
                  )}
                >
                  <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-background text-muted-foreground'>
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

            {totalPages > 1 && (
              <div className='flex items-center justify-between'>
                <button
                  type='button'
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  aria-label='이전 페이지'
                  className='flex h-9 w-9 items-center justify-center rounded-full bg-muted/50 text-foreground disabled:opacity-40'
                >
                  <ChevronLeft className='h-4 w-4' />
                </button>
                <span className='font-mono text-xs text-muted-foreground'>
                  {page + 1} / {totalPages}
                </span>
                <button
                  type='button'
                  onClick={() =>
                    setPage((p) => Math.min(totalPages - 1, p + 1))
                  }
                  disabled={page + 1 >= totalPages}
                  aria-label='다음 페이지'
                  className='flex h-9 w-9 items-center justify-center rounded-full bg-muted/50 text-foreground disabled:opacity-40'
                >
                  <ChevronRight className='h-4 w-4' />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
