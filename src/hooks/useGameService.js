import { useEffect, useRef, useCallback, useState } from 'react';
import { serviceContainer } from '../core/container/ServiceRegistration.js';
import { gameEvents, GAME_EVENTS } from '../patterns/Observer.js';
import { errorLogger } from '../services/ErrorLogger.js';

export function useGameService() {
  const [gameState, setGameState] = useState(null);
  const gameServiceRef = useRef(null);
  const gameLoopRef = useRef(null);
  const lastTimeRef = useRef(0);
  const initializedRef = useRef(false);
  const dirtyRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    try {
      const gameService = serviceContainer.resolve('gameService');
      gameServiceRef.current = gameService;
      gameService.initializeGame();
      setGameState(gameService.getGameState());

      const markDirty = () => {
        dirtyRef.current = true;
      };

      Object.values(GAME_EVENTS).forEach(event => {
        gameEvents.on(event, markDirty);
      });

      return () => {
        Object.values(GAME_EVENTS).forEach(event => {
          gameEvents.off(event, markDirty);
        });
        if (gameLoopRef.current) {
          cancelAnimationFrame(gameLoopRef.current);
        }
      };
    } catch (error) {
      errorLogger.logError('useGameService', 'init', error.message, {
        stack: error.stack
      });
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

        if (gameServiceRef.current.isPlaying &&
            !gameServiceRef.current.isPaused &&
            !gameServiceRef.current.gameOver) {
          gameServiceRef.current.updateGame(deltaTime);
        }

        if (dirtyRef.current) {
          dirtyRef.current = false;
          setGameState(gameServiceRef.current.getGameState());
        }
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
          if (!['getDropPreview', 'updateGame', 'getGameState'].includes(actionName)) {
            errorLogger.logAction('useGameService', actionName, {
              args: args.length > 0 ? args : undefined
            });
          }
          return gameServiceRef.current[actionName](...args);
        } catch (error) {
          errorLogger.logError('useGameService', actionName, error.message, {
            stack: error.stack,
            args: args.map(a => String(a).slice(0, 100))
          });

          if (actionName === 'getDropPreview') {
            return null;
          }
          throw error;
        }
      }
    };
  }, []);

  const movePiece = useCallback(createGameAction('movePiece'), [createGameAction]);
  const rotatePiece = useCallback(createGameAction('rotatePiece'), [createGameAction]);
  const rotatePieceLeft = useCallback(createGameAction('rotatePieceLeft'), [createGameAction]);
  const hardDrop = useCallback(createGameAction('hardDrop'), [createGameAction]);
  const holdPiece = useCallback(createGameAction('holdPiece'), [createGameAction]);
  const getDropPreview = useCallback(createGameAction('getDropPreview'), [createGameAction]);
  const pause = useCallback(createGameAction('pause'), [createGameAction]);
  const resume = useCallback(createGameAction('resume'), [createGameAction]);
  const restart = useCallback(createGameAction('restart'), [createGameAction]);
  const saveGame = useCallback(createGameAction('saveGame'), [createGameAction]);
  const loadGame = useCallback(createGameAction('loadGame'), [createGameAction]);

  const actions = {
    movePiece,
    rotatePiece,
    rotatePieceLeft,
    hardDrop,
    holdPiece,
    getDropPreview,
    pause,
    resume,
    restart,
    saveGame,
    loadGame
  };

  return { gameState, actions };
}
