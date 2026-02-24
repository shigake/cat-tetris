import { useRef, useCallback, useEffect } from 'react';
import { getAudioContext, canPlaySound, trackOscillatorStart, trackOscillatorEnd } from '../utils/sharedAudioContext';

export function useAmbientMusic() {
 const currentMusicRef = useRef(null);
 const gameMusicTimeoutRef = useRef(null);

 const createOscillator = useCallback((frequency, startTime, duration, type = 'sine', volume = 0.03) => {
 if (!canPlaySound()) return null;
 const audioContext = getAudioContext();
 if (!audioContext) return null;

 try {
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

 trackOscillatorStart();
 oscillator.onended = () => trackOscillatorEnd();

 oscillator.start(audioContext.currentTime + startTime);
 oscillator.stop(audioContext.currentTime + startTime + duration);

 return oscillator;
 } catch {
 return null;
 }
 }, []);

 const startAmbientMusic = useCallback(() => {
 if (currentMusicRef.current) return;

 const oscillators = [];

 // Simple ambient pad: just 2-3 gentle oscillators
 const osc1 = createOscillator(220, 0, 6, 'sine', 0.015);
 const osc2 = createOscillator(330, 0.5, 5, 'sine', 0.012);
 const osc3 = createOscillator(440, 1, 4, 'triangle', 0.01);
 if (osc1) oscillators.push(osc1);
 if (osc2) oscillators.push(osc2);
 if (osc3) oscillators.push(osc3);

 const musicLoop = setTimeout(() => {
 currentMusicRef.current = null;
 startAmbientMusic();
 }, 8000);

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
 if (gameMusicTimeoutRef.current) {
 clearTimeout(gameMusicTimeoutRef.current);
 gameMusicTimeoutRef.current = null;
 }

 const oscillators = [];
 const gameFreqs = [220.00, 246.94, 261.63, 293.66];

 gameFreqs.forEach((freq, i) => {
 setTimeout(() => {
 const osc = createOscillator(freq, 0, 1.5, 'sawtooth', 0.02);
 if (osc) oscillators.push(osc);
 }, i * 400);
 });

 gameMusicTimeoutRef.current = setTimeout(() => {
 gameMusicTimeoutRef.current = null;
 playGameMusic();
 }, 8000);

 currentMusicRef.current = { oscillators, musicLoop: gameMusicTimeoutRef.current };
 }, [createOscillator, stopAmbientMusic]);

 useEffect(() => {
 return () => {
 stopAmbientMusic();
 if (gameMusicTimeoutRef.current) {
 clearTimeout(gameMusicTimeoutRef.current);
 gameMusicTimeoutRef.current = null;
 }
 };
 }, [stopAmbientMusic]);

 return {
 startAmbientMusic,
 stopAmbientMusic,
 playGameMusic
 };
}
