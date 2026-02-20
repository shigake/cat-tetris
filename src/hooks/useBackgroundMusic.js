import { useState, useCallback, useRef } from 'react';
import { getAudioContext } from '../utils/sharedAudioContext';

export function useBackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const audioRef = useRef(null);
  const oscillatorsRef = useRef([]);
  const loopTimeoutRef = useRef(null);

  const stopMusic = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    oscillatorsRef.current.forEach(oscillator => {
      try {
        oscillator.stop();
      } catch (e) {}
    });
    oscillatorsRef.current = [];

    if (loopTimeoutRef.current) {
      clearTimeout(loopTimeoutRef.current);
      loopTimeoutRef.current = null;
    }

    setIsPlaying(false);
    setCurrentTrack(null);
  }, []);

  const startBackgroundMusic = useCallback(async () => {
    try {
      stopMusic();

      const audio = new Audio('/cat-tetris/sounds/background-music.mp3');
      audio.loop = true;
      audio.volume = 0.3;
      audioRef.current = audio;

      await audio.play();
      setIsPlaying(true);
      setCurrentTrack('background');
    } catch (error) {
      playCheerfulMelody();
    }
  }, [stopMusic]);

  const startGameMusic = useCallback(async () => {
    try {
      stopMusic();

      const audio = new Audio('/cat-tetris/sounds/game-music.mp3');
      audio.loop = true;
      audio.volume = 0.4;
      audioRef.current = audio;

      await audio.play();
      setIsPlaying(true);
      setCurrentTrack('game');
    } catch (error) {
      playEnergeticMelody();
    }
  }, [stopMusic]);

  const playCheerfulMelody = useCallback(() => {
    stopMusic();

    try {
      const audioContext = getAudioContext();
      if (!audioContext) return;

      const notes = [
        { freq: 523.25, duration: 0.4 },
        { freq: 587.33, duration: 0.4 },
        { freq: 659.25, duration: 0.4 },
        { freq: 698.46, duration: 0.4 },
        { freq: 783.99, duration: 0.6 },
        { freq: 659.25, duration: 0.4 },
        { freq: 523.25, duration: 0.8 },

        { freq: 587.33, duration: 0.4 },
        { freq: 659.25, duration: 0.4 },
        { freq: 698.46, duration: 0.4 },
        { freq: 783.99, duration: 0.6 },
        { freq: 880.00, duration: 0.4 },
        { freq: 783.99, duration: 0.8 },

        { freq: 659.25, duration: 0.4 },
        { freq: 698.46, duration: 0.4 },
        { freq: 783.99, duration: 0.4 },
        { freq: 880.00, duration: 0.6 },
        { freq: 987.77, duration: 0.4 },
        { freq: 1046.5, duration: 0.8 }
      ];

      let startTime = audioContext.currentTime;

      notes.forEach((note, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(note.freq, startTime);
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.1, startTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + note.duration);

        oscillator.start(startTime);
        oscillator.stop(startTime + note.duration);

        oscillatorsRef.current.push(oscillator);

        if (index < notes.length - 1) {
          const harmonyOsc = audioContext.createOscillator();
          const harmonyGain = audioContext.createGain();

          harmonyOsc.connect(harmonyGain);
          harmonyGain.connect(audioContext.destination);

          harmonyOsc.frequency.setValueAtTime(note.freq * 1.25, startTime);
          harmonyOsc.type = 'triangle';

          harmonyGain.gain.setValueAtTime(0, startTime);
          harmonyGain.gain.linearRampToValueAtTime(0.05, startTime + 0.05);
          harmonyGain.gain.exponentialRampToValueAtTime(0.01, startTime + note.duration);

          harmonyOsc.start(startTime);
          harmonyOsc.stop(startTime + note.duration);

          oscillatorsRef.current.push(harmonyOsc);
        }

        startTime += note.duration;
      });

      loopTimeoutRef.current = setTimeout(() => {
        if (!audioRef.current) {
          playCheerfulMelody();
        }
      }, startTime * 1000 + 1000);

      setIsPlaying(true);
      setCurrentTrack('cheerful-fallback');
    } catch (error) {

    }
  }, [stopMusic]);

  const playEnergeticMelody = useCallback(() => {
    stopMusic();

    try {
      const audioContext = getAudioContext();
      if (!audioContext) return;

      const notes = [
        { freq: 261.63, duration: 0.2 },
        { freq: 329.63, duration: 0.2 },
        { freq: 392.00, duration: 0.2 },
        { freq: 523.25, duration: 0.3 },
        { freq: 392.00, duration: 0.1 },
        { freq: 523.25, duration: 0.3 },

        { freq: 293.66, duration: 0.2 },
        { freq: 369.99, duration: 0.2 },
        { freq: 440.00, duration: 0.2 },
        { freq: 587.33, duration: 0.3 },
        { freq: 440.00, duration: 0.1 },
        { freq: 587.33, duration: 0.3 },

        { freq: 329.63, duration: 0.2 },
        { freq: 415.30, duration: 0.2 },
        { freq: 493.88, duration: 0.2 },
        { freq: 659.25, duration: 0.4 },
        { freq: 493.88, duration: 0.2 },
        { freq: 659.25, duration: 0.4 }
      ];

      let startTime = audioContext.currentTime;

      notes.forEach((note, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(note.freq, startTime);
        oscillator.type = 'square';

        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.15, startTime + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + note.duration);

        oscillator.start(startTime);
        oscillator.stop(startTime + note.duration);

        oscillatorsRef.current.push(oscillator);

        if (index % 2 === 0) {
          const bassOsc = audioContext.createOscillator();
          const bassGain = audioContext.createGain();

          bassOsc.connect(bassGain);
          bassGain.connect(audioContext.destination);

          bassOsc.frequency.setValueAtTime(note.freq * 0.5, startTime);
          bassOsc.type = 'sawtooth';

          bassGain.gain.setValueAtTime(0, startTime);
          bassGain.gain.linearRampToValueAtTime(0.08, startTime + 0.02);
          bassGain.gain.exponentialRampToValueAtTime(0.01, startTime + note.duration);

          bassOsc.start(startTime);
          bassOsc.stop(startTime + note.duration);

          oscillatorsRef.current.push(bassOsc);
        }

        startTime += note.duration;
      });

      loopTimeoutRef.current = setTimeout(() => {
        if (!audioRef.current) {
          playEnergeticMelody();
        }
      }, startTime * 1000 + 500);

      setIsPlaying(true);
      setCurrentTrack('energetic-fallback');
    } catch (error) {

    }
  }, [stopMusic]);

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
