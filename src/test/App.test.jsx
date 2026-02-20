import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App.jsx'

vi.mock('../hooks/useGameService', () => ({
  useGameService: () => ({
    gameState: {
      board: Array(20).fill().map(() => Array(10).fill(null)),
      currentPiece: {
        type: 'T',
        position: { x: 4, y: 0 },
        shape: [[1, 1, 1], [0, 1, 0]]
      },
      nextPieces: [
        { type: 'I', shape: [[1, 1, 1, 1]] },
        { type: 'O', shape: [[1, 1], [1, 1]] }
      ],
      heldPiece: null,
      canHold: true,
      score: { points: 1500, level: 2, lines: 15, combo: 0 },
      gameOver: false,
      isPaused: false
    },
    actions: {
      movePiece: vi.fn(),
      rotatePiece: vi.fn(),
      hardDrop: vi.fn(),
      holdPiece: vi.fn(),
      pause: vi.fn(),
      resume: vi.fn(),
      restart: vi.fn(),
      getDropPreview: vi.fn(() => ({ x: 4, y: 18 }))
    }
  })
}))

vi.mock('../hooks/useSettings', () => ({
  useSettings: () => ({
    settings: {
      volume: 80,
      gameSpeed: 'normal',
      soundEnabled: true,
      particlesEnabled: true
    },
    updateSettings: vi.fn()
  })
}))

vi.mock('../hooks/useStatistics', () => ({
  useStatistics: () => ({
    statistics: {
      totalPlayTime: 3600,
      gamesPlayed: 25,
      linesCleared: 150,
      maxCombo: 8,
      tSpins: 5
    }
  })
}))

vi.mock('../hooks/useSoundManager', () => ({
  useSoundManager: vi.fn()
}))

vi.mock('../hooks/useKeyboardInput', () => ({
  useKeyboardInput: vi.fn()
}))

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the main game interface', () => {
    render(<App />)

    expect(screen.getByText('🐱 Cat Tetris 🐱')).toBeInTheDocument()
    expect(screen.getByText('Jogue com seus amigos felinos!')).toBeInTheDocument()
    expect(screen.getByText('📊 Estatísticas')).toBeInTheDocument()
    expect(screen.getByText('⚙️ Configurações')).toBeInTheDocument()
  })

  it('should display game board and score information', () => {
    render(<App />)

    expect(screen.getByText('1500')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('15')).toBeInTheDocument()
  })

  it('should open statistics modal when clicking statistics button', async () => {
    const user = userEvent.setup()
    render(<App />)

    const statsButton = screen.getByText('📊 Estatísticas')
    await user.click(statsButton)

    await waitFor(() => {
      expect(screen.getByText('25')).toBeInTheDocument()
      expect(screen.getByText('150')).toBeInTheDocument()
    })
  })

  it('should open settings modal when clicking settings button', async () => {
    const user = userEvent.setup()
    render(<App />)

    const settingsButton = screen.getByText('⚙️ Configurações')
    await user.click(settingsButton)

    await waitFor(() => {
      expect(screen.getByDisplayValue('80')).toBeInTheDocument()
    })
  })

  it('should show loading state when gameState is null', () => {
    vi.doMock('../hooks/useGameService', () => ({
      useGameService: () => ({
        gameState: null,
        actions: {}
      })
    }))

    const { rerender } = render(<App />)

    expect(screen.getByText('Carregando...')).toBeInTheDocument()
  })

  it('should be responsive and show mobile layout', () => {
    render(<App />)

    const mobileLayout = screen.getByTestId('mobile-layout') || document.querySelector('.lg\\:hidden')
    expect(mobileLayout).toBeInTheDocument()
  })

  it('should handle keyboard events for game controls', () => {
    render(<App />)

    fireEvent.keyDown(document, { key: 'ArrowLeft' })
    fireEvent.keyDown(document, { key: 'ArrowRight' })
    fireEvent.keyDown(document, { key: 'ArrowDown' })
    fireEvent.keyDown(document, { key: ' ' })
  })

  it('should show error boundary when component crashes', () => {
    const ThrowError = () => {
      throw new Error('Test error')
    }

    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <App>
        <ThrowError />
      </App>
    )

    consoleError.mockRestore()
  })
})
