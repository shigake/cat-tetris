import { useEffect, useRef, useCallback } from 'react';
import { useGame } from '../contexts/GameContext';
import { gameEvents, GAME_EVENTS } from '../patterns/Observer';
import { PieceFactory } from '../patterns/Factory';
import { MovementStrategyFactory } from '../patterns/Factory';
import { createEmptyBoard, checkGameOver, getLevel, getDropTime, clearLines, calculateScore } from '../utils/GameLogic';

export function useGameEngine() {
  const gameState = useGame();
  const gameLoopRef = useRef();
  const lastTimeRef = useRef(0);

  const getNextPiece = useCallback(() => {
    const newPieces = [...gameState.nextPieces];
    const nextPiece = newPieces.shift();
    newPieces.push(PieceFactory.createRandomPiece());
    return { nextPiece, newPieces };
  }, [gameState.nextPieces]);

  const placePieceOnBoard = useCallback((piece) => {
    if (!piece || !gameState.board || !Array.isArray(gameState.board)) return;

    const newBoard = gameState.board.map(row => Array.isArray(row) ? [...row] : Array(10).fill(null));
    piece.shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) {
          const boardX = piece.position.x + x;
          const boardY = piece.position.y + y;
          if (boardX >= 0 && boardX < 10 && boardY >= 0 && boardY < 20) {
            newBoard[boardY][boardX] = {
              type: piece.type,
              color: piece.color,
              emoji: piece.emoji
            };
          }
        }
      });
    });

    const clearResult = clearLines(newBoard);
    if (clearResult.linesCleared > 0) {
      gameState.actions.clearLines(clearResult.board, clearResult.linesCleared);
      gameEvents.emit(GAME_EVENTS.LINE_CLEARED, { linesCleared: clearResult.linesCleared });
      
      const isTSpin = piece.isTSpin || false;
      const points = calculateScore(clearResult.linesCleared, gameState.level, gameState.combo, isTSpin, gameState.backToBack);
      gameState.actions.updateScore(points);
      gameEvents.emit(GAME_EVENTS.SCORE_UPDATED, { points, isTSpin });
      
      if (isTSpin) {
        gameEvents.emit(GAME_EVENTS.T_SPIN, { linesCleared: clearResult.linesCleared });
        
        if (clearResult.linesCleared > 0) {
          gameState.actions.setBackToBack(true);
        }
      } else {
        gameState.actions.setBackToBack(false);
      }
    } else {
      gameState.actions.resetCombo();
    }

    const { nextPiece, newPieces } = getNextPiece();
    gameState.actions.placePiece(clearResult.board, nextPiece, newPieces);
    gameEvents.emit(GAME_EVENTS.PIECE_PLACED, { piece });

    if (checkGameOver(clearResult.board)) {
      gameState.actions.setGameOver();
      gameEvents.emit(GAME_EVENTS.GAME_OVER);
    }
  }, [gameState.board, gameState.level, gameState.combo, gameState.actions, getNextPiece]);

  const movePiece = useCallback((direction) => {
    if (!gameState.currentPiece || gameState.gameOver || gameState.isPaused) return;

    const strategy = MovementStrategyFactory.createStrategy(direction);
    const result = strategy.execute(gameState.currentPiece, gameState.board);

    if (result !== gameState.currentPiece) {
      gameState.actions.movePiece(result);
      
      if (direction === 'down' && strategy.getSoftDropPoints) {
        const softDropPoints = strategy.getSoftDropPoints();
        gameState.actions.updateScore(softDropPoints);
      }
      
      gameEvents.emit(GAME_EVENTS.PIECE_MOVED, { direction, piece: result });
    } else if (direction === 'down') {
      placePieceOnBoard(gameState.currentPiece);
    }
  }, [gameState.currentPiece, gameState.board, gameState.gameOver, gameState.isPaused, gameState.actions, placePieceOnBoard]);

  const rotatePiece = useCallback(() => {
    if (!gameState.currentPiece || gameState.gameOver || gameState.isPaused) return;

    const strategy = MovementStrategyFactory.createStrategy('rotate');
    const result = strategy.execute(gameState.currentPiece, gameState.board);

    if (result !== gameState.currentPiece) {
      gameState.actions.rotatePiece(result);
      gameEvents.emit(GAME_EVENTS.PIECE_ROTATED, { piece: result });
    }
  }, [gameState.currentPiece, gameState.board, gameState.gameOver, gameState.isPaused, gameState.actions]);

  const holdPiece = useCallback(() => {
    if (!gameState.currentPiece || !gameState.canHold || gameState.gameOver || gameState.isPaused) return;

    if (gameState.heldPiece) {
      const newHeldPiece = { ...gameState.currentPiece, position: { x: 3, y: 0 } };
      const newCurrentPiece = { ...gameState.heldPiece, position: { x: 3, y: 0 } };
      gameState.actions.holdPiece(newHeldPiece, newCurrentPiece);
    } else {
      const newHeldPiece = { ...gameState.currentPiece, position: { x: 3, y: 0 } };
      const { nextPiece } = getNextPiece();
      const newCurrentPiece = { ...nextPiece, position: { x: 3, y: 0 } };
      gameState.actions.holdPiece(newHeldPiece, newCurrentPiece);
    }
    
    gameEvents.emit(GAME_EVENTS.PIECE_HELD);
  }, [gameState.currentPiece, gameState.heldPiece, gameState.canHold, gameState.gameOver, gameState.isPaused, gameState.actions, getNextPiece]);

  const hardDrop = useCallback(() => {
    if (!gameState.currentPiece || gameState.gameOver || gameState.isPaused) return;

    const strategy = MovementStrategyFactory.createStrategy('hardDrop');
    const result = strategy.execute(gameState.currentPiece, gameState.board);

    gameState.actions.updateScore(result.dropDistance * 2);
    
    placePieceOnBoard(result.piece);
  }, [gameState.currentPiece, gameState.board, gameState.gameOver, gameState.isPaused, gameState.actions, placePieceOnBoard]);

  const getDropPreview = useCallback(() => {
    if (!gameState.currentPiece || gameState.gameOver || gameState.isPaused) return null;

    const strategy = MovementStrategyFactory.createStrategy('hardDrop');
    const result = strategy.execute(gameState.currentPiece, gameState.board);
    
    return result.piece;
  }, [gameState.currentPiece, gameState.board, gameState.gameOver, gameState.isPaused]);

  useEffect(() => {
    if (!gameState.isPlaying || gameState.gameOver || gameState.isPaused) {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = null;
      }
      return;
    }

    const gameLoop = (currentTime) => {
      if (currentTime - lastTimeRef.current > gameState.dropTime) {
        if (gameState.currentPiece && !gameState.gameOver && !gameState.isPaused) {
          const strategy = MovementStrategyFactory.createStrategy('down');
          const result = strategy.execute(gameState.currentPiece, gameState.board);

          if (result !== gameState.currentPiece) {
            gameState.actions.movePiece(result);
            gameEvents.emit(GAME_EVENTS.PIECE_MOVED, { direction: 'down', piece: result });
          } else {
            const piece = gameState.currentPiece;
            if (!piece || !gameState.board || !Array.isArray(gameState.board)) return;

            const newBoard = gameState.board.map(row => Array.isArray(row) ? [...row] : Array(10).fill(null));
            piece.shape.forEach((row, y) => {
              row.forEach((cell, x) => {
                if (cell) {
                  const boardX = piece.position.x + x;
                  const boardY = piece.position.y + y;
                  if (boardX >= 0 && boardX < 10 && boardY >= 0 && boardY < 20) {
                    newBoard[boardY][boardX] = {
                      type: piece.type,
                      color: piece.color,
                      emoji: piece.emoji
                    };
                  }
                }
              });
            });

            const clearResult = clearLines(newBoard);
            if (clearResult.linesCleared > 0) {
              gameState.actions.clearLines(clearResult.board, clearResult.linesCleared);
              gameEvents.emit(GAME_EVENTS.LINE_CLEARED, { linesCleared: clearResult.linesCleared });
              
              const isTSpin = piece.isTSpin || false;
              const points = calculateScore(clearResult.linesCleared, gameState.level, gameState.combo, isTSpin, gameState.backToBack);
              gameState.actions.updateScore(points);
              gameEvents.emit(GAME_EVENTS.SCORE_UPDATED, { points, isTSpin });
              
              if (isTSpin) {
                gameEvents.emit(GAME_EVENTS.T_SPIN, { linesCleared: clearResult.linesCleared });
                
                if (clearResult.linesCleared > 0) {
                  gameState.actions.setBackToBack(true);
                }
              } else {
                gameState.actions.setBackToBack(false);
              }
            } else {
              gameState.actions.resetCombo();
            }

            const { nextPiece, newPieces } = getNextPiece();
            gameState.actions.placePiece(clearResult.board, nextPiece, newPieces);
            gameEvents.emit(GAME_EVENTS.PIECE_PLACED, { piece });

            if (checkGameOver(clearResult.board)) {
              gameState.actions.setGameOver();
              gameEvents.emit(GAME_EVENTS.GAME_OVER);
            }
          }
        }
        lastTimeRef.current = currentTime;
      }
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    };
  }, [gameState.isPlaying, gameState.gameOver, gameState.isPaused, gameState.dropTime, gameState.currentPiece, gameState.board, gameState.actions, getNextPiece]);

  useEffect(() => {
    const newLevel = getLevel(gameState.lines);
    if (newLevel !== gameState.level) {
      const newDropTime = getDropTime(newLevel);
      gameState.actions.updateLevel(newLevel, newDropTime);
      gameEvents.emit(GAME_EVENTS.LEVEL_UP, { level: newLevel });
    }
  }, [gameState.lines, gameState.level, gameState.actions]);

  const initializeGame = useCallback(() => {
    const board = createEmptyBoard();
    const currentPiece = PieceFactory.createRandomPiece();
    const nextPieces = PieceFactory.createNextPieces(3);
    
    gameState.actions.initializeGame(board, currentPiece, nextPieces);
  }, [gameState.actions]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameState.gameOver) return;

      switch (e.code) {
        case 'ArrowLeft':
          e.preventDefault();
          movePiece('left');
          break;
        case 'ArrowRight':
          e.preventDefault();
          movePiece('right');
          break;
        case 'ArrowDown':
          e.preventDefault();
          movePiece('down');
          break;
        case 'ArrowUp':
          e.preventDefault();
          rotatePiece();
          break;
        case 'Space':
          e.preventDefault();
          hardDrop();
          break;
        case 'KeyP':
          e.preventDefault();
          gameState.actions.setPaused(!gameState.isPaused);
          if (gameState.isPaused) {
            gameEvents.emit(GAME_EVENTS.GAME_RESUMED);
          } else {
            gameEvents.emit(GAME_EVENTS.GAME_PAUSED);
          }
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          e.preventDefault();
          holdPiece();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState.gameOver, gameState.isPaused, movePiece, rotatePiece, hardDrop, holdPiece, gameState.actions]);

  return {
    movePiece,
    rotatePiece,
    holdPiece,
    hardDrop,
    initializeGame,
    placePieceOnBoard,
    getDropPreview
  };
} 