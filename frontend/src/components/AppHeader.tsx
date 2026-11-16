import StatusBadge from './StatusBadge'

function BrandMark() {
  return (
    <div className="brand-mark" aria-hidden="true">
      <span className="brand-road brand-road--vertical" />
      <span className="brand-road brand-road--horizontal" />
      <span className="brand-center" />
      <span className="brand-lane brand-lane--one" />
      <span className="brand-lane brand-lane--two" />
    </div>
  )
}

export default function AppHeader() {
  return (
    <header className="topbar">
      <a className="brand" href="#overview" aria-label="Dynamic Traffic Lane Allocation home">
        <BrandMark />
        <span className="brand-copy">
          <span className="brand-name">CROSSFLOW<span className="brand-period">.</span></span>
          <span className="brand-subtitle">TRAFFIC SYSTEMS LAB</span>
        </span>
      </a>

      <nav className="top-nav" aria-label="Main navigation">
        <a className="top-nav-link top-nav-link--active" href="#overview">Overview</a>
        <a className="top-nav-link" href="#capabilities">Capabilities</a>
        <a className="top-nav-link" href="#workspace">Workspace</a>
      </nav>

      <div className="topbar-meta">
        <span className="project-code">PROJECT <strong>DTLA–01</strong></span>
        <span className="topbar-divider" aria-hidden="true" />
        <StatusBadge status="IN DEVELOPMENT" tone="in-progress" dot />
      </div>
    </header>
  )
}
