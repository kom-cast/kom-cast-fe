import axios from 'axios'

// NOTE: komcast-tts(실시간 합성) 서버. kom-cast-be가 아직 오늘의 브리핑을 안정적으로
// 못 내려줄 때 API 테스트용으로 직접 호출해보기 위해 남겨둠 (mock-briefing.ts 참고).
// 코드는 briefings.ts/createBriefing 하나로만 한정해서 씀. 새 화면에서 데이터가 필요하면
// kom-cast-be 쪽에 요청하는 게 맞음.
export const TTS_API_BASE_URL =
  import.meta.env.VITE_TTS_API_BASE_URL ?? 'http://localhost:8000'

export const ttsApiClient = axios.create({
  baseURL: TTS_API_BASE_URL,
})
