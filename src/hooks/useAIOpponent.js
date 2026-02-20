import { useState, useEffect, useCallback } from 'react';
import { serviceContainer } from '../core/container/ServiceRegistration.js';

export function useAIOpponent() {
  const [difficulty, setDifficulty] = useState('medium');
  const [aiService, setAiService] = useState(null);

  useEffect(() => {
    try {
      const service = serviceContainer.resolve('aiOpponentService');
      service.setDifficulty(difficulty);
      setAiService(service);
    } catch (error) {

    }
  }, [difficulty]);

  const getNextMove = useCallback((gameState) => {
    if (!aiService) return null;

    try {
      return aiService.decideNextMove(gameState);
    } catch (error) {

      return null;
    }
  }, [aiService]);

  const changeDifficulty = useCallback((newDifficulty) => {
    setDifficulty(newDifficulty);
    if (aiService) {
      aiService.setDifficulty(newDifficulty);
    }
  }, [aiService]);

  const getDifficulties = useCallback(() => {
    if (!aiService) return [];
    return aiService.getDifficulties();
  }, [aiService]);

  return {
    difficulty,
    changeDifficulty,
    getNextMove,
    getDifficulties
  };
}

