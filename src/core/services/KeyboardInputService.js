import { IKeyboardInputService } from '../../interfaces/IKeyboardInputService.js';

/**
 * KeyboardInputService with DAS/ARR (Delayed Auto-Shift / Auto-Repeat Rate)
 * - DAS: delay before auto-repeat starts (ms)
 * - ARR: interval between auto-repeat moves (ms)
 * Only moveLeft/moveRight/moveDown use DAS/ARR.
 */
export class KeyboardInputService extends IKeyboardInputService {
  constructor() {
    super();
    this.keyMappings = {
      'ArrowLeft': 'moveLeft',
      'ArrowRight': 'moveRight',
      'ArrowDown': 'moveDown',
      'ArrowUp': 'rotate',
      'x': 'rotate',
      'X': 'rotate',
      'z': 'rotateLeft',
      'Z': 'rotateLeft',
      ' ': 'hardDrop',
      'c': 'hold',
      'C': 'hold',
      'Shift': 'hold',
      'p': 'pause',
      'P': 'pause',
      'Escape': 'pause'
    };

    this.preventDefaultKeys = [
      'ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', ' '
    ];

    this.handlers = new Map();
    this.isListening = false;

    // DAS / ARR settings (ms) — Tetris Guideline defaults
    this.das = 167;  // Delayed Auto-Shift (~10 frames @ 60fps)
    this.arr = 33;   // Auto-Repeat Rate  (~2 frames @ 60fps)
    this.sdf = 5;    // Soft Drop Factor (multiplied by normal gravity)

    // DAS/ARR applicable actions
    this._dasActions = new Set(['moveLeft', 'moveRight', 'moveDown']);

    // Track pressed keys for DAS/ARR
    this._pressedKeys = new Map(); // key -> { action, dasTimer, arrTimer, dasTriggered }
    this._rafId = null;
    this._lastTime = 0;
  }

  setDAS(ms) { this.das = Math.max(0, ms); }
  setARR(ms) { this.arr = Math.max(0, ms); }
  getDAS() { return this.das; }
  getARR() { return this.arr; }

  registerHandler(action, handler) {
    if (!this.handlers.has(action)) {
      this.handlers.set(action, []);
    }
    this.handlers.get(action).push(handler);
  }

  unregisterHandler(action, handler) {
    if (this.handlers.has(action)) {
      const handlers = this.handlers.get(action);
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  _fireAction(action) {
    if (this.handlers.has(action)) {
      this.handlers.get(action).forEach(handler => {
        try { handler(); } catch (e) { console.error(`Handler error [${action}]:`, e); }
      });
    }
  }

  startListening() {
    if (!this.isListening) {
      window.addEventListener('keydown', this._handleKeyDown);
      window.addEventListener('keyup', this._handleKeyUp);
      window.addEventListener('blur', this._handleBlur);
      this.isListening = true;
      this._startLoop();
    }
  }

  stopListening() {
    if (this.isListening) {
      window.removeEventListener('keydown', this._handleKeyDown);
      window.removeEventListener('keyup', this._handleKeyUp);
      window.removeEventListener('blur', this._handleBlur);
      this.isListening = false;
      this._stopLoop();
      this._pressedKeys.clear();
    }
  }

  _handleKeyDown = (event) => {
    if (this.preventDefaultKeys.includes(event.key)) {
      event.preventDefault();
    }
    // Ignore browser auto-repeat
    if (event.repeat) return;

    const action = this.keyMappings[event.key];
    if (!action) return;

    // Fire immediately on keydown
    this._fireAction(action);

    // Start DAS/ARR tracking for applicable actions
    if (this._dasActions.has(action)) {
      this._pressedKeys.set(event.key, {
        action,
        dasTimer: 0,
        arrTimer: 0,
        dasTriggered: false
      });
    }
  }

  _handleKeyUp = (event) => {
    this._pressedKeys.delete(event.key);
  }

  _handleBlur = () => {
    this._pressedKeys.clear();
  }

  _startLoop() {
    this._lastTime = performance.now();
    const loop = (now) => {
      const dt = now - this._lastTime;
      this._lastTime = now;
      this._updateDAS(dt);
      this._rafId = requestAnimationFrame(loop);
    };
    this._rafId = requestAnimationFrame(loop);
  }

  _stopLoop() {
    if (this._rafId) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
  }

  _updateDAS(dt) {
    for (const [key, state] of this._pressedKeys) {
      if (!state.dasTriggered) {
        state.dasTimer += dt;
        if (state.dasTimer >= this.das) {
          state.dasTriggered = true;
          state.arrTimer = 0;
          // If ARR is 0, instant move (0-ARR = teleport)
          if (this.arr === 0) {
            for (let i = 0; i < 20; i++) this._fireAction(state.action);
          } else {
            this._fireAction(state.action);
          }
        }
      } else {
        state.arrTimer += dt;
        if (this.arr === 0) {
          for (let i = 0; i < 20; i++) this._fireAction(state.action);
          state.arrTimer = 0;
        } else {
          while (state.arrTimer >= this.arr) {
            state.arrTimer -= this.arr;
            this._fireAction(state.action);
          }
        }
      }
    }
  }

  setKeyMapping(key, action) {
    this.keyMappings[key] = action;
  }

  removeKeyMapping(key) {
    delete this.keyMappings[key];
  }

  getKeyMappings() {
    return { ...this.keyMappings };
  }

  clear() {
    this.handlers.clear();
    this.stopListening();
  }
} 