export class PlayerStatsService {
  constructor(gameRepository) {
    this.gameRepository = gameRepository;
    this.stats = this.loadStats();
  }

  loadStats() {
    const saved = this.gameRepository.load('playerStats');
    return saved || {

      gamesPlayed: 0,
      linesCleared: 0,
      piecesPlaced: 0,
      tSpins: 0,
      backToBack: 0,
      totalPlayTime: 0,

      highScore: 0,
      maxLevel: 0,
      maxCombo: 0,
      longestGame: 0,
      mostLinesInGame: 0,

      lastUpdated: new Date().toISOString(),

      lastPlayedDate: null,
      currentStreak: 0,
      longestStreak: 0
    };
  }

  save() {
    this.stats.lastUpdated = new Date().toISOString();
    this.gameRepository.save('playerStats', this.stats);
  }

  getStats() {
    return { ...this.stats };
  }

  updateAfterGame(gameData) {
    this.stats.gamesPlayed += 1;
    this.stats.linesCleared += gameData.linesCleared || 0;
    this.stats.piecesPlaced += gameData.piecesPlaced || 0;
    this.stats.tSpins += gameData.tSpins || 0;
    this.stats.backToBack += gameData.backToBack || 0;
    this.stats.totalPlayTime += gameData.playTime || 0;

    if (gameData.score > this.stats.highScore) {
      this.stats.highScore = gameData.score;
    }
    if (gameData.level > this.stats.maxLevel) {
      this.stats.maxLevel = gameData.level;
    }
    if (gameData.maxCombo > this.stats.maxCombo) {
      this.stats.maxCombo = gameData.maxCombo;
    }
    if (gameData.playTime > this.stats.longestGame) {
      this.stats.longestGame = gameData.playTime;
    }
    if (gameData.linesCleared > this.stats.mostLinesInGame) {
      this.stats.mostLinesInGame = gameData.linesCleared;
    }

    this.updateStreak();

    this.save();
  }

  updateStreak() {
    const today = new Date().toDateString();
    const lastPlayed = this.stats.lastPlayedDate;

    if (lastPlayed === today) {

      return;
    }

    if (!lastPlayed) {

      this.stats.currentStreak = 1;
      this.stats.longestStreak = 1;
    } else {
      const lastDate = new Date(lastPlayed);
      const todayDate = new Date(today);
      const daysDiff = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));

      if (daysDiff === 1) {

        this.stats.currentStreak += 1;
        if (this.stats.currentStreak > this.stats.longestStreak) {
          this.stats.longestStreak = this.stats.currentStreak;
        }
      } else {

        this.stats.currentStreak = 1;
      }
    }

    this.stats.lastPlayedDate = today;
  }

  incrementStat(statName, amount = 1) {
    if (this.stats.hasOwnProperty(statName)) {
      this.stats[statName] += amount;
      this.save();
    }
  }

  updateRecord(recordName, value) {
    if (this.stats.hasOwnProperty(recordName)) {
      if (value > this.stats[recordName]) {
        this.stats[recordName] = value;
        this.save();
        return true;
      }
    }
    return false;
  }

  reset() {
    this.stats = {
      gamesPlayed: 0,
      linesCleared: 0,
      piecesPlaced: 0,
      tSpins: 0,
      backToBack: 0,
      totalPlayTime: 0,
      highScore: 0,
      maxLevel: 0,
      maxCombo: 0,
      longestGame: 0,
      mostLinesInGame: 0,
      lastUpdated: new Date().toISOString(),
      lastPlayedDate: null,
      currentStreak: 0,
      longestStreak: 0
    };
    this.save();
  }
}

