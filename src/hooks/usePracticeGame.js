import { useState, useEffect, useCallback } from 'react';
import { serviceContainer } from '../core/container/ServiceRegistration';

/**
 * usePracticeGame - Hook para gerenciar jogo de prática do tutorial
 * Cria instância isolada do GameService para cada lesson
 */
export function usePracticeGame(lesson) {
  const [gameState, setGameState] = useState(null);
  const [gameService, setGameService] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Inicializa game service isolado
  useEffect(() => {
    if (!lesson) return;

    // Cria nova instância do GameService
    const service = serviceContainer.resolve('gameService');
    
    // Inicializa jogo
    service.initializeGame();
    
    // Setup inicial específico da lesson
    if (lesson.practice.boardSetup) {
      service.board.grid = lesson.practice.boardSetup;
    }
    
    // Peças fixas se definidas
    if (lesson.practice.pieces && lesson.practice.pieces.length > 0) {
      // TODO: Implementar sequência fixa de peças
    }
    
    setGameService(service);
    setGameState(service.getState());
    setIsInitialized(true);

    return () => {
      // Cleanup
      setGameService(null);
      setIsInitialized(false);
    };
  }, [lesson]);

  // Atualiza gameState quando o jogo muda
  useEffect(() => {
    if (!gameService) return;

    const interval = setInterval(() => {
      const newState = gameService.getState();
      setGameState(newState);
    }, 100);

    return () => clearInterval(interval);
  }, [gameService]);

  // Actions
  const actions = {
    moveLeft: useCallback(() => {
      if (!gameService) return;
      gameService.movePiece('left');
      setGameState(gameService.getState());
    }, [gameService]),

    moveRight: useCallback(() => {
      if (!gameService) return;
      gameService.movePiece('right');
      setGameState(gameService.getState());
    }, [gameService]),

    moveDown: useCallback(() => {
      if (!gameService) return;
      gameService.movePiece('down');
      setGameState(gameService.getState());
    }, [gameService]),

    rotate: useCallback(() => {
      if (!gameService) return;
      gameService.rotatePiece();
      setGameState(gameService.getState());
    }, [gameService]),

    rotateLeft: useCallback(() => {
      if (!gameService) return;
      gameService.rotatePieceLeft();
      setGameState(gameService.getState());
    }, [gameService]),

    hardDrop: useCallback(() => {
      if (!gameService) return;
      gameService.hardDrop();
      setGameState(gameService.getState());
    }, [gameService]),

    hold: useCallback(() => {
      if (!gameService) return;
      gameService.holdPiece();
      setGameState(gameService.getState());
    }, [gameService]),

    restart: useCallback(() => {
      if (!gameService) return;
      gameService.restart();
      
      // Re-apply lesson setup
      if (lesson.practice.boardSetup) {
        gameService.board.grid = lesson.practice.boardSetup;
      }
      
      setGameState(gameService.getState());
    }, [gameService, lesson])
  };

  // Detectar eventos especiais para validação
  const getValidationState = useCallback(() => {
    if (!gameState) return null;

    return {
      // Estado básico
      score: gameState.score?.points || 0,
      level: gameState.score?.level || 1,
      linesCleared: gameState.linesCleared || 0,
      totalLinesCleared: gameState.totalLinesCleared || 0,
      
      // Peça atual
      currentPiece: gameState.currentPiece,
      hasCurrentPiece: !!gameState.currentPiece,
      
      // Última peça colocada
      lastPlacedPiece: gameState.lastPlacedPiece,
      lastLinesClearedCount: gameState.lastLinesClearedCount || 0,
      
      // Hold
      heldPiece: gameState.heldPiece,
      hasUsedHold: !!gameState.heldPiece,
      
      // T-spins (detectar via scoring)
      tspinsExecuted: gameState.statistics?.tspins || 0,
      tspinMinisExecuted: gameState.statistics?.tspinMinis || 0,
      tspinDoublesExecuted: gameState.statistics?.tspinDoubles || 0,
      tspinTriplesExecuted: gameState.statistics?.tspinTriples || 0,
      
      // Combos
      currentCombo: gameState.combo || 0,
      maxComboReached: gameState.statistics?.maxCombo || 0,
      
      // Back-to-Back
      backToBackActive: gameState.backToBack || false,
      backToBackChain: gameState.statistics?.backToBackCount || 0,
      
      // Timing
      elapsedSeconds: gameState.elapsedTime ? Math.floor(gameState.elapsedTime / 1000) : 0,
      
      // Board state
      board: gameState.board,
      
      // Drops
      hardDropsUsed: gameState.statistics?.hardDrops || 0,
      softDropsUsed: gameState.statistics?.softDrops || 0,
      
      // Efficiency
      movesPerPiece: gameState.statistics?.movesPerPiece || 0,
      
      // 4-wide
      fourWideCount: gameState.statistics?.fourWideLines || 0,
      
      // Perfect clears
      perfectClearsCount: gameState.statistics?.perfectClears || 0,
      
      // Multiplayer (se aplicável)
      defeatedAI: gameState.defeatedAI || false,
      
      // Openers
      dtCannonsExecuted: gameState.statistics?.dtCannons || 0,
      tkiOpenersExecuted: gameState.statistics?.tkiOpeners || 0,
      
      // Garbage (se aplicável)
      garbageWavesSurvived: gameState.statistics?.garbageWaves || 0
    };
  }, [gameState]);

  return {
    gameState,
    actions,
    isInitialized,
    getValidationState
  };
}
