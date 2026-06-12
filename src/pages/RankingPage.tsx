import { useState } from 'react'
import { useGlobalRanking, useGroupRanking } from '../hooks/useRanking'
import { useMyGroups } from '../hooks/useGroups'
import { useAuthState } from '../hooks/useAuth'
import { RankingTable } from '../components/ranking/RankingTable'

export function RankingPage() {
  const { appUser } = useAuthState()
  const [mode, setMode] = useState<'global' | 'group'>('global')
  const [selectedGroupId, setSelectedGroupId] = useState<string | undefined>()

  const { data: myGroups = [] } = useMyGroups(appUser?.uid)
  const selectedGroup = myGroups.find(g => g.id === selectedGroupId)

  const { data: globalEntries = [], isLoading: globalLoading } = useGlobalRanking()
  const { data: groupEntries = [], isLoading: groupLoading } = useGroupRanking(selectedGroup)

  const entries = mode === 'global' ? globalEntries : groupEntries
  const isLoading = mode === 'global' ? globalLoading : groupLoading

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold text-white mb-4">Ranking</h1>
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setMode('global')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium ${mode === 'global' ? 'bg-brand text-white' : 'bg-navy-800 text-gray-400'}`}
        >
          Geral
        </button>
        <button
          onClick={() => setMode('group')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium ${mode === 'group' ? 'bg-brand text-white' : 'bg-navy-800 text-gray-400'}`}
        >
          Por grupo
        </button>
      </div>
      {mode === 'group' && (
        <select
          value={selectedGroupId ?? ''}
          onChange={e => setSelectedGroupId(e.target.value)}
          className="w-full bg-navy-800 border border-navy-700 rounded-lg px-4 py-3 text-white mb-4"
        >
          <option value="" disabled>Selecione um grupo</option>
          {myGroups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
      )}
      {isLoading && <p className="text-gray-400">Carregando...</p>}
      {!isLoading && <RankingTable entries={entries} />}
    </div>
  )
}
