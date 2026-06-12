import {
  collection, doc, getDocs, getDoc,
  writeBatch, query, where, Timestamp
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

function chunkArray<T>(arr: T[], size: number): T[][] {
  const result: T[][] = []
  for (let i = 0; i < arr.length; i += size) result.push(arr.slice(i, i + size))
  return result
}

type WriteOp = { ref: import('firebase/firestore').DocumentReference; data: Record<string, unknown> }

export async function submitResult(matchId: string, result: MatchResult): Promise<void> {
  // Collect all write operations first, then commit in chunks of 499
  const writes: WriteOp[] = []

  // 1. Update match status and result
  writes.push({
    ref: doc(db, 'matches', matchId),
    data: { status: 'finished', result },
  })

  // 2. Score all predictions for this match
  const predsSnap = await getDocs(
    query(collection(db, 'predictions'), where('matchId', '==', matchId))
  )
  for (const predDoc of predsSnap.docs) {
    const prediction = predDoc.data() as Prediction
    const points = calculatePoints(prediction, result)
    writes.push({ ref: predDoc.ref, data: { points, scoredAt: Timestamp.now() } })
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
    if (Object.keys(updates).length > 0) writes.push({ ref: nextDoc.ref, data: updates })
  }

  // Commit in batches of 499 (Firestore limit is 500 ops per batch)
  for (const chunk of chunkArray(writes, 499)) {
    const batch = writeBatch(db)
    chunk.forEach(op => batch.update(op.ref, op.data))
    await batch.commit()
  }

}
