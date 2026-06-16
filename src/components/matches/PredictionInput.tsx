import { useState, useEffect, useRef } from 'react'

interface Props {
  homeScore: number | undefined
  awayScore: number | undefined
  disabled: boolean
  onSave: (home: number, away: number, penaltyWinner?: 'home' | 'away') => void
  isSaving: boolean
  showPenaltySelector?: boolean
  penaltyWinner?: 'home' | 'away' | null
}

export function PredictionInput({
  homeScore,
  awayScore,
  disabled,
  onSave,
  isSaving,
  showPenaltySelector = false,
  penaltyWinner: initialPenaltyWinner,
}: Props) {
  const [home, setHome] = useState(homeScore?.toString() ?? '')
  const [away, setAway] = useState(awayScore?.toString() ?? '')
  const [penaltyWinner, setPenaltyWinner] = useState<'home' | 'away' | undefined>(
    initialPenaltyWinner ?? undefined
  )
  const [saved, setSaved] = useState(false)
  const wasSaving = useRef(false)

  useEffect(() => {
    setHome(homeScore?.toString() ?? '')
    setAway(awayScore?.toString() ?? '')
  }, [homeScore, awayScore])

  useEffect(() => {
    setPenaltyWinner(initialPenaltyWinner ?? undefined)
  }, [initialPenaltyWinner])

  useEffect(() => {
    if (isSaving) {
      wasSaving.current = true
    } else if (wasSaving.current) {
      wasSaving.current = false
      setSaved(true)
      const t = setTimeout(() => setSaved(false), 1500)
      return () => clearTimeout(t)
    }
  }, [isSaving])

  const handleSave = () => {
    const h = parseInt(home)
    const a = parseInt(away)
    if (!isNaN(h) && !isNaN(a) && h >= 0 && a >= 0) onSave(h, a, penaltyWinner)
  }

  const inputClass = `w-12 h-12 text-center text-xl font-bold rounded-lg border
    ${disabled ? 'bg-navy-700 border-navy-700 text-gray-500 cursor-not-allowed' : 'bg-navy-800 border-navy-700 text-brand focus:border-brand focus:outline-none'}`

  const btnBase = 'px-3 py-1 text-xs rounded-lg border font-semibold'
  const btnActive = 'bg-brand border-brand text-white'
  const btnInactive = 'bg-navy-800 border-navy-700 text-gray-400'

  return (
    <div className="flex flex-col items-center gap-2">
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
            disabled={isSaving || saved || home === '' || away === ''}
            className={`ml-1 px-3 py-2 text-xs rounded-lg transition-colors ${
              saved
                ? 'bg-green-600 text-white'
                : 'bg-brand text-white disabled:opacity-40'
            }`}
          >
            {isSaving ? '...' : saved ? '✓' : 'OK'}
          </button>
        )}
      </div>
      {showPenaltySelector && !disabled && (
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>Pênaltis:</span>
          <button
            onClick={() => setPenaltyWinner('home')}
            className={`${btnBase} ${penaltyWinner === 'home' ? btnActive : btnInactive}`}
          >
            Casa
          </button>
          <button
            onClick={() => setPenaltyWinner('away')}
            className={`${btnBase} ${penaltyWinner === 'away' ? btnActive : btnInactive}`}
          >
            Fora
          </button>
        </div>
      )}
    </div>
  )
}
