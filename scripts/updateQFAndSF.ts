import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore, Timestamp } from 'firebase-admin/firestore'
import * as dotenv from 'dotenv'
import { createRequire } from 'module'

dotenv.config({ path: '.env.local' })
const require = createRequire(import.meta.url)
const serviceAccount = require('../serviceAccountKey.json')
initializeApp({ credential: cert(serviceAccount) })
const db = getFirestore()

type ResultInput = { id: string; homeScore: number; awayScore: number; penalties?: { home: number; away: number } }

// ── Quarterfinal results (Jul 9-11) ──
// Real SF bracket: qf_1 winner (FRA) vs qf_3 winner (ESP), qf_2 winner (ENG) vs qf_4 winner (ARG)
// (differs from seed which assumed qf_1 vs qf_2 / qf_3 vs qf_4)
const QF_RESULTS: ResultInput[] = [
  { id: 'qf_1', homeScore: 0, awayScore: 2 }, // MAR(h) vs FRA(a) — France 2-0 Morocco (Jul 9)
  { id: 'qf_2', homeScore: 1, awayScore: 2 }, // NOR(h) vs ENG(a) — England 2-1 Norway AET (Jul 11)
  { id: 'qf_3', homeScore: 2, awayScore: 1 }, // ESP(h) vs BEL(a) — Spain 2-1 Belgium (Jul 10)
  { id: 'qf_4', homeScore: 3, awayScore: 1 }, // ARG(h) vs SUI(a) — Argentina 3-1 Switzerland AET (Jul 11)
]

// ── Semifinal team IDs (bracket correction) ──
// Seed assumed sf_1=Wqf_1 vs Wqf_2, sf_2=Wqf_3 vs Wqf_4 — real bracket crosses halves:
// sf_1 (Jul 14 Dallas): FRA (qf_1 winner) vs ESP (qf_3 winner)
// sf_2 (Jul 15 Atlanta): ENG (qf_2 winner) vs ARG (qf_4 winner)
const SF_TEAMS = [
  { id: 'sf_1', homeTeamId: 'FRA', awayTeamId: 'ESP' },
  { id: 'sf_2', homeTeamId: 'ENG', awayTeamId: 'ARG' },
]

// ── Semifinal results (Jul 14-15, both already played) ──
const SF_RESULTS: ResultInput[] = [
  { id: 'sf_1', homeScore: 0, awayScore: 2 }, // FRA(h) vs ESP(a) — Spain 2-0 France (Jul 14)
  { id: 'sf_2', homeScore: 1, awayScore: 2 }, // ENG(h) vs ARG(a) — Argentina 2-1 England (Jul 15)
]

// ── Third place + Final teams (upcoming) ──
// tp_1 (Jul 18 Miami): FRA vs ENG (losers of sf_1 and sf_2)
// final_1 (Jul 19 MetLife): ARG vs ESP (winners of sf_2 and sf_1)
const UPCOMING_TEAMS = [
  { id: 'tp_1',    homeTeamId: 'FRA', awayTeamId: 'ENG' },
  { id: 'final_1', homeTeamId: 'ARG', awayTeamId: 'ESP' },
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

async function applyResults(results: ResultInput[], label: string) {
  for (const r of results) {
    const result = { homeScore: r.homeScore, awayScore: r.awayScore, ...(r.penalties ? { penalties: r.penalties } : {}) }
    const batch = db.batch()
    batch.update(db.collection('matches').doc(r.id), { status: 'finished', result })

    const predsSnap = await db.collection('predictions').where('matchId', '==', r.id).get()
    for (const predDoc of predsSnap.docs) {
      const prediction = predDoc.data() as { homeScore: number; awayScore: number; penaltyWinner?: 'home' | 'away' | null }
      const points = calculatePoints(prediction, result)
      batch.update(predDoc.ref, { points, scoredAt: Timestamp.now() })
    }
    await batch.commit()
    console.log(`[${label}] ${r.id}: ${r.homeScore}-${r.awayScore}`)
  }
}

async function main() {
  // 1. QF results
  await applyResults(QF_RESULTS, 'QF')

  // 2. SF team IDs (fix bracket cross-pairing)
  {
    const batch = db.batch()
    for (const s of SF_TEAMS) {
      batch.update(db.collection('matches').doc(s.id), {
        homeTeamId: s.homeTeamId,
        awayTeamId: s.awayTeamId,
      })
    }
    await batch.commit()
    console.log('SF teams set: sf_1=FRA vs ESP, sf_2=ENG vs ARG')
  }

  // 3. SF results
  await applyResults(SF_RESULTS, 'SF')

  // 4. TP + Final team IDs (open for predictions)
  {
    const batch = db.batch()
    for (const u of UPCOMING_TEAMS) {
      batch.update(db.collection('matches').doc(u.id), {
        homeTeamId: u.homeTeamId,
        awayTeamId: u.awayTeamId,
      })
    }
    await batch.commit()
    console.log('Upcoming: tp_1=FRA vs ENG (Jul 18), final_1=ARG vs ESP (Jul 19)')
  }

  console.log('All done.')
}

main().catch(console.error)
