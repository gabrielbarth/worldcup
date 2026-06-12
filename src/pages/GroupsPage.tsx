import { Link } from 'react-router-dom'
import { useAuthState } from '../hooks/useAuth'
import { useMyGroups } from '../hooks/useGroups'
import { GroupCard } from '../components/groups/GroupCard'

export function GroupsPage() {
  const { appUser } = useAuthState()
  const { data: groups = [], isLoading } = useMyGroups(appUser?.uid)

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-white">Meus Grupos</h1>
        <div className="flex gap-2">
          <Link to="/groups/join" className="px-3 py-2 text-sm border border-brand text-brand rounded-lg">Entrar</Link>
          <Link to="/groups/new" className="px-3 py-2 text-sm bg-brand text-white rounded-lg">+ Criar</Link>
        </div>
      </div>
      {isLoading && <p className="text-gray-400">Carregando...</p>}
      {!isLoading && groups.length === 0 && (
        <p className="text-gray-400 text-center mt-8">Você ainda não participa de nenhum grupo.</p>
      )}
      {groups.map(g => <GroupCard key={g.id} group={g} />)}
    </div>
  )
}
