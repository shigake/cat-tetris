import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMissions } from '../hooks/useMissions';
import Celebration from './Celebration';
import { showToast } from './ToastNotification';

/**
 * DailyMissionsPanel - Mostra missões diárias do jogador
 */
function DailyMissionsPanel({ onClose }) {
  const { missions, loading, claimReward, getMissionsStats } = useMissions();
  const [showCelebration, setShowCelebration] = React.useState(false);
  const stats = getMissionsStats();

  const handleClaim = (missionId) => {
    const result = claimReward(missionId);
    if (result.success) {
      // Show toast notification
      showToast(`✅ Recompensa coletada: +${result.reward} 🐟`, 'success');
      
      // Check if all missions are now claimed
      const updatedStats = getMissionsStats();
      if (updatedStats.allClaimed) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
      }
    } else {
      showToast(`❌ ${result.error}`, 'error');
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-red-400';
      default: return 'text-white';
    }
  };

  const getDifficultyBadge = (difficulty) => {
    switch (difficulty) {
      case 'easy': return '🟢 Fácil';
      case 'medium': return '🟡 Médio';
      case 'hard': return '🔴 Difícil';
      default: return difficulty;
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="text-white text-xl">Carregando missões...</div>
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
        className="bg-gradient-to-br from-purple-900/95 to-blue-900/95 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-white/20 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white flex items-center gap-2">
              📋 Missões Diárias
            </h2>
            <p className="text-white/60 text-sm mt-1">
              Complete missões para ganhar 🐟 Peixes
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
          <div className="bg-black/30 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-white/80">Progresso Diário:</span>
              <span className="text-white font-bold">
                {stats.completed}/{stats.total} completas
              </span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-white/80">Recompensas Disponíveis:</span>
              <span className="text-yellow-400 font-bold flex items-center gap-1">
                🐟 {stats.claimedRewards}/{stats.totalRewards}
              </span>
            </div>
          </div>
        )}

        {/* Missions List */}
        <div className="space-y-4">
          {missions.map((mission, index) => {
            const progress = Math.min(mission.progress, mission.target);
            const percentage = (progress / mission.target) * 100;

            return (
              <motion.div
                key={mission.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-black/40 rounded-lg p-4 border-2 ${
                  mission.completed 
                    ? 'border-green-500/50' 
                    : 'border-white/10'
                }`}
              >
                {/* Mission Header */}
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-white font-bold text-lg">
                        {mission.title}
                      </h3>
                      {mission.completed && !mission.claimed && (
                        <span className="text-green-400 text-xl animate-pulse">
                          ✓
                        </span>
                      )}
                      {mission.claimed && (
                        <span className="text-white/40 text-sm">
                          (Coletado)
                        </span>
                      )}
                    </div>
                    <p className="text-white/60 text-sm">
                      {mission.description}
                    </p>
                    <span className={`text-xs ${getDifficultyColor(mission.difficulty)}`}>
                      {getDifficultyBadge(mission.difficulty)}
                    </span>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-yellow-400 font-bold flex items-center gap-1">
                      <span className="text-2xl">🐟</span>
                      <span>{mission.reward}</span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-sm text-white/60 mb-1">
                    <span>Progresso</span>
                    <span>{progress}/{mission.target}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.5 }}
                      className={`h-full ${
                        mission.completed 
                          ? 'bg-green-500' 
                          : 'bg-blue-500'
                      }`}
                    />
                  </div>
                </div>

                {/* Claim Button */}
                {mission.completed && !mission.claimed && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleClaim(mission.id)}
                    className="w-full mt-3 bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                  >
                    🎁 Coletar Recompensa
                  </motion.button>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-white/40 text-sm">
          As missões resetam todos os dias às 00:00
        </div>
      </motion.div>
      
      {/* Celebration quando completa todas as missões */}
      <Celebration 
        trigger={showCelebration}
        message="🎉 Todas as missões completas! 🎉"
        duration={3000}
      />
    </motion.div>
  );
}

export default DailyMissionsPanel;
