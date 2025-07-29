import { useCallback } from 'react';

export function useMenuSounds() {
  const createOscillator = useCallback((frequency, duration, type = 'sine') => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  }, []);

  const playMenuHover = useCallback(() => {
    createOscillator(523, 0.1);
  }, [createOscillator]);

  const playMenuSelect = useCallback(() => {
    createOscillator(659, 0.2);
    setTimeout(() => createOscillator(784, 0.15), 50);
  }, [createOscillator]);

  const playMenuBack = useCallback(() => {
    createOscillator(440, 0.15);
    setTimeout(() => createOscillator(330, 0.1), 80);
  }, [createOscillator]);

  const playMenuOpen = useCallback(() => {
    createOscillator(392, 0.1);
    setTimeout(() => createOscillator(494, 0.1), 100);
    setTimeout(() => createOscillator(588, 0.15), 200);
  }, [createOscillator]);

  const playGameStart = useCallback(() => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    const playChord = (frequencies, startTime, duration = 0.3) => {
      frequencies.forEach(freq => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
        oscillator.type = 'triangle';
        
        gainNode.gain.setValueAtTime(0.05, audioContext.currentTime + startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + startTime + duration);
        
        oscillator.start(audioContext.currentTime + startTime);
        oscillator.stop(audioContext.currentTime + startTime + duration);
      });
    };

    const notes = [523, 659, 784, 1047];
    playChord(notes, 0, 0.5);
  }, []);

  const playPWAInstall = useCallback(() => {
    createOscillator(698, 0.15);
    setTimeout(() => createOscillator(880, 0.15), 100);
    setTimeout(() => createOscillator(1047, 0.2), 200);
  }, [createOscillator]);

  return {
    playMenuHover,
    playMenuSelect,
    playMenuBack,
    playMenuOpen,
    playGameStart,
    playPWAInstall
  };
} 