import { CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react'
import { clsx } from 'clsx'

interface Props {
  verdict?: string | null
  size?: 'sm' | 'md' | 'lg'
}

const config: Record<string, { label: string; cls: string; Icon: any }> = {
  VERIFIED:      { label: 'Verified',      cls: 'verdict-verified',      Icon: CheckCircle },
  FLAGGED:       { label: 'Flagged',       cls: 'verdict-flagged',       Icon: XCircle },
  NEEDS_REVIEW:  { label: 'Needs Review',  cls: 'verdict-needs-review',  Icon: AlertCircle },
  PENDING:       { label: 'Pending',       cls: 'verdict-pending',       Icon: Clock },
  COMPLIANT:     { label: 'Compliant',     cls: 'verdict-verified',      Icon: CheckCircle },
  REQUIRES_REVIEW:{ label: 'Requires Review', cls: 'verdict-needs-review', Icon: AlertCircle },
  NON_COMPLIANT: { label: 'Non-Compliant', cls: 'verdict-flagged',       Icon: XCircle },
}

export function VerdictBadge({ verdict, size = 'md' }: Props) {
  const v = verdict ?? 'PENDING'
  const c = config[v] ?? config['PENDING']
  return (
    <span className={clsx(c.cls, size === 'sm' && 'text-xs px-2 py-0.5')}>
      <c.Icon className={clsx('mr-1 inline', size === 'sm' ? 'h-3 w-3' : 'h-4 w-4')} />
      {c.label}
    </span>
  )
}
