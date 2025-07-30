import { useRef, useCallback, useEffect } from 'react';

export function useBackgroundMusic() {
  const backgroundAudioRef = useRef(null);
  const gameAudioRef = useRef(null);
  const currentMusicRef = useRef(null);

  const initializeAudio = useCallback(() => {
    if (!backgroundAudioRef.current) {
      backgroundAudioRef.current = new Audio('/sounds/background-music.mp3');
      backgroundAudioRef.current.loop = true;
      backgroundAudioRef.current.volume = 0.3;
      backgroundAudioRef.current.preload = 'auto';
    }

    if (!gameAudioRef.current) {
      gameAudioRef.current = new Audio('/sounds/game-music.mp3');
      gameAudioRef.current.loop = true;
      gameAudioRef.current.volume = 0.4;
      gameAudioRef.current.preload = 'auto';
    }
  }, []);

  const startBackgroundMusic = useCallback(async () => {
    try {
      initializeAudio();
      
      if (currentMusicRef.current) {
        currentMusicRef.current.pause();
      }

      // Use a simple upbeat melody with Web Audio API as fallback
      if (!backgroundAudioRef.current || backgroundAudioRef.current.error) {
        console.log('🎵 Using fallback cheerful melody');
        playCheerfulMelody();
        return;
      }

      currentMusicRef.current = backgroundAudioRef.current;
      await backgroundAudioRef.current.play();
    } catch (error) {
      console.log('🎵 Fallback to cheerful melody due to:', error.message);
      playCheerfulMelody();
    }
  }, [initializeAudio]);

  const startGameMusic = useCallback(async () => {
    try {
      initializeAudio();
      
      if (currentMusicRef.current) {
        currentMusicRef.current.pause();
      }

      // Use energetic melody with Web Audio API as fallback
      if (!gameAudioRef.current || gameAudioRef.current.error) {
        console.log('🎮 Using fallback energetic melody');
        playEnergeticMelody();
        return;
      }

      currentMusicRef.current = gameAudioRef.current;
      await gameAudioRef.current.play();
    } catch (error) {
      console.log('🎮 Fallback to energetic melody due to:', error.message);
      playEnergeticMelody();
    }
  }, [initializeAudio]);

  const stopMusic = useCallback(() => {
    if (currentMusicRef.current) {
      currentMusicRef.current.pause();
      currentMusicRef.current.currentTime = 0;
      currentMusicRef.current = null;
    }
    
    // Stop any Web Audio API oscillators
    if (window.currentOscillators) {
      window.currentOscillators.forEach(osc => {
        try { osc.stop(); } catch {}
      });
      window.currentOscillators = [];
    }
  }, []);

  // 🎵 Fallback cheerful melody using Web Audio API
  const playCheerfulMelody = useCallback(() => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillators = [];
    
    // Happy major scale melody - C major pentatonic
    const happyNotes = [
      523.25, // C5
      587.33, // D5
      659.25, // E5
      783.99, // G5
      880.00, // A5
      1046.50, // C6
      880.00, // A5
      783.99, // G5
    ];

    const playNote = (frequency, startTime, duration = 0.8) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.type = 'triangle'; // Softer than sine
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime + startTime);
      gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + startTime + 0.1);
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + startTime + duration - 0.1);
      
      oscillator.start(audioContext.currentTime + startTime);
      oscillator.stop(audioContext.currentTime + startTime + duration);
      
      return oscillator;
    };

    // Play the happy melody
    happyNotes.forEach((note, index) => {
      const oscillator = playNote(note, index * 0.6, 0.8);
      oscillators.push(oscillator);
    });

    // Add harmony
    setTimeout(() => {
      const harmonyNotes = [261.63, 329.63, 392.00]; // C-E-G chord
      harmonyNotes.forEach(note => {
        const osc = playNote(note, 0, 4);
        oscillators.push(osc);
      });
    }, 500);

    // Loop the melody
    setTimeout(() => {
      if (!currentMusicRef.current) {
        playCheerfulMelody();
      }
    }, 6000);

    window.currentOscillators = oscillators;
  }, []);

  // 🎮 Fallback energetic melody for game
  const playEnergeticMelody = useCallback(() => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillators = [];
    
    // Energetic gaming melody
    const gameNotes = [
      659.25, // E5
      659.25, // E5
      783.99, // G5
      1046.50, // C6
      783.99, // G5
      659.25, // E5
      523.25, // C5
      587.33, // D5
    ];

    const playNote = (frequency, startTime, duration = 0.4) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.type = 'square'; // More energetic for gaming
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime + startTime);
      gainNode.gain.linearRampToValueAtTime(0.08, audioContext.currentTime + startTime + 0.05);
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + startTime + duration - 0.05);
      
      oscillator.start(audioContext.currentTime + startTime);
      oscillator.stop(audioContext.currentTime + startTime + duration);
      
      return oscillator;
    };

    // Play energetic melody
    gameNotes.forEach((note, index) => {
      const oscillator = playNote(note, index * 0.3, 0.4);
      oscillators.push(oscillator);
    });

    // Add bass line
    const bassNotes = [130.81, 164.81, 196.00, 146.83]; // C3, E3, G3, D3
    bassNotes.forEach((note, index) => {
      const osc = playNote(note, index * 0.6, 0.6);
      oscillators.push(osc);
    });

    // Loop faster for energy
    setTimeout(() => {
      if (!currentMusicRef.current) {
        playEnergeticMelody();
      }
    }, 3000);

    window.currentOscillators = oscillators;
  }, []);

  useEffect(() => {
    initializeAudio();
    
    return () => {
      stopMusic();
    };
  }, [initializeAudio, stopMusic]);

  return {
    startBackgroundMusic,
    startGameMusic,
    stopMusic
  };
} 