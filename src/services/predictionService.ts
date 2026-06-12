import { collection, doc, getDocs, setDoc, query, where } from 'firebase/firestore'
import { db } from './firebase'
import type { Prediction } from '../types'

export async function getPredictionsByUser(userId: string): Promise<Prediction[]> {
  const snap = await getDocs(
    query(collection(db, 'predictions'), where('userId', '==', userId))
  )
  return snap.docs.map(d => d.data() as Prediction)
}

export async function savePrediction(
  userId: string,
  matchId: string,
  homeScore: number,
  awayScore: number,
  penaltyWinner?: 'home' | 'away' | null
): Promise<void> {
  const id = `${userId}_${matchId}`
  await setDoc(doc(db, 'predictions', id), {
    id,
    userId,
    matchId,
    homeScore,
    awayScore,
    penaltyWinner: penaltyWinner ?? null,
  }, { merge: true })
}
