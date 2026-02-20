export class ExpertAI {
  constructor() {
    this._actionQueue = [];
    this._lastPieceType = null;
    this._holdCooldown = 0;
    this._comboCount = 0;
    this.thinkingTime = 0;
    this.lastDecision = 0;
  }

  setDifficulty() {  }

  decideNextMove(gameState) {
    const now = Date.now();
    if (now - this.lastDecision < this.thinkingTime) return null;
    this.lastDecision = now;

    const { currentPiece, board, heldPiece, canHold } = gameState;
    if (!currentPiece || !board) return null;

    const curType = currentPiece.type;
    if (curType !== this._lastPieceType) {
      this._lastPieceType = curType;
      this._actionQueue = [];
      if (this._holdCooldown > 0) this._holdCooldown--;
    }

    if (this._actionQueue.length > 0) {
      return this._actionQueue.shift();
    }

    const H = board.length;
    const W = board[0]?.length || 10;

    const bestCurrent = this._findBestMove(currentPiece, board, H, W);

    if (canHold && this._holdCooldown <= 0 && heldPiece) {
      const bestHeld = this._findBestMove(heldPiece, board, H, W);
      if (bestHeld && (!bestCurrent || bestHeld.score > bestCurrent.score + 500)) {
        this._holdCooldown = 1;
        return { action: 'hold' };
      }
    }

    if (!bestCurrent && canHold && this._holdCooldown <= 0) {
      this._holdCooldown = 1;
      return { action: 'hold' };
    }

    if (bestCurrent) {
      this._actionQueue = this._buildActionSequence(currentPiece, bestCurrent.rotations, bestCurrent.targetX);
    } else {
      this._actionQueue = [{ action: 'drop' }];
    }

    return this._actionQueue.shift() || { action: 'drop' };
  }

  _findBestMove(piece, board, H, W) {
    let bestScore = -Infinity;
    let bestMove = null;

    for (let rot = 0; rot < 4; rot++) {
      const shape = this._rotateShape(piece.shape, rot);
      const pw = shape[0].length;

      for (let col = -1; col <= W - pw + 1; col++) {
        const landingRow = this._findLandingRow(shape, board, col, H, W);
        if (landingRow == null || landingRow < 0) continue;

        const sim = this._placeOnBoard(shape, board, col, landingRow);
        if (!sim) continue;

        const score = this._evaluate(sim, board, landingRow);
        if (score > bestScore) {
          bestScore = score;
          bestMove = { rotations: rot, targetX: col, score };
        }
      }
    }
    return bestMove;
  }

  _evaluate(simBoard, originalBoard, landingRow) {
    const H = simBoard.length;
    const W = simBoard[0].length;
    let score = 0;

    const lines = this._countCompleteLines(simBoard);
    if (lines === 1) score += 10000;
    if (lines === 2) score += 25000;
    if (lines === 3) score += 50000;
    if (lines >= 4) score += 100000;

    const cleaned = this._removeCompleteLines(simBoard);

    let holes = 0;
    let weightedHoles = 0;
    for (let x = 0; x < W; x++) {
      let blockFound = false;
      let cellsAbove = 0;
      for (let y = 0; y < H; y++) {
        if (cleaned[y][x] != null) {
          blockFound = true;
          cellsAbove++;
        } else if (blockFound) {
          holes++;
          weightedHoles += cellsAbove;
        }
      }
    }
    score -= holes * 10000;
    score -= weightedHoles * 1000;

    const heights = [];
    for (let x = 0; x < W; x++) {
      let h = 0;
      for (let y = 0; y < H; y++) {
        if (cleaned[y][x] != null) { h = H - y; break; }
      }
      heights.push(h);
    }

    const maxH = Math.max(...heights);
    const totalH = heights.reduce((s, h) => s + h, 0);
    const avgH = totalH / W;

    score -= totalH * 50;
    score -= maxH * 100;
    if (maxH > 12) score -= (maxH - 12) * (maxH - 12) * 500;
    if (maxH > 16) score -= 100000;

    let bump = 0;
    for (let i = 0; i < W - 1; i++) {

      if (i === W - 2) {
        bump += Math.abs(heights[i] - heights[i + 1]) * 0.3;
      } else {
        bump += Math.abs(heights[i] - heights[i + 1]);
      }
    }
    score -= bump * 200;

    let transitions = 0;
    for (let y = 0; y < H; y++) {
      const filled = cleaned[y].filter(c => c != null).length;
      if (filled === 0) continue;

      for (let x = 0; x < W - 1; x++) {
        const a = cleaned[y][x] != null;
        const b = cleaned[y][x + 1] != null;
        if (a !== b) transitions++;
      }

      if (cleaned[y][0] == null) transitions++;
      if (cleaned[y][W - 1] == null) transitions++;
    }
    score -= transitions * 100;

    let colTransitions = 0;
    for (let x = 0; x < W; x++) {
      for (let y = 0; y < H - 1; y++) {
        const a = cleaned[y][x] != null;
        const b = cleaned[y + 1][x] != null;
        if (a !== b) colTransitions++;
      }

      if (cleaned[H - 1][x] == null) colTransitions++;
    }
    score -= colTransitions * 80;

    const wellCol = W - 1;
    if (heights[wellCol] < heights[wellCol - 1]) {
      const wellDepth = heights[wellCol - 1] - heights[wellCol];
      if (wellDepth >= 1 && wellDepth <= 4 && maxH <= 12) {
        score += wellDepth * 300;
      }
    }

    for (let y = 0; y < H; y++) {
      const filled = cleaned[y].filter(c => c != null).length;
      if (filled === 9) score += 500;
      if (filled === 8) score += 200;
    }

    score -= landingRow > 0 ? 0 : (H - landingRow) * 30;

    if (maxH > 14) {
      score += lines * 50000;
    }

    return score;
  }

  _buildActionSequence(piece, targetRotations, targetX) {
    const actions = [];

    const rots = targetRotations % 4;
    for (let i = 0; i < rots; i++) {
      actions.push({ action: 'rotate' });
    }

    const currentX = piece.position?.x ?? 3;
    const diff = targetX - currentX;
    const dir = diff > 0 ? 'right' : 'left';
    for (let i = 0; i < Math.abs(diff); i++) {
      actions.push({ action: dir });
    }

    actions.push({ action: 'drop' });

    return actions;
  }

  _rotateShape(shape, times) {
    let s = shape;
    for (let i = 0; i < (times % 4); i++) {
      s = s[0].map((_, idx) => s.map(row => row[idx]).reverse());
    }
    return s;
  }

  _findLandingRow(shape, board, col, H, W) {
    const pH = shape.length;
    for (let row = -pH; row < H; row++) {
      if (this._collides(shape, board, col, row + 1, H, W)) return row;
    }
    return H - pH;
  }

  _collides(shape, board, col, row, H, W) {
    for (let sy = 0; sy < shape.length; sy++) {
      for (let sx = 0; sx < shape[0].length; sx++) {
        if (!shape[sy][sx]) continue;
        const bx = col + sx;
        const by = row + sy;
        if (bx < 0 || bx >= W || by >= H) return true;
        if (by >= 0 && board[by][bx] != null) return true;
      }
    }
    return false;
  }

  _placeOnBoard(shape, board, col, row) {
    const H = board.length;
    const W = board[0].length;
    const sim = board.map(r => [...r]);
    for (let sy = 0; sy < shape.length; sy++) {
      for (let sx = 0; sx < shape[0].length; sx++) {
        if (!shape[sy][sx]) continue;
        const bx = col + sx;
        const by = row + sy;
        if (bx < 0 || bx >= W || by < 0 || by >= H) return null;
        if (sim[by][bx] != null) return null;
        sim[by][bx] = 1;
      }
    }
    return sim;
  }

  _removeCompleteLines(board) {
    const W = board[0].length;
    const cleaned = board.filter(row => !row.every(c => c != null));
    while (cleaned.length < board.length) {
      cleaned.unshift(new Array(W).fill(null));
    }
    return cleaned;
  }

  _countCompleteLines(board) {
    return board.filter(row => row.every(c => c != null)).length;
  }

  _countHoles(board) {
    let holes = 0;
    const W = board[0].length;
    for (let x = 0; x < W; x++) {
      let found = false;
      for (let y = 0; y < board.length; y++) {
        if (board[y][x] != null) found = true;
        else if (found) holes++;
      }
    }
    return holes;
  }

  _getMaxHeight(board) {
    const H = board.length;
    const W = board[0]?.length || 10;
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        if (board[y][x] != null) return H - y;
      }
    }
    return 0;
  }
}

