import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * RewardNotification - Mostra recompensas ganhas (coins, XP, badges)
 */
function RewardNotification({ reward, onClose }) {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!reward) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed top-24 right-6 z-[60] max-w-md"
    >
      <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl p-6 shadow-2xl border-2 border-white/20">
        <div className="flex items-start gap-4">
          <div className="text-4xl">🎉</div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2">
              Lesson Completa!
            </h3>
            {reward.lessonTitle && (
              <p className="text-white/90 text-sm mb-3">
                {reward.lessonTitle}
              </p>
            )}
            
            <div className="grid grid-cols-3 gap-2">
              {reward.rewards?.fishCoins > 0 && (
                <div className="bg-white/10 rounded-lg p-2 text-center">
                  <div className="text-xl">🐟</div>
                  <div className="text-lg font-bold text-white">
                    +{reward.rewards.fishCoins}
                  </div>
                  <div className="text-xs text-white/70">Peixes</div>
                </div>
              )}
              
              {reward.rewards?.xp > 0 && (
                <div className="bg-white/10 rounded-lg p-2 text-center">
                  <div className="text-xl">⭐</div>
                  <div className="text-lg font-bold text-white">
                    +{reward.rewards.xp}
                  </div>
                  <div className="text-xs text-white/70">XP</div>
                </div>
              )}
              
              {reward.rewards?.badge && (
                <div className="bg-white/10 rounded-lg p-2 text-center">
                  <div className="text-xl">🏅</div>
                  <div className="text-xs font-bold text-white mt-1">
                    Badge
                  </div>
                  <div className="text-xs text-white/70">
                    {reward.rewards.badge.split('_')[0]}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default RewardNotification;
