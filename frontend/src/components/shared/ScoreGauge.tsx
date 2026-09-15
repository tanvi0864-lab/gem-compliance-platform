interface Props { score?: number | null; size?: number }

export function ScoreGauge({ score, size = 80 }: Props) {
  const s = score ?? 0
  const color = s >= 90 ? '#16a34a' : s >= 70 ? '#d97706' : '#dc2626'
  const r = (size - 12) / 2
  const circ = 2 * Math.PI * r
  const dash = (s / 100) * circ

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e5e7eb" strokeWidth="10" />
        <circle
          cx={size/2} cy={size/2} r={r} fill="none"
          stroke={color} strokeWidth="10"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.6s ease' }}
        />
      </svg>
      <span className="text-2xl font-bold" style={{ color, marginTop: -size/2 - 16 }}>
        {score != null ? `${score}%` : '—'}
      </span>
    </div>
  )
}
