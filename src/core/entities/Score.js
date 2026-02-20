export class Score {
  constructor() {
    this.points = 0;
    this.level = 1;
    this.lines = 0;
    this.combo = 0;
    this.tSpins = 0;
    this.backToBack = 0;
    this.tetrisCount = 0;
    this._fixedLevel = null; // For Zen/Sprint modes
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
    if (this._fixedLevel) return; // Don't update level in fixed-level modes
    this.level = Math.min(15, Math.floor(this.lines / 10) + 1);
  }

  getLevel() {
    return this.level;
  }

  getDropTime() {
    const effectiveLevel = this._fixedLevel || this.level;
    // Official Tetris Guideline gravity: frames per cell at 60fps -> ms
    // Level 1=1000, 2=793, 3=618, 4=473, 5=355, 6=262, 7=190,
    // 8=135, 9=94, 10=64, 11=43, 12=28, 13=18, 14=11, 15=7
    const dropTimes = [
      1000, 793, 618, 473, 355, 262, 190, 135, 94, 64,
      43, 28, 18, 11, 7
    ];
    return dropTimes[Math.min(effectiveLevel, 15) - 1] || 7;
  }

  reset() {
    this.points = 0;
    this.level = 1;
    this.lines = 0;
    this.combo = 0;
    this.tSpins = 0;
    this.backToBack = 0;
    this.tetrisCount = 0;
    this._fixedLevel = null;
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