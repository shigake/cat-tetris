import { useCallback, useRef } from 'react';

export function useGameSounds() {
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

  const createTone = useCallback((frequency, duration = 100, volume = 0.1, type = 'sine', startTime = 0) => {
    const audioContext = initAudioContext();
    if (!audioContext) return;

    try {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime + startTime);
      oscillator.type = type;

      gainNode.gain.setValueAtTime(0, audioContext.currentTime + startTime);
      gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + startTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + startTime + duration / 1000);

      oscillator.start(audioContext.currentTime + startTime);
      oscillator.stop(audioContext.currentTime + startTime + duration / 1000);
    } catch (error) {
      console.warn('Failed to play sound:', error);
    }
  }, [initAudioContext]);

  const playNoiseSound = useCallback((duration = 100, volume = 0.05) => {
    const audioContext = initAudioContext();
    if (!audioContext) return;

    try {
      const bufferSize = audioContext.sampleRate * (duration / 1000);
      const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
      const output = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const source = audioContext.createBufferSource();
      const gainNode = audioContext.createGain();
      const filterNode = audioContext.createBiquadFilter();

      filterNode.type = 'lowpass';
      filterNode.frequency.setValueAtTime(2000, audioContext.currentTime);

      source.buffer = buffer;
      source.connect(filterNode);
      filterNode.connect(gainNode);
      gainNode.connect(audioContext.destination);

      gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration / 1000);

      source.start();
    } catch (error) {
      console.warn('Failed to play noise sound:', error);
    }
  }, [initAudioContext]);

  // Unique sounds for each piece type
  const playPieceSound = useCallback((pieceType) => {
    switch (pieceType) {
      case 'I': // Long piece - descending arpeggio
        createTone(800, 60, 0.08, 'square', 0);
        createTone(600, 60, 0.08, 'square', 0.04);
        createTone(500, 60, 0.08, 'square', 0.08);
        createTone(400, 80, 0.08, 'square', 0.12);
        break;
      
      case 'O': // Square piece - cute double beep
        createTone(660, 100, 0.1, 'sine', 0);
        createTone(880, 100, 0.08, 'sine', 0.08);
        break;
      
      case 'T': // T piece - triple tone
        createTone(523, 80, 0.09, 'triangle', 0);
        createTone(659, 80, 0.09, 'triangle', 0.06);
        createTone(784, 100, 0.09, 'triangle', 0.12);
        break;
      
      case 'S': // S piece - snake-like slide
        createTone(440, 60, 0.08, 'sawtooth', 0);
        createTone(494, 60, 0.08, 'sawtooth', 0.04);
        createTone(554, 80, 0.08, 'sawtooth', 0.08);
        break;
      
      case 'Z': // Z piece - zigzag sound
        createTone(587, 60, 0.08, 'sawtooth', 0);
        createTone(523, 60, 0.08, 'sawtooth', 0.04);
        createTone(466, 80, 0.08, 'sawtooth', 0.08);
        break;
      
      case 'J': // J piece - jazzy chord
        createTone(349, 120, 0.07, 'triangle', 0);
        createTone(440, 120, 0.06, 'triangle', 0.02);
        createTone(523, 120, 0.05, 'triangle', 0.04);
        break;
      
      case 'L': // L piece - lovely harmony
        createTone(392, 120, 0.07, 'triangle', 0);
        createTone(494, 120, 0.06, 'triangle', 0.02);
        createTone(587, 120, 0.05, 'triangle', 0.04);
        break;
      
      default:
        createTone(440, 100, 0.08, 'sine', 0);
    }
  }, [createTone]);

  const playLineClear = useCallback((linesCleared) => {
    if (linesCleared === 1) {
      // Single line - simple rising tone
      createTone(440, 150, 0.1, 'sine', 0);
      createTone(554, 150, 0.1, 'sine', 0.1);
    } else if (linesCleared === 2) {
      // Double line - double rise
      createTone(440, 100, 0.1, 'sine', 0);
      createTone(554, 100, 0.1, 'sine', 0.08);
      createTone(659, 100, 0.1, 'sine', 0.16);
      createTone(784, 200, 0.1, 'sine', 0.24);
    } else if (linesCleared === 3) {
      // Triple line - triumphant chord
      createTone(523, 200, 0.12, 'triangle', 0);
      createTone(659, 200, 0.1, 'triangle', 0.02);
      createTone(784, 200, 0.08, 'triangle', 0.04);
      createTone(1047, 300, 0.06, 'triangle', 0.15);
    } else if (linesCleared === 4) {
      // Tetris! - Epic celebration
      playNoiseSound(50, 0.02); // Explosion sound
      setTimeout(() => {
        const tetrisNotes = [523, 659, 784, 1047, 1319];
        tetrisNotes.forEach((note, i) => {
          createTone(note, 200, 0.1, 'triangle', i * 0.08);
        });
        // Victory chord
        setTimeout(() => {
          createTone(523, 500, 0.08, 'sine', 0);
          createTone(659, 500, 0.06, 'sine', 0.02);
          createTone(784, 500, 0.05, 'sine', 0.04);
          createTone(1047, 500, 0.04, 'sine', 0.06);
        }, 400);
      }, 100);
    }
  }, [createTone, playNoiseSound]);

  const playLevelUp = useCallback(() => {
    // Level up fanfare
    const fanfareNotes = [
      { freq: 523, delay: 0 },    // C
      { freq: 659, delay: 100 },  // E
      { freq: 784, delay: 200 },  // G
      { freq: 1047, delay: 300 }, // C
      { freq: 784, delay: 400 },  // G
      { freq: 1047, delay: 500 }, // C
      { freq: 1319, delay: 600 }, // E
      { freq: 1568, delay: 700 }  // G
    ];

    fanfareNotes.forEach(({ freq, delay }) => {
      createTone(freq, 200, 0.08, 'triangle', delay / 1000);
    });

    // Final triumphant chord
    setTimeout(() => {
      createTone(523, 800, 0.06, 'sine', 0);
      createTone(659, 800, 0.05, 'sine', 0.02);
      createTone(784, 800, 0.04, 'sine', 0.04);
      createTone(1047, 800, 0.03, 'sine', 0.06);
    }, 800);
  }, [createTone]);

  const playPieceLand = useCallback(() => {
    // Soft landing sound
    createTone(220, 80, 0.06, 'triangle', 0);
    createTone(165, 120, 0.04, 'triangle', 0.06);
  }, [createTone]);

  const playGameOver = useCallback(() => {
    // Sad descending progression
    const sadNotes = [440, 415, 392, 370, 349, 330, 311, 294];
    sadNotes.forEach((freq, i) => {
      createTone(freq, 300, 0.08 - (i * 0.01), 'triangle', i * 0.2);
    });
  }, [createTone]);

  const playPause = useCallback(() => {
    createTone(440, 200, 0.08, 'sine', 0);
    createTone(330, 300, 0.06, 'sine', 0.15);
  }, [createTone]);

  const playResume = useCallback(() => {
    createTone(330, 200, 0.08, 'sine', 0);
    createTone(440, 300, 0.06, 'sine', 0.15);
  }, [createTone]);

  const playHold = useCallback(() => {
    createTone(550, 100, 0.08, 'sine', 0);
    createTone(660, 150, 0.06, 'sine', 0.08);
  }, [createTone]);

  const playRotate = useCallback(() => {
    createTone(880, 50, 0.04, 'square', 0);
  }, [createTone]);

  const playMove = useCallback(() => {
    createTone(660, 30, 0.03, 'triangle', 0);
  }, [createTone]);

  return {
    playPieceSound,
    playLineClear,
    playLevelUp,
    playPieceLand,
    playGameOver,
    playPause,
    playResume,
    playHold,
    playRotate,
    playMove
  };
} 