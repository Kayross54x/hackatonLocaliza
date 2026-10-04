import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BadgePercent, CalendarDays, ChevronDown, CircleAlert, FileText, Gift, Share2, Smartphone, Ticket } from 'lucide-react'
import { Button, Card, Field, Logo, Pill, Screen, cx } from '../components/ui'
import { clubPartners, type Referral } from '../data/mock'
import { useStore } from '../state/store'

export function RentalDiscount() {
  const { showToast } = useStore()
  const [rules, setRules] = useState(false)
  return (
    <Screen back title="Benefícios Localiza Assinatura">
      <div className="px-5 pb-6">
        <Card className="p-5">
          <div className="flex justify-center">
            <Logo className="h-9" />
          </div>
          <p className="mt-5 text-center text-lg font-bold">15% de desconto no aluguel diário de carros na Localiza.</p>
          <div className="mt-4 rounded-xl bg-lime-soft p-3 text-sm text-brand">
            Cliente Localiza Assinatura automaticamente entra na categoria Gold ou Platinum no programa de fidelidade Localiza.
          </div>
          <p className="mt-5 mb-2 font-semibold">Aluguel diário</p>
          <Button block onClick={() => showToast('Código copiado com sucesso!')}>
            Reservar no site
          </Button>
          <Button block variant="outline" className="mt-2" onClick={() => showToast('Código copiado com sucesso!')}>
            Reservar no app ↗
          </Button>
          <p className="mt-3 text-xs text-muted">Para resgatar, faça a reserva com o CPF do titular do contrato de assinatura.</p>
        </Card>
        <Card className="mt-3">
          <button onClick={() => setRules(!rules)} className="flex w-full items-center gap-3 p-4 text-left">
            <FileText size={18} className="text-lime-dark" />
            <span className="flex-1 font-semibold">Leia o regulamento</span>
            <ChevronDown size={18} className={cx(rules && 'rotate-180')} />
          </button>
          {rules && (
            <p className="px-4 pb-4 text-sm text-muted">
              Desconto válido para reservas de aluguel diário em agências participantes, não cumulativo com outras promoções. Sujeito à
              disponibilidade de frota.
            </p>
          )}
        </Card>
      </div>
    </Screen>
  )
}

export function Club() {
  const { showToast } = useStore()
  return (
    <Screen back title="Clube de benefícios">
      <div className="bg-lime px-5 py-6">
        <span className="rounded bg-brand px-2 py-1 text-sm font-bold text-white">Um Clube de Benefícios</span>
        <p className="mt-2 text-sm font-semibold text-brand-dark">exclusivo, bem na palma da sua mão.</p>
      </div>
      <div className="px-5 py-5">
        <p className="text-xl font-extrabold text-lime-dark">UM CLUBE EXCLUSIVO</p>
        <p className="text-sm font-semibold text-brand">PARA VOCÊ APROVEITAR</p>
        <p className="mt-2 text-sm text-muted">
          Você faz parte de um <b>Clube de Benefícios</b> pensado para trazer economia, praticidade e muitas vantagens no seu dia a dia.
        </p>
      </div>
      <div className="mx-5 grid grid-cols-3 gap-2 rounded-2xl bg-brand p-3 text-white">
        {[
          { icon: Smartphone, t: 'Acesso via app' },
          { icon: BadgePercent, t: '100% gratuito' },
          { icon: Gift, t: 'Diversas vantagens' },
        ].map(({ icon: Icon, t }) => (
          <div key={t} className="rounded-xl border border-lime/60 p-2 text-center">
            <Icon size={20} className="mx-auto text-lime" />
            <p className="mt-1 text-[11px] font-bold uppercase">{t}</p>
          </div>
        ))}
      </div>
      <p className="px-5 pt-6 pb-3 text-lg font-bold text-brand">Parceiros</p>
      <div className="space-y-2 px-5 pb-6">
        {clubPartners.map((p) => (
          <Card key={p.name} className="flex items-center gap-3 p-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-lime-soft">
              <Ticket size={20} className="text-brand" />
            </span>
            <div className="flex-1">
              <p className="text-sm font-bold">{p.name}</p>
              <p className="text-xs text-muted">{p.category}</p>
              <p className="text-xs font-semibold text-brand">{p.offer}</p>
            </div>
            <Button size="sm" variant="soft" onClick={() => showToast('Cupom copiado!')}>
              Usar
            </Button>
          </Card>
        ))}
      </div>
    </Screen>
  )
}

function ReferralIllustration() {
  return (
    <svg viewBox="0 0 160 120" className="mx-auto h-32">
      <path d="M30 110 a50 50 0 0 1 100 0Z" fill="#e5f8d5" />
      <rect x="92" y="30" width="34" height="56" rx="6" transform="rotate(12 109 58)" fill="#74d62c" />
      <text x="103" y="66" fontSize="20" fontWeight="800" fill="#00612e" transform="rotate(12 109 58)">%</text>
      <circle cx="68" cy="30" r="10" fill="#00612e" />
      <path d="M58 44 h20 l6 40 h-32Z" fill="#00612e" />
      <path d="M78 50 l20 -18" stroke="#00612e" strokeWidth="6" strokeLinecap="round" />
      <path d="M58 50 l-16 -16" stroke="#00612e" strokeWidth="6" strokeLinecap="round" />
    </svg>
  )
}

export function ReferralProgram() {
  const navigate = useNavigate()
  const { showToast } = useStore()
  return (
    <Screen back greenHeader title="Programa de Indicação" bg="bg-surface">
      <div className="space-y-3 px-4 py-4">
        <Card className="p-4">
          <ReferralIllustration />
          <p className="mt-2 text-sm">Compartilhe o seu link para indicar a Localiza Assinatura!</p>
          <Button block size="sm" variant="soft" className="mt-3" onClick={() => showToast('Link copiado!')}>
            <Share2 size={16} /> Compartilhar meu link
          </Button>
        </Card>
        <Card className="flex items-center gap-3 p-4" onClick={() => navigate('/indicacao/nova')}>
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-lime-soft">
            <FileText className="text-brand" />
          </span>
          <p className="text-sm">Ou informe aqui os dados da pessoa a quem você quer indicar a Localiza Assinatura.</p>
        </Card>
        <Button block variant="outline" onClick={() => navigate('/indicacao/lista')}>
          VISUALIZAR MINHAS INDICAÇÕES
        </Button>
      </div>
    </Screen>
  )
}

export function ReferralNew() {
  const navigate = useNavigate()
  const { update, showToast } = useStore()
  const [f, setF] = useState({ name: '', phone: '', email: '' })
  const valid = f.name && f.phone && f.email
  return (
    <Screen
      back
      greenHeader
      title="Programa de Indicação"
      footer={
        <Button
          block
          disabled={!valid}
          onClick={() => {
            const r: Referral = { name: f.name.toUpperCase(), date: new Date().toLocaleDateString('pt-BR'), status: 'Em negociação' }
            update((s) => ({ referrals: [r, ...s.referrals] }))
            showToast('Indicação enviada!')
            navigate('/indicacao/lista', { replace: true })
          }}
        >
          Indicar
        </Button>
      }
    >
      <div className="space-y-3 px-5 py-4">
        <p className="text-sm">
          Condição vigente: premiação concedida para cada indicação que se tornar cliente (indicação válida). Dentro do período indicado
          será <b>R$1.000,00 de desconto</b> em uma fatura para o cliente que indicou e R$1.000,00 em uma fatura para o cliente indicado.
        </p>
        <p className="text-sm text-brand underline">Leia o regulamento</p>
        <Field placeholder="Nome para indicação" value={f.name} onChange={(v) => setF({ ...f, name: v })} hint="Campo obrigatório" />
        <Field placeholder="Telefone para indicação" value={f.phone} onChange={(v) => setF({ ...f, phone: v })} hint="Campo obrigatório" />
        <Field placeholder="E-mail para indicação" value={f.email} onChange={(v) => setF({ ...f, email: v })} hint="Campo obrigatório" />
        <div className="flex gap-3 rounded-xl bg-surface p-3 text-xs text-muted">
          <CircleAlert size={18} className="shrink-0 text-brand" />
          <p>
            <b>Atenção:</b> é importante avisar à pessoa a quem você quer indicar a Localiza Assinatura que os dados dela serão compartilhados.
            Levamos a sério todos os dados pessoais.
          </p>
        </div>
      </div>
    </Screen>
  )
}

export function ReferralList() {
  const { referrals } = useStore()
  const filters = ['Todas', 'Em negociação', 'Não aprovada', 'Aprovado'] as const
  const [filter, setFilter] = useState<(typeof filters)[number]>('Todas')
  const list = filter === 'Todas' ? referrals : referrals.filter((r) => r.status === filter)
  const tone = (s: Referral['status']) => (s === 'Aprovado' ? 'success' : s === 'Não aprovada' ? 'danger' : 'warn')
  return (
    <Screen back greenHeader title="Acessar indicações" bg="bg-surface">
      <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pt-4">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cx('shrink-0 rounded-lg border px-3 py-1.5 text-xs', filter === f ? 'border-brand bg-brand text-white' : 'border-brand text-brand')}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="space-y-3 px-4 py-4">
        {list.map((r) => (
          <Card key={r.name + r.date}>
            <p className="border-b border-line p-4 text-sm">{r.name}</p>
            <div className="flex items-center gap-3 p-4">
              <span className="flex items-center gap-1.5 rounded-lg bg-surface px-2 py-1 text-xs">
                <CalendarDays size={13} className="text-lime-dark" /> {r.date}
              </span>
              <Pill tone={tone(r.status)}>{r.status}</Pill>
            </div>
          </Card>
        ))}
        {list.length === 0 && <p className="py-8 text-center text-sm text-muted">Nenhuma indicação neste filtro.</p>}
      </div>
    </Screen>
  )
}
