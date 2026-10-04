// Catálogo de recompensas trocáveis por LocaCoins. Ofertas ilustrativas para o MVP.

export type RewardCategory = 'viagem' | 'gastronomia' | 'pet' | 'entretenimento' | 'carro' | 'localiza'

export const categories: { key: RewardCategory | 'todos'; label: string; emoji: string }[] = [
  { key: 'todos', label: 'Todos', emoji: '✨' },
  { key: 'localiza', label: 'Localiza', emoji: '🚗' },
  { key: 'viagem', label: 'Viagem', emoji: '✈️' },
  { key: 'gastronomia', label: 'Gastronomia', emoji: '🍽️' },
  { key: 'pet', label: 'Pet', emoji: '🐾' },
  { key: 'entretenimento', label: 'Entretenimento', emoji: '🎬' },
  { key: 'carro', label: 'Cuidados com o carro', emoji: '🧽' },
]

export type Reward = {
  id: string
  partner: string
  /** Texto curto exibido no "logo" do parceiro */
  mark: string
  /** Cor principal do parceiro (fundo do cartão) */
  color: string
  /** Cor do texto sobre a cor principal */
  ink?: string
  category: RewardCategory
  highlight: string // ex.: "15% OFF"
  title: string
  description: string
  cost: number
  validity: string
  terms: string[]
  codePrefix: string
  featured?: boolean
}

export const rewards: Reward[] = [
  {
    id: 'lets-atlantica',
    partner: "Let's Atlântica",
    mark: "LET'S",
    color: '#0b3d6e',
    category: 'viagem',
    highlight: '15% OFF',
    title: 'Desconto em diárias de hotel',
    description: 'Hospede-se nos hotéis da rede com 15% de desconto na tarifa do dia. Perfeito para a próxima viagem de carro.',
    cost: 120,
    validity: 'Válido por 90 dias após a troca',
    terms: ['Válido para reservas no site oficial da rede', 'Sujeito à disponibilidade de quartos', 'Não cumulativo com outras promoções'],
    codePrefix: 'LETS',
    featured: true,
  },
  {
    id: 'baggagio',
    partner: 'Baggagio',
    mark: 'baggagio',
    color: '#1d1d1f',
    category: 'viagem',
    highlight: 'R$ 80 OFF',
    title: 'Desconto em malas e acessórios',
    description: 'R$ 80 de desconto em compras acima de R$ 400 em malas, mochilas e acessórios de viagem.',
    cost: 150,
    validity: 'Válido por 60 dias após a troca',
    terms: ['Compra mínima de R$ 400', 'Válido na loja on-line e em lojas físicas', 'Um uso por CPF'],
    codePrefix: 'BAGG',
  },
  {
    id: 'duo-gourmet',
    partner: 'Duo Gourmet',
    mark: 'duo',
    color: '#7a1f3d',
    category: 'gastronomia',
    highlight: '1 mês grátis',
    title: 'Assinatura do clube gastronômico',
    description: 'Peça dois pratos e pague só um em centenas de restaurantes parceiros. Um mês de assinatura por nossa conta.',
    cost: 90,
    validity: 'Ative em até 30 dias',
    terms: ['Válido apenas para novos assinantes', 'Benefício 2 por 1 conforme regras de cada restaurante'],
    codePrefix: 'DUO',
    featured: true,
  },
  {
    id: 'restaurante-20',
    partner: 'Restaurantes parceiros',
    mark: '🍝',
    color: '#c2410c',
    category: 'gastronomia',
    highlight: '20% OFF',
    title: 'Jantar com desconto',
    description: '20% de desconto na conta em restaurantes selecionados próximos às agências Localiza.',
    cost: 60,
    validity: 'Válido por 30 dias',
    terms: ['Desconto máximo de R$ 60', 'Não inclui bebidas alcoólicas'],
    codePrefix: 'REST',
  },
  {
    id: 'pet-banho',
    partner: 'Pet shop parceiro',
    mark: '🐶',
    color: '#0e7490',
    category: 'pet',
    highlight: '30% OFF',
    title: 'Banho e tosa',
    description: 'Deixe seu pet cheiroso com 30% de desconto em banho e tosa nas unidades parceiras.',
    cost: 45,
    validity: 'Válido por 45 dias',
    terms: ['Agendamento prévio necessário', 'Válido para cães e gatos'],
    codePrefix: 'PET',
  },
  {
    id: 'pet-racao',
    partner: 'Pet shop parceiro',
    mark: '🦴',
    color: '#0f766e',
    category: 'pet',
    highlight: 'R$ 40 OFF',
    title: 'Ração e petiscos',
    description: 'R$ 40 de desconto em compras acima de R$ 200 de ração, petiscos e acessórios.',
    cost: 80,
    validity: 'Válido por 60 dias',
    terms: ['Compra mínima de R$ 200', 'Válido no app e nas lojas'],
    codePrefix: 'RACAO',
  },
  {
    id: 'cinema',
    partner: 'Cinema parceiro',
    mark: '🎬',
    color: '#4c1d95',
    category: 'entretenimento',
    highlight: '2 por 1',
    title: 'Ingressos de cinema',
    description: 'Compre um ingresso e leve outro. Válido para sessões 2D de segunda a quinta.',
    cost: 35,
    validity: 'Válido por 30 dias',
    terms: ['Sessões 2D, de segunda a quinta', 'Não válido em pré-estreias'],
    codePrefix: 'CINE',
    featured: true,
  },
  {
    id: 'streaming',
    partner: 'Streaming parceiro',
    mark: '▶',
    color: '#be123c',
    category: 'entretenimento',
    highlight: '50% OFF',
    title: '3 meses de séries e filmes',
    description: 'Metade do preço por 3 meses no plano padrão do streaming parceiro.',
    cost: 70,
    validity: 'Ative em até 30 dias',
    terms: ['Apenas para novas assinaturas', 'Renovação automática após o período'],
    codePrefix: 'STREAM',
  },
  {
    id: 'shows',
    partner: 'Ticket parceiro',
    mark: '🎤',
    color: '#9d174d',
    category: 'entretenimento',
    highlight: '25% OFF',
    title: 'Shows e eventos',
    description: '25% de desconto em ingressos para shows e eventos selecionados na sua cidade.',
    cost: 110,
    validity: 'Válido por 60 dias',
    terms: ['Eventos participantes sinalizados no site', 'Limite de 2 ingressos'],
    codePrefix: 'SHOW',
  },
  {
    id: 'lavagem',
    partner: 'Lava-rápido parceiro',
    mark: '🧽',
    color: '#0369a1',
    category: 'carro',
    highlight: 'Grátis',
    title: 'Lavagem completa',
    description: 'Uma lavagem completa (externa + interna) para deixar o seu carro brilhando.',
    cost: 30,
    validity: 'Válido por 30 dias',
    terms: ['Válido para carros de passeio', 'Agendamento pelo app do parceiro'],
    codePrefix: 'LAVA',
  },
  {
    id: 'estacionamento',
    partner: 'Estacionamento parceiro',
    mark: 'P',
    color: '#1e40af',
    category: 'carro',
    highlight: 'R$ 20 OFF',
    title: 'Crédito em estacionamento',
    description: 'R$ 20 de crédito para usar em estacionamentos parceiros em shoppings e aeroportos.',
    cost: 50,
    validity: 'Válido por 60 dias',
    terms: ['Crédito único, sem troco', 'Consulte unidades participantes'],
    codePrefix: 'PARK',
  },
  {
    id: 'upgrade',
    partner: 'Localiza Aluguel',
    mark: 'L',
    color: '#00612e',
    category: 'localiza',
    highlight: 'Upgrade',
    title: 'Upgrade de categoria no aluguel',
    description: 'Alugue um carro na Localiza e suba uma categoria sem pagar a mais.',
    cost: 200,
    validity: 'Válido por 120 dias',
    terms: ['Sujeito à disponibilidade da frota', 'Reserva com o CPF do titular da assinatura'],
    codePrefix: 'UPG',
  },
  {
    id: 'diaria',
    partner: 'Localiza Aluguel',
    mark: 'L',
    color: '#00612e',
    category: 'localiza',
    highlight: '1 diária grátis',
    title: 'Diária grátis no aluguel',
    description: 'Ganhe uma diária grátis em reservas de 3 diárias ou mais em qualquer agência Localiza.',
    cost: 300,
    validity: 'Válido por 120 dias',
    terms: ['Reservas a partir de 3 diárias', 'Categorias econômica e intermediária'],
    codePrefix: 'DIA',
  },
  {
    id: 'fatura',
    partner: 'Localiza Assinatura',
    mark: 'L',
    color: '#74d62c',
    ink: '#004a23',
    category: 'localiza',
    highlight: 'R$ 50 OFF',
    title: 'Desconto na sua fatura',
    description: 'R$ 50 abatidos direto na próxima mensalidade da sua assinatura.',
    cost: 500,
    validity: 'Aplicado na próxima fatura',
    terms: ['Limite de 1 desconto por mês', 'Não convertido em dinheiro'],
    codePrefix: 'FAT',
    featured: true,
  },
]

export const rewardById = (id: string) => rewards.find((r) => r.id === id)

/** Gera um código de cupom com aparência real (ex.: DUO-7K3F-Q9) */
export function makeCode(prefix: string) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const part = (n: number) => Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  return `${prefix}-${part(4)}-${part(2)}`
}
