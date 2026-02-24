import { useRef, useCallback, useEffect } from 'react';
import { playSound, stopSound } from '../utils/audioManager';

export function useAmbientMusic() {
 const currentAudioRef = useRef(null);

 const startAmbientMusic = useCallback(() => {
  if (currentAudioRef.current) return;
  const audio = playSound('bgm_menu_theme_loop.wav', { volume: 0.2, loop: true });
  currentAudioRef.current = audio;
 }, []);

 const stopAmbientMusic = useCallback(() => {
  if (currentAudioRef.current) {
   stopSound(currentAudioRef.current);
   currentAudioRef.current = null;
  }
 }, []);

 const playGameMusic = useCallback(() => {
  stopAmbientMusic();
  const audio = playSound('bgm_game_theme_loop.wav', { volume: 0.25, loop: true });
  currentAudioRef.current = audio;
 }, [stopAmbientMusic]);

 useEffect(() => {
  return () => {
   stopAmbientMusic();
  };
 }, [stopAmbientMusic]);

 return {
  startAmbientMusic,
  stopAmbientMusic,
  playGameMusic
 };
}
