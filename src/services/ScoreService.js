export class ScoreService {
  constructor() {
    this.highScoreKey = 'catTetrisHighScore';
  }

  calculateScore(linesCleared, level, combo = 0) {
    const basePoints = [0, 100, 300, 500, 800];
    const points = basePoints[linesCleared] || 0;
    const levelMultiplier = level;
    const comboBonus = combo * 50;
    
    return (points * levelMultiplier) + comboBonus;
  }

  getHighScore() {
    try {
      const saved = localStorage.getItem('cat-tetris-high-score');
      return saved ? parseInt(saved) : 0;
    } catch (error) {
      return 0;
    }
  }

  saveHighScore(score) {
    try {
      const currentHigh = this.getHighScore();
      if (score > currentHigh) {
        localStorage.setItem('cat-tetris-high-score', score.toString());
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  isNewRecord(score) {
    return score > this.getHighScore();
  }

  getLevel(score) {
    return Math.floor(score / 1000) + 1;
  }

  getDropTime(level) {
    return Math.max(50, 1000 - (level - 1) * 100);
  }
}

export const scoreService = new ScoreService(); 