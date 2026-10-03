import { useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import {
  ArrowUpRight,
  BatteryMedium,
  CalendarDays,
  CarFront,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  CircleHelp,
  Copy,
  Download,
  FileSignature,
  FileText,
  Fuel,
  Gauge,
  Info,
  MapPin,
  MessageSquareText,
  RefreshCw,
  ShieldCheck,
  Signature,
  TriangleAlert,
  UserPlus,
  UserRound,
  Map as MapIcon,
  Wrench,
  CarTaxiFront,
  CircleCheck,
} from 'lucide-react'
import { Button, Card, Field, HelpCard, InfoItem, Modal, Pill, Screen, Sheet, cx } from '../components/ui'
import { car, contract, fines, formatBRL, kmExcess, kmMonthly, type Fine } from '../data/mock'
import { useStore } from '../state/store'

/* ---------- Gestão de km ---------- */

export function KmManagement() {
  const usedPct = (car.kmTotal / (car.kmContract / 3)) * 100
  const availPct = (car.kmAvailableToDate / (car.kmContract / 3)) * 100
  const max = 3000
  const [selected, setSelected] = useState(kmMonthly.length - 2)
  const sel = kmMonthly[selected]
  const over = sel.km > car.kmMonthLimit

  return (
    <Screen back largeTitle="Gestão de km" subtitle="Acompanhe o consumo de quilometragem do seu carro.">
      <div className="px-5 pb-2">
        <p className="mb-1.5 text-sm text-muted">Alterar carro</p>
        <div className="flex items-center justify-between rounded-xl border border-line px-4 py-3 text-sm">
          {car.plate} - {car.shortModel} <ChevronDown size={18} />
        </div>

        <p className="mt-6 flex items-center gap-1.5 text-lg font-bold">
          Consumo total <CircleHelp size={16} />
        </p>
        <p className="mt-1 text-sm text-muted">
          Aqui você pode acompanhar o seu consumo em relação ao total de km contratados acumulados até o momento.
        </p>
        <div className="relative mt-12 mb-2">
          <span
            className="absolute -top-9 -translate-x-1/2 rounded-md bg-line px-2 py-0.5 text-xs font-semibold"
            style={{ left: `${availPct}%` }}
          >
            {car.kmAvailableToDate.toLocaleString('pt-BR')} km
          </span>
          <span
            className="absolute -top-5 -translate-x-1/2 rounded-md bg-lime px-2 py-0.5 text-xs font-bold text-brand-dark"
            style={{ left: `${usedPct}%` }}
          >
            {car.kmTotal.toLocaleString('pt-BR')} km
          </span>
          <div className="relative mt-4 h-3 rounded-full border border-dashed border-muted/40">
            <div className="absolute inset-y-0 left-0 rounded-full border border-muted/40 bg-white" style={{ width: `${availPct}%` }} />
            <div className="absolute inset-y-0 left-0 rounded-full bg-lime" style={{ width: `${usedPct}%` }} />
          </div>
          <div className="mt-1 flex justify-between text-xs text-muted">
            <span>0 km</span>
            <span>{(car.kmContract / 3).toLocaleString('pt-BR')} km</span>
          </div>
        </div>
        <ul className="space-y-1 text-xs text-muted">
          <li className="flex items-center gap-2"><span className="h-2 w-5 rounded-full bg-lime" /> Utilizados até o momento</li>
          <li className="flex items-center gap-2"><span className="h-2 w-5 rounded-full border border-muted/40" /> Disponíveis até o momento (12º mês)</li>
          <li className="flex items-center gap-2"><span className="h-2 w-5 rounded-full border border-dashed border-muted/40" /> Franquia contratada (12 meses)</li>
        </ul>

        <p className="mt-7 text-lg font-bold">Consumo mensal</p>
        <p className="mt-1 text-sm text-muted">Aqui você pode acompanhar o consumo da quilometragem disponível mês a mês.</p>
        <div className="relative mt-8 flex h-40 items-end justify-between gap-2 border-b border-line pb-1">
          <span className="absolute -top-6 right-0 rounded bg-line px-1.5 text-[10px]">{max.toLocaleString('pt-BR')} km</span>
          <span
            className="absolute inset-x-0 border-t border-dashed border-muted/50"
            style={{ bottom: `${(car.kmMonthLimit / max) * 100}%` }}
          />
          {kmMonthly.map((m, i) => {
            const pct = (m.km / max) * 100
            const color = m.km > car.kmMonthLimit ? 'bg-danger' : m.km > car.kmMonthLimit * 0.85 ? 'bg-[#f39b1f]' : 'bg-lime'
            return (
              <button
                key={m.label}
                onClick={() => setSelected(i)}
                className={cx('flex h-full flex-1 flex-col items-center justify-end rounded-full py-1', i === selected && 'ring-1 ring-line')}
              >
                <span className="relative w-2 flex-1 rounded-full bg-surface">
                  <span className={cx('absolute inset-x-0 bottom-0 rounded-full', color)} style={{ height: `${Math.max(pct, 3)}%` }} />
                </span>
              </button>
            )
          })}
        </div>
        <div className="flex justify-between gap-2">
          {kmMonthly.map((m, i) => (
            <span key={m.label} className={cx('flex-1 text-center text-[11px]', i === selected ? 'font-bold' : 'text-muted')}>
              {m.label}
              <br />
              {m.year}
            </span>
          ))}
        </div>

        <Card className="mt-5 p-4">
          <p className="font-bold">
            {sel.label}/20{sel.year}
          </p>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-line">
            <div className={cx('h-full rounded-full', over ? 'bg-danger' : 'bg-lime')} style={{ width: `${Math.min(100, (sel.km / car.kmMonthLimit) * 100)}%` }} />
          </div>
          <p className="mt-2 text-sm">
            <b>{sel.km.toLocaleString('pt-BR')} km</b> / {car.kmMonthLimit.toLocaleString('pt-BR')} km
          </p>
          {over && (
            <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-danger">
              <CircleAlert size={14} /> {sel.km - car.kmMonthLimit} Km excedentes
            </p>
          )}
        </Card>

        <Card className="mt-4">
          <a className="flex items-center gap-3 p-4">
            <CircleHelp size={20} className="text-lime-dark" />
            <div className="flex-1">
              <p className="text-sm font-bold">Precisa aumentar sua franquia?</p>
              <p className="text-xs text-muted">Fale com a gente!</p>
            </div>
            <ArrowUpRight size={18} />
          </a>
        </Card>

        <p className="mt-7 text-lg font-bold">Km excedentes</p>
        <p className="mt-1 mb-3 text-sm text-muted">Aqui você pode ver o histórico de km excedentes de todos os seus carros e quando eles foram pagos.</p>
        <div className="space-y-2">
          {kmExcess.map((k) => (
            <Card key={k.month} className="p-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold">{k.month}</span>
                <Pill tone={k.status === 'Pago' ? 'success' : k.status === 'Em atraso' ? 'danger' : 'warn'}>{k.status}</Pill>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-line pt-3 text-sm">
                <span>{formatBRL(k.value)}</span>
                <span className="font-semibold">Opções ⋮</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
      <HelpCard title="Dúvidas sobre a gestão de km?" />
    </Screen>
  )
}

/* ---------- Telemetria ---------- */

function FakeMap({ radius }: { radius?: number }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#e8eae6]">
      <svg viewBox="0 0 400 500" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
        <rect width="400" height="500" fill="#e9ebe7" />
        <path d="M-20 60 L420 20 L420 70 L-20 110Z" fill="#f2a6b8" />
        <g stroke="#fff" strokeWidth="16" fill="none">
          <path d="M60 140 L120 520" />
          <path d="M-10 250 L420 160" />
          <path d="M-10 340 L420 260" />
          <path d="M-10 440 L420 360" />
          <path d="M250 120 L300 520" />
        </g>
        <g fontFamily="Inter" fontSize="15" fill="#555">
          <text x="150" y="215" transform="rotate(-12 150 215)">Avenida Cinamomos</text>
          <text x="270" y="250" transform="rotate(-12 270 250)">Rua das Flores</text>
          <text x="40" y="330" transform="rotate(80 40 330)">Rua das Rosas</text>
          <text x="270" y="345" transform="rotate(-12 270 345)">Rua dos Cravos</text>
        </g>
      </svg>
      {radius !== undefined && radius > 0 && (
        <span
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-[#2b8fe0] bg-[#2b8fe0]/15"
          style={{ width: 40 + radius / 3, height: 40 + radius / 3 }}
        />
      )}
      <MapPin size={34} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full fill-danger text-white" />
    </div>
  )
}

export function LocateCar() {
  const navigate = useNavigate()
  const { showToast } = useStore()
  return (
    <Screen back title="Onde está meu carro?">
      <div className="relative h-full">
        <FakeMap />
        <Card className="absolute inset-x-4 bottom-4 p-4 shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-bold">Endereço</p>
              <p className="text-sm">{car.address}</p>
              <p className="mt-1 text-xs font-semibold">{car.lastSeen}</p>
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={() => showToast('Localização atualizada')} className="rounded-lg border border-line p-1.5" aria-label="Atualizar">
                <RefreshCw size={16} />
              </button>
              <button className="rounded-lg border border-line p-1.5" aria-label="Abrir no mapa">
                <MapIcon size={16} />
              </button>
            </div>
          </div>
          <Button block variant="outline" size="sm" className="mt-3" onClick={() => navigate('/carro/seguranca')}>
            <MessageSquareText size={16} /> Alerta de circulação
          </Button>
        </Card>
      </div>
    </Screen>
  )
}

export function Security() {
  const { alerts, update, showToast } = useStore()
  const [radius, setRadius] = useState(250)
  const [period, setPeriod] = useState('')
  return (
    <Screen back title="Segurança" bg="bg-surface">
      <div className="space-y-3 px-4 pb-6">
        <Card className="p-4">
          <p className="flex items-center gap-2 font-bold">
            <TriangleAlert size={18} className="text-lime-dark" /> Alerta de veículo ligado
          </p>
          <p className="mt-1 text-sm text-muted">Receba um alerta quando o veículo for ligado dentro do período que você definir.</p>
          <div className="mt-3 flex items-center justify-between text-sm font-semibold">
            Receber alerta nas próximas:
            <Pill tone={alerts.ignition ? 'success' : 'neutral'}>{alerts.ignition ? 'Ativo' : 'Inativo'}</Pill>
          </div>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="mt-2 h-11 w-full rounded-xl border border-line bg-white px-3 text-sm"
          >
            <option value="">Selecione aqui</option>
            <option>2 horas</option>
            <option>12 horas</option>
            <option>24 horas</option>
          </select>
          <Button
            block
            size="sm"
            className="mt-3"
            disabled={!alerts.ignition && !period}
            onClick={() => {
              update({ alerts: { ...alerts, ignition: !alerts.ignition } })
              showToast(alerts.ignition ? 'Alerta desativado' : 'Alerta ativado')
            }}
          >
            {alerts.ignition ? 'Desativar' : 'Ativar'}
          </Button>
        </Card>
        <Card className="overflow-hidden">
          <div className="p-4">
            <p className="flex items-center gap-2 font-bold">
              <ShieldCheck size={18} className="text-lime-dark" /> Alerta de veículo em movimento
            </p>
            <p className="mt-1 text-sm text-muted">Receba um alerta se o veículo sair da área que você configurou, válido por até 7 dias.</p>
          </div>
          <div className="h-44">
            <FakeMap radius={radius} />
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between text-sm font-semibold">
              Raio do perímetro: {radius}m
              <Pill tone={alerts.movement ? 'success' : 'neutral'}>{alerts.movement ? 'Ativo' : 'Inativo'}</Pill>
            </div>
            <input type="range" min={100} max={500} step={50} value={radius} onChange={(e) => setRadius(+e.target.value)} className="mt-3 w-full accent-lime-dark" />
            <div className="flex justify-between text-xs text-muted">
              <span>100m</span>
              <span>500m</span>
            </div>
            <p className="mt-3 text-sm font-semibold">Localização</p>
            <p className="text-sm text-muted">{car.address}</p>
            <Button
              block
              size="sm"
              className="mt-3"
              onClick={() => {
                update({ alerts: { ...alerts, movement: !alerts.movement } })
                showToast(alerts.movement ? 'Alerta desativado' : 'Alerta ativado')
              }}
            >
              {alerts.movement ? 'Desativar' : 'Ativar'}
            </Button>
          </div>
        </Card>
      </div>
    </Screen>
  )
}

export function CarStatus() {
  return (
    <Screen back title="Status do carro" bg="bg-surface">
      <div className="space-y-3 px-4 pb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <p className="font-semibold">Estado da bateria</p>
            <Pill tone="success">Bateria boa</Pill>
          </div>
          <p className="mt-2 flex items-center gap-2 text-2xl font-bold">
            <BatteryMedium className="text-lime-dark" /> {car.battery.toLocaleString('pt-BR')}v
          </p>
          <p className="mt-1 text-xs text-muted">● Funcionamento normal.</p>
          <p className="text-xs text-muted">Atualizado em: 02/10/2026 14:23</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <p className="font-semibold">Nível do combustível</p>
            <Pill tone="success">Nível alto</Pill>
          </div>
          <p className="mt-2 flex items-center gap-2 text-2xl font-bold">
            <Fuel className="text-lime-dark" /> {car.fuel}%
          </p>
          <p className="mt-1 text-xs text-muted">● Tudo certo por enquanto.</p>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-line">
            <div className="h-full rounded-full bg-brand" style={{ width: `${car.fuel}%` }} />
          </div>
          <p className="mt-1 text-xs text-muted">Atualizado em: 02/10/2026 12:10</p>
        </Card>
      </div>
    </Screen>
  )
}

/* ---------- Multas ---------- */

export function Fines() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { indicatedFines } = useStore()
  const statusOf = (f: Fine) => (f.status === 'pendente' && indicatedFines.includes(f.id) ? 'andamento' : f.status)
  const [tab, setTab] = useState<'pendente' | 'andamento' | 'finalizada'>(params.get('tab') === 'finalizadas' ? 'finalizada' : 'pendente')
  const list = fines.filter((f) => statusOf(f) === tab)
  const pendingCount = fines.filter((f) => statusOf(f) === 'pendente').length
  const tabs = [
    { key: 'pendente', label: 'Pendentes' },
    { key: 'andamento', label: 'Em andamento' },
    { key: 'finalizada', label: 'Finalizadas' },
  ] as const

  return (
    <Screen back largeTitle="Multas" subtitle="Acompanhe e confira detalhes das suas multas e faça indicações facilmente.">
      <div className="px-5">
        <p className="mb-1.5 font-semibold">Selecione o carro</p>
        <div className="flex items-center justify-between rounded-xl border border-line px-4 py-3 text-sm">
          {car.plate} - {car.shortModel} <ChevronDown size={18} />
        </div>
      </div>
      <div className="no-scrollbar mt-4 flex gap-5 overflow-x-auto border-b border-line px-5">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cx('flex shrink-0 items-center gap-1.5 border-b-2 pb-2 text-sm', tab === t.key ? 'border-danger font-semibold text-danger' : 'border-transparent')}
          >
            {t.label}
            {t.key === 'pendente' && pendingCount > 0 && <span className="rounded bg-danger px-1.5 text-[11px] text-white">{pendingCount}</span>}
          </button>
        ))}
      </div>
      <div className="space-y-3 px-5 py-4">
        {tab === 'pendente' && list.length > 0 && (
          <div className="flex gap-3 rounded-xl bg-surface p-3 text-sm">
            <Info size={18} className="shrink-0" />
            <div>
              <p className="font-semibold">Indique suas multas no prazo</p>
              <p className="text-muted">Multas sem condutor indicado recebem multa de agravo</p>
            </div>
          </div>
        )}
        {list.length === 0 && <p className="py-8 text-center text-sm text-muted">Nenhuma multa aqui.</p>}
        {list.map((f) => (
          <Card key={f.id} className="p-4">
            <p className="font-bold">{f.title}</p>
            <p className="mt-2 flex items-center gap-2 text-sm text-muted">
              <CalendarDays size={15} className="text-lime-dark" /> {f.date}
            </p>
            <p className="mt-1 flex gap-2 text-sm text-muted">
              <MapPin size={15} className="mt-0.5 shrink-0 text-lime-dark" /> {f.place}
            </p>
            <div className="my-3 h-px bg-line" />
            <p className="text-sm text-muted">Valor da multa</p>
            <p className="text-xl font-bold">{formatBRL(f.value)}</p>
            {statusOf(f) === 'pendente' && (
              <>
                <div className="mt-3 flex gap-2 rounded-xl bg-warn-soft p-3 text-sm">
                  <TriangleAlert size={18} className="shrink-0 text-warn" />
                  <div>
                    <p className="font-semibold">Indicação pendente</p>
                    <p className="text-muted">Indicação de condutor disponível até {f.deadline}</p>
                  </div>
                </div>
                <Button block className="mt-3" onClick={() => navigate(`/multas/${f.id}/indicar`)}>
                  Indicar condutor responsável
                </Button>
              </>
            )}
            <button onClick={() => navigate(`/multas/${f.id}`)} className="mt-3 flex w-full items-center justify-center gap-1 text-sm font-semibold text-brand">
              Mostrar detalhes da multa <ChevronRight size={16} />
            </button>
          </Card>
        ))}
      </div>
    </Screen>
  )
}

export function FineDetail() {
  const { id } = useParams()
  const { indicatedFines, showToast } = useStore()
  const f = fines.find((x) => x.id === id) ?? fines[0]
  const indicated = indicatedFines.includes(f.id)
  return (
    <Screen
      back
      title="Detalhes da multa"
      bg="bg-surface"
      footer={
        <Button block onClick={() => showToast('Notificação baixada')}>
          <Download size={18} /> Baixar notificação
        </Button>
      }
    >
      <div className="space-y-3 px-4 pb-4">
        <Card className="p-4">
          <p className="mb-2 font-bold">Status da multa</p>
          <div className={cx('flex gap-2 rounded-xl p-3 text-sm', f.status === 'finalizada' ? 'bg-lime-soft' : indicated ? 'bg-info-soft' : 'bg-warn-soft')}>
            <Info size={18} className="shrink-0" />
            <div>
              <p className="font-semibold">
                {f.status === 'finalizada' ? 'Multa finalizada' : indicated ? 'Indicação em andamento' : 'Indicação pendente'}
              </p>
              <p className="text-muted">
                {f.status === 'finalizada' ? 'Nenhuma ação necessária' : indicated ? 'Estamos processando sua indicação' : `Indique até ${f.deadline}`}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <p className="mb-1 font-bold">Informações</p>
          <p className="text-xs text-muted">Código da infração</p>
          <p className="font-bold">{f.title}</p>
          <InfoItem icon={CarFront} label="Placa e veículo" value={`${car.plate} - ${car.shortModel}`} />
          <InfoItem icon={CalendarDays} label="Data e horário" value={f.date} />
          <InfoItem icon={MapPin} label="Local" value={f.place} />
        </Card>
        <Card className="space-y-1.5 p-4 text-sm">
          <p className="mb-1 font-bold">Valores</p>
          <p className="flex justify-between">
            Valor da multa: <span>{formatBRL(f.value)}</span>
          </p>
          <p className="flex justify-between">
            Taxa administrativa: <span>{formatBRL(f.fee)}</span>
          </p>
          <p className="flex justify-between font-bold">
            Valor total a pagar: <span>{formatBRL(f.value + f.fee)}</span>
          </p>
        </Card>
      </div>
      <HelpCard title="Dúvidas sobre multas?" />
    </Screen>
  )
}

export function IndicateDriver() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { update, showToast } = useStore()
  const [self, setSelf] = useState(true)
  const [name, setName] = useState('')
  const [cnh, setCnh] = useState('')
  return (
    <Screen
      back
      title="Indicar condutor"
      footer={
        <Button
          block
          disabled={!self && (!name || !cnh)}
          onClick={() => {
            update((s) => ({ indicatedFines: [...s.indicatedFines, id!] }))
            showToast('Indicação enviada!')
            navigate(`/multas/${id}`, { replace: true })
          }}
        >
          Enviar indicação
        </Button>
      }
    >
      <div className="space-y-3 px-5 pb-6">
        <p className="text-lg font-bold">Quem estava dirigindo?</p>
        {[true, false].map((v) => (
          <label key={String(v)} className={cx('flex items-center gap-3 rounded-xl border p-4', self === v ? 'border-lime-dark bg-lime-soft' : 'border-line')}>
            <input type="radio" checked={self === v} onChange={() => setSelf(v)} className="accent-lime-dark" />
            {v ? <UserRound size={18} /> : <UserPlus size={18} />}
            {v ? 'Eu mesma(o), titular do contrato' : 'Outra pessoa'}
          </label>
        ))}
        {!self && (
          <div className="space-y-3 pt-2">
            <Field label="Nome completo" value={name} onChange={setName} />
            <Field label="Número da CNH" value={cnh} onChange={setCnh} />
          </div>
        )}
        <div className="flex gap-2 rounded-xl bg-surface p-3 text-xs text-muted">
          <Signature size={16} className="shrink-0" /> A indicação será assinada digitalmente e enviada ao órgão autuador.
        </div>
      </div>
    </Screen>
  )
}

/* ---------- Contrato e documentos ---------- */

export function Contract() {
  const { showToast } = useStore()
  const [done, setDone] = useState(false)
  return (
    <Screen back largeTitle="Resumo do contrato" subtitle="Aqui você encontra um resumo dos principais dados do seu contrato com a gente.">
      <div className="space-y-3 px-5 pb-2">
        <p className="font-semibold">Selecione o carro</p>
        <div className="flex items-center justify-between rounded-xl border border-line px-4 py-3 text-sm">
          {car.plate} - {car.shortModel} <ChevronDown size={18} />
        </div>
        <Card className="p-4 text-center">
          <img src={car.image} alt="" className="mx-auto h-28 object-contain" />
          <button onClick={() => showToast('Placa copiada!')} className="mt-2 inline-flex items-center gap-1.5 text-xl font-extrabold text-brand">
            {car.plate} <Copy size={16} />
          </button>
          <p className="mt-1 text-sm font-semibold">{car.model}</p>
          <p className="mt-1 text-xs font-medium">{car.color}</p>
          <button onClick={() => setDone(true)} className="mt-4 flex w-full items-center gap-3 text-left">
            <Download size={20} className="text-lime-dark" />
            <div className="flex-1">
              <p className="text-sm font-bold">Download de contrato</p>
              <p className="text-xs text-muted">O arquivo do seu contrato em PDF</p>
            </div>
            <ArrowUpRight size={18} />
          </button>
        </Card>
        <Card className="px-4 py-3">
          <p className="mb-1 font-bold">Dados do contrato</p>
          <div className="flex items-start">
            <div className="flex-1">
              <InfoItem icon={FileText} label="Nº do contrato" value={contract.number} />
            </div>
            <button onClick={() => showToast('Número copiado!')} className="mt-3" aria-label="Copiar">
              <Copy size={18} />
            </button>
          </div>
          <InfoItem icon={FileSignature} label="Assinado em" value={contract.signedAt} />
        </Card>
        <Card className="px-4 py-3">
          <p className="mb-1 font-bold">Período e franquia</p>
          <InfoItem icon={CalendarDays} label="Período" value={contract.period} />
          <InfoItem icon={Gauge} label="Franquia" value={contract.franchise} />
        </Card>
        <Card className="px-4 py-3">
          <p className="mb-1 font-bold">Proteção e Seguro</p>
          <InfoItem icon={ShieldCheck} label="Proteção Especial" value={contract.protection} />
          <InfoItem icon={FileText} label="Valor pré-fixado de danos" value={contract.damageValue} />
          <div className="my-2 h-px bg-line" />
          <p className="text-xs font-semibold text-muted">Cobertura</p>
          <InfoItem icon={UserPlus} label="Cobertura por danos a terceiros" value={contract.thirdParty} />
          <InfoItem icon={UserRound} label="Cobertura por danos físicos" value={contract.physical} />
          <InfoItem icon={CarFront} label="Cobertura por danos materiais" value={contract.material} />
        </Card>
        <Card className="px-4 py-3">
          <p className="mb-1 font-bold">Itens previstos</p>
          <InfoItem icon={RefreshCw} label="Substituição de pneus" value={contract.tires} />
          <InfoItem icon={Wrench} label="Revisão" value={contract.revision} />
          <InfoItem icon={CarTaxiFront} label="Carro reserva" value={contract.spareCar} />
        </Card>
      </div>
      <HelpCard title="Dúvidas sobre o contrato?" />
      <Modal open={done} onClose={() => setDone(false)}>
        <CircleCheck size={40} className="mx-auto text-lime-dark" />
        <p className="mt-3 text-sm">Download concluído.</p>
      </Modal>
    </Screen>
  )
}

const docs: Record<string, { title: string; text: string }> = {
  crlv: { title: 'CRLV', text: 'Certificado de Registro e Licenciamento do Veículo, exercício 2026.' },
  guia: { title: 'Guia do condutor', text: 'Tudo o que você precisa saber para aproveitar sua assinatura: revisões, sinistros, multas e devolução.' },
}

export function DocumentScreen() {
  const { doc } = useParams()
  const { showToast } = useStore()
  const [sheet, setSheet] = useState(false)
  const d = docs[doc ?? 'crlv'] ?? docs.crlv
  return (
    <Screen back largeTitle={d.title} subtitle={d.text}>
      <div className="px-5">
        <Card className="grid aspect-[3/4] place-items-center bg-surface">
          <div className="text-center text-muted">
            <FileText size={48} className="mx-auto text-lime-dark" />
            <p className="mt-2 text-sm">
              {d.title} · {car.plate}
            </p>
          </div>
        </Card>
        <Button block className="mt-4" onClick={() => setSheet(true)}>
          <Download size={18} /> Baixar documento
        </Button>
      </div>
      <Sheet open={sheet} onClose={() => setSheet(false)} title="Baixar documento">
        <Button
          block
          onClick={() => {
            setSheet(false)
            showToast('Download concluído')
          }}
        >
          Salvar PDF
        </Button>
      </Sheet>
    </Screen>
  )
}
