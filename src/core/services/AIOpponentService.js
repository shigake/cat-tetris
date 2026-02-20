/**
 * AIOpponentService - IA adversária com múltiplos níveis
 * Works with Piece entities that have: type, shape, color, emoji, position: {x,y}
 * Board is a 2D array (20 rows x 10 cols), null = empty, non-null = filled
 */

export class AIOpponentService {
  constructor() {
    this.difficulty = 'medium';
    this.thinkingTime = 100;
    this.lastDecision = Date.now();
    // Persistent action queue: once AI picks a target, execute the full sequence
    this._actionQueue = [];
  }

  setDifficulty(difficulty) {
    this.difficulty = difficulty;
    switch (difficulty) {
      case 'easy':   this.thinkingTime = 300; break;
      case 'medium': this.thinkingTime = 150; break;
      case 'hard':   this.thinkingTime = 80;  break;
      case 'expert': this.thinkingTime = 30;  break;
    }
  }

  /**
   * Decide the next single action for the AI.
   * Uses an internal action queue: evaluates the best placement once,
   * then feeds one action per call until the queue is drained.
   */
  decideNextMove(gameState) {
    const now = Date.now();
    if (now - this.lastDecision < this.thinkingTime) return null;
    this.lastDecision = now;

    const { currentPiece, board } = gameState;
    if (!currentPiece) return null;

    // If we still have queued actions for THIS piece, return next
    if (this._actionQueue.length > 0) {
      return this._actionQueue.shift();
    }

    // Evaluate best placement and build a new action queue
    try {
      const bestMove = this._findBestMove(currentPiece, board);
      if (!bestMove) return { action: 'down' };

      this._actionQueue = this._buildActionSequence(
        currentPiece,
        bestMove.rotations,
        bestMove.targetX
      );
    } catch (e) {
      // Fallback: just drop
      this._actionQueue = [{ action: 'drop' }];
    }

    return this._actionQueue.length > 0
      ? this._actionQueue.shift()
      : { action: 'down' };
  }

  // ─── Core evaluation ───────────────────────────────────────

  _findBestMove(piece, board) {
    let bestScore = -Infinity;
    let bestMove = null;
    const boardHeight = board.length;
    const boardWidth = board[0]?.length || 10;

    // Try 0-3 rotations
    for (let rot = 0; rot < 4; rot++) {
      const rotatedShape = this._rotateShape(piece.shape, rot);
      const pieceW = rotatedShape[0].length;
      const pieceH = rotatedShape.length;

      // Try every valid column
      for (let col = -1; col <= boardWidth - pieceW + 1; col++) {
        // Drop the shape to find landing row
        const landingRow = this._findLandingRow(rotatedShape, board, col, boardHeight, boardWidth);
        if (landingRow === null) continue; // invalid placement

        // Check if the placement is fully on the board
        if (landingRow < 0) continue;

        // Simulate placing
        const simBoard = this._placeOnBoard(rotatedShape, board, col, landingRow);
        if (!simBoard) continue;

        let score = this._evaluateBoard(simBoard, piece);

        // Difficulty-based noise
        if (this.difficulty === 'easy') {
          score += (Math.random() - 0.5) * 1000;
        } else if (this.difficulty === 'medium' && Math.random() < 0.15) {
          score += (Math.random() - 0.5) * 500;
        }

        if (score > bestScore) {
          bestScore = score;
          bestMove = { rotations: rot, targetX: col };
        }
      }
    }

    return bestMove;
  }

  _evaluateBoard(board, piece) {
    let score = 0;

    const linesCleared = this.countCompletedLines(board);
    score += linesCleared * 1000;

    const height = this.calculateHeight(board);
    score -= height * 50;

    const holes = this.countHoles(board);
    score -= holes * 500;

    const bumpiness = this.calculateBumpiness(board);
    score -= bumpiness * 40;

    const combo = this.evaluatePotentialCombo(board);
    score += combo * 300;

    const flatness = this.calculateFlatness(board);
    score += flatness * 20;

    if (this.difficulty === 'expert') {
      score += this.evaluateTSpinSetup(board, piece) * 800;
    }

    return score;
  }

  // ─── Action sequence builder ───────────────────────────────

  _buildActionSequence(currentPiece, targetRotations, targetX) {
    const actions = [];

    // Rotations first
    const rots = targetRotations % 4;
    for (let i = 0; i < rots; i++) {
      actions.push({ action: 'rotate' });
    }

    // Horizontal movement — use piece position.x as reference
    const currentX = currentPiece.position?.x ?? 3;
    const diff = targetX - currentX;
    const dir = diff > 0 ? 'right' : 'left';
    for (let i = 0; i < Math.abs(diff); i++) {
      actions.push({ action: dir });
    }

    // Hard drop at the end
    actions.push({ action: 'drop' });

    return actions;
  }

  // ─── Shape manipulation helpers ────────────────────────────

  _rotateShape(shape, times) {
    let s = shape;
    for (let i = 0; i < (times % 4); i++) {
      s = s[0].map((_, idx) => s.map(row => row[idx]).reverse());
    }
    return s;
  }

  _findLandingRow(shape, board, col, boardHeight, boardWidth) {
    const pieceH = shape.length;
    const pieceW = shape[0].length;

    // Start from top and move down until collision
    for (let row = -pieceH; row < boardHeight; row++) {
      if (this._collides(shape, board, col, row + 1, boardHeight, boardWidth)) {
        return row; // land at 'row'
      }
    }
    return boardHeight - pieceH; // bottom
  }

  _collides(shape, board, col, row, boardHeight, boardWidth) {
    for (let sy = 0; sy < shape.length; sy++) {
      for (let sx = 0; sx < shape[0].length; sx++) {
        if (!shape[sy][sx]) continue;
        const bx = col + sx;
        const by = row + sy;
        if (bx < 0 || bx >= boardWidth || by >= boardHeight) return true;
        if (by >= 0 && board[by][bx] != null) return true;
      }
    }
    return false;
  }

  _placeOnBoard(shape, board, col, row) {
    const boardHeight = board.length;
    const boardWidth = board[0].length;
    const newBoard = board.map(r => [...r]);

    for (let sy = 0; sy < shape.length; sy++) {
      for (let sx = 0; sx < shape[0].length; sx++) {
        if (!shape[sy][sx]) continue;
        const bx = col + sx;
        const by = row + sy;
        if (bx < 0 || bx >= boardWidth || by < 0 || by >= boardHeight) return null;
        if (newBoard[by][bx] != null) return null;
        newBoard[by][bx] = 1; // mark filled
      }
    }
    return newBoard;
  }

  // ─── Board evaluation helpers ──────────────────────────────

  countCompletedLines(board) {
    let count = 0;
    for (const row of board) {
      if (row.every(cell => cell != null)) count++;
    }
    return count;
  }

  calculateHeight(board) {
    for (let y = 0; y < board.length; y++) {
      if (board[y].some(cell => cell != null)) return board.length - y;
    }
    return 0;
  }

  countHoles(board) {
    let holes = 0;
    const width = board[0].length;
    for (let x = 0; x < width; x++) {
      let blockFound = false;
      for (let y = 0; y < board.length; y++) {
        if (board[y][x] != null) blockFound = true;
        else if (blockFound) holes++;
      }
    }
    return holes;
  }

  calculateBumpiness(board) {
    const heights = [];
    const width = board[0].length;
    for (let x = 0; x < width; x++) {
      let h = 0;
      for (let y = 0; y < board.length; y++) {
        if (board[y][x] != null) { h = board.length - y; break; }
      }
      heights.push(h);
    }
    let bump = 0;
    for (let i = 0; i < heights.length - 1; i++) {
      bump += Math.abs(heights[i] - heights[i + 1]);
    }
    return bump;
  }

  evaluatePotentialCombo(board) {
    let combo = 0;
    for (let y = 0; y < board.length - 1; y++) {
      const f1 = board[y].filter(c => c != null).length;
      const f2 = board[y + 1].filter(c => c != null).length;
      if (f1 >= 8 && f2 >= 8) combo++;
    }
    return combo;
  }

  calculateFlatness(board) {
    const heights = [];
    const width = board[0].length;
    for (let x = 0; x < width; x++) {
      let found = false;
      for (let y = 0; y < board.length; y++) {
        if (board[y][x] != null) { heights.push(board.length - y); found = true; break; }
      }
      if (!found) heights.push(0);
    }
    const avg = heights.reduce((s, h) => s + h, 0) / heights.length;
    const variance = heights.reduce((s, h) => s + Math.pow(h - avg, 2), 0) / heights.length;
    return Math.max(0, 100 - variance);
  }

  evaluateTSpinSetup(board, piece) {
    if (piece?.type !== 'T') return 0;
    let slots = 0;
    for (let y = 1; y < board.length - 1; y++) {
      for (let x = 1; x < board[0].length - 1; x++) {
        if (this._isTSpinSlot(board, x, y)) slots++;
      }
    }
    return slots;
  }

  _isTSpinSlot(board, x, y) {
    return board[y][x] == null &&
           board[y][x - 1] != null &&
           board[y][x + 1] != null &&
           board[y - 1][x] == null;
  }

  // ─── Public helpers ────────────────────────────────────────

  getDifficulties() {
    return [
      { id: 'easy', name: 'Fácil', emoji: '🐱', description: 'IA iniciante' },
      { id: 'medium', name: 'Médio', emoji: '😺', description: 'IA intermediária' },
      { id: 'hard', name: 'Difícil', emoji: '😸', description: 'IA avançada' },
      { id: 'expert', name: 'Expert', emoji: '😻', description: 'IA mestre' }
    ];
  }
}
