import { useQuery } from '@tanstack/react-query'
import { getMatches, getTeams } from '../services/matchService'
import type { Team } from '../types'

export function useMatches() {
  return useQuery({ queryKey: ['matches'], queryFn: getMatches })
}

export function useTeams() {
  return useQuery({ queryKey: ['teams'], queryFn: getTeams })
}

export function useTeamMap(): Record<string, Team> {
  const { data: teams = [] } = useTeams()
  return Object.fromEntries(teams.map(t => [t.id, t]))
}
