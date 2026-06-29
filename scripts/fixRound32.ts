import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore, Timestamp } from 'firebase-admin/firestore'
import * as dotenv from 'dotenv'
import { createRequire } from 'module'

dotenv.config({ path: '.env.local' })
const require = createRequire(import.meta.url)
const serviceAccount = require('../serviceAccountKey.json')
initializeApp({ credential: cert(serviceAccount) })
const db = getFirestore()

// Confirmed real FIFA World Cup 2026 Round of 32 matchups and dates (ET)
const R32_REAL: { id: string; home: string; away: string; date: string }[] = [
  { id: 'r32_1',  home: 'RSA', away: 'CAN', date: '2026-06-28T15:00:00-04:00' }, // South Africa vs Canada
  { id: 'r32_2',  home: 'BRA', away: 'JPN', date: '2026-06-29T13:00:00-04:00' }, // Brazil vs Japan
  { id: 'r32_3',  home: 'GER', away: 'PAR', date: '2026-06-29T16:30:00-04:00' }, // Germany vs Paraguay
  { id: 'r32_4',  home: 'NED', away: 'MAR', date: '2026-06-29T21:00:00-04:00' }, // Netherlands vs Morocco
  { id: 'r32_5',  home: 'CIV', away: 'NOR', date: '2026-06-30T13:00:00-04:00' }, // Ivory Coast vs Norway
  { id: 'r32_6',  home: 'MEX', away: 'ECU', date: '2026-06-30T21:00:00-04:00' }, // Mexico vs Ecuador
  { id: 'r32_7',  home: 'FRA', away: 'SWE', date: '2026-07-01T15:00:00-04:00' }, // France vs Sweden
  { id: 'r32_8',  home: 'ENG', away: 'COD', date: '2026-07-01T12:00:00-04:00' }, // England vs DR Congo
  { id: 'r32_9',  home: 'BEL', away: 'SEN', date: '2026-07-01T16:00:00-04:00' }, // Belgium vs Senegal
  { id: 'r32_10', home: 'USA', away: 'BIH', date: '2026-07-01T20:00:00-04:00' }, // USA vs Bosnia & Herzegovina
  { id: 'r32_11', home: 'ESP', away: 'AUT', date: '2026-07-02T15:00:00-04:00' }, // Spain vs Austria
  { id: 'r32_12', home: 'POR', away: 'CRO', date: '2026-07-02T19:00:00-04:00' }, // Portugal vs Croatia
  { id: 'r32_13', home: 'SUI', away: 'ALG', date: '2026-07-02T23:00:00-04:00' }, // Switzerland vs Algeria
  { id: 'r32_14', home: 'AUS', away: 'EGY', date: '2026-07-03T14:00:00-04:00' }, // Australia vs Egypt
  { id: 'r32_15', home: 'ARG', away: 'CPV', date: '2026-07-03T18:00:00-04:00' }, // Argentina vs Cape Verde
  { id: 'r32_16', home: 'COL', away: 'GHA', date: '2026-07-03T21:30:00-04:00' }, // Colombia vs Ghana
]

async function main() {
  const batch = db.batch()
  for (const m of R32_REAL) {
    batch.update(db.collection('matches').doc(m.id), {
      homeTeamId: m.home,
      awayTeamId: m.away,
      matchDate: Timestamp.fromDate(new Date(m.date)),
    })
  }
  await batch.commit()
  console.log(`Updated ${R32_REAL.length} round32 matches with real teams and dates.`)
}

main().catch(console.error)
