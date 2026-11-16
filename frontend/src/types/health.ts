export interface HealthResponse {
  status: 'ok'
}

export type BackendHealthState = 'loading' | 'connected' | 'disconnected'
