import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLeaderboard } from '../hooks/useLeaderboard';

const COUNTRY_FLAGS = {
  BR: '🇧🇷', US: '🇺🇸', JP: '🇯🇵', KR: '🇰🇷', FR: '🇫🇷',
  DE: '🇩🇪', UK: '🇬🇧', ES: '🇪🇸', IT: '🇮🇹', MX: '🇲🇽',
  CA: '🇨🇦', AR: '🇦🇷', AU: '🇦🇺', NZ: '🇳🇿'
};

const MEDAL_EMOJIS = {
  1: '🥇',
  2: '🥈',
  3: '🥉'
};

/**
 * LeaderboardPanel - Ranking global de jogadores
 */
function LeaderboardPanel({ onClose }) {
  const { 
    leaderboard, 
    playerRank, 
    aroundPlayer,
    loading, 
    refreshLeaderboard,
    getWeeklyLeaderboard,
    getCountryLeaderboard,
    getPlayerName,
    setPlayerName
  } = useLeaderboard();

  const [selectedTab, setSelectedTab] = useState('global');
  const [displayedLeaderboard, setDisplayedLeaderboard] = useState([]);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    switch (selectedTab) {
      case 'global':
        setDisplayedLeaderboard(leaderboard);
        break;
      case 'weekly':
        setDisplayedLeaderboard(getWeeklyLeaderboard());
        break;
      case 'country':
        setDisplayedLeaderboard(getCountryLeaderboard('BR'));
        break;
      case 'around':
        setDisplayedLeaderboard(aroundPlayer);
        break;
      default:
        setDisplayedLeaderboard(leaderboard);
    }
  }, [selectedTab, leaderboard, aroundPlayer, getWeeklyLeaderboard, getCountryLeaderboard]);

  const handleNameChange = () => {
    if (newName.trim()) {
      setPlayerName(newName.trim());
      setEditingName(false);
    }
  };

  const getRankColor = (rank) => {
    if (rank === 1) return 'text-yellow-400';
    if (rank === 2) return 'text-gray-300';
    if (rank === 3) return 'text-amber-600';
    if (rank <= 10) return 'text-blue-400';
    return 'text-white/60';
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="text-white text-xl">Carregando ranking...</div>
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
        className="bg-gradient-to-br from-indigo-900/95 to-purple-900/95 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-white/20 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white flex items-center gap-2">
              🏆 Ranking Global
            </h2>
            <p className="text-white/60 text-sm mt-1">
              Competição mundial de Cat Tetris
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white text-2xl transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Player Card */}
        {playerRank && (
          <div className="bg-gradient-to-r from-green-600/30 to-emerald-600/30 border-2 border-green-500/50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">
                    #{playerRank.rank}
                  </div>
                  <div className="text-white/60 text-xs">Sua Posição</div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    {editingName ? (
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleNameChange()}
                        onBlur={handleNameChange}
                        className="bg-black/30 text-white px-2 py-1 rounded border border-white/20 focus:outline-none focus:border-green-500"
                        autoFocus
                        maxLength={20}
                      />
                    ) : (
                      <>
                        <span className="text-white font-bold text-lg">{getPlayerName()}</span>
                        <button
                          onClick={() => {
                            setNewName(getPlayerName());
                            setEditingName(true);
                          }}
                          className="text-white/60 hover:text-white text-sm"
                        >
                          ✏️
                        </button>
                      </>
                    )}
                  </div>
                  <div className="text-white/60 text-sm">
                    Top {playerRank.percentile}% dos jogadores
                  </div>
                </div>
              </div>
              <button
                onClick={refreshLeaderboard}
                className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-bold transition-colors"
              >
                🔄 Atualizar
              </button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto">
          {[
            { id: 'global', label: '🌍 Global', desc: 'Top 100' },
            { id: 'weekly', label: '📅 Semanal', desc: 'Esta semana' },
            { id: 'country', label: '🇧🇷 Brasil', desc: 'Seu país' },
            { id: 'around', label: '📍 Ao Redor', desc: 'Perto de você' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-bold transition-colors whitespace-nowrap ${
                selectedTab === tab.id
                  ? 'bg-white text-black'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <div>{tab.label}</div>
              <div className="text-xs opacity-70">{tab.desc}</div>
            </button>
          ))}
        </div>

        {/* Leaderboard Table */}
        <div className="bg-black/30 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-black/50 text-white/80 text-sm">
                  <th className="text-left p-3">Rank</th>
                  <th className="text-left p-3">Jogador</th>
                  <th className="text-right p-3">Pontuação</th>
                  <th className="text-right p-3">Nível</th>
                  <th className="text-right p-3">Linhas</th>
                </tr>
              </thead>
              <tbody>
                {displayedLeaderboard.map((player, index) => {
                  const actualRank = selectedTab === 'around' 
                    ? leaderboard.findIndex(p => p.id === player.id) + 1
                    : index + 1;
                  
                  return (
                    <motion.tr
                      key={player.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className={`border-b border-white/10 hover:bg-white/5 transition-colors ${
                        player.isPlayer ? 'bg-green-600/20' : ''
                      }`}
                    >
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          {MEDAL_EMOJIS[actualRank] ? (
                            <span className="text-2xl">{MEDAL_EMOJIS[actualRank]}</span>
                          ) : (
                            <span className={`font-bold ${getRankColor(actualRank)}`}>
                              #{actualRank}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          {COUNTRY_FLAGS[player.country] && (
                            <span className="text-lg">{COUNTRY_FLAGS[player.country]}</span>
                          )}
                          <span className={`font-medium ${
                            player.isPlayer ? 'text-green-400 font-bold' : 'text-white'
                          }`}>
                            {player.name}
                            {player.isPlayer && ' (Você)'}
                          </span>
                        </div>
                      </td>
                      <td className="p-3 text-right">
                        <span className="text-yellow-400 font-bold">
                          {player.score.toLocaleString()}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <span className="text-blue-400">
                          {player.level}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <span className="text-white/80">
                          {player.lines}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {displayedLeaderboard.length === 0 && (
            <div className="text-center text-white/40 py-8">
              Nenhum jogador nesta categoria ainda
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-4 text-center text-white/40 text-sm">
          💡 Jogue mais para subir no ranking!
        </div>
      </motion.div>
    </motion.div>
  );
}

export default LeaderboardPanel;
