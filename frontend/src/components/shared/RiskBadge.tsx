import { clsx } from 'clsx'

interface Props { risk?: string | null; className?: string }

export function RiskBadge({ risk, className }: Props) {
  const r = risk?.toUpperCase() ?? ''
  return (
    <span className={clsx(
      r === 'LOW' && 'badge-low',
      r === 'MEDIUM' && 'badge-medium',
      r === 'HIGH' && 'badge-high',
      !['LOW','MEDIUM','HIGH'].includes(r) && 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600',
      className
    )}>
      {r || 'N/A'} Risk
    </span>
  )
}
