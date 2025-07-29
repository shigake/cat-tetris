import { useCallback, useRef, useEffect } from 'react';

export function useAmbientMusic() {
  const audioContextRef = useRef(null);
  const musicNodeRef = useRef(null);
  const isPlayingRef = useRef(false);

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

  const createOscillator = useCallback((frequency, type = 'sine', volume = 0.1, startTime = 0, duration = 1) => {
    const audioContext = initAudioContext();
    if (!audioContext) return null;

    try {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      const filterNode = audioContext.createBiquadFilter();

      // Setup filter for warmer sound
      filterNode.type = 'lowpass';
      filterNode.frequency.setValueAtTime(800, audioContext.currentTime);
      
      oscillator.connect(filterNode);
      filterNode.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.type = type;

      // Smooth volume envelope
      gainNode.gain.setValueAtTime(0, audioContext.currentTime + startTime);
      gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + startTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + startTime + duration - 0.1);

      oscillator.start(audioContext.currentTime + startTime);
      oscillator.stop(audioContext.currentTime + startTime + duration);

      return { oscillator, gainNode };
    } catch (error) {
      console.warn('Failed to create oscillator:', error);
      return null;
    }
  }, [initAudioContext]);

  const playAmbientChord = useCallback((baseFreq, duration = 4, volume = 0.03) => {
    // Cat-themed peaceful chord progression
    const chordNotes = [
      baseFreq,           // Root
      baseFreq * 1.25,    // Perfect fifth  
      baseFreq * 1.5,     // Octave fifth
      baseFreq * 2        // Octave
    ];

    const waveTypes = ['sine', 'triangle', 'sine', 'triangle'];
    const volumes = [volume, volume * 0.7, volume * 0.5, volume * 0.3];

    chordNotes.forEach((freq, index) => {
      createOscillator(freq, waveTypes[index], volumes[index], 0, duration);
    });
  }, [createOscillator]);

  const playMelodyNote = useCallback((frequency, startTime, duration = 0.8, volume = 0.02) => {
    createOscillator(frequency, 'triangle', volume, startTime, duration);
  }, [createOscillator]);

  const startAmbientMusic = useCallback(() => {
    if (isPlayingRef.current) return;
    
    const audioContext = initAudioContext();
    if (!audioContext) return;

    isPlayingRef.current = true;

    // Cat-themed peaceful melody (pentatonic scale)
    const melodyNotes = [
      261.63, // C4
      293.66, // D4  
      329.63, // E4
      392.00, // G4
      440.00, // A4
      523.25, // C5
    ];

    // Base chord progression (peaceful and dreamy)
    const chordProgression = [
      174.61, // F3
      196.00, // G3
      220.00, // A3
      174.61, // F3 (repeat)
    ];

    const playMusicLoop = () => {
      if (!isPlayingRef.current) return;

      // Play chord progression
      chordProgression.forEach((baseFreq, chordIndex) => {
        setTimeout(() => {
          if (!isPlayingRef.current) return;
          playAmbientChord(baseFreq, 8, 0.025);
        }, chordIndex * 8000); // 8 seconds per chord
      });

      // Play gentle melody over chords
      const melodyPattern = [0, 2, 1, 3, 2, 4, 3, 5, 4, 2, 1, 0];
      melodyPattern.forEach((noteIndex, i) => {
        setTimeout(() => {
          if (!isPlayingRef.current) return;
          playMelodyNote(melodyNotes[noteIndex], 0, 1.5, 0.015);
        }, i * 2500); // Melody note every 2.5 seconds
      });

      // Loop the music
      setTimeout(() => {
        if (isPlayingRef.current) {
          playMusicLoop();
        }
      }, 32000); // 32 seconds total loop
    };

    // Start with a gentle fade-in chord
    setTimeout(() => {
      if (isPlayingRef.current) {
        playAmbientChord(174.61, 4, 0.02);
        playMusicLoop();
      }
    }, 1000);

  }, [initAudioContext, playAmbientChord, playMelodyNote]);

  const stopAmbientMusic = useCallback(() => {
    isPlayingRef.current = false;
  }, []);

  const playGameMusic = useCallback(() => {
    if (isPlayingRef.current) return;
    
    isPlayingRef.current = true;

    // More upbeat game music
    const gameChords = [
      220.00, // A3
      246.94, // B3
      261.63, // C4
      293.66, // D4
    ];

    const playGameLoop = () => {
      if (!isPlayingRef.current) return;

      gameChords.forEach((baseFreq, index) => {
        setTimeout(() => {
          if (!isPlayingRef.current) return;
          playAmbientChord(baseFreq, 6, 0.03);
        }, index * 6000);
      });

      setTimeout(() => {
        if (isPlayingRef.current) {
          playGameLoop();
        }
      }, 24000);
    };

    playGameLoop();
  }, [playAmbientChord]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAmbientMusic();
    };
  }, [stopAmbientMusic]);

  return {
    startAmbientMusic,
    stopAmbientMusic,
    playGameMusic,
    isPlaying: isPlayingRef.current
  };
} 