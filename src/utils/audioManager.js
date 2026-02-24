/**
 * Centralized audio manager that uses real audio files instead of oscillators.
 * All sound files live in public/sounds/.
 */

const BASE = import.meta.env.BASE_URL || '/';
const SOUNDS_PATH = `${BASE}sounds/`;

// Cache of Audio elements keyed by filename
const audioCache = new Map();
// Pool of clones for overlapping playback
const activeAudio = new Set();
const MAX_CONCURRENT = 12;

/**
 * Preload an audio file into the cache.
 */
export function preloadSound(filename) {
 if (audioCache.has(filename)) return;
 try {
  const audio = new Audio(`${SOUNDS_PATH}${filename}`);
  audio.preload = 'auto';
  audioCache.set(filename, audio);
 } catch {}
}

/**
 * Play a sound effect (short, one-shot).
 * Clones the cached Audio so overlapping plays work.
 * Returns the HTMLAudioElement or null.
 */
export function playSound(filename, { volume = 0.5, loop = false } = {}) {
 if (activeAudio.size >= MAX_CONCURRENT) return null;

 try {
  // Ensure it's preloaded
  if (!audioCache.has(filename)) {
   preloadSound(filename);
  }

  const source = audioCache.get(filename);
  if (!source) return null;

  const clone = source.cloneNode();
  clone.volume = Math.max(0, Math.min(1, volume));
  clone.loop = loop;

  activeAudio.add(clone);
  clone.addEventListener('ended', () => activeAudio.delete(clone), { once: true });
  clone.addEventListener('error', () => activeAudio.delete(clone), { once: true });

  clone.play().catch(() => {
   activeAudio.delete(clone);
  });

  return clone;
 } catch {
  return null;
 }
}

/**
 * Stop a specific audio element (returned by playSound).
 */
export function stopSound(audio) {
 if (!audio) return;
 try {
  audio.pause();
  audio.currentTime = 0;
  activeAudio.delete(audio);
 } catch {}
}

/**
 * Stop all currently playing sounds.
 */
export function stopAllSounds() {
 activeAudio.forEach(audio => {
  try {
   audio.pause();
   audio.currentTime = 0;
  } catch {}
 });
 activeAudio.clear();
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

// Preload all game sounds on module load
const ALL_SOUNDS = [
 'bgm_menu_theme_loop.wav',
 'bgm_game_theme_loop.wav',
 'sfx_piece_move.wav',
 'sfx_piece_rotate.wav',
 'sfx_piece_land.wav',
 'sfx_hard_drop.wav',
 'sfx_hold_piece.wav',
 'sfx_line_clear_1.wav',
 'sfx_line_clear_2.wav',
 'sfx_line_clear_3.wav',
 'sfx_tetris_4_lines.wav',
 'sfx_t_spin.wav',
 'sfx_back_to_back.wav',
 'sfx_combo.wav',
 'sfx_level_up.wav',
 'sfx_game_over.wav',
 'sfx_pause.wav',
 'sfx_resume.wav',
 'sfx_menu_hover.wav',
 'sfx_menu_select.wav',
 'sfx_menu_back.wav',
 'sfx_menu_open.wav',
 'sfx_game_start.wav',
 'sfx_pwa_install.wav',
];

// Lazy preload after first user interaction
let _preloaded = false;
const _unlockCallbacks = [];

function preloadAll() {
 if (_preloaded) return;
 _preloaded = true;
 ALL_SOUNDS.forEach(preloadSound);
 // Notify anyone waiting for audio unlock
 _unlockCallbacks.forEach(cb => { try { cb(); } catch {} });
 _unlockCallbacks.length = 0;
}

/**
 * Returns true if audio has been unlocked by a user interaction.
 */
export function isAudioUnlocked() {
 return _preloaded;
}

/**
 * Register a callback to run once audio is unlocked by user interaction.
 * If already unlocked, fires immediately.
 */
export function onAudioUnlocked(cb) {
 if (_preloaded) { cb(); return; }
 _unlockCallbacks.push(cb);
}

['click', 'touchstart', 'keydown'].forEach(evt => {
 document.addEventListener(evt, preloadAll, { once: true, passive: true });
});
