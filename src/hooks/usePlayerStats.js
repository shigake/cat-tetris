import { useState, useEffect, useCallback } from 'react';
import { serviceContainer } from '../core/container/ServiceRegistration.js';
import { gameEvents, GAME_EVENTS } from '../patterns/Observer.js';

export function usePlayerStats() {
  const [playerStats, setPlayerStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const playerStatsService = serviceContainer.resolve('playerStatsService');
      setPlayerStats(playerStatsService.getStats());
      setLoading(false);

      const handleGameOver = () => {
        try {
          const statisticsService = serviceContainer.resolve('statisticsService');
          const gameServiceRef = serviceContainer.resolve('gameService');
          const gameState = gameServiceRef.getGameState();

          const sessionStats = statisticsService.getStats();

          const gameData = {
            score: gameState.score.points,
            level: gameState.score.level,
            linesCleared: sessionStats.linesCleared,
            piecesPlaced: sessionStats.piecesPlaced,
            tSpins: sessionStats.tSpins,
            backToBack: sessionStats.backToBack,
            maxCombo: sessionStats.maxCombo,
            playTime: sessionStats.playTime
          };

          playerStatsService.updateAfterGame(gameData);
          setPlayerStats(playerStatsService.getStats());

          window.dispatchEvent(new Event('playerStatsUpdated'));
        } catch (error) {

        }
      };

      gameEvents.on(GAME_EVENTS.GAME_OVER, handleGameOver);

      return () => {
        gameEvents.off(GAME_EVENTS.GAME_OVER, handleGameOver);
      };
    } catch (error) {

      setLoading(false);
    }
  }, []);

  const updateRecord = useCallback((recordName, value) => {
    try {
      const playerStatsService = serviceContainer.resolve('playerStatsService');
      const updated = playerStatsService.updateRecord(recordName, value);
      if (updated) {
        setPlayerStats(playerStatsService.getStats());
        window.dispatchEvent(new Event('playerStatsUpdated'));
      }
      return updated;
    } catch (error) {

      return false;
    }
  }, []);

  const incrementStat = useCallback((statName, amount = 1) => {
    try {
      const playerStatsService = serviceContainer.resolve('playerStatsService');
      playerStatsService.incrementStat(statName, amount);
      setPlayerStats(playerStatsService.getStats());
      window.dispatchEvent(new Event('playerStatsUpdated'));
    } catch (error) {

    }
  }, []);

  return {
    playerStats,
    loading,
    updateRecord,
    incrementStat
  };
}

