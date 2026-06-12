import { useState } from 'react'
import { useMatches, useTeamMap } from '../hooks/useMatches'
import { AdminMatchForm } from '../components/admin/AdminMatchForm'
import type { MatchStage } from '../types'

const STAGE_LABELS: Record<MatchStage, string> = {
  group: 'Grupos', round32: '32avos', round16: 'Oitavas',
  quarter: 'Quartas', semi: 'Semis', third_place: '3º Lugar', final: 'Final',
}

export function AdminMatchesPage() {
  const { data: matches = [], isLoading } = useMatches()
  const teamMap = useTeamMap()
  const [activeStage, setActiveStage] = useState<MatchStage>('group')

  const stages = [...new Set(matches.map(m => m.stage))] as MatchStage[]
  const visible = matches
    .filter(m => m.stage === activeStage)
    .sort((a, b) => a.matchDate.toDate().getTime() - b.matchDate.toDate().getTime())

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold text-white mb-4">Admin — Resultados</h1>
      <div className="flex gap-2 overflow-x-auto mb-4 pb-1">
        {stages.map(s => (
          <button
            key={s}
            onClick={() => setActiveStage(s)}
            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${activeStage === s ? 'bg-brand text-white' : 'bg-navy-800 text-gray-400'}`}
          >
            {STAGE_LABELS[s]}
          </button>
        ))}
      </div>
      {isLoading && <p className="text-gray-400">Carregando...</p>}
      {visible.map(match => (
        <AdminMatchForm key={match.id} match={match} teamMap={teamMap} />
      ))}
    </div>
  )
}
