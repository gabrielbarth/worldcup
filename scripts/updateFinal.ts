import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore, Timestamp } from 'firebase-admin/firestore'
import * as dotenv from 'dotenv'
import { createRequire } from 'module'

dotenv.config({ path: '.env.local' })
const require = createRequire(import.meta.url)
const serviceAccount = require('../serviceAccountKey.json')
initializeApp({ credential: cert(serviceAccount) })
const db = getFirestore()

type ResultInput = { id: string; homeScore: number; awayScore: number }

// Final results of Copa do Mundo FIFA 2026
const RESULTS: ResultInput[] = [
  { id: 'tp_1',    homeScore: 4, awayScore: 6 }, // FRA(h) vs ENG(a) — England 6-4 France (3rd place, Jul 18, Miami)
  { id: 'final_1', homeScore: 0, awayScore: 1 }, // ARG(h) vs ESP(a) — Spain 1-0 Argentina AET (Final, Jul 19, MetLife)
]

function calculatePoints(
  prediction: { homeScore: number; awayScore: number; penaltyWinner?: 'home' | 'away' | null },
  result: { homeScore: number; awayScore: number }
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
  return points
}

async function main() {
  for (const r of RESULTS) {
    const batch = db.batch()
    batch.update(db.collection('matches').doc(r.id), {
      status: 'finished',
      result: { homeScore: r.homeScore, awayScore: r.awayScore },
    })

    const predsSnap = await db.collection('predictions').where('matchId', '==', r.id).get()
    for (const predDoc of predsSnap.docs) {
      const prediction = predDoc.data() as { homeScore: number; awayScore: number }
      const points = calculatePoints(prediction, r)
      batch.update(predDoc.ref, { points, scoredAt: Timestamp.now() })
    }

    await batch.commit()
    console.log(`Updated ${r.id}: ${r.homeScore}-${r.awayScore}`)
  }
  console.log('Copa do Mundo FIFA 2026 encerrada. 🏆 Espanha bicampeã!')
}

main().catch(console.error)
