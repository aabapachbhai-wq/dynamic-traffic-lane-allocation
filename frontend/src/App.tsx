import AppHeader from './components/AppHeader'
import BackendStatus from './components/BackendStatus'
import FeatureCard from './components/FeatureCard'
import type { Feature } from './components/FeatureCard'
import StatusBadge from './components/StatusBadge'

const features: Feature[] = [
  {
    number: '01',
    title: 'Four-Way Intersection',
    description: 'A virtual junction with four independent approaches and a shared signal controller.',
    status: 'PLANNED',
    tone: 'planned',
    icon: <IntersectionIcon />,
  },
  {
    number: '02',
    title: 'Fixed-Time Control',
    description: 'A consistent phase sequence to establish a baseline for controlled comparison.',
    status: 'PLANNED',
    tone: 'planned',
    icon: <ClockIcon />,
  },
  {
    number: '03',
    title: 'Adaptive Signal Control',
    description: 'Demand-responsive approach selection informed by virtual traffic queues.',
    status: 'PLANNED',
    tone: 'planned',
    icon: <PulseIcon />,
  },
  {
    number: '04',
    title: 'Emergency Priority',
    description: 'A software model for prioritizing emergency requests through safe transitions.',
    status: 'PLANNED',
    tone: 'planned',
    icon: <PriorityIcon />,
  },
  {
    number: '05',
    title: 'Queue Monitoring',
    description: 'Approach-level vehicle counts and density states within the simulation.',
    status: 'PLANNED',
    tone: 'planned',
    icon: <QueueIcon />,
  },
  {
    number: '06',
    title: 'Performance Analytics',
    description: 'Simulation metrics to help compare fixed-time and adaptive strategies.',
    status: 'PLANNED',
    tone: 'planned',
    icon: <ChartIcon />,
  },
]

export default function App() {
  return (
    <div className="app-shell">
      <AppHeader />

      <main id="overview" className="main-content">
        <section className="hero" aria-labelledby="page-title">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-line" />ENGINEERING SIMULATION <span className="eyebrow-index">/ 01</span></div>
            <h1 id="page-title">Dynamic Traffic<br /><span>Lane Allocation</span></h1>
            <p className="hero-description">An academic exploration of demand-aware signal control at a virtual four-way intersection.</p>
            <div className="hero-tags">
              <span className="hero-tag"><span className="tag-mark">◈</span> VIRTUAL MODEL</span>
              <span className="hero-tag"><span className="tag-mark">⌁</span> APPROACH-LEVEL CONTROL</span>
            </div>
          </div>

          <div className="hero-aside" aria-label="Project development stage">
            <div className="stage-orbit" aria-hidden="true">
              <div className="orbit-ring orbit-ring--outer" />
              <div className="orbit-ring orbit-ring--inner" />
              <span className="orbit-node orbit-node--one" />
              <span className="orbit-node orbit-node--two" />
              <span className="orbit-node orbit-node--three" />
              <span className="orbit-node orbit-node--four" />
              <div className="orbit-center"><span>01</span><small>PHASE</small></div>
            </div>
            <div className="stage-copy">
              <span className="stage-label">CURRENT STAGE</span>
              <strong>Foundation</strong>
              <span className="stage-progress"><i /></span>
              <span className="stage-caption">Project setup &amp; structure</span>
            </div>
          </div>
          <div className="hero-index" aria-hidden="true">DTLA / SYSTEM OVERVIEW</div>
        </section>

        <section id="capabilities" className="capabilities-section" aria-labelledby="capabilities-title">
          <div className="section-heading">
            <div>
              <div className="eyebrow section-eyebrow"><span className="eyebrow-line" />SYSTEM MODULES</div>
              <h2 id="capabilities-title">Designed for the intersection.</h2>
            </div>
            <p className="section-intro">A modular view of the capabilities planned for this software simulation. Each module will be developed in a later project phase.</p>
          </div>

          <div className="feature-grid">
            {features.map((feature) => <FeatureCard key={feature.number} feature={feature} />)}
          </div>
        </section>

        <section id="workspace" className="workspace" aria-labelledby="workspace-title">
          <div className="workspace-copy">
            <div className="eyebrow workspace-eyebrow"><span className="eyebrow-line" />SIMULATION ENVIRONMENT</div>
            <h2 id="workspace-title">The workspace<br />is being prepared.</h2>
            <p>The interactive intersection will arrive in a later development task. This foundation establishes the interface for what comes next.</p>
            <StatusBadge status="NOT YET IMPLEMENTED" tone="pending" />
          </div>
          <div className="workspace-visual" aria-hidden="true">
            <div className="workspace-visual-label"><span>FIG 01</span><span>CONCEPTUAL LAYOUT</span></div>
            <div className="schematic">
              <div className="schematic-road schematic-road--h" />
              <div className="schematic-road schematic-road--v" />
              <div className="schematic-island" />
              <div className="schematic-lane schematic-lane--h1" />
              <div className="schematic-lane schematic-lane--h2" />
              <div className="schematic-lane schematic-lane--v1" />
              <div className="schematic-lane schematic-lane--v2" />
              <div className="schematic-corner schematic-corner--nw" />
              <div className="schematic-corner schematic-corner--ne" />
              <div className="schematic-corner schematic-corner--sw" />
              <div className="schematic-corner schematic-corner--se" />
              <span className="compass compass--n">N</span>
              <span className="compass compass--e">E</span>
              <span className="compass compass--s">S</span>
              <span className="compass compass--w">W</span>
              <span className="schematic-crosshair schematic-crosshair--one" />
              <span className="schematic-crosshair schematic-crosshair--two" />
            </div>
            <div className="workspace-visual-foot"><span>VIRTUAL INTERSECTION / PREVIEW</span><span>— — —</span></div>
          </div>
        </section>

        <section className="status-section" aria-labelledby="status-title">
          <div className="status-heading">
            <div className="eyebrow"><span className="eyebrow-line" />BUILD STATUS</div>
            <h2 id="status-title">A foundation in progress.</h2>
          </div>
          <div className="status-list">
            <StatusRow number="01" title="Frontend" detail="Dashboard application is running" status="RUNNING" tone="complete" />
            <BackendStatus />
          </div>
        </section>
      </main>

      <footer className="footer">
        <span className="footer-brand">CROSSFLOW<span className="brand-period">.</span> <span>DTLA–01</span></span>
        <span className="footer-note">ACADEMIC SOFTWARE SIMULATION <span>·</span> NO PHYSICAL TRAFFIC CONTROL</span>
        <span className="footer-year">FOUNDATION / 2026</span>
      </footer>
    </div>
  )
}

function StatusRow({ number, title, detail, status, tone }: { number: string; title: string; detail: string; status: string; tone: 'in-progress' | 'complete' | 'pending' }) {
  return (
    <div className="status-row">
      <span className="status-row-number">{number}</span>
      <div className="status-row-copy"><strong>{title}</strong><span>{detail}</span></div>
      <StatusBadge status={status} tone={tone} />
    </div>
  )
}

function IntersectionIcon() {
  return <svg viewBox="0 0 32 32" fill="none"><path d="M11 2h10v9H11zM11 21h10v9H11zM2 11h9v10H2zM21 11h9v10h-9z" stroke="currentColor" strokeWidth="1.5"/><path d="M14 11v3m4 4v3m-7-5H8m16 0h-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
}
function ClockIcon() { return <svg viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="1.5"/><path d="M16 8v8l5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M4.5 6.5 7 4m20.5 2.5L25 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> }
function PulseIcon() { return <svg viewBox="0 0 32 32" fill="none"><path d="M3 17h7l4-9 5 17 4-10h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="1" strokeDasharray="2 4"/></svg> }
function PriorityIcon() { return <svg viewBox="0 0 32 32" fill="none"><path d="M16 3 29 27H3L16 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M16 11v7m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="m23 7 2-2m-16 2L7 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> }
function QueueIcon() { return <svg viewBox="0 0 32 32" fill="none"><path d="M4 7h16M4 16h24M4 25h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="25" cy="7" r="3" stroke="currentColor" strokeWidth="1.5"/><circle cx="26" cy="25" r="3" stroke="currentColor" strokeWidth="1.5"/></svg> }
function ChartIcon() { return <svg viewBox="0 0 32 32" fill="none"><path d="M4 27V5m0 22h25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="m8 21 6-7 5 3 8-10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><circle cx="27" cy="7" r="2" fill="currentColor"/></svg> }
