import { useCallback, useRef } from 'react';
import { getAudioContext, canPlaySound, trackOscillatorStart, trackOscillatorEnd } from '../utils/sharedAudioContext';

export function useGameSounds() {
 // Throttle timestamps to prevent rapid-fire sounds
 const lastPlayedRef = useRef({});

 const throttle = useCallback((key, minInterval) => {
 const now = Date.now();
 const last = lastPlayedRef.current[key] || 0;
 if (now - last < minInterval) return false;
 lastPlayedRef.current[key] = now;
 return true;
 }, []);

 const createOscillator = useCallback((frequency, duration, type = 'sine', volume = 0.1) => {
 if (!canPlaySound()) return;
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

 trackOscillatorStart();
 oscillator.onended = () => trackOscillatorEnd();

 oscillator.start(audioContext.currentTime);
 oscillator.stop(audioContext.currentTime + duration);
 } catch { }
 }, []);

 const playPieceSound = useCallback((pieceType) => {
 if (!throttle('pieceSound', 80)) return;
 // Simplified: one short tone per piece type instead of cascading oscillators
 const freqMap = { I: 500, O: 600, T: 523, S: 494, Z: 550, J: 415, L: 494 };
 const freq = freqMap[pieceType] || 440;
 createOscillator(freq, 0.1, 'triangle', 0.06);
 }, [createOscillator, throttle]);

 const playLineClear = useCallback((linesCleared) => {
 if (!throttle('lineClear', 200)) return;
 // Simplified line clear sounds - max 3 oscillators
 const baseFreq = 440 + (linesCleared * 100);
 createOscillator(baseFreq, 0.15, 'triangle', 0.08);
 if (linesCleared >= 2) {
 setTimeout(() => createOscillator(baseFreq * 1.25, 0.12, 'triangle', 0.07), 80);
 }
 if (linesCleared >= 4) {
 setTimeout(() => createOscillator(baseFreq * 1.5, 0.15, 'triangle', 0.09), 160);
 }
 }, [createOscillator, throttle]);

 const playLevelUp = useCallback(() => {
 if (!throttle('levelUp', 1000)) return;
 // Simplified: 3-note ascending fanfare
 createOscillator(523, 0.15, 'triangle', 0.1);
 setTimeout(() => createOscillator(784, 0.15, 'triangle', 0.1), 150);
 setTimeout(() => createOscillator(1047, 0.25, 'triangle', 0.12), 300);
 }, [createOscillator, throttle]);

 const playPieceLand = useCallback(() => {
 if (!throttle('pieceLand', 80)) return;
 createOscillator(150, 0.05, 'sine', 0.03);
 }, [createOscillator, throttle]);

 const playHardDrop = useCallback(() => {
 if (!throttle('hardDrop', 100)) return;
 createOscillator(80, 0.08, 'square', 0.08);
 }, [createOscillator, throttle]);

 const playTSpin = useCallback(() => {
 if (!throttle('tSpin', 300)) return;
 createOscillator(523, 0.15, 'triangle', 0.08);
 setTimeout(() => createOscillator(784, 0.2, 'triangle', 0.1), 100);
 }, [createOscillator, throttle]);

 const playBackToBack = useCallback(() => {
 if (!throttle('b2b', 300)) return;
 createOscillator(880, 0.12, 'triangle', 0.07);
 setTimeout(() => createOscillator(1320, 0.1, 'triangle', 0.06), 80);
 }, [createOscillator, throttle]);

 const playCombo = useCallback((comboCount) => {
 if (!throttle('combo', 150)) return;
 const baseFreq = 400 + (comboCount * 60);
 createOscillator(baseFreq, 0.1, 'triangle', 0.06);
 }, [createOscillator, throttle]);

 const playGameOver = useCallback(() => {
 if (!throttle('gameOver', 1000)) return;
 // Simple descending 3-note game over
 createOscillator(440, 0.3, 'sine', 0.08);
 setTimeout(() => createOscillator(349, 0.3, 'sine', 0.07), 200);
 setTimeout(() => createOscillator(262, 0.5, 'sine', 0.06), 400);
 }, [createOscillator, throttle]);

 const playPause = useCallback(() => {
 createOscillator(440, 0.2, 'triangle', 0.08);
 }, [createOscillator]);

 const playResume = useCallback(() => {
 createOscillator(523, 0.15, 'triangle', 0.08);
 setTimeout(() => createOscillator(659, 0.1, 'triangle', 0.06), 100);
 }, [createOscillator]);

 const playHold = useCallback(() => {
 if (!throttle('hold', 150)) return;
 createOscillator(880, 0.08, 'sine', 0.05);
 }, [createOscillator, throttle]);

 const playRotate = useCallback(() => {
 if (!throttle('rotate', 60)) return;
 createOscillator(1200, 0.04, 'square', 0.03);
 }, [createOscillator, throttle]);

 const playMove = useCallback(() => {
 if (!throttle('move', 50)) return;
 createOscillator(800, 0.03, 'square', 0.015);
 }, [createOscillator, throttle]);

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
