import { useEffect, useRef, useCallback, useState } from 'react';
import { GameService } from '../core/services/GameService.js';
import { LocalStorageRepository } from '../core/repositories/LocalStorageRepository.js';
import { PieceFactory, MovementStrategyFactory } from '../patterns/Factory.js';
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

    const repository = new LocalStorageRepository();
    const gameService = new GameService(
      PieceFactory,
      MovementStrategyFactory,
      repository
    );
    
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

  const movePiece = useCallback((direction) => {
    if (gameServiceRef.current) {
      gameServiceRef.current.movePiece(direction);
    }
  }, []);

  const rotatePiece = useCallback(() => {
    if (gameServiceRef.current) {
      gameServiceRef.current.rotatePiece();
    }
  }, []);

  const holdPiece = useCallback(() => {
    if (gameServiceRef.current) {
      gameServiceRef.current.holdPiece();
    }
  }, []);

  const hardDrop = useCallback(() => {
    if (gameServiceRef.current) {
      gameServiceRef.current.hardDrop();
    }
  }, []);

  const pause = useCallback(() => {
    if (gameServiceRef.current) {
      gameServiceRef.current.pause();
    }
  }, []);

  const resume = useCallback(() => {
    if (gameServiceRef.current) {
      gameServiceRef.current.resume();
    }
  }, []);

  const restart = useCallback(() => {
    if (gameServiceRef.current) {
      gameServiceRef.current.restart();
    }
  }, []);

  const getDropPreview = useCallback(() => {
    if (gameServiceRef.current) {
      return gameServiceRef.current.getDropPreview();
    }
    return null;
  }, []);

  return {
    gameState,
    movePiece,
    rotatePiece,
    holdPiece,
    hardDrop,
    pause,
    resume,
    restart,
    getDropPreview
  };
} 