import { type Stock } from '@/data/stocks'

import {
  createBriefing,
  type Briefing,
  type BriefingTarget,
  type DialogueLine,
} from './api'

// NOTE: 실제 서비스에서는 프론트가 대본을 만들어 TTS에 요청하는 일이 없음.
// kom-cast-be가 생성·저장까지 끝낸 브리핑을 fetchTodayBriefing/fetchBriefingById로
// 받아오기만 하면 됨. 여기 있는 함수들은 kom-cast-be가 아직 불안정하거나 안 될 때
// komcast-tts를 프론트에서 직접 호출해 API 테스트를 해볼 수 있도록 남겨둔 임시
// 스위치용 mock임 (player-context.tsx의 USE_MOCK_TODAY_BRIEFING 참고).

// NOTE: 산업군 코드는 GET /industries로만 확인 가능해서 mock에선 임의 코드를 씀.
const MOCK_INDUSTRY_TARGET: BriefingTarget = {
  type: 'INDUSTRY',
  industry_code: 'BATTERY',
}
const USER_TARGET: BriefingTarget = { type: 'USER' }

function stockTarget(stock: Stock): BriefingTarget {
  return { type: 'STOCK', stock_code: stock.code }
}

function buildMockDialogueLines(
  stock0: Stock,
  stock1: Stock,
  stock2: Stock | undefined,
): DialogueLine[] {
  return [
    {
      speaker: '코스',
      target: USER_TARGET,
      text: `안녕하세요, 오늘의 증시 브리핑을 시작하겠습니다. 코미님, 오늘 가장 눈에 띄는 소식은 뭔가요?`,
    },
    {
      speaker: '코미',
      target: stockTarget(stock0),
      text: `${stock0.name}가 2분기 잠정 실적을 발표했는데요, 매출이 전년 동기 대비 23% 증가한 74조원을 기록했습니다.`,
    },
    {
      speaker: '코스',
      target: stockTarget(stock1),
      text: `${stock1.name}는 어떤가요?`,
    },
    {
      speaker: '코미',
      target: stockTarget(stock1),
      text: `${stock1.name}는 메모리 가격 상승에 힘입어 목표주가가 상향 조정됐습니다.`,
    },
    {
      speaker: '코스',
      target: MOCK_INDUSTRY_TARGET,
      text: `2차전지 산업군 얘기도 빠질 수 없죠.`,
    },
    {
      speaker: '코미',
      target: MOCK_INDUSTRY_TARGET,
      text: `네, 2차전지 산업군 전반이 반등하며 관련주들이 강세를 보이고 있습니다.`,
    },
    {
      speaker: '코스',
      target: stock2 ? stockTarget(stock2) : USER_TARGET,
      text: `${stock2?.name ?? '시장'} 관련 이슈를 마지막으로 오늘 브리핑을 마치겠습니다. 코미님, 수고하셨습니다.`,
    },
    {
      speaker: '코미',
      target: USER_TARGET,
      text: `네, 수고하셨습니다.`,
    },
  ]
}

export function createMockBriefing(
  id: string,
  stock0: Stock,
  stock1: Stock,
  stock2: Stock | undefined,
): Promise<Briefing> {
  return createBriefing(id, buildMockDialogueLines(stock0, stock1, stock2))
}
