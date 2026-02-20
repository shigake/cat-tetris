import React from 'react';
import { motion } from 'framer-motion';
import TetrisBoard from '../TetrisBoard';
import NextPieces from '../NextPieces';
import HeldPiece from '../HeldPiece';
import Scoreboard from '../Scoreboard';

/**
 * DemonstrationScreen - CPU jogando e mostrando a técnica
 */
function DemonstrationScreen({
  gameState,
  isInitialized,
  demonstrationState,
  onPause,
  onResume,
  onSkip
}) {
  return (
    <motion.div
      key="demo"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center gap-6"
    >
      {/* Narração */}
      {demonstrationState.currentNarration && (
        <motion.div
          key={demonstrationState.currentNarration}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 max-w-3xl"
        >
          <div className="text-xl text-white leading-relaxed">
            {demonstrationState.currentNarration}
          </div>
        </motion.div>
      )}

      {/* Board */}
      {gameState && isInitialized && (
        <div className="bg-gray-900/50 rounded-xl p-6">
          <div className="text-white/80 mb-4 text-center">
            <span className="text-2xl">🎬</span>
            <span className="ml-2 text-lg font-bold">CPU jogando...</span>
          </div>
          
          <div className="flex gap-4">
            <HeldPiece heldPiece={gameState.heldPiece} canHold={gameState.canHold} />
            
            <TetrisBoard
              board={gameState.board}
              currentPiece={gameState.currentPiece}
              dropPreview={null}
              gameOver={gameState.gameOver}
            />

            <div className="flex flex-col gap-4">
              <NextPieces pieces={gameState.nextPieces || []} />
              <Scoreboard
                score={gameState.score?.points || 0}
                level={gameState.score?.level || 1}
                lines={gameState.score?.lines || 0}
                combo={gameState.score?.combo || 0}
              />
            </div>
          </div>
        </div>
      )}

      {/* Controles */}
      <div className="flex items-center gap-4">
        {demonstrationState.isPlaying && (
          demonstrationState.isPaused ? (
            <button
              onClick={onResume}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold text-lg"
            >
              ▶️ Continuar
            </button>
          ) : (
            <button
              onClick={onPause}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-bold text-lg"
            >
              ⏸️ Pausar
            </button>
          )
        )}

        <button
          onClick={onSkip}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold text-lg"
        >
          ⏭️ Ir para Prática
        </button>

        {/* Progress */}
        <div className="flex-1 bg-gray-700 rounded-full h-3 overflow-hidden min-w-[200px]">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full"
            initial={{ width: 0 }}
            animate={{ width: `${demonstrationState.progress * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="text-white/80 font-mono">
          {Math.round(demonstrationState.progress * 100)}%
        </div>
      </div>
    </motion.div>
  );
}

export default DemonstrationScreen;
