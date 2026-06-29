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

// Fill in real results here: match id -> final score
const RESULTS: ResultInput[] = [
  // Group A
  { id: 'gA1', homeScore: 2, awayScore: 0 }, // MEX vs RSA
  { id: 'gA2', homeScore: 2, awayScore: 1 }, // KOR vs CZE
  { id: 'gA3', homeScore: 1, awayScore: 0 }, // MEX vs KOR
  { id: 'gA4', homeScore: 1, awayScore: 1 }, // RSA vs CZE

  // Group B
  { id: 'gB1', homeScore: 1, awayScore: 1 }, // CAN vs BIH
  { id: 'gB2', homeScore: 1, awayScore: 1 }, // QAT vs SUI
  { id: 'gB3', homeScore: 6, awayScore: 0 }, // CAN vs QAT
  { id: 'gB4', homeScore: 4, awayScore: 1 }, // BIH vs SUI

  // Group C
  { id: 'gC1', homeScore: 1, awayScore: 1 }, // BRA vs MAR
  { id: 'gC2', homeScore: 0, awayScore: 1 }, // HAI vs SCO
  { id: 'gC3', homeScore: 3, awayScore: 0 }, // BRA vs HAI
  { id: 'gC4', homeScore: 1, awayScore: 0 }, // MAR vs SCO

  // Group D
  { id: 'gD1', homeScore: 4, awayScore: 1 }, // USA vs PAR
  { id: 'gD2', homeScore: 2, awayScore: 0 }, // AUS vs TUR
  { id: 'gD3', homeScore: 2, awayScore: 0 }, // USA vs AUS
  { id: 'gD4', homeScore: 1, awayScore: 0 }, // PAR vs TUR

  // Group E
  { id: 'gE1', homeScore: 7, awayScore: 1 }, // GER vs CUW
  { id: 'gE2', homeScore: 1, awayScore: 0 }, // CIV vs ECU
  { id: 'gE3', homeScore: 2, awayScore: 1 }, // GER vs CIV
  { id: 'gE4', homeScore: 0, awayScore: 0 }, // CUW vs ECU

  // Group F
  { id: 'gF1', homeScore: 2, awayScore: 2 }, // NED vs JPN
  { id: 'gF2', homeScore: 5, awayScore: 1 }, // SWE vs TUN
  { id: 'gF3', homeScore: 5, awayScore: 1 }, // NED vs SWE
  { id: 'gF4', homeScore: 4, awayScore: 0 }, // JPN vs TUN

  // Group G
  { id: 'gG1', homeScore: 1, awayScore: 1 }, // BEL vs EGY
  { id: 'gG2', homeScore: 2, awayScore: 2 }, // IRN vs NZL
  { id: 'gG3', homeScore: 0, awayScore: 0 }, // BEL vs IRN
  { id: 'gG4', homeScore: 3, awayScore: 1 }, // EGY vs NZL

  // Group H
  { id: 'gH1', homeScore: 0, awayScore: 0 }, // ESP vs CPV
  { id: 'gH2', homeScore: 1, awayScore: 1 }, // KSA vs URU
  { id: 'gH3', homeScore: 4, awayScore: 0 }, // ESP vs KSA
  { id: 'gH4', homeScore: 2, awayScore: 2 }, // CPV vs URU

  // Group I
  { id: 'gI1', homeScore: 3, awayScore: 1 }, // FRA vs SEN
  { id: 'gI2', homeScore: 1, awayScore: 4 }, // IRQ vs NOR
  { id: 'gI3', homeScore: 3, awayScore: 0 }, // FRA vs IRQ
  { id: 'gI4', homeScore: 3, awayScore: 2 }, // SEN vs NOR

  // Group J
  { id: 'gJ1', homeScore: 3, awayScore: 0 }, // ARG vs ALG
  { id: 'gJ2', homeScore: 3, awayScore: 1 }, // AUT vs JOR
  { id: 'gJ3', homeScore: 2, awayScore: 0 }, // ARG vs AUT
  { id: 'gJ4', homeScore: 2, awayScore: 1 }, // ALG vs JOR

  // Group K
  { id: 'gK1', homeScore: 1, awayScore: 1 }, // POR vs COD
  { id: 'gK2', homeScore: 1, awayScore: 3 }, // UZB vs COL

  // Group L
  { id: 'gL1', homeScore: 4, awayScore: 2 }, // ENG vs CRO
  { id: 'gL2', homeScore: 1, awayScore: 0 }, // GHA vs PAN

  // ---- MD3 results (group stage now complete as of Jun 29) ----
  { id: 'gA5', homeScore: 3, awayScore: 0 }, // MEX vs CZE
  { id: 'gA6', homeScore: 1, awayScore: 0 }, // RSA vs KOR (RSA 1-0 KOR, real result: South Africa 1-0 South Korea)
  { id: 'gB5', homeScore: 1, awayScore: 2 }, // CAN vs SUI
  { id: 'gB6', homeScore: 3, awayScore: 1 }, // BIH vs QAT
  { id: 'gC5', homeScore: 3, awayScore: 0 }, // BRA vs SCO
  { id: 'gC6', homeScore: 4, awayScore: 2 }, // MAR vs HAI
  { id: 'gD5', homeScore: 2, awayScore: 3 }, // USA vs TUR
  { id: 'gD6', homeScore: 0, awayScore: 0 }, // PAR vs AUS
  { id: 'gE5', homeScore: 1, awayScore: 2 }, // GER vs ECU
  { id: 'gE6', homeScore: 0, awayScore: 2 }, // CUW vs CIV
  { id: 'gF5', homeScore: 3, awayScore: 1 }, // NED vs TUN
  { id: 'gF6', homeScore: 1, awayScore: 1 }, // JPN vs SWE
  { id: 'gG5', homeScore: 5, awayScore: 1 }, // BEL vs NZL
  { id: 'gG6', homeScore: 1, awayScore: 1 }, // EGY vs IRN
  { id: 'gH5', homeScore: 1, awayScore: 0 }, // ESP vs URU
  { id: 'gH6', homeScore: 0, awayScore: 0 }, // CPV vs KSA
  { id: 'gI5', homeScore: 4, awayScore: 1 }, // FRA vs NOR
  { id: 'gI6', homeScore: 5, awayScore: 0 }, // SEN vs IRQ
  { id: 'gJ5', homeScore: 3, awayScore: 1 }, // ARG vs JOR
  { id: 'gJ6', homeScore: 3, awayScore: 3 }, // ALG vs AUT
  { id: 'gK4', homeScore: 0, awayScore: 1 }, // COD vs COL
  { id: 'gK5', homeScore: 0, awayScore: 0 }, // POR vs COL
  { id: 'gK6', homeScore: 1, awayScore: 3 }, // UZB vs COD
  { id: 'gL5', homeScore: 2, awayScore: 0 }, // ENG vs PAN
  { id: 'gL6', homeScore: 2, awayScore: 1 }, // CRO vs GHA
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
    console.log(`Updated ${r.id}: ${r.homeScore}-${r.awayScore}`)
  }
  console.log(`Done. ${RESULTS.length} matches updated.`)
}

updateResults().catch(console.error)
