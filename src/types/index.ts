import type { Timestamp } from 'firebase/firestore'

export interface AppUser {
  uid: string
  name: string
  email: string
  photoURL?: string
  role: 'user' | 'admin'
  createdAt: Timestamp
}

export type MatchStage =
  | 'group'
  | 'round32'
  | 'round16'
  | 'quarter'
  | 'semi'
  | 'third_place'
  | 'final'

export type MatchStatus = 'scheduled' | 'finished'

export interface MatchResult {
  homeScore: number
  awayScore: number
  penalties?: { home: number; away: number } | null
}

export interface Match {
  id: string
  stage: MatchStage
  groupName?: string
  homeTeamId: string | null
  awayTeamId: string | null
  homeTeamSource?: string
  awayTeamSource?: string
  matchDate: Timestamp
  status: MatchStatus
  result?: MatchResult
}

export interface Team {
  id: string
  name: string
  flagEmoji: string
  group: string
}

export interface Prediction {
  id: string
  userId: string
  matchId: string
  homeScore: number
  awayScore: number
  penaltyWinner?: 'home' | 'away' | null
  points?: number
  scoredAt?: Timestamp
}

export interface BolaoGroup {
  id: string
  name: string
  description: string
  prize: string
  ownerId: string
  members: string[]
  inviteCode: string
  createdAt: Timestamp
}

export interface RankingEntry {
  userId: string
  name: string
  photoURL?: string
  totalPoints: number
  exactScores: number
}
