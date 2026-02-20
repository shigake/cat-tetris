import { useEffect, useRef } from 'react';
import { gameEvents, GAME_EVENTS } from '../patterns/Observer';
import { useGameSounds } from './useGameSounds';

export function useSoundManager() {
  const sounds = useGameSounds();
  const soundsRef = useRef(sounds);
  soundsRef.current = sounds;

  useEffect(() => {
    const s = () => soundsRef.current;

    const handlePiecePlaced = (data) => {
      s().playPieceLand();
      if (data?.piece?.type) s().playPieceSound(data.piece.type);
    };
    const handleLineClear = (data) => {
      if (data?.linesCleared > 0) s().playLineClear(data.linesCleared);
    };
    const handleHardDrop = () => s().playHardDrop();
    const handleTSpin = () => s().playTSpin();
    const handleB2B = () => s().playBackToBack();
    const handleCombo = (data) => { if (data?.combo >= 2) s().playCombo(data.combo); };
    const handleHold = () => s().playHold();
    const handleRotate = () => s().playRotate();
    const handleMove = () => s().playMove();
    const handleGameOver = () => s().playGameOver();
    const handleLevelUp = () => s().playLevelUp();

    gameEvents.on(GAME_EVENTS.PIECE_PLACED, handlePiecePlaced);
    gameEvents.on(GAME_EVENTS.LINE_CLEARED, handleLineClear);
    gameEvents.on(GAME_EVENTS.HARD_DROP, handleHardDrop);
    gameEvents.on(GAME_EVENTS.T_SPIN, handleTSpin);
    gameEvents.on(GAME_EVENTS.BACK_TO_BACK, handleB2B);
    gameEvents.on(GAME_EVENTS.SCORE_UPDATED, handleCombo);
    gameEvents.on(GAME_EVENTS.PIECE_HELD, handleHold);
    gameEvents.on(GAME_EVENTS.PIECE_ROTATED, handleRotate);
    gameEvents.on(GAME_EVENTS.PIECE_MOVED, handleMove);
    gameEvents.on(GAME_EVENTS.GAME_OVER, handleGameOver);
    gameEvents.on(GAME_EVENTS.LEVEL_UP, handleLevelUp);

    return () => {
      gameEvents.off(GAME_EVENTS.PIECE_PLACED, handlePiecePlaced);
      gameEvents.off(GAME_EVENTS.LINE_CLEARED, handleLineClear);
      gameEvents.off(GAME_EVENTS.HARD_DROP, handleHardDrop);
      gameEvents.off(GAME_EVENTS.T_SPIN, handleTSpin);
      gameEvents.off(GAME_EVENTS.BACK_TO_BACK, handleB2B);
      gameEvents.off(GAME_EVENTS.SCORE_UPDATED, handleCombo);
      gameEvents.off(GAME_EVENTS.PIECE_HELD, handleHold);
      gameEvents.off(GAME_EVENTS.PIECE_ROTATED, handleRotate);
      gameEvents.off(GAME_EVENTS.PIECE_MOVED, handleMove);
      gameEvents.off(GAME_EVENTS.GAME_OVER, handleGameOver);
      gameEvents.off(GAME_EVENTS.LEVEL_UP, handleLevelUp);
    };
  }, []);
}
