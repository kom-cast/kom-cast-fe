import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

interface OnboardingState {
  nickname: string
  portfolio: string[]
  interests: string[]
  sectors: string[]
  includeKeywords: string[]
  excludeKeywords: string[]
  freeText: string
  briefingHour: number
  briefingMinute: number
  briefingDuration: string
  voice: string
  skippedAny: boolean
  notifyBriefing: boolean
  notifyPriceAlert: boolean
  notifyMarketing: boolean
}

const DEFAULT_STATE: OnboardingState = {
  nickname: '민준',
  portfolio: [],
  interests: [],
  sectors: [],
  includeKeywords: [],
  excludeKeywords: [],
  freeText: '',
  briefingHour: 7,
  briefingMinute: 30,
  briefingDuration: '10',
  voice: 'jieun',
  skippedAny: false,
  notifyBriefing: true,
  notifyPriceAlert: true,
  notifyMarketing: false,
}

const STORAGE_KEY = 'komcast-onboarding'

interface OnboardingContextValue extends OnboardingState {
  setNickname: (next: string) => void
  setPortfolio: (next: string[]) => void
  setInterests: (next: string[]) => void
  setSectors: (next: string[]) => void
  setIncludeKeywords: (next: string[]) => void
  setExcludeKeywords: (next: string[]) => void
  setFreeText: (next: string) => void
  setBriefingHour: (next: number) => void
  setBriefingMinute: (next: number) => void
  setBriefingDuration: (next: string) => void
  setVoice: (next: string) => void
  setNotifyBriefing: (next: boolean) => void
  setNotifyPriceAlert: (next: boolean) => void
  setNotifyMarketing: (next: boolean) => void
  markSkipped: () => void
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null)

function loadState(): OnboardingState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_STATE
    return { ...DEFAULT_STATE, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_STATE
  }
}

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OnboardingState>(loadState)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const value: OnboardingContextValue = {
    ...state,
    setNickname: (nickname) => setState((s) => ({ ...s, nickname })),
    setPortfolio: (portfolio) => setState((s) => ({ ...s, portfolio })),
    setInterests: (interests) => setState((s) => ({ ...s, interests })),
    setSectors: (sectors) => setState((s) => ({ ...s, sectors })),
    setIncludeKeywords: (includeKeywords) =>
      setState((s) => ({ ...s, includeKeywords })),
    setExcludeKeywords: (excludeKeywords) =>
      setState((s) => ({ ...s, excludeKeywords })),
    setFreeText: (freeText) => setState((s) => ({ ...s, freeText })),
    setBriefingHour: (briefingHour) =>
      setState((s) => ({ ...s, briefingHour })),
    setBriefingMinute: (briefingMinute) =>
      setState((s) => ({ ...s, briefingMinute })),
    setBriefingDuration: (briefingDuration) =>
      setState((s) => ({ ...s, briefingDuration })),
    setVoice: (voice) => setState((s) => ({ ...s, voice })),
    setNotifyBriefing: (notifyBriefing) =>
      setState((s) => ({ ...s, notifyBriefing })),
    setNotifyPriceAlert: (notifyPriceAlert) =>
      setState((s) => ({ ...s, notifyPriceAlert })),
    setNotifyMarketing: (notifyMarketing) =>
      setState((s) => ({ ...s, notifyMarketing })),
    markSkipped: () => setState((s) => ({ ...s, skippedAny: true })),
  }

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext)
  if (!ctx) {
    throw new Error('useOnboarding must be used within OnboardingProvider')
  }
  return ctx
}
