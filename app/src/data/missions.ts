import { car, referrals as initialReferrals } from './mock'
import { lastDay, weeks } from './telemetry'

// Missões do LocaCoins. Cada uma calcula o progresso a partir do estado da demo
// (ações feitas no app) ou da telemetria mock.

export type MissionPeriod = 'diaria' | 'semanal' | 'mensal'

export type MissionKind =
  | { type: 'auto' } // completa sozinha a partir de ações no app
  | { type: 'goto'; to: string; cta: string } // leva o usuário até a ação
  | { type: 'survey' } // pesquisa visual do dia
  | { type: 'checkup' } // check-up rápido do carro

export type MissionIcon = 'coins' | 'survey' | 'checkup' | 'score' | 'fuel' | 'fine' | 'payment' | 'km' | 'friend' | 'streak' | 'ticket' | 'shield'

export type Mission = {
  id: string
  period: MissionPeriod
  title: string
  description: string
  reward: number
  icon: MissionIcon
  kind: MissionKind
  /** Por que essa missão importa (aparece no detalhe) */
  why: string
}

/** Fatia do estado da demo que as missões leem */
export type MissionInput = {
  claimedDays: string[]
  paidCharges: string[]
  indicatedFines: string[]
  referralsCount: number
  redeemedCount: number
  alertsOn: boolean
  surveyAnswer: string | null
  checkupDone: boolean
}

export const missions: Mission[] = [
  // ---------- Diárias ----------
  {
    id: 'd-claim',
    period: 'diaria',
    title: 'Confira seu último dia',
    description: 'Abra o resumo de telemetria e resgate os LocaCoins do dia.',
    reward: 5,
    icon: 'coins',
    kind: { type: 'goto', to: '/desempenho', cta: 'Ver' },
    why: 'Acompanhar o próprio desempenho é o primeiro passo para dirigir melhor.',
  },
  {
    id: 'd-survey',
    period: 'diaria',
    title: 'Pesquisa do dia',
    description: 'Responda uma pergunta rápida sobre a sua experiência.',
    reward: 10,
    icon: 'survey',
    kind: { type: 'survey' },
    why: 'Sua opinião ajuda a Localiza a melhorar o serviço que você usa todo dia.',
  },
  {
    id: 'd-checkup',
    period: 'diaria',
    title: 'Check-up rápido do carro',
    description: 'Confira pneus, painel e lataria em menos de 1 minuto.',
    reward: 15,
    icon: 'checkup',
    kind: { type: 'checkup' },
    why: 'Problemas descobertos cedo custam menos e deixam você mais seguro.',
  },

  // ---------- Semanais ----------
  {
    id: 's-score',
    period: 'semanal',
    title: 'Direção de craque',
    description: 'Dirija 5 dias da semana com score acima de 75%.',
    reward: 60,
    icon: 'score',
    kind: { type: 'auto' },
    why: 'Frenagens suaves e menos acelerações bruscas reduzem o desgaste do carro.',
  },
  {
    id: 's-fuel',
    period: 'semanal',
    title: 'Pé leve',
    description: 'Mantenha o consumo médio da semana acima de 12 km/l.',
    reward: 40,
    icon: 'fuel',
    kind: { type: 'auto' },
    why: 'Dirigir de forma eficiente economiza combustível e emite menos CO₂.',
  },
  {
    id: 's-fine',
    period: 'semanal',
    title: 'Resolva pelo app',
    description: 'Indique o condutor de uma multa pendente direto no app.',
    reward: 30,
    icon: 'fine',
    kind: { type: 'goto', to: '/multas', cta: 'Ir' },
    why: 'Indicar no prazo evita multa de agravo, sem precisar ligar para o atendimento.',
  },
  {
    id: 's-pay',
    period: 'semanal',
    title: 'Conta em dia',
    description: 'Pague uma cobrança pelo app.',
    reward: 25,
    icon: 'payment',
    kind: { type: 'goto', to: '/pagamentos/cobrancas', cta: 'Ir' },
    why: 'Pagando pelo app você evita juros e resolve tudo em poucos toques.',
  },

  // ---------- Mensais ----------
  {
    id: 'm-km',
    period: 'mensal',
    title: 'Dentro da franquia',
    description: `Termine outubro sem passar dos ${car.kmMonthLimit.toLocaleString('pt-BR')} km contratados.`,
    reward: 100,
    icon: 'km',
    kind: { type: 'auto' },
    why: 'Planejar a quilometragem evita cobranças de km excedente na fatura.',
  },
  {
    id: 'm-friend',
    period: 'mensal',
    title: 'Traga um amigo',
    description: 'Indique alguém para a Localiza Assinatura.',
    reward: 150,
    icon: 'friend',
    kind: { type: 'goto', to: '/indicacao/nova', cta: 'Indicar' },
    why: 'Seu amigo ganha desconto na assinatura e você ainda ganha LocaCoins.',
  },
  {
    id: 'm-security',
    period: 'mensal',
    title: 'Carro protegido',
    description: 'Ative um alerta de segurança do veículo.',
    reward: 30,
    icon: 'shield',
    kind: { type: 'goto', to: '/carro/seguranca', cta: 'Ativar' },
    why: 'Alertas de movimento e ignição ajudam a evitar furtos.',
  },
  {
    id: 'm-coupon',
    period: 'mensal',
    title: 'Primeira troca',
    description: 'Troque seus LocaCoins por um cupom de parceiro.',
    reward: 20,
    icon: 'ticket',
    kind: { type: 'goto', to: '/recompensas?aba=catalogo', cta: 'Ver' },
    why: 'Os parceiros Localiza têm descontos em viagens, gastronomia, pet e mais.',
  },
]

export type MissionProgress = { current: number; target: number; label?: string }

export function progressOf(m: Mission, s: MissionInput): MissionProgress {
  const week = weeks()[0]
  switch (m.id) {
    case 'd-claim':
      return { current: s.claimedDays.includes(lastDay.id) ? 1 : 0, target: 1 }
    case 'd-survey':
      return { current: s.surveyAnswer ? 1 : 0, target: 1 }
    case 'd-checkup':
      return { current: s.checkupDone ? 1 : 0, target: 1 }
    case 's-score': {
      const good = week.days.filter((d) => d.score >= 75).length
      return { current: Math.min(good, 5), target: 5, label: `${Math.min(good, 5)}/5 dias` }
    }
    case 's-fuel':
      return {
        current: week.kmPerLiter >= 12 ? 1 : 0,
        target: 1,
        label: `${week.kmPerLiter.toLocaleString('pt-BR')} km/l`,
      }
    case 's-fine':
      return { current: Math.min(s.indicatedFines.length, 1), target: 1 }
    case 's-pay':
      return { current: Math.min(s.paidCharges.length, 1), target: 1 }
    case 'm-km':
      // Só termina no fim do mês: mostra o quanto da franquia já foi usada
      return { current: 0, target: 1, label: `${car.kmMonth} de ${car.kmMonthLimit.toLocaleString('pt-BR')} km · termina em 31/10` }
    case 'm-friend':
      return { current: Math.min(Math.max(s.referralsCount - initialReferrals.length, 0), 1), target: 1 }
    case 'm-security':
      return { current: s.alertsOn ? 1 : 0, target: 1 }
    case 'm-coupon':
      return { current: Math.min(s.redeemedCount, 1), target: 1 }
    default:
      return { current: 0, target: 1 }
  }
}

/** Para a barra da franquia de km (missão mensal em andamento) */
export const kmMissionRatio = car.kmMonth / car.kmMonthLimit

export const periodInfo: Record<MissionPeriod, { label: string; resets: string; color: string; soft: string }> = {
  diaria: { label: 'Diárias', resets: 'Renovam em 14h', color: '#3fae15', soft: '#e5f8d5' },
  semanal: { label: 'Semanais', resets: 'Renovam em 2 dias', color: '#0e7490', soft: '#dcf3f7' },
  mensal: { label: 'Mensais', resets: 'Renovam em 28 dias', color: '#7c3aed', soft: '#efe7ff' },
}

/** Sequência de semanas com todas as missões semanais completas (mock) */
export const weeklyStreak = 2

export const survey = {
  question: 'Como você avalia a facilidade de resolver as coisas pelo app?',
  options: [
    { value: '1', emoji: '😞', label: 'Difícil' },
    { value: '2', emoji: '😐', label: 'Regular' },
    { value: '3', emoji: '🙂', label: 'Fácil' },
    { value: '4', emoji: '🤩', label: 'Muito fácil' },
  ],
}

export const checkupItems = [
  { id: 'pneus', label: 'Pneus sem desgaste ou bolhas aparentes', icon: 'disc' },
  { id: 'painel', label: 'Nenhuma luz de alerta acesa no painel', icon: 'panel' },
  { id: 'luzes', label: 'Faróis e lanternas funcionando', icon: 'light' },
  { id: 'lataria', label: 'Lataria e vidros sem avarias novas', icon: 'car' },
] as const
