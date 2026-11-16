import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import BackendStatus from './BackendStatus'

function healthResponse(payload: unknown = { status: 'ok' }, ok = true, status = 200): Response {
  return {
    ok,
    status,
    json: async () => payload,
  } as Response
}

describe('backend health status', () => {
  it('shows a loading state while the initial request is pending', () => {
    vi.stubGlobal('fetch', vi.fn(() => new Promise<Response>(() => {})))

    render(<BackendStatus />)

    expect(screen.getByText('Backend: Checking…')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /checking/i })).toBeDisabled()
  })

  it('shows connected only after a valid health response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(healthResponse()))

    render(<BackendStatus />)

    expect(await screen.findByText('Backend: Connected')).toBeInTheDocument()
    expect(screen.getByText('Integration: Connected')).toBeInTheDocument()
  })

  it('shows disconnected when the backend returns an unsuccessful HTTP response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(healthResponse({}, false, 503)))

    render(<BackendStatus />)

    expect(await screen.findByText('Backend: Disconnected')).toBeInTheDocument()
    expect(screen.getByText('Integration: Disconnected')).toBeInTheDocument()
  })

  it('shows disconnected when the backend is unreachable', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))

    render(<BackendStatus />)

    expect(await screen.findByText('Backend: Disconnected')).toBeInTheDocument()
  })

  it('shows disconnected when the response does not match the health contract', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(healthResponse({ status: 'starting' })))

    render(<BackendStatus />)

    expect(await screen.findByText('Backend: Disconnected')).toBeInTheDocument()
  })

  it('retries and reconnects successfully', async () => {
    const fetchMock = vi.fn()
      .mockRejectedValueOnce(new TypeError('Failed to fetch'))
      .mockResolvedValueOnce(healthResponse())
    vi.stubGlobal('fetch', fetchMock)

    render(<BackendStatus />)
    expect(await screen.findByText('Backend: Disconnected')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /retry/i }))

    expect(await screen.findByText('Backend: Connected')).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('keeps disconnected after a retry fails', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(healthResponse())
      .mockRejectedValueOnce(new TypeError('Failed to fetch'))
    vi.stubGlobal('fetch', fetchMock)

    render(<BackendStatus />)
    expect(await screen.findByText('Backend: Connected')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /retry/i }))
    await waitFor(() => expect(screen.getByText('Backend: Disconnected')).toBeInTheDocument())
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
})
