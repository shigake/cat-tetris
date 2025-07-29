import { useState, useEffect, useRef, useCallback } from 'react';
import { AIPlayer } from '../ai/core/AIPlayer.js';
import { HeuristicStrategy } from '../ai/strategies/HeuristicStrategy.js';

export function useAIPlayer() {
  const [aiPlayer, setAIPlayer] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [currentStrategy, setCurrentStrategy] = useState('heuristic');
  const [speed, setSpeed] = useState(1);
  const [metrics, setMetrics] = useState({});
  const [isThinking, setIsThinking] = useState(false);
  const [lastMove, setLastMove] = useState(null);
  
  const intervalRef = useRef(null);
  const gameStateRef = useRef(null);

  useEffect(() => {
    const player = new AIPlayer(new HeuristicStrategy());
    setAIPlayer(player);
    setMetrics(player.getMetrics());
  }, []);

  const activateAI = useCallback(() => {
    if (aiPlayer) {
      aiPlayer.activate();
      setIsActive(true);
    }
  }, [aiPlayer]);

  const deactivateAI = useCallback(() => {
    if (aiPlayer) {
      aiPlayer.deactivate();
      setIsActive(false);
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [aiPlayer]);

  const changeSpeed = useCallback((newSpeed) => {
    if (aiPlayer) {
      aiPlayer.setSpeed(newSpeed);
      setSpeed(newSpeed);
    }
  }, [aiPlayer]);

  const changeStrategy = useCallback((strategyName) => {
    if (aiPlayer) {
      let strategy;
      switch (strategyName) {
        case 'heuristic':
          strategy = new HeuristicStrategy();
          break;
        default:
          strategy = new HeuristicStrategy();
      }
      
      aiPlayer.setStrategy(strategy);
      setCurrentStrategy(strategyName);
    }
  }, [aiPlayer]);

  const makeAIMove = useCallback(async (gameState, executeMove) => {
    if (!aiPlayer || !isActive || !gameState) return null;

    try {
      setIsThinking(true);
      gameStateRef.current = gameState;
      
      const aiMove = await aiPlayer.makeMove(gameState);
      
      if (aiMove && executeMove) {
        setLastMove(aiMove);
        
        const delay = Math.max(100, 1000 / speed);
        setTimeout(() => {
          executeMove(aiMove);
          setIsThinking(false);
        }, delay);
        
        return aiMove;
      }
      
      setIsThinking(false);
      return aiMove;
    } catch (error) {
      console.error('AI Move error:', error);
      setIsThinking(false);
      return null;
    }
  }, [aiPlayer, isActive, speed]);

  const startAIGame = useCallback((gameState) => {
    if (aiPlayer && gameState) {
      aiPlayer.startGame(gameState);
    }
  }, [aiPlayer]);

  const endAIGame = useCallback((finalScore, linesCleared, gameTime) => {
    if (aiPlayer) {
      aiPlayer.endGame(finalScore, linesCleared, gameTime);
      setMetrics(aiPlayer.getMetrics());
    }
  }, [aiPlayer]);

  const recordAIMove = useCallback((move, result) => {
    if (aiPlayer) {
      aiPlayer.recordMove(move, result);
      setMetrics(aiPlayer.getMetrics());
    }
  }, [aiPlayer]);

  const getStrategyInfo = useCallback(() => {
    return aiPlayer ? aiPlayer.getStrategyInfo() : null;
  }, [aiPlayer]);

  const exportAIConfig = useCallback(() => {
    return aiPlayer ? aiPlayer.exportConfiguration() : null;
  }, [aiPlayer]);

  const importAIConfig = useCallback((config) => {
    if (aiPlayer && config) {
      aiPlayer.importConfiguration(config);
      setSpeed(aiPlayer.speed);
    }
  }, [aiPlayer]);

  const resetAIMetrics = useCallback(() => {
    if (aiPlayer) {
      aiPlayer.resetMetrics();
      setMetrics(aiPlayer.getMetrics());
    }
  }, [aiPlayer]);

  const updateWeights = useCallback((newWeights) => {
    if (aiPlayer) {
      aiPlayer.updateStrategy({ weights: newWeights });
    }
  }, [aiPlayer]);

  const simulateGames = useCallback(async (gameEngine, numberOfGames = 10) => {
    if (!aiPlayer) return null;
    
    return aiPlayer.simulateGames(gameEngine, numberOfGames);
  }, [aiPlayer]);

  const getAIRecommendation = useCallback(async (gameState) => {
    if (!aiPlayer || !gameState) return null;
    
    const tempPlayer = new AIPlayer(aiPlayer.strategy);
    return await tempPlayer.makeMove(gameState);
  }, [aiPlayer]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    // AI State
    aiPlayer,
    isActive,
    currentStrategy,
    speed,
    metrics,
    isThinking,
    lastMove,

    // AI Controls
    activateAI,
    deactivateAI,
    changeSpeed,
    changeStrategy,

    // AI Game Integration
    makeAIMove,
    startAIGame,
    endAIGame,
    recordAIMove,

    // AI Information
    getStrategyInfo,
    getAIRecommendation,

    // AI Configuration
    exportAIConfig,
    importAIConfig,
    resetAIMetrics,
    updateWeights,

    // AI Testing
    simulateGames,

    // Utilities
    isAIAvailable: !!aiPlayer
  };
} 