import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from './firebase'
import type { AppUser } from '../types'

export async function register(name: string, email: string, password: string): Promise<void> {
  const { user } = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(user, { displayName: name })
  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    name,
    email,
    role: 'user',
    createdAt: serverTimestamp(),
  })
}

export async function login(email: string, password: string): Promise<void> {
  await signInWithEmailAndPassword(auth, email, password)
}

export async function logout(): Promise<void> {
  await signOut(auth)
}

export async function getAppUser(uid: string): Promise<AppUser | null> {
  const snap = await getDoc(doc(db, 'users', uid))
  return snap.exists() ? (snap.data() as AppUser) : null
}

export async function updateUserProfile(
  uid: string,
  data: { name?: string }
): Promise<void> {
  if (data.name) {
    await updateProfile(auth.currentUser!, { displayName: data.name })
    await updateDoc(doc(db, 'users', uid), { name: data.name })
  }
}
