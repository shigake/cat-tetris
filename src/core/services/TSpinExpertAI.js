const KICK_OFFSETS = [
  { x: -1, y: 0 },
  { x: 1, y: 0 },
  { x: 0, y: -1 },
  { x: -1, y: -1 },
  { x: 1, y: -1 }
];

const SRS_KICKS_CW = {
  '0>1': [{ x: -1, y: 0 }, { x: -1, y: -1 }, { x: 0, y: 2 }, { x: -1, y: 2 }],
  '1>2': [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: -2 }, { x: 1, y: -2 }],
  '2>3': [{ x: 1, y: 0 }, { x: 1, y: -1 }, { x: 0, y: 2 }, { x: 1, y: 2 }],
  '3>0': [{ x: -1, y: 0 }, { x: -1, y: 1 }, { x: 0, y: -2 }, { x: -1, y: -2 }],
};

const T_SHAPES = [
  [[0,1,0],[1,1,1],[0,0,0]],
  [[0,1,0],[0,1,1],[0,1,0]],
  [[0,0,0],[1,1,1],[0,1,0]],
  [[0,1,0],[1,1,0],[0,1,0]],
];

export class TSpinExpertAI {
  constructor() {
    this._actionQueue = [];
    this._holdCooldown = 0;
    this._lastPieceType = null;
    this._piecesPlaced = 0;
    this._tspinState = null;
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
      this._tspinState = null;
      if (this._holdCooldown > 0) this._holdCooldown--;
    }

    if (this._tspinState) {
      return this._executeTSpinStep(gameState);
    }

    if (this._actionQueue.length > 0) {
      return this._actionQueue.shift();
    }

    const boardMaxH = this._getMaxHeight(board);
    const inDanger = boardMaxH >= 14;
    const boardHoles = this._countHoles(board);
    const boardReady = boardHoles <= 2;

    if (canHold && this._holdCooldown <= 0 && !inDanger) {
      if (curType === 'T') {
        const tResult = this._findBestTSpinMove(board);
        if (tResult && tResult.isTSpin && tResult.linesCleared >= 2 && boardReady) {
          this._startTSpinExecution(tResult);
          this._piecesPlaced++;
          return this._executeTSpinStep(gameState);
        }

        if (boardReady && boardMaxH >= 3 && (!heldPiece || heldPiece.type !== 'T')) {
          this._holdCooldown = 2;
          return { action: 'hold' };
        }

        if (tResult && tResult.isTSpin && tResult.linesCleared >= 1 && boardReady) {
          this._startTSpinExecution(tResult);
          this._piecesPlaced++;
          return this._executeTSpinStep(gameState);
        }
      }

      if (heldPiece?.type === 'T' && curType !== 'T' && boardReady) {
        const tResult = this._findBestTSpinMove(board);
        if (tResult && tResult.isTSpin && tResult.linesCleared >= 2) {
          this._holdCooldown = 2;
          return { action: 'hold' };
        }
      }
    }

    if (curType === 'T' && !inDanger && boardReady) {
      const tResult = this._findBestTSpinMove(board);
      if (tResult && tResult.isTSpin && tResult.linesCleared >= 1) {
        this._startTSpinExecution(tResult);
        this._piecesPlaced++;
        return this._executeTSpinStep(gameState);
      }
    }

    const result = this._findBestMove(currentPiece, board);
    if (result) {
      this._actionQueue = this._buildNormalActionSequence(currentPiece, result.rotations, result.targetX);
      this._piecesPlaced++;
    } else {
      this._actionQueue = [{ action: 'drop' }];
    }

    return this._actionQueue.shift() || { action: 'down' };
  }

  _startTSpinExecution(tResult) {

    this._tspinState = {
      phase: 'move',
      startCol: tResult.startCol,
      targetRot: tResult.targetRot,
      stopRow: tResult.stopRow,
      rotationsLeft: tResult.targetRot,
      dropCount: 0
    };
    this._actionQueue = [];
  }

  _executeTSpinStep(gameState) {
    const { currentPiece, board } = gameState;
    if (!currentPiece || !board) {
      this._tspinState = null;
      return null;
    }

    if (currentPiece.type !== 'T') {
      this._tspinState = null;
      return null;
    }

    const state = this._tspinState;
    const H = board.length;
    const W = board[0]?.length || 10;

    switch (state.phase) {
      case 'move': {
        const curX = currentPiece.position?.x ?? 3;
        if (curX < state.startCol) return { action: 'right' };
        if (curX > state.startCol) return { action: 'left' };

        state.phase = 'drop';

        return this._executeTSpinStep(gameState);
      }

      case 'drop': {

        const curY = currentPiece.position?.y ?? 0;
        if (curY >= state.stopRow) {

          state.phase = 'rotate';
          state.rotationsLeft = state.targetRot;
          return this._executeTSpinStep(gameState);
        }

        const canDrop = this._canPieceMoveDown(currentPiece, board, H, W);
        if (!canDrop) {

          state.phase = 'rotate';
          state.rotationsLeft = state.targetRot;
          return this._executeTSpinStep(gameState);
        }
        state.dropCount++;
        return { action: 'down' };
      }

      case 'rotate': {
        if (state.rotationsLeft > 0) {
          state.rotationsLeft--;
          return { action: 'rotate' };
        }

        state.phase = 'lock';
        this._tspinState = null;
        return { action: 'drop' };
      }

      default:
        this._tspinState = null;
        return null;
    }
  }

  _canPieceMoveDown(piece, board, H, W) {
    const shape = piece.shape;
    const pos = piece.position;
    if (!shape || !pos) return false;

    for (let sy = 0; sy < shape.length; sy++) {
      for (let sx = 0; sx < shape[0].length; sx++) {
        if (!shape[sy][sx]) continue;
        const bx = pos.x + sx;
        const by = pos.y + sy + 1;
        if (bx < 0 || bx >= W) return false;
        if (by >= H) return false;
        if (by >= 0 && board[by][bx] != null) return false;
      }
    }
    return true;
  }

  _findBestTSpinMove(board) {
    const H = board.length;
    const W = board[0]?.length || 10;
    let bestScore = -Infinity;
    let bestMove = null;

    const spawnShape = T_SHAPES[0];

    for (let startCol = -1; startCol <= W; startCol++) {

      if (this._collides(spawnShape, board, startCol, 0, H, W) &&
          this._collides(spawnShape, board, startCol, -1, H, W) &&
          this._collides(spawnShape, board, startCol, -2, H, W)) {
        continue;
      }

      const bottomRow = this._findLandingRow(spawnShape, board, startCol, H, W);
      if (bottomRow == null) continue;

      const minRow = Math.max(0, bottomRow - 4);

      for (let dropRow = bottomRow; dropRow >= minRow; dropRow--) {

        if (this._collides(spawnShape, board, startCol, dropRow, H, W)) continue;

        for (let targetRot = 1; targetRot < 4; targetRot++) {
          const result = this._simulateTSpinAtHeight(board, startCol, dropRow, targetRot, H, W);
          if (!result) continue;

          const { finalCol, finalRow, isTSpin, sim, kickedRow } = result;
          if (!sim) continue;

          const linesCleared = this._countCompleteLines(sim);
          let score = this._evaluateForTSpin(sim);

          if (isTSpin && linesCleared >= 3) {
            score += 40000;
          } else if (isTSpin && linesCleared >= 2) {
            score += 30000;
          } else if (isTSpin && linesCleared >= 1) {
            score += 12000;
          } else if (isTSpin) {
            score += 500;
          }

          if (score > bestScore) {
            bestScore = score;
            bestMove = {
              startCol,
              targetRot,
              stopRow: dropRow,
              finalCol,
              finalRow,
              isTSpin: isTSpin && linesCleared > 0,
              linesCleared
            };
          }
        }
      }
    }

    return bestMove;
  }

  _simulateTSpinAtHeight(board, startCol, dropRow, targetRot, H, W) {
    let curRot = 0;
    let curCol = startCol;
    let curRow = dropRow;

    while (curRot !== targetRot) {
      const nextRot = (curRot + 1) % 4;
      const nextShape = T_SHAPES[nextRot];
      const kickKey = `${curRot}>${nextRot}`;
      const kicks = SRS_KICKS_CW[kickKey] || KICK_OFFSETS;

      let rotated = false;

      if (!this._collides(nextShape, board, curCol, curRow, H, W)) {
        curRot = nextRot;
        rotated = true;
      } else {

        for (const kick of kicks) {
          const kCol = curCol + kick.x;
          const kRow = curRow + kick.y;
          if (!this._collides(nextShape, board, kCol, kRow, H, W)) {
            curCol = kCol;
            curRow = kRow;
            curRot = nextRot;
            rotated = true;
            break;
          }
        }
      }

      if (!rotated) return null;
    }

    const finalShape = T_SHAPES[curRot];
    const settledRow = this._findLandingRow(finalShape, board, curCol, H, W);
    if (settledRow == null) return null;
    const finalRow = Math.max(curRow, settledRow);

    const isTSpin = this._checkTSpinCorners(curCol, curRow, board, H, W);

    const sim = this._placeOnBoard(finalShape, board, curCol, finalRow);
    if (!sim) return null;

    return { finalCol: curCol, finalRow, isTSpin, sim, kickedRow: curRow };
  }

  _findBestMove(piece, board) {
    let bestScore = -Infinity;
    let bestMove = null;
    const H = board.length;
    const W = board[0]?.length || 10;

    for (let rot = 0; rot < 4; rot++) {
      const shape = this._rotateShape(piece.shape, rot);
      const pw = shape[0].length;

      for (let col = -1; col <= W - pw + 1; col++) {
        const landingRow = this._findLandingRow(shape, board, col, H, W);
        if (landingRow == null || landingRow < 0) continue;

        const sim = this._placeOnBoard(shape, board, col, landingRow);
        if (!sim) continue;

        const score = this._evaluate(sim, board);
        if (score > bestScore) {
          bestScore = score;
          bestMove = { rotations: rot, targetX: col };
        }
      }
    }
    return bestMove;
  }

  _evaluate(simBoard, originalBoard) {
    let score = 0;
    const H = simBoard.length;
    const W = simBoard[0].length;

    const lines = this._countCompleteLines(simBoard);
    score += lines * 15000;
    if (lines >= 2) score += 5000;
    if (lines >= 4) score += 25000;

    const cleaned = this._removeCompleteLines(simBoard);
    const heights = this._getColumnHeights(cleaned);
    const maxH = Math.max(...heights);
    const totalH = heights.reduce((s, h) => s + h, 0);
    const avgH = totalH / W;

    let wellCol = -1;
    let wellH = Infinity;
    for (let x = 1; x < W - 1; x++) {
      if (heights[x] < wellH) {
        wellH = heights[x];
        wellCol = x;
      }
    }

    const leftN = wellCol > 0 ? heights[wellCol - 1] : 0;
    const rightN = wellCol < W - 1 ? heights[wellCol + 1] : 0;
    const wellDepth = Math.min(leftN, rightN) - wellH;
    const hasWell = wellDepth >= 2 && wellCol >= 1 && wellCol <= W - 2;

    const holes = this._countHoles(cleaned);
    score -= holes * 6000;

    let coveredDepth = 0;
    for (let x = 0; x < W; x++) {
      let blockAbove = false;
      let depth = 0;
      for (let y = 0; y < H; y++) {
        if (cleaned[y][x] != null) { blockAbove = true; depth = 0; }
        else if (blockAbove) { depth++; coveredDepth += depth; }
      }
    }
    score -= coveredDepth * 400;

    score -= totalH * 30;
    score -= maxH * 150;
    if (maxH > 10) score -= (maxH - 10) * (maxH - 10) * 300;
    if (maxH > 15) score -= 60000;

    let bump = 0;
    for (let i = 0; i < W - 1; i++) {
      const diff = Math.abs(heights[i] - heights[i + 1]);
      if (hasWell && (i === wellCol || i === wellCol - 1)) {
        bump += diff * 0.3;
      } else {
        bump += diff;
      }
    }
    score -= bump * 200;

    for (const ex of [0, W - 1]) {
      if (heights[ex] === 0 && avgH > 2) score -= 4000;
      else if (heights[ex] < avgH - 3 && avgH > 3) score -= 1500;
    }

    for (let x = 1; x < W - 1; x++) {
      if (hasWell && x === wellCol) continue;
      if (heights[x] === 0 && avgH > 2) score -= 2000;
    }

    if (maxH > 14) {
      score += lines * 20000;
      return score;
    }

    const setupScale = maxH <= 10 ? 1.0 : Math.max(0, 1.0 - (maxH - 10) * 0.2);

    if (setupScale > 0 && holes <= 1) {

      if (hasWell) {
        if (wellDepth >= 2 && wellDepth <= 4) {
          score += 1500 * setupScale;
        } else if (wellDepth >= 5) {
          score += 500 * setupScale;
        }
      }

      let nearCompleteAtWell = 0;
      for (let y = Math.max(0, H - 8); y < H; y++) {
        const filled = this._rowFilled(cleaned[y]);
        if (filled === 9) {

          if (hasWell && cleaned[y][wellCol] == null) {
            nearCompleteAtWell++;
            score += 1200 * setupScale;
          } else {
            score += 300 * setupScale;
          }
        } else if (filled === 8) {
          score += 150 * setupScale;
        }
      }

      if (nearCompleteAtWell >= 2) {
        score += 3000 * setupScale;
      }

      if (hasWell) {

        for (let y = Math.max(1, H - 6); y < H; y++) {
          const wc = wellCol;

          if (wc > 0 && cleaned[y][wc - 1] != null && cleaned[y][wc] == null) {
            if (y > 0 && cleaned[y - 1][wc] == null) {
              score += 800 * setupScale;
            }
          }

          if (wc < W - 1 && cleaned[y][wc + 1] != null && cleaned[y][wc] == null) {
            if (y > 0 && cleaned[y - 1][wc] == null) {
              score += 800 * setupScale;
            }
          }
        }
      }

      const tsdSlots = this._countTSpinSlotsQuick(cleaned);
      score += tsdSlots * 500 * setupScale;
    }

    for (let y = H - 1; y >= 0; y--) {
      const filled = this._rowFilled(cleaned[y]);
      if (filled === 0) break;
      if (filled >= 1 && filled <= 5) score -= (10 - filled) * 40;
    }

    return score;
  }

  _evaluateForTSpin(board) {
    const cleaned = this._removeCompleteLines(board);
    let score = 0;

    const holes = this._countHoles(cleaned);
    score -= holes * 5000;

    const heights = this._getColumnHeights(cleaned);
    const maxH = Math.max(...heights);
    const totalH = heights.reduce((s, h) => s + h, 0);
    score -= maxH * 200;
    score -= totalH * 30;
    if (maxH > 12) score -= (maxH - 12) * (maxH - 12) * 500;

    let bump = 0;
    for (let i = 0; i < heights.length - 1; i++) bump += Math.abs(heights[i] - heights[i + 1]);
    score -= bump * 150;

    const avgH = totalH / heights.length;
    score += Math.max(0, 8 - avgH) * 200;

    return score;
  }

  _countTSpinSlotsQuick(board) {
    const H = board.length;
    const W = board[0]?.length || 10;
    let slots = 0;

    for (let y = Math.max(0, H - 8); y < H - 1; y++) {
      const f1 = this._rowFilled(board[y]);
      const f2 = this._rowFilled(board[y + 1]);

      if ((f1 === 7 && f2 === 9) || (f1 === 9 && f2 === 7)) {
        slots += 2;
      }

      if ((f1 === 8 && f2 === 9) || (f1 === 9 && f2 === 8)) {
        slots += 1;
      }

      if (y + 2 < H) {
        const f3 = this._rowFilled(board[y + 2]);
        if (f1 === 9 && f2 === 8 && f3 === 9) {
          slots += 3;
        }
      }
    }

    for (let y = Math.max(2, H - 6); y < H; y++) {
      for (let x = 0; x < W; x++) {
        if (board[y][x] != null) continue;
        let walls = 0;
        if (x === 0 || board[y][x - 1] != null) walls++;
        if (x === W - 1 || board[y][x + 1] != null) walls++;
        if (y === H - 1 || board[y + 1][x] != null) walls++;
        if (walls >= 2 && (y === 0 || board[y - 1][x] == null)) {
          slots += 1;
        }
      }
    }

    return slots;
  }

  _countOverhangPatterns(board) {
    const H = board.length;
    const W = board[0]?.length || 10;
    let count = 0;

    for (let y = 2; y < H - 1; y++) {
      for (let x = 0; x < W; x++) {
        if (board[y][x] != null) {

          if (y + 1 < H && board[y + 1][x] == null) {
            const hasAdjacentGap =
              (x > 0 && board[y + 1][x - 1] == null) ||
              (x < W - 1 && board[y + 1][x + 1] == null);
            if (hasAdjacentGap) count++;
          }
        }
      }
    }

    return count;
  }

  _checkTSpinCorners(px, py, board, H, W) {
    let filled = 0;
    const check = (x, y) => {
      if (x < 0 || x >= W || y < 0 || y >= H) return true;
      return board[y][x] != null;
    };
    if (check(px, py))         filled++;
    if (check(px + 2, py))     filled++;
    if (check(px, py + 2))     filled++;
    if (check(px + 2, py + 2)) filled++;
    return filled >= 3;
  }

  _buildNormalActionSequence(piece, targetRotations, targetX) {
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
    let n = 0;
    for (const row of board) {
      if (row.every(c => c != null)) n++;
    }
    return n;
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

  _getBumpiness(board) {
    const heights = this._getColumnHeights(board);
    let bump = 0;
    for (let i = 0; i < heights.length - 1; i++) {
      bump += Math.abs(heights[i] - heights[i + 1]);
    }
    return bump;
  }

  _getColumnHeights(board) {
    const W = board[0].length;
    const heights = [];
    for (let x = 0; x < W; x++) {
      let h = 0;
      for (let y = 0; y < board.length; y++) {
        if (board[y][x] != null) { h = board.length - y; break; }
      }
      heights.push(h);
    }
    return heights;
  }

  _rowFilled(row) {
    let n = 0;
    for (let i = 0; i < row.length; i++) {
      if (row[i] != null) n++;
    }
    return n;
  }

  _countNearCompleteRows(board) {
    let count = 0;
    for (let y = 0; y < board.length; y++) {
      const f = this._rowFilled(board[y]);
      if (f >= 8) count++;
    }
    return count;
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

