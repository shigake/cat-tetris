class ScoreService {
  constructor() {
    this.HIGH_SCORE_KEY = 'tetris_high_score';
  }

  getHighScore() {
    try {
      const stored = localStorage.getItem(this.HIGH_SCORE_KEY);
      return stored ? parseInt(stored, 10) : 0;
    } catch (error) {
      console.warn('Failed to get high score from localStorage:', error);
      return 0;
    }
  }

  saveHighScore(score) {
    try {
      const currentHighScore = this.getHighScore();
      if (score > currentHighScore) {
        localStorage.setItem(this.HIGH_SCORE_KEY, score.toString());
        return true;
      }
      return false;
    } catch (error) {
      console.warn('Failed to save high score to localStorage:', error);
      return false;
    }
  }

  clearHighScore() {
    try {
      localStorage.removeItem(this.HIGH_SCORE_KEY);
    } catch (error) {
      console.warn('Failed to clear high score from localStorage:', error);
    }
  }
}

export const scoreService = new ScoreService(); 