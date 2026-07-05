import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore, Timestamp } from 'firebase-admin/firestore'
import * as dotenv from 'dotenv'
import { createRequire } from 'module'

dotenv.config({ path: '.env.local' })
const require = createRequire(import.meta.url)
const serviceAccount = require('../serviceAccountKey.json')
initializeApp({ credential: cert(serviceAccount) })
const db = getFirestore()

// Real FIFA World Cup 2026 Round of 16 bracket (Jul 4-7)
// QF Jul 9-11, SF Jul 14-15, TP Jul 18, Final Jul 19
// Times in ET (EDT = UTC-4)
const R16_REAL = [
  { id: 'r16_1', home: 'MAR', away: 'CAN', date: '2026-07-04T13:00:00-04:00' }, // Morocco vs Canada (Houston)
  { id: 'r16_2', home: 'FRA', away: 'PAR', date: '2026-07-04T17:00:00-04:00' }, // France vs Paraguay (Philadelphia)
  { id: 'r16_3', home: 'BRA', away: 'NOR', date: '2026-07-05T16:00:00-04:00' }, // Brazil vs Norway (MetLife/NJ)
  { id: 'r16_4', home: 'MEX', away: 'ENG', date: '2026-07-05T20:00:00-04:00' }, // Mexico vs England (Azteca)
  { id: 'r16_5', home: 'POR', away: 'ESP', date: '2026-07-06T15:00:00-04:00' }, // Portugal vs Spain (Arlington/Dallas)
  { id: 'r16_6', home: 'USA', away: 'BEL', date: '2026-07-06T17:00:00-04:00' }, // USA vs Belgium (Seattle)
  { id: 'r16_7', home: 'ARG', away: 'EGY', date: '2026-07-07T12:00:00-04:00' }, // Argentina vs Egypt (Atlanta)
  { id: 'r16_8', home: 'SUI', away: 'COL', date: '2026-07-07T16:00:00-04:00' }, // Switzerland vs Colombia (Vancouver)
]

// Already-finished R16 results (today Jul 4)
const R16_FINISHED = [
  { id: 'r16_1', homeScore: 3, awayScore: 0 }, // MAR 3-0 CAN
  { id: 'r16_2', homeScore: 1, awayScore: 0 }, // FRA 1-0 PAR
]

// Real QF dates (Jul 9-11)
const QF_DATES = [
  { id: 'qf_1', date: '2026-07-09T16:00:00-04:00' }, // W(r16_1) vs W(r16_2): MAR/FRA (Boston/Foxborough)
  { id: 'qf_2', date: '2026-07-11T17:00:00-04:00' }, // W(r16_3) vs W(r16_4): BRA/NOR vs MEX/ENG (Miami)
  { id: 'qf_3', date: '2026-07-10T15:00:00-04:00' }, // W(r16_5) vs W(r16_6): POR/ESP vs USA/BEL (Inglewood/LA)
  { id: 'qf_4', date: '2026-07-11T20:00:00-04:00' }, // W(r16_7) vs W(r16_8): ARG/EGY vs SUI/COL (Kansas City)
]

// Real SF/TP/Final dates
const LATE_STAGE_DATES = [
  { id: 'sf_1', date: '2026-07-14T20:00:00-04:00' }, // Arlington/Dallas
  { id: 'sf_2', date: '2026-07-15T20:00:00-04:00' }, // Atlanta
  { id: 'tp_1', date: '2026-07-18T17:00:00-04:00' }, // Miami
  { id: 'final_1', date: '2026-07-19T15:00:00-04:00' }, // MetLife/East Rutherford
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
  // 1. Set R16 team IDs and real dates
  {
    const batch = db.batch()
    for (const m of R16_REAL) {
      batch.update(db.collection('matches').doc(m.id), {
        homeTeamId: m.home,
        awayTeamId: m.away,
        matchDate: Timestamp.fromDate(new Date(m.date)),
      })
    }
    await batch.commit()
    console.log(`Set team IDs and dates for ${R16_REAL.length} R16 matches.`)
  }

  // 2. Score finished R16 results (r16_1 and r16_2, already played today)
  for (const r of R16_FINISHED) {
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
    console.log(`Finished ${r.id}: ${r.homeScore}-${r.awayScore}`)
  }

  // 3. Advance bracket: mark r16_1 and r16_2 winners into QF
  // r16_1 winner = MAR → qf_1.homeTeamId (homeTeamSource: 'Wr16_1')
  // r16_2 winner = FRA → qf_1.awayTeamId (awayTeamSource: 'Wr16_2')
  {
    const batch = db.batch()
    batch.update(db.collection('matches').doc('qf_1'), {
      homeTeamId: 'MAR',
      awayTeamId: 'FRA',
    })
    await batch.commit()
    console.log('Set qf_1: MAR vs FRA (bracket advancement from r16_1 and r16_2 results).')
  }

  // 4. Update QF dates
  {
    const batch = db.batch()
    for (const q of QF_DATES) {
      batch.update(db.collection('matches').doc(q.id), {
        matchDate: Timestamp.fromDate(new Date(q.date)),
      })
    }
    await batch.commit()
    console.log(`Updated dates for ${QF_DATES.length} QF matches.`)
  }

  // 5. Update SF / TP / Final dates
  {
    const batch = db.batch()
    for (const s of LATE_STAGE_DATES) {
      batch.update(db.collection('matches').doc(s.id), {
        matchDate: Timestamp.fromDate(new Date(s.date)),
      })
    }
    await batch.commit()
    console.log(`Updated dates for ${LATE_STAGE_DATES.length} late-stage matches (SF/TP/Final).`)
  }

  console.log('All done.')
}

main().catch(console.error)
