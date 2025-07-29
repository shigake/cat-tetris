import { useEffect, useRef, useCallback, useState } from 'react';
import { serviceContainer } from '../core/container/ServiceRegistration.js';
import { gameEvents, GAME_EVENTS } from '../patterns/Observer.js';
import { useAIPlayer } from './useAIPlayer.js';

export function useGameService() {
  const [gameState, setGameState] = useState(null);
  const gameServiceRef = useRef(null);
  const gameLoopRef = useRef(null);
  const lastTimeRef = useRef(0);
  const initializedRef = useRef(false);
  const aiMoveTimeoutRef = useRef(null);

  // AI Integration
  const {
    isActive: isAIActive,
    makeAIMove,
    startAIGame,
    endAIGame,
    recordAIMove,
    ...aiControls
  } = useAIPlayer();

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

          // AI Integration: Start AI game if needed
          if (isAIActive && newState.isPlaying && !newState.isPaused && !newState.gameOver) {
            scheduleAIMove(newState);
          }

          // Track game end for AI
          if (newState.gameOver && isAIActive) {
            endAIGame(
              newState.score.value,
              newState.score.lines,
              Date.now() - (gameServiceRef.current.gameStartTime || Date.now())
            );
          }
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
        if (aiMoveTimeoutRef.current) {
          clearTimeout(aiMoveTimeoutRef.current);
        }
      };
    } catch (error) {
      console.error('Failed to initialize game service:', error);
      throw error;
    }
  }, [isAIActive, endAIGame]);

  // Schedule AI moves with configurable timing
  const scheduleAIMove = useCallback((currentGameState) => {
    if (!isAIActive || !currentGameState || currentGameState.gameOver || currentGameState.isPaused) {
      return;
    }

    // Clear any existing timeout
    if (aiMoveTimeoutRef.current) {
      clearTimeout(aiMoveTimeoutRef.current);
    }

    const delay = Math.max(100, 1000 / aiControls.speed);
    
    aiMoveTimeoutRef.current = setTimeout(async () => {
      try {
        const aiMove = await makeAIMove(currentGameState);
        
        if (aiMove && gameServiceRef.current && !gameServiceRef.current.gameOver) {
          executeAIMove(aiMove);
        }
      } catch (error) {
        console.error('AI Move execution error:', error);
      }
    }, delay);
  }, [isAIActive, aiControls.speed, makeAIMove]);

  // Execute AI move in the game
  const executeAIMove = useCallback((aiMove) => {
    if (!gameServiceRef.current || !aiMove) return;

    try {
      const gameService = gameServiceRef.current;
      
      // Move piece to target position
      if (aiMove.x !== undefined) {
        const currentX = gameService.currentPiece?.position?.x || 0;
        const deltaX = aiMove.x - currentX;
        
        // Move horizontally
        for (let i = 0; i < Math.abs(deltaX); i++) {
          if (deltaX > 0) {
            gameService.movePieceRight();
          } else {
            gameService.movePieceLeft();
          }
        }
      }

      // Rotate piece
      if (aiMove.rotation) {
        for (let i = 0; i < aiMove.rotation; i++) {
          gameService.rotatePiece();
        }
      }

      // Hard drop
      gameService.hardDrop();

      // Record the move result for AI metrics
      const result = {
        linesCleared: gameService.score.lines,
        score: gameService.score.value,
        tSpin: aiMove.evaluation?.tSpinBonus > 0,
        tetris: aiMove.evaluation?.linesCleared === 4
      };

      recordAIMove(aiMove, result);

    } catch (error) {
      console.error('Failed to execute AI move:', error);
    }
  }, [recordAIMove]);

  useEffect(() => {
    if (!gameServiceRef.current) return;

    const gameLoop = (currentTime) => {
      if (!gameServiceRef.current) return;

      const deltaTime = currentTime - lastTimeRef.current;
      if (deltaTime >= 16) {
        gameServiceRef.current.update(deltaTime);
        lastTimeRef.current = currentTime;
      }

      if (gameServiceRef.current.isPlaying && !gameServiceRef.current.gameOver) {
        gameLoopRef.current = requestAnimationFrame(gameLoop);
      }
    };

    if (gameState?.isPlaying && !gameState?.isPaused) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState?.isPlaying, gameState?.isPaused]);

  const startGame = useCallback(() => {
    if (gameServiceRef.current) {
      gameServiceRef.current.startGame();
      
      // Initialize AI game tracking
      if (isAIActive) {
        const currentState = gameServiceRef.current.getGameState();
        startAIGame(currentState);
        gameServiceRef.current.gameStartTime = Date.now();
      }
    }
  }, [isAIActive, startAIGame]);

  const pauseGame = useCallback(() => {
    if (gameServiceRef.current) {
      gameServiceRef.current.pauseGame();
      
      // Clear AI timeout when pausing
      if (aiMoveTimeoutRef.current) {
        clearTimeout(aiMoveTimeoutRef.current);
      }
    }
  }, []);

  const resumeGame = useCallback(() => {
    if (gameServiceRef.current) {
      gameServiceRef.current.resumeGame();
      
      // Resume AI if active
      if (isAIActive) {
        const currentState = gameServiceRef.current.getGameState();
        scheduleAIMove(currentState);
      }
    }
  }, [isAIActive, scheduleAIMove]);

  const resetGame = useCallback(() => {
    if (gameServiceRef.current) {
      gameServiceRef.current.initializeGame();
      
      // Clear AI timeout
      if (aiMoveTimeoutRef.current) {
        clearTimeout(aiMoveTimeoutRef.current);
      }
    }
  }, []);

  const movePieceLeft = useCallback(() => {
    if (gameServiceRef.current && !isAIActive) {
      gameServiceRef.current.movePieceLeft();
    }
  }, [isAIActive]);

  const movePieceRight = useCallback(() => {
    if (gameServiceRef.current && !isAIActive) {
      gameServiceRef.current.movePieceRight();
    }
  }, [isAIActive]);

  const movePieceDown = useCallback(() => {
    if (gameServiceRef.current && !isAIActive) {
      gameServiceRef.current.movePieceDown();
    }
  }, [isAIActive]);

  const rotatePiece = useCallback(() => {
    if (gameServiceRef.current && !isAIActive) {
      gameServiceRef.current.rotatePiece();
    }
  }, [isAIActive]);

  const hardDrop = useCallback(() => {
    if (gameServiceRef.current && !isAIActive) {
      gameServiceRef.current.hardDrop();
    }
  }, [isAIActive]);

  const holdPiece = useCallback(() => {
    if (gameServiceRef.current && !isAIActive) {
      gameServiceRef.current.holdPiece();
    }
  }, [isAIActive]);

  return {
    gameState,
    startGame,
    pauseGame,
    resumeGame,
    resetGame,
    movePieceLeft,
    movePieceRight,
    movePieceDown,
    rotatePiece,
    hardDrop,
    holdPiece,
    
    // AI Controls Export
    aiControls: {
      ...aiControls,
      isActive: isAIActive,
      executeAIMove
    }
  };
} 