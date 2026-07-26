export function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60)
  const s = Math.floor(totalSeconds % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

export function formatMinutesSeconds(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60)
  const s = Math.floor(totalSeconds % 60)
  return `${m}분 ${s}초`
}
