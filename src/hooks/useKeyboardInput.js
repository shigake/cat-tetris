import { useEffect, useCallback, useRef } from 'react';
import { serviceContainer } from '../core/container/ServiceRegistration.js';

export function useKeyboardInput(gameActions, gameState, isActive = true) {
  const gameStateRef = useRef(gameState);
  gameStateRef.current = gameState;

  const gameActionsRef = useRef(gameActions);
  gameActionsRef.current = gameActions;

  useEffect(() => {
    if (!gameActions || !isActive) return;

    try {
      const keyboardService = serviceContainer.resolve('keyboardInputService');

      const notOver = () => !gameStateRef.current?.gameOver;

      const handleMoveLeft  = () => { if (notOver()) gameActionsRef.current.movePiece('left'); };
      const handleMoveRight = () => { if (notOver()) gameActionsRef.current.movePiece('right'); };
      const handleMoveDown  = () => { if (notOver()) gameActionsRef.current.movePiece('down'); };
      const handleRotate    = () => { if (notOver()) gameActionsRef.current.rotatePiece(); };
      const handleRotateLeft = () => { if (notOver()) gameActionsRef.current.rotatePieceLeft?.(); };
      const handleHardDrop  = () => { if (notOver()) gameActionsRef.current.hardDrop(); };
      const handleHold      = () => { if (notOver()) gameActionsRef.current.holdPiece(); };
      const handlePause     = () => {
        if (!gameStateRef.current?.gameOver) {
          if (gameStateRef.current?.isPaused) gameActionsRef.current.resume();
          else gameActionsRef.current.pause();
        }
      };

      keyboardService.registerHandler('moveLeft', handleMoveLeft);
      keyboardService.registerHandler('moveRight', handleMoveRight);
      keyboardService.registerHandler('moveDown', handleMoveDown);
      keyboardService.registerHandler('rotate', handleRotate);
      keyboardService.registerHandler('rotateLeft', handleRotateLeft);
      keyboardService.registerHandler('hardDrop', handleHardDrop);
      keyboardService.registerHandler('hold', handleHold);
      keyboardService.registerHandler('pause', handlePause);

      keyboardService.startListening();

      return () => {
        keyboardService.unregisterHandler('moveLeft', handleMoveLeft);
        keyboardService.unregisterHandler('moveRight', handleMoveRight);
        keyboardService.unregisterHandler('moveDown', handleMoveDown);
        keyboardService.unregisterHandler('rotate', handleRotate);
        keyboardService.unregisterHandler('rotateLeft', handleRotateLeft);
        keyboardService.unregisterHandler('hardDrop', handleHardDrop);
        keyboardService.unregisterHandler('hold', handleHold);
        keyboardService.unregisterHandler('pause', handlePause);
        keyboardService.stopListening();
      };
    } catch (error) {

      return () => {};
    }
  }, [isActive]);

  const customizeKeyMapping = useCallback((key, action) => {
    try {
      const keyboardService = serviceContainer.resolve('keyboardInputService');
      keyboardService.setKeyMapping(key, action);
    } catch (error) {

    }
  }, []);

  const getKeyMappings = useCallback(() => {
    try {
      const keyboardService = serviceContainer.resolve('keyboardInputService');
      return keyboardService.getKeyMappings();
    } catch (error) {

      return {};
    }
  }, []);

  const setDAS = useCallback((ms) => {
    try {
      const keyboardService = serviceContainer.resolve('keyboardInputService');
      keyboardService.setDAS(ms);
    } catch (e) {  }
  }, []);

  const setARR = useCallback((ms) => {
    try {
      const keyboardService = serviceContainer.resolve('keyboardInputService');
      keyboardService.setARR(ms);
    } catch (e) {  }
  }, []);

  const getDAS = useCallback(() => {
    try { return serviceContainer.resolve('keyboardInputService').getDAS(); }
    catch (e) { return 133; }
  }, []);

  const getARR = useCallback(() => {
    try { return serviceContainer.resolve('keyboardInputService').getARR(); }
    catch (e) { return 10; }
  }, []);

  return {
    customizeKeyMapping,
    getKeyMappings,
    setDAS,
    setARR,
    getDAS,
    getARR
  };
}
