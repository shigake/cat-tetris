import { useEffect, useCallback } from 'react';
import { serviceContainer } from '../core/container/ServiceRegistration.js';

export function useKeyboardInput(gameActions, gameState, isActive = true) {
  const setupKeyboardHandlers = useCallback(() => {
    console.log('useKeyboardInput setup:', { gameActions, gameState, isActive });
    if (!gameActions || !isActive) {
      console.log('useKeyboardInput: skipping setup - no actions or not active');
      return () => {};
    }

    try {
      const keyboardService = serviceContainer.resolve('keyboardInputService');
      console.log('useKeyboardInput: keyboardService resolved');

      const handleMoveLeft = () => {
        console.log('handleMoveLeft called');
        if (!gameState?.gameOver) {
          console.log('calling gameActions.movePiece(left)');
          gameActions.movePiece('left');
        }
      };

      const handleMoveRight = () => {
        console.log('handleMoveRight called');
        if (!gameState?.gameOver) {
          console.log('calling gameActions.movePiece(right)');
          gameActions.movePiece('right');
        }
      };

      const handleMoveDown = () => {
        console.log('handleMoveDown called');
        if (!gameState?.gameOver) {
          console.log('calling gameActions.movePiece(down)');
          gameActions.movePiece('down');
        }
      };

      const handleRotate = () => {
        console.log('handleRotate called');
        if (!gameState?.gameOver) {
          console.log('calling gameActions.rotatePiece()');
          gameActions.rotatePiece();
        }
      };

      const handleHardDrop = () => {
        console.log('handleHardDrop called');
        if (!gameState?.gameOver) {
          console.log('calling gameActions.hardDrop()');
          gameActions.hardDrop();
        }
      };

      const handleHold = () => {
        console.log('handleHold called');
        if (!gameState?.gameOver) {
          console.log('calling gameActions.holdPiece()');
          gameActions.holdPiece();
        }
      };

      const handlePause = () => {
        console.log('handlePause called');
        if (!gameState?.gameOver) {
          if (gameState?.isPaused) {
            console.log('calling gameActions.resume()');
            gameActions.resume();
          } else {
            console.log('calling gameActions.pause()');
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