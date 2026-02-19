import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameModes } from '../hooks/useGameModes';

/**
 * GameModesPanel - Seleção de modos de jogo
 */
function GameModesPanel({ onClose, onStartGame }) {
  const { modes, currentMode, modeStats, loading, selectMode } = useGameModes();

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
        <div className="text-white text-xl">Carregando modos...</div>
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
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white flex items-center gap-2">
              🎮 Modos de Jogo
            </h2>
            <p className="text-white/60 text-sm mt-1">
              Escolha seu desafio
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white text-2xl transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Modes Grid */}
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
                }`}
                onClick={() => handleSelectAndStart(mode.id)}
              >
                {/* Selected Badge */}
                {isSelected && (
                  <div className="absolute top-3 right-3 bg-green-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                    ✓ Selecionado
                  </div>
                )}

                {/* Mode Icon & Name */}
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

                {/* Mode Rules */}
                <div className="bg-black/30 rounded-lg p-3 mb-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {mode.rules.lineGoal && (
                      <div className="text-white/80">
                        🎯 Meta: {mode.rules.lineGoal} linhas
                      </div>
                    )}
                    {mode.rules.timeLimit && (
                      <div className="text-white/80">
                        ⏱️ Tempo: {formatTime(mode.rules.timeLimit)}
                      </div>
                    )}
                    {mode.rules.gameOver !== undefined && (
                      <div className="text-white/80">
                        {mode.rules.gameOver ? '💀 Game Over' : '✨ Sem Game Over'}
                      </div>
                    )}
                    {mode.rules.speedIncrease !== undefined && (
                      <div className="text-white/80">
                        {mode.rules.speedIncrease ? '⚡ Velocidade aumenta' : '🐢 Velocidade fixa'}
                      </div>
                    )}
                    {mode.rules.startLevel && (
                      <div className="text-white/80">
                        🚀 Início: Nível {mode.rules.startLevel}
                      </div>
                    )}
                    {mode.rules.relaxed && (
                      <div className="text-white/80">
                        😌 Modo relaxado
                      </div>
                    )}
                  </div>
                </div>

                {/* Stats */}
                {stats && stats.gamesPlayed > 0 && (
                  <div className="bg-black/30 rounded-lg p-3">
                    <div className="text-white/60 text-xs mb-2">Seus recordes:</div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <div className="text-yellow-400 font-bold">
                          {stats.bestScore.toLocaleString()}
                        </div>
                        <div className="text-white/40 text-xs">Melhor Pontuação</div>
                      </div>
                      {mode.rules.lineGoal && stats.bestTime > 0 && (
                        <div>
                          <div className="text-green-400 font-bold">
                            {formatTime(stats.bestTime)}
                          </div>
                          <div className="text-white/40 text-xs">Melhor Tempo</div>
                        </div>
                      )}
                      {!mode.rules.lineGoal && (
                        <div>
                          <div className="text-blue-400 font-bold">
                            {stats.bestLines}
                          </div>
                          <div className="text-white/40 text-xs">Mais Linhas</div>
                        </div>
                      )}
                    </div>
                    <div className="text-white/40 text-xs mt-2">
                      {stats.gamesPlayed} partidas jogadas
                    </div>
                  </div>
                )}

                {(!stats || stats.gamesPlayed === 0) && (
                  <div className="bg-black/30 rounded-lg p-3 text-center">
                    <div className="text-white/40 text-sm">
                      🆕 Nenhum recorde ainda
                    </div>
                  </div>
                )}

                {/* Play Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full mt-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-3 rounded-lg transition-colors"
                >
                  ▶️ Jogar
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
