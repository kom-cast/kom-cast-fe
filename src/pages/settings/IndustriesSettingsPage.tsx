import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  deleteMyIndustry,
  getAllIndustries,
  getMyIndustries,
  registerMyIndustry,
  type RemoteIndustry,
} from '@/lib/api'
import { IndustriesStepContent } from '@/components/onboarding'
import { SettingsLayout } from '@/components/settings'

export function IndustriesSettingsPage() {
  const queryClient = useQueryClient()

  const {
    data: allIndustries = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['industries'],
    queryFn: getAllIndustries,
  })

  const { data: myIndustries = [] } = useQuery({
    queryKey: ['myIndustries'],
    queryFn: getMyIndustries,
  })

  const codesByName = new Map(allIndustries.map((i) => [i.name, i.code]))
  const industryOptions = allIndustries.map((i) => i.name)
  const selected = myIndustries.map((i) => i.name)

  // NOTE: 응답을 기다리지 않고 목록에 바로 반영(낙관적 업데이트)하고,
  // 실패하면 onError에서 원래 상태로 되돌림.
  const addMutation = useMutation({
    mutationFn: (code: string) => registerMyIndustry(code),
    onMutate: async (code) => {
      await queryClient.cancelQueries({ queryKey: ['myIndustries'] })
      const previous = queryClient.getQueryData<RemoteIndustry[]>([
        'myIndustries',
      ])
      const industry = allIndustries.find((i) => i.code === code)
      if (industry) {
        queryClient.setQueryData<RemoteIndustry[]>(
          ['myIndustries'],
          (old = []) => [...old, industry],
        )
      }
      return { previous }
    },
    onError: (_err, _code, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['myIndustries'], context.previous)
      }
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ['myIndustries'] }),
  })

  const removeMutation = useMutation({
    mutationFn: (code: string) => deleteMyIndustry(code),
    onMutate: async (code) => {
      await queryClient.cancelQueries({ queryKey: ['myIndustries'] })
      const previous = queryClient.getQueryData<RemoteIndustry[]>([
        'myIndustries',
      ])
      queryClient.setQueryData<RemoteIndustry[]>(['myIndustries'], (old = []) =>
        old.filter((i) => i.code !== code),
      )
      return { previous }
    },
    onError: (_err, _code, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['myIndustries'], context.previous)
      }
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ['myIndustries'] }),
  })

  // NOTE: 그리드는 전체 선택 배열을 넘겨주므로, 이전 선택과 비교해서
  // 추가/삭제된 단건만 골라 그 항목만 API로 반영함.
  function handleChange(next: string[]) {
    const addedName = next.find((name) => !selected.includes(name))
    const removedName = selected.find((name) => !next.includes(name))

    const addedCode = addedName ? codesByName.get(addedName) : undefined
    if (addedCode) addMutation.mutate(addedCode)

    const removedCode = removedName ? codesByName.get(removedName) : undefined
    if (removedCode) removeMutation.mutate(removedCode)
  }

  return (
    <SettingsLayout title='관심 산업군 수정'>
      <IndustriesStepContent
        industries={industryOptions}
        selected={selected}
        onChange={handleChange}
        isLoading={isLoading}
        error={error instanceof Error ? error.message : null}
        onRetry={() => refetch()}
        scrollable={false}
      />
    </SettingsLayout>
  )
}
