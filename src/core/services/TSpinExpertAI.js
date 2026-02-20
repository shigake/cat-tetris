/**
 * TSpinExpertAI — Pro-level AI that executes T-Spin Doubles and Triples.
 *
 * KEY INSIGHT: T-Spins require the T to be ROTATED AT the gap (not dropped pre-rotated).
 * The game's detectTSpin checks 3-corner rule at the rotation point.
 * The game has lock delay (500ms) — after soft-drop to ground, pieces don't lock
 * instantly, giving time to rotate (essential for T-Spins).
 *
 * Strategy:
 *   - Non-T pieces: stack clean with near-complete rows, build T-Spin-friendly gaps
 *   - T pieces: use STATEFUL execution — move to column, soft-drop to floor,
 *     then rotate at the bottom (triggers T-Spin detection), then hard drop
 *   - Hold T pieces for optimal opportunities
 */

const KICK_OFFSETS = [
  { x: -1, y: 0 },
  { x: 1, y: 0 },
  { x: 0, y: -1 },
  { x: -1, y: -1 },
  { x: 1, y: -1 }
];

// SRS Wall Kick Data (clockwise, +y = down in screen coords)
const SRS_KICKS_CW = {
  '0>1': [{ x: -1, y: 0 }, { x: -1, y: -1 }, { x: 0, y: 2 }, { x: -1, y: 2 }],
  '1>2': [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: -2 }, { x: 1, y: -2 }],
  '2>3': [{ x: 1, y: 0 }, { x: 1, y: -1 }, { x: 0, y: 2 }, { x: 1, y: 2 }],
  '3>0': [{ x: -1, y: 0 }, { x: -1, y: 1 }, { x: 0, y: -2 }, { x: -1, y: -2 }],
};

// T piece shapes for each rotation index
const T_SHAPES = [
  [[0,1,0],[1,1,1],[0,0,0]], // 0: up
  [[0,1,0],[0,1,1],[0,1,0]], // 1: right
  [[0,0,0],[1,1,1],[0,1,0]], // 2: down
  [[0,1,0],[1,1,0],[0,1,0]], // 3: left
];

export class TSpinExpertAI {
  constructor() {
    this._actionQueue = [];
    this._holdCooldown = 0;
    this._lastPieceType = null;
    this._piecesPlaced = 0;
    this._tspinState = null; // Stateful T-Spin execution
    this.thinkingTime = 0;
    this.lastDecision = 0;
  }

  setDifficulty() { /* always expert */ }

  // ─── Public API ────────────────────────────────────────────

  decideNextMove(gameState) {
    const now = Date.now();
    if (now - this.lastDecision < this.thinkingTime) return null;
    this.lastDecision = now;

    const { currentPiece, board, heldPiece, canHold } = gameState;
    if (!currentPiece || !board) return null;

    // Detect piece change → invalidate stale state
    const curType = currentPiece.type;
    if (curType !== this._lastPieceType) {
      this._lastPieceType = curType;
      this._actionQueue = [];
      this._tspinState = null;
      if (this._holdCooldown > 0) this._holdCooldown--;
    }

    // ── T-Spin stateful execution ──
    if (this._tspinState) {
      return this._executeTSpinStep(gameState);
    }

    // Return queued actions
    if (this._actionQueue.length > 0) {
      return this._actionQueue.shift();
    }

    // Check board danger level
    const boardMaxH = this._getMaxHeight(board);
    const inDanger = boardMaxH >= 14;
    const boardHoles = this._countHoles(board);
    const boardReady = boardHoles <= 2; // Allow small imperfections

    // ── Hold logic (skip when board is dangerously high) ──
    if (canHold && this._holdCooldown <= 0 && !inDanger) {
      if (curType === 'T') {
        const tResult = this._findBestTSpinMove(board);
        if (tResult && tResult.isTSpin && tResult.linesCleared >= 2 && boardReady) {
          this._startTSpinExecution(tResult);
          this._piecesPlaced++;
          return this._executeTSpinStep(gameState);
        }
        // No good T-Spin — hold T for later
        if (boardReady && boardMaxH >= 3 && (!heldPiece || heldPiece.type !== 'T')) {
          this._holdCooldown = 2;
          return { action: 'hold' };
        }
        // Both are T or board not ready — play T with whatever T-Spin is available
        if (tResult && tResult.isTSpin && tResult.linesCleared >= 1 && boardReady) {
          this._startTSpinExecution(tResult);
          this._piecesPlaced++;
          return this._executeTSpinStep(gameState);
        }
      }

      // Held T — swap when board has a REAL opportunity
      if (heldPiece?.type === 'T' && curType !== 'T' && boardReady) {
        const tResult = this._findBestTSpinMove(board);
        if (tResult && tResult.isTSpin && tResult.linesCleared >= 2) {
          this._holdCooldown = 2;
          return { action: 'hold' };
        }
      }
    }

    // ── T-Spin execution (current piece is T, board is reasonable) ──
    if (curType === 'T' && !inDanger && boardReady) {
      const tResult = this._findBestTSpinMove(board);
      if (tResult && tResult.isTSpin && tResult.linesCleared >= 1) {
        this._startTSpinExecution(tResult);
        this._piecesPlaced++;
        return this._executeTSpinStep(gameState);
      }
    }

    // ── Standard placement for non-T (or T without T-Spin) ──
    const result = this._findBestMove(currentPiece, board);
    if (result) {
      this._actionQueue = this._buildNormalActionSequence(currentPiece, result.rotations, result.targetX);
      this._piecesPlaced++;
    } else {
      this._actionQueue = [{ action: 'drop' }];
    }

    return this._actionQueue.shift() || { action: 'down' };
  }

  // ─── Stateful T-Spin execution (phase machine) ────────────

  _startTSpinExecution(tResult) {
    console.log('[TSpinAI] Starting T-Spin execution:', {
      startCol: tResult.startCol, targetRot: tResult.targetRot,
      stopRow: tResult.stopRow, linesCleared: tResult.linesCleared, isTSpin: tResult.isTSpin
    });
    this._tspinState = {
      phase: 'move',
      startCol: tResult.startCol,
      targetRot: tResult.targetRot,
      stopRow: tResult.stopRow, // Row where soft-drop should stop
      rotationsLeft: tResult.targetRot,
      dropCount: 0
    };
    this._actionQueue = [];
  }

  /**
   * Execute T-Spin step by step:
   * 1. 'move': move to target column
   * 2. 'drop': soft-drop to the floor (check position each tick)
   * 3. 'rotate': rotate at the bottom (triggers real T-Spin detection!)
   * 4. 'lock': hard drop to lock
   */
  _executeTSpinStep(gameState) {
    const { currentPiece, board } = gameState;
    if (!currentPiece || !board) {
      this._tspinState = null;
      return null;
    }

    // Safety: abort if piece type changed (e.g., game over restart)
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
        // At target column → switch to drop phase
        state.phase = 'drop';
        // Immediately check if we need to drop
        return this._executeTSpinStep(gameState);
      }

      case 'drop': {
        // Check if piece has reached the target stopRow
        const curY = currentPiece.position?.y ?? 0;
        if (curY >= state.stopRow) {
          // At the target height! Switch to rotate phase
          console.log('[TSpinAI] Reached stopRow', state.stopRow, 'at y=', curY, '. Rotating', state.targetRot, 'times');
          state.phase = 'rotate';
          state.rotationsLeft = state.targetRot;
          return this._executeTSpinStep(gameState);
        }
        // Also check: can the piece still move down?
        const canDrop = this._canPieceMoveDown(currentPiece, board, H, W);
        if (!canDrop) {
          // Hit the floor before reaching stopRow — rotate anyway
          console.log('[TSpinAI] Hit floor at y=', curY, '(target was', state.stopRow, '). Rotating anyway');
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
        // All rotations done → lock
        console.log('[TSpinAI] Rotations done, locking. Piece pos:', currentPiece.position, 'isTSpin:', currentPiece.isTSpin);
        state.phase = 'lock';
        this._tspinState = null;
        return { action: 'drop' }; // hard drop to lock
      }

      default:
        this._tspinState = null;
        return null;
    }
  }

  /**
   * Check if the piece can move down by 1 without collision.
   * Must NOT send 'down' when this returns false, or the piece locks!
   */
  _canPieceMoveDown(piece, board, H, W) {
    const shape = piece.shape;
    const pos = piece.position;
    if (!shape || !pos) return false;

    for (let sy = 0; sy < shape.length; sy++) {
      for (let sx = 0; sx < shape[0].length; sx++) {
        if (!shape[sy][sx]) continue;
        const bx = pos.x + sx;
        const by = pos.y + sy + 1; // one row below
        if (bx < 0 || bx >= W) return false;
        if (by >= H) return false;
        if (by >= 0 && board[by][bx] != null) return false;
      }
    }
    return true;
  }

  // ─── T-Spin move finder ───────────────────────────────────

  /**
   * Find the best T-Spin move.
   * 
   * KEY INSIGHT: For TSD/TST, the T must stop at a specific height ABOVE the
   * absolute landing position, then rotate. The SRS kick pushes it DOWN into
   * the cavity. Dropping to the absolute bottom makes early kicks succeed 
   * (empty space above) and prevents the downward kicks from being used.
   *
   * Strategy: try rotation at EVERY valid height for each column, not just bottom.
   */
  _findBestTSpinMove(board) {
    const H = board.length;
    const W = board[0]?.length || 10;
    let bestScore = -Infinity;
    let bestMove = null;

    const spawnShape = T_SHAPES[0];

    for (let startCol = -1; startCol <= W; startCol++) {
      // Check if T fits at startCol near the top
      if (this._collides(spawnShape, board, startCol, 0, H, W) &&
          this._collides(spawnShape, board, startCol, -1, H, W) &&
          this._collides(spawnShape, board, startCol, -2, H, W)) {
        continue;
      }

      // Find the absolute bottom for rotation 0 at this column
      const bottomRow = this._findLandingRow(spawnShape, board, startCol, H, W);
      if (bottomRow == null) continue;

      // Try rotation at every valid height: from bottom up to 4 rows above
      // (T-Spin kicks only go down by 2, so checking 4 above is more than enough)
      const minRow = Math.max(0, bottomRow - 4);

      for (let dropRow = bottomRow; dropRow >= minRow; dropRow--) {
        // Verify T fits at this row in rotation 0
        if (this._collides(spawnShape, board, startCol, dropRow, H, W)) continue;

        for (let targetRot = 1; targetRot < 4; targetRot++) {
          const result = this._simulateTSpinAtHeight(board, startCol, dropRow, targetRot, H, W);
          if (!result) continue;

          const { finalCol, finalRow, isTSpin, sim, kickedRow } = result;
          if (!sim) continue;

          const linesCleared = this._countCompleteLines(sim);
          let score = this._evaluateForTSpin(sim);

          if (isTSpin && linesCleared >= 3) {
            score += 40000; // TST
          } else if (isTSpin && linesCleared >= 2) {
            score += 30000; // TSD
          } else if (isTSpin && linesCleared >= 1) {
            score += 12000; // TSS
          } else if (isTSpin) {
            score += 500;
          }

          if (score > bestScore) {
            bestScore = score;
            bestMove = {
              startCol,
              targetRot,
              stopRow: dropRow, // The row to stop soft-dropping at
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

  /**
   * Simulate T-Spin: T at (startCol, dropRow) in rotation 0,
   * then rotate to targetRot with SRS kicks.
   */
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
      // Try basic rotation
      if (!this._collides(nextShape, board, curCol, curRow, H, W)) {
        curRot = nextRot;
        rotated = true;
      } else {
        // Try SRS kicks
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

    // After rotation, the T might settle lower (hard drop)
    const finalShape = T_SHAPES[curRot];
    const settledRow = this._findLandingRow(finalShape, board, curCol, H, W);
    if (settledRow == null) return null;
    const finalRow = Math.max(curRow, settledRow);

    // T-Spin detection: check 3-corner rule at rotation position
    const isTSpin = this._checkTSpinCorners(curCol, curRow, board, H, W);

    // Place on board at final position
    const sim = this._placeOnBoard(finalShape, board, curCol, finalRow);
    if (!sim) return null;

    return { finalCol: curCol, finalRow, isTSpin, sim, kickedRow: curRow };
  }

  // ─── Best placement for non-T pieces ───────────────────────

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

  // ─── Board evaluation — non-T pieces ──
  //
  // Strategy: stack flat + maintain ONE "well" (2-col gap) for T-Spins.
  // The well should be at columns 3-4 or 6-7 (interior, not edges).
  // Rows filled 9/10 or 8/10 with gaps only at the well → TSD setup.
  //

  _evaluate(simBoard, originalBoard) {
    let score = 0;
    const H = simBoard.length;
    const W = simBoard[0].length;

    // Lines cleared
    const lines = this._countCompleteLines(simBoard);
    score += lines * 15000;
    if (lines >= 2) score += 5000;
    if (lines >= 4) score += 25000;

    // Remove complete lines for post-clear analysis
    const cleaned = this._removeCompleteLines(simBoard);
    const heights = this._getColumnHeights(cleaned);
    const maxH = Math.max(...heights);
    const totalH = heights.reduce((s, h) => s + h, 0);
    const avgH = totalH / W;

    // ─── Find the best "well column" (lowest interior column) ───
    // Prefer columns 2-7 (not edges). The well is where T-Spins will happen.
    let wellCol = -1;
    let wellH = Infinity;
    for (let x = 1; x < W - 1; x++) {
      if (heights[x] < wellH) {
        wellH = heights[x];
        wellCol = x;
      }
    }
    // Only treat as a well if it's meaningfully lower than neighbors
    const leftN = wellCol > 0 ? heights[wellCol - 1] : 0;
    const rightN = wellCol < W - 1 ? heights[wellCol + 1] : 0;
    const wellDepth = Math.min(leftN, rightN) - wellH;
    const hasWell = wellDepth >= 2 && wellCol >= 1 && wellCol <= W - 2;

    // ═══════════════════════════════════════════════════════════
    // 1. HOLES — worst thing possible
    // ═══════════════════════════════════════════════════════════
    const holes = this._countHoles(cleaned);
    score -= holes * 6000;

    // Covered holes depth penalty
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

    // ═══════════════════════════════════════════════════════════
    // 2. HEIGHT — keep board low
    // ═══════════════════════════════════════════════════════════
    score -= totalH * 30;
    score -= maxH * 150;
    if (maxH > 10) score -= (maxH - 10) * (maxH - 10) * 300;
    if (maxH > 15) score -= 60000;

    // ═══════════════════════════════════════════════════════════
    // 3. FLATNESS — stack evenly, but ALLOW the well column to be lower
    // ═══════════════════════════════════════════════════════════
    
    // Bumpiness: adjacent column height differences
    // The well column gets a reduced penalty (it's supposed to be lower!)
    let bump = 0;
    for (let i = 0; i < W - 1; i++) {
      const diff = Math.abs(heights[i] - heights[i + 1]);
      if (hasWell && (i === wellCol || i === wellCol - 1)) {
        bump += diff * 0.3; // Reduced penalty near well
      } else {
        bump += diff;
      }
    }
    score -= bump * 200;

    // Edge columns MUST be filled — they're essential for line clears
    for (const ex of [0, W - 1]) {
      if (heights[ex] === 0 && avgH > 2) score -= 4000;
      else if (heights[ex] < avgH - 3 && avgH > 3) score -= 1500;
    }

    // Non-well interior columns that are too low
    for (let x = 1; x < W - 1; x++) {
      if (hasWell && x === wellCol) continue; // well is exempt
      if (heights[x] === 0 && avgH > 2) score -= 2000;
    }

    // ═══════════════════════════════════════════════════════════
    // 4. DANGER MODE
    // ═══════════════════════════════════════════════════════════
    if (maxH > 14) {
      score += lines * 20000;
      return score;
    }

    // ═══════════════════════════════════════════════════════════
    // 5. T-SPIN WELL REWARDS  — the core of the strategy
    // ═══════════════════════════════════════════════════════════
    const setupScale = maxH <= 10 ? 1.0 : Math.max(0, 1.0 - (maxH - 10) * 0.2);
    
    if (setupScale > 0 && holes <= 1) {
      // ── Reward the well being 2-4 deep (ideal for TSD) ──
      if (hasWell) {
        if (wellDepth >= 2 && wellDepth <= 4) {
          score += 1500 * setupScale;
        } else if (wellDepth >= 5) {
          score += 500 * setupScale; // too deep, less useful
        }
      }

      // ── Reward rows that are 9/10 filled with gap at the well ──
      let nearCompleteAtWell = 0;
      for (let y = Math.max(0, H - 8); y < H; y++) {
        const filled = this._rowFilled(cleaned[y]);
        if (filled === 9) {
          // Check if the gap is at or near the well column
          if (hasWell && cleaned[y][wellCol] == null) {
            nearCompleteAtWell++;
            score += 1200 * setupScale; // Gap at well = perfect TSD setup
          } else {
            score += 300 * setupScale; // Still good, just not at well
          }
        } else if (filled === 8) {
          score += 150 * setupScale;
        }
      }
      
      // Multiple 9-filled rows with gap at well = TSD ready!
      if (nearCompleteAtWell >= 2) {
        score += 3000 * setupScale;
      }

      // ── Overhang detection at well edge (needed for T-Spin 3-corner) ──
      if (hasWell) {
        // Check for overhang: cell filled at wellCol±1 with empty below at wellCol
        for (let y = Math.max(1, H - 6); y < H; y++) {
          const wc = wellCol;
          // Left overhang: (wc-1, y) filled, (wc, y) empty, (wc, y-1) empty
          if (wc > 0 && cleaned[y][wc - 1] != null && cleaned[y][wc] == null) {
            if (y > 0 && cleaned[y - 1][wc] == null) {
              score += 800 * setupScale; // Overhang! T can twist under it
            }
          }
          // Right overhang: (wc+1, y) filled, (wc, y) empty
          if (wc < W - 1 && cleaned[y][wc + 1] != null && cleaned[y][wc] == null) {
            if (y > 0 && cleaned[y - 1][wc] == null) {
              score += 800 * setupScale;
            }
          }
        }
      }

      // ── Quick T-Spin slot detection ──
      const tsdSlots = this._countTSpinSlotsQuick(cleaned);
      score += tsdSlots * 500 * setupScale;
    }

    // ═══════════════════════════════════════════════════════════
    // 6. ROW QUALITY — penalize sparse rows
    // ═══════════════════════════════════════════════════════════
    for (let y = H - 1; y >= 0; y--) {
      const filled = this._rowFilled(cleaned[y]);
      if (filled === 0) break;
      if (filled >= 1 && filled <= 5) score -= (10 - filled) * 40;
    }

    return score;
  }

  /**
   * Evaluate board after T-Spin placement (cleanup quality).
   */
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

    // Bumpiness
    let bump = 0;
    for (let i = 0; i < heights.length - 1; i++) bump += Math.abs(heights[i] - heights[i + 1]);
    score -= bump * 150;

    // Reward low, clean board after T-Spin
    const avgH = totalH / heights.length;
    score += Math.max(0, 8 - avgH) * 200;

    return score;
  }

  // ─── T-Spin slot detection ─────────────────────────────────

  /**
   * Quick heuristic count of T-Spin readiness (for non-T evaluation).
   * Uses fast pattern matching instead of full simulation to keep perf tight.
   */
  _countTSpinSlotsQuick(board) {
    const H = board.length;
    const W = board[0]?.length || 10;
    let slots = 0;

    // Look for T-Spin-friendly patterns in the bottom 8 rows:
    // - Two adjacent rows where combined gap pattern fits a T
    // - Nook patterns (cell with walls on 2+ sides and open above)
    for (let y = Math.max(0, H - 8); y < H - 1; y++) {
      const f1 = this._rowFilled(board[y]);
      const f2 = this._rowFilled(board[y + 1]);

      // TSD pattern: one row with 7 filled (3-gap) + adjacent with 9 filled (1-gap)
      if ((f1 === 7 && f2 === 9) || (f1 === 9 && f2 === 7)) {
        slots += 2;
      }
      // Near-TSD: 8+9 or 9+8 combinations
      if ((f1 === 8 && f2 === 9) || (f1 === 9 && f2 === 8)) {
        slots += 1;
      }
      // TST pattern: 3 consecutive rows with 9, 8, 9
      if (y + 2 < H) {
        const f3 = this._rowFilled(board[y + 2]);
        if (f1 === 9 && f2 === 8 && f3 === 9) {
          slots += 3;
        }
      }
    }

    // Nook pattern: empty cell flanked by blocks on 2+ sides + open above
    for (let y = Math.max(2, H - 6); y < H; y++) {
      for (let x = 0; x < W; x++) {
        if (board[y][x] != null) continue; // must be empty
        let walls = 0;
        if (x === 0 || board[y][x - 1] != null) walls++;
        if (x === W - 1 || board[y][x + 1] != null) walls++;
        if (y === H - 1 || board[y + 1][x] != null) walls++;
        if (walls >= 2 && (y === 0 || board[y - 1][x] == null)) {
          slots += 1; // nook that T could twist into
        }
      }
    }

    return slots;
  }

  /**
   * Count overhang patterns that create T-Spin-friendly bumps.
   */
  _countOverhangPatterns(board) {
    const H = board.length;
    const W = board[0]?.length || 10;
    let count = 0;

    for (let y = 2; y < H - 1; y++) {
      for (let x = 0; x < W; x++) {
        if (board[y][x] != null) {
          // Cell filled, cell below is empty → overhang ledge
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

  /** 3-corner rule: ≥3 of 4 corners of the 3×3 T bounding box are filled/wall. */
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

  // ─── Action sequence builders ──────────────────────────────

  /**
   * Build normal action sequence: rotate → move → drop.
   */
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

  // ─── Shape / Board helpers ─────────────────────────────────

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

  /** Get max column height (fast, for danger checks). */
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
