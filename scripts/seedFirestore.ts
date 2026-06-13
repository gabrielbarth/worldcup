import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore, Timestamp } from 'firebase-admin/firestore'
import * as dotenv from 'dotenv'
import { createRequire } from 'module'
import { SEED_TEAMS } from '../src/data/seedTeams'
import { SEED_MATCHES } from '../src/data/seedMatches'

dotenv.config({ path: '.env.local' })

const require = createRequire(import.meta.url)
const serviceAccount = require('../serviceAccountKey.json')

initializeApp({ credential: cert(serviceAccount) })
const db = getFirestore()

async function seed() {
  const batch = db.batch()

  for (const team of SEED_TEAMS) {
    batch.set(db.collection('teams').doc(team.id), team)
  }

  for (const match of SEED_MATCHES) {
    batch.set(db.collection('matches').doc(match.id), {
      ...match,
      matchDate: Timestamp.fromDate(match.matchDate),
      status: 'scheduled',
    })
  }

  await batch.commit()
  console.log(`Seeded ${SEED_TEAMS.length} teams and ${SEED_MATCHES.length} matches`)
}

seed().catch(console.error)
