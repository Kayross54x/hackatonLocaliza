// Telemetria fictícia das últimas 4 semanas. Gerada de forma determinística
// para a demo mostrar sempre os mesmos números.

export type ScoreFactor = {
  key: 'brakes' | 'engine' | 'acceleration' | 'idle'
  label: string
  detail: string
  value: number // 0–100
}

export type DayReport = {
  id: string // AAAA-MM-DD
  date: Date
  km: number
  liters: number
  kmPerLiter: number
  /** Percentil: melhor que X% dos motoristas Localiza Assinatura */
  score: number
  factors: ScoreFactor[]
  trips: number
  driveMinutes: number
}

/** Último dia em que o carro foi usado (a demo se passa em 03/10/2026). */
export const LAST_DRIVE_ID = '2026-10-02'

// Gerador pseudoaleatório com semente fixa
function rng(seed: number) {
  return () => {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }
}

const clamp = (n: number, a = 0, b = 100) => Math.max(a, Math.min(b, n))
const pad = (n: number) => String(n).padStart(2, '0')
const toId = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

function buildFactors(score: number, r: () => number): ScoreFactor[] {
  const v = () => Math.round(clamp(score + (r() - 0.5) * 30, 25, 99))
  return [
    { key: 'brakes', label: 'Frenagem suave', detail: 'Desgaste das pastilhas de freio', value: v() },
    { key: 'engine', label: 'Cuidado com o motor', detail: 'Aquecimento e rotação do motor', value: v() },
    { key: 'acceleration', label: 'Aceleração', detail: 'Arrancadas e acelerações bruscas', value: v() },
    { key: 'idle', label: 'Marcha lenta', detail: 'Tempo parado com o motor ligado', value: v() },
  ]
}

function generate(): DayReport[] {
  const r = rng(42)
  const end = new Date(2026, 9, 2) // 02/10/2026
  const days: DayReport[] = []
  // A pontuação melhora ao longo das semanas (efeito do programa)
  for (let i = 27; i >= 0; i--) {
    const date = new Date(end)
    date.setDate(end.getDate() - i)
    const weekday = date.getDay()
    const unused = i !== 0 && (weekday === 0 ? r() < 0.6 : r() < 0.08)
    if (unused) continue
    const weekend = weekday === 0 || weekday === 6
    const km = Math.round(weekend ? 25 + r() * 90 : 28 + r() * 45)
    const trend = (27 - i) * 0.6
    const score = Math.round(clamp(58 + trend + (r() - 0.5) * 22, 30, 97))
    const kmPerLiter = +(10.4 + (score / 100) * 3.2 + (r() - 0.5) * 0.8).toFixed(1)
    days.push({
      id: toId(date),
      date,
      km,
      liters: +(km / kmPerLiter).toFixed(1),
      kmPerLiter,
      score,
      factors: buildFactors(score, r),
      trips: 2 + Math.floor(r() * 4),
      driveMinutes: Math.round(km * (1.6 + r())),
    })
  }
  // Último dia fixo para a apresentação ficar redonda
  const last = days[days.length - 1]
  Object.assign(last, {
    km: 47,
    kmPerLiter: 13.2,
    liters: 3.6,
    score: 87,
    trips: 3,
    driveMinutes: 82,
    factors: [
      { key: 'brakes', label: 'Frenagem suave', detail: 'Desgaste das pastilhas de freio', value: 92 },
      { key: 'engine', label: 'Cuidado com o motor', detail: 'Aquecimento e rotação do motor', value: 88 },
      { key: 'acceleration', label: 'Aceleração', detail: 'Arrancadas e acelerações bruscas', value: 79 },
      { key: 'idle', label: 'Marcha lenta', detail: 'Tempo parado com o motor ligado', value: 71 },
    ],
  } satisfies Partial<DayReport>)
  return days
}

export const days = generate()
export const lastDay = days.find((d) => d.id === LAST_DRIVE_ID)!

/** Média da base Localiza Assinatura, usada para comparação */
export const fleetAverage = { kmPerLiter: 11.6, kmPerDay: 52 }

/** Regra de conversão score → LocaCoins */
export const coinTiers = [
  { min: 90, coins: 50, label: 'Excelente' },
  { min: 75, coins: 35, label: 'Muito bom' },
  { min: 50, coins: 20, label: 'Bom' },
  { min: 0, coins: 10, label: 'Em evolução' },
]

export const tierFor = (score: number) => coinTiers.find((t) => score >= t.min)!
export const coinsFor = (score: number) => tierFor(score).coins

export type WeekSummary = {
  id: string
  label: string
  range: string
  days: DayReport[]
  km: number
  liters: number
  kmPerLiter: number
  score: number
}

const shortDate = (d: Date) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`

/** Semanas de segunda a domingo, da mais recente para a mais antiga */
export function weeks(): WeekSummary[] {
  const groups = new Map<string, DayReport[]>()
  for (const d of days) {
    const monday = new Date(d.date)
    monday.setDate(d.date.getDate() - ((d.date.getDay() + 6) % 7))
    const key = toId(monday)
    groups.set(key, [...(groups.get(key) ?? []), d])
  }
  return [...groups.entries()]
    .sort(([a], [b]) => (a < b ? 1 : -1))
    .map(([key, ds], i) => {
      const monday = new Date(key + 'T00:00')
      const sunday = new Date(monday)
      sunday.setDate(monday.getDate() + 6)
      const km = ds.reduce((s, d) => s + d.km, 0)
      const liters = +ds.reduce((s, d) => s + d.liters, 0).toFixed(1)
      return {
        id: key,
        label: i === 0 ? 'Esta semana' : i === 1 ? 'Semana passada' : `Há ${i} semanas`,
        range: `${shortDate(monday)} – ${shortDate(sunday)}`,
        days: ds,
        km,
        liters,
        kmPerLiter: +(km / liters).toFixed(1),
        score: Math.round(ds.reduce((s, d) => s + d.score, 0) / ds.length),
      }
    })
}

const weekdayNames = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado']
const weekdayShort = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

export const formatDayLong = (d: Date) => `${weekdayNames[d.getDay()]}, ${shortDate(d)}`
export const formatDayShort = (d: Date) => `${weekdayShort[d.getDay()]} ${shortDate(d)}`
