import { IStatisticsService } from '../../interfaces/IStatisticsService.js';

export class StatisticsService extends IStatisticsService {
  constructor() {
    this.stats = {
      playTime: 0,
      piecesPlaced: 0,
      linesCleared: 0,
      tSpins: 0,
      backToBack: 0,
      maxCombo: 0,
      tetrisCount: 0,
      linesPerSecond: 0
    };
    this.sessionStartTime = Date.now();
  }

  getStats() {
    return { ...this.stats };
  }

  incrementPlayTime() {
    this.stats.playTime += 1;
    this.calculateLinesPerSecond();
  }

  incrementPiecesPlaced() {
    this.stats.piecesPlaced += 1;
  }

  addLinesCleared(lines) {
    this.stats.linesCleared += lines;
    if (lines === 4) {
      this.stats.tetrisCount += 1;
    }
    this.calculateLinesPerSecond();
  }

  incrementTSpins() {
    this.stats.tSpins += 1;
  }

  incrementBackToBack() {
    this.stats.backToBack += 1;
  }

  updateMaxCombo(combo) {
    if (combo > this.stats.maxCombo) {
      this.stats.maxCombo = combo;
    }
  }

  calculateLinesPerSecond() {
    if (this.stats.playTime > 0) {
      this.stats.linesPerSecond = (this.stats.linesCleared / this.stats.playTime).toFixed(2);
    } else {
      this.stats.linesPerSecond = 0;
    }
  }

  reset() {
    this.stats = {
      playTime: 0,
      piecesPlaced: 0,
      linesCleared: 0,
      tSpins: 0,
      backToBack: 0,
      maxCombo: 0,
      tetrisCount: 0,
      linesPerSecond: 0
    };
    this.sessionStartTime = Date.now();
  }

  getSessionDuration() {
    return Date.now() - this.sessionStartTime;
  }
} 