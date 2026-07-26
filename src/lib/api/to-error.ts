import { isAxiosError } from 'axios'

export function toError(err: unknown, action: string): Error {
  if (isAxiosError(err)) {
    return new Error(
      `${action} 실패 (${err.response?.status ?? 'network error'})`,
    )
  }
  return err instanceof Error ? err : new Error(String(err))
}
