import { IGameService } from './IGameService.js';
import { Board } from '../entities/Board.js';
import { Score } from '../entities/Score.js';
import { Piece } from '../entities/Piece.js';
import { ScoringService } from './ScoringService.js';
import { GameConfig } from '../../config/GameConfig.js';
import { gameEvents, GAME_EVENTS } from '../../patterns/Observer.js';
import { PIECES } from '../../utils/PieceGenerator.js';
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

    this._lockDelayActive = false;
    this._lockDelayElapsed = 0;
    this._lockDelayResets = 0;
    this._lockDelayMax = GameConfig.LOCK_DELAY;
    this._lockDelayMaxResets = 15;

    this.gameMode = null;
    this.modeTimeElapsed = 0;
    this.modeStartTime = 0;

    this.pendingGarbage = 0;
    this._lastAttack = 0;
    this._dirty = true;
    this._cachedState = null;
  }

  _markDirty() {
    this._dirty = true;
    this._cachedState = null;
  }

  get isDirty() {
    return this._dirty;
  }

  clearDirty() {
    this._dirty = false;
  }

  initializeGame() {

    this.pieceFactory.resetBag();

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
    this.pendingGarbage = 0;
    this._lastAttack = 0;

    this.applyGameMode();

    errorLogger.logInfo('GameService', 'initializeGame', 'Game initialized', {
      mode: this.gameMode?.id || 'classic',
      startLevel: this.score.level,
      fixedLevel: this.score._fixedLevel
    });

    gameEvents.emit(GAME_EVENTS.GAME_INITIALIZED);
    this._markDirty();
  }

  setGameMode(mode) {
    this.gameMode = mode;
  }

  applyGameMode() {
    if (!this.gameMode || !this.gameMode.rules) return;

    const rules = this.gameMode.rules;

    if (rules.startLevel) {
      this.score.level = rules.startLevel;
    }

    if (rules.fixedLevel) {
      this.score._fixedLevel = rules.fixedLevel;
    } else {
      this.score._fixedLevel = null;
    }

    this._modeRules = rules;
  }

  movePiece(direction) {
    if (!this.currentPiece || this.gameOver || this.isPaused) return;

    try {
      const strategy = this.movementStrategyFactory.createStrategy(direction);
      const result = strategy.execute(this.currentPiece, this.board.grid);

      if (result !== this.currentPiece) {
        this.currentPiece = result;
        this._markDirty();

        if (direction === 'down') {
          this._lockDelayActive = false;
          this._lockDelayElapsed = 0;
          this.lastDropTime = 0;

          if (strategy.getSoftDropPoints) {
            const softDropPoints = this.scoringService.calculateSoftDropPoints();
            this.score.addPoints(softDropPoints);
          }
        } else if (direction === 'left' || direction === 'right') {
          this._resetLockDelay();
          this._checkUngrounded();
        }

        gameEvents.emit(GAME_EVENTS.PIECE_MOVED, { direction, piece: result });
      } else if (direction === 'down') {
        this._markDirty();
        if (!this._lockDelayActive) {
          this._lockDelayActive = true;
          this._lockDelayElapsed = 0;
          this._lockDelayResets = 0;
        }
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
        this._markDirty();

        this._resetLockDelay();

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
      this._markDirty();

      this._resetLockDelay();

      this._checkUngrounded();
      gameEvents.emit(GAME_EVENTS.PIECE_ROTATED, { piece: result });
    }
  }

  placePiece() {
    if (!this.currentPiece) return;
    this._markDirty();

    this._lockDelayActive = false;
    this._lockDelayElapsed = 0;
    this._lockDelayResets = 0;
    this._lastAttack = 0;

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

      this._lastAttack = this._calculateAttack(linesCleared, isTSpin, this.score.combo, this.backToBack);

      if (this._lastAttack > 0 && this.pendingGarbage > 0) {
        const cancelled = Math.min(this._lastAttack, this.pendingGarbage);
        this._lastAttack -= cancelled;
        this.pendingGarbage -= cancelled;
      }
    } else {
      this.score.resetCombo();
    }

    gameEvents.emit(GAME_EVENTS.PIECE_PLACED, {
      piece: this.currentPiece,
      linesCleared
    });

    if (this.pendingGarbage > 0) {
      const overflow = this.board.addGarbageLines(this.pendingGarbage);
      this.pendingGarbage = 0;
      if (overflow && this.board.isGameOver()) {
        this.gameOver = true;
        gameEvents.emit(GAME_EVENTS.GAME_OVER);
        return;
      }
    }

    this.getNextPiece();
    this.canHold = true;

    if (this._modeRules?.lineGoal && this.score.lines >= this._modeRules.lineGoal) {
      this.gameOver = true;
      gameEvents.emit(GAME_EVENTS.GAME_OVER);
      return;
    }

    if (this._modeRules?.gameOver === false) {

      if (this.board.isGameOver()) {
        // Clear buffer zone
        this.board._buffer = this.board.createEmptyBuffer();
        // Clear top visible rows
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

  _calculateAttack(linesCleared, isTSpin, combo, backToBack) {
    if (linesCleared === 0) return 0;

    let attack = 0;

    // Official Tetris Guideline attack values
    if (isTSpin) {
      // T-Spin: 0, 2, 4, 6
      attack = [0, 2, 4, 6][linesCleared] || 0;
    } else {
      // Normal: 0, 0, 1, 2, 4
      attack = [0, 0, 1, 2, 4][linesCleared] || 0;
    }

    // Back-to-Back bonus: +1
    if (backToBack && (isTSpin || linesCleared === 4)) {
      attack += 1;
    }

    // Official combo table (starts at combo 1)
    if (combo >= 1) {
      //          combo: 0  1  2  3  4  5  6  7  8  9+
      const comboTable = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4];
      attack += comboTable[Math.min(combo, comboTable.length - 1)] || 4;
    }

    // Perfect Clear: 10 lines (official guideline)
    const boardEmpty = this.board.grid.every(row => row.every(cell => cell === null));
    if (boardEmpty) {
      attack = 10;
    }

    return attack;
  }

  receiveGarbage(count) {
    if (count > 0) {
      this.pendingGarbage += count;
      this._markDirty();
    }
  }

  consumeAttack() {
    const attack = this._lastAttack;
    this._lastAttack = 0;
    return attack;
  }

  holdPiece() {
    if (!this.canHold || !this.currentPiece) return;

    this._lockDelayActive = false;
    this._lockDelayElapsed = 0;
    this._lockDelayResets = 0;

    try {
      const temp = this.heldPiece;

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
      this._markDirty();
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

      this._lockDelayActive = false;
      this._lockDelayElapsed = 0;

      const strategy = this.movementStrategyFactory.createStrategy('hardDrop');
      const result = strategy.execute(this.currentPiece, this.board.grid);

      this.currentPiece = result.piece;
      this.score.addPoints(result.dropDistance);
      this._markDirty();

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

    if (this._modeRules?.timeLimit) {
      this.modeTimeElapsed = (Date.now() - this.modeStartTime) / 1000;
      if (this.modeTimeElapsed >= this._modeRules.timeLimit) {
        this.gameOver = true;
        this._markDirty();
        gameEvents.emit(GAME_EVENTS.GAME_OVER);
        return;
      }
    }

    if (this._lockDelayActive) {
      this._lockDelayElapsed += deltaTime;
      if (this._lockDelayElapsed >= this._lockDelayMax) {

        this._lockDelayActive = false;
        this._lockDelayElapsed = 0;
        this.placePiece();
        this.lastDropTime = 0;
        return;
      }

      return;
    }

    this.lastDropTime += deltaTime;
    if (this.lastDropTime >= this.score.getDropTime()) {
      this.movePiece('down');
      this.lastDropTime = 0;
    }
  }

  _resetLockDelay() {
    if (this._lockDelayActive && this._lockDelayResets < this._lockDelayMaxResets) {
      this._lockDelayElapsed = 0;
      this._lockDelayResets++;
    }
  }

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
    this._markDirty();
    gameEvents.emit(GAME_EVENTS.GAME_PAUSED);
  }

  resume() {
    this.isPaused = false;
    this.isPlaying = true;
    this._markDirty();
    gameEvents.emit(GAME_EVENTS.GAME_RESUMED);
  }

  restart() {
    this.initializeGame();
    this.isPlaying = true;
    this.isPaused = false;
    this.modeStartTime = Date.now();
    this._markDirty();
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

    // Block out: new piece can't spawn (overlaps existing blocks)
    if (this.currentPiece && !this.board.canPlacePiece(this.currentPiece)) {
      this.gameOver = true;
      this._markDirty();
      gameEvents.emit(GAME_EVENTS.GAME_OVER);
    }
  }

  getGameState() {
    if (this._cachedState && !this._dirty) return this._cachedState;
    this._cachedState = {
      board: this.board.grid.map(row => [...row]),
      currentPiece: this.currentPiece,
      nextPieces: [...this.nextPieces],
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
    return this._cachedState;
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
