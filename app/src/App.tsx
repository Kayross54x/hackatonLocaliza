import type { ReactNode } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { PhoneFrame } from './components/PhoneFrame'
import { useStore } from './state/store'
import { Login, Welcome } from './screens/auth'
import { Performance } from './screens/performance'
import { Rewards } from './screens/rewards'
import { Home, Menu, Profile } from './screens/home'
import { ChargeDetail, Charges, InvoiceHistory, Payments } from './screens/payments'
import { Schedule, ServicesHome, Tracking } from './screens/services'
import { Emergency, Help, HelpCenter, Liza, Occurrence, OccurrenceTracking } from './screens/help'
import {
  CarStatus,
  Contract,
  DocumentScreen,
  FineDetail,
  Fines,
  IndicateDriver,
  KmManagement,
  LocateCar,
  Security,
} from './screens/car'
import { Club, ReferralList, ReferralNew, ReferralProgram, RentalDiscount } from './screens/benefits'

function Private({ children }: { children: ReactNode }) {
  const { loggedIn } = useStore()
  return loggedIn ? children : <Navigate to="/boas-vindas" replace />
}

const privateRoutes: [string, ReactNode][] = [
  ['/', <Home />],
  ['/menu', <Menu />],
  ['/perfil', <Profile />],
  ['/desempenho', <Performance />],
  ['/recompensas', <Rewards />],
  ['/pagamentos', <Payments />],
  ['/pagamentos/cobrancas', <Charges />],
  ['/pagamentos/cobranca/:id', <ChargeDetail />],
  ['/pagamentos/historico', <InvoiceHistory />],
  ['/servicos', <ServicesHome />],
  ['/servicos/agendar', <Schedule />],
  ['/servicos/acompanhamento', <Tracking />],
  ['/ajuda', <Help />],
  ['/ajuda/emergencia', <Emergency />],
  ['/ajuda/ocorrencia', <Occurrence />],
  ['/ajuda/ocorrencia/acompanhamento', <OccurrenceTracking />],
  ['/ajuda/central', <HelpCenter />],
  ['/ajuda/liza', <Liza />],
  ['/km', <KmManagement />],
  ['/carro/localizar', <LocateCar />],
  ['/carro/seguranca', <Security />],
  ['/carro/status', <CarStatus />],
  ['/multas', <Fines />],
  ['/multas/:id', <FineDetail />],
  ['/multas/:id/indicar', <IndicateDriver />],
  ['/contrato', <Contract />],
  ['/documento/:doc', <DocumentScreen />],
  ['/beneficios/aluguel', <RentalDiscount />],
  ['/beneficios/clube', <Club />],
  ['/indicacao', <ReferralProgram />],
  ['/indicacao/nova', <ReferralNew />],
  ['/indicacao/lista', <ReferralList />],
]

export default function App() {
  return (
    <PhoneFrame>
      <Routes>
        <Route path="/boas-vindas" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        {privateRoutes.map(([path, el]) => (
          <Route key={path} path={path} element={<Private>{el}</Private>} />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </PhoneFrame>
  )
}
