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
      }
    });
  }

  clear() {
    this.events = {};
  }
}

export const gameEvents = new GameEventEmitter();

export const GAME_EVENTS = {
  PIECE_MOVED: 'piece_moved',
  PIECE_ROTATED: 'piece_rotated',
  PIECE_PLACED: 'piece_placed',
  PIECE_HELD: 'piece_held',
  LINE_CLEARED: 'line_cleared',
  T_SPIN: 't_spin',
  SCORE_UPDATED: 'score_updated',
  LEVEL_UP: 'level_up',
  GAME_OVER: 'game_over',
  GAME_PAUSED: 'game_paused',
  GAME_RESUMED: 'game_resumed'
}; 