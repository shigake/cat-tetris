import { useState, useEffect, useCallback } from 'react';
import { serviceContainer } from '../core/container/ServiceRegistration.js';

/**
 * Hook para gerenciar IA adversária
 */
export function useAIOpponent() {
  const [difficulty, setDifficulty] = useState('medium');
  const [aiService, setAiService] = useState(null);

  useEffect(() => {
    try {
      const service = serviceContainer.resolve('aiOpponentService');
      service.setDifficulty(difficulty);
      setAiService(service);
    } catch (error) {
      console.error('Failed to initialize AI opponent service:', error);
    }
  }, [difficulty]);

  const getNextMove = useCallback((gameState) => {
    if (!aiService) return null;
    
    try {
      return aiService.decideNextMove(gameState);
    } catch (error) {
      console.error('Failed to get AI move:', error);
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
