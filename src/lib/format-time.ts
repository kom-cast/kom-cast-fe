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

// NOTE: 백엔드 응답의 date 포맷이 엔드포인트마다 달라서(예: "2026.07.26" vs
// "2026-07-26") 프론트에서 "년월일" 표기로 통일함.
export function formatDate(dateString: string): string {
  const date = new Date(dateString.replaceAll('.', '-'))
  if (Number.isNaN(date.getTime())) return dateString
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
}
