import { useState, useEffect, useCallback } from 'react';
import { serviceContainer } from '../core/container/ServiceRegistration.js';

export function useGameModes() {
  const [modes, setModes] = useState([]);
  const [currentMode, setCurrentMode] = useState(null);
  const [modeStats, setModeStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const gameModesService = serviceContainer.resolve('gameModesService');
      setModes(gameModesService.getAllModes());
      setCurrentMode(gameModesService.getCurrentMode());
      setModeStats(gameModesService.getAllStats());
      setLoading(false);
    } catch (error) {

      setLoading(false);
    }
  }, []);

  const selectMode = useCallback((modeId) => {
    try {
      const gameModesService = serviceContainer.resolve('gameModesService');
      const success = gameModesService.setMode(modeId);

      if (success) {
        setCurrentMode(gameModesService.getCurrentMode());

        window.dispatchEvent(new CustomEvent('gameModeChanged', {
          detail: { mode: gameModesService.getCurrentMode() }
        }));
      }

      return success;
    } catch (error) {

      return false;
    }
  }, []);

  const getModeStats = useCallback((modeId) => {
    try {
      const gameModesService = serviceContainer.resolve('gameModesService');
      return gameModesService.getModeStats(modeId);
    } catch (error) {

      return null;
    }
  }, []);

  const updateStats = useCallback((modeId, gameData) => {
    try {
      const gameModesService = serviceContainer.resolve('gameModesService');
      gameModesService.updateStats(modeId, gameData);
      setModeStats(gameModesService.getAllStats());
    } catch (error) {

    }
  }, []);

  return {
    modes,
    currentMode,
    modeStats,
    loading,
    selectMode,
    getModeStats,
    updateStats
  };
}

