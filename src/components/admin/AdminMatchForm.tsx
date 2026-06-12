import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { submitResult } from '../../services/matchService'
import type { Match, Team } from '../../types'

interface Props {
  match: Match
  teamMap: Record<string, Team>
}

export function AdminMatchForm({ match, teamMap }: Props) {
  const qc = useQueryClient()
  const [homeScore, setHomeScore] = useState('')
  const [awayScore, setAwayScore] = useState('')
  const [penHome, setPenHome] = useState('')
  const [penAway, setPenAway] = useState('')
  const [saving, setSaving] = useState(false)
  const done = match.status === 'finished'

  const home = match.homeTeamId ? teamMap[match.homeTeamId] : null
  const away = match.awayTeamId ? teamMap[match.awayTeamId] : null
  const isKnockout = match.stage !== 'group'

  const showPenalties = isKnockout &&
    homeScore !== '' && awayScore !== '' &&
    parseInt(homeScore) === parseInt(awayScore)

  const handleSubmit = async () => {
    const hS = parseInt(homeScore)
    const aS = parseInt(awayScore)
    if (isNaN(hS) || isNaN(aS)) return
    setSaving(true)
    try {
      await submitResult(match.id, {
        homeScore: hS,
        awayScore: aS,
        penalties: showPenalties && penHome !== '' && penAway !== ''
          ? { home: parseInt(penHome), away: parseInt(penAway) }
          : null,
      })
      await qc.invalidateQueries({ queryKey: ['matches'] })
      await qc.invalidateQueries({ queryKey: ['predictions'] })
    } finally {
      setSaving(false)
    }
  }

  const inputClass = "w-12 h-10 text-center font-bold rounded-lg border bg-navy-900 border-navy-700 text-white focus:outline-none focus:border-brand"

  if (done && match.result) {
    return (
      <div className="bg-navy-800 rounded-xl p-3 mb-2 flex items-center justify-between">
        <span className="text-sm text-gray-300">
          {home?.flagEmoji} {home?.name ?? match.homeTeamSource} × {away?.flagEmoji} {away?.name ?? match.awayTeamSource}
        </span>
        <span className="text-brand font-bold">{match.result.homeScore}–{match.result.awayScore} ✓</span>
      </div>
    )
  }

  return (
    <div className="bg-navy-800 rounded-xl p-4 mb-3 border border-navy-700">
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-sm flex-1 text-right">{home?.flagEmoji ?? ''} {home?.name ?? match.homeTeamSource ?? '?'}</span>
        <div className="flex items-center gap-1">
          <input type="number" min={0} value={homeScore} onChange={e => setHomeScore(e.target.value)} className={inputClass} />
          <span className="text-gray-400">–</span>
          <input type="number" min={0} value={awayScore} onChange={e => setAwayScore(e.target.value)} className={inputClass} />
        </div>
        <span className="text-sm flex-1">{away?.flagEmoji ?? ''} {away?.name ?? match.awayTeamSource ?? '?'}</span>
      </div>
      {showPenalties && (
        <div className="flex items-center gap-2 mb-3 text-sm text-gray-400">
          <span>Pênaltis:</span>
          <input type="number" min={0} value={penHome} onChange={e => setPenHome(e.target.value)} className={inputClass} />
          <span>–</span>
          <input type="number" min={0} value={penAway} onChange={e => setPenAway(e.target.value)} className={inputClass} />
        </div>
      )}
      <button
        onClick={handleSubmit}
        disabled={saving || homeScore === '' || awayScore === ''}
        className="w-full bg-brand text-white rounded-lg py-2 text-sm font-semibold disabled:opacity-50"
      >
        {saving ? 'Salvando e pontuando...' : 'Confirmar resultado'}
      </button>
    </div>
  )
}
