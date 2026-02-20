export class AIOpponentService {
  constructor() {
    this.difficulty = 'medium';
    this.thinkingTime = 100;
    this.lastDecision = Date.now();
    this._actionQueue = [];
    this._isExpert = false;
  }

  setDifficulty(difficulty) {
    this.difficulty = difficulty;
    this._isExpert = difficulty.startsWith('expert');
    switch (difficulty) {
      case 'easy':          this.thinkingTime = 250; break;
      case 'medium':        this.thinkingTime = 120; break;
      case 'hard':          this.thinkingTime = 60;  break;
      case 'expert':        this.thinkingTime = 20;  break;
      default:              this.thinkingTime = 120;
    }
  }

  decideNextMove(gameState) {
    const now = Date.now();

    if (this._actionQueue.length > 0) {
      if (this._isExpert) {
        return this._actionQueue.shift();
      }
      if (now - this.lastDecision < this.thinkingTime) return null;
      this.lastDecision = now;
      return this._actionQueue.shift();
    }

    if (!this._isExpert && now - this.lastDecision < this.thinkingTime) return null;
    this.lastDecision = now;

    const { currentPiece, board, heldPiece, canHold, nextPieces } = gameState;
    if (!currentPiece) return null;

    try {
      const nextPiece = nextPieces?.[0] || null;

      let bestResult = this._findBestMoveWithLookahead(currentPiece, board, nextPiece);
      let useHold = false;

      if (this._isExpert && canHold) {
        const holdPiece = heldPiece || nextPiece;
        if (holdPiece && holdPiece.type !== currentPiece.type) {
          const lookAheadForHold = heldPiece ? nextPiece : nextPieces?.[1] || null;
          const holdResult = this._findBestMoveWithLookahead(holdPiece, board, lookAheadForHold);
          if (holdResult && (!bestResult || holdResult.score > bestResult.score + 10)) {
            bestResult = holdResult;
            useHold = true;
          }
        }
      }

      if (!bestResult) {
        this._actionQueue = [{ action: 'drop' }];
      } else {
        const actions = [];
        if (useHold) actions.push({ action: 'hold' });
        const srcPiece = useHold ? (heldPiece || nextPieces?.[0]) : currentPiece;
        actions.push(...this._buildActionSequence(srcPiece, bestResult.rotations, bestResult.targetX, useHold));
        this._actionQueue = actions;
      }
    } catch (e) {
      this._actionQueue = [{ action: 'drop' }];
    }

    return this._actionQueue.length > 0
      ? this._actionQueue.shift()
      : { action: 'down' };
  }

  _findBestMoveWithLookahead(piece, board, nextPiece) {
    let bestScore = -Infinity;
    let bestMove = null;
    const boardHeight = board.length;
    const boardWidth = board[0]?.length || 10;
    const doLookahead = this._isExpert && nextPiece;

    for (let rot = 0; rot < 4; rot++) {
      const rotatedShape = this._rotateShape(piece.shape, rot);
      const pieceW = rotatedShape[0].length;

      for (let col = -2; col <= boardWidth - pieceW + 2; col++) {
        const landingRow = this._findLandingRow(rotatedShape, board, col, boardHeight, boardWidth);
        if (landingRow === null || landingRow < 0) continue;

        const simBoard = this._placeOnBoard(rotatedShape, board, col, landingRow);
        if (!simBoard) continue;

        const { board: clearedBoard } = this._simulateClear(simBoard);
        let score = this._evaluate(simBoard, piece);

        if (doLookahead) {
          let bestNext = -Infinity;
          for (let nRot = 0; nRot < 4; nRot++) {
            const nShape = this._rotateShape(nextPiece.shape, nRot);
            const nW = nShape[0].length;
            for (let nCol = -2; nCol <= boardWidth - nW + 2; nCol++) {
              const nRow = this._findLandingRow(nShape, clearedBoard, nCol, boardHeight, boardWidth);
              if (nRow === null || nRow < 0) continue;
              const nBoard = this._placeOnBoard(nShape, clearedBoard, nCol, nRow);
              if (!nBoard) continue;
              const nScore = this._evaluate(nBoard, nextPiece);
              if (nScore > bestNext) bestNext = nScore;
            }
          }
          if (bestNext > -Infinity) {
            const lookaheadW = 0.45;
            score = score * (1 - lookaheadW) + bestNext * lookaheadW;
          }
        }

        if (this.difficulty === 'easy') {
          score += (Math.random() - 0.5) * 1200;
        } else if (this.difficulty === 'medium' && Math.random() < 0.2) {
          score += (Math.random() - 0.5) * 500;
        }

        if (score > bestScore) {
          bestScore = score;
          bestMove = { rotations: rot, targetX: col, score: bestScore };
        }
      }
    }

    return bestMove;
  }

  _evaluate(board, piece) {
    switch (this.difficulty) {
      case 'expert':        return this._evalSurvival(board, piece);
      default:              return this._evalDefault(board, piece);
    }
  }

  _simulateClear(board) {
    const width = board[0].length;
    const kept = [];
    let cleared = 0;
    for (const row of board) {
      if (row.every(c => c != null)) {
        cleared++;
      } else {
        kept.push([...row]);
      }
    }
    while (kept.length < board.length) {
      kept.unshift(new Array(width).fill(null));
    }
    return { board: kept, cleared };
  }

  _evalDefault(rawBoard, piece) {
    const { board, cleared } = this._simulateClear(rawBoard);
    let score = 0;
    score += cleared * 800;
    score -= this._getHeight(board) * 45;
    score -= this._countHoles(board) * 400;
    score -= this._getBumpiness(board) * 35;
    score -= this._getRowTransitions(board) * 15;
    score -= this._getColTransitions(board) * 10;
    if (this.difficulty === 'hard') {
      score += cleared >= 2 ? cleared * 400 : 0;
      score -= this._countHoles(board) * 200;
      score -= this._getCoveredHoles(board) * 100;
      score -= this._getHeight(board) * 30;
      if (this._countHoles(board) === 0) score += 300;
      if (this._getHeight(board) <= 6) score += 200;
    }
    return score;
  }

  _evalSurvival(rawBoard) {
    const { board, cleared } = this._simulateClear(rawBoard);
    const height = this._getHeight(board);
    const holes = this._countHoles(board);
    const bumpiness = this._getBumpiness(board);
    const coveredHoles = this._getCoveredHoles(board);
    const colHeights = this._getColumnHeights(board);
    const maxColH = Math.max(...colHeights);
    const minColH = Math.min(...colHeights);
    const rowTrans = this._getRowTransitions(board);
    const colTrans = this._getColTransitions(board);
    const wellDepths = this._getWellDepths(board);

    let score = 0;

    score += cleared * 5000;
    if (cleared >= 2) score += cleared * cleared * 1500;
    if (cleared === 3) score += 8000;
    if (cleared === 4) score += 25000;

    if (height > 10) {
      score += cleared * 8000;
      if (cleared >= 2) score += cleared * 5000;
    }
    if (height > 14) {
      score += cleared * 20000;
    }

    score -= height * height * 25;
    score -= height * 300;

    score -= maxColH * maxColH * 15;

    score -= holes * 4000;
    score -= holes * holes * 500;
    score -= coveredHoles * 1200;

    score -= bumpiness * 250;
    const avgH = colHeights.reduce((s, v) => s + v, 0) / colHeights.length;
    const variance = colHeights.reduce((s, v) => s + (v - avgH) ** 2, 0) / colHeights.length;
    score -= variance * 80;

    const heightRange = maxColH - minColH;
    if (heightRange > 4) score -= (heightRange - 4) * 800;
    if (heightRange > 6) score -= (heightRange - 6) * 1500;

    score -= rowTrans * 60;
    score -= colTrans * 50;

    score -= wellDepths * 200;

    if (height === 0) score += 15000;
    else if (height <= 2) score += 6000;
    else if (height <= 4) score += 3000;
    else if (height <= 6) score += 1500;

    if (holes === 0) score += 5000;
    if (holes === 0 && height <= 4) score += 3000;
    if (bumpiness <= 1) score += 2000;
    else if (bumpiness <= 3) score += 800;

    if (height > 10) score -= (height - 10) * 2000;
    if (height > 12) score -= (height - 12) * (height - 12) * 800;
    if (height > 14) score -= (height - 14) * (height - 14) * 1500;
    if (height > 16) score -= 60000;
    if (height > 18) score -= 200000;

    const nearComplete = this._countNearCompleteLines(board);
    if (height > 8) {
      score += nearComplete * 1500;
    }

    return score;
  }

  _evalCombo(rawBoard, piece) {
    const { board, cleared } = this._simulateClear(rawBoard);
    const width = board[0].length;
    const height = this._getHeight(board);
    const holes = this._countHoles(board);
    const bumpiness = this._getBumpiness(board);
    const coveredHoles = this._getCoveredHoles(board);

    let score = 0;

    if (cleared === 1) score += 6000;
    else if (cleared === 2) score += 3500;
    else if (cleared === 3) score += 2500;
    else if (cleared === 4) score += 2000;

    let nearComplete = 0;
    let consecutiveNear = 0;
    let maxConsecutive = 0;
    const gapCols = {};

    for (let y = board.length - 1; y >= 0; y--) {
      let filled = 0;
      let gapX = -1;
      for (let x = 0; x < width; x++) {
        if (board[y][x] != null) filled++;
        else gapX = x;
      }

      if (filled === width - 1) {
        nearComplete++;
        consecutiveNear++;
        maxConsecutive = Math.max(maxConsecutive, consecutiveNear);
        if (gapX >= 0) gapCols[gapX] = (gapCols[gapX] || 0) + 1;
      } else if (filled >= width - 2) {
        nearComplete += 0.5;
        consecutiveNear++;
        maxConsecutive = Math.max(maxConsecutive, consecutiveNear);
      } else {
        consecutiveNear = 0;
      }
    }

    score += nearComplete * 2500;

    score += maxConsecutive * maxConsecutive * 600;

    let bestGapCount = 0;
    for (const col in gapCols) {
      if (gapCols[col] > bestGapCount) bestGapCount = gapCols[col];
    }
    if (bestGapCount >= 2) score += bestGapCount * bestGapCount * 500;

    score -= holes * 2500;
    score -= coveredHoles * 700;
    score -= height * 100;
    score -= bumpiness * 120;
    score -= this._getRowTransitions(board) * 35;
    score -= this._getColTransitions(board) * 25;

    if (holes === 0) score += 1500;
    if (height <= 6) score += 600;
    if (height > 12) score -= (height - 12) * 800;
    if (height > 15) score -= (height - 15) * 2000;
    if (height > 18) score -= 25000;

    return score;
  }

  _evalTetris(rawBoard, piece) {
    const { board, cleared } = this._simulateClear(rawBoard);
    const width = board[0].length;
    const boardH = board.length;
    const colHeights = this._getColumnHeights(board);
    const height = this._getHeight(board);
    const holes = this._countHoles(board);
    const coveredHoles = this._getCoveredHoles(board);

    let score = 0;

    const wellCol = width - 1;

    if (cleared === 4) {
      score += 200000;
    } else if (cleared > 0) {
      score -= cleared * 15000;
    }

    let wellBlocks = 0;
    for (let y = 0; y < boardH; y++) {
      if (board[y][wellCol] != null) wellBlocks++;
    }
    score -= wellBlocks * 6000;

    const nonWellHeights = [];
    for (let i = 0; i < width; i++) {
      if (i !== wellCol) nonWellHeights.push(colHeights[i]);
    }
    const avgNW = nonWellHeights.reduce((s, v) => s + v, 0) / nonWellHeights.length;
    const wellDepth = avgNW - colHeights[wellCol];

    score += Math.max(0, wellDepth) * 600;
    if (wellDepth >= 4) score += 25000;
    else if (wellDepth >= 3) score += 12000;
    else if (wellDepth >= 2) score += 5000;
    else if (wellDepth >= 1) score += 1000;

    let nwBump = 0;
    for (let i = 0; i < nonWellHeights.length - 1; i++) {
      nwBump += Math.abs(nonWellHeights[i] - nonWellHeights[i + 1]);
    }
    score -= nwBump * 500;

    const nwVariance = nonWellHeights.reduce((s, v) => s + (v - avgNW) ** 2, 0) / nonWellHeights.length;
    score -= nwVariance * 150;

    if (nwBump === 0) score += 6000;
    else if (nwBump <= 1) score += 2500;
    else if (nwBump <= 2) score += 800;

    const nearFull = this._countNearFullLinesExcluding(board, wellCol);
    score += nearFull * 5000;
    if (nearFull >= 4) score += 20000;
    else if (nearFull >= 3) score += 8000;
    else if (nearFull >= 2) score += 3000;

    for (let x = 0; x < width; x++) {
      if (x === wellCol) continue;
      const h = colHeights[x];
      const leftH = x > 0 ? colHeights[x - 1] : boardH;
      const rightH = x < width - 1 ? colHeights[x + 1] : boardH;
      const depth = Math.min(leftH, rightH) - h;
      if (depth > 1) score -= depth * 2000;
    }

    if (piece.type === 'I') {
      if (cleared === 4) {
        score += 50000;
      } else if (wellDepth < 4) {
        score -= 20000;
      }
    }

    score -= holes * 5000;
    score -= coveredHoles * 2000;
    score -= this._getRowTransitions(board) * 40;
    score -= this._getColTransitions(board) * 30;

    const maxNW = Math.max(...nonWellHeights);
    if (maxNW > 14) score -= (maxNW - 14) * 3000;
    if (maxNW > 16) score -= (maxNW - 16) * 6000;
    if (maxNW > 18) score -= 40000;

    if (holes === 0) score += 4000;
    if (avgNW <= 6) score += 1500;

    return score;
  }

  _countLines(board) {
    let count = 0;
    for (const row of board) {
      if (row.every(cell => cell != null)) count++;
    }
    return count;
  }

  _getHeight(board) {
    for (let y = 0; y < board.length; y++) {
      if (board[y].some(cell => cell != null)) return board.length - y;
    }
    return 0;
  }

  _countHoles(board) {
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

  _getBumpiness(board) {
    const h = this._getColumnHeights(board);
    let bump = 0;
    for (let i = 0; i < h.length - 1; i++) {
      bump += Math.abs(h[i] - h[i + 1]);
    }
    return bump;
  }

  _getBumpinessExcluding(board, excludeCol) {
    const h = this._getColumnHeights(board);
    let bump = 0;
    for (let i = 0; i < h.length - 1; i++) {
      if (i === excludeCol || i + 1 === excludeCol) continue;
      bump += Math.abs(h[i] - h[i + 1]);
    }
    return bump;
  }

  _getColumnHeights(board) {
    const width = board[0].length;
    const heights = [];
    for (let x = 0; x < width; x++) {
      let found = false;
      for (let y = 0; y < board.length; y++) {
        if (board[y][x] != null) { heights.push(board.length - y); found = true; break; }
      }
      if (!found) heights.push(0);
    }
    return heights;
  }

  _getFlatness(board) {
    const h = this._getColumnHeights(board);
    const avg = h.reduce((s, v) => s + v, 0) / h.length;
    const variance = h.reduce((s, v) => s + (v - avg) ** 2, 0) / h.length;
    return Math.max(0, 100 - variance);
  }

  _getWellDepths(board) {
    const h = this._getColumnHeights(board);
    let total = 0;
    for (let x = 0; x < h.length; x++) {
      const left = x > 0 ? h[x - 1] : 20;
      const right = x < h.length - 1 ? h[x + 1] : 20;
      const depth = Math.min(left, right) - h[x];
      if (depth > 0) total += depth;
    }
    return total;
  }

  _getRowTransitions(board) {
    let transitions = 0;
    const width = board[0].length;
    for (let y = 0; y < board.length; y++) {
      for (let x = 0; x < width - 1; x++) {
        const a = board[y][x] != null;
        const b = board[y][x + 1] != null;
        if (a !== b) transitions++;
      }
      if (board[y][0] == null) transitions++;
      if (board[y][width - 1] == null) transitions++;
    }
    return transitions;
  }

  _getColTransitions(board) {
    let transitions = 0;
    const width = board[0].length;
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < board.length - 1; y++) {
        const a = board[y][x] != null;
        const b = board[y + 1][x] != null;
        if (a !== b) transitions++;
      }
      if (board[board.length - 1][x] == null) transitions++;
    }
    return transitions;
  }

  _getCoveredHoles(board) {
    let covered = 0;
    const width = board[0].length;
    for (let x = 0; x < width; x++) {
      let blockCount = 0;
      for (let y = 0; y < board.length; y++) {
        if (board[y][x] != null) {
          blockCount++;
        } else if (blockCount > 0) {
          covered += blockCount;
        }
      }
    }
    return covered;
  }

  _countNearCompleteLines(board) {
    let count = 0;
    for (const row of board) {
      const filled = row.filter(c => c != null).length;
      if (filled >= row.length - 1 && filled < row.length) count++;
    }
    return count;
  }

  _countNearFullLinesExcluding(board, excludeCol) {
    let count = 0;
    for (const row of board) {
      let empty = 0;
      let emptyCol = -1;
      for (let x = 0; x < row.length; x++) {
        if (row[x] == null) { empty++; emptyCol = x; }
      }
      if (empty === 1 && emptyCol === excludeCol) count++;
    }
    return count;
  }

  _buildActionSequence(currentPiece, targetRotations, targetX, isHold) {
    const actions = [];
    const rots = targetRotations % 4;
    for (let i = 0; i < rots; i++) {
      actions.push({ action: 'rotate' });
    }
    const currentX = isHold ? 3 : (currentPiece.position?.x ?? 3);
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

  _findLandingRow(shape, board, col, boardHeight, boardWidth) {
    for (let row = -shape.length; row < boardHeight; row++) {
      if (this._collides(shape, board, col, row + 1, boardHeight, boardWidth)) {
        return row;
      }
    }
    return boardHeight - shape.length;
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
        newBoard[by][bx] = 1;
      }
    }
    return newBoard;
  }

  getDifficulties() {
    return [
      { id: 'easy', name: 'Fácil', emoji: '🐱', description: 'IA iniciante' },
      { id: 'medium', name: 'Médio', emoji: '😺', description: 'IA intermediária' },
      { id: 'hard', name: 'Difícil', emoji: '😸', description: 'IA avançada' },
      { id: 'expert', name: 'Expert', emoji: '🧠', description: 'Mantém o board o mais baixo possível' }
    ];
  }
}
