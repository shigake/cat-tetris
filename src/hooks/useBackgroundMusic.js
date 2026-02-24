import { useState, useCallback, useRef } from 'react';
import { playSound, stopSound } from '../utils/audioManager';

export function useBackgroundMusic() {
 const [isPlaying, setIsPlaying] = useState(false);
 const [currentTrack, setCurrentTrack] = useState(null);
 const currentAudioRef = useRef(null);

 const stopMusic = useCallback(() => {
  if (currentAudioRef.current) {
   stopSound(currentAudioRef.current);
   currentAudioRef.current = null;
  }
  setIsPlaying(false);
  setCurrentTrack(null);
 }, []);

 const playCheerfulMelody = useCallback(() => {
  stopMusic();
  const audio = playSound('bgm_menu_theme_loop.wav', { volume: 0.35, loop: true });
  currentAudioRef.current = audio;
  if (audio) {
   setIsPlaying(true);
   setCurrentTrack('menu');
  }
 }, [stopMusic]);

 const playEnergeticMelody = useCallback(() => {
  stopMusic();
  const audio = playSound('bgm_game_theme_loop.wav', { volume: 0.35, loop: true });
  currentAudioRef.current = audio;
  if (audio) {
   setIsPlaying(true);
   setCurrentTrack('game');
  }
 }, [stopMusic]);

 const startBackgroundMusic = useCallback(async () => {
  playCheerfulMelody();
 }, [playCheerfulMelody]);

 const startGameMusic = useCallback(async () => {
  playEnergeticMelody();
 }, [playEnergeticMelody]);

 return {
  isPlaying,
  currentTrack,
  startBackgroundMusic,
  startGameMusic,
  stopMusic,
  playCheerfulMelody,
  playEnergeticMelody
 };
}
