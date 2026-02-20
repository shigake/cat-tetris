import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import TetrisBoard from '../TetrisBoard';
import NextPieces from '../NextPieces';
import HeldPiece from '../HeldPiece';
import Scoreboard from '../Scoreboard';

/**
 * DemoScreen - IA joga enquanto o usuário assiste e aprende
 */
function DemoScreen({ lesson, gameState, isInitialized, demoComplete, dropPreview, statusLabel, onSkip }) {
  if (!gameState || !isInitialized) {
    return (
      <div className="text-center text-white/40 text-sm py-12">
        Preparando demonstração...
      </div>
    );
  }

  // Pick a tip to show based on current score progress
  const currentTip = useMemo(() => {
    if (!lesson.intro || lesson.intro.length === 0) return null;
    const lines = gameState.score?.lines || 0;
    const idx = Math.min(Math.floor(lines / 2), lesson.intro.length - 1);
    return lesson.intro[idx];
  }, [lesson.intro, gameState.score?.lines]);

  return (
    <motion.div
      key="demo"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center"
    >
      {/* Header badge */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 mb-3 max-w-md mx-auto">
        <div className="flex items-center justify-center gap-2">
          <span className="text-lg">🤖</span>
          <p className="text-sm font-semibold text-blue-300">
            IA jogando — observe como ela faz!
          </p>
        </div>
        {statusLabel && (
          <p className="text-xs text-blue-400/70 mt-1">{statusLabel}</p>
        )}
      </div>

      {/* Current tip */}
      {currentTip && (
        <motion.div
          key={currentTip}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/[0.04] border border-white/[0.06] rounded-lg p-2.5 mb-3 max-w-md mx-auto"
        >
          <p className="text-xs text-white/60">💡 {currentTip}</p>
        </motion.div>
      )}

      {/* Board Layout */}
      <div className="flex gap-3 justify-center items-start">
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
            score={gameState.score?.points || 0}
            level={gameState.score?.level || 1}
            lines={gameState.score?.lines || 0}
            combo={gameState.score?.combo || 0}
          />
        </div>
      </div>

      {/* Skip / Done button */}
      <div className="mt-4">
        {demoComplete ? (
          <motion.button
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onSkip}
            className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500
                     text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-emerald-900/30 transition-all"
          >
            🎮  Agora é sua vez!
          </motion.button>
        ) : (
          <button
            onClick={onSkip}
            className="text-white/30 hover:text-white/50 text-xs transition-all"
          >
            Pular demonstração →
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default DemoScreen;
