import { useState, useEffect, useCallback } from 'react';
import { serviceContainer } from '../core/container/ServiceRegistration.js';
import { gameEvents, GAME_EVENTS } from '../patterns/Observer.js';

export function useAchievements() {
  const [achievements, setAchievements] = useState([]);
  const [newUnlocks, setNewUnlocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const achievementsService = serviceContainer.resolve('achievementsService');
      setAchievements(achievementsService.getAchievements());
      setLoading(false);

      const checkInterval = setInterval(() => {
        const playerStatsService = serviceContainer.resolve('playerStatsService');
        const stats = playerStatsService.getStats();

        const unlocked = achievementsService.checkAchievements(stats);

        if (unlocked.length > 0) {
          setAchievements(achievementsService.getAchievements());
          setNewUnlocks(unlocked);

          window.dispatchEvent(new CustomEvent('achievementsUnlocked', {
            detail: unlocked
          }));

          setTimeout(() => {
            setNewUnlocks([]);
          }, 5000);
        }
      }, 2000);

      return () => clearInterval(checkInterval);
    } catch (error) {

      setLoading(false);
    }
  }, []);

  const getAchievementsByTier = useCallback((tier) => {
    try {
      const achievementsService = serviceContainer.resolve('achievementsService');
      return achievementsService.getByTier(tier);
    } catch (error) {

      return [];
    }
  }, []);

  const getUnlocked = useCallback(() => {
    try {
      const achievementsService = serviceContainer.resolve('achievementsService');
      return achievementsService.getUnlocked();
    } catch (error) {

      return [];
    }
  }, []);

  const getLocked = useCallback(() => {
    try {
      const achievementsService = serviceContainer.resolve('achievementsService');
      return achievementsService.getLocked();
    } catch (error) {

      return [];
    }
  }, []);

  const getStats = useCallback(() => {
    try {
      const achievementsService = serviceContainer.resolve('achievementsService');
      return achievementsService.getStats();
    } catch (error) {

      return null;
    }
  }, []);

  return {
    achievements,
    newUnlocks,
    loading,
    getAchievementsByTier,
    getUnlocked,
    getLocked,
    getStats
  };
}

