


import { useEffect, useCallback } from 'react';
import { serviceContainer } from '../core/container/ServiceRegistration.js';

export function useKeyboardInput(gameActions, gameState, isActive = true) {
  const setupKeyboardHandlers = useCallback(() => {
    if (!gameActions || !isActive) return () => {};

    try {
      const keyboardService = serviceContainer.resolve('keyboardInputService');

      const handleMoveLeft = () => {
        if (!gameState?.gameOver) gameActions.movePieceLeft();
      };

      const handleMoveRight = () => {
        if (!gameState?.gameOver) gameActions.movePieceRight();
      };

      const handleMoveDown = () => {
        if (!gameState?.gameOver) gameActions.movePieceDown();
      };

      const handleRotate = () => {
        if (!gameState?.gameOver) gameActions.rotatePiece();
      };

      const handleHardDrop = () => {
        if (!gameState?.gameOver) gameActions.hardDrop();
      };

      const handleHold = () => {
        if (!gameState?.gameOver) gameActions.holdPiece();
      };

      const handlePause = () => {
        if (!gameState?.gameOver) {
          if (gameState?.isPaused) {
            gameActions.resume();
          } else {
            gameActions.pause();
          }
        }
      };

      keyboardService.registerHandler('moveLeft', handleMoveLeft);
      keyboardService.registerHandler('moveRight', handleMoveRight);
      keyboardService.registerHandler('moveDown', handleMoveDown);
      keyboardService.registerHandler('rotate', handleRotate);
      keyboardService.registerHandler('hardDrop', handleHardDrop);
      keyboardService.registerHandler('hold', handleHold);
      keyboardService.registerHandler('pause', handlePause);

      keyboardService.startListening();

      return () => {
        keyboardService.unregisterHandler('moveLeft', handleMoveLeft);
        keyboardService.unregisterHandler('moveRight', handleMoveRight);
        keyboardService.unregisterHandler('moveDown', handleMoveDown);
        keyboardService.unregisterHandler('rotate', handleRotate);
        keyboardService.unregisterHandler('hardDrop', handleHardDrop);
        keyboardService.unregisterHandler('hold', handleHold);
        keyboardService.unregisterHandler('pause', handlePause);
        keyboardService.stopListening();
      };
    } catch (error) {
      console.error('Failed to setup keyboard handlers:', error);
      return () => {};
    }
  }, [gameActions, gameState, isActive]);

  useEffect(() => {
    const cleanup = setupKeyboardHandlers();
    return cleanup;
  }, [setupKeyboardHandlers]);

  const customizeKeyMapping = useCallback((key, action) => {
    try {
      const keyboardService = serviceContainer.resolve('keyboardInputService');
      keyboardService.setKeyMapping(key, action);
    } catch (error) {
      console.error('Failed to customize key mapping:', error);
    }
  }, []);

  const getKeyMappings = useCallback(() => {
    try {
      const keyboardService = serviceContainer.resolve('keyboardInputService');
      return keyboardService.getKeyMappings();
    } catch (error) {
      console.error('Failed to get key mappings:', error);
      return {};
    }
  }, []);

  return {
    customizeKeyMapping,
    getKeyMappings
  };
} 