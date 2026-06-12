import {
  collection, doc, getDocs, getDoc, addDoc,
  updateDoc, arrayUnion, query, where, serverTimestamp
} from 'firebase/firestore'
import { db } from './firebase'
import type { BolaoGroup } from '../types'
import { generateInviteCode } from '../utils/inviteCode'

export async function getGroupsByUser(userId: string): Promise<BolaoGroup[]> {
  const snap = await getDocs(
    query(collection(db, 'groups'), where('members', 'array-contains', userId))
  )
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as BolaoGroup))
}

export async function getGroupById(id: string): Promise<BolaoGroup | null> {
  const snap = await getDoc(doc(db, 'groups', id))
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as BolaoGroup) : null
}

export async function createGroup(
  name: string,
  description: string,
  prize: string,
  ownerId: string
): Promise<string> {
  const ref = await addDoc(collection(db, 'groups'), {
    name,
    description,
    prize,
    ownerId,
    members: [ownerId],
    inviteCode: generateInviteCode(),
    createdAt: serverTimestamp(),
  })
  return ref.id
}

export async function joinGroupByCode(code: string, userId: string): Promise<string> {
  const snap = await getDocs(
    query(collection(db, 'groups'), where('inviteCode', '==', code.toUpperCase()))
  )
  if (snap.empty) throw new Error('Código inválido')
  const groupDoc = snap.docs[0]
  await updateDoc(groupDoc.ref, { members: arrayUnion(userId) })
  return groupDoc.id
}
