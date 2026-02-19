import { useState, useEffect, useCallback } from 'react';
import { serviceContainer } from '../core/container/ServiceRegistration.js';

/**
 * Hook para gerenciar leaderboard
 */
export function useLeaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [playerRank, setPlayerRank] = useState(null);
  const [aroundPlayer, setAroundPlayer] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const leaderboardService = serviceContainer.resolve('leaderboardService');
      
      // Load initial data
      setLeaderboard(leaderboardService.getGlobalLeaderboard(100));
      setPlayerRank(leaderboardService.getPlayerRank());
      setAroundPlayer(leaderboardService.getAroundPlayer(5));
      setLoading(false);

      // Listen for player stats updates
      const handleStatsUpdate = () => {
        setLeaderboard(leaderboardService.getGlobalLeaderboard(100));
        setPlayerRank(leaderboardService.getPlayerRank());
        setAroundPlayer(leaderboardService.getAroundPlayer(5));
      };

      window.addEventListener('playerStatsUpdated', handleStatsUpdate);

      return () => {
        window.removeEventListener('playerStatsUpdated', handleStatsUpdate);
      };
    } catch (error) {
      console.error('Failed to initialize leaderboard service:', error);
      setLoading(false);
    }
  }, []);

  const refreshLeaderboard = useCallback(() => {
    try {
      const leaderboardService = serviceContainer.resolve('leaderboardService');
      setLeaderboard(leaderboardService.getGlobalLeaderboard(100));
      setPlayerRank(leaderboardService.getPlayerRank());
      setAroundPlayer(leaderboardService.getAroundPlayer(5));
    } catch (error) {
      console.error('Failed to refresh leaderboard:', error);
    }
  }, []);

  const getWeeklyLeaderboard = useCallback(() => {
    try {
      const leaderboardService = serviceContainer.resolve('leaderboardService');
      return leaderboardService.getWeeklyLeaderboard(50);
    } catch (error) {
      console.error('Failed to get weekly leaderboard:', error);
      return [];
    }
  }, []);

  const getCountryLeaderboard = useCallback((country) => {
    try {
      const leaderboardService = serviceContainer.resolve('leaderboardService');
      return leaderboardService.getCountryLeaderboard(country, 50);
    } catch (error) {
      console.error('Failed to get country leaderboard:', error);
      return [];
    }
  }, []);

  const setPlayerName = useCallback((name) => {
    try {
      const leaderboardService = serviceContainer.resolve('leaderboardService');
      leaderboardService.setPlayerName(name);
      refreshLeaderboard();
    } catch (error) {
      console.error('Failed to set player name:', error);
    }
  }, [refreshLeaderboard]);

  const getPlayerName = useCallback(() => {
    try {
      const leaderboardService = serviceContainer.resolve('leaderboardService');
      return leaderboardService.getPlayerName();
    } catch (error) {
      console.error('Failed to get player name:', error);
      return 'Jogador';
    }
  }, []);

  return {
    leaderboard,
    playerRank,
    aroundPlayer,
    loading,
    refreshLeaderboard,
    getWeeklyLeaderboard,
    getCountryLeaderboard,
    setPlayerName,
    getPlayerName
  };
}
