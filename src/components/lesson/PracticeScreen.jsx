import React from 'react';
import { motion } from 'framer-motion';
import TetrisBoard from '../TetrisBoard';
import NextPieces from '../NextPieces';
import HeldPiece from '../HeldPiece';
import Scoreboard from '../Scoreboard';

/**
 * PracticeScreen - Jogador pratica a técnica com jogo real
 */
function PracticeScreen({ lesson, gameState, isInitialized, practiceState, onRestart, dropPreview }) {
  if (!gameState || !isInitialized) {
    return (
      <div className="text-center text-white/40 text-sm py-12">
        Carregando...
      </div>
    );
  }

  return (
    <motion.div
      key="practice"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center"
    >
      {/* Objetivo + Progress */}
      <div className="bg-white/[0.06] border border-white/[0.06] rounded-xl p-3 mb-3 max-w-md mx-auto">
        <p className="text-sm font-semibold text-white mb-2">
          🎯 {lesson.practice.objective}
        </p>
        {practiceState.progress > 0 && (
          <div>
            <div className="h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${
                  practiceState.complete
                    ? 'bg-emerald-400'
                    : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, practiceState.progress * 100)}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="text-white/30 text-[10px] mt-1">
              {Math.round(practiceState.progress * 100)}%
            </div>
          </div>
        )}
      </div>

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

      {/* Controls hint */}
      <div className="mt-3 text-white/20 text-[10px]">
        ⬅️➡️ Mover  ⬆️ Rotação  ⬇️ Soft Drop  Espaço: Hard Drop  C: Hold
      </div>

      {/* Feedback */}
      {practiceState.feedback && !practiceState.complete && (
        <motion.div
          key={practiceState.feedback}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 bg-white/[0.06] border border-white/[0.08] rounded-lg p-3 max-w-md mx-auto"
        >
          <p className="text-sm text-white/70">{practiceState.feedback}</p>
        </motion.div>
      )}

      {/* Game Over / Restart */}
      {gameState.gameOver && !practiceState.complete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4"
        >
          <p className="text-white/40 text-sm mb-2">Game Over — tente de novo!</p>
          <button
            onClick={onRestart}
            className="bg-white/[0.08] hover:bg-white/[0.12] text-white text-sm px-4 py-2 rounded-lg transition-all"
          >
            🔄 Recomeçar
          </button>
        </motion.div>
      )}

      {/* Complete */}
      {practiceState.complete && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.4 }}
          className="mt-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6 max-w-sm mx-auto"
        >
          <div className="text-4xl mb-2">🎉</div>
          <h3 className="text-lg font-bold text-white mb-1">Parabéns!</h3>
          <p className="text-emerald-300/70 text-sm">{practiceState.feedback}</p>
        </motion.div>
      )}
    </motion.div>
  );
}

export default PracticeScreen;
