import {
  BatteryCharging,
  Bot,
  Building2,
  Car,
  Clapperboard,
  Cpu,
  FlaskConical,
  Gamepad2,
  HeartPulse,
  Landmark,
  Layers,
  Shield,
  ShoppingBag,
  Signal,
  Zap,
  type LucideIcon,
} from 'lucide-react'

// NOTE: 산업군 이름 자체는 GET /sectors로 받아오고, 아이콘만 로컬에서 매핑함
// 매핑에 없는 이름이 오면 DEFAULT_INDUSTRY_ICON으로 대체
export const INDUSTRY_ICONS: Record<string, LucideIcon> = {
  반도체: Cpu,
  '2차전지': BatteryCharging,
  '바이오/헬스케어': HeartPulse,
  금융: Landmark,
  'AI/빅테크': Bot,
  자동차: Car,
  엔터테인먼트: Clapperboard,
  게임: Gamepad2,
  화학: FlaskConical,
  '건설/부동산': Building2,
  에너지: Zap,
  소비재: ShoppingBag,
  통신: Signal,
  방산: Shield,
}

export const DEFAULT_INDUSTRY_ICON: LucideIcon = Layers
