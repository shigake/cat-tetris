import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useMultiplayer } from '../hooks/useMultiplayer';
import { useAIOpponent } from '../hooks/useAIOpponent';

/**
 * MultiplayerPanel - Seleção de modos multiplayer
 */
function MultiplayerPanel({ onClose, onStartMatch }) {
  const { getAvailableModes, stats, startLocalMatch, startAIMatch } = useMultiplayer();
  const { getDifficulties } = useAIOpponent();
  
  const [selectedMode, setSelectedMode] = useState(null);
  const [player1Name, setPlayer1Name] = useState('Jogador 1');
  const [player2Name, setPlayer2Name] = useState('Jogador 2');
  const [aiDifficulty, setAiDifficulty] = useState('medium');

  const modes = getAvailableModes();
  const difficulties = getDifficulties();

  const handleModeSelect = (mode) => {
    if (mode.disabled) return;
    setSelectedMode(mode);
  };

  const handleStartMatch = () => {
    let match = null;
    
    if (selectedMode.id === '1v1-local') {
      match = startLocalMatch(player1Name, player2Name);
    } else if (selectedMode.id === 'vs-ai') {
      match = startAIMatch(player1Name, aiDifficulty);
    }
    
    if (match && onStartMatch) {
      onStartMatch(match);
    }
  };

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
        className="bg-gradient-to-br from-purple-900/95 to-indigo-900/95 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-white/20 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white flex items-center gap-2">
              🎮 Multiplayer
            </h2>
            <p className="text-white/60 text-sm mt-1">
              Desafie amigos ou enfrente a IA
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white text-2xl transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Stats */}
        {stats && (
          <div className="bg-black/30 rounded-lg p-4 mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{stats.localMatches}</div>
              <div className="text-white/60 text-sm">Partidas Locais</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{stats.aiMatches}</div>
              <div className="text-white/60 text-sm">vs IA</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{stats.wins}</div>
              <div className="text-white/60 text-sm">Vitórias</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{stats.winRate}%</div>
              <div className="text-white/60 text-sm">Taxa de Vitória</div>
            </div>
          </div>
        )}

        {!selectedMode ? (
          /* Mode Selection */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {modes.map((mode) => (
              <motion.button
                key={mode.id}
                whileHover={!mode.disabled ? { scale: 1.02 } : {}}
                whileTap={!mode.disabled ? { scale: 0.98 } : {}}
                onClick={() => handleModeSelect(mode)}
                disabled={mode.disabled}
                className={`p-6 rounded-xl border-2 text-left transition-all ${
                  mode.disabled
                    ? 'bg-gray-800/50 border-gray-700 opacity-50 cursor-not-allowed'
                    : 'bg-gradient-to-br from-blue-600/30 to-purple-600/30 border-blue-500/50 hover:border-blue-400 cursor-pointer'
                }`}
              >
                <div className="text-4xl mb-3">{mode.emoji}</div>
                <h3 className="text-xl font-bold text-white mb-2">{mode.name}</h3>
                <p className="text-white/70 text-sm mb-3">{mode.description}</p>
                <div className="flex items-center gap-2 text-white/50 text-sm">
                  <span>👤 {mode.players} jogador{mode.players > 1 ? 'es' : ''}</span>
                </div>
                {mode.disabled && (
                  <div className="mt-3 text-yellow-400 text-xs font-bold">
                    ⏳ EM BREVE
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        ) : (
          /* Configuration Screen */
          <div>
            <button
              onClick={() => setSelectedMode(null)}
              className="text-white/60 hover:text-white mb-4 flex items-center gap-2"
            >
              ← Voltar
            </button>

            <div className="bg-black/30 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-5xl">{selectedMode.emoji}</span>
                <div>
                  <h3 className="text-2xl font-bold text-white">{selectedMode.name}</h3>
                  <p className="text-white/60">{selectedMode.description}</p>
                </div>
              </div>

              {selectedMode.id === '1v1-local' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/80 mb-2">Nome Jogador 1:</label>
                    <input
                      type="text"
                      value={player1Name}
                      onChange={(e) => setPlayer1Name(e.target.value)}
                      className="w-full bg-black/30 text-white px-4 py-2 rounded-lg border border-white/20 focus:border-blue-500 focus:outline-none"
                      maxLength={20}
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 mb-2">Nome Jogador 2:</label>
                    <input
                      type="text"
                      value={player2Name}
                      onChange={(e) => setPlayer2Name(e.target.value)}
                      className="w-full bg-black/30 text-white px-4 py-2 rounded-lg border border-white/20 focus:border-blue-500 focus:outline-none"
                      maxLength={20}
                    />
                  </div>

                  <div className="bg-blue-900/30 rounded-lg p-4 mt-6">
                    <h4 className="text-white font-bold mb-2">📋 Controles:</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm text-white/80">
                      <div>
                        <div className="font-bold text-white mb-1">Jogador 1:</div>
                        <div>⬅️➡️⬆️⬇️ Setas</div>
                        <div>Shift: Hold</div>
                        <div>P: Pausar</div>
                      </div>
                      <div>
                        <div className="font-bold text-white mb-1">Jogador 2:</div>
                        <div>WASD: Mover/Girar</div>
                        <div>Q: Hold</div>
                        <div>E: Pausar</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedMode.id === 'vs-ai' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/80 mb-2">Seu Nome:</label>
                    <input
                      type="text"
                      value={player1Name}
                      onChange={(e) => setPlayer1Name(e.target.value)}
                      className="w-full bg-black/30 text-white px-4 py-2 rounded-lg border border-white/20 focus:border-blue-500 focus:outline-none"
                      maxLength={20}
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 mb-2">Dificuldade da IA:</label>
                    <div className="grid grid-cols-2 gap-3">
                      {difficulties.map((diff) => (
                        <button
                          key={diff.id}
                          onClick={() => setAiDifficulty(diff.id)}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            aiDifficulty === diff.id
                              ? 'bg-blue-600 border-blue-400'
                              : 'bg-black/30 border-white/20 hover:border-white/40'
                          }`}
                        >
                          <div className="text-2xl mb-1">{diff.emoji}</div>
                          <div className="text-white font-bold">{diff.name}</div>
                          <div className="text-white/60 text-xs">{diff.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStartMatch}
                className="w-full mt-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition-all"
              >
                🎮 Iniciar Partida
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default MultiplayerPanel;
