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

 // Helper: schedule a note with smooth envelope and optional vibrato
 const scheduleNote = useCallback((audioContext, freq, start, duration, type, vol, vibratoRate) => {
 if (!canPlaySound()) return null;
 const osc = audioContext.createOscillator();
 const gain = audioContext.createGain();
 const filter = audioContext.createBiquadFilter();

 // Soft low-pass to remove harshness
 filter.type = 'lowpass';
 filter.frequency.setValueAtTime(1200, start);

 osc.connect(filter);
 filter.connect(gain);
 gain.connect(audioContext.destination);

 osc.frequency.setValueAtTime(freq, start);
 osc.type = type;

 // Optional gentle vibrato
 if (vibratoRate) {
 const lfo = audioContext.createOscillator();
 const lfoGain = audioContext.createGain();
 lfo.frequency.setValueAtTime(vibratoRate, start);
 lfoGain.gain.setValueAtTime(3, start); // subtle pitch wobble
 lfo.connect(lfoGain);
 lfoGain.connect(osc.frequency);
 lfo.start(start);
 lfo.stop(start + duration);
 trackOscillatorStart();
 lfo.onended = () => trackOscillatorEnd();
 }

 // Smooth fade-in / fade-out envelope
 const fadeIn = Math.min(0.08, duration * 0.15);
 const fadeOut = Math.min(0.3, duration * 0.4);
 gain.gain.setValueAtTime(0, start);
 gain.gain.linearRampToValueAtTime(vol, start + fadeIn);
 gain.gain.setValueAtTime(vol, start + duration - fadeOut);
 gain.gain.linearRampToValueAtTime(0, start + duration);

 trackOscillatorStart();
 osc.onended = () => trackOscillatorEnd();

 osc.start(start);
 osc.stop(start + duration);

 oscillatorsRef.current.push(osc);
 return osc;
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

 // ── Menu music: gentle pentatonic lullaby ──
 const playCheerfulMelody = useCallback(() => {
 stopMusic();
 try {
 const audioContext = getAudioContext();
 if (!audioContext) return;

 const bpm = 90;
 const beat = 60 / bpm;

 // C pentatonic: C D E G A  (two octaves)
 const melody = [
 // Phrase 1 – ascending hopeful
 { note: 523.25, dur: 1 },   // C5
 { note: 587.33, dur: 0.5 }, // D5
 { note: 659.25, dur: 1.5 }, // E5
 { note: 0, dur: 0.5 },      // rest
 { note: 783.99, dur: 1 },   // G5
 { note: 659.25, dur: 0.5 }, // E5
 { note: 587.33, dur: 1 },   // D5
 { note: 523.25, dur: 1.5 }, // C5
 { note: 0, dur: 1 },        // rest

 // Phrase 2 – playful skip
 { note: 659.25, dur: 0.5 }, // E5
 { note: 783.99, dur: 0.5 }, // G5
 { note: 880.00, dur: 1.5 }, // A5
 { note: 783.99, dur: 0.5 }, // G5
 { note: 659.25, dur: 1 },   // E5
 { note: 587.33, dur: 0.5 }, // D5
 { note: 523.25, dur: 2 },   // C5 (held)
 { note: 0, dur: 1 },        // rest

 // Phrase 3 – descending gentle landing
 { note: 880.00, dur: 0.75 },// A5
 { note: 783.99, dur: 0.75 },// G5
 { note: 659.25, dur: 0.75 },// E5
 { note: 587.33, dur: 0.75 },// D5
 { note: 523.25, dur: 2 },   // C5
 { note: 0, dur: 1.5 },      // rest
 ];

 let t = audioContext.currentTime + 0.1;
 melody.forEach(({ note, dur }) => {
 const d = dur * beat;
 if (note > 0) {
 // Main voice: soft sine
 scheduleNote(audioContext, note, t, d * 0.9, 'sine', 0.04, 4);
 // Subtle pad an octave below at very low volume
 scheduleNote(audioContext, note * 0.5, t, d * 0.85, 'triangle', 0.015, 0);
 }
 t += d;
 });

 const totalDuration = melody.reduce((s, n) => s + n.dur, 0) * beat;
 loopTimeoutRef.current = setTimeout(() => {
 playCheerfulMelody();
 }, totalDuration * 1000 + 800);

 setIsPlaying(true);
 setCurrentTrack('cheerful');
 } catch (error) {}
 }, [stopMusic, scheduleNote]);

 // ── Game music: upbeat Tetris-inspired groove ──
 const playEnergeticMelody = useCallback(() => {
 stopMusic();
 try {
 const audioContext = getAudioContext();
 if (!audioContext) return;

 const bpm = 140;
 const beat = 60 / bpm;

 // A minor Tetris-ish melody
 const melody = [
 // Phrase 1 – the hook
 { note: 659.25, dur: 1 },   // E5
 { note: 493.88, dur: 0.5 }, // B4
 { note: 523.25, dur: 0.5 }, // C5
 { note: 587.33, dur: 1 },   // D5
 { note: 523.25, dur: 0.5 }, // C5
 { note: 493.88, dur: 0.5 }, // B4
 { note: 440.00, dur: 1 },   // A4
 { note: 440.00, dur: 0.5 }, // A4
 { note: 523.25, dur: 0.5 }, // C5
 { note: 659.25, dur: 1 },   // E5
 { note: 587.33, dur: 0.5 }, // D5
 { note: 523.25, dur: 0.5 }, // C5

 // Phrase 2 – resolution
 { note: 493.88, dur: 1.5 }, // B4
 { note: 523.25, dur: 0.5 }, // C5
 { note: 587.33, dur: 1 },   // D5
 { note: 659.25, dur: 1 },   // E5
 { note: 523.25, dur: 1 },   // C5
 { note: 440.00, dur: 1 },   // A4
 { note: 440.00, dur: 1.5 }, // A4
 { note: 0, dur: 0.5 },      // rest

 // Phrase 3 – bridge
 { note: 587.33, dur: 1.5 }, // D5
 { note: 698.46, dur: 0.5 }, // F5
 { note: 880.00, dur: 1 },   // A5
 { note: 783.99, dur: 0.5 }, // G5
 { note: 698.46, dur: 0.5 }, // F5
 { note: 659.25, dur: 1.5 }, // E5
 { note: 523.25, dur: 0.5 }, // C5
 { note: 659.25, dur: 1 },   // E5
 { note: 587.33, dur: 0.5 }, // D5
 { note: 523.25, dur: 0.5 }, // C5

 // Phrase 4 – ending
 { note: 493.88, dur: 1 },   // B4
 { note: 493.88, dur: 0.5 }, // B4
 { note: 523.25, dur: 0.5 }, // C5
 { note: 587.33, dur: 1 },   // D5
 { note: 659.25, dur: 1 },   // E5
 { note: 523.25, dur: 1 },   // C5
 { note: 440.00, dur: 1 },   // A4
 { note: 440.00, dur: 1.5 }, // A4
 { note: 0, dur: 1 },        // rest
 ];

 // Simple bass pattern (root notes, octave below melody)
 const bassNotes = [
 { note: 220.00, dur: 2 }, // A3
 { note: 220.00, dur: 2 },
 { note: 196.00, dur: 2 }, // G3
 { note: 174.61, dur: 2 }, // F3
 { note: 164.81, dur: 2 }, // E3
 { note: 164.81, dur: 2 },
 { note: 196.00, dur: 2 }, // G3
 { note: 220.00, dur: 2 }, // A3
 ];

 let t = audioContext.currentTime + 0.1;
 melody.forEach(({ note, dur }) => {
 const d = dur * beat;
 if (note > 0) {
 // Lead: triangle wave (warmer than square)
 scheduleNote(audioContext, note, t, d * 0.85, 'triangle', 0.045, 0);
 }
 t += d;
 });

 // Bass line
 let tb = audioContext.currentTime + 0.1;
 const totalMelodyBeats = melody.reduce((s, n) => s + n.dur, 0);
 const bassLoopBeats = bassNotes.reduce((s, n) => s + n.dur, 0);
 const bassRepeat = Math.ceil(totalMelodyBeats / bassLoopBeats);

 for (let r = 0; r < bassRepeat; r++) {
 bassNotes.forEach(({ note, dur }) => {
 const d = dur * beat;
 if (tb < audioContext.currentTime + totalMelodyBeats * beat + 0.1) {
 scheduleNote(audioContext, note, tb, d * 0.8, 'sine', 0.03, 0);
 }
 tb += d;
 });
 }

 const totalDuration = totalMelodyBeats * beat;
 loopTimeoutRef.current = setTimeout(() => {
 playEnergeticMelody();
 }, totalDuration * 1000 + 200);

 setIsPlaying(true);
 setCurrentTrack('energetic');
 } catch (error) {}
 }, [stopMusic, scheduleNote]);

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
