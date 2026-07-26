import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  deleteMySector,
  getAllSectors,
  getMySectors,
  registerMySector,
} from '@/lib/api'
import { SectorsStepContent } from '@/components/onboarding'
import { SettingsLayout } from '@/components/settings'

export function SectorsSettingsPage() {
  const queryClient = useQueryClient()

  const {
    data: sectorOptions = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['sectors'],
    queryFn: getAllSectors,
  })

  const { data: mySectors = [] } = useQuery({
    queryKey: ['mySectors'],
    queryFn: getMySectors,
  })

  // NOTE: 응답을 기다리지 않고 목록에 바로 반영(낙관적 업데이트)하고,
  // 실패하면 onError에서 원래 상태로 되돌림.
  const addMutation = useMutation({
    mutationFn: (sector: string) => registerMySector(sector),
    onMutate: async (sector) => {
      await queryClient.cancelQueries({ queryKey: ['mySectors'] })
      const previous = queryClient.getQueryData<string[]>(['mySectors'])
      queryClient.setQueryData<string[]>(['mySectors'], (old = []) => [
        ...old,
        sector,
      ])
      return { previous }
    },
    onError: (_err, _sector, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['mySectors'], context.previous)
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['mySectors'] }),
  })

  const removeMutation = useMutation({
    mutationFn: (sector: string) => deleteMySector(sector),
    onMutate: async (sector) => {
      await queryClient.cancelQueries({ queryKey: ['mySectors'] })
      const previous = queryClient.getQueryData<string[]>(['mySectors'])
      queryClient.setQueryData<string[]>(['mySectors'], (old = []) =>
        old.filter((s) => s !== sector),
      )
      return { previous }
    },
    onError: (_err, _sector, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['mySectors'], context.previous)
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['mySectors'] }),
  })

  // NOTE: 그리드는 전체 선택 배열을 넘겨주므로, 이전 선택과 비교해서
  // 추가/삭제된 단건만 골라 그 항목만 API로 반영함.
  function handleChange(next: string[]) {
    const added = next.find((name) => !mySectors.includes(name))
    const removed = mySectors.find((name) => !next.includes(name))

    if (added) addMutation.mutate(added)
    if (removed) removeMutation.mutate(removed)
  }

  return (
    <SettingsLayout title='관심섹터 수정'>
      <SectorsStepContent
        sectors={sectorOptions}
        selected={mySectors}
        onChange={handleChange}
        isLoading={isLoading}
        error={error instanceof Error ? error.message : null}
        onRetry={() => refetch()}
        scrollable={false}
      />
    </SettingsLayout>
  )
}
