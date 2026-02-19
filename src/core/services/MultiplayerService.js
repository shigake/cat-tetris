/**
 * MultiplayerService - Gerencia modos multiplayer
 */

export class MultiplayerService {
  constructor(gameRepository) {
    this.gameRepository = gameRepository;
    this.currentMode = null;
    this.players = [];
    this.matchState = null;
  }

  // Inicia modo 1v1 local
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

  // Inicia modo vs IA
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
      mode: this.currentMode,
      players: this.players,
      matchId: `ai_${Date.now()}`
    };
  }

  // Atualiza estado de um jogador
  updatePlayerState(playerId, gameState) {
    const player = this.players.find(p => p.id === playerId);
    if (!player) return;
    
    player.gameState = gameState;
    player.score = gameState.score?.points || 0;
    player.level = gameState.score?.level || 1;
    player.lines = gameState.linesCleared || 0;
    player.alive = !gameState.gameOver;
    
    // Verifica vitória
    this.checkWinCondition();
  }

  // Verifica condição de vitória
  checkWinCondition() {
    const alivePlayers = this.players.filter(p => p.alive);
    
    if (alivePlayers.length === 1) {
      this.matchState.status = 'finished';
      this.matchState.winner = alivePlayers[0];
      this.matchState.endTime = Date.now();
      this.matchState.duration = this.matchState.endTime - this.matchState.startTime;
      
      // Salva estatística
      this.saveMatchResult();
      
      return {
        hasWinner: true,
        winner: this.matchState.winner
      };
    }
    
    return { hasWinner: false };
  }

  // Salva resultado da partida
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

  // Obtém estatísticas multiplayer
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

  // Obtém estado atual da partida
  getMatchState() {
    return {
      ...this.matchState,
      players: this.players,
      mode: this.currentMode
    };
  }

  // Encerra partida
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

  // Helpers
  getAIName(difficulty) {
    const names = {
      easy: 'MeowBot Iniciante',
      medium: 'CatAI Intermediário',
      hard: 'FelineBot Avançado',
      expert: 'NyanMaster Expert'
    };
    return names[difficulty] || 'IA';
  }

  // Modos disponíveis
  getAvailableModes() {
    return [
      {
        id: '1v1-local',
        name: '1v1 Local',
        emoji: '🎮',
        description: 'Dois jogadores, mesma tela',
        players: 2,
        type: 'local'
      },
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
        id: '1v1-online',
        name: '1v1 Online',
        emoji: '🌐',
        description: 'Em breve!',
        players: 2,
        type: 'online',
        disabled: true
      },
      {
        id: 'battle-royale',
        name: 'Battle Royale',
        emoji: '💀',
        description: 'Em breve!',
        players: 100,
        type: 'online',
        disabled: true
      }
    ];
  }
}
