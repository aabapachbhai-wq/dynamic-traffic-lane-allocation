export type StatusTone = 'planned' | 'in-progress' | 'complete' | 'pending'

type StatusBadgeProps = {
  status: string
  tone?: StatusTone
  dot?: boolean
}

export default function StatusBadge({ status, tone = 'planned', dot = false }: StatusBadgeProps) {
  return (
    <span className={`status-badge status-badge--${tone}`}>
      {dot && <span aria-hidden="true" className="status-dot" />}
      {status}
    </span>
  )
}
