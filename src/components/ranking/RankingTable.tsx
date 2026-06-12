import type { RankingEntry } from '../../types'

export function RankingTable({ entries }: { entries: RankingEntry[] }) {
  return (
    <div className="space-y-2">
      {entries.map((entry, i) => (
        <div key={entry.userId} className="flex items-center gap-3 bg-navy-800 rounded-xl px-4 py-3">
          <span className={`text-lg font-bold w-6 ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-gray-300' : i === 2 ? 'text-orange-400' : 'text-gray-500'}`}>
            {i + 1}
          </span>
          {entry.photoURL ? (
            <img src={entry.photoURL} alt="" className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-navy-700 flex items-center justify-center text-gray-400 text-sm">
              {entry.name[0].toUpperCase()}
            </div>
          )}
          <span className="flex-1 text-white">{entry.name}</span>
          <div className="text-right">
            <div className="text-brand font-bold">{entry.totalPoints} pts</div>
            <div className="text-gray-500 text-xs">{entry.exactScores} exatos</div>
          </div>
        </div>
      ))}
    </div>
  )
}
