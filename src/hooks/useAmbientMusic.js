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

 // Ambient pad: slowly evolving chord (Am7 voicing)
 // Very quiet, long notes with slow fade-in/fade-out
 const pads = [
 { freq: 220.00, delay: 0, dur: 8 },    // A3
 { freq: 261.63, delay: 0.5, dur: 7 },  // C4
 { freq: 329.63, delay: 1, dur: 7 },    // E4
 { freq: 392.00, delay: 1.5, dur: 6 },  // G4
 ];

 pads.forEach(({ freq, delay, dur }) => {
 const osc = createOscillator(freq, delay, dur, 'sine', 0.012);
 if (osc) oscillators.push(osc);
 });

 const musicLoop = setTimeout(() => {
 currentMusicRef.current = null;
 startAmbientMusic();
 }, 9000);

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
 // Gentle rhythmic pulse for game ambient (A minor pulsing bass)
 const gameNotes = [
 { freq: 220.00, delay: 0, dur: 1.8 },
 { freq: 196.00, delay: 2, dur: 1.8 },
 { freq: 174.61, delay: 4, dur: 1.8 },
 { freq: 196.00, delay: 6, dur: 1.8 },
 ];

 gameNotes.forEach(({ freq, delay, dur }) => {
 const osc = createOscillator(freq, delay, dur, 'triangle', 0.018);
 if (osc) oscillators.push(osc);
 });

 gameMusicTimeoutRef.current = setTimeout(() => {
 gameMusicTimeoutRef.current = null;
 playGameMusic();
 }, 8500);

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
