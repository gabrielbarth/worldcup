import { useState } from 'react'
import { useMatches, useTeamMap } from '../hooks/useMatches'
import { usePredictionMap } from '../hooks/usePredictions'
import { useAuthState } from '../hooks/useAuth'
import { MatchCard } from '../components/matches/MatchCard'
import type { MatchStage } from '../types'

const STAGE_LABELS: Record<MatchStage, string> = {
  group: 'Grupos',
  round32: '32avos',
  round16: 'Oitavas',
  quarter: 'Quartas',
  semi: 'Semis',
  third_place: '3º Lugar',
  final: 'Final',
}

const KNOCKOUT_STAGES: MatchStage[] = ['round32', 'round16', 'quarter', 'semi', 'third_place', 'final']
const GROUP_NAMES = ['A','B','C','D','E','F','G','H','I','J','K','L']

export function MatchesPage() {
  const { data: matches = [], isLoading } = useMatches()
  const teamMap = useTeamMap()
  const { appUser } = useAuthState()
  const predMap = usePredictionMap(appUser?.uid)

  const [activeTab, setActiveTab] = useState<string>('todos')

  const tabClass = (tab: string) =>
    `px-4 py-2 text-sm whitespace-nowrap ${activeTab === tab ? 'text-brand border-b-2 border-brand' : 'text-gray-400'}`

  const visibleMatches = activeTab === 'todos'
    ? [...matches].sort((a, b) => a.matchDate.toMillis() - b.matchDate.toMillis())
    : KNOCKOUT_STAGES.includes(activeTab as MatchStage)
      ? matches.filter(m => m.stage === activeTab)
      : matches.filter(m => m.stage === 'group' && m.groupName === activeTab)

  if (isLoading) return <div className="p-4 text-gray-400">Carregando jogos...</div>

  return (
    <div className="min-h-screen bg-navy-900">
      <div className="sticky top-0 bg-navy-900 border-b border-navy-700 z-10">
        <div className="flex overflow-x-auto scrollbar-hide">
          <button className={tabClass('todos')} onClick={() => setActiveTab('todos')}>Todos</button>
          {GROUP_NAMES.map(g => (
            <button key={g} className={tabClass(g)} onClick={() => setActiveTab(g)}>Grupo {g}</button>
          ))}
          {KNOCKOUT_STAGES.map(s => (
            <button key={s} className={tabClass(s)} onClick={() => setActiveTab(s)}>{STAGE_LABELS[s]}</button>
          ))}
        </div>
      </div>
      <div className="p-4">
        {visibleMatches.map(match => (
          <MatchCard
            key={match.id}
            match={match}
            teamMap={teamMap}
            prediction={predMap[match.id]}
          />
        ))}
        {visibleMatches.length === 0 && (
          <p className="text-gray-500 text-center mt-8">Nenhum jogo nesta fase ainda.</p>
        )}
      </div>
    </div>
  )
}
