# Design: Bolão Copa do Mundo 2026

**Data:** 2026-06-11  
**Stack:** React 18 + TypeScript + Vite + TailwindCSS + Firebase + React Query

---

## Decisões de design

| Decisão | Escolha | Motivo |
|---|---|---|
| Estado/cache | React Query (fetches pontuais + invalidação) | App é predominantemente leitura; real-time não é requisito crítico |
| Pontuação | Client-side batch (admin dispara) | Evita plano Blaze; migração para Cloud Functions é simples depois |
| Visual | Dark Sports (navy `#1a1a2e` + vermelho `#e94560`) | Clima de estádio, énergico |
| Navegação | Bottom nav mobile-first (4 abas) | Uso principal em celular |
| Ranking | Calculado dinamicamente (soma de `predictions.points`) | Começa simples; materializa só se performance exigir |
| Testes | Vitest cobrindo `scoring.ts` | Lógica crítica é pura e isolada |

---

## Arquitetura

```
Firebase (Auth + Firestore + Storage)
        ↕
  services/          ← getDocs / setDoc / updateDoc (única camada que importa Firebase)
        ↕
  hooks/             ← useQuery / useMutation (React Query)
        ↕
  pages/             ← orquestra hooks, compõe componentes
        ↕
  components/        ← UI puro, sem acesso a Firebase
```

**Princípios:**
- `services/` exporta funções assíncronas simples. Nenhum outro módulo importa Firebase diretamente.
- `hooks/` envolve services em `useQuery`/`useMutation`. Mutações invalidam as query keys afetadas.
- `utils/scoring.ts` é uma função pura isolada, testada com Vitest.
- `QueryClientProvider` no root. `AuthGuard` e `AdminGuard` como wrappers de rotas.

---

## Rotas

```
/login              → LoginPage (público)
/register           → RegisterPage (público)
/                   → redirect → /matches

/matches            → MatchesPage ← AuthGuard
/matches/:id        → MatchDetailPage ← AuthGuard

/groups             → GroupsPage ← AuthGuard
/groups/new         → NewGroupPage ← AuthGuard
/groups/join        → JoinGroupPage ← AuthGuard
/groups/:id         → GroupDetailPage ← AuthGuard

/ranking            → RankingPage ← AuthGuard
/profile            → ProfilePage ← AuthGuard

/admin/matches      → AdminMatchesPage ← AdminGuard
```

**Bottom nav:** Jogos · Grupos · Ranking · Perfil  
**Acesso admin:** link no ProfilePage, visível só se `role === "admin"`

---

## Tela principal: `/matches`

- Lista 104 jogos agrupados por fase
- Tabs horizontais: Grupos (A–L), Oitavas, Quartas, Semis, 3º Lugar, Final
- Card de jogo: bandeiras dos times, data/hora, dois inputs numéricos para palpite
- Para mata-mata sem times definidos: placeholder "Vencedor Jogo X"
- Inputs desabilitados quando `matchDate < Date.now()` — deadline client-side
- Para mata-mata com empate previsto: seletor de `penaltyWinner`

---

## Fluxo de palpites

**Salvar (usuário):**
1. Usuário digita placar → botão "Salvar"
2. `useMutation` → `savePrediction(userId, matchId, homeScore, awayScore)`
3. `setDoc` com id `${userId}_${matchId}` no Firestore
4. Invalida query `predictions` do usuário

**Lançar resultado (admin):**
1. Admin preenche placar (+ `penaltyWinner` se mata-mata) → "Confirmar resultado"
2. `useMutation` → `submitResult(matchId, result)`:
   - Atualiza `matches/{matchId}`: `status: "finished"`, `result`
   - Busca todas as `predictions` com `matchId`
   - Aplica `calculatePoints()` em cada uma
   - `writeBatch` salva `points` + `scoredAt` em todas as predictions
   - Se mata-mata: atualiza `homeTeamId`/`awayTeamId` nos jogos seguintes dependentes
3. Invalida queries `matches`, `predictions`, `ranking`

---

## Sistema de pontuação

Implementado em `src/utils/scoring.ts` como função pura:

```ts
calculatePoints(prediction: Prediction, result: MatchResult): number
```

| Condição | Pontos |
|---|---|
| Placar exato | 3 |
| Vencedor correto + gols do vencedor corretos (ou empate com ambos os gols) | 2 |
| Vencedor correto (ou empate), sem acertar gols | 1 |
| Resultado errado | 0 |
| Bônus: acertou `penaltyWinner` (apenas quando `result.penalties` existe) | +1 |

"Resultado" para fins de pontuação = resultado dos 90/120 min, ignora pênaltis.

**Casos de teste obrigatórios (Vitest):**
- Placar exato (home win, away win, empate)
- Vencedor + gols do vencedor corretos
- Só vencedor correto
- Empate exato (ambos os gols) vs só empate
- Resultado errado (0 pontos)
- Pênaltis: placar normal + bônus acertado / não acertado

---

## Ranking

Calculado dinamicamente em `useRanking(groupId?)`:
1. Busca membros do grupo (ou todos os usuários para ranking global)
2. Busca todas as predictions dos membros com `points` definido
3. Soma por usuário, ordena decrescente
4. Critério de desempate: número de placares exatos (3 pontos)

Sem coleção `rankings` materializada no Firestore — implementar se a query ficar lenta.

---

## Grupos de bolão

- Criação: gera `inviteCode` aleatório (6 chars alfanumérico)
- Entrar: busca grupo por `inviteCode`, adiciona `auth.uid` ao array `members`
- Ranking do grupo: filtrado pelos `members` do grupo

---

## Seed de dados

`scripts/seedFirestore.ts` (Node + Firebase Admin SDK):
- 48 seleções com nome, código ISO e grupo (A–L)
- 104 partidas: 72 de grupos (times definidos) + 32 de mata-mata
- Partidas de mata-mata incluem campos `homeTeamSource` e `awayTeamSource` com referências simbólicas:
  - `"1A"` = 1º colocado do Grupo A (resolvido após fase de grupos)
  - `"W49"` = vencedor da partida 49 (resolvido após cada rodada do mata-mata)
- `submitResult` busca partidas onde `homeTeamSource === "W{matchId}"` ou `awayTeamSource === "W{matchId}"` e preenche o `teamId` correspondente
- Roda uma vez antes do lançamento: `npx ts-node scripts/seedFirestore.ts`

---

## Firestore Security Rules (resumo)

- `users/{uid}`: leitura pública; escrita só pelo próprio usuário (exceto `role`)
- `groups/{id}`: leitura pelos membros; criação por autenticados; update de `members` por membros; demais campos só pelo `ownerId`
- `matches/{id}`: leitura pública; escrita só admin
- `predictions/{id}`: leitura/escrita do próprio usuário; `points`/`scoredAt` só admin; bloquear escrita após `matchDate`
- `teams/{id}`: leitura pública; escrita só admin

---

## Estrutura de pastas

```
src/
  components/
    auth/
    matches/
    groups/
    ranking/
    admin/
    layout/         ← BottomNav, AppShell
  pages/
  hooks/
    useAuth.ts
    useMatches.ts
    usePredictions.ts
    useGroups.ts
    useRanking.ts
  services/
    firebase.ts     ← inicialização
    authService.ts
    matchService.ts
    predictionService.ts
    groupService.ts
  utils/
    scoring.ts
    scoring.test.ts
  types/
    index.ts
  data/
    seedMatches.ts
  routes/
    AppRoutes.tsx
    AuthGuard.tsx
    AdminGuard.tsx
scripts/
  seedFirestore.ts
```

---

## Roadmap de implementação

1. Setup do projeto (Vite + TS + Tailwind + Firebase + React Query)
2. Tipos TypeScript (`types/index.ts`)
3. Auth (login, registro, profile + upload de foto)
4. Seed de times e jogos + script de importação
5. Tela de jogos e palpites (CRUD de predictions)
6. Lógica de pontuação (`scoring.ts` + testes Vitest)
7. Grupos (criar, entrar via código, listar, detalhe)
8. Ranking (geral e por grupo)
9. Painel admin (lançar resultados + batch de pontuação)
10. Firestore Security Rules
11. Ajustes de UI/UX e responsividade mobile
