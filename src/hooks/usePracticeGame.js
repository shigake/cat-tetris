import { useState, useEffect, useCallback, useRef } from 'react';
import { GameService } from '../core/services/GameService';
import { PieceFactory, MovementStrategyFactory } from '../patterns/Factory';
import { ScoringService } from '../core/services/ScoringService';

/**
 * usePracticeGame - Hook para gerenciar jogo de prática do tutorial
 * Cria instância ISOLADA do GameService (não usa o singleton do container)
 */
export function usePracticeGame(lesson) {
  const [gameState, setGameState] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const gameServiceRef = useRef(null);
  const maxComboRef = useRef(0);

  // Inicializa game service isolado
  useEffect(() => {
    if (!lesson) {
      setGameState(null);
      setIsInitialized(false);
      gameServiceRef.current = null;
      maxComboRef.current = 0;
      return;
    }

    const service = new GameService(
      new PieceFactory(),
      new MovementStrategyFactory(),
      null,
      new ScoringService()
    );

    service.initializeGame();
    service.isPlaying = true;
    maxComboRef.current = 0;

    gameServiceRef.current = service;
    setGameState(service.getGameState());
    setIsInitialized(true);

    return () => {
      gameServiceRef.current = null;
      setIsInitialized(false);
    };
  }, [lesson]);

  // Game loop — gravity + state sync (same pattern as useGameService)
  const lastTimeRef = useRef(0);
  const loopRef = useRef(null);

  useEffect(() => {
    if (!gameServiceRef.current || !isInitialized) return;
    lastTimeRef.current = 0;

    const loop = (currentTime) => {
      if (!lastTimeRef.current) lastTimeRef.current = currentTime;
      const dt = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      const svc = gameServiceRef.current;
      if (svc) {
        if (svc.isPlaying && !svc.isPaused && !svc.gameOver) {
          svc.updateGame(dt);
        }
        const s = svc.getGameState();
        const combo = s.score?.combo || 0;
        if (combo > maxComboRef.current) maxComboRef.current = combo;
        setGameState(s);
      }

      loopRef.current = requestAnimationFrame(loop);
    };

    loopRef.current = requestAnimationFrame(loop);

    return () => {
      if (loopRef.current) cancelAnimationFrame(loopRef.current);
    };
  }, [isInitialized]);

  const actions = {
    movePiece: useCallback((direction) => {
      gameServiceRef.current?.movePiece(direction);
    }, []),

    rotatePiece: useCallback(() => {
      gameServiceRef.current?.rotatePiece();
    }, []),

    rotatePieceLeft: useCallback(() => {
      gameServiceRef.current?.rotatePieceLeft?.();
    }, []),

    hardDrop: useCallback(() => {
      gameServiceRef.current?.hardDrop();
    }, []),

    holdPiece: useCallback(() => {
      gameServiceRef.current?.holdPiece();
    }, []),

    pause: useCallback(() => {
      gameServiceRef.current?.pause();
    }, []),

    resume: useCallback(() => {
      gameServiceRef.current?.resume();
    }, []),

    restart: useCallback(() => {
      if (!gameServiceRef.current) return;
      gameServiceRef.current.restart();
      maxComboRef.current = 0;
    }, []),

    getDropPreview: useCallback(() => {
      try { return gameServiceRef.current?.getDropPreview() || null; } catch { return null; }
    }, [])
  };

  // Validation state — only fields the engine actually tracks
  const getValidationState = useCallback(() => {
    if (!gameState) return null;

    return {
      score: gameState.score?.points || 0,
      level: gameState.score?.level || 1,
      linesCleared: gameState.score?.lines || 0,

      currentPiece: gameState.currentPiece,
      hasCurrentPiece: !!gameState.currentPiece,

      heldPiece: gameState.heldPiece,
      hasUsedHold: !!gameState.heldPiece,

      currentCombo: gameState.score?.combo || 0,
      maxCombo: maxComboRef.current,
      backToBackActive: gameState.backToBack || false,

      board: gameState.board,
      gameOver: gameState.gameOver,
      isPlaying: gameState.isPlaying,
      isPaused: gameState.isPaused,

      tSpins: gameState.score?.tSpins || 0,
    };
  }, [gameState]);

  return {
    gameState,
    actions,
    isInitialized,
    getValidationState
  };
}
