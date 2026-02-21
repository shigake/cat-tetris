import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import ShareButtons from './ShareButtons';
import { useGamepadNav } from '../hooks/useGamepadNav';
import { useI18n } from '../hooks/useI18n';

const GameOverScreen = ({ score, onRestart, onBackToMenu }) => {

  const { t } = useI18n();
  const scoreValue = typeof score === 'number' ? score : score.points;
  const level = typeof score === 'object' ? score.level : 1;
  const lines = typeof score === 'object' ? score.lines : 0;

  const gameOverActions = [onRestart, onBackToMenu];
  const handleConfirm = useCallback((index) => {
    gameOverActions[index]?.();
  }, [onRestart, onBackToMenu]);

  const { selectedIndex } = useGamepadNav({
    itemCount: 2,
    onConfirm: handleConfirm,
    active: true,
    wrap: true,
  });

  const getMotivationalMessage = (score) => {
    if (score < 1000) return t('gameOver.msgLow');
    if (score < 5000) return t('gameOver.msgMed');
    if (score < 10000) return t('gameOver.msgHigh');
    return t('gameOver.msgTop');
  };

  const getCatEmoji = (score) => {
    if (score < 1000) return "😿";
    if (score < 5000) return "😺";
    if (score < 10000) return "😸";
    return "😻";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 15 }}
        className="bg-gray-900/90 p-8 rounded-2xl border-2 border-white/20 shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="text-6xl mb-4"
          >
            {getCatEmoji(scoreValue)}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-cat font-bold text-white mb-2"
          >
            {t('gameOver.title')}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 font-bold text-xl p-3 rounded-lg mb-4"
          >
            {t('gameOver.points', { score: scoreValue.toLocaleString() })}
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-white/80 mb-6 text-lg"
          >
            {getMotivationalMessage(scoreValue)}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
          >
            <ShareButtons
              scoreData={{
                score: scoreValue,
                level: level,
                lines: lines
              }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-3 mt-4"
          >
            <motion.button
              onClick={(e) => { e.stopPropagation(); onRestart(); }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-6 rounded-lg hover:from-green-400 hover:to-emerald-500 transition-all duration-300 shadow-lg ${selectedIndex === 0 ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-gray-900 scale-105' : ''}`}
            >
              {t('gameOver.playAgain')}
            </motion.button>

            <motion.button
              onClick={(e) => { e.stopPropagation(); onBackToMenu(); }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-bold py-3 px-6 rounded-lg hover:from-blue-400 hover:to-cyan-500 transition-all duration-300 shadow-lg ${selectedIndex === 1 ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-gray-900 scale-105' : ''}`}
            >
              {t('gameOver.backToMenu')}
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6 text-center text-white/60 text-sm"
          >
            <p>{t('gameOver.tip1')}</p>
            <p>{t('gameOver.tip2')}</p>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GameOverScreen;
