import { HeuristicStrategy } from '../strategies/HeuristicStrategy.js';

export class AIPlayer {
  constructor(strategy = null) {
    this.strategy = strategy || new HeuristicStrategy();
    this.isActive = false;
    this.speed = 1;
    this.metrics = {
      gamesPlayed: 0,
      totalScore: 0,
      bestScore: 0,
      averageScore: 0,
      tSpinsExecuted: 0,
      tetrisExecuted: 0,
      linesCleared: 0,
      gameTime: 0
    };
    this.currentGame = null;
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  activate() {
    this.isActive = true;
  }

  deactivate() {
    this.isActive = false;
  }

  setSpeed(speed) {
    this.speed = Math.max(0.1, Math.min(1000, speed));
  }

  async makeMove(gameState) {
    if (!this.isActive || !this.strategy) {
      return null;
    }

    try {
      const { board, currentPiece, nextPieces } = gameState;
      
      if (!board || !currentPiece) {
        return null;
      }

      const startTime = performance.now();
      const bestMove = this.strategy.findBestMove(board, currentPiece, nextPieces);
      const calculationTime = performance.now() - startTime;

      if (bestMove) {
        return {
          action: 'place',
          x: bestMove.x,
          y: bestMove.y,
          rotation: bestMove.rotation,
          evaluation: bestMove.evaluation,
          calculationTime,
          confidence: this.calculateConfidence(bestMove)
        };
      }

      return null;
    } catch (error) {
      console.error('AI Move calculation error:', error);
      return null;
    }
  }

  calculateConfidence(move) {
    if (!move.evaluation) return 0;

    const { totalScore, height, holes, tSpinBonus } = move.evaluation;
    
    let confidence = 50;
    
    if (totalScore > 1000) confidence += 20;
    if (holes === 0) confidence += 15;
    if (height < 10) confidence += 10;
    if (tSpinBonus > 0) confidence += 25;
    
    return Math.min(100, Math.max(0, confidence));
  }

  startGame(gameState) {
    this.currentGame = {
      startTime: Date.now(),
      initialState: gameState,
      moves: [],
      score: 0
    };
  }

  endGame(finalScore, linesCleared, gameTime) {
    if (!this.currentGame) return;

    this.metrics.gamesPlayed++;
    this.metrics.totalScore += finalScore;
    this.metrics.linesCleared += linesCleared;
    this.metrics.gameTime += gameTime;
    
    if (finalScore > this.metrics.bestScore) {
      this.metrics.bestScore = finalScore;
    }
    
    this.metrics.averageScore = this.metrics.totalScore / this.metrics.gamesPlayed;
    
    this.currentGame = null;
  }

  recordMove(move, result) {
    if (!this.currentGame) return;

    this.currentGame.moves.push({
      move,
      result,
      timestamp: Date.now()
    });

    if (result.tSpin) {
      this.metrics.tSpinsExecuted++;
    }
    
    if (result.linesCleared === 4) {
      this.metrics.tetrisExecuted++;
    }
  }

  getMetrics() {
    return {
      ...this.metrics,
      tSpinRate: this.metrics.linesCleared > 0 ? 
        (this.metrics.tSpinsExecuted / this.metrics.linesCleared) * 100 : 0,
      tetrisRate: this.metrics.linesCleared > 0 ? 
        (this.metrics.tetrisExecuted / this.metrics.linesCleared) * 100 : 0,
      avgGameTime: this.metrics.gamesPlayed > 0 ? 
        this.metrics.gameTime / this.metrics.gamesPlayed : 0,
      linesPerMinute: this.metrics.gameTime > 0 ? 
        (this.metrics.linesCleared / (this.metrics.gameTime / 60000)) : 0
    };
  }

  getStrategyInfo() {
    return this.strategy ? this.strategy.getStrategyInfo() : null;
  }

  updateStrategy(config) {
    if (this.strategy && this.strategy.updateWeights) {
      this.strategy.updateWeights(config.weights);
    }
  }

  exportConfiguration() {
    return {
      strategyName: this.strategy.name,
      weights: this.strategy.analyzer?.weights || {},
      metrics: this.metrics,
      speed: this.speed
    };
  }

  importConfiguration(config) {
    if (config.weights && this.strategy.updateWeights) {
      this.strategy.updateWeights(config.weights);
    }
    
    if (config.speed) {
      this.setSpeed(config.speed);
    }
  }

  resetMetrics() {
    this.metrics = {
      gamesPlayed: 0,
      totalScore: 0,
      bestScore: 0,
      averageScore: 0,
      tSpinsExecuted: 0,
      tetrisExecuted: 0,
      linesCleared: 0,
      gameTime: 0
    };
  }

  simulateGames(gameEngine, numberOfGames = 10) {
    const results = [];
    
    for (let i = 0; i < numberOfGames; i++) {
      const result = this.simulateSingleGame(gameEngine);
      results.push(result);
    }
    
    return {
      games: results,
      averageScore: results.reduce((sum, game) => sum + game.score, 0) / results.length,
      bestScore: Math.max(...results.map(game => game.score)),
      averageLines: results.reduce((sum, game) => sum + game.lines, 0) / results.length,
      survivalRate: results.filter(game => game.lines > 100).length / results.length
    };
  }

  simulateSingleGame(gameEngine) {
    const startTime = Date.now();
    let score = 0;
    let lines = 0;
    let moves = 0;
    
    gameEngine.startNewGame();
    
    while (!gameEngine.isGameOver() && moves < 1000) {
      const gameState = gameEngine.getCurrentState();
      const aiMove = this.makeMove(gameState);
      
      if (aiMove) {
        const result = gameEngine.executeMove(aiMove);
        score = result.score;
        lines = result.linesCleared;
        moves++;
      } else {
        break;
      }
    }
    
    const gameTime = Date.now() - startTime;
    
    return {
      score,
      lines,
      moves,
      gameTime,
      linesPerMinute: (lines / (gameTime / 60000))
    };
  }

  toString() {
    return `AIPlayer(${this.strategy.name}, Active: ${this.isActive}, Speed: ${this.speed}x)`;
  }
} 