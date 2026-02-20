import { IGameService } from './IGameService.js';
import { Board } from '../entities/Board.js';
import { Score } from '../entities/Score.js';
import { Piece } from '../entities/Piece.js';
import { ScoringService } from './ScoringService.js';
import { GameConfig } from '../../config/GameConfig.js';
import { gameEvents, GAME_EVENTS } from '../../patterns/Observer.js';
import { resetBag, PIECES } from '../../utils/PieceGenerator.js';
import { errorLogger } from '../../services/ErrorLogger.js';

export class GameService extends IGameService {
  constructor(
    pieceFactory,
    movementStrategyFactory,
    gameRepository,
    scoringService = new ScoringService()
  ) {
    super();
    this.pieceFactory = pieceFactory;
    this.movementStrategyFactory = movementStrategyFactory;
    this.gameRepository = gameRepository;
    this.scoringService = scoringService;
    
    this.board = new Board(GameConfig.BOARD_WIDTH, GameConfig.BOARD_HEIGHT);
    this.score = new Score();
    this.currentPiece = null;
    this.nextPieces = [];
    this.heldPiece = null;
    this.canHold = true;
    this.isPlaying = false;
    this.isPaused = false;
    this.gameOver = false;
    this.lastDropTime = 0;
    this.backToBack = false;
    
    // Lock delay state (standard Tetris guideline)
    this._lockDelayActive = false;   // Is lock delay timer running?
    this._lockDelayElapsed = 0;      // ms elapsed since grounded
    this._lockDelayResets = 0;       // How many times timer was reset (max 15)
    this._lockDelayMax = GameConfig.LOCK_DELAY; // 500ms
    this._lockDelayMaxResets = 15;
    
    // Game mode support
    this.gameMode = null;
    this.modeTimeElapsed = 0;
    this.modeStartTime = 0;
  }

  initializeGame() {
    // Reset piece bag for fresh randomization
    resetBag();
    
    this.board = new Board(GameConfig.BOARD_WIDTH, GameConfig.BOARD_HEIGHT);
    this.score = new Score();
    this.currentPiece = this.pieceFactory.createRandomPiece();
    this.nextPieces = this.pieceFactory.createNextPieces(GameConfig.NEXT_PIECES_COUNT);
    this.heldPiece = null;
    this.canHold = true;
    this.isPlaying = false;
    this.isPaused = false;
    this.gameOver = false;
    this.lastDropTime = 0;
    this.backToBack = false;
    this._lockDelayActive = false;
    this._lockDelayElapsed = 0;
    this._lockDelayResets = 0;
    this.modeTimeElapsed = 0;
    this.modeStartTime = Date.now();
    
    // Apply game mode settings
    this.applyGameMode();
    
    errorLogger.logInfo('GameService', 'initializeGame', 'Game initialized', {
      mode: this.gameMode?.id || 'classic',
      startLevel: this.score.level,
      fixedLevel: this.score._fixedLevel
    });
    
    gameEvents.emit(GAME_EVENTS.GAME_INITIALIZED);
  }

  setGameMode(mode) {
    this.gameMode = mode;
  }

  applyGameMode() {
    if (!this.gameMode || !this.gameMode.rules) return;
    
    const rules = this.gameMode.rules;
    
    // Apply start level
    if (rules.startLevel) {
      this.score.level = rules.startLevel;
    }
    
    // Apply fixed level (for speed)
    if (rules.fixedLevel) {
      this.score._fixedLevel = rules.fixedLevel;
    } else {
      this.score._fixedLevel = null;
    }
    
    // Store mode rules for runtime checks
    this._modeRules = rules;
  }

  movePiece(direction) {
    if (!this.currentPiece || this.gameOver || this.isPaused) return;

    try {
      const strategy = this.movementStrategyFactory.createStrategy(direction);
      const result = strategy.execute(this.currentPiece, this.board.grid);

      if (result !== this.currentPiece) {
        this.currentPiece = result;
        
        if (direction === 'down') {
          // Successful soft drop — piece moved down, cancel any active lock delay
          this._lockDelayActive = false;
          this._lockDelayElapsed = 0;
          // Reset gravity timer on soft drop (standard Tetris behavior)
          this.lastDropTime = 0;
          
          if (strategy.getSoftDropPoints) {
            const softDropPoints = this.scoringService.calculateSoftDropPoints();
            this.score.addPoints(softDropPoints);
          }
        } else if (direction === 'left' || direction === 'right') {
          // Horizontal move during lock delay → reset timer (if allowed)
          this._resetLockDelay();
          // If piece slid off a ledge and is no longer grounded, cancel lock delay
          this._checkUngrounded();
        }
        
        gameEvents.emit(GAME_EVENTS.PIECE_MOVED, { direction, piece: result });
      } else if (direction === 'down') {
        // Piece can't move down — start lock delay instead of instant lock
        if (!this._lockDelayActive) {
          this._lockDelayActive = true;
          this._lockDelayElapsed = 0;
          this._lockDelayResets = 0;
        }
        // Don't placePiece() yet! Lock delay timer in updateGame() will handle it.
      }
    } catch (error) {
      errorLogger.logError('GameService', 'movePiece', error.message, {
        direction,
        pieceType: this.currentPiece?.type,
        piecePos: this.currentPiece?.position,
        stack: error.stack
      });
    }
  }

  rotatePiece() {
    if (!this.currentPiece || this.gameOver || this.isPaused) return;

    try {
      const strategy = this.movementStrategyFactory.createStrategy('rotate');
      const result = strategy.execute(this.currentPiece, this.board.grid);

      if (result !== this.currentPiece) {
        this.currentPiece = result;
        // Rotation during lock delay → reset timer (if allowed)
        this._resetLockDelay();
        // If piece is no longer grounded (e.g. kick moved it up), cancel lock delay
        this._checkUngrounded();
        gameEvents.emit(GAME_EVENTS.PIECE_ROTATED, { piece: result });
      }
    } catch (error) {
      errorLogger.logError('GameService', 'rotatePiece', error.message, {
        pieceType: this.currentPiece?.type,
        piecePos: this.currentPiece?.position,
        stack: error.stack
      });
    }
  }

  rotatePieceLeft() {
    if (!this.currentPiece || this.gameOver || this.isPaused) return;

    const strategy = this.movementStrategyFactory.createStrategy('rotateLeft');
    const result = strategy.execute(this.currentPiece, this.board.grid);

    if (result !== this.currentPiece) {
      this.currentPiece = result;
      // Rotation during lock delay → reset timer (if allowed)
      this._resetLockDelay();
      // If piece is no longer grounded (e.g. kick moved it up), cancel lock delay
      this._checkUngrounded();
      gameEvents.emit(GAME_EVENTS.PIECE_ROTATED, { piece: result });
    }
  }

  placePiece() {
    if (!this.currentPiece) return;

    // Clear lock delay state
    this._lockDelayActive = false;
    this._lockDelayElapsed = 0;
    this._lockDelayResets = 0;

    this.board.placePiece(this.currentPiece);
    const linesCleared = this.board.clearLines();
    
    if (linesCleared > 0) {
      this.score.addLines(linesCleared);
      this.score.incrementCombo();
      
      const isTSpin = this.currentPiece.isTSpin;
      const points = this.scoringService.calculateScore(
        linesCleared,
        this.score.getLevel(),
        this.score.combo,
        isTSpin,
        this.backToBack
      );
      
      this.score.addPoints(points);
      
      if (isTSpin || linesCleared === 4) {
        // Back-to-Back chain (Tetris ou T-Spin)
        if (this.backToBack) {
          gameEvents.emit(GAME_EVENTS.BACK_TO_BACK);
        }
        this.backToBack = true;
        
        if (isTSpin) {
          this.score.addTSpin();
          gameEvents.emit(GAME_EVENTS.T_SPIN, { linesCleared });
        }
      } else {
        this.backToBack = false;
      }
      
      gameEvents.emit(GAME_EVENTS.LINE_CLEARED, { linesCleared });
      gameEvents.emit(GAME_EVENTS.SCORE_UPDATED, { 
        score: this.score.points, 
        level: this.score.level, 
        combo: this.score.combo,
        points, 
        isTSpin 
      });
    } else {
      this.score.resetCombo();
    }

    // Emit piece placed event (for missions tracking)
    gameEvents.emit(GAME_EVENTS.PIECE_PLACED, { 
      piece: this.currentPiece, 
      linesCleared 
    });

    this.getNextPiece();
    this.canHold = true;

    // Check Sprint mode line goal
    if (this._modeRules?.lineGoal && this.score.lines >= this._modeRules.lineGoal) {
      this.gameOver = true;
      gameEvents.emit(GAME_EVENTS.GAME_OVER);
      return;
    }

    // Check game over (skip for Zen and other no-game-over modes)
    if (this._modeRules?.gameOver === false) {
      // No game over in this mode - if board is full, clear bottom rows
      if (this.board.isGameOver()) {
        // In Zen mode, clear top 4 rows to keep playing
        for (let y = 0; y < 4; y++) {
          for (let x = 0; x < this.board.width; x++) {
            this.board.clearCell(x, y);
          }
        }
      }
    } else if (this.board.isGameOver()) {
      this.gameOver = true;
      gameEvents.emit(GAME_EVENTS.GAME_OVER);
    }
  }

  holdPiece() {
    if (!this.canHold || !this.currentPiece) return;

    // Cancel lock delay when holding
    this._lockDelayActive = false;
    this._lockDelayElapsed = 0;
    this._lockDelayResets = 0;

    try {
      const temp = this.heldPiece;
      // Store held piece with original rotation (rotation state 0)
      const currentType = this.currentPiece.type;
      const originalConfig = PIECES[currentType];
      this.heldPiece = new Piece(
        currentType,
        originalConfig.shape,
        originalConfig.color,
        originalConfig.emoji,
        { x: 3, y: 0 },
        false,
        0
      );
      
      if (temp) {
        // Restore from hold with original shape at spawn position
        const spawnPos = temp.type === 'I' ? { x: 3, y: -2 } : { x: 3, y: 0 };
        const heldConfig = PIECES[temp.type];
        this.currentPiece = new Piece(
          temp.type,
          heldConfig.shape,
          heldConfig.color,
          heldConfig.emoji,
          spawnPos,
          false,
          0
        );
      } else {
        this.getNextPiece();
      }
      
      this.canHold = false;
      gameEvents.emit(GAME_EVENTS.PIECE_HELD, { heldPiece: this.heldPiece });
    } catch (error) {
      errorLogger.logError('GameService', 'holdPiece', error.message, {
        currentPieceType: this.currentPiece?.type,
        heldPieceType: this.heldPiece?.type,
        stack: error.stack
      });
    }
  }

  hardDrop() {
    if (!this.currentPiece || this.gameOver || this.isPaused) return;

    try {
      // Hard drop always locks immediately — bypass lock delay
      this._lockDelayActive = false;
      this._lockDelayElapsed = 0;
      
      const strategy = this.movementStrategyFactory.createStrategy('hardDrop');
      const result = strategy.execute(this.currentPiece, this.board.grid);
      
      this.currentPiece = result.piece;
      this.score.addPoints(result.dropDistance);
      
      const droppedPiece = this.currentPiece;
      gameEvents.emit(GAME_EVENTS.HARD_DROP, { dropDistance: result.dropDistance });
      gameEvents.emit(GAME_EVENTS.PIECE_MOVED, { direction: 'hardDrop', piece: droppedPiece });
      this.placePiece();
    } catch (error) {
      errorLogger.logError('GameService', 'hardDrop', error.message, {
        pieceType: this.currentPiece?.type,
        piecePos: this.currentPiece?.position,
        stack: error.stack
      });
    }
  }

  updateGame(deltaTime) {
    if (!this.isPlaying || this.gameOver || this.isPaused) return;

    // Check time limit for Ultra mode
    if (this._modeRules?.timeLimit) {
      this.modeTimeElapsed = (Date.now() - this.modeStartTime) / 1000;
      if (this.modeTimeElapsed >= this._modeRules.timeLimit) {
        this.gameOver = true;
        gameEvents.emit(GAME_EVENTS.GAME_OVER);
        return;
      }
    }

    // ── Lock delay timer ──
    if (this._lockDelayActive) {
      this._lockDelayElapsed += deltaTime;
      if (this._lockDelayElapsed >= this._lockDelayMax) {
        // Lock delay expired → place piece
        this._lockDelayActive = false;
        this._lockDelayElapsed = 0;
        this.placePiece();
        this.lastDropTime = 0;
        return;
      }
      // During lock delay, gravity doesn't push the piece down
      // (the piece is already grounded)
      return;
    }

    // ── Normal gravity ──
    this.lastDropTime += deltaTime;
    if (this.lastDropTime >= this.score.getDropTime()) {
      this.movePiece('down');
      this.lastDropTime = 0;
    }
  }

  /**
   * Reset lock delay timer (called on successful rotate/move while grounded).
   * Standard Tetris allows max 15 resets to prevent infinite stalling.
   */
  _resetLockDelay() {
    if (this._lockDelayActive && this._lockDelayResets < this._lockDelayMaxResets) {
      this._lockDelayElapsed = 0;
      this._lockDelayResets++;
    }
  }

  /**
   * Check if the current piece is no longer grounded (can move down).
   * If so, cancel lock delay — piece is floating again.
   */
  _checkUngrounded() {
    if (!this._lockDelayActive || !this.currentPiece) return;
    const canDown = this.board.canPlacePiece(this.currentPiece.move(0, 1));
    if (canDown) {
      this._lockDelayActive = false;
      this._lockDelayElapsed = 0;
      this._lockDelayResets = 0;
    }
  }

  pause() {
    this.isPaused = true;
    gameEvents.emit(GAME_EVENTS.GAME_PAUSED);
  }

  resume() {
    this.isPaused = false;
    this.isPlaying = true;
    gameEvents.emit(GAME_EVENTS.GAME_RESUMED);
  }

  restart() {
    this.initializeGame();
    this.isPlaying = true;
    this.isPaused = false;
    this.modeStartTime = Date.now();
  }

  getDropPreview() {
    if (!this.currentPiece) return null;

    let previewPiece = this.currentPiece;
    let attempts = 0;
    const maxAttempts = 20;

    while (attempts < maxAttempts && this.board.canPlacePiece(previewPiece.move(0, 1))) {
      previewPiece = previewPiece.move(0, 1);
      attempts++;
    }
    
    return previewPiece;
  }

  getNextPiece() {
    const nextPiece = this.nextPieces.shift();
    this.nextPieces.push(this.pieceFactory.createRandomPiece());
    this.currentPiece = nextPiece;
  }

  getGameState() {
    return {
      board: this.board.getBoardState(),
      currentPiece: this.currentPiece,
      nextPieces: this.nextPieces,
      heldPiece: this.heldPiece,
      canHold: this.canHold,
      score: this.score.toJSON(),
      isPlaying: this.isPlaying,
      isPaused: this.isPaused,
      gameOver: this.gameOver,
      backToBack: this.backToBack,
      gameMode: this.gameMode,
      modeTimeElapsed: this._modeRules?.timeLimit 
        ? Math.max(0, this._modeRules.timeLimit - (Date.now() - this.modeStartTime) / 1000)
        : null
    };
  }

  setGameState(state) {
    this.board.setBoardState(state.board);
    this.currentPiece = state.currentPiece;
    this.nextPieces = state.nextPieces;
    this.heldPiece = state.heldPiece;
    this.canHold = state.canHold;
    this.isPlaying = state.isPlaying;
    this.isPaused = state.isPaused;
    this.gameOver = state.gameOver;
    this.backToBack = state.backToBack;
    
    Object.assign(this.score, state.score);
  }
} 