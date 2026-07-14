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

// QF results (Jul 9-11)
const RESULTS: ResultInput[] = [
  { id: 'qf_1', homeScore: 0, awayScore: 2, winner: 'FRA' }, // MAR(h) vs FRA(a) — France 2-0 Morocco
  { id: 'qf_2', homeScore: 1, awayScore: 2, winner: 'ENG' }, // NOR(h) vs ENG(a) — England 2-1 Norway
  { id: 'qf_3', homeScore: 2, awayScore: 1, winner: 'ESP' }, // ESP(h) vs BEL(a) — Spain 2-1 Belgium
  { id: 'qf_4', homeScore: 3, awayScore: 1, winner: 'ARG' }, // ARG(h) vs SUI(a) — Argentina 3-1 Switzerland (a.e.t.)
]

// SF teams derived from QF winners (hardcoded — real bracket is FRA/ESP and ENG/ARG,
// not the sequential Wqf_1/Wqf_2 + Wqf_3/Wqf_4 pairing assumed by homeTeamSource)
const SF_TEAMS = [
  { id: 'sf_1', homeTeamId: 'FRA', awayTeamId: 'ESP', date: '2026-07-14T15:00:00-04:00' }, // France vs Spain — Dallas
  { id: 'sf_2', homeTeamId: 'ENG', awayTeamId: 'ARG', date: '2026-07-15T15:00:00-04:00' }, // England vs Argentina — Atlanta
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
  // 1. Update QF results and score predictions
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
    console.log(`Updated ${r.id}: ${r.homeScore}-${r.awayScore} (winner: ${r.winner})`)
  }

  // 2. Launch the semifinals: set SF team IDs (bracket advancement) and real kickoff times
  {
    const batch = db.batch()
    for (const s of SF_TEAMS) {
      batch.update(db.collection('matches').doc(s.id), {
        homeTeamId: s.homeTeamId,
        awayTeamId: s.awayTeamId,
        matchDate: Timestamp.fromDate(new Date(s.date)),
      })
    }
    await batch.commit()
    console.log('SF teams set:')
    for (const s of SF_TEAMS) console.log(`  ${s.id}: ${s.homeTeamId} vs ${s.awayTeamId} (${s.date})`)
  }

  console.log('All done.')
}

main().catch(console.error)
