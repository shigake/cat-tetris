import { useRef, useCallback, useEffect } from 'react';

export function useAmbientMusic() {
  const audioContextRef = useRef(null);
  const currentMusicRef = useRef(null);

  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const createOscillator = useCallback((frequency, startTime, duration, type = 'sine', volume = 0.03) => {
    const audioContext = initAudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const filterNode = audioContext.createBiquadFilter();
    
    filterNode.type = 'lowpass';
    filterNode.frequency.setValueAtTime(800, audioContext.currentTime);
    filterNode.Q.setValueAtTime(1, audioContext.currentTime);
    
    oscillator.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime + startTime);
    gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + startTime + 0.1);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + startTime + duration - 0.1);
    
    oscillator.start(audioContext.currentTime + startTime);
    oscillator.stop(audioContext.currentTime + startTime + duration);
    
    return oscillator;
  }, [initAudioContext]);

  const startAmbientMusic = useCallback(() => {
    if (currentMusicRef.current) return;
    
    const baseFreq = 220;
    
    const chordProgression = [
      baseFreq,
      baseFreq * 1.25,
      baseFreq * 1.5,
      baseFreq * 2
    ];
    
    const playChord = (frequencies, startTime, duration = 6) => {
      return frequencies.map(freq => 
        createOscillator(freq, startTime, duration, 'sine', 0.02)
      );
    };
    
    const melodyFreqs = [
      261.63,
      293.66,
      329.63,
      392.00,
      440.00,
      523.25
    ];
    
    const bassFreqs = [
      174.61,
      196.00,
      220.00,
      174.61
    ];

    const oscillators = [];
    
    bassFreqs.forEach((freq, index) => {
      setTimeout(() => {
        const chordOscs = playChord([freq, freq * 1.5, freq * 2], 0, 7);
        oscillators.push(...chordOscs);
      }, chordIndex * 8000);
    });
    
    melodyFreqs.forEach((freq, i) => {
      setTimeout(() => {
        const osc = createOscillator(freq, 0, 2, 'triangle', 0.015);
        oscillators.push(osc);
      }, i * 2500);
    });
    
    const musicLoop = setTimeout(() => {
      startAmbientMusic();
    }, 32000);
    
    setTimeout(() => {
      const fadeChord = playChord([baseFreq, baseFreq * 1.25, baseFreq * 1.5], 0, 4);
      oscillators.push(...fadeChord);
    }, 500);
    
    currentMusicRef.current = { oscillators, musicLoop };
  }, [createOscillator]);

  const stopAmbientMusic = useCallback(() => {
    if (currentMusicRef.current) {
      const { oscillators, musicLoop } = currentMusicRef.current;
      
      oscillators.forEach(osc => {
        try { osc.stop(); } catch {}
      });
      
      clearTimeout(musicLoop);
      currentMusicRef.current = null;
    }
  }, []);

  const playGameMusic = useCallback(() => {
    stopAmbientMusic();
    
    const gameFreqs = [
      220.00,
      246.94,
      261.63,
      293.66
    ];
    
    const oscillators = [];
    
    gameFreqs.forEach((freq, i) => {
      setTimeout(() => {
        const osc = createOscillator(freq, 0, 1.5, 'sawtooth', 0.025);
        oscillators.push(osc);
      }, i * 400);
    });
    
    setTimeout(() => {
      playGameMusic();
    }, 8000);
    
    currentMusicRef.current = { oscillators, musicLoop: null };
  }, [createOscillator, stopAmbientMusic]);

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