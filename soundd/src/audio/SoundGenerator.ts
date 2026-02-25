export class SoundGenerator {
  ctx: BaseAudioContext;
  
  constructor(ctx: BaseAudioContext) {
    this.ctx = ctx;
  }

  playTone(freq: number, type: OscillatorType, startTime: number, duration: number, vol: number = 0.5) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(vol, startTime + Math.min(0.01, duration * 0.1));
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  playMeow(startTime: number, duration: number, pitchBase: number = 400, pitchPeak: number = 600, vol: number = 0.5) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

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
    gain.connect(this.ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  playNoise(startTime: number, duration: number, type: 'white' | 'brown' = 'white', vol: number = 0.5) {
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
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
    
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const gain = this.ctx.createGain();
    
    gain.gain.setValueAtTime(vol, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    
    noise.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(startTime);
  }

  // 1. Menu Theme
  generateMenuTheme() {
    const notes = [
      523.25, 659.25, 783.99, 659.25, // C E G E
      587.33, 698.46, 880.00, 698.46, // D F A F
      523.25, 659.25, 783.99, 659.25, // C E G E
      493.88, 587.33, 783.99, 587.33  // B D G D
    ];
    const t = this.ctx.currentTime;
    for (let i = 0; i < 32; i++) {
      this.playTone(notes[i % notes.length], 'square', t + i * 0.25, 0.2, 0.1);
      if (i % 4 === 0) this.playNoise(t + i * 0.25, 0.1, 'white', 0.1); // Kick
      if (i % 4 === 2) this.playNoise(t + i * 0.25, 0.1, 'white', 0.05); // Snare
    }
  }

  // 2. Game Theme
  generateGameTheme() {
    const notes = [
      659.25, 493.88, 523.25, 587.33, 523.25, 493.88, 440.00, 440.00, 523.25, 659.25, 587.33, 523.25, 493.88, 493.88, 523.25, 587.33
    ];
    const t = this.ctx.currentTime;
    for (let i = 0; i < 32; i++) {
      this.playTone(notes[i % notes.length], 'square', t + i * 0.2, 0.15, 0.1);
      this.playTone(notes[i % notes.length] / 2, 'triangle', t + i * 0.2, 0.2, 0.15); // Bass
      if (i % 2 === 0) this.playNoise(t + i * 0.2, 0.05, 'white', 0.1);
    }
  }

  // 3. Ambient Pad
  generateAmbientPad() {
    const t = this.ctx.currentTime;
    for(let i=0; i<15; i++) {
        this.playNoise(t + i, 1.2, 'brown', 0.3);
        this.playTone(60, 'sine', t + i, 1.2, 0.2);
    }
  }

  // 4. Piece Move
  generatePieceMove() {
    this.playTone(800, 'square', this.ctx.currentTime, 0.05, 0.1);
  }

  // 5. Piece Rotate
  generatePieceRotate() {
    this.playTone(800, 'square', this.ctx.currentTime, 0.04, 0.1);
    this.playTone(1000, 'square', this.ctx.currentTime + 0.04, 0.04, 0.1);
  }

  // 6. Piece Land
  generatePieceLand() {
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(50, t + 0.1);
    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.1);
  }

  // 7. Hard Drop
  generateHardDrop() {
    this.generatePieceLand();
    this.playNoise(this.ctx.currentTime, 0.15, 'white', 0.2);
  }

  // 8. Hold Piece
  generateHoldPiece() {
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, t);
    osc.frequency.exponentialRampToValueAtTime(800, t + 0.1);
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.1);
  }

  // 9. Line Clear 1
  generateLineClear1() {
    this.playMeow(this.ctx.currentTime, 0.3, 400, 600, 0.3);
  }

  // 10. Line Clear 2
  generateLineClear2() {
    this.playMeow(this.ctx.currentTime, 0.2, 400, 600, 0.3);
    this.playMeow(this.ctx.currentTime + 0.2, 0.2, 450, 650, 0.3);
  }

  // 11. Line Clear 3
  generateLineClear3() {
    this.playMeow(this.ctx.currentTime, 0.2, 400, 600, 0.3);
    this.playMeow(this.ctx.currentTime + 0.15, 0.2, 500, 700, 0.3);
    this.playMeow(this.ctx.currentTime + 0.3, 0.3, 600, 800, 0.3);
  }

  // 12. Tetris (4)
  generateTetris4() {
    const t = this.ctx.currentTime;
    this.playMeow(t, 0.5, 600, 900, 0.4);
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      this.playTone(freq, 'sine', t + i * 0.1, 0.3, 0.2);
    });
  }

  // 13. T-Spin
  generateTSpin() {
    const t = this.ctx.currentTime;
    this.playMeow(t, 0.4, 500, 800, 0.3);
    this.playTone(800, 'square', t, 0.1, 0.1);
    this.playTone(1200, 'square', t + 0.1, 0.1, 0.1);
  }

  // 14. Back to Back
  generateBackToBack() {
    const t = this.ctx.currentTime;
    this.playMeow(t, 0.3, 700, 1000, 0.3);
    this.playMeow(t + 0.15, 0.3, 700, 1000, 0.2);
  }

  // 15. Combo
  generateCombo() {
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(400, t);
    osc.frequency.linearRampToValueAtTime(800, t + 0.2);
    gain.gain.setValueAtTime(0.1, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.2);
  }

  // 16. Level Up
  generateLevelUp() {
    const t = this.ctx.currentTime;
    for (let i = 0; i < 10; i++) {
      this.playTone(i % 2 === 0 ? 600 : 800, 'square', t + i * 0.05, 0.05, 0.1);
    }
    this.playMeow(t + 0.5, 0.5, 500, 800, 0.4);
  }

  // 17. Game Over
  generateGameOver() {
    const t = this.ctx.currentTime;
    this.playMeow(t, 1.5, 600, 200, 0.4);
    this.playTone(300, 'sawtooth', t, 1.5, 0.2);
  }

  // 18. Pause
  generatePause() {
    const t = this.ctx.currentTime;
    this.playTone(523.25, 'square', t, 0.1, 0.1);
    this.playTone(659.25, 'square', t + 0.1, 0.1, 0.1);
  }

  // 19. Resume
  generateResume() {
    const t = this.ctx.currentTime;
    this.playTone(659.25, 'square', t, 0.1, 0.1);
    this.playTone(523.25, 'square', t + 0.1, 0.1, 0.1);
  }

  // 20. Menu Hover
  generateMenuHover() {
    this.playTone(600, 'sine', this.ctx.currentTime, 0.05, 0.1);
  }

  // 21. Menu Select
  generateMenuSelect() {
    this.playMeow(this.ctx.currentTime, 0.15, 500, 700, 0.2);
  }

  // 22. Menu Back
  generateMenuBack() {
    this.playTone(300, 'square', this.ctx.currentTime, 0.1, 0.1);
  }

  // 23. Menu Open
  generateMenuOpen() {
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, t);
    osc.frequency.exponentialRampToValueAtTime(600, t + 0.2);
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.2);
  }

  // 24. Game Start
  generateGameStart() {
    const t = this.ctx.currentTime;
    this.playMeow(t, 0.4, 600, 900, 0.4);
    this.playTone(523.25, 'square', t + 0.4, 0.1, 0.1);
    this.playTone(659.25, 'square', t + 0.5, 0.1, 0.1);
    this.playTone(783.99, 'square', t + 0.6, 0.2, 0.1);
  }

  // 25. PWA Install
  generatePWAInstall() {
    const t = this.ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach((freq, i) => {
      this.playTone(freq, 'sine', t + i * 0.05, 0.3, 0.1);
    });
  }
}
