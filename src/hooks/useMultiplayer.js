import { useState, useEffect, useCallback } from 'react';
import { serviceContainer } from '../core/container/ServiceRegistration.js';

export function useMultiplayer() {
  const [currentMode, setCurrentMode] = useState(null);
  const [players, setPlayers] = useState([]);
  const [matchState, setMatchState] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    try {
      const multiplayerService = serviceContainer.resolve('multiplayerService');
      setStats(multiplayerService.getStats());
    } catch (error) {

    }
  }, []);

  const startLocalMatch = useCallback((player1Name, player2Name) => {
    try {
      const multiplayerService = serviceContainer.resolve('multiplayerService');
      const match = multiplayerService.startLocalMatch(player1Name, player2Name);

      setCurrentMode(match.mode);
      setPlayers(match.players);
      setMatchState(multiplayerService.getMatchState());

      return match;
    } catch (error) {

      return null;
    }
  }, []);

  const startAIMatch = useCallback((playerName, aiDifficulty) => {
    try {
      const multiplayerService = serviceContainer.resolve('multiplayerService');
      const match = multiplayerService.startAIMatch(playerName, aiDifficulty);

      setCurrentMode(match.mode);
      setPlayers(match.players);
      setMatchState(multiplayerService.getMatchState());

      return match;
    } catch (error) {

      return null;
    }
  }, []);

  const updatePlayerState = useCallback((playerId, gameState) => {
    try {
      const multiplayerService = serviceContainer.resolve('multiplayerService');
      multiplayerService.updatePlayerState(playerId, gameState);

      const newMatchState = multiplayerService.getMatchState();
      setMatchState(newMatchState);
      setPlayers(newMatchState.players);

      return newMatchState;
    } catch (error) {

      return null;
    }
  }, []);

  const endMatch = useCallback(() => {
    try {
      const multiplayerService = serviceContainer.resolve('multiplayerService');
      const result = multiplayerService.endMatch();

      setCurrentMode(null);
      setPlayers([]);
      setMatchState(null);
      setStats(multiplayerService.getStats());

      return result;
    } catch (error) {

      return null;
    }
  }, []);

  const getAvailableModes = useCallback(() => {
    try {
      const multiplayerService = serviceContainer.resolve('multiplayerService');
      return multiplayerService.getAvailableModes();
    } catch (error) {

      return [];
    }
  }, []);

  const refreshStats = useCallback(() => {
    try {
      const multiplayerService = serviceContainer.resolve('multiplayerService');
      setStats(multiplayerService.getStats());
    } catch (error) {

    }
  }, []);

  return {
    currentMode,
    players,
    matchState,
    stats,
    startLocalMatch,
    startAIMatch,
    updatePlayerState,
    endMatch,
    getAvailableModes,
    refreshStats
  };
}

