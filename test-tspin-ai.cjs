/**
 * T-Spin AI Simulation Tests — Mathematically verified TSD/TST boards.
 *
 * KEY INSIGHT: The T in rotation 0 must have the overhang WITHIN its 3x3
 * bounding box.  Additionally, content must exist ABOVE the T (at col, R)
 * to prevent kicks 1 and 2 from succeeding in empty space.
 *
 * Board design (RIGHT side TSD via 0→1 kick 4 = (-1,+2) in screen coords):
 *
 *   Row 12: XXXXXXXX__   col 7=X → blocks kick 1 at (6,12) & kick 2 at (6,11)
 *   Row 13: __________   empty — T body space (cols 7,8,9)
 *   Row 14: XXXXXXX_X_   col 8=X "overhang" → blocks basic rotation & kick 3
 *                         col 7=_ cavity entrance for kick 4
 *   Row 15: XXXXXXX__X   gaps at 7,8 → T fills (7,15),(8,15) → COMPLETE
 *   Row 16: XXXXXXX_XX   gap at 7 → T fills (7,16) → COMPLETE
 *
 *   T0 at (col=7, row=12): nub=(8,12), body=(7,13),(8,13),(9,13)
 *   Landing: T0 at (7,13) → (8,14)=X → collision → land at 12.
 *   Basic T1 at (7,12): (8,12),(8,13),(9,13),(8,14)=X → BLOCKED
 *   Kick 1 (-1,0) at (6,12): (7,12)=X → BLOCKED
 *   Kick 2 (-1,-1) at (6,11): (7,12)=X → BLOCKED
 *   Kick 3 (0,+2) at (7,14): (8,14)=X → BLOCKED
 *   Kick 4 (-1,+2) at (6,14): (7,14)=_ (7,15)=_ (8,15)=_ (7,16)=_ → SUCCESS!
 *   T-Spin corners at (6,14): (6,14)=X (8,14)=X (6,16)=X (8,16)=X → 4/4 ✓
 *   Lines 15+16 complete after T fills → TSD!
 *
 * Coordinate system: row 0 = top, row 19 = bottom, +y = DOWN.
 */

// --- Constants ---
const SRS_KICKS_CW = {
  '0>1': [{ x: -1, y: 0 }, { x: -1, y: -1 }, { x: 0, y: 2 }, { x: -1, y: 2 }],
  '1>2': [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: -2 }, { x: 1, y: -2 }],
  '2>3': [{ x: 1, y: 0 }, { x: 1, y: -1 }, { x: 0, y: 2 }, { x: 1, y: 2 }],
  '3>0': [{ x: -1, y: 0 }, { x: -1, y: 1 }, { x: 0, y: -2 }, { x: -1, y: -2 }],
};

const T_SHAPES = [
  [[0,1,0],[1,1,1],[0,0,0]], // 0: spawn
  [[0,1,0],[0,1,1],[0,1,0]], // 1: right (R)
  [[0,0,0],[1,1,1],[0,1,0]], // 2: down (2)
  [[0,1,0],[1,1,0],[0,1,0]], // 3: left (L)
];

// --- Helpers ---
function collides(shape, board, col, row, H, W) {
  for (let sy = 0; sy < shape.length; sy++)
    for (let sx = 0; sx < shape[0].length; sx++) {
      if (!shape[sy][sx]) continue;
      const bx = col + sx, by = row + sy;
      if (bx < 0 || bx >= W || by >= H) return true;
      if (by >= 0 && board[by][bx] != null) return true;
    }
  return false;
}

function findLandingRow(shape, board, col, H, W) {
  for (let row = -shape.length; row < H; row++)
    if (collides(shape, board, col, row + 1, H, W)) return row;
  return H - shape.length;
}

function checkTSpinCorners(px, py, board, H, W) {
  let filled = 0;
  const chk = (x, y) => (x < 0 || x >= W || y < 0 || y >= H) ? true : board[y][x] != null;
  if (chk(px, py)) filled++;
  if (chk(px+2, py)) filled++;
  if (chk(px, py+2)) filled++;
  if (chk(px+2, py+2)) filled++;
  return filled >= 3;
}

function placeOnBoard(shape, board, col, row) {
  const H = board.length, W = board[0].length;
  const sim = board.map(r => [...r]);
  for (let sy = 0; sy < shape.length; sy++)
    for (let sx = 0; sx < shape[0].length; sx++) {
      if (!shape[sy][sx]) continue;
      const bx = col + sx, by = row + sy;
      if (bx < 0 || bx >= W || by < 0 || by >= H) return null;
      if (sim[by][bx] != null) return null;
      sim[by][bx] = 1;
    }
  return sim;
}

function countCompleteLines(board) {
  return board.filter(row => row.every(c => c != null)).length;
}

function simulateTSpin(board, startCol, targetRot, debug = false) {
  const H = board.length, W = board[0].length;
  const spawn = T_SHAPES[0];
  if (collides(spawn, board, startCol, 0, H, W) &&
      collides(spawn, board, startCol, -1, H, W) &&
      collides(spawn, board, startCol, -2, H, W)) return null;

  const bottomRow = findLandingRow(spawn, board, startCol, H, W);
  if (bottomRow == null) return null;

  let best = null;
  const minRow = Math.max(0, bottomRow - 4);

  for (let dropRow = bottomRow; dropRow >= minRow; dropRow--) {
    if (collides(spawn, board, startCol, dropRow, H, W)) continue;
    if (debug) console.log(`  [drop=${dropRow}] T0 at (${startCol},${dropRow})`);

    let rot = 0, cx = startCol, cy = dropRow, ok = true;
    while (rot !== targetRot) {
      const nr = (rot + 1) % 4, ns = T_SHAPES[nr];
      const kk = `${rot}>${nr}`;
      const kicks = SRS_KICKS_CW[kk];
      let done = false;

      if (!collides(ns, board, cx, cy, H, W)) {
        if (debug) console.log(`    ${rot}->${nr} basic (${cx},${cy}): OK`);
        rot = nr; done = true;
      } else {
        if (debug) console.log(`    ${rot}->${nr} basic (${cx},${cy}): BLOCKED`);
        for (let i = 0; i < kicks.length; i++) {
          const k = kicks[i], kx = cx + k.x, ky = cy + k.y;
          const bl = collides(ns, board, kx, ky, H, W);
          if (debug) console.log(`      kick${i+1} (${k.x},${k.y})->(${kx},${ky}): ${bl?'BLOCKED':'OK!'}`);
          if (!bl) { cx = kx; cy = ky; rot = nr; done = true; break; }
        }
      }
      if (!done) { ok = false; break; }
    }
    if (!ok) continue;

    const fs = T_SHAPES[rot];
    const sr = findLandingRow(fs, board, cx, H, W);
    if (sr == null) continue;
    const fy = Math.max(cy, sr);
    const tspin = rot > 0 && checkTSpinCorners(cx, cy, board, H, W);
    const sim = placeOnBoard(fs, board, cx, fy);
    if (!sim) continue;
    const lines = countCompleteLines(sim);

    if (debug) console.log(`    => pos=(${cx},${fy}) tspin=${tspin} lines=${lines}`);

    const r = { curCol: cx, curRow: cy, finalRow: fy, stopRow: dropRow, isTSpin: tspin, linesCleared: lines, targetRot };
    if (!best || (r.isTSpin && r.linesCleared > (best.linesCleared||0)) || (r.isTSpin && !best.isTSpin))
      best = r;
  }
  return best;
}

function makeBoard(pattern) {
  const rows = pattern.trim().split('\n').map(l => l.trim().split('').map(c => c==='X'?1:null));
  while (rows.length < 20) rows.unshift(new Array(10).fill(null));
  return rows;
}

function printBoard(board) {
  for (let y = 0; y < 20; y++) {
    const s = board[y].map(c => c!=null?'X':'_').join('');
    if (s !== '__________') console.log(`  ${String(y).padStart(2)}: ${s}`);
  }
}

// =====================================================
console.log('=== T-Spin Simulation Tests (SRS) ===\n');

// ----- TEST 1: TSD (T-Spin Double) -----
// T drops at col 7, lands at row 12 (body at 13, blocked by overhang at 14).
// Row 12 col 7=X blocks kicks 1,2. Row 14 col 8=X blocks basic+kick 3.
// Kick 4 (-1,+2) → T1 at (6,14). Lines 15+16 complete = TSD.
//
//   12: XXXXXXXX__   col 7=X blocks kicks; col 8,9=_ for T nub
//   13: __________   empty — T body: (7,13),(8,13),(9,13)
//   14: XXXXXXX_X_   col 7=_ cavity; col 8=X overhang; col 9=_ extra gap
//   15: XXXXXXX__X   cols 7,8=_ → T fills both → COMPLETE
//   16: XXXXXXX_XX   col 7=_ → T fills → COMPLETE
console.log('Test 1: TSD (T-Spin Double) — right side, kick 4 (-1,+2)');
const b1 = makeBoard(`
XXXXXXXX__
__________
XXXXXXX_X_
XXXXXXX__X
XXXXXXX_XX
__________
__________
__________
`);
printBoard(b1);
console.log('  Trace col=7 rot=1:');
simulateTSpin(b1, 7, 1, true);

let r1 = null;
for (let c = -1; c <= 10; c++)
  for (let rot = 1; rot < 4; rot++) {
    const r = simulateTSpin(b1, c, rot);
    if (r && r.isTSpin && r.linesCleared >= 2 && (!r1 || r.linesCleared > r1.linesCleared))
      r1 = { col: c, rot, ...r };
  }

if (r1) console.log(`  ✅ TSD! col=${r1.col} rot=${r1.rot} lines=${r1.linesCleared} kicked=(${r1.curCol},${r1.curRow})\n`);
else {
  console.log('  ❌ TSD not found. Scan:');
  for (let c = 5; c <= 9; c++) for (let rot = 1; rot < 4; rot++) {
    const r = simulateTSpin(b1, c, rot);
    console.log(`    c=${c} r=${rot}: ${r ? `lines=${r.linesCleared} ts=${r.isTSpin} @(${r.curCol},${r.curRow})` : 'fail'}`);
  }
  console.log('');
}

// ----- TEST 2: TST (T-Spin Triple) -----
// Same as TSD but row 14 has gap ONLY at col 7 (col 9=X) → T fills → 3 lines clear
//   12: XXXXXXXX__
//   13: __________
//   14: XXXXXXX_XX   gap only at 7 → T fills → COMPLETE (3rd line!)
//   15: XXXXXXX__X   gaps at 7,8 → T fills → COMPLETE
//   16: XXXXXXX_XX   gap at 7 → T fills → COMPLETE
console.log('Test 2: TST (T-Spin Triple) — right side');
const b2 = makeBoard(`
XXXXXXXX__
__________
XXXXXXX_XX
XXXXXXX__X
XXXXXXX_XX
__________
__________
__________
`);
printBoard(b2);

let r2 = null;
for (let c = -1; c <= 10; c++)
  for (let rot = 1; rot < 4; rot++) {
    const r = simulateTSpin(b2, c, rot);
    if (r && r.isTSpin && r.linesCleared >= 2 && (!r2 || r.linesCleared > r2.linesCleared))
      r2 = { col: c, rot, ...r };
  }

if (r2) {
  const t = r2.linesCleared >= 3 ? 'TST' : 'TSD';
  console.log(`  ✅ ${t}! col=${r2.col} rot=${r2.rot} lines=${r2.linesCleared} kicked=(${r2.curCol},${r2.curRow})\n`);
} else console.log('  ❌ No T-Spin found\n');

// ----- TEST 3: No false T-Spin on simple board -----
console.log('Test 3: No false T-Spin on clean board');
const b3 = makeBoard(`XXXX_XXXXX`);
let fp = false;
for (let c = -1; c <= 10; c++)
  for (let rot = 1; rot < 4; rot++) {
    const r = simulateTSpin(b3, c, rot);
    if (r && r.isTSpin && r.linesCleared >= 1) { fp = true; console.log(`  ⚠️ False! c=${c} r=${rot}`); }
  }
if (!fp) console.log('  ✅ No false T-Spin\n');

// ----- TEST 4: SRS kick table verification vs wiki -----
console.log('Test 4: SRS kick tables match wiki');
const wiki = { // wiki (+y=up) → ours (+y=down, negate y). Tests 2-5 only (test 1 is basic).
  '0>1': [[-1,0],[-1,-1],[0,2],[-1,2]],   // wiki: (-1,0),(-1,+1),(0,-2),(-1,-2)
  '1>2': [[1,0],[1,1],[0,-2],[1,-2]],       // wiki: (+1,0),(+1,-1),(0,+2),(+1,+2)
  '2>3': [[1,0],[1,-1],[0,2],[1,2]],        // wiki: (+1,0),(+1,+1),(0,-2),(+1,-2)
  '3>0': [[-1,0],[-1,1],[0,-2],[-1,-2]],    // wiki: (-1,0),(-1,-1),(0,+2),(-1,+2)
};
let ok = true;
for (const [k, exp] of Object.entries(wiki)) {
  const act = SRS_KICKS_CW[k];
  for (let i = 0; i < exp.length; i++)
    if (act[i].x !== exp[i][0] || act[i].y !== exp[i][1]) {
      console.log(`  ❌ ${k}[${i}]: want (${exp[i]}) got (${act[i].x},${act[i].y})`);
      ok = false;
    }
}
if (ok) console.log('  ✅ All kicks match\n');

console.log('=== Done ===');
