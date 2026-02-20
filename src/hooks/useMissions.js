import { useState, useEffect, useCallback } from 'react';
import { serviceContainer } from '../core/container/ServiceRegistration.js';
import { gameEvents, GAME_EVENTS } from '../patterns/Observer.js';
import { MISSION_TYPES } from '../core/services/MissionsService.js';

export function useMissions() {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const missionsService = serviceContainer.resolve('missionsService');
      setMissions(missionsService.getMissions());
      setLoading(false);

      const updateMissions = () => {
        setMissions(missionsService.getMissions());
      };

      const handleLineCleared = ({ linesCleared }) => {
        missionsService.incrementProgress(MISSION_TYPES.CLEAR_LINES, linesCleared);
        if (linesCleared === 4) {
          missionsService.incrementProgress(MISSION_TYPES.TETRIS_CLEAR, 1);
        }
        updateMissions();
      };

      const handleTSpin = () => {
        missionsService.incrementProgress(MISSION_TYPES.T_SPINS, 1);
        updateMissions();
      };

      const handlePiecePlaced = () => {
        missionsService.incrementProgress(MISSION_TYPES.PLACE_PIECES, 1);
        updateMissions();
      };

      const handleScoreUpdated = ({ score, level, combo }) => {
        if (score) {
          missionsService.updateProgress(MISSION_TYPES.SCORE_POINTS, score);
        }
        if (level) {
          missionsService.updateProgress(MISSION_TYPES.REACH_LEVEL, level);
        }
        if (combo) {
          missionsService.updateProgress(MISSION_TYPES.COMBOS, combo);
        }
        updateMissions();
      };

      const handleBackToBack = () => {
        missionsService.incrementProgress(MISSION_TYPES.BACK_TO_BACK, 1);
        updateMissions();
      };

      gameEvents.on(GAME_EVENTS.LINE_CLEARED, handleLineCleared);
      gameEvents.on(GAME_EVENTS.T_SPIN, handleTSpin);
      gameEvents.on(GAME_EVENTS.PIECE_PLACED, handlePiecePlaced);
      gameEvents.on(GAME_EVENTS.SCORE_UPDATED, handleScoreUpdated);
      gameEvents.on(GAME_EVENTS.BACK_TO_BACK, handleBackToBack);

      return () => {
        gameEvents.off(GAME_EVENTS.LINE_CLEARED, handleLineCleared);
        gameEvents.off(GAME_EVENTS.T_SPIN, handleTSpin);
        gameEvents.off(GAME_EVENTS.PIECE_PLACED, handlePiecePlaced);
        gameEvents.off(GAME_EVENTS.SCORE_UPDATED, handleScoreUpdated);
        gameEvents.off(GAME_EVENTS.BACK_TO_BACK, handleBackToBack);
      };
    } catch (error) {

      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (loading) return;

    const timer = setInterval(() => {
      try {
        const missionsService = serviceContainer.resolve('missionsService');
        const statisticsService = serviceContainer.resolve('statisticsService');
        const stats = statisticsService.getStats();

        if (stats.playTime > 0) {
          missionsService.updateProgress(MISSION_TYPES.SURVIVE_TIME, stats.playTime);
          setMissions(missionsService.getMissions());
        }
      } catch (error) {

      }
    }, 1000);

    return () => clearInterval(timer);
  }, [loading]);

  const claimReward = useCallback((missionId) => {
    try {
      const missionsService = serviceContainer.resolve('missionsService');
      const result = missionsService.claimReward(missionId);

      if (result.success) {
        setMissions(missionsService.getMissions());
        window.dispatchEvent(new Event('currencyUpdated'));
      }

      return result;
    } catch (error) {

      return { success: false, error: error.message };
    }
  }, []);

  const getMissionsStats = useCallback(() => {
    try {
      const missionsService = serviceContainer.resolve('missionsService');
      return missionsService.getStats();
    } catch (error) {

      return null;
    }
  }, []);

  return {
    missions,
    loading,
    claimReward,
    getMissionsStats
  };
}

