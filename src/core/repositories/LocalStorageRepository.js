import { IGameRepository } from './IGameRepository.js';

export class LocalStorageRepository extends IGameRepository {
  constructor() {
    super();
    this.highScoreKey = 'cat-tetris-high-score';
    this.settingsKey = 'cat-tetris-settings';
    this.gameStateKey = 'cat-tetris-game-state';
  }

  saveHighScore(score) {
    localStorage.setItem(this.highScoreKey, score.toString());
  }

  getHighScore() {
    return parseInt(localStorage.getItem(this.highScoreKey) || '0');
  }

  saveSettings(settings) {
    localStorage.setItem(this.settingsKey, JSON.stringify(settings));
  }

  getSettings() {
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
  }

  saveGameState(state) {
    localStorage.setItem(this.gameStateKey, JSON.stringify(state));
  }

  getGameState() {
    const state = localStorage.getItem(this.gameStateKey);
    return state ? JSON.parse(state) : null;
  }

  clearGameState() {
    localStorage.removeItem(this.gameStateKey);
  }

  // Generic load/save methods for new services
  load(key) {
    const data = localStorage.getItem(`cat-tetris-${key}`);
    return data ? JSON.parse(data) : null;
  }

  save(key, value) {
    localStorage.setItem(`cat-tetris-${key}`, JSON.stringify(value));
  }

  remove(key) {
    localStorage.removeItem(`cat-tetris-${key}`);
  }
} 