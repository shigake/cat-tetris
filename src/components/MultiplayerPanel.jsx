import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useMultiplayer } from '../hooks/useMultiplayer';
import { useAIOpponent } from '../hooks/useAIOpponent';
import { useGamepadNav } from '../hooks/useGamepadNav';
import { useI18n } from '../hooks/useI18n';

function MultiplayerPanel({ onClose, onStartMatch }) {
  const { getAvailableModes, stats, startLocalMatch, startAIMatch, startAIvsAIMatch } = useMultiplayer();
  const { getDifficulties } = useAIOpponent();
  const { t } = useI18n();

  const [selectedMode, setSelectedMode] = useState(null);
  const [player1Name, setPlayer1Name] = useState(t('multiplayer.player1'));
  const [player2Name, setPlayer2Name] = useState(t('multiplayer.player2'));
  const [aiDifficulty, setAiDifficulty] = useState('medium');
  const [ai1Difficulty, setAi1Difficulty] = useState('expert');
  const [ai2Difficulty, setAi2Difficulty] = useState('expert');

  const modes = getAvailableModes();
  const difficulties = getDifficulties();

  // Mode selection: modes + back button at the end
  const modeNavCount = (modes?.length || 0) + 1;
  const { selectedIndex: modeSelIdx } = useGamepadNav({
    itemCount: modeNavCount,
    columns: 2,
    onConfirm: (index) => {
      if (index < modes.length) {
        const mode = modes[index];
        if (mode && !mode.disabled) handleModeSelect(mode);
      } else {
        onClose();
      }
    },
    onBack: onClose,
    active: !selectedMode,
    wrap: true,
  });

  // Config screen: difficulty buttons + start + back
  const diffCount = difficulties?.length || 0;
  const configItems = selectedMode?.id === 'ai-vs-ai'
    ? diffCount * 2 + 2   // ai1 diffs + ai2 diffs + start + back
    : diffCount + 2;      // diffs + start + back
  const { selectedIndex: configSelIdx } = useGamepadNav({
    itemCount: configItems,
    columns: 2,
    onConfirm: (index) => {
      if (selectedMode?.id === 'vs-ai') {
        if (index < diffCount) setAiDifficulty(difficulties[index].id);
        else if (index === diffCount) handleStartMatch();
        else setSelectedMode(null);   // back
      } else if (selectedMode?.id === 'ai-vs-ai') {
        if (index < diffCount) setAi1Difficulty(difficulties[index].id);
        else if (index < diffCount * 2) setAi2Difficulty(difficulties[index - diffCount].id);
        else if (index === diffCount * 2) handleStartMatch();
        else setSelectedMode(null);   // back
      }
    },
    onBack: () => setSelectedMode(null),
    active: !!selectedMode,
    wrap: true,
  });

  if (!modes || modes.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-red-900/90 text-white p-6 rounded-lg">
          <p className="text-xl">{t('multiplayer.errorLoading')}</p>
          <button onClick={onClose} className="mt-4 bg-white text-black px-4 py-2 rounded">
            Fechar
          </button>
        </div>
      </div>
    );
  }

  const handleModeSelect = (mode) => {
    if (mode.disabled) return;
    setSelectedMode(mode);
  };

  const handleStartMatch = () => {
    let match = null;
    if (selectedMode.id === 'vs-ai') {
      match = startAIMatch(player1Name, aiDifficulty);
    } else if (selectedMode.id === 'ai-vs-ai') {
      match = startAIvsAIMatch(ai1Difficulty, ai2Difficulty);
    }
    if (match && onStartMatch) {
      onStartMatch(match);
    }
  };

  const ringClass = 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-purple-900';

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
        className="bg-gradient-to-br from-purple-900/95 to-indigo-900/95 rounded-2xl p-4 sm:p-5 max-w-2xl w-full border-2 border-white/20 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header — compact */}
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-2xl font-bold text-white">
            {t('multiplayer.title')}
          </h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white text-xl transition-colors"
          >
            ✕
          </button>
        </div>

        {!selectedMode ? (
          <>
            {/* Stats — single row, compact */}
            {stats && (
              <div className="flex gap-4 justify-center bg-black/30 rounded-lg px-3 py-2 mb-3 text-sm">
                <div className="text-center">
                  <span className="font-bold text-white">{stats.aiMatches}</span>
                  <span className="text-white/50 ml-1">{t('multiplayer.matchesVsAI')}</span>
                </div>
                <div className="text-center">
                  <span className="font-bold text-green-400">{stats.wins}</span>
                  <span className="text-white/50 ml-1">{t('multiplayer.wins')}</span>
                </div>
                <div className="text-center">
                  <span className="font-bold text-yellow-400">{stats.winRate}%</span>
                  <span className="text-white/50 ml-1">{t('multiplayer.winRate')}</span>
                </div>
              </div>
            )}

            {/* Mode selection grid */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              {modes.map((mode, modeIdx) => (
                <motion.button
                  key={mode.id}
                  whileHover={!mode.disabled ? { scale: 1.02 } : {}}
                  whileTap={!mode.disabled ? { scale: 0.98 } : {}}
                  onClick={() => handleModeSelect(mode)}
                  disabled={mode.disabled}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    mode.disabled
                      ? 'bg-gray-800/50 border-gray-700 opacity-50 cursor-not-allowed'
                      : 'bg-gradient-to-br from-blue-600/30 to-purple-600/30 border-blue-500/50 hover:border-blue-400 cursor-pointer'
                  } ${modeIdx === modeSelIdx ? ringClass : ''}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{mode.emoji}</span>
                    <h3 className="text-base font-bold text-white">{mode.name}</h3>
                  </div>
                  <p className="text-white/70 text-xs">{mode.description}</p>
                  {mode.disabled && (
                    <div className="mt-1 text-yellow-400 text-xs font-bold">
                      {t('multiplayer.comingSoon')}
                    </div>
                  )}
                </motion.button>
              ))}
            </div>

            {/* Back button for gamepad */}
            <button
              onClick={onClose}
              className={`w-full py-2 rounded-lg text-white/70 hover:text-white bg-white/10 hover:bg-white/20 transition-all text-sm font-bold ${modeSelIdx === modes.length ? ringClass : ''}`}
            >
              ← {t('multiplayer.back')}
            </button>

            <p className="text-white/30 text-xs text-center mt-2">🎮 B = voltar</p>
          </>
        ) : (
          <>
            {/* Config header */}
            <div className="flex items-center gap-3 mb-3 bg-black/30 rounded-lg p-3">
              <span className="text-3xl">{selectedMode.emoji}</span>
              <div>
                <h3 className="text-lg font-bold text-white">{selectedMode.name}</h3>
                <p className="text-white/60 text-xs">{selectedMode.description}</p>
              </div>
            </div>

            {selectedMode.id === 'vs-ai' && (
              <>
                <label className="block text-white/80 text-sm mb-1">{t('multiplayer.aiDifficulty')}</label>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {difficulties.map((diff, dIdx) => (
                    <button
                      key={diff.id}
                      onClick={() => setAiDifficulty(diff.id)}
                      className={`p-2.5 rounded-lg border-2 transition-all text-left ${
                        aiDifficulty === diff.id
                          ? 'bg-blue-600 border-blue-400'
                          : 'bg-black/30 border-white/20 hover:border-white/40'
                      } ${configSelIdx === dIdx ? ringClass : ''}`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{diff.emoji}</span>
                        <div>
                          <div className="text-white font-bold text-sm">{diff.name}</div>
                          <div className="text-white/60 text-[10px]">{diff.description}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}

            {selectedMode.id === 'ai-vs-ai' && (
              <>
                <label className="block text-white/80 text-sm mb-1">{t('multiplayer.ai1Left')}</label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {difficulties.map((diff, dIdx) => (
                    <button
                      key={diff.id}
                      onClick={() => setAi1Difficulty(diff.id)}
                      className={`p-2 rounded-lg border-2 transition-all text-left ${
                        ai1Difficulty === diff.id
                          ? 'bg-blue-600 border-blue-400'
                          : 'bg-black/30 border-white/20 hover:border-white/40'
                      } ${configSelIdx === dIdx ? ringClass : ''}`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{diff.emoji}</span>
                        <div className="text-white font-bold text-xs">{diff.name}</div>
                      </div>
                    </button>
                  ))}
                </div>

                <label className="block text-white/80 text-sm mb-1">{t('multiplayer.ai2Right')}</label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {difficulties.map((diff, dIdx) => (
                    <button
                      key={diff.id}
                      onClick={() => setAi2Difficulty(diff.id)}
                      className={`p-2 rounded-lg border-2 transition-all text-left ${
                        ai2Difficulty === diff.id
                          ? 'bg-red-600 border-red-400'
                          : 'bg-black/30 border-white/20 hover:border-white/40'
                      } ${configSelIdx === dIdx + diffCount ? ringClass : ''}`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{diff.emoji}</span>
                        <div className="text-white font-bold text-xs">{diff.name}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Start + Back buttons */}
            <div className="flex gap-2 mt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStartMatch}
                className={`flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold py-3 rounded-lg shadow-lg transition-all ${
                  configSelIdx === configItems - 2 ? ringClass : ''
                }`}
              >
                🎮 {t('multiplayer.startMatch')}
              </motion.button>
              <button
                onClick={() => setSelectedMode(null)}
                className={`px-4 py-3 rounded-lg text-white/70 hover:text-white bg-white/10 hover:bg-white/20 transition-all font-bold ${
                  configSelIdx === configItems - 1 ? ringClass : ''
                }`}
              >
                ← {t('multiplayer.back')}
              </button>
            </div>
            <p className="text-white/30 text-xs text-center mt-2">🎮 B = voltar</p>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

export default MultiplayerPanel;

