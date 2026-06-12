# Spec: Bolão Copa do Mundo 2026

## Visão Geral

Aplicação web (React + TypeScript + Vite) para bolão da Copa do Mundo 2026, com autenticação via Firebase Auth, dados no Firestore e fotos de perfil no Firebase Storage. Usuários criam palpites para todos os jogos (fase de grupos e mata-mata), participam de grupos de bolão e acompanham rankings. Admin define resultados oficiais e o sistema pontua automaticamente.

## Stack

- React 18 + TypeScript + Vite
- React Router
- Firebase: Auth (email/senha), Firestore, Storage
- TailwindCSS (UI)
- React Query ou Zustand para estado/cache (a escolher)
- React Hook Form + Zod para formulários e validação

---

## Modelagem de Dados (Firestore)

### Coleção `users`

```ts
{
  uid: string;            // = auth uid
  name: string;
  email: string;
  photoURL?: string;      // Storage path/URL
  role: "user" | "admin";
  createdAt: Timestamp;
}
```

### Coleção `groups`

```ts
{
  id: string;
  name: string;
  description: string;
  prize: string;          // ex: "Rodízio de pizza"
  ownerId: string;         // criador
  members: string[];       // array de uids
  inviteCode: string;      // código para entrar no grupo
  createdAt: Timestamp;
}
```

### Coleção `teams` (seed estático, dados da Copa)

```ts
{
  id: string; // ex: "BRA"
  name: string;
  flagUrl: string;
  group: string; // grupo da fase (A, B, C...)
}
```

### Coleção `matches`

```ts
{
  id: string;
  stage: "group" | "round16" | "quarter" | "semi" | "third_place" | "final";
  groupName?: string;      // se stage === "group" (A, B, C...)
  homeTeamId: string | null;   // null se time ainda não definido (mata-mata)
  awayTeamId: string | null;
  matchDate: Timestamp;
  status: "scheduled" | "finished";
  result?: {
    homeScore: number;
    awayScore: number;
    // para mata-mata, indicar se houve pênaltis
    penalties?: { home: number; away: number } | null;
  };
}
```

### Coleção `predictions`

Subcoleção ou coleção raiz com composite key `userId_matchId`.

```ts
{
  id: string;            // `${userId}_${matchId}`
  userId: string;
  matchId: string;
  homeScore: number;
  awayScore: number;
  penaltyWinner?: "home" | "away" | null; // para mata-mata, se empate previsto
  points?: number;        // calculado após resultado oficial
  scoredAt?: Timestamp;
}
```

### Coleção `rankings` (opcional, cache desnormalizado)

```ts
{
  id: string;          // groupId ou "global"
  type: "group" | "global";
  groupId?: string;
  entries: {
    userId: string;
    totalPoints: number;
  }[];
  updatedAt: Timestamp;
}
```

> Alternativa: calcular ranking dinamicamente somando `predictions.points` por usuário (filtrando por membros do grupo). Recomendo começar dinâmico e só materializar se performance exigir.

---

## Sistema de Pontuação

Regras de pontuação por partida (aplicadas após admin lançar resultado):

| Condição                                                                                      | Pontos |
| --------------------------------------------------------------------------------------------- | ------ |
| Placar exato (ambos os gols corretos)                                                         | 3      |
| Acertou o vencedor (ou empate) E o número de gols do vencedor (ou de ambos em caso de empate) | 2      |
| Acertou apenas o resultado (vencedor ou empate), sem acertar os gols                          | 1      |
| Errou o resultado                                                                             | 0      |

Detalhes de implementação:

- "Resultado" = quem venceu, ou empate (não considera pênaltis para fins de pontuação do placar normal).
- Para jogos de mata-mata com pênaltis: pontuação do placar normal segue a mesma regra acima (baseada no resultado dos 90/120 min). Adicionalmente, **+1 ponto bônus** se o usuário acertar quem venceu nos pênaltis (campo `penaltyWinner`), aplicável apenas quando `result.penalties` existir.
- Função pura `calculatePoints(prediction, result): number` deve ser implementada em `src/utils/scoring.ts` com testes unitários cobrindo todos os casos (placar exato, vencedor+gols, só vencedor, empate exato vs só empate, erro total, pênaltis).

---

## Funcionalidades por Tela

### 1. Autenticação

- `/login` — login com email/senha (Firebase Auth)
- `/register` — cadastro (nome, email, senha) → cria documento em `users`
- `/profile` — editar nome e foto de perfil (upload para Storage, salvar URL em `users.photoURL`)
- Rota protegida (`AuthGuard`) redireciona não autenticados para `/login`

### 2. Jogos e Palpites

- `/matches` — lista todos os jogos agrupados por fase (Fase de Grupos por grupo A-H, Oitavas, Quartas, Semis, Disputa de 3º, Final)
  - Cada jogo mostra times, data/hora, e campo de palpite (input de placar)
  - Para jogos de mata-mata sem times definidos ainda, exibir placeholder ("Vencedor Jogo X")
  - Bloquear edição de palpite após `matchDate` (deadline)
  - Salvar/atualizar em `predictions`
- `/matches/:id` — detalhe do jogo, palpites de outros usuários do mesmo grupo (opcional, pode ser liberado só após o jogo)

### 3. Grupos de Bolão

- `/groups` — lista grupos que o usuário participa + botão "Criar grupo" + botão "Entrar com código"
- `/groups/new` — formulário: nome, descrição, prêmio → cria grupo, usuário criador entra automaticamente
- `/groups/:id` — detalhes do grupo: título, descrição, prêmio, lista de participantes, ranking do grupo
- `/groups/join` — input de `inviteCode` para entrar em um grupo existente

### 4. Ranking

- `/ranking` — toggle entre "Ranking Geral" (todos usuários) e "Ranking por Grupo" (seletor de grupo do usuário)
- Tabela: posição, nome, foto, pontos totais
- Ordenação descendente por pontos, com critério de desempate (ex: nº de placares exatos) — opcional

### 5. Admin

- `/admin/matches` — lista de jogos com formulário para lançar resultado (`homeScore`, `awayScore`, `penalties` se aplicável)
  - Ao salvar resultado: marcar `status: "finished"`, disparar cálculo de pontos para todas as `predictions` daquele `matchId` (Cloud Function ou client-side batch, ver abaixo)
  - Para mata-mata: ao definir resultado/vencedor de um jogo, atualizar automaticamente `homeTeamId`/`awayTeamId` dos jogos seguintes que dependem desse confronto (ex: vencedor do Jogo 1 vai para a semifinal X)
- `/admin/teams` — (opcional) gerenciar seed de seleções/grupos
- Acesso restrito por `role === "admin"` (checagem no client + Firestore Security Rules)

---

## Cálculo de Pontuação — Estratégia

Recomendado: **Cloud Function** (Firestore trigger `onUpdate` em `matches` quando `status` muda para `finished`):

1. Busca todas `predictions` com `matchId` correspondente.
2. Aplica `calculatePoints()`.
3. Batch update salvando `points` e `scoredAt` em cada prediction.
4. (Opcional) Atualiza documento de ranking desnormalizado.

Alternativa sem Cloud Functions (se quiser evitar plano Blaze): botão admin dispara função client-side que faz o batch write diretamente (requer Firestore rules permitindo admin escrever em `predictions` de outros usuários).

---

## Firestore Security Rules (resumo)

- `users/{uid}`: leitura pública (para rankings), escrita só pelo próprio usuário (exceto `role`, alterável só por admin).
- `groups/{id}`: leitura pelos membros; escrita (criar) por qualquer usuário autenticado; update de `members` por qualquer membro (entrar via código); demais campos só pelo `ownerId`.
- `matches/{id}`: leitura pública; escrita só por `role === "admin"`.
- `predictions/{id}`: leitura/escrita do próprio usuário (`userId === auth.uid`); campo `points`/`scoredAt` só editável por admin ou Cloud Function; bloquear escrita do palpite (`homeScore`/`awayScore`) após `matchDate`.
- `teams/{id}`: leitura pública; escrita só admin.

---

## Estrutura de Pastas Sugerida

```
src/
  components/
    auth/
    matches/
    groups/
    ranking/
    admin/
    layout/
  pages/
    LoginPage.tsx
    RegisterPage.tsx
    ProfilePage.tsx
    MatchesPage.tsx
    GroupsPage.tsx
    GroupDetailPage.tsx
    RankingPage.tsx
    AdminMatchesPage.tsx
  hooks/
    useAuth.ts
    useMatches.ts
    usePredictions.ts
    useGroups.ts
    useRanking.ts
  services/
    firebase.ts
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
    seedMatches.ts   // 104 jogos da Copa 2026, fase de grupos + mata-mata
  routes/
    AppRoutes.tsx
    AuthGuard.tsx
    AdminGuard.tsx
```

---

## Dados de Seed — Copa 2026

- 48 seleções, 12 grupos (A-L) de 4 times, 104 jogos totais.
- Criar `src/data/seedMatches.ts` com estrutura de fases:
  - Fase de grupos: 72 jogos (todos com times definidos)
  - 32 → 16: Oitavas (8 jogos)
  - Quartas (4 jogos)
  - Semifinais (2 jogos)
  - Disputa de 3º lugar (1 jogo)
  - Final (1 jogo)
- Para jogos de mata-mata, usar referências simbólicas (ex: `"1A"` = 1º colocado Grupo A, `"W1"` = vencedor do Jogo 1) que o admin resolve manualmente conforme a fase avança.
- Script de seed (`scripts/seedFirestore.ts`) para popular `teams` e `matches` no Firestore inicial.

---

## Roadmap de Implementação (sugerido para o Claude Code)

1. Setup do projeto (Vite + TS + Tailwind + Firebase config)
2. Auth (login/registro/profile + upload de foto)
3. Modelos de tipos TypeScript (`types/index.ts`)
4. Seed de times e jogos da Copa 2026 + script de importação
5. Tela de jogos e palpites (CRUD de predictions)
6. Lógica de pontuação (`scoring.ts` + testes)
7. Grupos (criar, entrar via código, listar, detalhe)
8. Ranking (geral e por grupo)
9. Painel admin (lançar resultados + trigger de pontuação)
10. Firestore Security Rules
11. Ajustes finais de UI/UX e responsividade
