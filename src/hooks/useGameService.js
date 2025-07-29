import { useEffect, useRef, useCallback, useState } from 'react';
import { serviceContainer } from '../core/container/ServiceRegistration.js';
import { gameEvents, GAME_EVENTS } from '../patterns/Observer.js';

export function useGameService() {
  const [gameState, setGameState] = useState(null);
  const gameServiceRef = useRef(null);
  const gameLoopRef = useRef(null);
  const lastTimeRef = useRef(0);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    try {
      const gameService = serviceContainer.resolve('gameService');
      gameServiceRef.current = gameService;
      gameService.initializeGame();
      setGameState(gameService.getGameState());

      const handleGameStateUpdate = () => {
        if (gameServiceRef.current) {
          const newState = gameServiceRef.current.getGameState();
          setGameState(newState);
        }
      };

      Object.values(GAME_EVENTS).forEach(event => {
        gameEvents.on(event, handleGameStateUpdate);
      });

      return () => {
        Object.values(GAME_EVENTS).forEach(event => {
          gameEvents.off(event, handleGameStateUpdate);
        });
        if (gameLoopRef.current) {
          cancelAnimationFrame(gameLoopRef.current);
        }
      };
    } catch (error) {
      console.error('Failed to initialize game service:', error);
      throw error;
    }
  }, []);

  useEffect(() => {
    if (!gameServiceRef.current) return;

    const gameLoop = (currentTime) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = currentTime;
      }

      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      if (gameServiceRef.current) {
        gameServiceRef.current.updateGame(deltaTime);
      }
      
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, []);

  const createGameAction = useCallback((actionName) => {
    return (...args) => {
      if (gameServiceRef.current && typeof gameServiceRef.current[actionName] === 'function') {
        try {
          return gameServiceRef.current[actionName](...args);
        } catch (error) {
          console.error(`Error executing ${actionName}:`, error);
        }
      }
    };
  }, []);

  const movePiece = useCallback(createGameAction('movePiece'), [createGameAction]);
  const rotatePiece = useCallback(createGameAction('rotatePiece'), [createGameAction]);
  const holdPiece = useCallback(createGameAction('holdPiece'), [createGameAction]);
  const hardDrop = useCallback(createGameAction('hardDrop'), [createGameAction]);
  const pause = useCallback(createGameAction('pause'), [createGameAction]);
  const resume = useCallback(createGameAction('resume'), [createGameAction]);
  const restart = useCallback(createGameAction('restart'), [createGameAction]);
  const getDropPreview = useCallback(createGameAction('getDropPreview'), [createGameAction]);

  return {
    gameState,
    actions: {
      movePiece,
      rotatePiece,
      holdPiece,
      hardDrop,
      pause,
      resume,
      restart,
      getDropPreview
    }
  };
} 