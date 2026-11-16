import type { ReactNode } from 'react'
import StatusBadge from './StatusBadge'
import type { StatusTone } from './StatusBadge'

export type Feature = {
  number: string
  title: string
  description: string
  status: string
  tone: StatusTone
  icon: ReactNode
}

type FeatureCardProps = {
  feature: Feature
}

export default function FeatureCard({ feature }: FeatureCardProps) {
  return (
    <article className="feature-card">
      <div className="feature-card-top">
        <span className="feature-number">{feature.number}</span>
        <span className="feature-icon" aria-hidden="true">{feature.icon}</span>
      </div>
      <div className="feature-card-content">
        <h3>{feature.title}</h3>
        <p>{feature.description}</p>
      </div>
      <div className="feature-card-footer">
        <StatusBadge status={feature.status} tone={feature.tone} />
        <span className="feature-arrow" aria-hidden="true">↗</span>
      </div>
    </article>
  )
}
