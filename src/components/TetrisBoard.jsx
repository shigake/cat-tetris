import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getPieceColor } from '../utils/PieceGenerator';
import { gameEvents } from '../patterns/Observer.js';

// Number of extra rows above the board to show spawning pieces
const BUFFER_ROWS = 2;

// ─── Floating score/combo popup ───
function FloatingText({ text, color, id }) {
  return (
    <motion.div
      key={id}
      initial={{ opacity: 1, y: 0, scale: 0.5 }}
      animate={{ opacity: 0, y: -60, scale: 1.3 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
      className="absolute left-1/2 top-1/3 -translate-x-1/2 pointer-events-none font-black text-lg drop-shadow-lg whitespace-nowrap"
      style={{ color, zIndex: 50, textShadow: `0 0 12px ${color}` }}
    >
      {text}
    </motion.div>
  );
}

// ─── Spark particles for line clear ───
function LineClearParticles({ lines }) {
  const particles = useMemo(() => {
    const p = [];
    lines.forEach(lineY => {
      for (let i = 0; i < 14; i++) {
        p.push({
          id: `${lineY}-${i}`,
          startX: Math.random() * 220,
          startY: (lineY + BUFFER_ROWS) * 21 + 10,
          endX: (Math.random() - 0.5) * 300,
          endY: -(Math.random() * 120 + 40),
          size: Math.random() * 5 + 2,
          color: ['#FFD700', '#FF6B6B', '#4ECDC4', '#A78BFA', '#F472B6', '#34D399'][Math.floor(Math.random() * 6)],
          delay: Math.random() * 0.15,
        });
      }
    });
    return p;
  }, [lines]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible" style={{ zIndex: 35 }}>
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ x: p.startX, y: p.startY, scale: 1, opacity: 1 }}
          animate={{ x: p.startX + p.endX, y: p.startY + p.endY, scale: 0, opacity: 0 }}
          transition={{ duration: 0.8, delay: p.delay, ease: 'easeOut' }}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            boxShadow: `0 0 ${p.size + 4}px ${p.color}`,
          }}
        />
      ))}
    </div>
  );
}

// ─── (effects removed for clean play) ───

const TetrisBoard = ({ board, currentPiece, dropPreview, gameOver }) => {
  const [clearingLines, setClearingLines] = useState([]);
  const [floatingTexts, setFloatingTexts] = useState([]);
  const [flashOpacity, setFlashOpacity] = useState(0);
  const textIdRef = useRef(0);
  const boardRef = useRef(null);

  // Build extended board: 2 empty buffer rows + actual board rows
  const boardWidth = board?.[0]?.length || 10;
  const extendedBoard = useMemo(
    () => [...Array(BUFFER_ROWS).fill(null).map(() => Array(boardWidth).fill(null)), ...board],
    [board, boardWidth]
  );

  // ─── Hard drop: flash ───
  useEffect(() => {
    const handleHardDrop = () => {
      setFlashOpacity(0.12);
      setTimeout(() => setFlashOpacity(0), 150);
    };
    gameEvents.on('hard_drop', handleHardDrop);
    return () => gameEvents.off('hard_drop', handleHardDrop);
  }, []);

  // ─── Line clear detection (visual) ───
  useEffect(() => {
    const linesToClear = [];
    for (let y = 0; y < board.length; y++) {
      if (board[y] && board[y].every(cell => cell !== null)) {
        linesToClear.push(y);
      }
    }
    if (linesToClear.length > 0) {
      setClearingLines(linesToClear);
      setFlashOpacity(linesToClear.length >= 4 ? 0.3 : 0.18);
      setTimeout(() => setFlashOpacity(0), 250);
      setTimeout(() => setClearingLines([]), 800);
    }
  }, [board]);

  // ─── Line clear event: floating text ───
  useEffect(() => {
    const handleLineClear = (data) => {
      const n = data?.linesCleared || 0;
      if (n <= 0) return;
      let text, color;
      if (n === 1) { text = 'Single'; color = '#4ECDC4'; }
      else if (n === 2) { text = 'Double!'; color = '#A78BFA'; }
      else if (n === 3) { text = 'Triple!!'; color = '#F472B6'; }
      else { text = '\u2728 TETRIS!! \u2728'; color = '#FFD700'; }
      const id = ++textIdRef.current;
      setFloatingTexts(prev => [...prev, { id, text, color }]);
      setTimeout(() => setFloatingTexts(prev => prev.filter(t => t.id !== id)), 1400);
    };
    gameEvents.on('line_cleared', handleLineClear);
    return () => gameEvents.off('line_cleared', handleLineClear);
  }, []);

  // ─── Combo popup ───
  useEffect(() => {
    const handleScore = (data) => {
      const combo = data?.combo || 0;
      if (combo >= 2) {
        const id = ++textIdRef.current;
        setFloatingTexts(prev => [...prev, { id, text: `${combo}x Combo! \uD83D\uDD25`, color: '#FF6B6B' }]);
        setTimeout(() => setFloatingTexts(prev => prev.filter(t => t.id !== id)), 1400);
      }
    };
    gameEvents.on('score_updated', handleScore);
    return () => gameEvents.off('score_updated', handleScore);
  }, []);

  // ─── Back-to-Back popup ───
  useEffect(() => {
    const handleB2B = () => {
      const id = ++textIdRef.current;
      setFloatingTexts(prev => [...prev, { id, text: '\uD83C\uDF1F Back-to-Back!', color: '#FBBF24' }]);
      setTimeout(() => setFloatingTexts(prev => prev.filter(t => t.id !== id)), 1400);
    };
    gameEvents.on('back_to_back', handleB2B);
    return () => gameEvents.off('back_to_back', handleB2B);
  }, []);

  // ─── T-Spin ───
  useEffect(() => {
    const handleTSpin = () => {
      const id = ++textIdRef.current;
      setFloatingTexts(prev => [...prev, { id, text: 'T-SPIN!', color: '#C084FC' }]);
      setTimeout(() => setFloatingTexts(prev => prev.filter(t => t.id !== id)), 1400);
    };
    gameEvents.on('t_spin', handleTSpin);
    return () => gameEvents.off('t_spin', handleTSpin);
  }, []);

  // ─── Render cell ───
  const renderCell = useCallback((cell, x, boardY, isBufferRow) => {
    let currentPieceCell = null;
    let dropPreviewCell = null;
    const isClearing = clearingLines.includes(boardY);

    if (currentPiece) {
      const { position: { x: px0, y: py0 }, shape } = currentPiece;
      for (let py = 0; py < shape.length; py++) {
        for (let ppx = 0; ppx < shape[py].length; ppx++) {
          if (shape[py][ppx] && px0 + ppx === x && py0 + py === boardY) {
            currentPieceCell = currentPiece;
          }
        }
        if (currentPieceCell) break;
      }
    }

    if (dropPreview && dropPreview !== currentPiece) {
      const { position: { x: px0, y: py0 }, shape } = dropPreview;
      for (let py = 0; py < shape.length; py++) {
        for (let ppx = 0; ppx < shape[py].length; ppx++) {
          if (shape[py][ppx] && px0 + ppx === x && py0 + py === boardY) {
            dropPreviewCell = dropPreview;
          }
        }
        if (dropPreviewCell) break;
      }
    }

    // Active piece
    if (currentPieceCell) {
      const color = getPieceColor(currentPieceCell.color);
      return (
        <div
          key={`${x}-${boardY}`}
          className="tetris-cell rounded-sm flex items-center justify-center border border-white/40"
          style={{
            backgroundColor: color,
            boxShadow: `0 0 6px ${color}80, inset 0 1px 0 rgba(255,255,255,0.3)`,
          }}
        >
          <span className="text-xs drop-shadow">{currentPieceCell.emoji}</span>
        </div>
      );
    }

    // Ghost / drop preview
    if (dropPreviewCell) {
      const color = getPieceColor(dropPreviewCell.color);
      return (
        <div
          key={`${x}-${boardY}`}
          className="tetris-cell rounded-sm flex items-center justify-center border-2 border-dashed"
          style={{ borderColor: color + '50', backgroundColor: color + '12' }}
        >
          <span className="text-xs opacity-30">{dropPreviewCell.emoji}</span>
        </div>
      );
    }

    // Placed block
    if (cell) {
      const color = getPieceColor(cell.color);
      return (
        <div
          key={`${x}-${boardY}`}
          className={`cat-block tetris-cell rounded-sm flex items-center justify-center ${isClearing ? 'line-clearing' : ''}`}
          style={{
            backgroundColor: isClearing ? '#fff' : color,
            borderColor: 'rgba(255, 255, 255, 0.35)',
            boxShadow: isClearing
              ? `0 0 20px #fff, 0 0 40px ${color}`
              : `inset 0 1px 0 rgba(255,255,255,0.25), 0 1px 3px rgba(0,0,0,0.3)`,
            transform: isClearing ? 'scale(1.1)' : undefined,
            transition: 'all 0.15s ease-out',
            zIndex: isClearing ? 10 : 1,
          }}
        >
          <span className={`text-xs ${isClearing ? 'opacity-0' : ''}`}>{cell.emoji}</span>
        </div>
      );
    }

    // Empty cell
    return (
      <div
        key={`${x}-${boardY}`}
        className={`tetris-cell rounded-sm ${
          isBufferRow
            ? 'bg-gray-900/30 border border-gray-500/10'
            : 'border border-white/[0.06] bg-white/[0.02]'
        }`}
      />
    );
  }, [currentPiece, dropPreview, clearingLines]);

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative bg-gray-900/60 p-3 rounded-xl border-2 border-white/15 shadow-2xl overflow-hidden flex-shrink-0"
        ref={boardRef}
        style={{ width: 'fit-content' }}
      >
        <div className="relative">
          {/* Grid */}
          <div className="tetris-grid">
            {extendedBoard.map((row, vy) => {
              const boardY = vy - BUFFER_ROWS;
              const isBufferRow = vy < BUFFER_ROWS;
              return row.map((cell, x) => renderCell(cell, x, boardY, isBufferRow));
            })}
          </div>

          {/* Line clear: sweep + particles */}
          {clearingLines.length > 0 && (
            <>
              <LineClearParticles lines={clearingLines} />
            </>
          )}



          {/* Flash overlay */}
          <AnimatePresence>
            {flashOpacity > 0 && (
              <motion.div
                key="flash"
                initial={{ opacity: flashOpacity }}
                animate={{ opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 rounded-lg pointer-events-none"
                style={{ background: 'white', zIndex: 20 }}
              />
            )}
          </AnimatePresence>

          {/* Floating texts */}
          <AnimatePresence>
            {floatingTexts.map(ft => (
              <FloatingText key={ft.id} id={ft.id} text={ft.text} color={ft.color} />
            ))}
          </AnimatePresence>

          {/* Game Over overlay */}
          {gameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center rounded-lg"
              style={{ zIndex: 50 }}
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 12 }}
                className="text-center"
              >
                <div className="text-5xl mb-2">���</div>
                <div className="text-white font-black text-xl drop-shadow-lg">Game Over!</div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TetrisBoard;
