import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import * as dotenv from 'dotenv'
import { createRequire } from 'module'

dotenv.config({ path: '.env.local' })

const require = createRequire(import.meta.url)
const serviceAccount = require('../serviceAccountKey.json')

initializeApp({ credential: cert(serviceAccount) })
const db = getFirestore()

type MatchDoc = {
  stage: string
  groupName?: string
  homeTeamId: string | null
  awayTeamId: string | null
  homeTeamSource?: string
  awayTeamSource?: string
  status: string
  result?: { homeScore: number; awayScore: number }
}

type Standing = { teamId: string; pts: number; gd: number; gf: number; ga: number; played: number }

function computeStandings(groupTeams: string[], groupMatches: MatchDoc[]): Standing[] {
  const table: Record<string, Standing> = {}
  for (const id of groupTeams) table[id] = { teamId: id, pts: 0, gd: 0, gf: 0, ga: 0, played: 0 }

  for (const m of groupMatches) {
    if (m.status !== 'finished' || !m.result || !m.homeTeamId || !m.awayTeamId) continue
    const home = table[m.homeTeamId]
    const away = table[m.awayTeamId]
    const { homeScore: hs, awayScore: as } = m.result
    home.played++; away.played++
    home.gf += hs; home.ga += as; home.gd += hs - as
    away.gf += as; away.ga += hs; away.gd += as - hs
    if (hs > as) home.pts += 3
    else if (hs < as) away.pts += 3
    else { home.pts += 1; away.pts += 1 }
  }

  return Object.values(table).sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf)
}

async function main() {
  const teamsSnap = await db.collection('teams').get()
  const teamsByGroup: Record<string, string[]> = {}
  for (const doc of teamsSnap.docs) {
    const t = doc.data() as { group: string }
    teamsByGroup[t.group] = teamsByGroup[t.group] || []
    teamsByGroup[t.group].push(doc.id)
  }

  const matchesSnap = await db.collection('matches').where('stage', '==', 'group').get()
  const matchesByGroup: Record<string, MatchDoc[]> = {}
  for (const doc of matchesSnap.docs) {
    const m = doc.data() as MatchDoc
    const g = m.groupName!
    matchesByGroup[g] = matchesByGroup[g] || []
    matchesByGroup[g].push(m)
  }

  const standingsByGroup: Record<string, Standing[]> = {}
  for (const group of Object.keys(teamsByGroup)) {
    standingsByGroup[group] = computeStandings(teamsByGroup[group], matchesByGroup[group] || [])
  }

  // Resolve "1A", "2C" style sources
  const sourceMap: Record<string, string> = {}
  for (const [group, standings] of Object.entries(standingsByGroup)) {
    if (standings[0]) sourceMap[`1${group}`] = standings[0].teamId
    if (standings[1]) sourceMap[`2${group}`] = standings[1].teamId
  }

  // Rank best-8 third-placed teams across all groups
  const allThirds = Object.entries(standingsByGroup)
    .map(([group, standings]) => ({ group, ...standings[2] }))
    .filter(t => t.teamId)
    .sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf)
  console.log('All 12 third-placed teams ranked:', allThirds)
  const thirds = allThirds.slice(0, 8)

  thirds.forEach((t, i) => { sourceMap[`3best${i + 1}`] = t.teamId })

  console.log('Provisional standings resolved:')
  console.log(sourceMap)

  // Update R32 matches
  const r32Snap = await db.collection('matches').where('stage', '==', 'round32').get()
  const batch = db.batch()
  let updated = 0

  for (const doc of r32Snap.docs) {
    const m = doc.data() as MatchDoc
    const updates: Record<string, string> = {}
    if (m.homeTeamSource && sourceMap[m.homeTeamSource]) updates.homeTeamId = sourceMap[m.homeTeamSource]
    if (m.awayTeamSource && sourceMap[m.awayTeamSource]) updates.awayTeamId = sourceMap[m.awayTeamSource]
    if (Object.keys(updates).length > 0) {
      batch.update(doc.ref, updates)
      updated++
    }
  }

  await batch.commit()
  console.log(`Updated ${updated} round32 matches (provisional — will change as group stage MD3 results come in).`)
}

main().catch(console.error)
