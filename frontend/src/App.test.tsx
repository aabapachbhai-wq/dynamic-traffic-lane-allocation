import { render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import App from './App'

describe('application foundation', () => {
  it('renders the project title and overview', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: /dynamic traffic lane allocation/i })).toBeInTheDocument()
    expect(screen.getByText(/academic exploration of demand-aware signal control/i)).toBeInTheDocument()
  })

  it('shows all planned feature cards and their statuses', () => {
    render(<App />)

    const featureSection = screen.getAllByRole('heading', { name: /designed for the intersection/i })[0].closest('section')
    expect(featureSection).not.toBeNull()
    const featureTitles = [
      'Four-Way Intersection',
      'Fixed-Time Control',
      'Adaptive Signal Control',
      'Emergency Priority',
      'Queue Monitoring',
      'Performance Analytics',
    ]

    featureTitles.forEach((title) => {
      const card = screen.getByRole('heading', { name: title }).closest('article')
      expect(card).not.toBeNull()
      expect(within(card as HTMLElement).getByText('PLANNED')).toBeInTheDocument()
    })
    expect(within(featureSection as HTMLElement).getAllByText('PLANNED')).toHaveLength(6)
  })

  it('displays the simulation workspace placeholder and pending status', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: /the workspace is being prepared/i })).toBeInTheDocument()
    expect(screen.getByText(/interactive intersection will arrive in a later development task/i)).toBeInTheDocument()
    expect(screen.getByText('NOT YET IMPLEMENTED')).toBeInTheDocument()
  })

  it('shows the frontend running and the live integration status', async () => {
    render(<App />)

    expect(screen.getByText('Frontend')).toBeInTheDocument()
    expect(screen.getByText('RUNNING')).toBeInTheDocument()
    expect(await screen.findByText('Backend: Connected')).toBeInTheDocument()
    expect(screen.getByText('Integration: Connected')).toBeInTheDocument()
    expect(vi.mocked(fetch)).toHaveBeenCalledWith(
      'http://localhost:8000/api/v1/health',
      expect.objectContaining({ method: 'GET', signal: expect.any(AbortSignal) }),
    )
  })
})
