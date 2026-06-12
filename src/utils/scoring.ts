import type { Prediction, MatchResult } from '../types'

export function calculatePoints(prediction: Prediction, result: MatchResult): number {
  const { homeScore: pH, awayScore: pA } = prediction
  const { homeScore: rH, awayScore: rA } = result

  const predOutcome = Math.sign(pH - pA)
  const resOutcome = Math.sign(rH - rA)

  let points = 0

  if (pH === rH && pA === rA) {
    points = 3
  } else if (predOutcome === resOutcome) {
    if (resOutcome === 0) {
      points = 1
    } else {
      const winnerPred = resOutcome > 0 ? pH : pA
      const winnerRes = resOutcome > 0 ? rH : rA
      points = winnerPred === winnerRes ? 2 : 1
    }
  }

  if (result.penalties) {
    const actualWinner = result.penalties.home > result.penalties.away ? 'home' : 'away'
    if (prediction.penaltyWinner === actualWinner) {
      points += 1
    }
  }

  return points
}
