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
  industries: string[]
}

const DEFAULT_STATE: OnboardingState = {
  nickname: '윤주',
  portfolio: [],
  industries: [],
}

const STORAGE_KEY = 'komcast-onboarding'

interface OnboardingContextValue extends OnboardingState {
  setNickname: (next: string) => void
  setPortfolio: (next: string[]) => void
  setIndustries: (next: string[]) => void
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
    setIndustries: (industries) => setState((s) => ({ ...s, industries })),
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
