import { useCallback, useRef } from 'react';

export function useMenuSounds() {
  const audioContextRef = useRef(null);

  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      } catch (error) {
        console.warn('Web Audio API not supported:', error);
      }
    }
    return audioContextRef.current;
  }, []);

  const playTone = useCallback((frequency, duration = 100, volume = 0.1) => {
    const audioContext = initAudioContext();
    if (!audioContext) return;

    try {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration / 1000);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration / 1000);
    } catch (error) {
      console.warn('Failed to play sound:', error);
    }
  }, [initAudioContext]);

  const playMenuHover = useCallback(() => {
    playTone(800, 50, 0.05);
  }, [playTone]);

  const playMenuSelect = useCallback(() => {
    playTone(1200, 100, 0.08);
    setTimeout(() => playTone(1600, 80, 0.06), 50);
  }, [playTone]);

  const playMenuBack = useCallback(() => {
    playTone(600, 150, 0.08);
  }, [playTone]);

  const playMenuOpen = useCallback(() => {
    playTone(800, 100, 0.06);
    setTimeout(() => playTone(1000, 100, 0.06), 80);
    setTimeout(() => playTone(1200, 100, 0.06), 160);
  }, [playTone]);

  const playGameStart = useCallback(() => {
    playTone(440, 150, 0.1);
    setTimeout(() => playTone(554, 150, 0.1), 100);
    setTimeout(() => playTone(659, 200, 0.1), 200);
  }, [playTone]);

  const playPWAInstall = useCallback(() => {
    const notes = [523, 659, 784, 1047]; // C, E, G, C (major chord)
    notes.forEach((note, index) => {
      setTimeout(() => playTone(note, 200, 0.08), index * 100);
    });
  }, [playTone]);

  return {
    playMenuHover,
    playMenuSelect,
    playMenuBack,
    playMenuOpen,
    playGameStart,
    playPWAInstall
  };
} 