# Localiza Meoo · MVP (LocaCoins)

Réplica web, só para celular, do app Localiza Assinatura, base para o MVP do sistema de recompensas LocaCoins (hackathon Ruptura 2026, Case 2).

## Rodar

```bash
npm install
npm run dev
```

Abra http://localhost:5180. No computador, o app aparece dentro de uma moldura de iPhone com um painel de demo (reiniciar dados / sair). No celular (mesma rede Wi-Fi), use o endereço "Network" mostrado no terminal.

Login: qualquer e-mail válido (já vem preenchido `meooteste@email.com`). Todos os dados são fictícios e ficam salvos no localStorage do navegador.

## Estrutura

- `src/data/mock.ts`: conta, carro, faturas, multas e demais dados fictícios
- `src/state/store.tsx`: estado da demo (persistido no navegador)
- `src/components/ui.tsx`: componentes visuais compartilhados (Screen, TabBar, Card, Button, Sheet...)
- `src/screens/*`: telas, agrupadas por área (auth, home, payments, services, help, car, benefits)
- `src/App.tsx`: rotas

## LocaCoins

- `src/data/telemetry.ts`: telemetria mock (km, consumo, score e fatores de desgaste) e regra score → LocaCoins
- `src/data/missions.ts`: missões diárias, semanais e mensais e o cálculo de progresso
- `src/data/rewards.ts`: catálogo de cupons de parceiros (ofertas ilustrativas)
- `src/components/locacoins.tsx` e `src/components/missions.tsx`: dashboard, resgate e missões
- `src/screens/performance.tsx` e `src/screens/rewards.tsx`: telas de Desempenho e Recompensas
