import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getPieceColor, getBlockShape } from '../utils/PieceGenerator';
import { getThemedCellStyle } from '../utils/BlockShapes';
import { gameEvents } from '../patterns/Observer.js';
import { useI18n } from '../hooks/useI18n';

const BUFFER_ROWS = 2;

function FloatingText({ text, color, id, index = 0 }) {
 const offsetY = index * 36;
 return (
 <motion.div
 key={id}
 initial={{ opacity: 1, y: offsetY, scale: 0.5 }}
 animate={{ opacity: 0, y: offsetY - 60, scale: 1.3 }}
 exit={{ opacity: 0 }}
 transition={{ duration: 1.2, ease: 'easeOut' }}
 className="absolute left-1/2 top-1/3 -translate-x-1/2 pointer-events-none font-black text-lg drop-shadow-lg whitespace-nowrap"
 style={{ color, zIndex: 50 - index, textShadow: `0 0 12px ${color}` }}
 >
 {text}
 </motion.div>
 );
}

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

const TetrisBoard = ({ board, currentPiece, dropPreview, gameOver, bufferRows, events }) => {
 const { t } = useI18n();
 const ev = events || gameEvents;
 const [clearingLines, setClearingLines] = useState([]);
 const [floatingTexts, setFloatingTexts] = useState([]);
 const [flashOpacity, setFlashOpacity] = useState(0);
 const textIdRef = useRef(0);
 const boardRef = useRef(null);
 const timersRef = useRef([]);

 useEffect(() => {
 return () => {
 timersRef.current.forEach(clearTimeout);
 timersRef.current = [];
 };
 }, []);

 const safeTimeout = useCallback((fn, ms) => {
 const id = setTimeout(() => {
 timersRef.current = timersRef.current.filter(t => t !== id);
 fn();
 }, ms);
 timersRef.current.push(id);
 return id;
 }, []);

 const boardWidth = board?.[0]?.length || 10;
 const extendedBoard = useMemo(
 () => {
 const topRows = bufferRows && bufferRows.length === BUFFER_ROWS
 ? bufferRows
 : Array(BUFFER_ROWS).fill(null).map(() => Array(boardWidth).fill(null));
 return [...topRows, ...board];
 },
 [board, boardWidth, bufferRows]
 );

 useEffect(() => {
 const handleHardDrop = () => {
 setFlashOpacity(0.12);
 safeTimeout(() => setFlashOpacity(0), 150);
 };
 ev.on('hard_drop', handleHardDrop);
 return () => ev.off('hard_drop', handleHardDrop);
 }, [safeTimeout, ev]);

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
 safeTimeout(() => setFlashOpacity(0), 250);
 safeTimeout(() => setClearingLines([]), 800);
 }
 }, [board]);

 useEffect(() => {
 const handleLineClear = (data) => {
 const n = data?.linesCleared || 0;
 if (n <= 0) return;
 let text, color;
 if (n === 1) { text = t('game.single'); color = '#4ECDC4'; }
 else if (n === 2) { text = t('game.double'); color = '#A78BFA'; }
 else if (n === 3) { text = t('game.triple'); color = '#F472B6'; }
 else { text = t('game.tetris'); color = '#FFD700'; }
 const id = ++textIdRef.current;
 setFloatingTexts(prev => [...prev, { id, text, color }]);
 safeTimeout(() => setFloatingTexts(prev => prev.filter(t => t.id !== id)), 1400);
 };
 ev.on('line_cleared', handleLineClear);
 return () => ev.off('line_cleared', handleLineClear);
 }, [safeTimeout, ev]);

 useEffect(() => {
 const handleScore = (data) => {
 const combo = data?.combo || 0;
 if (combo >= 2) {
 const id = ++textIdRef.current;
 setFloatingTexts(prev => [...prev, { id, text: t('game.combo', { n: combo }), color: '#FF6B6B' }]);
 safeTimeout(() => setFloatingTexts(prev => prev.filter(t => t.id !== id)), 1400);
 }
 };
 ev.on('score_updated', handleScore);
 return () => ev.off('score_updated', handleScore);
 }, [safeTimeout, ev]);

 useEffect(() => {
 const handleB2B = () => {
 const id = ++textIdRef.current;
 setFloatingTexts(prev => [...prev, { id, text: t('game.backToBack'), color: '#FBBF24' }]);
 safeTimeout(() => setFloatingTexts(prev => prev.filter(t => t.id !== id)), 1400);
 };
 ev.on('back_to_back', handleB2B);
 return () => ev.off('back_to_back', handleB2B);
 }, [safeTimeout, ev]);

 useEffect(() => {
 const handleTSpin = () => {
 const id = ++textIdRef.current;
 setFloatingTexts(prev => [...prev, { id, text: t('game.tSpin'), color: '#C084FC' }]);
 safeTimeout(() => setFloatingTexts(prev => prev.filter(t => t.id !== id)), 1400);
 };
 ev.on('t_spin', handleTSpin);
 return () => ev.off('t_spin', handleTSpin);
 }, [safeTimeout, ev]);

 const pieceCellSet = useMemo(() => {
 if (!currentPiece) return null;
 const s = new Set();
 const { position: { x: px, y: py }, shape } = currentPiece;
 for (let r = 0; r < shape.length; r++)
 for (let c = 0; c < shape[r].length; c++)
 if (shape[r][c]) s.add((py + r) * 100 + (px + c));
 return s;
 }, [currentPiece, currentPiece?.position?.x, currentPiece?.position?.y, currentPiece?.rotationState]);

 const previewCellSet = useMemo(() => {
 if (!dropPreview || dropPreview === currentPiece) return null;
 const s = new Set();
 const { position: { x: px, y: py }, shape } = dropPreview;
 for (let r = 0; r < shape.length; r++)
 for (let c = 0; c < shape[r].length; c++)
 if (shape[r][c]) s.add((py + r) * 100 + (px + c));
 return s;
 }, [dropPreview, dropPreview?.position?.x, dropPreview?.position?.y, currentPiece]);

 const clearingSet = useMemo(() => new Set(clearingLines), [clearingLines]);

 const themeName = getBlockShape();

 const renderCell = useCallback((cell, x, boardY, isBufferRow) => {
 const key = boardY * 100 + x;
 const isPiece = pieceCellSet?.has(key);
 const isPreview = !isPiece && previewCellSet?.has(key);
 const isClearing = clearingSet.has(boardY);

 if (isPiece) {
 const color = getPieceColor(currentPiece.color);
 return (
 <div
 key={`${x}-${boardY}`}
 className="tetris-cell flex items-center justify-center"
 style={getThemedCellStyle(themeName, color)}
 />
 );
 }

 if (isPreview) {
 const color = getPieceColor(dropPreview.color);
 const themeStyle = getThemedCellStyle(themeName, color);
 return (
 <div
 key={`${x}-${boardY}`}
 className="tetris-cell flex items-center justify-center"
 style={{ ...themeStyle, opacity: 0.25, border: `2px dashed ${color}80` }}
 />
 );
 }

 if (cell) {
 const color = getPieceColor(cell.color);
 const themeStyle = getThemedCellStyle(themeName, color);
 if (isClearing) {
 return (
 <div
 key={`${x}-${boardY}`}
 className="cat-block tetris-cell flex items-center justify-center line-clearing"
 style={{
 ...themeStyle,
 background: '#fff',
 boxShadow: `0 0 20px #fff, 0 0 40px ${color}`,
 transform: 'scale(1.1)',
 transition: 'all 0.15s ease-out',
 zIndex: 10,
 }}
 />
 );
 }
 return (
 <div
 key={`${x}-${boardY}`}
 className="cat-block tetris-cell flex items-center justify-center"
 style={themeStyle}
 />
 );
 }

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
 }, [pieceCellSet, previewCellSet, clearingSet, currentPiece, dropPreview, themeName]);

 return (
 <div className="flex flex-col items-center">
 <div
 className="relative bg-gray-900/60 p-3 rounded-xl border-2 border-white/15 shadow-2xl overflow-hidden flex-shrink-0"
 ref={boardRef}
 style={{ width: 'fit-content' }}
 >
 <div className="relative">

 <div className="tetris-grid">
 {extendedBoard.map((row, vy) => {
 const boardY = vy - BUFFER_ROWS;
 const isBufferRow = vy < BUFFER_ROWS;
 return row.map((cell, x) => renderCell(cell, x, boardY, isBufferRow));
 })}
 </div>

 {clearingLines.length > 0 && (
 <>
 <LineClearParticles lines={clearingLines} />
 </>
 )}

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

 <AnimatePresence>
 {floatingTexts.map((ft, i) => (
 <FloatingText key={ft.id} id={ft.id} text={ft.text} color={ft.color} index={i} />
 </AnimatePresence>

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
  <div className="text-white font-black text-xl drop-shadow-lg">{t('game.gameOver')}</div>
 </motion.div>
 </motion.div>
 )}
 </div>
 </div>
 </div>
 );
};

export default React.memo(TetrisBoard);
