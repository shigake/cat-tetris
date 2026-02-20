export class MultiplayerService {
  constructor(gameRepository) {
    this.gameRepository = gameRepository;
    this.currentMode = null;
    this.players = [];
    this.matchState = null;
  }

  startLocalMatch(player1Name = 'Jogador 1', player2Name = 'Jogador 2') {
    this.currentMode = '1v1-local';
    this.players = [
      {
        id: 'p1',
        name: player1Name,
        score: 0,
        level: 1,
        lines: 0,
        gameState: null,
        alive: true
      },
      {
        id: 'p2',
        name: player2Name,
        score: 0,
        level: 1,
        lines: 0,
        gameState: null,
        alive: true
      }
    ];

    this.matchState = {
      startTime: Date.now(),
      status: 'playing',
      winner: null
    };

    return {
      mode: this.currentMode,
      players: this.players,
      matchId: `local_${Date.now()}`
    };
  }

  startAIMatch(playerName = 'Jogador', aiDifficulty = 'medium') {
    this.currentMode = 'vs-ai';
    this.players = [
      {
        id: 'p1',
        name: playerName,
        score: 0,
        level: 1,
        lines: 0,
        gameState: null,
        alive: true,
        isHuman: true
      },
      {
        id: 'ai',
        name: this.getAIName(aiDifficulty),
        score: 0,
        level: 1,
        lines: 0,
        gameState: null,
        alive: true,
        isAI: true,
        difficulty: aiDifficulty
      }
    ];

    this.matchState = {
      startTime: Date.now(),
      status: 'playing',
      winner: null,
      aiDifficulty
    };

    return {
      mode: 'vsAI',
      aiDifficulty,
      players: this.players,
      matchId: `ai_${Date.now()}`
    };
  }

  updatePlayerState(playerId, gameState) {
    const player = this.players.find(p => p.id === playerId);
    if (!player) return;

    player.gameState = gameState;
    player.score = gameState.score?.points || 0;
    player.level = gameState.score?.level || 1;
    player.lines = gameState.linesCleared || 0;
    player.alive = !gameState.gameOver;

    this.checkWinCondition();
  }

  checkWinCondition() {
    const alivePlayers = this.players.filter(p => p.alive);

    if (alivePlayers.length === 1) {
      this.matchState.status = 'finished';
      this.matchState.winner = alivePlayers[0];
      this.matchState.endTime = Date.now();
      this.matchState.duration = this.matchState.endTime - this.matchState.startTime;

      this.saveMatchResult();

      return {
        hasWinner: true,
        winner: this.matchState.winner
      };
    }

    return { hasWinner: false };
  }

  saveMatchResult() {
    const stats = this.gameRepository.load('multiplayerStats') || {
      localMatches: 0,
      aiMatches: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      totalTime: 0
    };

    if (this.currentMode === '1v1-local') {
      stats.localMatches++;
    } else if (this.currentMode === 'vs-ai') {
      stats.aiMatches++;
      if (this.matchState.winner.isHuman) {
        stats.wins++;
      } else if (this.matchState.winner.isAI) {
        stats.losses++;
      }
    }

    stats.totalTime += this.matchState.duration;

    this.gameRepository.save('multiplayerStats', stats);
  }

  getStats() {
    const stats = this.gameRepository.load('multiplayerStats') || {
      localMatches: 0,
      aiMatches: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      totalTime: 0
    };

    return {
      ...stats,
      winRate: stats.aiMatches > 0
        ? ((stats.wins / stats.aiMatches) * 100).toFixed(1)
        : 0,
      avgMatchTime: stats.localMatches + stats.aiMatches > 0
        ? Math.floor(stats.totalTime / (stats.localMatches + stats.aiMatches) / 1000)
        : 0
    };
  }

  getMatchState() {
    return {
      ...this.matchState,
      players: this.players,
      mode: this.currentMode
    };
  }

  endMatch() {
    const result = {
      mode: this.currentMode,
      players: this.players,
      winner: this.matchState.winner,
      duration: Date.now() - this.matchState.startTime
    };

    this.currentMode = null;
    this.players = [];
    this.matchState = null;

    return result;
  }

  startAIvsAIMatch(ai1Difficulty = 'expert', ai2Difficulty = 'expert') {
    this.currentMode = 'ai-vs-ai';
    this.players = [
      {
        id: 'ai1',
        name: this.getAIName(ai1Difficulty),
        score: 0,
        level: 1,
        lines: 0,
        gameState: null,
        alive: true,
        isAI: true,
        difficulty: ai1Difficulty
      },
      {
        id: 'ai2',
        name: this.getAIName(ai2Difficulty),
        score: 0,
        level: 1,
        lines: 0,
        gameState: null,
        alive: true,
        isAI: true,
        difficulty: ai2Difficulty
      }
    ];

    this.matchState = {
      startTime: Date.now(),
      status: 'playing',
      winner: null,
      ai1Difficulty,
      ai2Difficulty
    };

    return {
      mode: 'aiVsAI',
      ai1Difficulty,
      ai2Difficulty,
      players: this.players,
      matchId: `aivai_${Date.now()}`
    };
  }

  getAIName(difficulty) {
    const names = {
      easy: '🐱 MeowBot Iniciante',
      medium: '😺 CatAI Intermediário',
      hard: '😸 FelineBot Avançado',
      expert: '🧠 NyanMaster Survival'
    };
    return names[difficulty] || 'IA';
  }

  getAvailableModes() {
    return [
      {
        id: 'vs-ai',
        name: 'vs IA',
        emoji: '🤖',
        description: 'Enfrente o bot',
        players: 1,
        type: 'ai',
        difficulties: ['easy', 'medium', 'hard', 'expert']
      },
      {
        id: 'ai-vs-ai',
        name: 'IA vs IA',
        emoji: '🔬',
        description: 'Assista duas IAs se enfrentando (debug)',
        players: 0,
        type: 'debug'
      }
    ];
  }
}

