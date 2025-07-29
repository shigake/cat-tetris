export class Score {
  constructor() {
    this.points = 0;
    this.level = 1;
    this.lines = 0;
    this.combo = 0;
    this.tSpins = 0;
    this.backToBack = 0;
    this.tetrisCount = 0;
  }

  addPoints(points) {
    this.points += points;
  }

  addLines(lines) {
    this.lines += lines;
    this.updateLevel();
  }

  incrementCombo() {
    this.combo++;
  }

  resetCombo() {
    this.combo = 0;
  }

  addTSpin() {
    this.tSpins++;
  }

  addBackToBack() {
    this.backToBack++;
  }

  addTetris() {
    this.tetrisCount++;
  }

  updateLevel() {
    this.level = Math.min(15, Math.floor(this.lines / 10) + 1);
  }

  getLevel() {
    return this.level;
  }

  getDropTime() {
    const dropTimes = [
      1000, 850, 700, 600, 500, 400, 350, 300, 250, 200,
      150, 100, 80, 60, 50
    ];
    return dropTimes[this.level - 1] || 50;
  }

  reset() {
    this.points = 0;
    this.level = 1;
    this.lines = 0;
    this.combo = 0;
    this.tSpins = 0;
    this.backToBack = 0;
    this.tetrisCount = 0;
  }

  clone() {
    const score = new Score();
    score.points = this.points;
    score.level = this.level;
    score.lines = this.lines;
    score.combo = this.combo;
    score.tSpins = this.tSpins;
    score.backToBack = this.backToBack;
    score.tetrisCount = this.tetrisCount;
    return score;
  }

  toJSON() {
    return {
      points: this.points,
      level: this.level,
      lines: this.lines,
      combo: this.combo,
      tSpins: this.tSpins,
      backToBack: this.backToBack,
      tetrisCount: this.tetrisCount
    };
  }
} 