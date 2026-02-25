/**
 * Centralized audio manager using Web Audio API synthesis (from soundd project).
 * No .wav files needed — all sounds generated in real-time with cat meows!
 */

import { getAudioContext, SOUND_MAP, generateMenuTheme, generateGameTheme } from './SoundGenerator';

let _unlocked = false;
const _unlockCallbacks = [];

function unlock() {
  if (_unlocked) return;
  _unlocked = true;
  try { getAudioContext(); } catch {}
  _unlockCallbacks.forEach(cb => { try { cb(); } catch {} });
  _unlockCallbacks.length = 0;
}

['click', 'touchstart', 'keydown'].forEach(evt => {
  document.addEventListener(evt, unlock, { once: true, passive: true });
});

/**
 * Preload is a no-op now (sounds are synthesized, not loaded).
 */
export function preloadSound() {}

/**
 * Play a sound effect by filename. The filename is mapped to a synthesizer function.
 * Returns a handle object with stop() for compatibility.
 */
export function playSound(filename, { volume = 0.5, loop = false } = {}) {
  if (!_unlocked) unlock();

  try {
    const ctx = getAudioContext();

    // BGM (looping) — menu uses game-theme-cat.wav file, game uses synth
    if (loop && filename === 'bgm_menu_theme_loop.wav') {
      const base = import.meta.env.BASE_URL || '/';
      const audio = new Audio(`${base}sounds/game-theme-cat.wav`);
      audio.loop = true;
      audio.volume = Math.min(1, volume);
      audio.play().catch(() => {});
      return { _type: 'bgm', stop: () => { audio.pause(); audio.currentTime = 0; }, pause: () => audio.pause(), play: () => audio.play().catch(() => {}), currentTime: 0 };
    }
    if (loop && filename === 'bgm_game_theme_loop.wav') {
      const stop = generateGameTheme(ctx, volume);
      return { _type: 'bgm', stop, pause: stop, play: () => {}, currentTime: 0 };
    }

    // SFX — one-shot synthesized sounds
    const generator = SOUND_MAP[filename];
    if (generator) {
      generator(ctx, volume);
      return { _type: 'sfx' };
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Stop a sound handle (only meaningful for BGM loops).
 */
export function stopSound(handle) {
  if (!handle) return;
  try {
    if (handle._type === 'bgm' && typeof handle.stop === 'function') {
      handle.stop();
    }
  } catch {}
}

/**
 * Stop all currently playing sounds.
 */
export function stopAllSounds() {
  // With synthesized sounds, one-shots auto-stop.
  // BGM loops need to be stopped via their handle.
}

// Throttle map
const lastPlayed = new Map();

/**
 * Play a sound with throttle (won't replay if called again within minInterval ms).
 */
export function playSoundThrottled(filename, minInterval, options) {
  const now = Date.now();
  const last = lastPlayed.get(filename) || 0;
  if (now - last < minInterval) return null;
  lastPlayed.set(filename, now);
  return playSound(filename, options);
}

/**
 * Returns true if audio has been unlocked by a user interaction.
 */
export function isAudioUnlocked() {
  return _unlocked;
}

/**
 * Register a callback to run once audio is unlocked by user interaction.
 */
export function onAudioUnlocked(cb) {
  if (_unlocked) { cb(); return; }
  _unlockCallbacks.push(cb);
}
