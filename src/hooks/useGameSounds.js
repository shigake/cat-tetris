import { useCallback } from 'react';
import { getAudioContext } from '../utils/sharedAudioContext';

export function useGameSounds() {
  const createOscillator = useCallback((frequency, duration, type = 'sine', volume = 0.1) => {
    const audioContext = getAudioContext();
    if (!audioContext) return;
    try {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.type = type;

      gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch {  }
  }, []);

  const playNoiseSound = useCallback((duration, volume = 0.05) => {
    const audioContext = getAudioContext();
    if (!audioContext) return;
    try {
      const bufferSize = audioContext.sampleRate * duration;
      const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * volume;
      }

      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      source.start();
    } catch {  }
  }, []);

  const playPieceSound = useCallback((pieceType) => {
    switch (pieceType) {
      case 'I':
        [800, 700, 600, 500].forEach((freq, i) => {
          setTimeout(() => createOscillator(freq, 0.1, 'square', 0.08), i * 50);
        });
        break;
      case 'O':
        createOscillator(600, 0.1, 'sine', 0.1);
        setTimeout(() => createOscillator(600, 0.1, 'sine', 0.1), 80);
        break;
      case 'T':
        createOscillator(523, 0.08, 'triangle', 0.08);
        setTimeout(() => createOscillator(659, 0.08, 'triangle', 0.08), 40);
        setTimeout(() => createOscillator(523, 0.08, 'triangle', 0.08), 80);
        break;
      case 'S':
        [440, 494, 523, 587].forEach((freq, i) => {
          setTimeout(() => createOscillator(freq, 0.06, 'sawtooth', 0.06), i * 30);
        });
        break;
      case 'Z':
        [587, 523, 494, 440].forEach((freq, i) => {
          setTimeout(() => createOscillator(freq, 0.06, 'sawtooth', 0.06), i * 30);
        });
        break;
      case 'J':
        [330, 415, 523].forEach((freq, i) => {
          setTimeout(() => createOscillator(freq, 0.15, 'triangle', 0.07), i * 20);
        });
        break;
      case 'L':
        [392, 494, 659].forEach((freq, i) => {
          setTimeout(() => createOscillator(freq, 0.15, 'sine', 0.08), i * 30);
        });
        break;
      default:
        createOscillator(440, 0.1, 'sine', 0.05);
    }
  }, [createOscillator]);

  const playLineClear = useCallback((linesCleared) => {
    switch (linesCleared) {
      case 1:
        [440, 494, 523].forEach((freq, i) => {
          setTimeout(() => createOscillator(freq, 0.1, 'triangle', 0.1), i * 80);
        });
        break;
      case 2:
        [440, 523, 659, 784].forEach((freq, i) => {
          setTimeout(() => createOscillator(freq, 0.12, 'triangle', 0.1), i * 60);
        });
        break;
      case 3:
        [523, 659, 784, 1047, 1319].forEach((freq, i) => {
          setTimeout(() => createOscillator(freq, 0.15, 'triangle', 0.12), i * 50);
        });
        break;
      case 4:
        playNoiseSound(0.02);
        setTimeout(() => {
          [262, 330, 392, 523, 659, 784, 1047].forEach((freq, i) => {
            setTimeout(() => createOscillator(freq, 0.2, 'sawtooth', 0.15), i * 40);
          });
        }, 50);
        setTimeout(() => {
          [1047, 1319, 1568, 2093].forEach((freq, i) => {
            setTimeout(() => createOscillator(freq, 0.3, 'triangle', 0.2), i * 30);
          });
        }, 350);
        break;
    }
  }, [createOscillator, playNoiseSound]);

  const playLevelUp = useCallback(() => {
    const notes = [
      { freq: 523, delay: 0 },
      { freq: 659, delay: 100 },
      { freq: 784, delay: 200 },
      { freq: 1047, delay: 300 },
      { freq: 784, delay: 400 },
      { freq: 1047, delay: 500 },
      { freq: 1319, delay: 600 },
      { freq: 1568, delay: 700 }
    ];

    notes.forEach(note => {
      setTimeout(() => createOscillator(note.freq, 0.15, 'triangle', 0.12), note.delay);
    });

    setTimeout(() => {
      [1047, 1319, 1568, 2093].forEach((freq, i) => {
        setTimeout(() => createOscillator(freq, 0.4, 'triangle', 0.15), i * 50);
      });
    }, 800);
  }, [createOscillator]);

  const playPieceLand = useCallback(() => {
    createOscillator(200, 0.05, 'square', 0.03);
    createOscillator(120, 0.06, 'sine', 0.04);
  }, [createOscillator]);

  const playHardDrop = useCallback(() => {

    playNoiseSound(0.04, 0.08);
    createOscillator(80, 0.08, 'square', 0.12);
    createOscillator(60, 0.1, 'sine', 0.1);
  }, [createOscillator, playNoiseSound]);

  const playTSpin = useCallback(() => {

    playNoiseSound(0.03, 0.04);
    [349, 440, 523, 659, 784].forEach((freq, i) => {
      setTimeout(() => createOscillator(freq, 0.2, 'sawtooth', 0.1), i * 40);
    });
    setTimeout(() => {
      createOscillator(1047, 0.4, 'triangle', 0.15);
    }, 250);
  }, [createOscillator, playNoiseSound]);

  const playBackToBack = useCallback(() => {

    [660, 880, 1100, 1320, 1760].forEach((freq, i) => {
      setTimeout(() => createOscillator(freq, 0.12, 'triangle', 0.08), i * 50);
    });
  }, [createOscillator]);

  const playCombo = useCallback((comboCount) => {

    const baseFreq = 400 + (comboCount * 80);
    createOscillator(baseFreq, 0.1, 'triangle', 0.08);
    setTimeout(() => createOscillator(baseFreq * 1.25, 0.08, 'triangle', 0.06), 50);
  }, [createOscillator]);

  const playGameOver = useCallback(() => {
    const notes = [523, 494, 440, 392, 349, 330, 294, 262];
    notes.forEach((freq, i) => {
      setTimeout(() => createOscillator(freq, 0.3, 'sine', 0.1), i * 150);
    });
  }, [createOscillator]);

  const playPause = useCallback(() => {
    createOscillator(440, 0.2, 'triangle', 0.08);
  }, [createOscillator]);

  const playResume = useCallback(() => {
    createOscillator(523, 0.15, 'triangle', 0.08);
    setTimeout(() => createOscillator(659, 0.1, 'triangle', 0.06), 100);
  }, [createOscillator]);

  const playHold = useCallback(() => {
    createOscillator(880, 0.1, 'sine', 0.06);
    setTimeout(() => createOscillator(1100, 0.08, 'sine', 0.05), 60);
  }, [createOscillator]);

  const playRotate = useCallback(() => {
    createOscillator(1200, 0.05, 'square', 0.04);
  }, [createOscillator]);

  const playMove = useCallback(() => {
    createOscillator(800, 0.03, 'square', 0.02);
  }, [createOscillator]);

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
