import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowUpRight,
  ChevronRight,
  CircleCheck,
  CircleDollarSign,
  CircleHelp,
  Gift,
  House,
  TriangleAlert,
  Wrench,
  X,
  type LucideIcon,
} from 'lucide-react'
import { useStore } from '../state/store'
import { useMissionSummary } from './missions'

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')

/* ---------- Estrutura de tela ---------- */

type ScreenProps = {
  children: ReactNode
  /** Título pequeno ao lado da seta (ex.: "Agendamento") */
  title?: string
  /** Título grande verde abaixo da seta (ex.: "Gestão de km") */
  largeTitle?: string
  subtitle?: string
  /** true volta no histórico; string navega para a rota; 'close' mostra um X */
  back?: boolean | string
  closeIcon?: boolean
  /** Cabeçalho com fundo verde (telas do programa de indicação) */
  greenHeader?: boolean
  tabBar?: boolean
  footer?: ReactNode
  bg?: string
  headerRight?: ReactNode
}

export function Screen({
  children,
  title,
  largeTitle,
  subtitle,
  back,
  closeIcon,
  greenHeader,
  tabBar,
  footer,
  bg = 'bg-white',
  headerRight,
}: ScreenProps) {
  const navigate = useNavigate()
  const goBack = () => (typeof back === 'string' ? navigate(back) : navigate(-1))
  const BackIcon = closeIcon ? X : ArrowLeft

  return (
    <div className={cx('flex h-full flex-col', bg)}>
      {(back || title) && (
        <header
          className={cx(
            'flex shrink-0 items-center gap-2 px-4',
            greenHeader ? 'bg-brand py-4 text-white' : 'pt-3 pb-2 text-brand',
          )}
        >
          {back && (
            <button onClick={goBack} aria-label="Voltar" className="-ml-1 rounded-full p-1 active:bg-black/5">
              <BackIcon size={22} className={greenHeader ? 'text-white' : 'text-ink'} />
            </button>
          )}
          {title && <h1 className={cx('flex-1 text-[17px] font-semibold', greenHeader && 'text-center pr-7')}>{title}</h1>}
          {!title && <div className="flex-1" />}
          {headerRight}
        </header>
      )}
      <main className="no-scrollbar flex-1 overflow-y-auto">
        {largeTitle && (
          <div className="px-5 pt-1 pb-4">
            <h1 className="text-[28px] leading-tight font-extrabold text-brand">{largeTitle}</h1>
            {subtitle && <p className="mt-1.5 text-sm leading-relaxed text-muted">{subtitle}</p>}
          </div>
        )}
        {children}
      </main>
      {footer && <div className="shrink-0 border-t border-line bg-white px-5 pt-3 pb-4">{footer}</div>}
      {tabBar && <TabBar />}
    </div>
  )
}

/* ---------- Barra inferior ---------- */

const tabs: { to: string; label: string; icon: LucideIcon; match: (p: string) => boolean }[] = [
  { to: '/', label: 'Início', icon: House, match: (p) => p === '/' },
  { to: '/pagamentos', label: 'Pagamentos', icon: CircleDollarSign, match: (p) => p.startsWith('/pagamentos') },
  { to: '/recompensas', label: 'Recompensas', icon: Gift, match: (p) => p.startsWith('/recompensas') },
  { to: '/servicos', label: 'Serviços', icon: Wrench, match: (p) => p.startsWith('/servicos') },
  { to: '/ajuda', label: 'Ajuda', icon: TriangleAlert, match: (p) => p.startsWith('/ajuda') },
]

export function TabBar() {
  const { pathname } = useLocation()
  const readyCount = useMissionSummary().ready.length
  return (
    <nav className="grid shrink-0 grid-cols-5 border-t border-line bg-white pb-[max(env(safe-area-inset-bottom),6px)]">
      {tabs.map(({ to, label, icon: Icon, match }) => {
        const active = match(pathname)
        return (
          <Link key={to} to={to} className="relative flex flex-col items-center gap-1 pt-2.5 pb-1">
            {active && <span className="absolute top-0 h-[3px] w-12 rounded-b bg-lime" />}
            {to === '/recompensas' && readyCount > 0 && (
              <span className="absolute top-1 left-1/2 z-10 ml-2 grid h-4 min-w-4 place-items-center rounded-full bg-danger px-1 text-[10px] font-bold text-white ring-2 ring-white">
                {readyCount}
              </span>
            )}
            <span className={cx('grid h-6 w-6 place-items-center rounded-full', active && 'bg-lime-dark')}>
              <Icon size={active ? 15 : 19} className={active ? 'text-white' : 'text-muted'} strokeWidth={active ? 2.5 : 1.8} />
            </span>
            <span className={cx('text-[10.5px]', active ? 'font-semibold text-brand' : 'text-muted')}>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

/* ---------- Blocos básicos ---------- */

export function Card({ children, className, onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className={cx('rounded-2xl border border-line bg-white', onClick && 'cursor-pointer active:bg-surface', className)}
    >
      {children}
    </div>
  )
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'outline' | 'ghost' | 'soft'
  size?: 'md' | 'sm'
  block?: boolean
}

export function Button({ variant = 'primary', size = 'md', block, className, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={cx(
        'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition active:scale-[0.98] disabled:opacity-40',
        size === 'md' ? 'h-12 px-5 text-[15px]' : 'h-9 px-4 text-sm',
        variant === 'primary' && 'bg-lime text-brand-dark',
        variant === 'outline' && 'border-[1.5px] border-lime-dark bg-white text-brand',
        variant === 'ghost' && 'text-brand',
        variant === 'soft' && 'bg-lime-soft text-brand',
        block && 'w-full',
        className,
      )}
    />
  )
}

type Tone = 'warn' | 'success' | 'danger' | 'info' | 'neutral' | 'brand'

const toneClass: Record<Tone, string> = {
  warn: 'bg-warn-soft text-warn',
  success: 'bg-lime-soft text-brand',
  danger: 'bg-danger-soft text-danger',
  info: 'bg-info-soft text-[#1060a8]',
  neutral: 'bg-surface text-muted',
  brand: 'bg-brand text-white',
}

export function Pill({ tone = 'neutral', children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return (
    <span className={cx('inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold', toneClass[tone], className)}>
      {children}
    </span>
  )
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between px-5 pt-6 pb-3">
      <h2 className="text-xl font-bold text-brand">{children}</h2>
      {action}
    </div>
  )
}

/** Linha clicável com ícone, título/subtítulo e seta */
export function RowLink({
  icon: Icon,
  title,
  subtitle,
  to,
  onClick,
  external,
  right,
  className,
}: {
  icon?: LucideIcon
  title: ReactNode
  subtitle?: ReactNode
  to?: string
  onClick?: () => void
  external?: boolean
  right?: ReactNode
  className?: string
}) {
  const content = (
    <>
      {Icon && <Icon size={20} className="shrink-0 text-lime-dark" />}
      <div className="min-w-0 flex-1">
        <div className="text-[15px] font-semibold text-ink">{title}</div>
        {subtitle && <div className="mt-0.5 text-sm text-muted">{subtitle}</div>}
      </div>
      {right ?? (external ? <ArrowUpRight size={20} className="text-ink" /> : <ChevronRight size={20} className="text-ink" />)}
    </>
  )
  const cls = cx('flex w-full items-center gap-3 px-4 py-4 text-left active:bg-surface', className)
  if (to) return <Link to={to} className={cls}>{content}</Link>
  return <button onClick={onClick} className={cls}>{content}</button>
}

/** Ícone + rótulo + valor (usado em contrato, cobranças etc.) */
export function InfoItem({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: ReactNode }) {
  return (
    <div className="flex gap-3 py-2">
      <Icon size={20} className="mt-0.5 shrink-0 text-lime-dark" />
      <div>
        <div className="text-sm text-muted">{label}</div>
        <div className="text-[15px] font-bold text-ink">{value}</div>
      </div>
    </div>
  )
}

/** Quadrado de atalho do menu (CRLV, Serviços, Multas...) */
export function IconTile({ icon: Icon, label, to, onClick }: { icon: LucideIcon; label: string; to?: string; onClick?: () => void }) {
  const inner = (
    <>
      <Icon size={20} className="text-lime-dark" />
      <span className="text-left text-xs leading-tight text-ink">{label}</span>
    </>
  )
  const cls = 'flex h-[76px] flex-col justify-between rounded-xl border border-line bg-white p-2.5 active:bg-surface'
  if (to) return <Link to={to} className={cls}>{inner}</Link>
  return <button onClick={onClick} className={cls}>{inner}</button>
}

export function HelpCard({ title, subtitle = 'Acesse nossa Central de Ajuda', to = '/ajuda/central' }: { title: string; subtitle?: string; to?: string }) {
  return (
    <Card className="mx-5 my-4">
      <RowLink
        to={to}
        title={<span className="text-sm text-brand">{title}</span>}
        subtitle={subtitle}
        external
        icon={CircleHelp}
      />
    </Card>
  )
}

/* ---------- Overlays ---------- */

export function Sheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}) {
  if (!open) return null
  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-end">
      <div className="anim-fade absolute inset-0 bg-black/45" onClick={onClose} />
      <div className="anim-sheet relative max-h-[85%] overflow-y-auto rounded-t-3xl bg-white px-5 pt-3 pb-6">
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-line" />
        {title && (
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-ink">{title}</h3>
            <button onClick={onClose} aria-label="Fechar">
              <X size={20} />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}

export function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  if (!open) return null
  return (
    <div className="absolute inset-0 z-40 grid place-items-center px-8">
      <div className="anim-fade absolute inset-0 bg-black/45" onClick={onClose} />
      <div className="anim-fade relative w-full rounded-2xl bg-white p-6 text-center">
        <button onClick={onClose} className="absolute top-3 right-3" aria-label="Fechar">
          <X size={18} />
        </button>
        {children}
      </div>
    </div>
  )
}

export function Toast() {
  const { toast } = useStore()
  if (!toast) return null
  return (
    <div className="anim-toast absolute inset-x-4 top-3 z-50 flex items-center gap-2 rounded-xl bg-brand px-4 py-3 text-sm font-medium text-white shadow-lg">
      <CircleCheck size={18} className="shrink-0" />
      {toast}
    </div>
  )
}

/* ---------- Formulário ---------- */

export function Field({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  hint,
  error,
}: {
  label?: string
  placeholder?: string
  value: string
  onChange: (v: string) => void
  type?: string
  hint?: string
  error?: boolean
}) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>}
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={cx(
          'h-12 w-full rounded-xl border bg-white px-4 text-[15px] outline-none placeholder:text-muted/70 focus:border-lime-dark',
          error ? 'border-danger' : 'border-[#c9cfcb]',
        )}
      />
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  )
}

export function Logo({ white, className }: { white?: boolean; className?: string }) {
  return (
    <img
      src={white ? '/img/logo-assinatura-white.png' : '/img/logo-assinatura.png'}
      alt="Localiza Assinatura"
      className={cx('h-8 w-auto', className)}
    />
  )
}

export { cx }
