import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore, Timestamp } from 'firebase-admin/firestore'
import * as dotenv from 'dotenv'
import { createRequire } from 'module'

dotenv.config({ path: '.env.local' })
const require = createRequire(import.meta.url)
const serviceAccount = require('../serviceAccountKey.json')
initializeApp({ credential: cert(serviceAccount) })
const db = getFirestore()

type ResultInput = { id: string; homeScore: number; awayScore: number; penalties?: { home: number; away: number }; winner: string }

// R16 results (r16_1 and r16_2 already applied; r16_3-r16_8 below)
// NOTE: for SUI vs COL, submitResult would pick wrong winner (home=0 not > away=0),
// so QF teams are hardcoded directly below instead of relying on bracket advancement.
const RESULTS: ResultInput[] = [
  { id: 'r16_3', homeScore: 1, awayScore: 2, winner: 'NOR' }, // BRA(h) vs NOR(a) — Norway 2-1 Brazil
  { id: 'r16_4', homeScore: 2, awayScore: 3, winner: 'ENG' }, // MEX(h) vs ENG(a) — England 3-2 Mexico
  { id: 'r16_5', homeScore: 0, awayScore: 1, winner: 'ESP' }, // POR(h) vs ESP(a) — Spain 1-0 Portugal
  { id: 'r16_6', homeScore: 1, awayScore: 4, winner: 'BEL' }, // USA(h) vs BEL(a) — Belgium 4-1 USA
  { id: 'r16_7', homeScore: 3, awayScore: 2, winner: 'ARG' }, // ARG(h) vs EGY(a) — Argentina 3-2 Egypt (90+2')
  { id: 'r16_8', homeScore: 0, awayScore: 0, penalties: { home: 4, away: 3 }, winner: 'SUI' }, // SUI(h) vs COL(a) — 0-0 AET, Switzerland wins 4-3 PKs
]

// QF teams derived from R16 winners (hardcoded to bypass bug when tied score + home team wins PKs)
// qf_1: MAR vs FRA — already set in fixR16Bracket.ts
const QF_TEAMS = [
  { id: 'qf_2', homeTeamId: 'NOR', awayTeamId: 'ENG' }, // Wr16_3 vs Wr16_4 — Jul 11
  { id: 'qf_3', homeTeamId: 'ESP', awayTeamId: 'BEL' }, // Wr16_5 vs Wr16_6 — Jul 10
  { id: 'qf_4', homeTeamId: 'ARG', awayTeamId: 'SUI' }, // Wr16_7 vs Wr16_8 — Jul 11
]

function calculatePoints(
  prediction: { homeScore: number; awayScore: number; penaltyWinner?: 'home' | 'away' | null },
  result: { homeScore: number; awayScore: number; penalties?: { home: number; away: number } }
): number {
  const { homeScore: pH, awayScore: pA } = prediction
  const { homeScore: rH, awayScore: rA } = result
  const predOutcome = Math.sign(pH - pA)
  const resOutcome = Math.sign(rH - rA)
  let points = 0
  if (pH === rH && pA === rA) {
    points = 3
  } else if (predOutcome === resOutcome) {
    if (resOutcome === 0) {
      points = 1
    } else {
      const winnerPred = resOutcome > 0 ? pH : pA
      const winnerRes = resOutcome > 0 ? rH : rA
      points = winnerPred === winnerRes ? 2 : 1
    }
  }
  if (result.penalties && predOutcome === 0) {
    const actualWinner = result.penalties.home > result.penalties.away ? 'home' : 'away'
    if (prediction.penaltyWinner === actualWinner) points += 1
  }
  return points
}

async function main() {
  // 1. Update R16 results and score predictions
  for (const r of RESULTS) {
    const result = {
      homeScore: r.homeScore,
      awayScore: r.awayScore,
      ...(r.penalties ? { penalties: r.penalties } : {}),
    }
    const batch = db.batch()
    batch.update(db.collection('matches').doc(r.id), { status: 'finished', result })

    const predsSnap = await db.collection('predictions').where('matchId', '==', r.id).get()
    for (const predDoc of predsSnap.docs) {
      const prediction = predDoc.data() as { homeScore: number; awayScore: number; penaltyWinner?: 'home' | 'away' | null }
      const points = calculatePoints(prediction, result)
      batch.update(predDoc.ref, { points, scoredAt: Timestamp.now() })
    }

    await batch.commit()
    const pks = r.penalties ? ` (PKs ${r.penalties.home}-${r.penalties.away}, winner: ${r.winner})` : ` (winner: ${r.winner})`
    console.log(`Updated ${r.id}: ${r.homeScore}-${r.awayScore}${pks}`)
  }

  // 2. Set QF team IDs (bracket advancement)
  {
    const batch = db.batch()
    for (const q of QF_TEAMS) {
      batch.update(db.collection('matches').doc(q.id), {
        homeTeamId: q.homeTeamId,
        awayTeamId: q.awayTeamId,
      })
    }
    await batch.commit()
    console.log('QF teams set:')
    for (const q of QF_TEAMS) console.log(`  ${q.id}: ${q.homeTeamId} vs ${q.awayTeamId}`)
  }

  console.log('All done.')
}

main().catch(console.error)
