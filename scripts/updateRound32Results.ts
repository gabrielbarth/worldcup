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

// Missing group stage results (gK3, gL3, gL4 were skipped in previous script)
// Plus all 16 Round of 32 results
const RESULTS: ResultInput[] = [
  // --- Missing Group Stage MD2 matches ---
  { id: 'gK3', homeScore: 5, awayScore: 0 }, // POR vs UZB (Jun 23) — Ronaldo brace, Portugal 5-0 Uzbekistan
  { id: 'gL3', homeScore: 0, awayScore: 0 }, // ENG vs GHA (Jun 23) — England 0-0 Ghana
  { id: 'gL4', homeScore: 1, awayScore: 0 }, // CRO vs PAN (Jun 23) — Croatia 1-0 Panama

  // --- Round of 32 (Jun 28 - Jul 3) ---
  { id: 'r32_1',  homeScore: 0, awayScore: 1 }, // RSA vs CAN — Canada 1-0 South Africa
  { id: 'r32_2',  homeScore: 2, awayScore: 1 }, // BRA vs JPN — Brazil 2-1 Japan
  { id: 'r32_3',  homeScore: 1, awayScore: 1, penalties: { home: 3, away: 4 } }, // GER vs PAR — 1-1 AET, Paraguay wins 4-3 PKs
  { id: 'r32_4',  homeScore: 1, awayScore: 1, penalties: { home: 2, away: 3 } }, // NED vs MAR — 1-1 AET, Morocco wins 3-2 PKs
  { id: 'r32_5',  homeScore: 1, awayScore: 2 }, // CIV vs NOR — Norway 2-1 Ivory Coast
  { id: 'r32_6',  homeScore: 2, awayScore: 0 }, // MEX vs ECU — Mexico 2-0 Ecuador
  { id: 'r32_7',  homeScore: 3, awayScore: 0 }, // FRA vs SWE — France 3-0 Sweden
  { id: 'r32_8',  homeScore: 2, awayScore: 1 }, // ENG vs COD — England 2-1 DR Congo
  { id: 'r32_9',  homeScore: 3, awayScore: 2 }, // BEL vs SEN — Belgium 3-2 AET (Tielemans pen 120+5)
  { id: 'r32_10', homeScore: 2, awayScore: 0 }, // USA vs BIH — USA 2-0 Bosnia
  { id: 'r32_11', homeScore: 3, awayScore: 0 }, // ESP vs AUT — Spain 3-0 Austria
  { id: 'r32_12', homeScore: 2, awayScore: 1 }, // POR vs CRO — Portugal 2-1 Croatia
  { id: 'r32_13', homeScore: 2, awayScore: 0 }, // SUI vs ALG — Switzerland 2-0 Algeria
  { id: 'r32_14', homeScore: 1, awayScore: 1, penalties: { home: 2, away: 4 } }, // AUS vs EGY — 1-1 AET, Egypt wins 4-2 PKs
  { id: 'r32_15', homeScore: 3, awayScore: 2 }, // ARG vs CPV — Argentina 3-2 AET
  { id: 'r32_16', homeScore: 1, awayScore: 0 }, // COL vs GHA — Colombia 1-0 Ghana
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

async function updateResults() {
  for (const r of RESULTS) {
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
    console.log(`Updated ${r.id}: ${r.homeScore}-${r.awayScore}${r.penalties ? ` (PKs ${r.penalties.home}-${r.penalties.away})` : ''}`)
  }
  console.log(`Done. ${RESULTS.length} matches updated.`)
}

updateResults().catch(console.error)
