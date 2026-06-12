import { describe, it, expect } from 'vitest'
import { calculatePoints } from './scoring'
import type { Prediction, MatchResult } from '../types'

const pred = (home: number, away: number, penaltyWinner?: 'home' | 'away'): Prediction => ({
  id: 'test',
  userId: 'u1',
  matchId: 'm1',
  homeScore: home,
  awayScore: away,
  penaltyWinner: penaltyWinner ?? null,
})

const result = (home: number, away: number, penalties?: { home: number; away: number }): MatchResult => ({
  homeScore: home,
  awayScore: away,
  penalties: penalties ?? null,
})

describe('calculatePoints', () => {
  it('exact score home win → 3 pts', () => {
    expect(calculatePoints(pred(2, 1), result(2, 1))).toBe(3)
  })

  it('exact score away win → 3 pts', () => {
    expect(calculatePoints(pred(0, 2), result(0, 2))).toBe(3)
  })

  it('exact score draw → 3 pts', () => {
    expect(calculatePoints(pred(1, 1), result(1, 1))).toBe(3)
  })

  it('correct winner + winner goals correct → 2 pts', () => {
    // predicted 3-0, actual 3-1: home wins both, home score 3 matches
    expect(calculatePoints(pred(3, 0), result(3, 1))).toBe(2)
  })

  it('correct away winner + away goals correct → 2 pts', () => {
    expect(calculatePoints(pred(0, 2), result(1, 2))).toBe(2)
  })

  it('correct winner only → 1 pt', () => {
    expect(calculatePoints(pred(2, 0), result(3, 1))).toBe(1)
  })

  it('correct draw (not exact) → 1 pt', () => {
    expect(calculatePoints(pred(2, 2), result(1, 1))).toBe(1)
  })

  it('wrong result → 0 pts', () => {
    expect(calculatePoints(pred(0, 1), result(1, 0))).toBe(0)
  })

  it('predicted draw but home won → 0 pts', () => {
    expect(calculatePoints(pred(1, 1), result(2, 0))).toBe(0)
  })

  it('penalty winner bonus added on top', () => {
    // exact score + correct penalty winner
    expect(calculatePoints(pred(1, 1, 'home'), result(1, 1, { home: 5, away: 3 }))).toBe(4)
  })

  it('penalty winner bonus not added if wrong', () => {
    expect(calculatePoints(pred(1, 1, 'away'), result(1, 1, { home: 5, away: 3 }))).toBe(3)
  })

  it('no penalty bonus when result has no penalties', () => {
    expect(calculatePoints(pred(2, 1, 'home'), result(2, 1))).toBe(3)
  })

  it('penalty winner bonus not awarded on non-draw prediction', () => {
    // correct winner only, but predicted home win (not draw) so no penalty bonus
    expect(calculatePoints(pred(2, 0, 'home'), result(3, 0, { home: 4, away: 2 }))).toBe(1)
  })
})
