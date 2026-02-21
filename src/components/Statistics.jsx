import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '../hooks/useI18n';
import { useGamepadNav } from '../hooks/useGamepadNav';

const Statistics = ({ stats, onClose }) => {
  const { t } = useI18n();

  const handleNavConfirm = useCallback(() => {
    onClose();
  }, [onClose]);

  const { selectedIndex } = useGamepadNav({
    itemCount: 1,
    onConfirm: handleNavConfirm,
    onBack: onClose,
    active: true,
  });

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 10 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="bg-gray-900/95 p-6 rounded-xl border-2 border-white/20 shadow-2xl min-w-[350px] max-w-md mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-cat font-bold text-white">
            {t('statistics.title')}
          </h2>
          <button
            onClick={onClose}
            className={`text-white/60 hover:text-white text-xl ${selectedIndex === 0 ? 'ring-2 ring-yellow-400 rounded-lg' : ''}`}
          >
            ✕
          </button>
        </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-white/80">{t('statistics.playTime')}</span>
          <span className="text-blue-400 font-bold">
            {formatTime(stats.playTime)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-white/80">{t('statistics.piecesPlaced')}</span>
          <span className="text-green-400 font-bold">
            {stats.piecesPlaced}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-white/80">{t('statistics.linesCleared')}</span>
          <span className="text-yellow-400 font-bold">
            {stats.linesCleared}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-white/80">{t('statistics.tSpins')}</span>
          <span className="text-purple-400 font-bold">
            {stats.tSpins}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-white/80">{t('statistics.backToBack')}</span>
          <span className="text-orange-400 font-bold">
            {stats.backToBack}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-white/80">{t('statistics.maxCombo')}</span>
          <span className="text-red-400 font-bold">
            {stats.maxCombo}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-white/80">{t('statistics.tetrisCount')}</span>
          <span className="text-cyan-400 font-bold">
            {stats.tetrisCount}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-white/80">{t('statistics.lps')}</span>
          <span className="text-pink-400 font-bold">
            {(typeof stats.linesPerSecond === 'number' ? stats.linesPerSecond : 0).toFixed(2)}
          </span>
        </div>
      </div>
    </motion.div>
    </motion.div>
  );
};

export default Statistics;
