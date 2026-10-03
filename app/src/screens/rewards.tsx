import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { CalendarClock, Check, ChevronRight, Copy, Info, Lock, Sparkles, Ticket, TrendingUp } from 'lucide-react'
import { Button, Screen, Sheet, cx } from '../components/ui'
import { Coin } from '../components/locacoins'
import { MissionsPanel, useMissionSummary } from '../components/missions'
import { categories, rewardById, rewards, type Reward, type RewardCategory } from '../data/rewards'
import { useStore, type RedeemedReward } from '../state/store'

const fmt = (n: number) => n.toLocaleString('pt-BR')

type Tab = 'missoes' | 'catalogo' | 'cupons'

/* ---------- Peças visuais ---------- */

function PartnerMark({ reward, size = 44 }: { reward: Reward; size?: number }) {
  const isText = /^[\w'’]+$/.test(reward.mark) && reward.mark.length > 1
  return (
    <span
      className="grid shrink-0 place-items-center rounded-xl font-extrabold shadow-sm ring-2 ring-white/70"
      style={{
        width: size,
        height: size,
        background: reward.color,
        color: reward.ink ?? '#fff',
        fontSize: isText ? size * (reward.mark.length > 5 ? 0.2 : 0.28) : size * 0.45,
        letterSpacing: isText ? '-0.02em' : undefined,
      }}
    >
      {reward.mark}
    </span>
  )
}

function CostPill({ cost, affordable }: { cost: number; affordable: boolean }) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-extrabold tabular-nums',
        affordable ? 'bg-[#fff1b8] text-[#7a5200]' : 'bg-surface text-muted',
      )}
    >
      <Coin size={14} /> {fmt(cost)}
    </span>
  )
}

function RewardCard({ reward, coins, onOpen }: { reward: Reward; coins: number; onOpen: () => void }) {
  const affordable = coins >= reward.cost
  const pct = Math.min(100, (coins / reward.cost) * 100)
  return (
    <button onClick={onOpen} className="flex flex-col overflow-hidden rounded-2xl border border-line bg-white text-left active:scale-[0.98]">
      <div className="relative flex h-20 items-center justify-center" style={{ background: `linear-gradient(135deg, ${reward.color}, ${reward.color}cc)` }}>
        <span className="absolute -right-5 -bottom-8 h-20 w-20 rounded-full bg-white/10" />
        <span className="text-[19px] font-extrabold" style={{ color: reward.ink ?? '#fff' }}>
          {reward.highlight}
        </span>
        <span className="absolute -bottom-5 left-3">
          <PartnerMark reward={reward} size={36} />
        </span>
      </div>
      <div className="flex flex-1 flex-col px-3 pt-6 pb-3">
        <p className="text-[11px] font-semibold text-muted">{reward.partner}</p>
        <p className="line-clamp-2 text-sm leading-snug font-bold">{reward.title}</p>
        <div className="mt-auto pt-2.5">
          <CostPill cost={reward.cost} affordable={affordable} />
          {!affordable && (
            <div className="mt-2">
              <div className="h-1.5 overflow-hidden rounded-full bg-surface">
                <div className="h-full rounded-full bg-gold" style={{ width: `${pct}%` }} />
              </div>
              <p className="mt-1 text-[10px] text-muted">Faltam {fmt(reward.cost - coins)}</p>
            </div>
          )}
        </div>
      </div>
    </button>
  )
}

function FeaturedCard({ reward, coins, onOpen }: { reward: Reward; coins: number; onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="relative flex h-36 w-[270px] shrink-0 snap-start flex-col justify-between overflow-hidden rounded-2xl p-4 text-left"
      style={{ background: `linear-gradient(135deg, ${reward.color}, ${reward.color}b3)`, color: reward.ink ?? '#fff' }}
    >
      <span className="absolute -top-10 -right-10 h-36 w-36 rounded-full bg-white/10" />
      <span className="absolute right-6 -bottom-12 h-24 w-24 rounded-full bg-white/10" />
      <div className="relative flex items-center gap-2">
        <PartnerMark reward={reward} size={34} />
        <span className="flex-1 text-xs font-semibold opacity-90">{reward.partner}</span>
        <CostPill cost={reward.cost} affordable={coins >= reward.cost} />
      </div>
      <div className="relative">
        <p className="text-2xl leading-none font-extrabold">{reward.highlight}</p>
        <p className="mt-1 text-sm opacity-90">{reward.title}</p>
      </div>
    </button>
  )
}

/* ---------- Tela ---------- */

export function Rewards() {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const { coins, redeemed, redeemReward, showToast } = useStore()
  const aba = params.get('aba')
  const tab: Tab = aba === 'cupons' || aba === 'catalogo' ? aba : 'missoes'
  const [category, setCategory] = useState<RewardCategory | 'todos'>('todos')
  const [selected, setSelected] = useState<Reward | null>(null)
  const [confirming, setConfirming] = useState(false)
  const [success, setSuccess] = useState<RedeemedReward | null>(null)

  const list = rewards.filter((r) => category === 'todos' || r.category === category)
  const affordableCount = rewards.filter((r) => r.cost <= coins).length
  const setTab = (t: Tab) => setParams(t === 'missoes' ? {} : { aba: t }, { replace: true })
  const { ready } = useMissionSummary()

  const confirm = () => {
    if (!selected) return
    const item = redeemReward(selected.id)
    setConfirming(false)
    setSelected(null)
    if (item) setSuccess(item)
    else showToast('Saldo insuficiente')
  }

  return (
    <Screen tabBar bg="bg-surface">
      {/* Carteira */}
      <div className="relative overflow-hidden bg-brand px-5 pt-5 pb-16 text-white">
        <span className="absolute -top-16 -right-12 h-48 w-48 rounded-full bg-lime/15" />
        <span className="absolute -bottom-20 left-10 h-40 w-40 rounded-full bg-white/5" />
        <div className="relative flex items-center justify-between">
          <h1 className="text-[26px] font-extrabold">Recompensas</h1>
          <Link to="/desempenho" className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold">
            <TrendingUp size={14} className="text-lime" /> Ganhar mais
          </Link>
        </div>
        <p className="relative mt-1 text-sm text-white/75">Troque seus LocaCoins por cupons dos parceiros Localiza.</p>
      </div>
      <div className="relative -mt-12 px-5">
        <div className="flex items-center gap-3 rounded-2xl border border-[#f0d77a] bg-gradient-to-r from-[#fff8dc] to-[#fff1b8] p-4 shadow-sm">
          <Coin size={48} />
          <div className="flex-1">
            <p className="text-xs font-semibold text-[#8a6200]">Seu saldo</p>
            <p className="text-[26px] leading-tight font-extrabold text-[#6b4700] tabular-nums">
              {fmt(coins)} <span className="text-sm font-bold">LocaCoins</span>
            </p>
          </div>
          <div className="text-right text-[11px] leading-tight font-semibold text-[#8a6200]">
            <p className="text-lg font-extrabold">{affordableCount}</p>
            disponíveis
            <br />
            para troca
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 rounded-xl bg-white p-1">
          {(
            [
              ['missoes', 'Missões', ready.length],
              ['catalogo', 'Catálogo', 0],
              ['cupons', 'Meus cupons', redeemed.length],
            ] as const
          ).map(([k, label, n]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={cx('rounded-lg py-2 text-[13px] font-semibold transition', tab === k ? 'bg-brand text-white' : 'text-muted')}
            >
              {label}
              {n > 0 && (
                <span className={cx('ml-1 rounded-full px-1.5 text-[11px]', k === 'missoes' ? 'bg-danger text-white' : 'bg-lime text-brand-dark')}>{n}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {tab === 'missoes' ? (
        <MissionsPanel />
      ) : tab === 'catalogo' ? (
        <>
          <p className="px-5 pt-5 pb-3 text-lg font-bold text-brand">Destaques</p>
          <div className="no-scrollbar flex snap-x gap-3 overflow-x-auto px-5">
            {rewards
              .filter((r) => r.featured)
              .map((r) => (
                <FeaturedCard key={r.id} reward={r} coins={coins} onOpen={() => setSelected(r)} />
              ))}
          </div>

          <div className="no-scrollbar flex gap-2 overflow-x-auto px-5 pt-5 pb-3">
            {categories.map((c) => (
              <button
                key={c.key}
                onClick={() => setCategory(c.key)}
                className={cx(
                  'shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium transition',
                  category === c.key ? 'border-brand bg-brand text-white' : 'border-line bg-white text-ink',
                )}
              >
                {c.emoji} {c.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3 px-5 pb-4">
            {list.map((r) => (
              <RewardCard key={r.id} reward={r} coins={coins} onOpen={() => setSelected(r)} />
            ))}
          </div>
          <p className="px-8 pb-6 text-center text-[11px] text-muted">Ofertas ilustrativas para o MVP do hackathon.</p>
        </>
      ) : (
        <MyCoupons onBrowse={() => setTab('catalogo')} />
      )}

      {/* Detalhe da recompensa */}
      <Sheet open={!!selected} onClose={() => { setSelected(null); setConfirming(false) }}>
        {selected && (
          <RewardDetail
            reward={selected}
            coins={coins}
            confirming={confirming}
            onRedeem={() => setConfirming(true)}
            onCancel={() => setConfirming(false)}
            onConfirm={confirm}
            onEarnMore={() => navigate('/desempenho')}
          />
        )}
      </Sheet>

      {/* Sucesso */}
      <Sheet open={!!success} onClose={() => setSuccess(null)}>
        {success && (
          <RedeemSuccess
            item={success}
            onCopy={() => showToast('Código copiado!')}
            onSeeCoupons={() => {
              setSuccess(null)
              setTab('cupons')
            }}
          />
        )}
      </Sheet>
    </Screen>
  )
}

function RewardDetail({
  reward,
  coins,
  confirming,
  onRedeem,
  onCancel,
  onConfirm,
  onEarnMore,
}: {
  reward: Reward
  coins: number
  confirming: boolean
  onRedeem: () => void
  onCancel: () => void
  onConfirm: () => void
  onEarnMore: () => void
}) {
  const affordable = coins >= reward.cost
  return (
    <div>
      <div
        className="relative -mx-5 -mt-7 mb-4 overflow-hidden rounded-t-3xl px-5 pt-8 pb-5"
        style={{ background: `linear-gradient(135deg, ${reward.color}, ${reward.color}b3)`, color: reward.ink ?? '#fff' }}
      >
        <span className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-white/10" />
        <div className="relative flex items-center gap-3">
          <PartnerMark reward={reward} size={52} />
          <div>
            <p className="text-sm font-semibold opacity-90">{reward.partner}</p>
            <p className="text-3xl leading-none font-extrabold">{reward.highlight}</p>
          </div>
        </div>
      </div>

      <h3 className="text-lg font-bold">{reward.title}</h3>
      <p className="mt-1 text-sm text-muted">{reward.description}</p>
      <p className="mt-3 flex items-center gap-2 text-sm font-medium">
        <CalendarClock size={16} className="text-lime-dark" /> {reward.validity}
      </p>
      <ul className="mt-3 space-y-1.5 rounded-xl bg-surface p-3 text-xs text-muted">
        {reward.terms.map((t) => (
          <li key={t} className="flex gap-2">
            <Info size={13} className="mt-px shrink-0" /> {t}
          </li>
        ))}
      </ul>

      <div className="mt-4 space-y-1.5 rounded-xl border border-line p-3 text-sm">
        <p className="flex justify-between">
          <span className="text-muted">Seu saldo</span>
          <span className="flex items-center gap-1 font-semibold">
            <Coin size={14} /> {fmt(coins)}
          </span>
        </p>
        <p className="flex justify-between">
          <span className="text-muted">Custo do cupom</span>
          <span className="font-semibold text-danger">− {fmt(reward.cost)}</span>
        </p>
        <div className="h-px bg-line" />
        <p className="flex justify-between font-bold">
          <span>Saldo após a troca</span>
          <span className={affordable ? 'text-brand' : 'text-danger'}>{affordable ? fmt(coins - reward.cost) : '—'}</span>
        </p>
      </div>

      {affordable ? (
        confirming ? (
          <div className="mt-4">
            <p className="mb-2 text-center text-sm font-semibold">
              Confirmar a troca de {fmt(reward.cost)} LocaCoins?
            </p>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={onCancel}>
                Cancelar
              </Button>
              <Button className="flex-1" onClick={onConfirm}>
                <Check size={18} /> Confirmar
              </Button>
            </div>
          </div>
        ) : (
          <button
            onClick={onRedeem}
            className="shine relative mt-4 flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-lime text-[15px] font-bold text-brand-dark active:scale-[0.98]"
          >
            <Coin size={22} /> Trocar por {fmt(reward.cost)} LocaCoins
          </button>
        )
      ) : (
        <div className="mt-4">
          <div className="flex h-12 items-center justify-center gap-2 rounded-xl bg-surface text-sm font-semibold text-muted">
            <Lock size={16} /> Faltam {fmt(reward.cost - coins)} LocaCoins
          </div>
          <button onClick={onEarnMore} className="mt-3 flex w-full items-center justify-center gap-1 text-sm font-semibold text-brand">
            <Sparkles size={15} /> Ganhe mais dirigindo bem <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  )
}

function CodeBox({ code, onCopy, dark }: { code: string; onCopy: () => void; dark?: boolean }) {
  return (
    <button
      onClick={() => {
        navigator.clipboard?.writeText(code).catch(() => {})
        onCopy()
      }}
      className={cx(
        'flex w-full items-center justify-between rounded-xl border-2 border-dashed px-4 py-3',
        dark ? 'border-lime/60 bg-white/5' : 'border-lime-dark/50 bg-lime-soft',
      )}
    >
      <span className={cx('font-mono text-lg font-bold tracking-wider', dark ? 'text-white' : 'text-brand')}>{code}</span>
      <Copy size={18} className={dark ? 'text-lime' : 'text-brand'} />
    </button>
  )
}

function RedeemSuccess({ item, onCopy, onSeeCoupons }: { item: RedeemedReward; onCopy: () => void; onSeeCoupons: () => void }) {
  const reward = rewardById(item.rewardId)!
  return (
    <div className="text-center">
      <div className="anim-bump mx-auto grid h-16 w-16 place-items-center rounded-full bg-lime">
        <Check size={34} strokeWidth={3} className="text-brand-dark" />
      </div>
      <h3 className="mt-3 text-xl font-extrabold text-brand">Cupom resgatado!</h3>
      <p className="mt-1 text-sm text-muted">
        {reward.highlight} · {reward.partner}
      </p>
      <p className="mt-5 mb-2 text-left text-xs font-semibold text-muted">Seu código</p>
      <CodeBox code={item.code} onCopy={onCopy} />
      <p className="mt-2 text-left text-xs text-muted">{reward.validity}. O código também fica salvo em “Meus cupons”.</p>
      <Button block className="mt-5" onClick={onSeeCoupons}>
        <Ticket size={18} /> Ver meus cupons
      </Button>
    </div>
  )
}

function MyCoupons({ onBrowse }: { onBrowse: () => void }) {
  const { redeemed, update, showToast } = useStore()
  const totalSpent = redeemed.reduce((s, r) => s + r.cost, 0)

  if (!redeemed.length) {
    return (
      <div className="px-5 py-10 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-white">
          <Ticket size={28} className="text-lime-dark" />
        </div>
        <p className="mt-3 font-bold">Você ainda não tem cupons</p>
        <p className="mt-1 text-sm text-muted">Troque seus LocaCoins por descontos em viagens, restaurantes, pet e muito mais.</p>
        <Button className="mt-5" onClick={onBrowse}>
          Explorar catálogo
        </Button>
      </div>
    )
  }

  const toggleUsed = (id: string) =>
    update((s) => ({ redeemed: s.redeemed.map((r) => (r.id === id ? { ...r, used: !r.used } : r)) }))

  return (
    <div className="space-y-3 px-5 pt-4 pb-8">
      <p className="text-xs text-muted">
        {redeemed.length} {redeemed.length === 1 ? 'cupom resgatado' : 'cupons resgatados'} · {fmt(totalSpent)} LocaCoins trocados
      </p>
      {redeemed.map((item) => {
        const reward = rewardById(item.rewardId)!
        return (
          <div key={item.id} className={cx('relative overflow-hidden rounded-2xl bg-white', item.used && 'opacity-60')}>
            <div className="flex items-center gap-3 p-4" style={{ borderLeft: `6px solid ${reward.color}` }}>
              <PartnerMark reward={reward} size={42} />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-muted">{reward.partner}</p>
                <p className="truncate font-bold">
                  {reward.highlight} · {reward.title}
                </p>
              </div>
              {item.used && <span className="rounded-full bg-surface px-2 py-0.5 text-[11px] font-bold text-muted">Usado</span>}
            </div>
            {/* recortes de ticket */}
            <div className="relative border-t-2 border-dashed border-line">
              <span className="absolute -top-2.5 -left-2.5 h-5 w-5 rounded-full bg-surface" />
              <span className="absolute -top-2.5 -right-2.5 h-5 w-5 rounded-full bg-surface" />
            </div>
            <div className="space-y-2 p-4 pt-3">
              <CodeBox code={item.code} onCopy={() => showToast('Código copiado!')} />
              <div className="flex items-center justify-between text-xs text-muted">
                <span>Resgatado em {new Date(item.redeemedAt).toLocaleDateString('pt-BR')}</span>
                <button onClick={() => toggleUsed(item.id)} className="font-semibold text-brand">
                  {item.used ? 'Desmarcar' : 'Marcar como usado'}
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
