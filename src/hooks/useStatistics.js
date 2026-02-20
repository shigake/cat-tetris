import { useState, useEffect, useCallback } from 'react';
import { serviceContainer } from '../core/container/ServiceRegistration.js';
import { gameEvents, GAME_EVENTS } from '../patterns/Observer.js';

export function useStatistics() {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const statisticsService = serviceContainer.resolve('statisticsService');
      setStatistics(statisticsService.getStats());
      setLoading(false);

      const updateStatistics = () => {
        setStatistics(statisticsService.getStats());
      };

      const handlePiecePlaced = () => {
        statisticsService.incrementPiecesPlaced();
        updateStatistics();
      };

      const handleLinesCleared = ({ linesCleared }) => {
        statisticsService.addLinesCleared(linesCleared);
        updateStatistics();
      };

      const handleTSpin = () => {
        statisticsService.incrementTSpins();
        updateStatistics();
      };

      const handleComboUpdate = ({ combo }) => {
        statisticsService.updateMaxCombo(combo);
        updateStatistics();
      };

      gameEvents.on(GAME_EVENTS.PIECE_PLACED, handlePiecePlaced);
      gameEvents.on(GAME_EVENTS.LINE_CLEARED, handleLinesCleared);
      gameEvents.on(GAME_EVENTS.T_SPIN, handleTSpin);
      gameEvents.on(GAME_EVENTS.SCORE_UPDATED, handleComboUpdate);

      return () => {
        gameEvents.off(GAME_EVENTS.PIECE_PLACED, handlePiecePlaced);
        gameEvents.off(GAME_EVENTS.LINE_CLEARED, handleLinesCleared);
        gameEvents.off(GAME_EVENTS.T_SPIN, handleTSpin);
        gameEvents.off(GAME_EVENTS.SCORE_UPDATED, handleComboUpdate);
      };
    } catch (error) {

      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (loading) return;

    const timer = setInterval(() => {
      try {
        const statisticsService = serviceContainer.resolve('statisticsService');
        statisticsService.incrementPlayTime();
        setStatistics(statisticsService.getStats());
      } catch (e) {

      }
    }, 1000);

    return () => clearInterval(timer);
  }, [loading]);

  const resetStatistics = useCallback(() => {
    try {
      const statisticsService = serviceContainer.resolve('statisticsService');
      statisticsService.reset();
      setStatistics(statisticsService.getStats());
    } catch (error) {

    }
  }, []);

  return {
    statistics,
    loading,
    resetStatistics
  };
}
