export class GameEventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  off(event, callback) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(cb => cb !== callback);
  }

  emit(event, data) {
    if (!this.events[event]) return;
    this.events[event].forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        // Log event handler errors (import-free, uses global)
        if (typeof window !== 'undefined' && window.__ERROR_LOGGER__) {
          window.__ERROR_LOGGER__.logError('EventEmitter', `emit:${event}`, error.message, {
            event,
            stack: error.stack
          });
        }
        console.error(`Event handler error for ${event}:`, error);
      }
    });
  }

  clear() {
    this.events = {};
  }
}

export const gameEvents = new GameEventEmitter();

export const GAME_EVENTS = {
  GAME_INITIALIZED: 'game_initialized',
  PIECE_MOVED: 'piece_moved',
  PIECE_ROTATED: 'piece_rotated',
  PIECE_PLACED: 'piece_placed',
  PIECE_HELD: 'piece_held',
  HARD_DROP: 'hard_drop',
  LINE_CLEARED: 'line_cleared',
  T_SPIN: 't_spin',
  BACK_TO_BACK: 'back_to_back',
  SCORE_UPDATED: 'score_updated',
  LEVEL_UP: 'level_up',
  GAME_OVER: 'game_over',
  GAME_PAUSED: 'game_paused',
  GAME_RESUMED: 'game_resumed'
}; 