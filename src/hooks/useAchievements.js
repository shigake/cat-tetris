import { useState, useEffect, useCallback } from 'react';
import { serviceContainer } from '../core/container/ServiceRegistration.js';
import { gameEvents, GAME_EVENTS } from '../patterns/Observer.js';

/**
 * Hook para gerenciar conquistas
 */
export function useAchievements() {
  const [achievements, setAchievements] = useState([]);
  const [newUnlocks, setNewUnlocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const achievementsService = serviceContainer.resolve('achievementsService');
      setAchievements(achievementsService.getAchievements());
      setLoading(false);

      // Check achievements periodically
      const checkInterval = setInterval(() => {
        const playerStatsService = serviceContainer.resolve('playerStatsService');
        const stats = playerStatsService.getStats();
        
        const unlocked = achievementsService.checkAchievements(stats);
        
        if (unlocked.length > 0) {
          setAchievements(achievementsService.getAchievements());
          setNewUnlocks(unlocked);
          
          // Dispatch event for UI notification
          window.dispatchEvent(new CustomEvent('achievementsUnlocked', { 
            detail: unlocked 
          }));
          
          // Clear new unlocks after 5 seconds
          setTimeout(() => {
            setNewUnlocks([]);
          }, 5000);
        }
      }, 2000);

      return () => clearInterval(checkInterval);
    } catch (error) {
      console.error('Failed to initialize achievements service:', error);
      setLoading(false);
    }
  }, []);

  const getAchievementsByTier = useCallback((tier) => {
    try {
      const achievementsService = serviceContainer.resolve('achievementsService');
      return achievementsService.getByTier(tier);
    } catch (error) {
      console.error('Failed to get achievements by tier:', error);
      return [];
    }
  }, []);

  const getUnlocked = useCallback(() => {
    try {
      const achievementsService = serviceContainer.resolve('achievementsService');
      return achievementsService.getUnlocked();
    } catch (error) {
      console.error('Failed to get unlocked achievements:', error);
      return [];
    }
  }, []);

  const getLocked = useCallback(() => {
    try {
      const achievementsService = serviceContainer.resolve('achievementsService');
      return achievementsService.getLocked();
    } catch (error) {
      console.error('Failed to get locked achievements:', error);
      return [];
    }
  }, []);

  const getStats = useCallback(() => {
    try {
      const achievementsService = serviceContainer.resolve('achievementsService');
      return achievementsService.getStats();
    } catch (error) {
      console.error('Failed to get achievements stats:', error);
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
