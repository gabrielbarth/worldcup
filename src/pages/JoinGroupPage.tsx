import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useJoinGroup } from '../hooks/useGroups'
import { useAuthState } from '../hooks/useAuth'

export function JoinGroupPage() {
  const [code, setCode] = useState('')
  const navigate = useNavigate()
  const { appUser } = useAuthState()
  const { mutate, isPending, error } = useJoinGroup()

  const handleJoin = () =>
    mutate(
      { code, userId: appUser!.uid },
      { onSuccess: (id) => navigate(`/groups/${id}`) }
    )

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold text-white mb-6">Entrar em um grupo</h1>
      <input
        value={code}
        onChange={e => setCode(e.target.value.toUpperCase())}
        placeholder="Código do grupo"
        maxLength={6}
        className="w-full bg-navy-800 border border-navy-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand mb-4 tracking-widest text-center text-2xl font-bold"
      />
      {error && <p className="text-brand text-sm mb-4">Código inválido ou grupo não encontrado</p>}
      <button
        onClick={handleJoin}
        disabled={code.length < 6 || isPending}
        className="w-full bg-brand text-white rounded-lg px-4 py-3 font-semibold disabled:opacity-50"
      >
        {isPending ? 'Entrando...' : 'Entrar'}
      </button>
    </div>
  )
}
