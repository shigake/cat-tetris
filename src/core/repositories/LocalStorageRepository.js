import { IGameRepository } from './IGameRepository.js';

export class LocalStorageRepository extends IGameRepository {
  constructor() {
    super();
    this.highScoreKey = 'cat-tetris-high-score';
    this.settingsKey = 'cat-tetris-settings';
    this.gameStateKey = 'cat-tetris-game-state';
  }

  saveHighScore(score) {
    try { localStorage.setItem(this.highScoreKey, score.toString()); } catch { /* quota */ }
  }

  getHighScore() {
    try { return parseInt(localStorage.getItem(this.highScoreKey) || '0'); } catch { return 0; }
  }

  saveSettings(settings) {
    try { localStorage.setItem(this.settingsKey, JSON.stringify(settings)); } catch { /* quota */ }
  }

  getSettings() {
    try {
      const settings = localStorage.getItem(this.settingsKey);
      if (!settings) {
        return {
          volume: 80,
          gameSpeed: 'normal',
          soundEnabled: true,
          particlesEnabled: true
        };
      }
      return JSON.parse(settings);
    } catch {
      return { volume: 80, gameSpeed: 'normal', soundEnabled: true, particlesEnabled: true };
    }
  }

  saveGameState(state) {
    try { localStorage.setItem(this.gameStateKey, JSON.stringify(state)); } catch { /* quota */ }
  }

  getGameState() {
    try {
      const state = localStorage.getItem(this.gameStateKey);
      return state ? JSON.parse(state) : null;
    } catch { return null; }
  }

  clearGameState() {
    try { localStorage.removeItem(this.gameStateKey); } catch { /* ignore */ }
  }

  load(key) {
    try {
      const data = localStorage.getItem(`cat-tetris-${key}`);
      return data ? JSON.parse(data) : null;
    } catch { return null; }
  }

  save(key, value) {
    try { localStorage.setItem(`cat-tetris-${key}`, JSON.stringify(value)); } catch { /* quota */ }
  }

  remove(key) {
    try { localStorage.removeItem(`cat-tetris-${key}`); } catch { /* ignore */ }
  }
}
