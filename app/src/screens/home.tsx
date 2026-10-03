import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Check,
  ChevronRight,
  CircleAlert,
  Copy,
  CreditCard,
  Eye,
  EyeOff,
  FileText,
  Fuel,
  Gauge,
  Gift,
  Landmark,
  LogOut,
  Map,
  MapPin,
  Menu as MenuIcon,
  MessageCircle,
  MessagesSquare,
  Phone,
  ReceiptText,
  ShieldAlert,
  Signature,
  Target,
  User,
  UserRound,
  Users,
  Wrench,
  Zap,
} from 'lucide-react'
import { Button, Card, IconTile, InfoItem, Logo, Screen, SectionTitle, cx } from '../components/ui'
import { benefitsCarousel, car, charges, formatBRL, user } from '../data/mock'
import { coinsFor, formatDayLong, lastDay } from '../data/telemetry'
import { Coin, CoinBalance, DailyReportPopup, ScoreRing } from '../components/locacoins'
import { useMissionSummary } from '../components/missions'
import { useStore } from '../state/store'

export function Home() {
  const navigate = useNavigate()
  const { paidCharges, showToast } = useStore()
  const [hidden, setHidden] = useState(false)
  const openCharges = charges.filter((c) => !paidCharges.includes(c.id))
  const total = openCharges.reduce((s, c) => s + c.value, 0)
  const kmPct = Math.min(100, (car.kmMonth / car.kmMonthLimit) * 100)

  return (
    <Screen tabBar bg="bg-surface">
      <header className="grid grid-cols-[1fr_auto_1fr] items-center bg-white px-5 py-3">
        <Link to="/perfil" aria-label="Perfil" className="grid h-9 w-9 place-items-center rounded-full border border-line">
          <User size={18} />
        </Link>
        <Logo className="mx-2 h-6" />
        <div className="flex items-center justify-end gap-1.5">
          <CoinBalance />
          <Link to="/menu" aria-label="Menu" className="grid h-9 w-9 place-items-center rounded-full border border-line">
            <MenuIcon size={18} />
          </Link>
        </div>
      </header>

      <div className="bg-white pb-5">
        <Link to="/contrato" className="flex items-center justify-between px-5 pt-3 pb-1">
          <h2 className="text-xl font-bold text-brand">Meus carros</h2>
          <ChevronRight size={20} />
        </Link>
        <div className="no-scrollbar flex snap-x gap-3 overflow-x-auto px-5">
          <Card className="w-full shrink-0 snap-center overflow-hidden">
            <img src={car.image} alt={car.model} className="mx-auto -mb-2 h-32 object-contain pt-2" />
            <div className="px-4">
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => showToast('Placa copiada!')}
                  className="flex items-center gap-1.5 text-xl font-extrabold text-ink"
                >
                  <Copy size={16} /> {car.plate}
                </button>
                <span className="flex items-center gap-1 rounded-full border border-line px-2 py-0.5 text-xs text-muted">
                  <MapPin size={11} className="text-lime-dark" /> {car.city}
                </span>
              </div>
              <p className="mt-1 truncate text-center text-sm text-muted">{car.shortModel}</p>
              <p className="mt-3 text-xs text-muted">Km rodados este mês</p>
              <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-line">
                <div className="h-full rounded-full bg-lime" style={{ width: `${Math.max(kmPct, 4)}%` }} />
              </div>
              <div className="mt-1.5 flex justify-between text-sm">
                <span>
                  <b>{car.kmMonth} km</b>/{car.kmMonthLimit} km
                </span>
                <Link to="/km" className="font-semibold text-brand">
                  Mais detalhes
                </Link>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <IconTile icon={FileText} label="CRLV" to="/documento/crlv" />
                <IconTile icon={Wrench} label="Serviços" to="/servicos" />
                <IconTile icon={ShieldAlert} label="Multas" to="/multas" />
              </div>
            </div>
            <Link to="/menu" className="mt-3 flex items-center justify-between border-t border-line px-4 py-3 text-sm font-semibold text-brand">
              Mais opções do carro <ChevronRight size={18} className="text-ink" />
            </Link>
          </Card>
        </div>
        <div className="mt-3 flex justify-center gap-1.5">
          <span className="h-1.5 w-6 rounded-full bg-lime" />
          <span className="h-1.5 w-4 rounded-full bg-line" />
          <span className="h-1.5 w-4 rounded-full bg-line" />
        </div>
      </div>

      <SectionTitle action={<Link to="/desempenho" className="text-sm font-semibold text-brand">Histórico</Link>}>
        Seu último dia
      </SectionTitle>
      <LastDayCard />
      <MissionsTodayCard />

      <SectionTitle>Faturas</SectionTitle>
      <Card className="mx-5">
        <div className="p-4">
          {openCharges.length > 0 ? (
            <>
              <span className="inline-flex items-center gap-1 rounded-full bg-warn-soft px-2.5 py-1 text-xs font-semibold text-warn">
                <CircleAlert size={13} /> A vencer
              </span>
              <p className="mt-3 text-sm text-muted">
                Valor total de {openCharges.length} {openCharges.length === 1 ? 'cobrança' : 'cobranças'}
              </p>
              <div className="mt-0.5 flex items-center gap-3">
                <span className="text-[26px] font-extrabold text-[#d4a700]">{hidden ? 'R$ ••••••' : formatBRL(total)}</span>
                <button onClick={() => setHidden(!hidden)} aria-label="Mostrar/ocultar valor">
                  {hidden ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </>
          ) : (
            <p className="text-sm font-semibold text-brand">Tudo em dia! Nenhuma cobrança em aberto.</p>
          )}
        </div>
        <Link to="/pagamentos" className="flex items-center justify-between border-t border-line px-4 py-3 text-sm font-semibold text-brand">
          Mostrar todas as faturas <ChevronRight size={18} className="text-ink" />
        </Link>
      </Card>

      <SectionTitle>Benefícios Meoo</SectionTitle>
      <div className="no-scrollbar flex snap-x gap-3 overflow-x-auto px-5 pb-6">
        <LocaCoinsPromo />
        {benefitsCarousel.map((b) => (
          <Card key={b.id} className="w-[240px] shrink-0 snap-start overflow-hidden">
            <div className="relative h-28">
              <img src={b.image} alt="" className="h-full w-full object-cover" />
              <span className="absolute top-2 right-2 rounded-full bg-lime-soft px-2.5 py-1 text-xs font-bold text-brand">{b.badge}</span>
            </div>
            <div className="p-3">
              <p className="flex items-center gap-1.5 font-bold">
                <Gift size={16} className="text-lime-dark" /> {b.title}
              </p>
              <p className="mt-1 h-10 text-sm leading-snug text-muted">{b.text}</p>
              <Button size="sm" className="mt-3" onClick={() => navigate(b.to)}>
                {b.cta}
              </Button>
            </div>
          </Card>
        ))}
      </div>
      <DailyReportPopup day={lastDay} firstName={user.firstName} />
    </Screen>
  )
}

/** Resumo compacto do último dia de uso, que reabre o dashboard completo */
function LastDayCard() {
  const navigate = useNavigate()
  const { update, claimedDays } = useStore()
  const claimed = claimedDays.includes(lastDay.id)
  const coins = coinsFor(lastDay.score)
  return (
    <div className="mx-5 overflow-hidden rounded-2xl bg-brand text-white">
      <button onClick={() => update({ showDailyReport: true })} className="relative flex w-full items-center gap-4 p-4 text-left">
        <span className="absolute -top-8 -right-8 h-28 w-28 rounded-full bg-lime/15" />
        <ScoreRing score={lastDay.score} size={78} stroke={8} light />
        <div className="relative flex-1">
          <p className="text-xs text-white/70 first-letter:uppercase">{formatDayLong(lastDay.date)}</p>
          <p className="mt-0.5 leading-snug font-bold">
            Melhor que <span className="text-lime">{lastDay.score}%</span> dos motoristas
          </p>
          <div className="mt-2 flex gap-3 text-xs text-white/85">
            <span className="flex items-center gap-1">
              <Gauge size={13} /> {lastDay.km} km
            </span>
            <span className="flex items-center gap-1">
              <Fuel size={13} /> {lastDay.kmPerLiter.toLocaleString('pt-BR')} km/l
            </span>
          </div>
        </div>
        <ChevronRight size={20} className="relative" />
      </button>
      <div className="border-t border-white/15 px-4 py-3">
        {claimed ? (
          <button onClick={() => navigate('/desempenho')} className="flex w-full items-center justify-center gap-2 text-sm font-semibold text-lime">
            <Check size={16} strokeWidth={3} /> {coins} LocaCoins resgatados · ver histórico
          </button>
        ) : (
          <button
            onClick={() => update({ showDailyReport: true })}
            className="shine relative flex h-10 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-lime text-sm font-bold text-brand-dark"
          >
            <Coin size={18} /> Resgatar {coins} LocaCoins
          </button>
        )}
      </div>
    </div>
  )
}

/** Atalho para as missões do dia */
function MissionsTodayCard() {
  const { dailyDone, dailyTotal, ready, readyCoins } = useMissionSummary()
  return (
    <Link to="/recompensas" className="mx-5 mt-3 flex items-center gap-3 rounded-2xl border border-line bg-white p-4 active:bg-surface">
      <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-lime-soft">
        <Target size={24} className="text-lime-dark" />
        {ready.length > 0 && (
          <span className="absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full bg-danger px-1 text-[11px] font-bold text-white ring-2 ring-white">
            {ready.length}
          </span>
        )}
      </span>
      <div className="flex-1">
        <p className="font-bold">Missões de hoje</p>
        <div className="mt-1.5 flex items-center gap-2">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface">
            <div className="h-full rounded-full bg-lime-dark transition-all" style={{ width: `${(dailyDone / dailyTotal) * 100}%` }} />
          </div>
          <span className="text-xs font-semibold text-muted">
            {dailyDone}/{dailyTotal}
          </span>
        </div>
        {readyCoins > 0 && (
          <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-[#8a6200]">
            <Coin size={13} /> {readyCoins} LocaCoins esperando resgate
          </p>
        )}
      </div>
      <ChevronRight size={20} />
    </Link>
  )
}

/** Primeiro card do carrossel de benefícios: loja de LocaCoins */
function LocaCoinsPromo() {
  const navigate = useNavigate()
  const { coins } = useStore()
  return (
    <Card className="w-[240px] shrink-0 snap-start overflow-hidden">
      <div className="relative flex h-28 items-center justify-center overflow-hidden bg-brand">
        <span className="absolute -top-8 -left-6 h-24 w-24 rounded-full bg-lime/20" />
        <span className="absolute -right-6 -bottom-10 h-24 w-24 rounded-full bg-white/10" />
        <Coin size={40} className="relative -mr-3 -rotate-12" />
        <Coin size={56} className="relative z-10" />
        <Coin size={40} className="relative -ml-3 rotate-12" />
        <span className="absolute top-2 right-2 rounded-full bg-lime-soft px-2.5 py-1 text-xs font-bold text-brand">Novo</span>
      </div>
      <div className="p-3">
        <p className="flex items-center gap-1.5 font-bold">
          <Gift size={16} className="text-lime-dark" /> Troque seus LocaCoins
        </p>
        <p className="mt-1 h-10 text-sm leading-snug text-muted">
          Você tem <b className="text-ink">{coins}</b> LocaCoins para trocar por cupons de parceiros
        </p>
        <Button size="sm" className="mt-3" onClick={() => navigate('/recompensas?aba=catalogo')}>
          Ver recompensas
        </Button>
      </div>
    </Card>
  )
}

const menuSections = [
  {
    title: 'Documentos',
    items: [
      { icon: FileText, label: 'CRLV', to: '/documento/crlv' },
      { icon: FileText, label: 'Contrato', to: '/contrato' },
      { icon: Map, label: 'Guia do condutor', to: '/documento/guia' },
    ],
  },
  {
    title: 'Sobre o carro',
    items: [
      { icon: FileText, label: 'Revisão', to: '/servicos/agendar' },
      { icon: Wrench, label: 'Serviços', to: '/servicos' },
      { icon: Gauge, label: 'Gestão de Km', to: '/km' },
      { icon: MapPin, label: 'Localizar carro', to: '/carro/localizar' },
      { icon: Zap, label: 'Status e Consumo', to: '/carro/status' },
      { icon: Gauge, label: 'Desempenho e LocaCoins', to: '/desempenho' },
      { icon: ShieldAlert, label: 'Segurança', to: '/carro/seguranca' },
    ],
  },
  {
    title: 'Multas',
    items: [
      { icon: Signature, label: 'Indicação de multas', to: '/multas' },
      { icon: ReceiptText, label: 'Histórico de multas', to: '/multas?tab=finalizadas' },
    ],
  },
  {
    title: 'Financeiro',
    items: [
      { icon: FileText, label: 'Faturas', to: '/pagamentos' },
      { icon: CreditCard, label: 'Dados de pagamento', to: '/pagamentos/historico' },
    ],
  },
  { title: 'Dados e segurança', items: [{ icon: UserRound, label: 'Meus dados', to: '/perfil' }] },
  {
    title: 'Benefícios',
    items: [
      { icon: Users, label: 'Programa de indicação', to: '/indicacao' },
      { icon: Gift, label: 'Clube de benefícios', to: '/beneficios/clube' },
      { icon: Gift, label: 'Recompensas LocaCoins', to: '/recompensas' },
    ],
  },
  {
    title: 'Ajuda',
    items: [
      { icon: MessagesSquare, label: 'Dúvidas frequentes', to: '/ajuda/central' },
      { icon: Phone, label: 'Telefone', to: '/ajuda' },
      { icon: MessageCircle, label: 'WhatsApp', to: '/ajuda' },
    ],
  },
]

export function Menu() {
  return (
    <Screen back closeIcon>
      <div className="px-5 pb-8">
        {menuSections.map((s) => (
          <section key={s.title} className="mb-4">
            <h3 className="mb-2 text-sm font-medium text-ink">{s.title}</h3>
            <div className="grid grid-cols-3 gap-2">
              {s.items.map((i) => (
                <IconTile key={i.label} {...i} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </Screen>
  )
}

export function Profile() {
  const navigate = useNavigate()
  const { update } = useStore()
  return (
    <Screen back largeTitle="Meus dados" subtitle="Informações da sua conta Localiza Meoo.">
      <div className="px-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-lime-soft text-xl font-bold text-brand">
            {user.firstName[0]}
          </div>
          <div>
            <p className="font-bold">{user.name}</p>
            <p className="text-sm text-muted">Cliente desde jan/2025</p>
          </div>
        </div>
        <Card className="px-4 py-2">
          <InfoItem icon={UserRound} label="Nome" value={user.name} />
          <InfoItem icon={FileText} label="CPF" value={user.cpf} />
          <InfoItem icon={MessageCircle} label="E-mail" value={user.email} />
          <InfoItem icon={Phone} label="Telefone" value={user.phone} />
          <InfoItem icon={Landmark} label="Forma de pagamento" value="Boleto bancário" />
        </Card>
        <button
          onClick={() => {
            update({ loggedIn: false })
            navigate('/boas-vindas')
          }}
          className={cx('mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-danger py-3 font-semibold text-danger')}
        >
          <LogOut size={18} /> Sair da conta
        </button>
      </div>
    </Screen>
  )
}
