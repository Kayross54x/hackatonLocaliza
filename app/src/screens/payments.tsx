import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  AlarmClock,
  ArrowRight,
  Barcode,
  CalendarDays,
  CarFront,
  ChevronDown,
  ChevronRight,
  CircleGauge,
  Copy,
  CreditCard,
  Download,
  FileText,
  History,
  QrCode,
  ReceiptText,
  Settings,
  TriangleAlert,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { Button, Card, Pill, Screen, Sheet, cx } from '../components/ui'
import { car, charges, dueDate, formatBRL, invoiceHistory, type ChargeKind, type InvoiceStatus } from '../data/mock'
import { useStore } from '../state/store'

const kindIcon: Record<ChargeKind, LucideIcon> = { km: CircleGauge, multa: FileText, aluguel: CarFront }

function useOpenCharges() {
  const { paidCharges } = useStore()
  const open = charges.filter((c) => !paidCharges.includes(c.id))
  return { open, total: open.reduce((s, c) => s + c.value, 0) }
}

export function Payments() {
  const { open, total } = useOpenCharges()
  return (
    <Screen tabBar>
      <div className="flex items-center justify-between px-5 pt-4 pb-4">
        <h1 className="text-[26px] font-extrabold text-brand">Pagamentos</h1>
        <Settings size={20} className="text-lime-dark" />
      </div>
      <div className="px-5">
        <Card className="p-4">
          {open.length > 0 ? (
            <>
              <p className="text-sm font-semibold text-warn">{open.length} cobranças a vencer</p>
              <p className="mt-2 text-xs text-muted">Total a ser pago</p>
              <p className="text-[26px] font-extrabold">{formatBRL(total)}</p>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
                <CalendarDays size={13} /> Vencimento {dueDate}
              </p>
              <Link to="/pagamentos/cobrancas" className="mt-3 flex items-center justify-center gap-1.5 text-sm font-semibold text-brand">
                Detalhes da cobrança <ArrowRight size={16} />
              </Link>
            </>
          ) : (
            <p className="py-3 text-center font-semibold text-brand">Nenhuma cobrança em aberto 🎉</p>
          )}
        </Card>
      </div>
      <div className="mt-2 divide-y divide-line">
        <SummaryRow icon={TriangleAlert} label="Em atraso" value={0} />
        <SummaryRow icon={AlarmClock} label="A vencer" value={total} to="/pagamentos/cobrancas" />
        <SummaryRow icon={ReceiptText} label="Prévias" value={0} />
      </div>
      <Link to="/pagamentos/historico" className="mt-4 flex items-center justify-center gap-2 py-3 text-sm font-semibold text-brand">
        <History size={18} className="text-lime-dark" /> Histórico de pagamentos
      </Link>
    </Screen>
  )
}

function SummaryRow({ icon: Icon, label, value, to }: { icon: LucideIcon; label: string; value: number; to?: string }) {
  const body = (
    <>
      <Icon size={20} />
      <div className="flex-1">
        <p className="text-sm text-muted">{label}</p>
        <p className="font-bold">{formatBRL(value)}</p>
      </div>
      <ChevronRight size={20} />
    </>
  )
  const cls = 'flex items-center gap-4 px-5 py-4 active:bg-surface'
  return to ? <Link to={to} className={cls}>{body}</Link> : <div className={cls}>{body}</div>
}

export function Charges() {
  const { open, total } = useOpenCharges()
  const groups = [
    { key: 'extra', title: 'Cobranças extras' },
    { key: 'fixa', title: 'Cobranças fixas' },
  ] as const
  return (
    <Screen back title="Cobranças a vencer" tabBar>
      <div className="px-5 pb-6">
        <p className="mb-3 text-lg font-semibold">Há {open.length} cobranças a vencer</p>
        {groups.map((g) => {
          const items = open.filter((c) => c.group === g.key)
          if (!items.length) return null
          return (
            <div key={g.key} className="mb-3">
              <p className="mb-1 text-sm text-muted">{g.title}</p>
              {items.map((c) => {
                const Icon = kindIcon[c.kind]
                return (
                  <Link key={c.id} to={`/pagamentos/cobranca/${c.id}`} className="flex items-center gap-4 py-3 active:bg-surface">
                    <Icon size={20} />
                    <div className="flex-1">
                      <p className="font-semibold">{c.title}</p>
                      <p className="text-sm text-muted">{formatBRL(c.value)}</p>
                    </div>
                    <ChevronRight size={20} />
                  </Link>
                )
              })}
            </div>
          )
        })}
        <div className="mt-4 border-t border-line pt-4">
          <p className="text-sm text-muted">Total a ser pago</p>
          <p className="text-[26px] font-extrabold">{formatBRL(total)}</p>
          <p className="flex items-center gap-1.5 text-xs text-muted">
            <CalendarDays size={13} /> Vencimento {dueDate}
          </p>
        </div>
      </div>
    </Screen>
  )
}

export function ChargeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { update, showToast } = useStore()
  const [sheet, setSheet] = useState(false)
  const charge = charges.find((c) => c.id === id) ?? charges[0]
  const Icon = kindIcon[charge.kind]

  const details: [string, string][] =
    charge.kind === 'km'
      ? [
          ['Placa', car.plate],
          ['Franquia contratada', `${car.kmMonthLimit} Km/mês`],
          ['Início da apuração', 'de 01/09/2026'],
          ['Final da apuração', 'até 30/09/2026'],
          ['Franquia excedente', '1000 km'],
          ['Valor KM Unitário', 'R$ 1,20'],
        ]
      : charge.kind === 'multa'
        ? [
            ['Placa', car.plate],
            ['Infração', 'Excesso de velocidade até 20%'],
            ['Data', '05/09/2026'],
            ['Taxa administrativa', 'R$ 10,00'],
          ]
        : [
            ['Placa', car.plate],
            ['Período', 'Outubro/2026'],
            ['Plano', '36 meses · 2000 km'],
          ]

  const subtitle =
    charge.kind === 'km'
      ? 'Cobrança por ultrapassar a franquia contratada.'
      : charge.kind === 'multa'
        ? 'Multa de trânsito repassada ao condutor.'
        : 'Mensalidade da sua assinatura.'

  const pay = (method: string) => {
    if (method === 'Cartão de crédito') {
      update((s) => ({ paidCharges: [...s.paidCharges, charge.id] }))
      setSheet(false)
      showToast('Pagamento aprovado!')
      navigate('/pagamentos')
      return
    }
    showToast('Código copiado com sucesso!')
  }

  return (
    <Screen
      back
      title="Detalhes da cobrança"
      footer={
        <>
          <Button block onClick={() => setSheet(true)}>
            Pagar esta cobrança
          </Button>
          <button className="mt-3 flex w-full items-center justify-center gap-2 text-sm font-semibold text-brand">
            <Download size={16} /> Demonstrativo completo
          </button>
        </>
      }
    >
      <div className="px-5 pb-6">
        <p className="flex items-center gap-2 text-lg font-bold">
          <Icon size={20} /> {charge.title}
        </p>
        <p className="mt-1 text-sm text-muted">{subtitle}</p>
        <div className="my-4 h-px bg-line" />
        <p className="text-sm text-muted">Valor total</p>
        <p className="text-[26px] font-extrabold">{formatBRL(charge.value)}</p>
        <p className="text-sm text-muted">Vencimento {dueDate}</p>
        <div className="my-4 h-px bg-line" />
        <dl className="space-y-3 text-sm">
          {details.map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <dt className="text-muted">{k}</dt>
              <dd className="font-medium">{v}</dd>
            </div>
          ))}
        </dl>
        {charge.kind === 'km' && (
          <Link to="/km" className="mt-5 flex items-center justify-center gap-1.5 text-sm font-semibold text-brand">
            Consultar uso de Km <ArrowRight size={16} />
          </Link>
        )}
      </div>

      <Sheet open={sheet} onClose={() => setSheet(false)} title="Forma de pagamento">
        <div className="space-y-3">
          <PayOption icon={QrCode} title="Pix" tag="Mais rápido" code="00020126580014BR.GOV.BCB.PIX..." onClick={() => pay('Pix')} />
          <PayOption icon={Barcode} title="Boleto bancário" code="0019 0500 9 5 4014481606 9 0..." onClick={() => pay('Boleto')} />
          <PayOption icon={CreditCard} title="Cartão de crédito" code="Parcelamento disponível" onClick={() => pay('Cartão de crédito')} chevron />
        </div>
      </Sheet>
    </Screen>
  )
}

function PayOption({
  icon: Icon,
  title,
  tag,
  code,
  onClick,
  chevron,
}: {
  icon: LucideIcon
  title: string
  tag?: string
  code: string
  onClick: () => void
  chevron?: boolean
}) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-3 rounded-xl border border-line p-4 text-left active:bg-surface">
      <Icon size={22} className="text-lime-dark" />
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-2 font-semibold">
          {title}
          {tag && (
            <Pill tone="success" className="py-0.5">
              <Zap size={11} /> {tag}
            </Pill>
          )}
        </p>
        <p className="truncate text-xs text-muted">{code}</p>
      </div>
      {chevron ? <ChevronRight size={18} /> : <Copy size={18} />}
    </button>
  )
}

const statusTone: Record<InvoiceStatus, 'warn' | 'success' | 'danger'> = {
  'A vencer': 'warn',
  Pago: 'success',
  'Em atraso': 'danger',
}

export function InvoiceHistory() {
  const [open, setOpen] = useState<string | null>(null)
  return (
    <Screen back largeTitle="Histórico de faturas">
      <div className="flex gap-2 px-5 pb-2">
        {['Tipo', 'Status de pagamento'].map((f) => (
          <span key={f} className="flex items-center gap-1 rounded-full bg-surface px-3 py-1.5 text-xs font-medium">
            {f} <ChevronDown size={14} />
          </span>
        ))}
      </div>
      <div className="px-5 pb-6">
        {invoiceHistory.map((y) => (
          <div key={y.year}>
            <p className="mt-4 mb-1 text-sm text-muted">{y.year}</p>
            {y.items.map((i) => {
              const key = y.year + i.month
              return (
                <div key={key} className="border-b border-line last:border-0">
                  <button onClick={() => setOpen(open === key ? null : key)} className="flex w-full items-center gap-3 py-3">
                    <span className="flex-1 text-left font-semibold">{i.month}</span>
                    <Pill tone={statusTone[i.status]}>{i.status}</Pill>
                    <ChevronDown size={18} className={cx('transition', open === key && 'rotate-180')} />
                  </button>
                  {open === key && (
                    <div className="mb-3 flex justify-between rounded-xl bg-surface px-4 py-3 text-sm">
                      <span className="text-muted">Valor da fatura</span>
                      <b>{formatBRL(i.value)}</b>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </Screen>
  )
}
