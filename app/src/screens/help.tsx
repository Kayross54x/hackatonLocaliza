import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronRight,
  CircleHelp,
  FileText,
  Gauge,
  Hash,
  Phone,
  Search,
  Send,
  Siren,
  Sparkles,
  TriangleAlert,
  X,
  type LucideIcon,
} from 'lucide-react'
import { Button, Card, Logo, Screen, cx } from '../components/ui'
import { car } from '../data/mock'
import { useStore } from '../state/store'

const searchIndex = [
  { label: 'Acessar multas', to: '/multas', tags: 'multas multa infração' },
  { label: 'Histórico de multas', to: '/multas?tab=finalizadas', tags: 'multas multa histórico' },
  { label: 'Indicar condutor responsável', to: '/multas', tags: 'multas multa condutor indicar' },
  { label: 'Consultar uso de km', to: '/km', tags: 'km quilometragem franquia' },
  { label: 'Agendar revisão ou serviço', to: '/servicos/agendar', tags: 'revisão manutenção serviço oficina' },
  { label: 'Ver faturas e pagamentos', to: '/pagamentos', tags: 'fatura boleto pix pagamento' },
  { label: 'Resumo do contrato', to: '/contrato', tags: 'contrato franquia cobertura seguro' },
  { label: 'Onde está meu carro?', to: '/carro/localizar', tags: 'localizar carro mapa' },
]

export function Help() {
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const results = q.trim()
    ? searchIndex.filter((i) => (i.label + ' ' + i.tags).toLowerCase().includes(q.trim().toLowerCase()))
    : []

  return (
    <Screen tabBar>
      <div className="px-5 pt-4">
        <h1 className="text-[26px] font-extrabold text-brand">Ajuda</h1>
        <label className="mt-4 flex h-11 items-center gap-2 rounded-xl border border-lime-dark px-3">
          <Search size={18} className="text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="O que você precisa?"
            className="flex-1 bg-transparent text-[15px] outline-none"
          />
          {q && (
            <button onClick={() => setQ('')} aria-label="Limpar">
              <X size={16} />
            </button>
          )}
        </label>
      </div>

      {q ? (
        <div className="mt-2 divide-y divide-line px-5">
          {results.length ? (
            results.map((r) => (
              <Link key={r.label} to={r.to} className="flex items-center justify-between py-4 text-[15px]">
                {r.label} <ChevronRight size={18} />
              </Link>
            ))
          ) : (
            <p className="py-6 text-center text-sm text-muted">Nada encontrado. Tente “multas” ou “km”.</p>
          )}
        </div>
      ) : (
        <div className="px-5 pb-6">
          <p className="mt-5 mb-2 text-sm font-medium">Atalhos</p>
          <div className="grid grid-cols-3 gap-2">
            <Shortcut icon={FileText} label="Multas" to="/multas" />
            <Shortcut icon={Gauge} label="Uso de KM" to="/km" />
            <Shortcut icon={ArrowUpRight} label="Portal" to="/ajuda/central" />
          </div>
          <p className="mt-5 mb-2 text-sm font-medium">Suporte e ajuda</p>
          <div className="grid grid-cols-2 gap-3">
            <SupportCard icon={TriangleAlert} title="Emergência" text="Suporte 24h para urgências" danger onClick={() => navigate('/ajuda/emergencia')} />
            <SupportCard icon={Siren} title="Danos" text="Registro de acidentes/batidas" onClick={() => navigate('/ajuda/ocorrencia')} />
            <SupportCard icon={Phone} title="Fale conosco" text="Pelo WhatsApp, email ou ligação" onClick={() => navigate('/ajuda/liza')} />
            <SupportCard icon={CircleHelp} title="Dúvidas" text="Respostas sobre o Meoo" onClick={() => navigate('/ajuda/central')} />
          </div>
        </div>
      )}
    </Screen>
  )
}

function Shortcut({ icon: Icon, label, to }: { icon: LucideIcon; label: string; to: string }) {
  return (
    <Link to={to} className="flex flex-col items-center gap-1.5 rounded-xl border border-line py-3 text-xs font-semibold text-brand">
      <Icon size={20} className="text-lime-dark" /> {label}
    </Link>
  )
}

function SupportCard({ icon: Icon, title, text, danger, onClick }: { icon: LucideIcon; title: string; text: string; danger?: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={cx('rounded-xl border p-3 text-left', danger ? 'border-danger' : 'border-line')}>
      <Icon size={22} className={danger ? 'text-danger' : 'text-lime-dark'} />
      <p className={cx('mt-2 font-bold', danger ? 'text-danger' : 'text-brand')}>{title}</p>
      <p className="text-xs text-muted">{text}</p>
    </button>
  )
}

export function Emergency() {
  return (
    <Screen back title="Emergência">
      <div className="space-y-3 px-5 pb-6">
        <div className="rounded-2xl bg-danger-soft p-4">
          <TriangleAlert className="text-danger" />
          <p className="mt-2 font-bold text-danger">Está em uma situação de risco?</p>
          <p className="text-sm text-ink">Se houver feridos, ligue primeiro para o SAMU (192) ou Polícia (190).</p>
        </div>
        <Card>
          <a href="tel:08000991001" className="flex items-center gap-3 p-4">
            <Phone className="text-lime-dark" />
            <div className="flex-1">
              <p className="font-bold">Central 24h Localiza</p>
              <p className="text-sm text-muted">0800 099 1001</p>
            </div>
            <ChevronRight />
          </a>
        </Card>
        <Card>
          <Link to="/ajuda/ocorrencia" className="flex items-center gap-3 p-4">
            <Siren className="text-lime-dark" />
            <div className="flex-1">
              <p className="font-bold">Registrar ocorrência</p>
              <p className="text-sm text-muted">Batida, avaria, furto ou roubo</p>
            </div>
            <ChevronRight />
          </Link>
        </Card>
      </div>
    </Screen>
  )
}

export function Occurrence() {
  const navigate = useNavigate()
  const { update } = useStore()
  const [step, setStep] = useState(1)
  const [kind, setKind] = useState<string | null>(null)
  const kinds = ['O veículo foi danificado', 'O veículo teve uma ou mais partes roubadas ou furtadas']

  const next = () => {
    if (step < 2) return setStep(step + 1)
    update({ occurrence: { protocol: String(354047356 + Math.floor(Math.random() * 999)), kind: kind!, createdAt: new Date().toISOString() } })
    navigate('/ajuda/ocorrencia/acompanhamento', { replace: true })
  }

  return (
    <Screen
      back
      title="Registro de ocorrência"
      footer={
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => (step > 1 ? setStep(step - 1) : navigate(-1))}>
            Voltar
          </Button>
          <Button className="flex-1" disabled={step === 1 && !kind} onClick={next}>
            {step === 2 ? 'Enviar' : 'Continuar'}
          </Button>
        </div>
      }
    >
      <div className="px-5 pb-6">
        <div className="mb-5 flex items-center">
          {[1, 2, 3, 4].map((n, i) => (
            <div key={n} className="flex flex-1 items-center last:flex-none">
              <span
                className={cx(
                  'grid h-6 w-6 place-items-center rounded-full border text-xs',
                  n <= step ? 'border-lime-dark bg-lime-dark text-white' : 'border-line text-muted',
                )}
              >
                {n < step ? <Check size={12} /> : n}
              </span>
              {i < 3 && <span className={cx('h-px flex-1', n < step ? 'bg-lime-dark' : 'bg-line')} />}
            </div>
          ))}
        </div>

        {step === 1 ? (
          <>
            <p className="text-xl font-bold">Seu veículo</p>
            <p className="mt-3 mb-2 text-sm font-semibold">Qual dos seus veículos foi envolvido?</p>
            <div className="rounded-xl border border-line px-4 py-3 text-sm">
              {car.plate} - {car.shortModel}
            </div>
            <p className="mt-5 mb-2 text-sm font-semibold">O que aconteceu com o seu veículo?</p>
            <div className="space-y-2">
              {kinds.map((k) => (
                <label key={k} className={cx('flex items-center gap-3 rounded-xl border p-3 text-sm', kind === k ? 'border-lime-dark bg-lime-soft' : 'border-line')}>
                  <input type="radio" name="kind" checked={kind === k} onChange={() => setKind(k)} className="accent-lime-dark" /> {k}
                </label>
              ))}
            </div>
            <div className="mt-4 rounded-xl bg-surface p-3 text-xs text-muted">
              Para o furto ou roubo do <b>veículo completo</b>, ligue para a nossa Central de Atendimento <b>(0800 099 1001)</b>.
            </div>
          </>
        ) : (
          <>
            <p className="text-xl font-bold">Detalhes</p>
            <p className="mt-1 mb-4 text-sm text-muted">Conte rapidamente o que aconteceu. Fotos podem ser enviadas depois.</p>
            <textarea
              rows={5}
              placeholder="Ex.: Arranhão na porta traseira esquerda após manobra no estacionamento."
              className="w-full rounded-xl border border-[#c9cfcb] p-3 text-sm outline-none focus:border-lime-dark"
            />
          </>
        )}
      </div>
    </Screen>
  )
}

export function OccurrenceTracking() {
  const { occurrence } = useStore()
  const navigate = useNavigate()
  const date = occurrence ? new Date(occurrence.createdAt).toLocaleDateString('pt-BR') : '--'
  const steps = ['Registro recebido', 'Em análise', 'Aguardando tratativa com envolvidos', 'Aguardando faturamento', 'Ocorrência finalizada']
  return (
    <Screen back="/ajuda" title="Acompanhamento" bg="bg-surface" footer={<Button block onClick={() => navigate('/ajuda')}>Voltar</Button>}>
      <div className="space-y-3 px-5 pb-6">
        <Card className="space-y-2 p-4 text-sm">
          <p className="flex items-center gap-2 text-muted">
            <Hash size={14} /> Número de protocolo <b className="ml-auto text-ink">{occurrence?.protocol ?? '354047356'}</b>
          </p>
          <p className="flex items-center gap-2 text-muted">
            <CalendarDays size={14} /> Data da ocorrência <b className="ml-auto text-ink">{date}</b>
          </p>
          <p className="flex items-center gap-2 text-muted">
            <FileText size={14} /> Número da placa <b className="ml-auto text-ink">{car.plate}</b>
          </p>
        </Card>
        <Card className="p-4">
          {steps.map((s, i) => (
            <div key={s} className="relative flex gap-3 pb-5 last:pb-0">
              {i < steps.length - 1 && <span className="absolute top-5 left-[9px] h-full w-0.5 bg-line" />}
              <span className={cx('relative z-10 grid h-5 w-5 place-items-center rounded-full', i === 0 ? 'bg-lime-dark' : i === 1 ? 'bg-[#2b8fe0]' : 'bg-line')}>
                {i === 0 && <Check size={12} className="text-white" />}
              </span>
              <div className={cx('flex-1', i === 1 && '-mt-2 rounded-lg bg-info-soft p-2')}>
                {i === 0 && <p className="text-[11px] text-muted">{date}</p>}
                <p className={cx('text-sm', i <= 1 ? 'font-bold' : 'text-muted')}>{s}</p>
                {i === 1 && <p className="text-xs text-muted">Aguarde de 2-3 dias para a nossa equipe verificar e analisar os dados enviados.</p>}
              </div>
            </div>
          ))}
        </Card>
      </div>
    </Screen>
  )
}

export function HelpCenter() {
  const links = ['Sobre o Localiza Meoo', 'Carro provisório', 'Entrega do carro zero', 'Gestão do contrato', 'Pagamentos e faturas', 'Agendamentos de serviços']
  const faq = ['Quais são as funcionalidades do app?', 'Como funciona a franquia de km?', 'O que fazer em caso de multa?']
  return (
    <Screen back title="Central de ajuda">
      <div className="px-5 pb-6">
        <Logo className="mx-auto mb-4 h-7" />
        <h1 className="text-2xl font-extrabold text-brand">Boas vindas à Central de ajuda para Clientes Localiza Meoo</h1>
        <p className="mt-2 text-sm text-muted">Como podemos te ajudar?</p>
        <label className="mt-3 flex h-11 items-center gap-2 rounded-xl border border-line px-3">
          <input placeholder="Digite aqui o que você deseja encontrar..." className="flex-1 text-sm outline-none" />
          <Search size={16} />
        </label>
        <Card className="mt-5 p-4">
          <p className="mb-2 font-bold">Acesso rápido</p>
          {links.map((l) => (
            <p key={l} className="py-1 text-sm text-brand underline">
              {l}
            </p>
          ))}
        </Card>
        <p className="mt-6 mb-2 font-bold">Artigos mais acessados</p>
        <div className="space-y-2">
          {faq.map((f) => (
            <Card key={f} className="flex items-center justify-between p-4 text-sm font-medium">
              {f} <ChevronRight size={16} />
            </Card>
          ))}
        </div>
      </div>
    </Screen>
  )
}

type Msg = { from: 'liza' | 'me'; text: string }

function lizaReply(text: string): string {
  const t = text.toLowerCase()
  if (t.includes('multa')) return 'Você tem 1 multa com indicação pendente até 30/10/2026. Quer que eu abra a tela de multas?'
  if (t.includes('km') || t.includes('quilomet')) return `Neste mês você rodou ${car.kmMonth} km dos ${car.kmMonthLimit} km da sua franquia. Está tudo dentro do limite!`
  if (t.includes('barulho') || t.includes('revis') || t.includes('pneu')) return 'Parece um caso para manutenção. Posso te ajudar a agendar um serviço em uma oficina parceira perto de você.'
  if (t.includes('fatura') || t.includes('boleto') || t.includes('pag')) return 'Você tem cobranças a vencer em 01/11/2026. Dá para pagar por Pix, boleto ou cartão na aba Pagamentos.'
  return 'Entendi! Vou te conectar com um especialista. Enquanto isso, posso ajudar com multas, km, faturas ou agendamento de serviços.'
}

export function Liza() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: 'liza', text: `Oi, ${'Ana'}! Eu sou a Liza, a IA da Localiza. Como posso ajudar hoje?` },
  ])
  const [input, setInput] = useState('')
  const send = (text: string) => {
    if (!text.trim()) return
    setMsgs((m) => [...m, { from: 'me', text }, { from: 'liza', text: lizaReply(text) }])
    setInput('')
  }
  return (
    <Screen
      back
      title="Fale com a Liza"
      bg="bg-surface"
      footer={
        <form
          onSubmit={(e) => {
            e.preventDefault()
            send(input)
          }}
          className="flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escreva sua mensagem"
            className="h-11 flex-1 rounded-xl border border-line px-3 text-sm outline-none focus:border-lime-dark"
          />
          <button className="grid h-11 w-11 place-items-center rounded-xl bg-lime text-brand-dark" aria-label="Enviar">
            <Send size={18} />
          </button>
        </form>
      }
    >
      <div className="space-y-3 px-4 py-2">
        {msgs.map((m, i) => (
          <div key={i} className={cx('flex', m.from === 'me' && 'justify-end')}>
            {m.from === 'liza' && (
              <span className="mr-2 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand">
                <Sparkles size={14} className="text-lime" />
              </span>
            )}
            <p className={cx('max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm', m.from === 'me' ? 'bg-brand text-white' : 'bg-white')}>{m.text}</p>
          </div>
        ))}
        {msgs.length === 1 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {['Tenho uma multa', 'Quanto de km eu rodei?', 'Meu carro está fazendo barulho'].map((s) => (
              <button key={s} onClick={() => send(s)} className="rounded-full border border-lime-dark bg-white px-3 py-1.5 text-xs font-medium text-brand">
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </Screen>
  )
}
