import { useQuery } from '@tanstack/react-query'
import { getDocs, collection, query, where } from 'firebase/firestore'
import { db } from '../services/firebase'
import { getAllUsers, getUsersByIds } from '../services/userService'
import type { RankingEntry, Prediction, BolaoGroup } from '../types'

async function computeRanking(userIds: string[]): Promise<RankingEntry[]> {
  if (userIds.length === 0) return []
  const [users, predsSnap] = await Promise.all([
    getUsersByIds(userIds),
    getDocs(query(collection(db, 'predictions'), where('userId', 'in', userIds))),
  ])

  const predictions = predsSnap.docs.map(d => d.data() as Prediction)
  const pointsMap: Record<string, { total: number; exact: number }> = {}

  for (const pred of predictions) {
    if (!pointsMap[pred.userId]) pointsMap[pred.userId] = { total: 0, exact: 0 }
    pointsMap[pred.userId].total += pred.points ?? 0
    if (pred.points === 3) pointsMap[pred.userId].exact++
  }

  return users
    .map(u => ({
      userId: u.uid,
      name: u.name,
      photoURL: u.photoURL,
      totalPoints: pointsMap[u.uid]?.total ?? 0,
      exactScores: pointsMap[u.uid]?.exact ?? 0,
    }))
    .sort((a, b) => b.totalPoints - a.totalPoints || b.exactScores - a.exactScores)
}

export function useGlobalRanking() {
  return useQuery({
    queryKey: ['ranking', 'global'],
    queryFn: async () => {
      const users = await getAllUsers()
      return computeRanking(users.map(u => u.uid))
    },
  })
}

export function useGroupRanking(group: BolaoGroup | undefined) {
  return useQuery({
    queryKey: ['ranking', 'group', group?.id],
    queryFn: () => computeRanking(group!.members),
    enabled: !!group,
  })
}
