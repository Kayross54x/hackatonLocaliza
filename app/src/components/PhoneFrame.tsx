import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { user } from '../data/mock'
import { useStore } from '../state/store'
import { Toast } from './ui'

/**
 * No celular ocupa a tela inteira. No computador desenha uma moldura de iPhone
 * para a apresentação, com um painel lateral de controle da demo.
 */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full items-center justify-center gap-10 sm:p-6">
      <div className="relative h-full w-full overflow-hidden bg-white sm:h-[844px] sm:max-h-[calc(100vh-48px)] sm:w-[390px] sm:rounded-[48px] sm:border-[10px] sm:border-[#111] sm:shadow-2xl">
        <StatusBar />
        <div className="relative h-full sm:h-[calc(100%-44px)]">
          {children}
          <Toast />
        </div>
      </div>
      <DemoPanel />
    </div>
  )
}

function StatusBar() {
  return (
    <div className="relative hidden h-11 items-center justify-between bg-white px-7 text-[15px] font-semibold sm:flex">
      <span>9:41</span>
      <span className="absolute left-1/2 top-2 h-7 w-28 -translate-x-1/2 rounded-full bg-[#111]" />
      <span className="flex items-center gap-1.5">
        <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor">
          <rect x="0" y="7" width="3" height="4" rx="1" />
          <rect x="4.5" y="5" width="3" height="6" rx="1" />
          <rect x="9" y="2.5" width="3" height="8.5" rx="1" />
          <rect x="13.5" y="0" width="3" height="11" rx="1" />
        </svg>
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
          <rect x="0.5" y="0.5" width="21" height="11" rx="3" stroke="currentColor" opacity=".4" />
          <rect x="2" y="2" width="16" height="8" rx="1.8" fill="currentColor" />
          <rect x="23" y="4" width="1.5" height="4" rx=".7" fill="currentColor" opacity=".4" />
        </svg>
      </span>
    </div>
  )
}

function DemoPanel() {
  const { reset, update, loggedIn } = useStore()
  const navigate = useNavigate()
  return (
    <aside className="hidden w-64 rounded-2xl bg-white/70 p-5 text-sm text-ink shadow-sm backdrop-blur lg:block">
      <img src="/img/logo-assinatura.png" alt="" className="mb-4 h-7" />
      <p className="mb-1 font-bold text-brand">MVP · LocaCoins</p>
      <p className="mb-4 text-muted">
        Conta de demonstração: <b>{user.name}</b>. Todos os dados são fictícios e ficam salvos só neste navegador.
      </p>
      <div className="space-y-2">
        <button
          onClick={() => {
            reset()
            navigate('/')
          }}
          className="w-full rounded-lg border border-line bg-white px-3 py-2 text-left hover:bg-surface"
        >
          ↺ Reiniciar dados da demo
        </button>
        <button
          onClick={() => {
            update({ loggedIn: !loggedIn, showDailyReport: !loggedIn })
            navigate(loggedIn ? '/boas-vindas' : '/')
          }}
          className="w-full rounded-lg border border-line bg-white px-3 py-2 text-left hover:bg-surface"
        >
          {loggedIn ? '⎋ Sair (ver tela de login)' : '→ Entrar direto'}
        </button>
      </div>
    </aside>
  )
}
