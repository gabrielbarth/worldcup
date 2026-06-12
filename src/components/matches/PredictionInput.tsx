import { useState, useEffect } from 'react'

interface Props {
  homeScore: number | undefined
  awayScore: number | undefined
  disabled: boolean
  onSave: (home: number, away: number) => void
  isSaving: boolean
}

export function PredictionInput({ homeScore, awayScore, disabled, onSave, isSaving }: Props) {
  const [home, setHome] = useState(homeScore?.toString() ?? '')
  const [away, setAway] = useState(awayScore?.toString() ?? '')

  useEffect(() => {
    setHome(homeScore?.toString() ?? '')
    setAway(awayScore?.toString() ?? '')
  }, [homeScore, awayScore])

  const handleSave = () => {
    const h = parseInt(home)
    const a = parseInt(away)
    if (!isNaN(h) && !isNaN(a) && h >= 0 && a >= 0) onSave(h, a)
  }

  const inputClass = `w-12 h-12 text-center text-xl font-bold rounded-lg border
    ${disabled ? 'bg-navy-700 border-navy-700 text-gray-500 cursor-not-allowed' : 'bg-navy-800 border-navy-700 text-brand focus:border-brand focus:outline-none'}`

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        min={0}
        max={99}
        value={home}
        onChange={e => setHome(e.target.value)}
        disabled={disabled}
        className={inputClass}
      />
      <span className="text-gray-400">×</span>
      <input
        type="number"
        min={0}
        max={99}
        value={away}
        onChange={e => setAway(e.target.value)}
        disabled={disabled}
        className={inputClass}
      />
      {!disabled && (
        <button
          onClick={handleSave}
          disabled={isSaving || home === '' || away === ''}
          className="ml-1 px-3 py-2 bg-brand text-white text-xs rounded-lg disabled:opacity-40"
        >
          {isSaving ? '...' : 'OK'}
        </button>
      )}
    </div>
  )
}
