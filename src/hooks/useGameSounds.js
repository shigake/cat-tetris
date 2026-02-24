import { useCallback } from 'react';
import { playSoundThrottled, playSound } from '../utils/audioManager';

export function useGameSounds() {

 const playPieceSound = useCallback(() => {
  playSoundThrottled('sfx_piece_land.wav', 80, { volume: 0.4 });
 }, []);

 const playLineClear = useCallback((linesCleared) => {
  if (linesCleared >= 4) {
   playSoundThrottled('sfx_tetris_4_lines.wav', 200, { volume: 0.6 });
  } else if (linesCleared === 3) {
   playSoundThrottled('sfx_line_clear_3.wav', 200, { volume: 0.55 });
  } else if (linesCleared === 2) {
   playSoundThrottled('sfx_line_clear_2.wav', 200, { volume: 0.5 });
  } else {
   playSoundThrottled('sfx_line_clear_1.wav', 200, { volume: 0.45 });
  }
 }, []);

 const playLevelUp = useCallback(() => {
  playSoundThrottled('sfx_level_up.wav', 1000, { volume: 0.6 });
 }, []);

 const playPieceLand = useCallback(() => {
  playSoundThrottled('sfx_piece_land.wav', 80, { volume: 0.3 });
 }, []);

 const playHardDrop = useCallback(() => {
  playSoundThrottled('sfx_hard_drop.wav', 100, { volume: 0.5 });
 }, []);

 const playTSpin = useCallback(() => {
  playSoundThrottled('sfx_t_spin.wav', 300, { volume: 0.6 });
 }, []);

 const playBackToBack = useCallback(() => {
  playSoundThrottled('sfx_back_to_back.wav', 300, { volume: 0.5 });
 }, []);

 const playCombo = useCallback(() => {
  playSoundThrottled('sfx_combo.wav', 150, { volume: 0.5 });
 }, []);

 const playGameOver = useCallback(() => {
  playSoundThrottled('sfx_game_over.wav', 1000, { volume: 0.6 });
 }, []);

 const playPause = useCallback(() => {
  playSound('sfx_pause.wav', { volume: 0.4 });
 }, []);

 const playResume = useCallback(() => {
  playSound('sfx_resume.wav', { volume: 0.4 });
 }, []);

 const playHold = useCallback(() => {
  playSoundThrottled('sfx_hold_piece.wav', 150, { volume: 0.4 });
 }, []);

 const playRotate = useCallback(() => {
  playSoundThrottled('sfx_piece_rotate.wav', 60, { volume: 0.3 });
 }, []);

 const playMove = useCallback(() => {
  playSoundThrottled('sfx_piece_move.wav', 50, { volume: 0.2 });
 }, []);

 return {
  playPieceSound,
  playLineClear,
  playLevelUp,
  playPieceLand,
  playHardDrop,
  playTSpin,
  playBackToBack,
  playCombo,
  playGameOver,
  playPause,
  playResume,
  playHold,
  playRotate,
  playMove
 };
}
