import { collection, getDocs, doc, getDoc } from 'firebase/firestore'
import { db } from './firebase'
import type { AppUser } from '../types'

export async function getAllUsers(): Promise<AppUser[]> {
  const snap = await getDocs(collection(db, 'users'))
  return snap.docs.map(d => d.data() as AppUser)
}

export async function getUsersByIds(uids: string[]): Promise<AppUser[]> {
  if (uids.length === 0) return []
  const snaps = await Promise.all(uids.map(uid => getDoc(doc(db, 'users', uid))))
  return snaps.filter(s => s.exists()).map(s => s.data() as AppUser)
}
