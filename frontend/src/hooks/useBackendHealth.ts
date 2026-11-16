import { useCallback, useEffect, useState } from 'react'
import { fetchBackendHealth } from '../api/health'
import type { BackendHealthState } from '../types/health'

export function useBackendHealth() {
  const [state, setState] = useState<BackendHealthState>('loading')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setState('loading')

    fetchBackendHealth(controller.signal)
      .then(() => {
        if (!controller.signal.aborted) setState('connected')
      })
      .catch(() => {
        if (!controller.signal.aborted) setState('disconnected')
      })

    return () => controller.abort()
  }, [attempt])

  const retry = useCallback(() => {
    setState('loading')
    setAttempt((current) => current + 1)
  }, [])

  return { state, retry }
}
