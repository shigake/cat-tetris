import { useState, useCallback, useRef } from 'react';
import { getAudioContext, canPlaySound, trackOscillatorStart, trackOscillatorEnd } from '../utils/sharedAudioContext';

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
 playCheerfulMelody();
 } catch (error) {
 }
 }, [stopMusic]);

 const startGameMusic = useCallback(async () => {
 try {
 stopMusic();
 playEnergeticMelody();
 } catch (error) {
 }
 }, [stopMusic]);

 const playCheerfulMelody = useCallback(() => {
 stopMusic();

 try {
 const audioContext = getAudioContext();
 if (!audioContext) return;

 // Simplified melody: fewer notes, no harmony layer
 const notes = [
 { freq: 523.25, duration: 0.4 },
 { freq: 587.33, duration: 0.4 },
 { freq: 659.25, duration: 0.4 },
 { freq: 783.99, duration: 0.6 },
 { freq: 659.25, duration: 0.4 },
 { freq: 523.25, duration: 0.8 },
 { freq: 659.25, duration: 0.4 },
 { freq: 783.99, duration: 0.6 },
 { freq: 1046.5, duration: 0.8 }
 ];

 let startTime = audioContext.currentTime;

 notes.forEach((note) => {
 if (!canPlaySound()) return;
 const oscillator = audioContext.createOscillator();
 const gainNode = audioContext.createGain();

 oscillator.connect(gainNode);
 gainNode.connect(audioContext.destination);

 oscillator.frequency.setValueAtTime(note.freq, startTime);
 oscillator.type = 'sine';

 gainNode.gain.setValueAtTime(0, startTime);
 gainNode.gain.linearRampToValueAtTime(0.06, startTime + 0.05);
 gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + note.duration);

 trackOscillatorStart();
 oscillator.onended = () => trackOscillatorEnd();

 oscillator.start(startTime);
 oscillator.stop(startTime + note.duration);

 oscillatorsRef.current.push(oscillator);
 startTime += note.duration;
 });

 const totalDuration = notes.reduce((sum, n) => sum + n.duration, 0);
 loopTimeoutRef.current = setTimeout(() => {
 playCheerfulMelody();
 }, totalDuration * 1000 + 500);

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

 // Simplified energetic melody
 const notes = [
 { freq: 261.63, duration: 0.2 },
 { freq: 329.63, duration: 0.2 },
 { freq: 392.00, duration: 0.2 },
 { freq: 523.25, duration: 0.3 },
 { freq: 293.66, duration: 0.2 },
 { freq: 440.00, duration: 0.2 },
 { freq: 587.33, duration: 0.3 },
 { freq: 329.63, duration: 0.2 },
 { freq: 493.88, duration: 0.2 },
 { freq: 659.25, duration: 0.4 }
 ];

 let startTime = audioContext.currentTime;

 notes.forEach((note) => {
 if (!canPlaySound()) return;
 const oscillator = audioContext.createOscillator();
 const gainNode = audioContext.createGain();

 oscillator.connect(gainNode);
 gainNode.connect(audioContext.destination);

 oscillator.frequency.setValueAtTime(note.freq, startTime);
 oscillator.type = 'square';

 gainNode.gain.setValueAtTime(0, startTime);
 gainNode.gain.linearRampToValueAtTime(0.08, startTime + 0.02);
 gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + note.duration);

 trackOscillatorStart();
 oscillator.onended = () => trackOscillatorEnd();

 oscillator.start(startTime);
 oscillator.stop(startTime + note.duration);

 oscillatorsRef.current.push(oscillator);
 startTime += note.duration;
 });

 const totalDuration = notes.reduce((sum, n) => sum + n.duration, 0);
 loopTimeoutRef.current = setTimeout(() => {
 playEnergeticMelody();
 }, totalDuration * 1000 + 300);

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
