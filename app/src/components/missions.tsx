import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Car,
  Check,
  ChevronRight,
  CircleDollarSign,
  ClipboardCheck,
  Coins,
  Disc3,
  Flame,
  Fuel,
  Gauge,
  Lightbulb,
  MessageSquareHeart,
  PanelTop,
  PartyPopper,
  ShieldCheck,
  ShieldAlert,
  Ticket,
  Timer,
  Trophy,
  UserPlus,
  type LucideIcon,
} from 'lucide-react'
import {
  checkupItems,
  kmMissionRatio,
  missions,
  periodInfo,
  progressOf,
  survey,
  weeklyStreak,
  type Mission,
  type MissionIcon,
  type MissionPeriod,
} from '../data/missions'
import { useMissionInput, useStore } from '../state/store'
import { Coin } from './locacoins'
import { Button, Sheet, cx } from './ui'

const iconMap: Record<MissionIcon, LucideIcon> = {
  coins: Coins,
  survey: MessageSquareHeart,
  checkup: ClipboardCheck,
  score: Trophy,
  fuel: Fuel,
  fine: ShieldAlert,
  payment: CircleDollarSign,
  km: Gauge,
  friend: UserPlus,
  streak: Flame,
  ticket: Ticket,
  shield: ShieldCheck,
}

export type MissionStatus = 'progress' | 'ready' | 'claimed'

/** Missões com progresso e status calculados */
export function useMissions() {
  const input = useMissionInput()
  const { claimedMissions } = useStore()
  return missions.map((m) => {
    const progress = progressOf(m, input)
    const done = progress.current >= progress.target
    const status: MissionStatus = claimedMissions.includes(m.id) ? 'claimed' : done ? 'ready' : 'progress'
    return { mission: m, progress, status }
  })
}

export function useMissionSummary() {
  const list = useMissions()
  const daily = list.filter((x) => x.mission.period === 'diaria')
  return {
    ready: list.filter((x) => x.status === 'ready'),
    readyCoins: list.filter((x) => x.status === 'ready').reduce((s, x) => s + x.mission.reward, 0),
    dailyDone: daily.filter((x) => x.status !== 'progress').length,
    dailyTotal: daily.length,
  }
}

/* ---------- Cartão de missão ---------- */

function MissionCard({
  mission,
  progress,
  status,
  onAction,
}: {
  mission: Mission
  progress: { current: number; target: number; label?: string }
  status: MissionStatus
  onAction: () => void
}) {
  const { claimMission, showToast } = useStore()
  const [flying, setFlying] = useState(false)
  const Icon = iconMap[mission.icon]
  const info = periodInfo[mission.period]
  const pct = mission.id === 'm-km' ? kmMissionRatio * 100 : (progress.current / progress.target) * 100
  const [open, setOpen] = useState(false)

  const claim = () => {
    if (!claimMission(mission.id, mission.reward)) return
    setFlying(true)
    showToast(`+${mission.reward} LocaCoins: missão “${mission.title}” concluída!`)
    setTimeout(() => setFlying(false), 1200)
  }

  return (
    <div
      className={cx(
        'relative rounded-2xl border bg-white transition',
        status === 'ready' ? 'border-lime-dark shadow-[0_0_0_3px_rgba(116,214,44,.18)]' : 'border-line',
        status === 'claimed' && 'opacity-70',
      )}
    >
      {flying && (
        <span className="anim-float pointer-events-none absolute top-2 right-6 z-10 flex items-center gap-1 text-lg font-extrabold text-[#c48a00]">
          +{mission.reward} <Coin size={18} />
        </span>
      )}
      <div className="flex items-center gap-3 p-3.5">
        <button onClick={() => setOpen(!open)} className="relative shrink-0" aria-label="Detalhes da missão">
          <span className="grid h-12 w-12 place-items-center rounded-2xl" style={{ background: status === 'claimed' ? '#f3f5f3' : info.soft }}>
            <Icon size={22} style={{ color: status === 'claimed' ? '#69716c' : info.color }} />
          </span>
          {status === 'claimed' && (
            <span className="absolute -right-1 -bottom-1 grid h-5 w-5 place-items-center rounded-full bg-lime-dark ring-2 ring-white">
              <Check size={12} strokeWidth={3} className="text-white" />
            </span>
          )}
        </button>
        <button onClick={() => setOpen(!open)} className="min-w-0 flex-1 text-left">
          <p className={cx('text-[15px] leading-tight font-bold', status === 'claimed' && 'line-through decoration-muted/50')}>{mission.title}</p>
          <p className="mt-0.5 text-xs leading-snug text-muted">{mission.description}</p>
        </button>
        <div className="shrink-0">
          {status === 'ready' ? (
            <button
              onClick={claim}
              className="shine relative flex h-9 items-center gap-1 overflow-hidden rounded-xl bg-lime px-3 text-sm font-bold text-brand-dark active:scale-95"
            >
              <Coin size={16} /> +{mission.reward}
            </button>
          ) : status === 'claimed' ? (
            <span className="flex items-center gap-1 text-xs font-bold text-brand">
              <Coin size={14} /> +{mission.reward}
            </span>
          ) : (
            <span className="flex items-center gap-1 rounded-full bg-[#fff1b8] px-2 py-1 text-xs font-extrabold text-[#7a5200]">
              <Coin size={14} /> +{mission.reward}
            </span>
          )}
        </div>
      </div>

      {status === 'progress' && (
        <div className="flex items-center gap-3 px-3.5 pb-3.5">
          <div className="flex-1">
            <div className="h-2 overflow-hidden rounded-full bg-surface">
              <div className="h-full rounded-full transition-all" style={{ width: `${Math.max(pct, 3)}%`, background: info.color }} />
            </div>
            <p className="mt-1 text-[11px] text-muted">{progress.label ?? `${progress.current}/${progress.target}`}</p>
          </div>
          {mission.kind.type !== 'auto' && (
            <Button size="sm" variant="outline" className="h-8 px-3" onClick={onAction}>
              {mission.kind.type === 'goto' ? mission.kind.cta : mission.kind.type === 'survey' ? 'Responder' : 'Fazer'}
              <ChevronRight size={15} />
            </Button>
          )}
        </div>
      )}

      {open && (
        <div className="mx-3.5 mb-3.5 flex gap-2 rounded-xl bg-surface p-3 text-xs text-muted">
          <Lightbulb size={15} className="shrink-0 text-lime-dark" /> {mission.why}
        </div>
      )}
    </div>
  )
}

/* ---------- Painel de missões ---------- */

export function MissionsPanel() {
  const navigate = useNavigate()
  const list = useMissions()
  const { ready, readyCoins } = useMissionSummary()
  const [period, setPeriod] = useState<MissionPeriod>('diaria')
  const [sheet, setSheet] = useState<'survey' | 'checkup' | null>(null)

  const shown = list.filter((x) => x.mission.period === period)
  const done = shown.filter((x) => x.status !== 'progress').length
  const info = periodInfo[period]

  const act = (m: Mission) => {
    if (m.kind.type === 'goto') navigate(m.kind.to)
    else if (m.kind.type === 'survey') setSheet('survey')
    else if (m.kind.type === 'checkup') setSheet('checkup')
  }

  return (
    <div className="px-5 pt-4 pb-8">
      {/* Sequência + pontos a resgatar */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-gradient-to-br from-[#ff8a00] to-[#ff5a1f] p-3.5 text-white">
          <p className="flex items-center gap-1 text-xs font-semibold opacity-90">
            <Flame size={14} /> Sequência
          </p>
          <p className="mt-1 text-2xl leading-none font-extrabold">{weeklyStreak} semanas</p>
          <div className="mt-2 flex gap-1">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className={cx('h-1.5 flex-1 rounded-full', i < weeklyStreak ? 'bg-white' : 'bg-white/30')} />
            ))}
          </div>
          <p className="mt-1.5 text-[10px] opacity-90">4 semanas seguidas = bônus de 200</p>
        </div>
        <div className="rounded-2xl border border-[#f0d77a] bg-gradient-to-br from-[#fff8dc] to-[#fff1b8] p-3.5">
          <p className="flex items-center gap-1 text-xs font-semibold text-[#8a6200]">
            <Trophy size={14} /> Para resgatar
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-2xl leading-none font-extrabold text-[#6b4700]">
            <Coin size={22} /> {readyCoins}
          </p>
          <p className="mt-2 text-[11px] font-medium text-[#8a6200]">
            {ready.length ? `${ready.length} ${ready.length === 1 ? 'missão concluída' : 'missões concluídas'}` : 'Complete missões para ganhar'}
          </p>
        </div>
      </div>

      {/* Períodos */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        {(Object.keys(periodInfo) as MissionPeriod[]).map((p) => {
          const pr = list.filter((x) => x.mission.period === p && x.status === 'ready').length
          const active = period === p
          return (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cx(
                'relative rounded-xl border py-2.5 text-sm font-semibold transition',
                active ? 'border-transparent text-white' : 'border-line bg-white text-ink',
              )}
              style={active ? { background: periodInfo[p].color } : undefined}
            >
              {periodInfo[p].label}
              {pr > 0 && (
                <span className="absolute -top-1.5 -right-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-danger px-1 text-[11px] text-white ring-2 ring-surface">
                  {pr}
                </span>
              )}
            </button>
          )
        })}
      </div>

      <div className="mt-4 mb-2 flex items-center justify-between">
        <p className="text-sm font-bold">
          {done} de {shown.length} concluídas
        </p>
        <p className="flex items-center gap-1 text-xs text-muted">
          <Timer size={13} /> {info.resets}
        </p>
      </div>
      <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-white">
        <div className="h-full rounded-full transition-all" style={{ width: `${(done / shown.length) * 100}%`, background: info.color }} />
      </div>

      {shown.every((x) => x.status === 'claimed') && (
        <div className="anim-fade mb-3 flex items-center gap-3 rounded-2xl p-4 text-white" style={{ background: info.color }}>
          <PartyPopper size={28} className="shrink-0" />
          <div>
            <p className="font-bold">Todas as missões {info.label.toLowerCase()} concluídas!</p>
            <p className="text-xs opacity-90">{info.resets.replace('Renovam', 'Novas missões')}. Continue dirigindo bem 💚</p>
          </div>
        </div>
      )}
      <div className="space-y-3">
        {shown
          .slice()
          .sort((a, b) => order(a.status) - order(b.status))
          .map(({ mission, progress, status }) => (
            <MissionCard key={mission.id} mission={mission} progress={progress} status={status} onAction={() => act(mission)} />
          ))}
      </div>

      <SurveySheet open={sheet === 'survey'} onClose={() => setSheet(null)} />
      <CheckupSheet open={sheet === 'checkup'} onClose={() => setSheet(null)} />
    </div>
  )
}

const order = (s: MissionStatus) => (s === 'ready' ? 0 : s === 'progress' ? 1 : 2)

/* ---------- Pesquisa visual ---------- */

function SurveySheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { update, showToast } = useStore()
  const [choice, setChoice] = useState<string | null>(null)
  return (
    <Sheet open={open} onClose={onClose} title="Pesquisa do dia">
      <p className="text-[15px] font-semibold">{survey.question}</p>
      <div className="mt-4 grid grid-cols-4 gap-2">
        {survey.options.map((o) => (
          <button
            key={o.value}
            onClick={() => setChoice(o.value)}
            className={cx(
              'flex flex-col items-center gap-1 rounded-2xl border py-3 transition',
              choice === o.value ? 'scale-105 border-lime-dark bg-lime-soft' : 'border-line',
            )}
          >
            <span className="text-3xl">{o.emoji}</span>
            <span className="text-[11px] font-medium">{o.label}</span>
          </button>
        ))}
      </div>
      <Button
        block
        className="mt-5"
        disabled={!choice}
        onClick={() => {
          update({ surveyAnswer: choice })
          showToast('Obrigado! Missão concluída, resgate seus LocaCoins.')
          onClose()
        }}
      >
        Enviar resposta
      </Button>
    </Sheet>
  )
}

/* ---------- Check-up do carro ---------- */

const checkIcon: Record<string, LucideIcon> = { disc: Disc3, panel: PanelTop, light: Lightbulb, car: Car }

function CheckupSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate()
  const { update, showToast } = useStore()
  const [answers, setAnswers] = useState<Record<string, boolean>>({})
  const all = checkupItems.every((i) => answers[i.id] !== undefined)
  const problems = checkupItems.filter((i) => answers[i.id] === false)

  return (
    <Sheet open={open} onClose={onClose} title="Check-up rápido">
      <p className="mb-3 text-sm text-muted">Dê uma olhada no seu carro e responda:</p>
      <div className="space-y-2">
        {checkupItems.map((item) => {
          const Icon = checkIcon[item.icon]
          const a = answers[item.id]
          return (
            <div key={item.id} className="flex items-center gap-3 rounded-xl border border-line p-3">
              <Icon size={20} className="shrink-0 text-lime-dark" />
              <span className="flex-1 text-sm">{item.label}</span>
              <div className="flex gap-1">
                <button
                  onClick={() => setAnswers({ ...answers, [item.id]: true })}
                  className={cx('rounded-lg px-2.5 py-1 text-xs font-bold', a === true ? 'bg-lime-dark text-white' : 'bg-surface text-muted')}
                >
                  OK
                </button>
                <button
                  onClick={() => setAnswers({ ...answers, [item.id]: false })}
                  className={cx('rounded-lg px-2.5 py-1 text-xs font-bold', a === false ? 'bg-danger text-white' : 'bg-surface text-muted')}
                >
                  Não
                </button>
              </div>
            </div>
          )
        })}
      </div>
      {problems.length > 0 && (
        <div className="mt-3 rounded-xl bg-warn-soft p-3 text-sm">
          <p className="font-semibold text-warn">Encontramos {problems.length === 1 ? 'um ponto' : `${problems.length} pontos`} de atenção</p>
          <button onClick={() => navigate('/servicos/agendar')} className="mt-1 flex items-center gap-1 font-semibold text-brand">
            Agendar um serviço agora <ChevronRight size={15} />
          </button>
        </div>
      )}
      <Button
        block
        className="mt-4"
        disabled={!all}
        onClick={() => {
          update({ checkupDone: true })
          showToast('Check-up registrado! Resgate seus LocaCoins.')
          onClose()
        }}
      >
        Concluir check-up
      </Button>
    </Sheet>
  )
}
