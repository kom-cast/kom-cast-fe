import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  deleteMyStock,
  getAllStocks,
  getMyStocks,
  registerMyStock,
  type RemoteStock,
} from '@/lib/api'
import { PortfolioStepContent, StockButton } from '@/components/onboarding'
import { SettingsLayout } from '@/components/settings'

export function StocksSettingsPage() {
  const queryClient = useQueryClient()

  const {
    data: allStocks = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['stocks'],
    queryFn: getAllStocks,
  })

  const { data: myStocks = [] } = useQuery({
    queryKey: ['myStocks'],
    queryFn: getMyStocks,
  })

  const codesByName = new Map(allStocks.map((s) => [s.name, s.code]))
  const stocksByCode = new Map(allStocks.map((s) => [s.code, s]))
  const selected = myStocks.map((s) => s.name)

  // NOTE: 응답을 기다리지 않고 목록에 바로 반영(낙관적 업데이트)하고,
  // 실패하면 onError에서 원래 상태로 되돌림.
  const addMutation = useMutation({
    mutationFn: (code: string) => registerMyStock(code, 'PORTFOLIO'),
    onMutate: async (code) => {
      await queryClient.cancelQueries({ queryKey: ['myStocks'] })
      const previous = queryClient.getQueryData<RemoteStock[]>(['myStocks'])
      const stock = stocksByCode.get(code)
      if (stock) {
        queryClient.setQueryData<RemoteStock[]>(['myStocks'], (old = []) => [
          ...old,
          stock,
        ])
      }
      return { previous }
    },
    onError: (_err, _code, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['myStocks'], context.previous)
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['myStocks'] }),
  })

  const removeMutation = useMutation({
    mutationFn: (code: string) => deleteMyStock(code),
    onMutate: async (code) => {
      await queryClient.cancelQueries({ queryKey: ['myStocks'] })
      const previous = queryClient.getQueryData<RemoteStock[]>(['myStocks'])
      queryClient.setQueryData<RemoteStock[]>(['myStocks'], (old = []) =>
        old.filter((s) => s.code !== code),
      )
      return { previous }
    },
    onError: (_err, _code, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['myStocks'], context.previous)
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['myStocks'] }),
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
    <SettingsLayout title='보유종목 관리'>
      <p className='mb-2.5 text-[12.5px] font-semibold text-[#8b95a1]'>
        보유 중 ({myStocks.length}개)
      </p>
      {myStocks.length === 0 ? (
        <p className='mb-6 text-[13px] text-[#8b95a1]'>
          아직 등록한 종목이 없어요. 아래에서 추가해보세요.
        </p>
      ) : (
        <div className='mb-6 flex flex-wrap gap-2'>
          {myStocks.map((stock) => (
            <StockButton
              key={stock.name}
              stock={stock}
              isSelected
              onToggle={() => removeMutation.mutate(stock.code)}
            />
          ))}
        </div>
      )}

      <div className='mb-5 h-px bg-[#eef1f4]' />

      <PortfolioStepContent
        stocks={allStocks}
        selected={selected}
        onChange={handleChange}
        isLoading={isLoading}
        error={error instanceof Error ? error.message : null}
        onRetry={() => refetch()}
      />
    </SettingsLayout>
  )
}
