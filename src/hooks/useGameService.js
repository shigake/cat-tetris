import { useEffect, useRef, useCallback, useState } from 'react';
import { serviceContainer } from '../core/container/ServiceRegistration.js';
import { gameEvents, GAME_EVENTS } from '../patterns/Observer.js';
// import { useAIPlayer } from './useAIPlayer.js';

export function useGameService() {
  const [gameState, setGameState] = useState(null);
  const gameServiceRef = useRef(null);
  const gameLoopRef = useRef(null);
  const lastTimeRef = useRef(0);
  const initializedRef = useRef(false);
  // const aiMoveTimeoutRef = useRef(null);

  // AI Integration - TEMPORARILY DISABLED
  const isAIActive = false;
  const aiControls = {
    isActive: false,
    activateAI: () => {},
    deactivateAI: () => {},
    speed: 1,
    changeSpeed: () => {},
    metrics: {},
    isThinking: false,
    lastMove: null,
    resetAIMetrics: () => {},
    getStrategyInfo: () => null
  };

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    try {
      const gameService = serviceContainer.resolve('gameService');
      gameServiceRef.current = gameService;
      window.gameServiceRef = gameServiceRef; // Debug access
      gameService.initializeGame();
      setGameState(gameService.getGameState());

      const handleGameStateUpdate = () => {
        if (gameServiceRef.current) {
          const newState = gameServiceRef.current.getGameState();
          console.log('🔄 Game state updated:', {
            isPlaying: newState.isPlaying,
            isPaused: newState.isPaused,
            currentPiece: newState.currentPiece?.type,
            position: newState.currentPiece?.position
          });
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
        if (aiMoveTimeoutRef.current) {
          clearTimeout(aiMoveTimeoutRef.current);
        }
      };
    } catch (error) {
      console.error('Failed to initialize game service:', error);
      throw error;
    }
  }, []);

  // Execute AI move in the game - DISABLED
  const executeAIMove = useCallback((aiMove) => {
    if (!gameServiceRef.current || !aiMove) {
      console.log('🤖 AI Move blocked: no gameService or aiMove');
      return;
    }

    try {
      const gameService = gameServiceRef.current;
      console.log('🤖 Executing AI move:', aiMove, 'Game state:', {
        isPlaying: gameService.isPlaying,
        isPaused: gameService.isPaused,
        gameOver: gameService.gameOver,
        currentPiece: !!gameService.currentPiece
      });
      
      // Move piece to target position
      if (aiMove.x !== undefined) {
        const currentX = gameService.currentPiece?.position?.x || 0;
        const deltaX = aiMove.x - currentX;
        
        console.log('🤖 Moving from', currentX, 'to', aiMove.x, 'delta:', deltaX);
        
        // Move horizontally
        for (let i = 0; i < Math.abs(deltaX); i++) {
          if (deltaX > 0) {
            gameService.movePiece('right');
          } else {
            gameService.movePiece('left');
          }
        }
      }

      // Rotate piece
      if (aiMove.rotation) {
        console.log('🤖 Rotating', aiMove.rotation, 'times');
        for (let i = 0; i < aiMove.rotation; i++) {
          gameService.rotatePiece();
        }
      }

      // Hard drop
      console.log('🤖 Hard dropping');
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

  // Schedule AI moves with configurable timing
  const scheduleAIMove = useCallback((currentGameState) => {
    console.log('🤖 Schedule AI Move called:', {
      isAIActive,
      hasGameState: !!currentGameState,
      gameOver: currentGameState?.gameOver,
      isPaused: currentGameState?.isPaused
    });

    if (!isAIActive || !currentGameState || currentGameState.gameOver || currentGameState.isPaused) {
      console.log('🤖 AI Move scheduling blocked');
      return;
    }

    // Clear any existing timeout
    if (aiMoveTimeoutRef.current) {
      clearTimeout(aiMoveTimeoutRef.current);
    }

    const delay = Math.max(100, 1000 / aiControls.speed);
    console.log('🤖 Scheduling AI move in', delay, 'ms');
    
    aiMoveTimeoutRef.current = setTimeout(async () => {
      try {
        console.log('🤖 Making AI move...');
        const aiMove = await makeAIMove(currentGameState);
        
        if (aiMove && gameServiceRef.current && !gameServiceRef.current.gameOver) {
          console.log('🤖 AI move calculated:', aiMove);
          executeAIMove(aiMove);
        } else {
          console.log('🤖 No AI move to execute');
        }
      } catch (error) {
        console.error('AI Move execution error:', error);
      }
    }, delay);
  }, [isAIActive, aiControls.speed, makeAIMove]);

  useEffect(() => {
    if (!gameServiceRef.current) return;

    const gameLoop = (currentTime) => {
      if (!gameServiceRef.current) return;

      const deltaTime = currentTime - lastTimeRef.current;
      if (deltaTime >= 16) {
        // Call the game update for automatic piece dropping
        gameServiceRef.current.updateGame(deltaTime);
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
      console.log('🎮 Starting game - Current state:', {
        isPlaying: gameServiceRef.current.isPlaying,
        isPaused: gameServiceRef.current.isPaused,
        gameOver: gameServiceRef.current.gameOver
      });

      // Always restart to ensure clean state
      gameServiceRef.current.restart();
      
      console.log('🎮 After restart:', {
        isPlaying: gameServiceRef.current.isPlaying,
        isPaused: gameServiceRef.current.isPaused,
        gameOver: gameServiceRef.current.gameOver
      });
      
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
      gameServiceRef.current.pause();
      
      // Clear AI timeout when pausing
      if (aiMoveTimeoutRef.current) {
        clearTimeout(aiMoveTimeoutRef.current);
      }
    }
  }, []);

  const resumeGame = useCallback(() => {
    if (gameServiceRef.current) {
      gameServiceRef.current.resume();
      
      // Resume AI if active
      if (isAIActive) {
        const currentState = gameServiceRef.current.getGameState();
        scheduleAIMove(currentState);
      }
    }
  }, [isAIActive, scheduleAIMove]);

  const resetGame = useCallback(() => {
    if (gameServiceRef.current) {
      gameServiceRef.current.restart();
      
      // Clear AI timeout
      if (aiMoveTimeoutRef.current) {
        clearTimeout(aiMoveTimeoutRef.current);
      }
    }
  }, []);

  const movePieceLeft = useCallback(() => {
    if (gameServiceRef.current && !isAIActive) {
      gameServiceRef.current.movePiece('left');
    }
  }, [isAIActive]);

  const movePieceRight = useCallback(() => {
    if (gameServiceRef.current && !isAIActive) {
      gameServiceRef.current.movePiece('right');
    }
  }, [isAIActive]);

  const movePieceDown = useCallback(() => {
    if (gameServiceRef.current && !isAIActive) {
      gameServiceRef.current.movePiece('down');
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

  const getDropPreview = useCallback(() => {
    if (gameServiceRef.current) {
      return gameServiceRef.current.getDropPreview();
    }
    return null;
  }, []);

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
    getDropPreview,
    
    // AI Controls Export
    aiControls: {
      ...aiControls,
      isActive: isAIActive,
      executeAIMove
    }
  };
} 