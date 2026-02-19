/**
 * GameModesService - Gerencia modos de jogo alternativos
 */

export const GAME_MODES = {
  CLASSIC: {
    id: 'classic',
    name: '🎮 Clássico',
    description: 'O Tetris tradicional',
    icon: '🎮',
    rules: {
      gameOver: true,
      timeLimit: false,
      lineGoal: false,
      speedIncrease: true
    }
  },
  SPRINT: {
    id: 'sprint',
    name: '🏃 Sprint 40',
    description: 'Limpe 40 linhas o mais rápido possível',
    icon: '🏃',
    rules: {
      gameOver: false,
      timeLimit: false,
      lineGoal: 40,
      speedIncrease: false,
      fixedLevel: 1
    }
  },
  ULTRA: {
    id: 'ultra',
    name: '⏱️ Ultra 3min',
    description: 'Máximo de pontos em 3 minutos',
    icon: '⏱️',
    rules: {
      gameOver: false,
      timeLimit: 180, // 3 minutes in seconds
      lineGoal: false,
      speedIncrease: true
    }
  },
  ZEN: {
    id: 'zen',
    name: '🌙 Zen',
    description: 'Jogue sem pressão, sem game over',
    icon: '🌙',
    rules: {
      gameOver: false,
      timeLimit: false,
      lineGoal: false,
      speedIncrease: false,
      fixedLevel: 1,
      relaxed: true
    }
  },
  SURVIVAL: {
    id: 'survival',
    name: '💀 Sobrevivência',
    description: 'Comece no nível 10, quanto tempo aguenta?',
    icon: '💀',
    rules: {
      gameOver: true,
      timeLimit: false,
      lineGoal: false,
      speedIncrease: true,
      startLevel: 10
    }
  }
};

export class GameModesService {
  constructor(gameRepository) {
    this.gameRepository = gameRepository;
    this.currentMode = GAME_MODES.CLASSIC;
    this.modeStats = this.loadModeStats();
  }

  loadModeStats() {
    const saved = this.gameRepository.load('gameModesStats');
    return saved || this.initializeStats();
  }

  initializeStats() {
    const stats = {};
    Object.keys(GAME_MODES).forEach(modeKey => {
      const mode = GAME_MODES[modeKey];
      stats[mode.id] = {
        gamesPlayed: 0,
        bestScore: 0,
        bestTime: mode.rules.timeLimit ? mode.rules.timeLimit : 0,
        bestLines: 0,
        totalGames: 0
      };
    });
    return stats;
  }

  save() {
    this.gameRepository.save('gameModesStats', this.modeStats);
  }

  // Get all modes
  getAllModes() {
    return Object.values(GAME_MODES);
  }

  // Get current mode
  getCurrentMode() {
    return this.currentMode;
  }

  // Set mode
  setMode(modeId) {
    const mode = Object.values(GAME_MODES).find(m => m.id === modeId);
    if (mode) {
      this.currentMode = mode;
      console.log(`🎮 Modo: ${mode.name}`);
      return true;
    }
    return false;
  }

  // Get mode stats
  getModeStats(modeId) {
    return this.modeStats[modeId] || null;
  }

  // Get all stats
  getAllStats() {
    return { ...this.modeStats };
  }

  // Update stats after game
  updateStats(modeId, gameData) {
    if (!this.modeStats[modeId]) return;

    const stats = this.modeStats[modeId];
    stats.gamesPlayed += 1;
    stats.totalGames += 1;

    // Update best score
    if (gameData.score > stats.bestScore) {
      stats.bestScore = gameData.score;
    }

    // Update best time (for sprint mode - lower is better)
    if (gameData.time && (stats.bestTime === 0 || gameData.time < stats.bestTime)) {
      stats.bestTime = gameData.time;
    }

    // Update best lines
    if (gameData.lines > stats.bestLines) {
      stats.bestLines = gameData.lines;
    }

    this.save();
  }

  // Check if mode goal is achieved
  checkGoal(mode, gameState) {
    if (!mode.rules) return false;

    // Line goal
    if (mode.rules.lineGoal) {
      return gameState.score.lines >= mode.rules.lineGoal;
    }

    // Time limit
    if (mode.rules.timeLimit) {
      // Time is handled externally
      return false;
    }

    return false;
  }

  // Get recommended order for beginners
  getRecommendedOrder() {
    return [
      GAME_MODES.CLASSIC,
      GAME_MODES.ZEN,
      GAME_MODES.SPRINT,
      GAME_MODES.ULTRA,
      GAME_MODES.SURVIVAL
    ];
  }

  reset() {
    this.modeStats = this.initializeStats();
    this.currentMode = GAME_MODES.CLASSIC;
    this.save();
  }
}
