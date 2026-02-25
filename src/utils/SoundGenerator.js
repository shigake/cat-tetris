/**
 * Cat Tetris — Sound Generator (ported from soundd project)
 * Synthesizes all game sounds at runtime via Web Audio API.
 * Includes cat meow sounds for line clears and special moves!
 */

let _ctx = null;

export function getAudioContext() {
  if (!_ctx) {
    _ctx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (_ctx.state === 'suspended') {
    _ctx.resume().catch(() => {});
  }
  return _ctx;
}

// ── helpers ──────────────────────────────────────────────

function playTone(ctx, freq, type, startTime, duration, vol = 0.5) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(vol, startTime + Math.min(0.01, duration * 0.1));
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(startTime);
  osc.stop(startTime + duration);
}

function playMeow(ctx, startTime, duration, pitchBase = 400, pitchPeak = 600, vol = 0.5) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  osc.type = 'sawtooth';
  filter.type = 'bandpass';
  filter.Q.value = 3;
  osc.frequency.setValueAtTime(pitchBase, startTime);
  osc.frequency.exponentialRampToValueAtTime(pitchPeak, startTime + duration * 0.3);
  osc.frequency.exponentialRampToValueAtTime(pitchBase * 0.8, startTime + duration);
  filter.frequency.setValueAtTime(pitchBase * 2, startTime);
  filter.frequency.linearRampToValueAtTime(pitchPeak * 2.5, startTime + duration * 0.3);
  filter.frequency.linearRampToValueAtTime(pitchBase * 1.5, startTime + duration);
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(vol, startTime + duration * 0.1);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  osc.start(startTime);
  osc.stop(startTime + duration);
}

function playNoise(ctx, startTime, duration, type = 'white', vol = 0.5) {
  const bufferSize = Math.max(1, Math.floor(ctx.sampleRate * duration));
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let lastOut = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    if (type === 'brown') {
      lastOut = (lastOut + (0.02 * white)) / 1.02;
      data[i] = lastOut * 3.5;
    } else {
      data[i] = white;
    }
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(vol, startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  noise.connect(gain);
  gain.connect(ctx.destination);
  noise.start(startTime);
}

// ── sound generators (mapped by filename) ────────────────

function generatePieceMove(ctx, vol) {
  playTone(ctx, 800, 'square', ctx.currentTime, 0.05, 0.1 * vol);
}

function generatePieceRotate(ctx, vol) {
  const t = ctx.currentTime;
  playTone(ctx, 800, 'square', t, 0.04, 0.1 * vol);
  playTone(ctx, 1000, 'square', t + 0.04, 0.04, 0.1 * vol);
}

function generatePieceLand(ctx, vol) {
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(150, t);
  osc.frequency.exponentialRampToValueAtTime(50, t + 0.1);
  gain.gain.setValueAtTime(0.3 * vol, t);
  gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.1);
}

function generateHardDrop(ctx, vol) {
  generatePieceLand(ctx, vol);
  playNoise(ctx, ctx.currentTime, 0.15, 'white', 0.2 * vol);
}

function generateHoldPiece(ctx, vol) {
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(200, t);
  osc.frequency.exponentialRampToValueAtTime(800, t + 0.1);
  gain.gain.setValueAtTime(0.2 * vol, t);
  gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.1);
}

function generateLineClear1(ctx, vol) {
  playMeow(ctx, ctx.currentTime, 0.3, 400, 600, 0.3 * vol);
}

function generateLineClear2(ctx, vol) {
  const t = ctx.currentTime;
  playMeow(ctx, t, 0.2, 400, 600, 0.3 * vol);
  playMeow(ctx, t + 0.2, 0.2, 450, 650, 0.3 * vol);
}

function generateLineClear3(ctx, vol) {
  const t = ctx.currentTime;
  playMeow(ctx, t, 0.2, 400, 600, 0.3 * vol);
  playMeow(ctx, t + 0.15, 0.2, 500, 700, 0.3 * vol);
  playMeow(ctx, t + 0.3, 0.3, 600, 800, 0.3 * vol);
}

function generateTetris4(ctx, vol) {
  const t = ctx.currentTime;
  playMeow(ctx, t, 0.5, 600, 900, 0.4 * vol);
  [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
    playTone(ctx, freq, 'sine', t + i * 0.1, 0.3, 0.2 * vol);
  });
}

function generateTSpin(ctx, vol) {
  const t = ctx.currentTime;
  playMeow(ctx, t, 0.4, 500, 800, 0.3 * vol);
  playTone(ctx, 800, 'square', t, 0.1, 0.1 * vol);
  playTone(ctx, 1200, 'square', t + 0.1, 0.1, 0.1 * vol);
}

function generateBackToBack(ctx, vol) {
  const t = ctx.currentTime;
  playMeow(ctx, t, 0.3, 700, 1000, 0.3 * vol);
  playMeow(ctx, t + 0.15, 0.3, 700, 1000, 0.2 * vol);
}

function generateCombo(ctx, vol) {
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'square';
  osc.frequency.setValueAtTime(400, t);
  osc.frequency.linearRampToValueAtTime(800, t + 0.2);
  gain.gain.setValueAtTime(0.1 * vol, t);
  gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.2);
}

function generateLevelUp(ctx, vol) {
  const t = ctx.currentTime;
  for (let i = 0; i < 10; i++) {
    playTone(ctx, i % 2 === 0 ? 600 : 800, 'square', t + i * 0.05, 0.05, 0.1 * vol);
  }
  playMeow(ctx, t + 0.5, 0.5, 500, 800, 0.4 * vol);
}

function generateGameOver(ctx, vol) {
  const t = ctx.currentTime;
  playMeow(ctx, t, 1.5, 600, 200, 0.4 * vol);
  playTone(ctx, 300, 'sawtooth', t, 1.5, 0.2 * vol);
}

function generatePause(ctx, vol) {
  const t = ctx.currentTime;
  playTone(ctx, 523.25, 'square', t, 0.1, 0.1 * vol);
  playTone(ctx, 659.25, 'square', t + 0.1, 0.1, 0.1 * vol);
}

function generateResume(ctx, vol) {
  const t = ctx.currentTime;
  playTone(ctx, 659.25, 'square', t, 0.1, 0.1 * vol);
  playTone(ctx, 523.25, 'square', t + 0.1, 0.1, 0.1 * vol);
}

function generateMenuHover(ctx, vol) {
  playTone(ctx, 600, 'sine', ctx.currentTime, 0.05, 0.1 * vol);
}

function generateMenuSelect(ctx, vol) {
  playMeow(ctx, ctx.currentTime, 0.15, 500, 700, 0.2 * vol);
}

function generateMenuBack(ctx, vol) {
  playTone(ctx, 300, 'square', ctx.currentTime, 0.1, 0.1 * vol);
}

function generateMenuOpen(ctx, vol) {
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(300, t);
  osc.frequency.exponentialRampToValueAtTime(600, t + 0.2);
  gain.gain.setValueAtTime(0.2 * vol, t);
  gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.2);
}

function generateGameStart(ctx, vol) {
  const t = ctx.currentTime;
  playMeow(ctx, t, 0.4, 600, 900, 0.4 * vol);
  playTone(ctx, 523.25, 'square', t + 0.4, 0.1, 0.1 * vol);
  playTone(ctx, 659.25, 'square', t + 0.5, 0.1, 0.1 * vol);
  playTone(ctx, 783.99, 'square', t + 0.6, 0.2, 0.1 * vol);
}

function generatePWAInstall(ctx, vol) {
  const t = ctx.currentTime;
  [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach((freq, i) => {
    playTone(ctx, freq, 'sine', t + i * 0.05, 0.3, 0.1 * vol);
  });
}

// ── BGM generators (return stop function) ────────────────

function generateMenuTheme(ctx, vol) {
  const notes = [
    523.25, 659.25, 783.99, 659.25,
    587.33, 698.46, 880.00, 698.46,
    523.25, 659.25, 783.99, 659.25,
    493.88, 587.33, 783.99, 587.33
  ];
  let stopped = false;
  let timer = null;
  const playLoop = () => {
    if (stopped) return;
    const t = ctx.currentTime;
    for (let i = 0; i < 32; i++) {
      playTone(ctx, notes[i % notes.length], 'square', t + i * 0.25, 0.2, 0.1 * vol);
      if (i % 4 === 0) playNoise(ctx, t + i * 0.25, 0.1, 'white', 0.1 * vol);
      if (i % 4 === 2) playNoise(ctx, t + i * 0.25, 0.1, 'white', 0.05 * vol);
    }
    timer = setTimeout(playLoop, 32 * 250 - 100);
  };
  playLoop();
  return () => { stopped = true; clearTimeout(timer); };
}

function generateGameTheme(ctx, vol) {
  const notes = [
    659.25, 493.88, 523.25, 587.33, 523.25, 493.88, 440.00, 440.00,
    523.25, 659.25, 587.33, 523.25, 493.88, 493.88, 523.25, 587.33
  ];
  let stopped = false;
  let timer = null;
  const playLoop = () => {
    if (stopped) return;
    const t = ctx.currentTime;
    for (let i = 0; i < 32; i++) {
      playTone(ctx, notes[i % notes.length], 'square', t + i * 0.2, 0.15, 0.1 * vol);
      playTone(ctx, notes[i % notes.length] / 2, 'triangle', t + i * 0.2, 0.2, 0.15 * vol);
      if (i % 2 === 0) playNoise(ctx, t + i * 0.2, 0.05, 'white', 0.1 * vol);
    }
    timer = setTimeout(playLoop, 32 * 200 - 100);
  };
  playLoop();
  return () => { stopped = true; clearTimeout(timer); };
}

// ── filename → generator mapping ─────────────────────────

const SOUND_MAP = {
  'sfx_piece_move.wav': generatePieceMove,
  'sfx_piece_rotate.wav': generatePieceRotate,
  'sfx_piece_land.wav': generatePieceLand,
  'sfx_hard_drop.wav': generateHardDrop,
  'sfx_hold_piece.wav': generateHoldPiece,
  'sfx_line_clear_1.wav': generateLineClear1,
  'sfx_line_clear_2.wav': generateLineClear2,
  'sfx_line_clear_3.wav': generateLineClear3,
  'sfx_tetris_4_lines.wav': generateTetris4,
  'sfx_t_spin.wav': generateTSpin,
  'sfx_back_to_back.wav': generateBackToBack,
  'sfx_combo.wav': generateCombo,
  'sfx_level_up.wav': generateLevelUp,
  'sfx_game_over.wav': generateGameOver,
  'sfx_pause.wav': generatePause,
  'sfx_resume.wav': generateResume,
  'sfx_menu_hover.wav': generateMenuHover,
  'sfx_menu_select.wav': generateMenuSelect,
  'sfx_menu_back.wav': generateMenuBack,
  'sfx_menu_open.wav': generateMenuOpen,
  'sfx_game_start.wav': generateGameStart,
  'sfx_pwa_install.wav': generatePWAInstall,
};

export { SOUND_MAP, generateMenuTheme, generateGameTheme };
