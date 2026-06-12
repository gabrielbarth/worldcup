import type { Match, Team, Prediction } from '../../types'
import { PredictionInput } from './PredictionInput'
import { useSavePrediction } from '../../hooks/usePredictions'
import { useAuthState } from '../../hooks/useAuth'

interface Props {
  match: Match
  teamMap: Record<string, Team>
  prediction: Prediction | undefined
}

export function MatchCard({ match, teamMap, prediction }: Props) {
  const { appUser } = useAuthState()
  const { mutate: save, isPending } = useSavePrediction()

  const home = match.homeTeamId ? teamMap[match.homeTeamId] : null
  const away = match.awayTeamId ? teamMap[match.awayTeamId] : null
  const isPast = match.matchDate.toDate() < new Date()
  const isFinished = match.status === 'finished'

  const homeLabel = home ? `${home.flagEmoji} ${home.name}` : match.homeTeamSource ?? '?'
  const awayLabel = away ? `${away.flagEmoji} ${away.name}` : match.awayTeamSource ?? '?'

  const dateStr = match.matchDate.toDate().toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
  })

  return (
    <div className="bg-navy-800 rounded-xl p-4 mb-3 border border-navy-700">
      <div className="text-xs text-gray-400 mb-2">{dateStr}</div>
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium flex-1 text-right">{homeLabel}</span>
        {isFinished && match.result ? (
          <div className="flex items-center gap-1 px-3">
            <span className="text-brand font-bold text-lg">{match.result.homeScore}</span>
            <span className="text-gray-500">–</span>
            <span className="text-brand font-bold text-lg">{match.result.awayScore}</span>
          </div>
        ) : (
          <PredictionInput
            homeScore={prediction?.homeScore}
            awayScore={prediction?.awayScore}
            disabled={isPast || !appUser}
            isSaving={isPending}
            onSave={(h, a) =>
              appUser && save({ userId: appUser.uid, matchId: match.id, homeScore: h, awayScore: a })
            }
          />
        )}
        <span className="text-sm font-medium flex-1">{awayLabel}</span>
      </div>
      {isFinished && prediction?.points !== undefined && (
        <div className="text-right mt-1 text-xs text-brand font-semibold">
          +{prediction.points} pts
        </div>
      )}
    </div>
  )
}
