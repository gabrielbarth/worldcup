import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getGroupsByUser, getGroupById, createGroup, joinGroupByCode } from '../services/groupService'

export function useMyGroups(userId: string | undefined) {
  return useQuery({
    queryKey: ['groups', userId],
    queryFn: () => getGroupsByUser(userId!),
    enabled: !!userId,
  })
}

export function useGroup(id: string | undefined) {
  return useQuery({
    queryKey: ['group', id],
    queryFn: () => getGroupById(id!),
    enabled: !!id,
  })
}

export function useCreateGroup() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ name, description, prize, ownerId }: { name: string; description: string; prize: string; ownerId: string }) =>
      createGroup(name, description, prize, ownerId),
    onSuccess: (_, { ownerId }) => qc.invalidateQueries({ queryKey: ['groups', ownerId] }),
  })
}

export function useJoinGroup() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ code, userId }: { code: string; userId: string }) => joinGroupByCode(code, userId),
    onSuccess: (_, { userId }) => qc.invalidateQueries({ queryKey: ['groups', userId] }),
  })
}
