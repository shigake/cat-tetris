import { useState, useEffect, useCallback } from 'react';
import { serviceContainer } from '../core/container/ServiceRegistration.js';

export function useLeaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [playerRank, setPlayerRank] = useState(null);
  const [aroundPlayer, setAroundPlayer] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const leaderboardService = serviceContainer.resolve('leaderboardService');

      setLeaderboard(leaderboardService.getGlobalLeaderboard(100));
      setPlayerRank(leaderboardService.getPlayerRank());
      setAroundPlayer(leaderboardService.getAroundPlayer(5));
      setLoading(false);

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

    }
  }, []);

  const getWeeklyLeaderboard = useCallback(() => {
    try {
      const leaderboardService = serviceContainer.resolve('leaderboardService');
      return leaderboardService.getWeeklyLeaderboard(50);
    } catch (error) {

      return [];
    }
  }, []);

  const getCountryLeaderboard = useCallback((country) => {
    try {
      const leaderboardService = serviceContainer.resolve('leaderboardService');
      return leaderboardService.getCountryLeaderboard(country, 50);
    } catch (error) {

      return [];
    }
  }, []);

  const setPlayerName = useCallback((name) => {
    try {
      const leaderboardService = serviceContainer.resolve('leaderboardService');
      leaderboardService.setPlayerName(name);
      refreshLeaderboard();
    } catch (error) {

    }
  }, [refreshLeaderboard]);

  const getPlayerName = useCallback(() => {
    try {
      const leaderboardService = serviceContainer.resolve('leaderboardService');
      return leaderboardService.getPlayerName();
    } catch (error) {

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

