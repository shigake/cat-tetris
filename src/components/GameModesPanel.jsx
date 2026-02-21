import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameModes } from '../hooks/useGameModes';
import { useGamepadNav } from '../hooks/useGamepadNav';
import { useI18n } from '../hooks/useI18n';

function GameModesPanel({ onClose, onStartGame }) {
  const { modes, currentMode, modeStats, loading, selectMode } = useGameModes();
  const { t } = useI18n();

  const { selectedIndex } = useGamepadNav({
    itemCount: modes?.length || 0,
    columns: 2,
    onConfirm: (index) => {
      const mode = modes[index];
      if (mode) handleSelectAndStart(mode.id);
    },
    onBack: onClose,
    active: true,
    wrap: true,
  });

  const handleSelectAndStart = (modeId) => {
    selectMode(modeId);
    setTimeout(() => {
      onStartGame();
      onClose();
    }, 300);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="text-white text-xl">{t('gameModes.loading')}</div>
      </div>
    );
  }

  if (!modes || modes.length === 0) {

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-red-900/90 text-white p-6 rounded-lg">
          <p className="text-xl">{t('gameModes.errorLoading')}</p>
          <button onClick={onClose} className="mt-4 bg-white text-black px-4 py-2 rounded">
            Fechar
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-gradient-to-br from-blue-900/95 to-indigo-900/95 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-white/20 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >

        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white flex items-center gap-2">
              {t('gameModes.title')}
            </h2>
            <p className="text-white/60 text-sm mt-1">
              {t('gameModes.subtitle')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white text-2xl transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modes.map((mode, index) => {
            const stats = modeStats[mode.id];
            const isSelected = currentMode?.id === mode.id;

            return (
              <motion.div
                key={mode.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-black/40 rounded-lg p-5 border-2 cursor-pointer transition-all hover:scale-105 ${
                  isSelected
                    ? 'border-green-500 shadow-lg shadow-green-500/30'
                    : 'border-white/10 hover:border-white/30'
                } ${index === selectedIndex ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-blue-900' : ''}`}
                onClick={() => handleSelectAndStart(mode.id)}
              >

                {isSelected && (
                  <div className="absolute top-3 right-3 bg-green-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                    {t('gameModes.selected')}
                  </div>
                )}

                <div className="flex items-center gap-3 mb-3">
                  <div className="text-5xl">{mode.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-xl">
                      {mode.name}
                    </h3>
                    <p className="text-white/60 text-sm">
                      {mode.description}
                    </p>
                  </div>
                </div>

                <div className="bg-black/30 rounded-lg p-3 mb-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {mode.rules.lineGoal && (
                      <div className="text-white/80">
                        {t('gameModes.goalLines', { n: mode.rules.lineGoal })}
                      </div>
                    )}
                    {mode.rules.timeLimit && (
                      <div className="text-white/80">
                        {t('gameModes.timeLimit', { time: formatTime(mode.rules.timeLimit) })}
                      </div>
                    )}
                    {mode.rules.gameOver !== undefined && (
                      <div className="text-white/80">
                        {mode.rules.gameOver ? t('gameModes.gameOverYes') : t('gameModes.gameOverNo')}
                      </div>
                    )}
                    {mode.rules.speedIncrease !== undefined && (
                      <div className="text-white/80">
                        {mode.rules.speedIncrease ? t('gameModes.speedUp') : t('gameModes.speedFixed')}
                      </div>
                    )}
                    {mode.rules.startLevel && (
                      <div className="text-white/80">
                        {t('gameModes.startLevel', { n: mode.rules.startLevel })}
                      </div>
                    )}
                    {mode.rules.relaxed && (
                      <div className="text-white/80">
                        {t('gameModes.relaxed')}
                      </div>
                    )}
                  </div>
                </div>

                {stats && stats.gamesPlayed > 0 && (
                  <div className="bg-black/30 rounded-lg p-3">
                    <div className="text-white/60 text-xs mb-2">{t('gameModes.yourRecords')}</div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <div className="text-yellow-400 font-bold">
                          {stats.bestScore.toLocaleString()}
                        </div>
                        <div className="text-white/40 text-xs">{t('gameModes.bestScore')}</div>
                      </div>
                      {mode.rules.lineGoal && stats.bestTime > 0 && (
                        <div>
                          <div className="text-green-400 font-bold">
                            {formatTime(stats.bestTime)}
                          </div>
                          <div className="text-white/40 text-xs">{t('gameModes.bestTime')}</div>
                        </div>
                      )}
                      {!mode.rules.lineGoal && (
                        <div>
                          <div className="text-blue-400 font-bold">
                            {stats.bestLines}
                          </div>
                          <div className="text-white/40 text-xs">{t('gameModes.mostLines')}</div>
                        </div>
                      )}
                    </div>
                    <div className="text-white/40 text-xs mt-2">
                      {t('gameModes.gamesPlayed', { n: stats.gamesPlayed })}
                    </div>
                  </div>
                )}

                {(!stats || stats.gamesPlayed === 0) && (
                  <div className="bg-black/30 rounded-lg p-3 text-center">
                    <div className="text-white/40 text-sm">
                      {t('gameModes.noRecords')}
                    </div>
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full mt-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-3 rounded-lg transition-colors"
                >
                  {t('gameModes.play')}
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default GameModesPanel;

