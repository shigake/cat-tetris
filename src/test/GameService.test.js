import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GameService } from '../core/services/GameService.js'

vi.mock('../patterns/Factory.js', () => ({
  PieceFactory: class MockPieceFactory {
    generateRandomPiece() {
      return {
        type: 'T',
        position: { x: 4, y: 0 },
        shape: [[1, 1, 1], [0, 1, 0]],
        color: '#9333ea',
        emoji: '🟣',
        move: vi.fn((dx, dy) => ({
          type: 'T',
          position: { x: 4 + dx, y: 0 + dy },
          shape: [[1, 1, 1], [0, 1, 0]],
          color: '#9333ea',
          emoji: '🟣'
        })),
        rotate: vi.fn(() => ({
          type: 'T',
          position: { x: 4, y: 0 },
          shape: [[0, 1], [1, 1], [0, 1]],
          color: '#9333ea',
          emoji: '🟣'
        }))
      }
    }
    
    generateNextPieces() {
      return [
        { type: 'I', shape: [[1, 1, 1, 1]] },
        { type: 'O', shape: [[1, 1], [1, 1]] },
        { type: 'L', shape: [[1, 0], [1, 0], [1, 1]] }
      ]
    }
  },
  
  MovementStrategyFactory: class MockMovementStrategyFactory {
    createStrategy(type) {
      return {
        execute: vi.fn((piece, board) => {
          if (type === 'down') {
            return piece.move(0, 1)
          }
          if (type === 'left') {
            return piece.move(-1, 0)
          }
          if (type === 'right') {
            return piece.move(1, 0)
          }
          if (type === 'rotate') {
            return piece.rotate()
          }
          return piece
        })
      }
    }
  }
}))

vi.mock('../core/entities/Board.js', () => ({
  Board: class MockBoard {
    constructor() {
      this.grid = Array(20).fill().map(() => Array(10).fill(null))
    }
    
    isValidMove() { return true }
    placePiece() { return true }
    clearLines() { return { board: this.grid, linesCleared: 1 } }
    checkGameOver() { return false }
  }
}))

vi.mock('../patterns/Observer.js', () => ({
  gameEvents: {
    emit: vi.fn(),
    on: vi.fn(),
    off: vi.fn()
  },
  GAME_EVENTS: {
    GAME_START: 'gameStart',
    GAME_OVER: 'gameOver',
    PIECE_MOVED: 'pieceMoved',
    LINE_CLEARED: 'lineCleared',
    SCORE_UPDATED: 'scoreUpdated'
  }
}))

describe('GameService', () => {
  let gameService
  let mockPieceFactory
  let mockMovementStrategyFactory
  let mockRepository
  let mockScoringService

  beforeEach(() => {
    mockPieceFactory = {
      generateRandomPiece: vi.fn().mockReturnValue({
        type: 'T',
        position: { x: 4, y: 0 },
        shape: [[1, 1, 1], [0, 1, 0]],
        move: vi.fn(),
        rotate: vi.fn()
      }),
      generateNextPieces: vi.fn().mockReturnValue([
        { type: 'I' }, { type: 'O' }, { type: 'L' }
      ])
    }

    mockMovementStrategyFactory = {
      createStrategy: vi.fn().mockReturnValue({
        execute: vi.fn((piece) => piece)
      })
    }

    mockRepository = {
      saveGame: vi.fn(),
      loadGame: vi.fn()
    }

    mockScoringService = {
      calculateScore: vi.fn().mockReturnValue(100),
      updateScore: vi.fn()
    }

    gameService = new GameService(
      mockPieceFactory,
      mockMovementStrategyFactory,
      mockRepository,
      mockScoringService
    )
  })

  describe('Game Initialization', () => {
    it('should initialize game with correct initial state', () => {
      gameService.initializeGame()
      
      const state = gameService.getGameState()
      
      expect(state.gameOver).toBe(false)
      expect(state.isPaused).toBe(false)
      expect(state.currentPiece).toBeDefined()
      expect(state.nextPieces).toHaveLength(3)
      expect(state.board).toBeDefined()
      expect(mockPieceFactory.generateRandomPiece).toHaveBeenCalled()
      expect(mockPieceFactory.generateNextPieces).toHaveBeenCalled()
    })

    it('should start with empty held piece', () => {
      gameService.initializeGame()
      
      const state = gameService.getGameState()
      expect(state.heldPiece).toBeNull()
      expect(state.canHold).toBe(true)
    })

    it('should initialize score correctly', () => {
      gameService.initializeGame()
      
      const state = gameService.getGameState()
      expect(state.score).toEqual({
        points: 0,
        level: 1,
        lines: 0,
        combo: 0
      })
    })
  })

  describe('Piece Movement', () => {
    beforeEach(() => {
      gameService.initializeGame()
    })

    it('should move piece left successfully', () => {
      const initialPiece = gameService.getGameState().currentPiece
      gameService.movePiece('left')
      
      expect(mockMovementStrategyFactory.createStrategy).toHaveBeenCalledWith('left')
    })

    it('should move piece right successfully', () => {
      gameService.movePiece('right')
      
      expect(mockMovementStrategyFactory.createStrategy).toHaveBeenCalledWith('right')
    })

    it('should move piece down successfully', () => {
      gameService.movePiece('down')
      
      expect(mockMovementStrategyFactory.createStrategy).toHaveBeenCalledWith('down')
    })

    it('should not move piece when game is paused', () => {
      gameService.pause()
      gameService.movePiece('left')
      
      expect(mockMovementStrategyFactory.createStrategy).not.toHaveBeenCalled()
    })

    it('should not move piece when game is over', () => {
      gameService.gameOver = true
      gameService.movePiece('left')
      
      expect(mockMovementStrategyFactory.createStrategy).not.toHaveBeenCalled()
    })
  })

  describe('Piece Rotation', () => {
    beforeEach(() => {
      gameService.initializeGame()
    })

    it('should rotate piece successfully', () => {
      gameService.rotatePiece()
      
      expect(mockMovementStrategyFactory.createStrategy).toHaveBeenCalledWith('rotate')
    })

    it('should not rotate when game is paused', () => {
      gameService.pause()
      gameService.rotatePiece()
      
      expect(mockMovementStrategyFactory.createStrategy).not.toHaveBeenCalled()
    })
  })

  describe('Hold Functionality', () => {
    beforeEach(() => {
      gameService.initializeGame()
    })

    it('should hold piece when no piece is held', () => {
      const initialPiece = gameService.getGameState().currentPiece
      gameService.holdPiece()
      
      const state = gameService.getGameState()
      expect(state.heldPiece).toBeDefined()
      expect(state.canHold).toBe(false)
    })

    it('should swap held piece with current piece', () => {
      gameService.holdPiece()
      const firstHeld = gameService.getGameState().heldPiece
      
      gameService.canHold = true
      gameService.holdPiece()
      
      const state = gameService.getGameState()
      expect(state.currentPiece).toBeDefined()
    })

    it('should not hold when canHold is false', () => {
      gameService.holdPiece()
      gameService.holdPiece()
      
      expect(gameService.getGameState().canHold).toBe(false)
    })
  })

  describe('Hard Drop', () => {
    beforeEach(() => {
      gameService.initializeGame()
    })

    it('should hard drop piece to bottom', () => {
      gameService.hardDrop()
      
      expect(mockMovementStrategyFactory.createStrategy).toHaveBeenCalledWith('hardDrop')
    })

    it('should place piece after hard drop', () => {
      gameService.hardDrop()
      
      expect(gameService.getGameState().currentPiece).toBeDefined()
    })
  })

  describe('Game State Management', () => {
    beforeEach(() => {
      gameService.initializeGame()
    })

    it('should pause and resume game', () => {
      gameService.pause()
      expect(gameService.getGameState().isPaused).toBe(true)
      
      gameService.resume()
      expect(gameService.getGameState().isPaused).toBe(false)
    })

    it('should restart game correctly', () => {
      gameService.gameOver = true
      gameService.restart()
      
      const state = gameService.getGameState()
      expect(state.gameOver).toBe(false)
      expect(state.score.points).toBe(0)
      expect(state.currentPiece).toBeDefined()
    })
  })

  describe('Game Loop', () => {
    beforeEach(() => {
      gameService.initializeGame()
    })

    it('should update game correctly', () => {
      const deltaTime = 1000
      gameService.updateGame(deltaTime)
      
      expect(gameService.dropTimer).toBeGreaterThan(0)
    })

    it('should auto-drop piece when timer expires', () => {
      gameService.dropTimer = 1500
      gameService.updateGame(100)
      
      expect(mockMovementStrategyFactory.createStrategy).toHaveBeenCalledWith('down')
    })

    it('should not update when game is paused', () => {
      gameService.pause()
      const initialTimer = gameService.dropTimer
      
      gameService.updateGame(100)
      
      expect(gameService.dropTimer).toBe(initialTimer)
    })
  })

  describe('Score and Level System', () => {
    beforeEach(() => {
      gameService.initializeGame()
    })

    it('should calculate score correctly when lines cleared', () => {
      gameService.score.lines = 10
      gameService.calculateScore(2, false, false)
      
      expect(mockScoringService.calculateScore).toHaveBeenCalled()
    })

    it('should increase level after clearing lines', () => {
      gameService.score.lines = 9
      gameService.clearLines([18, 19])
      
      expect(gameService.score.level).toBe(2)
    })
  })

  describe('Drop Preview', () => {
    beforeEach(() => {
      gameService.initializeGame()
    })

    it('should return drop preview position', () => {
      const preview = gameService.getDropPreview()
      
      expect(preview).toBeDefined()
      expect(typeof preview.x).toBe('number')
      expect(typeof preview.y).toBe('number')
    })
  })
}) 