import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAchievements } from '../hooks/useAchievements';
import { useGamepadNav } from '../hooks/useGamepadNav';
import { useI18n } from '../hooks/useI18n';

function AchievementsPanel({ onClose }) {
  const { achievements, loading, getStats, getAchievementsByTier } = useAchievements();
  const { t } = useI18n();
  const [selectedTier, setSelectedTier] = useState('all');

  const tierColors = {
    bronze: 'from-amber-700 to-amber-900',
    silver: 'from-gray-400 to-gray-600',
    gold: 'from-yellow-400 to-yellow-600',
    platinum: 'from-cyan-400 to-blue-600'
  };

  const tierEmojis = {
    bronze: '🥉',
    silver: '🥈',
    gold: '🥇',
    platinum: '💎'
  };

  const tiers = ['all', ...Object.keys(tierEmojis)];
  const { selectedIndex } = useGamepadNav({
    itemCount: tiers.length,
    onConfirm: (index) => setSelectedTier(tiers[index]),
    onBack: onClose,
    active: !loading,
    wrap: true,
  });

  const stats = getStats();

  const filteredAchievements = selectedTier === 'all'
    ? achievements
    : getAchievementsByTier(selectedTier);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="text-white text-xl">{t('achievements.loading')}</div>
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

        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white flex items-center gap-2">
              {t('achievements.title')}
            </h2>
            <p className="text-white/60 text-sm mt-1">
              {t('achievements.subtitle')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white text-2xl transition-colors"
          >
            ✕
          </button>
        </div>

        {stats && (
          <div className="bg-black/30 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {stats.unlocked}/{stats.total}
                </div>
                <div className="text-white/60 text-sm">{t('achievements.unlocked')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {stats.percentage}%
                </div>
                <div className="text-white/60 text-sm">{t('achievements.complete')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400 flex items-center justify-center gap-1">
                  🐟 {stats.earnedRewards.toLocaleString()}
                </div>
                <div className="text-white/60 text-sm">{t('achievements.earned')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white/40 flex items-center justify-center gap-1">
                  🐟 {stats.totalRewards.toLocaleString()}
                </div>
                <div className="text-white/60 text-sm">{t('achievements.total')}</div>
              </div>
            </div>

            <div className="flex justify-around mt-4 pt-4 border-t border-white/10">
              <div className="text-center">
                <div className="text-lg">🥉</div>
                <div className="text-white/80 text-sm">{stats.byTier.bronze}</div>
              </div>
              <div className="text-center">
                <div className="text-lg">🥈</div>
                <div className="text-white/80 text-sm">{stats.byTier.silver}</div>
              </div>
              <div className="text-center">
                <div className="text-lg">🥇</div>
                <div className="text-white/80 text-sm">{stats.byTier.gold}</div>
              </div>
              <div className="text-center">
                <div className="text-lg">💎</div>
                <div className="text-white/80 text-sm">{stats.byTier.platinum}</div>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2 mb-4 overflow-x-auto">
          <button
            onClick={() => setSelectedTier('all')}
            className={`px-4 py-2 rounded-lg font-bold transition-colors whitespace-nowrap ${
              selectedTier === 'all'
                ? 'bg-white text-black'
                : 'bg-white/20 text-white hover:bg-white/30'
            } ${selectedIndex === 0 ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-indigo-900' : ''}`}
          >
            {t('achievements.filterAll')}
          </button>
          {Object.keys(tierEmojis).map(tier => (
            <button
              key={tier}
              onClick={() => setSelectedTier(tier)}
              className={`px-4 py-2 rounded-lg font-bold transition-colors whitespace-nowrap ${
                selectedTier === tier
                  ? `bg-gradient-to-r ${tierColors[tier]} text-white`
                  : 'bg-white/20 text-white hover:bg-white/30'
              } ${selectedIndex === tiers.indexOf(tier) ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-indigo-900' : ''}`}
            >
              {tierEmojis[tier]} {tier.charAt(0).toUpperCase() + tier.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAchievements.map((achievement, index) => {
            const progress = achievement.progress || 0;
            const target = achievement.requirement.value;
            const percentage = Math.min((progress / target) * 100, 100);

            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-black/40 rounded-lg p-4 border-2 relative overflow-hidden ${
                  achievement.unlocked
                    ? `border-transparent bg-gradient-to-br ${tierColors[achievement.tier]}`
                    : 'border-white/10'
                }`}
              >

                {achievement.unlocked && (
                  <div className="absolute top-2 right-2 text-3xl">
                    ✓
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <div className="text-4xl">
                    {tierEmojis[achievement.tier]}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold text-lg mb-1 ${
                      achievement.unlocked ? 'text-white' : 'text-white/60'
                    }`}>
                      {achievement.title}
                    </h3>
                    <p className={`text-sm mb-2 ${
                      achievement.unlocked ? 'text-white/90' : 'text-white/40'
                    }`}>
                      {achievement.description}
                    </p>

                    <div className={`flex items-center gap-1 text-sm font-bold ${
                      achievement.unlocked ? 'text-yellow-300' : 'text-white/40'
                    }`}>
                      🐟 {achievement.reward}
                    </div>

                    {!achievement.unlocked && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-white/40 mb-1">
                          <span>{t('achievements.progress')}</span>
                          <span>{progress}/{target}</span>
                        </div>
                        <div className="w-full bg-gray-700/50 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {achievement.unlocked && achievement.unlockedAt && (
                      <div className="text-xs text-white/60 mt-2">
                        {t('achievements.unlockedAt', { date: new Date(achievement.unlockedAt).toLocaleDateString() })}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredAchievements.length === 0 && (
          <div className="text-center text-white/40 py-8">
            {t('achievements.noneInCategory')}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default AchievementsPanel;

