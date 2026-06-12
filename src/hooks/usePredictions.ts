import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getPredictionsByUser, savePrediction } from '../services/predictionService'
import type { Prediction } from '../types'

export function usePredictions(userId: string | undefined) {
  return useQuery({
    queryKey: ['predictions', userId],
    queryFn: () => getPredictionsByUser(userId!),
    enabled: !!userId,
  })
}

export function usePredictionMap(userId: string | undefined): Record<string, Prediction> {
  const { data = [] } = usePredictions(userId)
  return Object.fromEntries(data.map(p => [p.matchId, p]))
}

export function useSavePrediction() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      userId,
      matchId,
      homeScore,
      awayScore,
      penaltyWinner,
    }: {
      userId: string
      matchId: string
      homeScore: number
      awayScore: number
      penaltyWinner?: 'home' | 'away' | null
    }) => savePrediction(userId, matchId, homeScore, awayScore, penaltyWinner),
    onSuccess: (_, { userId }) => qc.invalidateQueries({ queryKey: ['predictions', userId] }),
  })
}
