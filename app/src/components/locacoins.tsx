import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, ChevronDown, Clock, Fuel, Gauge, Leaf, Route, Sparkles, X } from 'lucide-react'
import { coinTiers, coinsFor, fleetAverage, formatDayLong, tierFor, type DayReport } from '../data/telemetry'
import { useStore } from '../state/store'
import { cx } from './ui'

/* ---------- Moeda e saldo ---------- */

export function Coin({ size = 20, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={cx('shrink-0', className)} aria-hidden>
      <defs>
        <linearGradient id="coin-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffe266" />
          <stop offset="1" stopColor="#e3a600" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="15" fill="url(#coin-g)" stroke="#c48a00" strokeWidth="1.5" />
      <circle cx="16" cy="16" r="11" fill="none" stroke="#fff3b0" strokeWidth="1.2" opacity=".8" />
      {/* "L" da marca */}
      <path d="M12.5 9.5h3.2v9.2c0 1 .5 1.5 1.5 1.5h3.3v2.8h-4.6c-2.3 0-3.4-1.1-3.4-3.4z" fill="#8a5d00" />
      <path d="M15.7 7.6c1.9 0 3.3 1.3 3.3 3.2h-3.3z" fill="#00612e" />
    </svg>
  )
}

const fmt = (n: number) => n.toLocaleString('pt-BR')

/** Saldo de LocaCoins com animação quando aumenta */
export function CoinBalance({ to = '/recompensas?aba=catalogo', className }: { to?: string; className?: string }) {
  const { coins } = useStore()
  const prev = useRef(coins)
  const [bump, setBump] = useState(0)
  useEffect(() => {
    if (coins > prev.current) setBump((b) => b + 1)
    prev.current = coins
  }, [coins])
  return (
    <Link
      to={to}
      aria-label={`${coins} LocaCoins`}
      className={cx('flex h-9 items-center gap-1.5 rounded-full border border-[#f0d77a] bg-[#fff8dc] pr-3 pl-1.5', className)}
    >
      <Coin key={bump} size={24} className={bump ? 'anim-bump' : undefined} />
      <span className="text-sm font-extrabold text-[#7a5200] tabular-nums">{fmt(coins)}</span>
    </Link>
  )
}

/* ---------- Score ---------- */

export const scoreColor = (s: number) => (s >= 75 ? '#3fae15' : s >= 50 ? '#e9a100' : '#d93a3a')

export function ScoreRing({ score, size = 132, stroke = 12, light }: { score: number; size?: number; stroke?: number; light?: boolean }) {
  const r = (size - stroke) / 2
  const len = 2 * Math.PI * r
  const color = light ? '#74d62c' : scoreColor(score)
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={light ? 'rgba(255,255,255,.18)' : '#e9ece9'} strokeWidth={stroke} />
        <circle
          key={score}
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={len}
          strokeDashoffset={len * (1 - score / 100)}
          className="anim-ring"
          style={{ ['--ring-len' as string]: len }}
        />
      </svg>
      <div className="absolute text-center leading-none">
        <span className={cx('font-extrabold tabular-nums', light ? 'text-white' : 'text-ink')} style={{ fontSize: size * 0.27 }}>
          {score}
          <span style={{ fontSize: size * 0.14 }}>%</span>
        </span>
        {size >= 110 && <p className={cx('mt-1 text-[11px] font-semibold', light ? 'text-lime' : 'text-muted')}>score</p>}
      </div>
    </div>
  )
}

function FactorBar({ label, detail, value }: { label: string; detail: string; value: number }) {
  const tag = value >= 85 ? 'Ótimo' : value >= 70 ? 'Bom' : 'Atenção'
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold">{label}</span>
        <span className="text-xs font-bold" style={{ color: scoreColor(value) }}>
          {tag} · {value}
        </span>
      </div>
      <p className="text-xs text-muted">{detail}</p>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-surface">
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: scoreColor(value) }} />
      </div>
    </div>
  )
}

/* ---------- Resgate ---------- */

export function ClaimButton({ day, className }: { day: DayReport; className?: string }) {
  const { claimedDays, claimDay, showToast } = useStore()
  const claimed = claimedDays.includes(day.id)
  const amount = coinsFor(day.score)
  const [flying, setFlying] = useState(false)

  if (claimed && !flying) {
    return (
      <div className={cx('flex h-12 items-center justify-center gap-2 rounded-xl bg-lime-soft text-[15px] font-semibold text-brand', className)}>
        <Check size={18} strokeWidth={3} /> {amount} LocaCoins resgatados
      </div>
    )
  }

  return (
    <div className={cx('relative', className)}>
      {flying && (
        <span className="anim-float pointer-events-none absolute -top-2 left-1/2 z-10 flex items-center gap-1 text-xl font-extrabold text-[#c48a00]">
          +{amount} <Coin size={22} />
        </span>
      )}
      <button
        disabled={claimed}
        onClick={() => {
          if (!claimDay(day.id, amount)) return
          setFlying(true)
          showToast(`+${amount} LocaCoins adicionados à sua carteira!`)
          setTimeout(() => setFlying(false), 1200)
        }}
        className="shine relative flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-lime text-[15px] font-bold text-brand-dark transition active:scale-[0.98] disabled:opacity-60"
      >
        <Coin size={22} /> Resgatar {amount} LocaCoins
      </button>
    </div>
  )
}

/* ---------- Relatório do dia ---------- */

function Metric({
  icon: Icon,
  label,
  value,
  unit,
  hint,
  good,
}: {
  icon: typeof Gauge
  label: string
  value: string
  unit: string
  hint: string
  good?: boolean
}) {
  return (
    <div className="rounded-2xl border border-line bg-white p-3">
      <p className="flex items-center gap-1.5 text-xs font-medium text-muted">
        <Icon size={14} className="text-lime-dark" /> {label}
      </p>
      <p className="mt-1 text-[22px] leading-tight font-extrabold">
        {value} <span className="text-sm font-semibold text-muted">{unit}</span>
      </p>
      <p className={cx('mt-0.5 text-[11px] font-medium', good ? 'text-lime-dark' : 'text-muted')}>{hint}</p>
    </div>
  )
}

/** Conteúdo do dashboard de um dia: score, km, consumo, fatores e resgate */
export function DayReportBody({ day, showClaim = true }: { day: DayReport; showClaim?: boolean }) {
  const [open, setOpen] = useState(false)
  const tier = tierFor(day.score)
  const effDiff = Math.round(((day.kmPerLiter - fleetAverage.kmPerLiter) / fleetAverage.kmPerLiter) * 100)

  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-3xl bg-brand p-5 text-white">
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-lime/15" />
        <div className="absolute -bottom-16 -left-8 h-36 w-36 rounded-full bg-white/5" />
        <div className="relative flex items-center gap-4">
          <ScoreRing score={day.score} light />
          <div className="flex-1">
            <span className="inline-flex items-center gap-1 rounded-full bg-lime px-2.5 py-0.5 text-[11px] font-bold text-brand-dark">
              <Leaf size={11} /> {tier.label}
            </span>
            <p className="mt-2 text-lg leading-snug font-bold">
              Você dirigiu melhor que <span className="text-lime">{day.score}%</span> dos motoristas Meoo
            </p>
          </div>
        </div>
        <div className="relative mt-4 flex justify-around border-t border-white/15 pt-3 text-center text-xs text-white/80">
          <span className="flex items-center gap-1">
            <Route size={13} /> {day.trips} viagens
          </span>
          <span className="flex items-center gap-1">
            <Clock size={13} /> {Math.floor(day.driveMinutes / 60)}h{String(day.driveMinutes % 60).padStart(2, '0')} ao volante
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Metric
          icon={Gauge}
          label="Quilometragem"
          value={fmt(day.km)}
          unit="km"
          hint={day.km <= fleetAverage.kmPerDay ? `Abaixo da média (${fleetAverage.kmPerDay} km)` : `Acima da média (${fleetAverage.kmPerDay} km)`}
        />
        <Metric
          icon={Fuel}
          label="Consumo"
          value={day.kmPerLiter.toLocaleString('pt-BR')}
          unit="km/l"
          hint={`${day.liters.toLocaleString('pt-BR')} L · ${effDiff >= 0 ? `${effDiff}% melhor` : `${-effDiff}% pior`} que a média`}
          good={effDiff >= 0}
        />
      </div>

      <div className="rounded-2xl border border-line bg-white">
        <button onClick={() => setOpen(!open)} className="flex w-full items-center gap-2 p-4 text-left">
          <Sparkles size={18} className="text-lime-dark" />
          <span className="flex-1 text-sm font-bold">O que compõe seu score?</span>
          <ChevronDown size={18} className={cx('transition', open && 'rotate-180')} />
        </button>
        {open && (
          <div className="space-y-4 border-t border-line p-4">
            {day.factors.map((f) => (
              <FactorBar key={f.key} label={f.label} detail={f.detail} value={f.value} />
            ))}
            <p className="rounded-xl bg-surface p-3 text-xs text-muted">
              O score compara o desgaste do carro (freios, motor, acelerações e marcha lenta) com o de outros motoristas Meoo
              em trajetos parecidos. Quanto melhor você cuida do carro, mais LocaCoins ganha.
            </p>
            <div className="grid grid-cols-4 gap-1.5 text-center">
              {coinTiers.map((t) => (
                <div key={t.min} className={cx('rounded-lg border p-1.5', t === tier ? 'border-lime-dark bg-lime-soft' : 'border-line')}>
                  <p className="text-[10px] text-muted">{t.min > 0 ? `≥ ${t.min}%` : '< 50%'}</p>
                  <p className="flex items-center justify-center gap-0.5 text-sm font-bold">
                    <Coin size={13} /> {t.coins}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showClaim && <ClaimButton day={day} />}
    </div>
  )
}

/** Popup exibido logo após o login com o resumo do último dia */
export function DailyReportPopup({ day, firstName }: { day: DayReport; firstName: string }) {
  const { showDailyReport, update } = useStore()
  if (!showDailyReport) return null
  const close = () => update({ showDailyReport: false })
  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-end">
      <div className="anim-fade absolute inset-0 bg-black/50" onClick={close} />
      <div className="anim-sheet no-scrollbar relative max-h-[92%] overflow-y-auto rounded-t-3xl bg-surface px-4 pt-3 pb-5">
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-line" />
        <div className="mb-3 flex items-start justify-between px-1">
          <div>
            <p className="text-xs font-semibold tracking-wide text-lime-dark uppercase">Seu último dia ao volante</p>
            <h3 className="text-xl font-extrabold text-brand">Olá, {firstName}! 👋</h3>
            <p className="text-sm text-muted first-letter:uppercase">{formatDayLong(day.date)}</p>
          </div>
          <button onClick={close} aria-label="Fechar" className="rounded-full bg-white p-1.5">
            <X size={18} />
          </button>
        </div>
        <DayReportBody day={day} />
        <Link to="/desempenho" onClick={close} className="mt-3 block text-center text-sm font-semibold text-brand">
          Ver histórico das últimas semanas →
        </Link>
      </div>
    </div>
  )
}
