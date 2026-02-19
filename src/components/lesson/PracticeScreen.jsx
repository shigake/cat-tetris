import React from 'react';
import { motion } from 'framer-motion';
import TetrisBoard from '../TetrisBoard';
import NextPieces from '../NextPieces';
import HeldPiece from '../HeldPiece';
import Scoreboard from '../Scoreboard';

/**
 * PracticeScreen - Jogador pratica a técnica
 */
function PracticeScreen({ lesson, gameState, isInitialized, practiceState, showHint }) {
  if (!gameState || !isInitialized) {
    return (
      <div className="text-center text-white text-xl">
        Carregando prática...
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
      {/* Objetivo */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 mb-6 max-w-3xl mx-auto">
        <div className="text-sm uppercase text-white/80 mb-2">🎯 Objetivo</div>
        <p className="text-2xl font-bold text-white">
          {lesson.practice.objective}
        </p>
      </div>

      {/* Progress */}
      {practiceState.progress > 0 && (
        <div className="mb-4">
          <div className="bg-gray-700 rounded-full h-4 overflow-hidden max-w-md mx-auto">
            <motion.div
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-full"
              initial={{ width: 0 }}
              animate={{ width: `${practiceState.progress * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="text-white/60 text-sm mt-2">
            Progresso: {Math.round(practiceState.progress * 100)}%
          </div>
        </div>
      )}

      {/* Board */}
      <div className="bg-gray-900/50 rounded-xl p-6 max-w-4xl mx-auto">
        <div className="flex gap-4 justify-center">
          <HeldPiece heldPiece={gameState.heldPiece} />
          
          <TetrisBoard
            board={gameState.board}
            currentPiece={gameState.currentPiece}
            dropPreview={gameState.dropPreview}
            clearingLines={gameState.clearingLines || []}
          />

          <div className="flex flex-col gap-4">
            <NextPieces nextPieces={gameState.nextPieces || []} />
            <Scoreboard score={gameState.score} />
          </div>
        </div>

        {/* Controles */}
        <div className="mt-4 text-white/60 text-sm">
          <p>⬅️➡️ Mover | ⬆️ Rotação | ⬇️ Soft Drop | Espaço: Hard Drop</p>
        </div>
      </div>

      {/* Feedback */}
      {practiceState.feedback && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-blue-600/20 border-2 border-blue-500 rounded-xl p-4 max-w-2xl mx-auto"
        >
          <p className="text-xl text-white">{practiceState.feedback}</p>
        </motion.div>
      )}

      {/* Hint */}
      {showHint && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 bg-yellow-600/20 border-2 border-yellow-500 rounded-xl p-4 max-w-2xl mx-auto"
        >
          <div className="text-yellow-400 font-bold mb-2">💡 Dica</div>
          <p className="text-white">{showHint}</p>
        </motion.div>
      )}

      {/* Complete */}
      {practiceState.complete && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          className="mt-6 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-8 max-w-2xl mx-auto"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-3xl font-bold text-white mb-2">Parabéns!</h3>
          <p className="text-xl text-white/90">Você completou esta lição!</p>
        </motion.div>
      )}
    </motion.div>
  );
}

export default PracticeScreen;
