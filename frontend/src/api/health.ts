import type { HealthResponse } from '../types/health'

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim()
const apiBaseUrl = (configuredBaseUrl || 'http://localhost:8000').replace(/\/+$/, '')

export async function fetchBackendHealth(signal?: AbortSignal): Promise<HealthResponse> {
  const response = await fetch(`${apiBaseUrl}/api/v1/health`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal,
  })

  if (!response.ok) {
    throw new Error(`Backend health check failed with HTTP ${response.status}.`)
  }

  const payload: unknown = await response.json()
  if (
    typeof payload !== 'object'
    || payload === null
    || !('status' in payload)
    || payload.status !== 'ok'
  ) {
    throw new Error('Backend returned an unexpected health response.')
  }

  return payload as HealthResponse
}
