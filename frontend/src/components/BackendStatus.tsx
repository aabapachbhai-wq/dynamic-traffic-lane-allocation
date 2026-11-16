import { useBackendHealth } from '../hooks/useBackendHealth'
import StatusBadge from './StatusBadge'

export default function BackendStatus() {
  const { state, retry } = useBackendHealth()
  const connected = state === 'connected'
  const loading = state === 'loading'

  return (
    <div className="backend-live" aria-live="polite" aria-busy={loading}>
      <div className="status-row">
        <span className="status-row-number">02</span>
        <div className="status-row-copy">
          <strong>Backend: {loading ? 'Checking…' : connected ? 'Connected' : 'Disconnected'}</strong>
          <span>{loading ? 'Checking the health endpoint' : connected ? 'Health endpoint responded successfully' : 'Health endpoint could not be reached'}</span>
        </div>
        <div className="backend-health-actions">
          <StatusBadge status={loading ? 'CHECKING' : connected ? 'CONNECTED' : 'DISCONNECTED'} tone={loading ? 'planned' : connected ? 'complete' : 'pending'} dot={!loading} />
          <button className="retry-button" type="button" onClick={retry} disabled={loading}>
            <span aria-hidden="true">↻</span> {loading ? 'Checking' : 'Retry'}
          </button>
        </div>
      </div>
      <div className="status-row">
        <span className="status-row-number">03</span>
        <div className="status-row-copy">
          <strong>Integration: {loading ? 'Checking…' : connected ? 'Connected' : 'Disconnected'}</strong>
          <span>{loading ? 'Waiting for the backend health check' : connected ? 'Frontend can reach the backend' : 'Frontend cannot reach the backend'}</span>
        </div>
        <StatusBadge status={loading ? 'CHECKING' : connected ? 'CONNECTED' : 'DISCONNECTED'} tone={loading ? 'planned' : connected ? 'complete' : 'pending'} dot={!loading} />
      </div>
    </div>
  )
}
