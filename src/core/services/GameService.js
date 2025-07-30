import { IGameService } from './IGameService.js';
import { Board } from '../entities/Board.js';
import { Score } from '../entities/Score.js';
import { Piece } from '../entities/Piece.js';
import { ScoringService } from './ScoringService.js';
import { GameConfig } from '../../config/GameConfig.js';
import { gameEvents, GAME_EVENTS } from '../../patterns/Observer.js';

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
    this.lockDelayTimer = null;
    this.backToBack = false;
  }

  initializeGame() {
    this.board = new Board(GameConfig.BOARD_WIDTH, GameConfig.BOARD_HEIGHT);
    this.score = new Score();
    this.currentPiece = this.pieceFactory.createRandomPiece();
    this.nextPieces = this.pieceFactory.createNextPieces(GameConfig.NEXT_PIECES_COUNT);
    this.heldPiece = null;
    this.canHold = true;
    this.isPlaying = true;
    this.isPaused = false;
    this.gameOver = false;
    this.lastDropTime = 0;
    this.backToBack = false;
    
    gameEvents.emit(GAME_EVENTS.GAME_INITIALIZED);
  }

  movePiece(direction) {
    if (!this.currentPiece || this.gameOver || this.isPaused) return;

    const strategy = this.movementStrategyFactory.createStrategy(direction);
    const result = strategy.execute(this.currentPiece, this.board.grid);

    if (result !== this.currentPiece) {
      this.currentPiece = result;
      
      if (direction === 'down' && strategy.getSoftDropPoints) {
        const softDropPoints = this.scoringService.calculateSoftDropPoints();
        this.score.addPoints(softDropPoints);
      }
      
      gameEvents.emit(GAME_EVENTS.PIECE_MOVED, { direction, piece: result });
    } else if (direction === 'down') {
      this.placePiece();
    }
  }

  rotatePiece() {
    if (!this.currentPiece || this.gameOver || this.isPaused) return;

    const strategy = this.movementStrategyFactory.createStrategy('rotate');
    const result = strategy.execute(this.currentPiece, this.board.grid);

    if (result !== this.currentPiece) {
      this.currentPiece = result;
      gameEvents.emit(GAME_EVENTS.PIECE_ROTATED, { piece: result });
    }
  }

  placePiece() {
    if (!this.currentPiece) return;

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
      
      if (isTSpin) {
        this.score.addTSpin();
        this.backToBack = true;
        gameEvents.emit(GAME_EVENTS.T_SPIN, { linesCleared });
      } else {
        this.backToBack = false;
      }
      
      gameEvents.emit(GAME_EVENTS.LINE_CLEARED, { linesCleared });
      gameEvents.emit(GAME_EVENTS.SCORE_UPDATED, { points, isTSpin });
    } else {
      this.score.resetCombo();
    }

    this.getNextPiece();
    this.canHold = true;

    if (this.board.isGameOver()) {
      this.gameOver = true;
      gameEvents.emit(GAME_EVENTS.GAME_OVER);
    }
  }

  holdPiece() {
    if (!this.canHold || !this.currentPiece) return;

    const temp = this.heldPiece;
    this.heldPiece = this.currentPiece;
    
    if (temp) {
      this.currentPiece = temp;
    } else {
      this.getNextPiece();
    }
    
    this.canHold = false;
    gameEvents.emit(GAME_EVENTS.PIECE_HELD, { heldPiece: this.heldPiece });
  }

  hardDrop() {
    if (!this.currentPiece || this.gameOver || this.isPaused) return;

    const strategy = this.movementStrategyFactory.createStrategy('hardDrop');
    const result = strategy.execute(this.currentPiece, this.board.grid);
    
    this.currentPiece = result.piece;
    this.score.addPoints(result.dropDistance);
    
          this.placePiece();
      gameEvents.emit(GAME_EVENTS.HARD_DROP, { dropDistance: result.dropDistance });
      gameEvents.emit(GAME_EVENTS.PIECE_MOVED, { direction: 'hardDrop', piece: this.currentPiece });
  }

  updateGame(deltaTime) {
    if (!this.isPlaying || this.gameOver || this.isPaused) return;

    this.lastDropTime += deltaTime;
    
    if (this.lastDropTime >= this.score.getDropTime()) {
      this.movePiece('down');
      this.lastDropTime = 0;
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
      backToBack: this.backToBack
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