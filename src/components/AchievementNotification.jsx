import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Celebration from './Celebration';
import { useI18n } from '../hooks/useI18n';

function AchievementNotification() {
  const { t } = useI18n();
  const [notifications, setNotifications] = useState([]);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    const handleAchievementUnlocked = (event) => {
      const unlocked = event.detail;

      const hasPlatinum = unlocked.some(a => a.tier === 'platinum');
      if (hasPlatinum) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
      }

      unlocked.forEach((achievement, index) => {
        setTimeout(() => {
          const notification = {
            id: `${achievement.id}_${Date.now()}`,
            achievement
          };

          setNotifications(prev => [...prev, notification]);

          setTimeout(() => {
            setNotifications(prev =>
              prev.filter(n => n.id !== notification.id)
            );
          }, 5000);
        }, index * 500);
      });
    };

    window.addEventListener('achievementsUnlocked', handleAchievementUnlocked);

    return () => {
      window.removeEventListener('achievementsUnlocked', handleAchievementUnlocked);
    };
  }, []);

  const tierEmojis = {
    bronze: '🥉',
    silver: '🥈',
    gold: '🥇',
    platinum: '💎'
  };

  const tierColors = {
    bronze: 'from-amber-700 to-amber-900',
    silver: 'from-gray-400 to-gray-600',
    gold: 'from-yellow-400 to-yellow-600',
    platinum: 'from-cyan-400 to-blue-600'
  };

  return (
    <div className="fixed top-4 right-4 z-[9999] pointer-events-none">
      <AnimatePresence>
        {notifications.map((notification) => {
          const { achievement } = notification;

          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className={`bg-gradient-to-r ${tierColors[achievement.tier]} rounded-lg p-4 shadow-2xl mb-3 border-2 border-white/30 pointer-events-auto max-w-sm`}
            >
              <div className="flex items-center gap-3">
                <div className="text-5xl">
                  {tierEmojis[achievement.tier]}
                </div>
                <div className="flex-1">
                  <div className="text-white/90 text-sm font-bold mb-1">
                    {t('achievements.unlockBanner')}
                  </div>
                  <h3 className="text-white font-bold text-lg">
                    {achievement.title}
                  </h3>
                  <p className="text-white/80 text-sm">
                    {achievement.description}
                  </p>
                  <div className="flex items-center gap-1 mt-2 text-yellow-200 font-bold">
                    <span className="text-xl">🐟</span>
                    <span>+{achievement.reward}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      <Celebration
        trigger={showCelebration}
        message={t('achievements.legendary')}
        duration={3000}
      />
    </div>
  );
}

export default AchievementNotification;

