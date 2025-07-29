import React from 'react';
import { motion } from 'framer-motion';

const Controls = ({ onMove, onRotate, onHardDrop, onPause, onHold, isPaused, gameOver, canHold }) => {
  const handleKeyPress = (action) => {
    if (gameOver) return;
    
    switch (action) {
      case 'left':
        onMove('left');
        break;
      case 'right':
        onMove('right');
        break;
      case 'down':
        onMove('down');
        break;
      case 'rotate':
        onRotate();
        break;
      case 'hardDrop':
        onHardDrop();
        break;
      case 'hold':
        onHold();
        break;
      case 'pause':
        onPause();
        break;
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="hidden lg:block">
        <div className="text-center text-white/70 text-sm mb-4">
          <p>Use as setas para mover e girar</p>
          <p>Espaço para drop instantâneo</p>
          <p>Shift para guardar peça</p>
        </div>
      </div>

      <div className="lg:hidden">
        <div className="grid grid-cols-3 gap-3 max-w-xs">
          <div></div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleKeyPress('rotate')}
            disabled={gameOver}
            className="bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🔄
          </motion.button>
          <div></div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleKeyPress('left')}
            disabled={gameOver}
            className="bg-gray-600 text-white p-4 rounded-full shadow-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ⬅️
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleKeyPress('down')}
            disabled={gameOver}
            className="bg-gray-600 text-white p-4 rounded-full shadow-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ⬇️
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleKeyPress('right')}
            disabled={gameOver}
            className="bg-gray-600 text-white p-4 rounded-full shadow-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ➡️
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleKeyPress('hardDrop')}
            disabled={gameOver}
            className="bg-red-500 text-white p-4 rounded-full shadow-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ⚡
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleKeyPress('hold')}
            disabled={gameOver || !canHold}
            className={`p-4 rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
              canHold 
                ? 'bg-green-500 text-white hover:bg-green-600' 
                : 'bg-gray-500 text-white'
            }`}
          >
            💾
          </motion.button>
        </div>

        <div className="mt-4 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleKeyPress('pause')}
            disabled={gameOver}
            className="bg-yellow-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPaused ? '▶️ Continuar' : '⏸️ Pausar'}
          </motion.button>
        </div>

        <div className="mt-4 text-center text-white/60 text-xs">
          <p>🎮 Controles touch-friendly</p>
          <p>💡 Use a sombra para planejar!</p>
        </div>
      </div>
    </div>
  );
};

export default Controls; 