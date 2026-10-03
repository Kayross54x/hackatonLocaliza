import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AirVent,
  ArrowLeft,
  ArrowUpRight,
  CarFront,
  Check,
  ChevronDown,
  Cog,
  Disc3,
  Info,
  Lightbulb,
  MapPin,
  PanelTop,
  Sparkles,
  TriangleAlert,
  Wifi,
  Wrench,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { Button, Card, Field, Pill, Screen, Sheet, cx } from '../components/ui'
import { serviceCategories, workshops } from '../data/mock'
import { useStore } from '../state/store'

export function ServicesHome() {
  const navigate = useNavigate()
  const { maintenance } = useStore()
  return (
    <Screen title="Agendamento" tabBar>
      <div className="space-y-3 px-5 pb-6">
        <p className="pt-2 pb-1 text-xl font-bold">O que você quer fazer?</p>
        {maintenance && (
          <Card className="border-lime bg-lime-soft p-4" onClick={() => navigate('/servicos/acompanhamento')}>
            <p className="text-sm font-bold text-brand">Você tem um agendamento em andamento</p>
            <p className="mt-0.5 text-sm text-ink">Toque para acompanhar →</p>
          </Card>
        )}
        <Card className="p-4" onClick={() => navigate('/servicos/agendar')}>
          <Wrench size={22} className="text-lime-dark" />
          <p className="mt-2 font-bold">Agendar serviço</p>
          <p className="text-sm text-muted">Selecione os serviços que precisa em nossa lista.</p>
        </Card>
        <Card className="p-4" onClick={() => navigate('/ajuda/liza')}>
          <Sparkles size={22} className="text-lime-dark" />
          <p className="mt-2 font-bold">Fale com a Liza</p>
          <p className="text-sm text-muted">Descreva seu problema e a Liza, a IA da Localiza, vai ajudar você.</p>
        </Card>
        <Card className="border-danger p-4" onClick={() => navigate('/ajuda/ocorrencia')}>
          <TriangleAlert size={22} className="text-danger" />
          <p className="mt-2 font-bold text-danger">Reportar emergência</p>
          <p className="text-sm text-muted">
            Em caso de <b className="text-ink">batida, acidente, furto</b> ou <b className="text-ink">roubo</b>, entre em contato com a gente.
          </p>
        </Card>
      </div>
    </Screen>
  )
}

const categoryIcon: Record<string, LucideIcon> = {
  'Pneus e rodas': Disc3,
  'Ar-condicionado': AirVent,
  'Mecânica do carro': Cog,
  Lataria: CarFront,
  Vidro: PanelTop,
  'Luz, iluminação, interno e conforto': Lightbulb,
  'Sistema elétrico e eletrônico': Zap,
  'Luzes do painel': TriangleAlert,
}

export function Schedule() {
  const navigate = useNavigate()
  const { update, showToast } = useStore()
  const [step, setStep] = useState<1 | 2>(1)
  const [selected, setSelected] = useState<string[]>([])
  const [confirm, setConfirm] = useState(false)
  const [city, setCity] = useState('Belo Horizonte - BH')
  const [workshop, setWorkshop] = useState<string | null>(null)

  const toggle = (c: string) => setSelected((s) => (s.includes(c) ? s.filter((x) => x !== c) : [...s, c]))

  const finish = () => {
    update({ maintenance: { services: selected, workshopId: workshop!, createdAt: new Date().toISOString() } })
    showToast('Agendamento realizado!')
    navigate('/servicos/acompanhamento', { replace: true })
  }

  return (
    <Screen
      back={step === 1}
      closeIcon
      title="Agendamento"
      footer={
        step === 1 ? (
          <Button block disabled={!selected.length} onClick={() => setConfirm(true)}>
            Continuar
          </Button>
        ) : (
          <Button block disabled={!workshop} onClick={finish}>
            Confirmar agendamento
          </Button>
        )
      }
    >
      <div className="px-5">
        <div className="mb-1 h-1.5 overflow-hidden rounded-full bg-line">
          <div className="h-full rounded-full bg-lime transition-all" style={{ width: step === 1 ? '25%' : '50%' }} />
        </div>
        <p className="mb-4 text-xs text-muted">Etapa {step} de 4</p>
      </div>

      {step === 1 ? (
        <div className="px-5 pb-6">
          <p className="text-xl font-bold">O que houve com o carro?</p>
          <p className="mb-4 text-sm text-muted">Indique para o que é necessário manutenção.</p>
          <div className="grid grid-cols-2 gap-3">
            {serviceCategories.map((c) => {
              const Icon = categoryIcon[c]
              const on = selected.includes(c)
              return (
                <button
                  key={c}
                  onClick={() => toggle(c)}
                  className={cx(
                    'relative flex h-24 flex-col justify-between rounded-xl border p-3 text-left text-sm font-medium',
                    on ? 'border-lime-dark bg-lime-soft' : 'border-line',
                  )}
                >
                  <Icon size={20} className="text-lime-dark" />
                  {c}
                  {on && <Check size={16} className="absolute top-3 right-3 text-brand" />}
                </button>
              )
            })}
          </div>
          <Card className="mt-3 p-4" onClick={() => navigate('/ajuda/liza')}>
            <div className="flex items-center gap-3">
              <Info size={20} className="text-lime-dark" />
              <div className="flex-1">
                <p className="text-sm font-bold text-brand">Não sabe dizer o problema?</p>
                <p className="text-sm text-muted">Conte pra gente!</p>
              </div>
              <ArrowUpRight size={18} />
            </div>
          </Card>
        </div>
      ) : (
        <div className="px-5 pb-6">
          <button onClick={() => setStep(1)} className="mb-3 flex items-center gap-1 text-sm">
            <ArrowLeft size={16} /> Voltar
          </button>
          <p className="text-xl font-bold">Cidade</p>
          <div className="mt-3 mb-4">
            <Field label="Onde quer levar seu carro?" value={city} onChange={setCity} />
          </div>
          <p className="mb-3 text-sm font-semibold">Fornecedores disponíveis</p>
          <div className="space-y-3">
            {workshops.map((w) => (
              <Card
                key={w.id}
                onClick={() => setWorkshop(w.id)}
                className={cx('overflow-hidden', workshop === w.id && 'border-2 border-lime-dark')}
              >
                {w.best && (
                  <div className="relative flex h-20 items-end bg-gradient-to-br from-lime to-brand p-3">
                    <Pill tone="success" className="absolute top-2 right-2">
                      <Wifi size={11} /> Melhor serviço
                    </Pill>
                  </div>
                )}
                <div className="p-3">
                  <div className="flex justify-between gap-2">
                    <p className="font-bold text-brand">{w.name}</p>
                    <span className="shrink-0 text-sm font-semibold">{w.distance}</span>
                  </div>
                  <p className="mt-1 flex gap-1.5 text-xs text-muted">
                    <MapPin size={14} className="shrink-0 text-lime-dark" /> {w.address}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-brand underline">Mostrar no mapa</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Sheet open={confirm} onClose={() => setConfirm(false)} title="Confirmar agendamento">
        <p className="text-sm text-muted">Deseja concluir o agendamento agora ou adicionar outro problema?</p>
        <div className="mt-3 rounded-xl border border-line p-3">
          <p className="mb-2 text-center text-xs text-muted">Serviços selecionados</p>
          <div className="flex flex-wrap gap-2">
            {selected.map((s) => (
              <button key={s} onClick={() => toggle(s)}>
                <Pill tone="success">
                  <X size={11} /> {s}
                </Pill>
              </button>
            ))}
          </div>
        </div>
        <div className="mt-3 flex gap-2 rounded-xl bg-surface p-3 text-sm text-muted">
          <Info size={18} className="shrink-0" /> Não se preocupe: nossa equipe fará a avaliação completa no PitStop.
        </div>
        <Button
          block
          className="mt-4"
          disabled={!selected.length}
          onClick={() => {
            setConfirm(false)
            setStep(2)
          }}
        >
          Confirmar
        </Button>
        <Button block variant="outline" className="mt-2" onClick={() => setConfirm(false)}>
          Indicar mais um problema
        </Button>
      </Sheet>
    </Screen>
  )
}

const trackingSteps = ['Agendamento realizado', 'Agendamento confirmado', 'Diagnóstico concluído', 'Manutenção concluída', 'Pronto para retirada', 'Carro entregue']

export function Tracking() {
  const { maintenance } = useStore()
  const [expanded, setExpanded] = useState(true)
  const w = workshops.find((x) => x.id === maintenance?.workshopId) ?? workshops[2]
  const date = maintenance ? new Date(maintenance.createdAt) : new Date()
  const stamp = `${date.toLocaleDateString('pt-BR')} - ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
  // Na demo, o agendamento recém-criado fica na etapa 1 (realizado).
  const current = maintenance ? 0 : 4

  return (
    <Screen back="/servicos" title="Acompanhamento" bg="bg-surface">
      <div className="space-y-3 px-5 pb-6">
        <Card className="p-4">
          <p className="text-xs text-muted">Fornecedor</p>
          <p className="font-bold">{w.name}</p>
          <p className="mt-1 flex gap-1.5 text-xs text-muted">
            <MapPin size={14} className="shrink-0 text-lime-dark" /> Endereço
          </p>
          <p className="text-sm text-brand underline">{w.address}</p>
          {maintenance && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {maintenance.services.map((s) => (
                <Pill key={s} tone="neutral">
                  {s}
                </Pill>
              ))}
            </div>
          )}
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted">Previsão de entrega</p>
          <p className="font-bold text-brand">{current >= 4 ? 'Carro pronto para retirada' : 'Em até 2 dias úteis'}</p>
          <p className="text-xs text-muted">Atualizado em: {stamp}</p>
          <button onClick={() => setExpanded(!expanded)} className="mt-3 flex items-center gap-1 text-sm font-medium">
            {expanded ? 'Ocultar' : 'Mostrar'} etapas <ChevronDown size={16} className={cx(expanded && 'rotate-180')} />
          </button>
          {expanded && (
            <ol className="mt-3">
              {trackingSteps.map((s, i) => {
                const done = i <= current
                return (
                  <li key={s} className="relative flex gap-3 pb-4 last:pb-0">
                    {i < trackingSteps.length - 1 && (
                      <span className={cx('absolute top-5 left-[9px] h-full w-0.5', i < current ? 'bg-lime-dark' : 'bg-line')} />
                    )}
                    <span
                      className={cx('relative z-10 grid h-5 w-5 shrink-0 place-items-center rounded-full', done ? 'bg-lime-dark' : 'bg-line')}
                    >
                      {done && <Check size={12} className="text-white" strokeWidth={3} />}
                    </span>
                    <div className={cx('flex-1 rounded-lg', i === current && 'bg-lime-soft p-2 -mt-2')}>
                      {done && <p className="text-[11px] text-muted">{stamp}</p>}
                      <p className={cx('text-sm', done ? 'font-bold' : 'text-muted')}>{s}</p>
                    </div>
                  </li>
                )
              })}
            </ol>
          )}
        </Card>
      </div>
    </Screen>
  )
}
