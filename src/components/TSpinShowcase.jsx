import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TetrisBoard from './TetrisBoard';
import NextPieces from './NextPieces';
import HeldPiece from './HeldPiece';
import Scoreboard from './Scoreboard';
import { useTSpinShowcase } from '../hooks/useTSpinShowcase';

export default function TSpinShowcase({ onClose }) {
  const {
    gameState,
    tspinCount,
    tspinFlash,
    getDropPreview
  } = useTSpinShowcase(true);

  const dropPreview = useMemo(() => getDropPreview(), [gameState, getDropPreview]);

  if (!gameState) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-violet-950 to-slate-950 flex items-center justify-center">
        <p className="text-white/50 animate-pulse">Preparando IA T-Spin Expert...</p>
      </div>
    );
  }

  const score = gameState.score;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-violet-950 to-slate-950 flex flex-col items-center justify-center p-3 relative overflow-hidden select-none">

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 text-center mb-3">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 tracking-tight">
          🌀 T-Spin Master
        </h1>
        <p className="text-white/40 text-xs mt-1">IA Expert jogando — observe as T-Spins!</p>
      </div>

      <AnimatePresence>
        <motion.div
          key={tspinCount}
          initial={tspinFlash ? { scale: 1.4, opacity: 0.5 } : false}
          animate={{ scale: 1, opacity: 1 }}
          className={`relative z-10 mb-3 px-6 py-2 rounded-2xl border text-center transition-colors duration-300 ${
            tspinFlash
              ? 'bg-purple-500/30 border-purple-400/60 shadow-lg shadow-purple-500/30'
              : 'bg-white/[0.05] border-white/[0.08]'
          }`}
        >
          <span className="text-xs text-white/40 uppercase tracking-wider font-semibold">T-Spins</span>
          <div className={`text-4xl font-black tabular-nums transition-colors duration-300 ${
            tspinFlash ? 'text-purple-300' : 'text-white'
          }`}>
            {tspinCount}
          </div>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {tspinFlash && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.2, y: -20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
          >
            <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-300 drop-shadow-[0_0_30px_rgba(168,85,247,0.7)]">
              T-SPIN!
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 flex gap-3 justify-center items-start">
        <HeldPiece heldPiece={gameState.heldPiece} canHold={gameState.canHold} />

        <TetrisBoard
          board={gameState.board}
          currentPiece={gameState.currentPiece}
          dropPreview={dropPreview}
          gameOver={gameState.gameOver}
        />

        <div className="flex flex-col gap-3">
          <NextPieces pieces={gameState.nextPieces || []} />
          <Scoreboard
            score={score?.points || 0}
            level={score?.level || 1}
            lines={score?.lines || 0}
            combo={score?.combo || 0}
          />

          <div className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-3 text-xs space-y-1.5">
            <Stat label="T-Spins" value={tspinCount} highlight />
            <Stat label="Score" value={(score?.points || 0).toLocaleString()} />
            <Stat label="Linhas" value={score?.lines || 0} />
            <Stat label="Nível" value={score?.level || 1} />
            <Stat label="Back-to-Back" value={gameState.backToBack ? '✓' : '–'} />
          </div>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClose}
        className="relative z-10 mt-4 px-6 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white/70 hover:text-white text-sm font-medium border border-white/10 transition-all"
      >
        ← Voltar ao Menu
      </motion.button>
    </div>
  );
}

function Stat({ label, value, highlight }) {
  return (
    <div className="flex justify-between">
      <span className="text-white/40">{label}</span>
      <span className={highlight ? 'font-bold text-purple-300' : 'text-white/70 font-mono'}>{value}</span>
    </div>
  );
}

