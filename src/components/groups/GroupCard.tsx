import { Link } from 'react-router-dom'
import type { BolaoGroup } from '../../types'

export function GroupCard({ group }: { group: BolaoGroup }) {
  return (
    <Link to={`/groups/${group.id}`} className="block bg-navy-800 rounded-xl p-4 mb-3 border border-navy-700">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-white">{group.name}</h3>
          <p className="text-gray-400 text-sm mt-1">{group.description}</p>
        </div>
        <span className="text-gray-400 text-xs">{group.members.length} membros</span>
      </div>
      {group.prize && <p className="text-brand text-sm mt-2">🏆 {group.prize}</p>}
    </Link>
  )
}
