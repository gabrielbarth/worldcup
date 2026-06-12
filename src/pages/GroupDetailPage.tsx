import { useParams } from 'react-router-dom'
import { useGroup } from '../hooks/useGroups'

export function GroupDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: group, isLoading } = useGroup(id)

  if (isLoading) return <div className="p-4 text-gray-400">Carregando...</div>
  if (!group) return <div className="p-4 text-gray-400">Grupo não encontrado</div>

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-white mb-1">{group.name}</h1>
      <p className="text-gray-400 mb-2">{group.description}</p>
      {group.prize && <p className="text-brand mb-4">🏆 {group.prize}</p>}
      <div className="bg-navy-800 rounded-xl p-4 mb-4">
        <p className="text-xs text-gray-400 mb-1">Código de convite</p>
        <p className="text-2xl font-bold text-brand tracking-widest">{group.inviteCode}</p>
      </div>
      <p className="text-gray-400 text-sm">{group.members.length} participantes</p>
    </div>
  )
}
