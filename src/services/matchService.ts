import {
  collection, doc, getDocs, getDoc,
  updateDoc, writeBatch, query, where, Timestamp
} from 'firebase/firestore'
import { db } from './firebase'
import type { Match, Team, MatchResult, Prediction } from '../types'
import { calculatePoints } from '../utils/scoring'

export async function getMatches(): Promise<Match[]> {
  const snap = await getDocs(collection(db, 'matches'))
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Match))
}

export async function getTeams(): Promise<Team[]> {
  const snap = await getDocs(collection(db, 'teams'))
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Team))
}

export async function submitResult(matchId: string, result: MatchResult): Promise<void> {
  const batch = writeBatch(db)

  // 1. Update match status and result
  batch.update(doc(db, 'matches', matchId), {
    status: 'finished',
    result,
  })

  // 2. Score all predictions for this match
  const predsSnap = await getDocs(
    query(collection(db, 'predictions'), where('matchId', '==', matchId))
  )
  for (const predDoc of predsSnap.docs) {
    const prediction = predDoc.data() as Prediction
    const points = calculatePoints(prediction, result)
    batch.update(predDoc.ref, { points, scoredAt: Timestamp.now() })
  }

  // 3. Advance bracket: update matches that depend on this result
  const matchSnap = await getDoc(doc(db, 'matches', matchId))
  const matchData = matchSnap.data() as Match
  const homeWin = result.homeScore > result.awayScore
  const actualWinnerId = homeWin ? matchData.homeTeamId : matchData.awayTeamId
  const actualLoserId = homeWin ? matchData.awayTeamId : matchData.homeTeamId

  const allMatchesSnap = await getDocs(collection(db, 'matches'))
  for (const nextDoc of allMatchesSnap.docs) {
    const next = nextDoc.data() as Match
    const updates: Record<string, string | null> = {}
    if (next.homeTeamSource === `W${matchId}`) updates.homeTeamId = actualWinnerId
    if (next.awayTeamSource === `W${matchId}`) updates.awayTeamId = actualWinnerId
    if (next.homeTeamSource === `L${matchId}`) updates.homeTeamId = actualLoserId
    if (next.awayTeamSource === `L${matchId}`) updates.awayTeamId = actualLoserId
    if (Object.keys(updates).length > 0) batch.update(nextDoc.ref, updates)
  }

  await batch.commit()
}
