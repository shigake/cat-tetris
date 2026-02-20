const MOCK_PLAYERS = [
  { id: 'bot1', name: 'MeowMaster', score: 250000, level: 18, lines: 120, country: 'BR' },
  { id: 'bot2', name: 'NyanCat', score: 180000, level: 15, lines: 95, country: 'US' },
  { id: 'bot3', name: 'FelixPro', score: 150000, level: 14, lines: 85, country: 'JP' },
  { id: 'bot4', name: 'WhiskerKing', score: 120000, level: 12, lines: 75, country: 'KR' },
  { id: 'bot5', name: 'PawsGaming', score: 100000, level: 11, lines: 68, country: 'FR' },
  { id: 'bot6', name: 'CatNinja', score: 85000, level: 10, lines: 60, country: 'DE' },
  { id: 'bot7', name: 'TigerClaw', score: 70000, level: 9, lines: 55, country: 'BR' },
  { id: 'bot8', name: 'LionHeart', score: 65000, level: 8, lines: 50, country: 'UK' },
  { id: 'bot9', name: 'CheetahSpeed', score: 55000, level: 8, lines: 45, country: 'ES' },
  { id: 'bot10', name: 'PantherShadow', score: 50000, level: 7, lines: 42, country: 'IT' },
  { id: 'bot11', name: 'JaguarForce', score: 45000, level: 7, lines: 40, country: 'MX' },
  { id: 'bot12', name: 'LynxSwift', score: 40000, level: 6, lines: 38, country: 'CA' },
  { id: 'bot13', name: 'OcelotPro', score: 35000, level: 6, lines: 35, country: 'AR' },
  { id: 'bot14', name: 'BobcatGamer', score: 30000, level: 5, lines: 32, country: 'AU' },
  { id: 'bot15', name: 'CougarRush', score: 28000, level: 5, lines: 30, country: 'NZ' }
];

export class LeaderboardService {
  constructor(gameRepository, playerStatsService) {
    this.gameRepository = gameRepository;
    this.playerStatsService = playerStatsService;
    this.playerName = this.loadPlayerName();
    this.playerId = this.loadPlayerId();
  }

  loadPlayerName() {
    const saved = this.gameRepository.load('playerProfile');
    return saved?.name || 'Jogador';
  }

  loadPlayerId() {
    let saved = this.gameRepository.load('playerProfile');
    if (!saved || !saved.id) {

      saved = {
        ...saved,
        id: `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
      this.gameRepository.save('playerProfile', saved);
    }
    return saved.id;
  }

  setPlayerName(name) {
    const profile = this.gameRepository.load('playerProfile') || {};
    profile.name = name;
    profile.id = this.playerId;
    this.gameRepository.save('playerProfile', profile);
    this.playerName = name;
  }

  getPlayerName() {
    return this.playerName;
  }

  getGlobalLeaderboard(limit = 100) {

    const stats = this.playerStatsService.getStats();

    const playerEntry = {
      id: this.playerId,
      name: this.playerName,
      score: stats.highScore,
      level: stats.maxLevel,
      lines: stats.linesCleared,
      country: 'BR',
      isPlayer: true
    };

    const allPlayers = [...MOCK_PLAYERS, playerEntry];
    allPlayers.sort((a, b) => b.score - a.score);

    return allPlayers.slice(0, limit);
  }

  getWeeklyLeaderboard(limit = 50) {

    return this.getGlobalLeaderboard(limit);
  }

  getCountryLeaderboard(country = 'BR', limit = 50) {
    const global = this.getGlobalLeaderboard(200);
    return global.filter(p => p.country === country).slice(0, limit);
  }

  getPlayerRank() {
    const leaderboard = this.getGlobalLeaderboard(1000);
    const playerIndex = leaderboard.findIndex(p => p.id === this.playerId);

    if (playerIndex === -1) {
      return {
        rank: leaderboard.length + 1,
        total: leaderboard.length,
        percentile: 0
      };
    }

    return {
      rank: playerIndex + 1,
      total: leaderboard.length,
      percentile: Math.floor(((leaderboard.length - playerIndex) / leaderboard.length) * 100)
    };
  }

  getAroundPlayer(range = 5) {
    const leaderboard = this.getGlobalLeaderboard(1000);
    const playerIndex = leaderboard.findIndex(p => p.id === this.playerId);

    if (playerIndex === -1) return [];

    const start = Math.max(0, playerIndex - range);
    const end = Math.min(leaderboard.length, playerIndex + range + 1);

    return leaderboard.slice(start, end);
  }

  submitScore(scoreData) {

    return Promise.resolve({ success: true });
  }

  getModeLeaderboard(modeId, limit = 50) {

    return this.getGlobalLeaderboard(limit);
  }

  getFriendsLeaderboard() {

    return MOCK_PLAYERS.slice(0, 5);
  }

  getLeaderboardStats() {
    const rank = this.getPlayerRank();
    const stats = this.playerStatsService.getStats();

    return {
      playerName: this.playerName,
      rank: rank.rank,
      total: rank.total,
      percentile: rank.percentile,
      score: stats.highScore,
      level: stats.maxLevel,
      lines: stats.linesCleared
    };
  }
}

