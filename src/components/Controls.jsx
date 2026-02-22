import React from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '../hooks/useI18n';

const Controls = ({ onMove, onRotate, onHardDrop, onPause, onHold, isPaused, gameOver, canHold }) => {
  const { t } = useI18n();
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
    <div className="flex flex-col items-center gap-1">
      <div className="hidden lg:block">
        <div className="text-center text-white/50 text-[11px]">
          <p>{t('controls.hint')}</p>
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
            aria-label="Rotate"
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
            aria-label="Move left"
            className="bg-gray-600 text-white p-4 rounded-full shadow-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ⬅️
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleKeyPress('down')}
            disabled={gameOver}
            aria-label="Move down"
            className="bg-gray-600 text-white p-4 rounded-full shadow-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ⬇️
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleKeyPress('right')}
            disabled={gameOver}
            aria-label="Move right"
            className="bg-gray-600 text-white p-4 rounded-full shadow-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ➡️
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleKeyPress('hardDrop')}
            disabled={gameOver}
            aria-label="Hard drop"
            className="bg-red-500 text-white p-4 rounded-full shadow-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ⚡
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleKeyPress('hold')}
            disabled={gameOver || !canHold}
            aria-label="Hold piece"
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
            {isPaused ? t('controls.continue') : t('controls.pause')}
          </motion.button>
        </div>

        <div className="mt-4 text-center text-white/60 text-xs">
          <p>{t('controls.touchFriendly')}</p>
          <p>{t('controls.useShadow')}</p>
        </div>
      </div>
    </div>
  );
};

export default Controls;
