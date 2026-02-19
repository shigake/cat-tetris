import { useState, useEffect, useCallback } from 'react';
import { serviceContainer } from '../core/container/ServiceRegistration.js';

/**
 * Hook para gerenciar modos de jogo
 */
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
      console.error('Failed to initialize game modes service:', error);
      setLoading(false);
    }
  }, []);

  const selectMode = useCallback((modeId) => {
    try {
      const gameModesService = serviceContainer.resolve('gameModesService');
      const success = gameModesService.setMode(modeId);
      
      if (success) {
        setCurrentMode(gameModesService.getCurrentMode());
        
        // Dispatch event for game to react
        window.dispatchEvent(new CustomEvent('gameModeChanged', {
          detail: { mode: gameModesService.getCurrentMode() }
        }));
      }
      
      return success;
    } catch (error) {
      console.error('Failed to select mode:', error);
      return false;
    }
  }, []);

  const getModeStats = useCallback((modeId) => {
    try {
      const gameModesService = serviceContainer.resolve('gameModesService');
      return gameModesService.getModeStats(modeId);
    } catch (error) {
      console.error('Failed to get mode stats:', error);
      return null;
    }
  }, []);

  const updateStats = useCallback((modeId, gameData) => {
    try {
      const gameModesService = serviceContainer.resolve('gameModesService');
      gameModesService.updateStats(modeId, gameData);
      setModeStats(gameModesService.getAllStats());
    } catch (error) {
      console.error('Failed to update mode stats:', error);
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
