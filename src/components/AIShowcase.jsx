import React, { useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TetrisBoard from './TetrisBoard';
import NextPieces from './NextPieces';
import HeldPiece from './HeldPiece';
import Scoreboard from './Scoreboard';
import { useAIShowcase } from '../hooks/useAIShowcase';
import { useGamepadNav } from '../hooks/useGamepadNav';

export default function AIShowcase({ onClose }) {
  const {
    gameState,
    stats,
    comboFlash,
    getDropPreview
  } = useAIShowcase(true);

  const handleBack = useCallback(() => onClose(), [onClose]);

  const { selectedIndex } = useGamepadNav({
    itemCount: 1,
    onConfirm: handleBack,
    onBack: handleBack,
    active: true,
  });

  const dropPreview = useMemo(() => getDropPreview(), [gameState, getDropPreview]);

  if (!gameState) {
    return (
      <div className="h-screen bg-gradient-to-b from-slate-950 via-violet-950 to-slate-950 flex items-center justify-center overflow-hidden">
        <p className="text-white/50 animate-pulse">Preparando IA Expert...</p>
      </div>
    );
  }

  const score = gameState.score;

  return (
    <div className="h-screen bg-gradient-to-b from-slate-950 via-violet-950 to-slate-950 flex flex-col overflow-hidden select-none">

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="flex items-center justify-between px-3 py-1.5 bg-black/30 backdrop-blur-sm border-b border-white/10 shrink-0 relative z-10">
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className={`bg-white/15 hover:bg-white/25 text-white p-1.5 rounded-lg transition-colors ${selectedIndex === 0 ? 'ring-2 ring-yellow-400' : ''}`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
          </motion.button>
          <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">🤖 Cat Tetris AI</span>
        </div>

        <div className={`flex items-center gap-3 text-xs px-3 py-1 rounded-full transition-colors duration-300 ${
          comboFlash ? 'bg-cyan-500/30 text-cyan-300' : 'text-white/60'
        }`}>
          <span className="font-bold">{stats.lines} linhas</span>
          <span>T:{stats.tetrises}</span>
          <span>C:{stats.combos}</span>
          <span>Max:{stats.maxCombo}</span>
        </div>

        <div className="text-xs text-white/50">
          <span className="text-yellow-400 font-bold">{(score?.points || 0).toLocaleString()}</span>
          <span className="ml-2">Nv.{score?.level || 1}</span>
        </div>
      </div>

      <AnimatePresence>
        {comboFlash && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.2, y: -20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
          >
            <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-yellow-300 drop-shadow-[0_0_30px_rgba(34,211,238,0.7)]">
              COMBO!
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex items-center justify-center overflow-hidden p-2 relative z-10">
        <div className="flex gap-2 justify-center items-start">
          <HeldPiece heldPiece={gameState.heldPiece} canHold={gameState.canHold} />

        <TetrisBoard
          board={gameState.board}
          currentPiece={gameState.currentPiece}
          dropPreview={dropPreview}
          gameOver={gameState.gameOver}
        />

        <div className="flex flex-col gap-2">
          <NextPieces pieces={gameState.nextPieces || []} />
          <Scoreboard
            score={score?.points || 0}
            level={score?.level || 1}
            lines={score?.lines || 0}
            combo={score?.combo || 0}
          />
        </div>
      </div>
      </div>
    </div>
  );
}

