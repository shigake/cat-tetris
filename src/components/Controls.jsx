import React from 'react';
import { motion } from 'framer-motion';

const Controls = ({ onMove, onRotate, onHardDrop, onPause, onHold, isPaused, gameOver, canHold }) => {
  const buttonClass = "w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mt-6"
    >
      {/* Controles de Desktop */}
      <div className="hidden md:block">
        <div className="text-center text-white/70 text-sm mb-4">
          <p>Controles do Teclado:</p>
          <p>← → Mover | ↑ Girar | ↓ Acelerar | Espaço Drop | Shift Hold | P Pausar</p>
        </div>
      </div>

      {/* Controles Mobile */}
      <div className="md:hidden">
        <div className="text-center text-white/70 text-sm mb-4">
          <p>Controles Touch:</p>
        </div>
        
        {/* Botão de Hold */}
        <div className="flex justify-center mb-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`w-16 h-12 rounded-full backdrop-blur-sm border border-white/30 flex items-center justify-center text-white transition-all duration-200 active:scale-95 ${
              canHold 
                ? 'bg-gradient-to-r from-cat-purple to-cat-pink' 
                : 'bg-gray-500/50'
            }`}
            onClick={onHold}
            disabled={gameOver || isPaused || !canHold}
          >
            💾
          </motion.button>
        </div>
        
        {/* Botões de movimento */}
        <div className="flex justify-center items-center gap-4 mb-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={buttonClass}
            onClick={() => onMove('left')}
            disabled={gameOver || isPaused}
          >
            ←
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={buttonClass}
            onClick={() => onMove('right')}
            disabled={gameOver || isPaused}
          >
            →
          </motion.button>
        </div>

        {/* Botões centrais */}
        <div className="flex justify-center items-center gap-4 mb-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={buttonClass}
            onClick={() => onRotate()}
            disabled={gameOver || isPaused}
          >
            🔄
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-16 h-16 rounded-full bg-gradient-to-r from-cat-red to-cat-pink border-2 border-white/30 flex items-center justify-center text-white hover:from-cat-pink hover:to-cat-red transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => onHardDrop()}
            disabled={gameOver || isPaused}
          >
            ⬇️
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={buttonClass}
            onClick={() => onMove('down')}
            disabled={gameOver || isPaused}
          >
            ↓
          </motion.button>
        </div>

        {/* Botão de pausa */}
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`w-20 h-12 rounded-full backdrop-blur-sm border border-white/30 flex items-center justify-center text-white transition-all duration-200 active:scale-95 ${
              isPaused 
                ? 'bg-gradient-to-r from-cat-green to-cat-blue' 
                : 'bg-gradient-to-r from-cat-yellow to-cat-orange'
            }`}
            onClick={onPause}
            disabled={gameOver}
          >
            {isPaused ? '▶️' : '⏸️'}
          </motion.button>
        </div>
      </div>

      {/* Instruções adicionais */}
      <div className="mt-4 text-center text-white/50 text-xs">
        <p>Combine linhas para ganhar pontos!</p>
        <p>Quanto mais linhas de uma vez, mais pontos! 🐱</p>
      </div>
    </motion.div>
  );
};

export default Controls; 