import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, ChevronDown, Fuel, Gauge, Gift, TrendingUp } from 'lucide-react'
import { Card, Screen, cx } from '../components/ui'
import { Coin, DayReportBody, ScoreRing, scoreColor } from '../components/locacoins'
import { coinsFor, formatDayLong, formatDayShort, lastDay, weeks, type DayReport } from '../data/telemetry'
import { useStore } from '../state/store'

export function Performance() {
  const { coins } = useStore()
  const [tab, setTab] = useState<'dia' | 'historico'>('dia')

  return (
    <Screen back largeTitle="Desempenho" subtitle="Seus dados de telemetria e os LocaCoins que você ganha dirigindo bem." bg="bg-surface">
      <div className="px-5">
        <div className="relative flex items-center gap-3 overflow-hidden rounded-2xl border border-[#f0d77a] bg-gradient-to-r from-[#fff8dc] to-[#fff1b8] p-4">
          <Coin size={44} />
          <div className="flex-1">
            <p className="text-xs font-semibold text-[#8a6200]">Sua carteira</p>
            <p className="text-2xl font-extrabold text-[#6b4700] tabular-nums">
              {coins.toLocaleString('pt-BR')} <span className="text-sm font-bold">LocaCoins</span>
            </p>
          </div>
          <Link to="/recompensas?aba=catalogo" className="flex items-center gap-1 rounded-xl bg-brand px-3 py-2 text-xs font-bold text-white">
            <Gift size={14} className="text-lime" /> Trocar
          </Link>
        </div>

        <div className="mt-4 grid grid-cols-2 rounded-xl bg-white p-1">
          {(
            [
              ['dia', 'Último dia'],
              ['historico', 'Histórico'],
            ] as const
          ).map(([k, l]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={cx('rounded-lg py-2 text-sm font-semibold transition', tab === k ? 'bg-brand text-white' : 'text-muted')}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 pt-4 pb-8">
        {tab === 'dia' ? (
          <>
            <p className="mb-3 text-sm font-semibold text-muted first-letter:uppercase">{formatDayLong(lastDay.date)}</p>
            <DayReportBody day={lastDay} />
          </>
        ) : (
          <History />
        )}
      </div>
    </Screen>
  )
}

function History() {
  const list = useMemo(weeks, [])
  const [openWeek, setOpenWeek] = useState(list[0].id)
  const [openDay, setOpenDay] = useState<DayReport | null>(null)
  const chronological = [...list].reverse()
  const delta = list[0].score - list[list.length - 1].score

  return (
    <div className="space-y-3">
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <p className="font-bold">Score médio por semana</p>
          {delta > 0 && (
            <span className="flex items-center gap-1 rounded-full bg-lime-soft px-2 py-0.5 text-xs font-bold text-brand">
              <TrendingUp size={13} /> +{delta} pts
            </span>
          )}
        </div>
        <div className="mt-4 flex h-36 items-end gap-3">
          {chronological.map((w) => (
            <button key={w.id} onClick={() => setOpenWeek(w.id)} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
              <span className="text-xs font-bold tabular-nums">{w.score}%</span>
              <span
                className={cx('w-full rounded-t-lg transition', openWeek === w.id ? 'opacity-100' : 'opacity-45')}
                style={{ height: `${w.score}%`, background: scoreColor(w.score) }}
              />
            </button>
          ))}
        </div>
        <div className="mt-1.5 flex gap-3 border-t border-line pt-1.5">
          {chronological.map((w) => (
            <span key={w.id} className={cx('flex-1 text-center text-[10px] leading-tight', openWeek === w.id ? 'font-bold text-ink' : 'text-muted')}>
              {w.range.split(' – ')[0]}
            </span>
          ))}
        </div>
      </Card>

      {list.map((w) => {
        const open = openWeek === w.id
        return (
          <Card key={w.id} className="overflow-hidden">
            <button onClick={() => setOpenWeek(open ? '' : w.id)} className="flex w-full items-center gap-3 p-4 text-left">
              <ScoreRing score={w.score} size={48} stroke={5} />
              <div className="flex-1">
                <p className="font-bold">{w.label}</p>
                <p className="text-xs text-muted">
                  {w.range} · {w.km} km · {w.kmPerLiter.toLocaleString('pt-BR')} km/l
                </p>
              </div>
              <ChevronDown size={18} className={cx('transition', open && 'rotate-180')} />
            </button>
            {open && (
              <div className="border-t border-line">
                <div className="grid grid-cols-3 divide-x divide-line bg-surface/60 py-3 text-center">
                  <Stat icon={Gauge} label="Km rodados" value={`${w.km}`} />
                  <Stat icon={Fuel} label="Combustível" value={`${w.liters.toLocaleString('pt-BR')} L`} />
                  <Stat icon={TrendingUp} label="Dias usados" value={`${w.days.length}`} />
                </div>
                {[...w.days].reverse().map((d) => (
                  <DayRow key={d.id} day={d} onClick={() => setOpenDay(openDay?.id === d.id ? null : d)} open={openDay?.id === d.id} />
                ))}
              </div>
            )}
          </Card>
        )
      })}
      <p className="px-2 text-center text-xs text-muted">
        Os LocaCoins são liberados para o último dia de uso. Dirija bem todo dia para não perder nenhum resgate!
      </p>
    </div>
  )
}

function Stat({ icon: Icon, label, value }: { icon: typeof Gauge; label: string; value: string }) {
  return (
    <div>
      <Icon size={15} className="mx-auto text-lime-dark" />
      <p className="mt-0.5 text-sm font-bold">{value}</p>
      <p className="text-[10px] text-muted">{label}</p>
    </div>
  )
}

function DayRow({ day, open, onClick }: { day: DayReport; open: boolean; onClick: () => void }) {
  const { claimedDays } = useStore()
  const isLast = day.id === lastDay.id
  const claimed = claimedDays.includes(day.id)
  return (
    <div className="border-t border-line">
      <button onClick={onClick} className="flex w-full items-center gap-3 px-4 py-3 text-left active:bg-surface">
        <span
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-extrabold text-white"
          style={{ background: scoreColor(day.score) }}
        >
          {day.score}
        </span>
        <div className="flex-1">
          <p className="text-sm font-semibold">{formatDayShort(day.date)}</p>
          <p className="text-xs text-muted">
            {day.km} km · {day.kmPerLiter.toLocaleString('pt-BR')} km/l
          </p>
        </div>
        {isLast &&
          (claimed ? (
            <span className="flex items-center gap-1 text-xs font-bold text-brand">
              <Check size={14} /> Resgatado
            </span>
          ) : (
            <span className="flex items-center gap-1 rounded-full bg-[#fff1b8] px-2 py-0.5 text-xs font-bold text-[#7a5200]">
              <Coin size={14} /> +{coinsFor(day.score)}
            </span>
          ))}
        <ChevronDown size={16} className={cx('text-muted transition', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="bg-surface/60 px-3 pt-1 pb-3">
          <DayReportBody day={day} showClaim={isLast} />
        </div>
      )}
    </div>
  )
}
