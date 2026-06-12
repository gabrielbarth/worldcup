import { useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { auth } from '../services/firebase'
import { login, logout, register, getAppUser, updateUserProfile } from '../services/authService'
import type { AppUser } from '../types'

export function useAuthState() {
  const [uid, setUid] = useState<string | null | undefined>(undefined)

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => setUid(user?.uid ?? null))
  }, [])

  const { data: appUser, isLoading } = useQuery({
    queryKey: ['user', uid],
    queryFn: () => (uid ? getAppUser(uid) : null),
    enabled: uid !== undefined,
  })

  return {
    uid,
    appUser: appUser ?? null,
    isLoading: uid === undefined || isLoading,
    isAuthenticated: !!uid,
  }
}

export function useLogin() {
  return useMutation({ mutationFn: ({ email, password }: { email: string; password: string }) => login(email, password) })
}

export function useRegister() {
  return useMutation({
    mutationFn: ({ name, email, password }: { name: string; email: string; password: string }) =>
      register(name, email, password),
  })
}

export function useLogout() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: logout,
    onSuccess: () => qc.clear(),
  })
}

export function useUpdateProfile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ uid, data }: { uid: string; data: { name?: string; photoFile?: File } }) =>
      updateUserProfile(uid, data),
    onSuccess: (_, { uid }) => qc.invalidateQueries({ queryKey: ['user', uid] }),
  })
}
