import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { referrals as initialReferrals, type Referral } from '../data/mock'
import { makeCode, rewardById } from '../data/rewards'

// Estado da conta mock, persistido no navegador para a demo sobreviver a recarregamentos.

type Maintenance = { services: string[]; workshopId: string; createdAt: string }
type Occurrence = { protocol: string; kind: string; createdAt: string }
export type RedeemedReward = { id: string; rewardId: string; code: string; cost: number; redeemedAt: string; used: boolean }

type AppState = {
  loggedIn: boolean
  paidCharges: string[]
  indicatedFines: string[]
  referrals: Referral[]
  maintenance: Maintenance | null
  occurrence: Occurrence | null
  alerts: { ignition: boolean; movement: boolean }
  /** Saldo da carteira LocaCoins */
  coins: number
  /** Dias de telemetria (AAAA-MM-DD) cujos pontos já foram resgatados */
  claimedDays: string[]
  /** Abre o resumo do último dia na Home (ligado a cada login) */
  showDailyReport: boolean
  /** Cupons trocados por LocaCoins */
  redeemed: RedeemedReward[]
  /** Missões cujos LocaCoins já foram resgatados */
  claimedMissions: string[]
  surveyAnswer: string | null
  checkupDone: boolean
}

const STORAGE_KEY = 'meoo-mvp-state-v1'

const initialState: AppState = {
  loggedIn: false,
  paidCharges: [],
  indicatedFines: [],
  referrals: initialReferrals,
  maintenance: null,
  occurrence: null,
  alerts: { ignition: false, movement: false },
  coins: 0,
  claimedDays: [],
  showDailyReport: false,
  redeemed: [],
  claimedMissions: [],
  surveyAnswer: null,
  checkupDone: false,
}

function load(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...initialState, ...JSON.parse(raw) }
  } catch {
    // storage indisponível: segue com o estado inicial
  }
  return initialState
}

type Store = AppState & {
  update: (patch: Partial<AppState> | ((s: AppState) => Partial<AppState>)) => void
  reset: () => void
  /** Resgata os LocaCoins de um dia; ignora se já foi resgatado */
  claimDay: (dayId: string, amount: number) => boolean
  /** Troca LocaCoins por um cupom; retorna o cupom ou null se o saldo não der */
  redeemReward: (rewardId: string) => RedeemedReward | null
  /** Resgata os LocaCoins de uma missão completa; ignora se já foi resgatada */
  claimMission: (missionId: string, amount: number) => boolean
  toast: string | null
  showToast: (msg: string) => void
}

const StoreContext = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(load)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // ignora falha de escrita
    }
  }, [state])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2200)
    return () => clearTimeout(t)
  }, [toast])

  const update = useCallback<Store['update']>((patch) => {
    setState((s) => ({ ...s, ...(typeof patch === 'function' ? patch(s) : patch) }))
  }, [])

  const reset = useCallback(() => setState({ ...initialState, loggedIn: true, showDailyReport: true }), [])

  const claimDay = useCallback(
    (dayId: string, amount: number) => {
      if (state.claimedDays.includes(dayId)) return false
      setState((s) =>
        s.claimedDays.includes(dayId) ? s : { ...s, coins: s.coins + amount, claimedDays: [...s.claimedDays, dayId] },
      )
      return true
    },
    [state.claimedDays],
  )

  const redeemReward = useCallback(
    (rewardId: string) => {
      const reward = rewardById(rewardId)
      if (!reward || state.coins < reward.cost) return null
      const item: RedeemedReward = {
        id: `${rewardId}-${Date.now()}`,
        rewardId,
        code: makeCode(reward.codePrefix),
        cost: reward.cost,
        redeemedAt: new Date().toISOString(),
        used: false,
      }
      setState((s) => (s.coins < reward.cost ? s : { ...s, coins: s.coins - reward.cost, redeemed: [item, ...s.redeemed] }))
      return item
    },
    [state.coins],
  )

  const claimMission = useCallback(
    (missionId: string, amount: number) => {
      if (state.claimedMissions.includes(missionId)) return false
      setState((s) =>
        s.claimedMissions.includes(missionId)
          ? s
          : { ...s, coins: s.coins + amount, claimedMissions: [...s.claimedMissions, missionId] },
      )
      return true
    },
    [state.claimedMissions],
  )

  const value = useMemo(
    () => ({ ...state, update, reset, claimDay, redeemReward, claimMission, toast, showToast: setToast }),
    [state, update, reset, claimDay, redeemReward, claimMission, toast],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore precisa estar dentro de StoreProvider')
  return ctx
}

/** Entrada das missões a partir do estado atual */
export function useMissionInput() {
  const s = useStore()
  return {
    claimedDays: s.claimedDays,
    paidCharges: s.paidCharges,
    indicatedFines: s.indicatedFines,
    referralsCount: s.referrals.length,
    redeemedCount: s.redeemed.length,
    alertsOn: s.alerts.ignition || s.alerts.movement,
    surveyAnswer: s.surveyAnswer,
    checkupDone: s.checkupDone,
  }
}
