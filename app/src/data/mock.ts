// Dados fictícios da conta de demonstração. Nada aqui vem de sistemas reais.

export const user = {
  name: 'Ana Oliveira',
  firstName: 'Ana',
  email: 'assinaturateste@email.com',
  cpf: '123.456.789-00',
  phone: '(31) 99876-5432',
}

export const car = {
  plate: 'NHS8O45',
  model: 'Nivus Highline 1.0 200 TSI 12V Total Flex 4P C/AR - Automático',
  shortModel: 'Nivus Highline 1.0 200 TSI 12V...',
  color: 'Branco Cristal com Teto Preto Ninja',
  image: '/img/car-nivus.png',
  city: 'Local',
  kmMonth: 218,
  kmMonthLimit: 2000,
  kmTotal: 11500,
  kmAvailableToDate: 12000,
  kmContract: 72000,
  battery: 12.1,
  fuel: 78,
  address: 'R. Espírito Santo, 605 - BH',
  lastSeen: '02/10/2026 18:15',
}

export const contract = {
  number: 'GVR0794/24',
  signedAt: '09/01/2025',
  period: '36 meses',
  franchise: '2000 km',
  protection: 'Vidros e parabrisas',
  damageValue: 'R$ 4.810,00',
  thirdParty: 'R$ 300 mil',
  physical: 'R$ 300 mil',
  material: 'R$ 300 mil',
  tires: '40.000 km',
  revision: 'A cada 10.000 km',
  spareCar: 'Categoria econômica',
}

export type ChargeKind = 'km' | 'multa' | 'aluguel'

export type Charge = {
  id: string
  kind: ChargeKind
  title: string
  value: number
  group: 'extra' | 'fixa'
}

export const dueDate = '01/11/2026'

export const charges: Charge[] = [
  { id: 'km-out', kind: 'km', title: 'Km Excedente', value: 1200, group: 'extra' },
  { id: 'multa-out', kind: 'multa', title: 'Multa', value: 200, group: 'extra' },
  { id: 'aluguel-out', kind: 'aluguel', title: 'Aluguel', value: 3212, group: 'fixa' },
]

export type InvoiceStatus = 'A vencer' | 'Pago' | 'Em atraso'

export const invoiceHistory: { year: string; items: { month: string; status: InvoiceStatus; value: number }[] }[] = [
  {
    year: '2026',
    items: [
      { month: 'Outubro', status: 'A vencer', value: 4612 },
      { month: 'Setembro', status: 'Pago', value: 3212 },
      { month: 'Agosto', status: 'Pago', value: 3212 },
      { month: 'Julho', status: 'Em atraso', value: 3412 },
      { month: 'Junho', status: 'Pago', value: 3212 },
    ],
  },
  {
    year: '2025',
    items: [
      { month: 'Dezembro', status: 'Pago', value: 3212 },
      { month: 'Novembro', status: 'Pago', value: 3212 },
      { month: 'Outubro', status: 'Pago', value: 3212 },
    ],
  },
]

export const kmMonthly = [
  { label: 'Abr', year: '26', km: 1650 },
  { label: 'Mai', year: '26', km: 1820 },
  { label: 'Jun', year: '26', km: 2150 },
  { label: 'Jul', year: '26', km: 2380 },
  { label: 'Ago', year: '26', km: 1540 },
  { label: 'Set', year: '26', km: 1910 },
  { label: 'Out', year: '26', km: 218 },
]

export const kmExcess = [
  { month: 'Setembro/26', value: 453, status: 'Em aberto' as const },
  { month: 'Julho/26', value: 284, status: 'Em atraso' as const },
  { month: 'Junho/26', value: 135, status: 'Pago' as const },
]

export type Fine = {
  id: string
  code: string
  title: string
  date: string
  place: string
  value: number
  fee: number
  deadline: string
  status: 'pendente' | 'andamento' | 'finalizada'
}

export const fines: Fine[] = [
  {
    id: 'f1',
    code: '745-50',
    title: 'EXCESS. VELOCI EM ATÉ 20%',
    date: '05/09/2026 às 08:10',
    place: 'R. Gurupá, 33 - Cachoeirinha, Belo Horizonte - MG, 31150-180',
    value: 195.23,
    fee: 10,
    deadline: '30/10/2026',
    status: 'pendente',
  },
  {
    id: 'f2',
    code: '554-11',
    title: 'ESTACIONAR EM LOCAL PROIBIDO',
    date: '12/06/2026 às 14:32',
    place: 'Av. Raul Soares, 17, Centro, Belo Horizonte - MG',
    value: 195.23,
    fee: 10,
    deadline: '10/07/2026',
    status: 'finalizada',
  },
]

export type Referral = { name: string; date: string; status: 'Não aprovada' | 'Aprovado' | 'Em negociação' }

export const referrals: Referral[] = [
  { name: 'TATIANE DE SOUZA PEREIRA', date: '01/02/2026', status: 'Não aprovada' },
  { name: 'LEYA PITER MAKIWI DE CARPIRO COSTA COELHO', date: '13/03/2026', status: 'Em negociação' },
  { name: 'NIVALDO ROBERTO TEIXEIRA JUNIOR', date: '20/05/2026', status: 'Aprovado' },
]

export const serviceCategories = [
  'Pneus e rodas',
  'Ar-condicionado',
  'Mecânica do carro',
  'Lataria',
  'Vidro',
  'Luz, iluminação, interno e conforto',
  'Sistema elétrico e eletrônico',
  'Luzes do painel',
] as const

export const workshops = [
  {
    id: 'w1',
    name: 'Pit Stop Localiza Centro Norte',
    address: 'R. Gurupá, 33 - Cachoeirinha, Belo Horizonte - MG, 31150-180',
    distance: '0,8 km',
    best: true,
  },
  {
    id: 'w2',
    name: 'RL Centro Automotivo',
    address: 'R. Gurupá, 33 - Cachoeirinha, Belo Horizonte - MG, 31150-180',
    distance: '1,2 km',
    best: false,
  },
  {
    id: 'w3',
    name: 'Pit Stop Localiza Belo Horizonte',
    address: 'Av. Raul Soares, 17, Centro, Belo Horizonte - MG',
    distance: '3,4 km',
    best: false,
  },
]

export const benefitsCarousel = [
  {
    id: 'indique',
    badge: 'Até R$ 2.000',
    title: 'Indique e ganhe',
    text: 'Ganhe R$2.000 por indicação que assinar a Localiza Assinatura',
    cta: 'Indicar',
    image: '/img/benef-indique.png',
    to: '/indicacao',
  },
  {
    id: 'aluguel',
    badge: '15% OFF',
    title: 'Aluguel com desconto',
    text: 'Ganhe 15% de desconto no aluguel diário na Localiza.',
    cta: 'Resgatar',
    image: '/img/benef-aluguel.png',
    to: '/beneficios/aluguel',
  },
  {
    id: 'clube',
    badge: 'Benefícios',
    title: 'Conheça o clube',
    text: 'Acesse todos os benefícios disponíveis para você',
    cta: 'Resgatar',
    image: '/img/benef-clube.png',
    to: '/beneficios/clube',
  },
]

export const clubPartners = [
  { name: 'Posto parceiro', category: 'Combustível', offer: 'R$ 0,15/L de desconto' },
  { name: 'Estacionamento', category: 'Mobilidade', offer: '20% em mensalistas' },
  { name: 'Lava-rápido', category: 'Cuidados com o carro', offer: '1 lavagem grátis/mês' },
  { name: 'Farmácia', category: 'Saúde', offer: 'Até 30% em genéricos' },
  { name: 'Streaming', category: 'Lazer', offer: '3 meses com 50% OFF' },
  { name: 'Academia', category: 'Bem-estar', offer: 'Matrícula grátis' },
]

export const formatBRL = (n: number) =>
  n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 })
