import { GameStateAnalyzer } from '../core/GameStateAnalyzer.js';
import { TSpinDetector } from '../algorithms/TSpinDetector.js';

export class HeuristicStrategy {
  constructor() {
    this.analyzer = new GameStateAnalyzer();
    this.tSpinDetector = new TSpinDetector();
    this.name = 'Heuristic AI';
    this.description = 'Mathematical rule-based strategy';
  }

  findBestMove(board, piece, nextPieces = []) {
    const possibleMoves = this.generatePossibleMoves(board, piece);
    
    if (possibleMoves.length === 0) {
      return null;
    }

    let bestMove = null;
    let bestScore = -Infinity;

    for (const move of possibleMoves) {
      const evaluation = this.evaluateMove(board, piece, move, nextPieces);
      
      if (evaluation && evaluation.totalScore > bestScore) {
        bestScore = evaluation.totalScore;
        bestMove = {
          ...move,
          evaluation,
          expectedScore: evaluation.totalScore
        };
      }
    }

    return bestMove;
  }

  generatePossibleMoves(board, piece) {
    const moves = [];
    const width = board[0].length;
    const rotations = this.getPossibleRotations(piece);

    for (let rotation = 0; rotation < rotations; rotation++) {
      const rotatedPiece = this.rotatePiece(piece, rotation);
      
      for (let x = 0; x < width; x++) {
        if (this.canPlacePiece(board, rotatedPiece, x)) {
          const finalY = this.dropToBottom(board, rotatedPiece, x);
          moves.push({
            x,
            y: finalY,
            rotation,
            piece: rotatedPiece
          });
        }
      }
    }

    return moves;
  }

  evaluateMove(board, piece, move, nextPieces) {
    const evaluation = this.analyzer.evaluateMove(board, piece, move.x, move.rotation);
    if (!evaluation) return null;

    const tSpinBonus = this.evaluateTSpinBonus(board, piece, move);
    const tetrisBonus = this.evaluateTetrisBonus(evaluation.linesCleared);
    const heightBonus = this.evaluateHeightBonus(board, move);
    const comboBonus = this.evaluateComboBonus(evaluation.linesCleared);
    const futureBonus = this.evaluateFuturePotential(board, move, nextPieces);

    evaluation.tSpinBonus = tSpinBonus;
    evaluation.tetrisBonus = tetrisBonus;
    evaluation.heightBonus = heightBonus;
    evaluation.comboBonus = comboBonus;
    evaluation.futureBonus = futureBonus;

    evaluation.totalScore = (
      evaluation.score +
      (evaluation.linesCleared * this.analyzer.weights.linesCleared) +
      tSpinBonus +
      tetrisBonus +
      heightBonus +
      comboBonus +
      futureBonus
    );

    return evaluation;
  }

  evaluateTSpinBonus(board, piece, move) {
    if (piece.type !== 'T') return 0;

    const isTSpin = this.tSpinDetector.isTSpinMove(board, piece, { x: move.x, y: move.y }, move.rotation);
    if (!isTSpin) return 0;

    const simulatedBoard = this.analyzer.simulateMove(board, piece, move.x, move.rotation);
    if (!simulatedBoard) return 0;

    return this.tSpinDetector.calculateTSpinScore(simulatedBoard.linesCleared);
  }

  evaluateTetrisBonus(linesCleared) {
    if (linesCleared === 4) {
      return 3000;
    }
    return 0;
  }

  evaluateHeightBonus(board, move) {
    const heights = this.analyzer.getColumnHeights(board);
    const maxHeight = Math.max(...heights);
    
    if (maxHeight > 15) {
      return -2000;
    } else if (maxHeight > 10) {
      return -1000;
    } else if (maxHeight < 5) {
      return 500;
    }
    return 0;
  }

  evaluateComboBonus(linesCleared) {
    if (linesCleared > 1) {
      return linesCleared * 500;
    }
    return 0;
  }

  evaluateFuturePotential(board, move, nextPieces) {
    if (nextPieces.length === 0) return 0;

    const simulatedBoard = this.analyzer.simulateMove(board, move.piece, move.x, move.rotation);
    if (!simulatedBoard) return 0;

    let futurePotential = 0;
    const nextPiece = nextPieces[0];
    
    if (nextPiece) {
      const nextMoves = this.generatePossibleMoves(simulatedBoard.board, nextPiece);
      if (nextMoves.length > 0) {
        const bestNextMove = this.findBestMove(simulatedBoard.board, nextPiece, nextPieces.slice(1));
        if (bestNextMove) {
          futurePotential = bestNextMove.expectedScore * 0.3;
        }
      }
    }

    return futurePotential;
  }

  getPossibleRotations(piece) {
    if (piece.type === 'O') return 1;
    if (piece.type === 'I' || piece.type === 'S' || piece.type === 'Z') return 2;
    return 4;
  }

  rotatePiece(piece, rotations) {
    let rotated = piece.shape;
    for (let i = 0; i < rotations; i++) {
      rotated = rotated[0].map((_, index) => 
        rotated.map(row => row[index]).reverse()
      );
    }
    return { ...piece, shape: rotated };
  }

  canPlacePiece(board, piece, x) {
    for (let py = 0; py < piece.shape.length; py++) {
      for (let px = 0; px < piece.shape[py].length; px++) {
        if (piece.shape[py][px]) {
          const boardX = x + px;
          const boardY = py;

          if (boardX < 0 || boardX >= board[0].length) {
            return false;
          }

          if (boardY < board.length && board[boardY][boardX] !== null) {
            return false;
          }
        }
      }
    }
    return true;
  }

  dropToBottom(board, piece, x) {
    for (let y = 0; y <= board.length; y++) {
      if (!this.canPlacePieceAt(board, piece, x, y)) {
        return y - 1;
      }
    }
    return board.length - piece.shape.length;
  }

  canPlacePieceAt(board, piece, x, y) {
    for (let py = 0; py < piece.shape.length; py++) {
      for (let px = 0; px < piece.shape[py].length; px++) {
        if (piece.shape[py][px]) {
          const boardX = x + px;
          const boardY = y + py;

          if (boardX < 0 || boardX >= board[0].length || 
              boardY >= board.length || 
              (boardY >= 0 && board[boardY][boardX] !== null)) {
            return false;
          }
        }
      }
    }
    return true;
  }

  getStrategyInfo() {
    return {
      name: this.name,
      description: this.description,
      weights: this.analyzer.weights,
      features: [
        'T-Spin Detection',
        'Tetris Bonus',
        'Height Management', 
        'Hole Avoidance',
        'Future Planning',
        'Combo Recognition'
      ]
    };
  }

  updateWeights(newWeights) {
    this.analyzer.weights = { ...this.analyzer.weights, ...newWeights };
  }

  getPerformanceMetrics() {
    return {
      avgScore: 0,
      gamesPlayed: 0,
      tSpinRate: 0,
      survivalRate: 0,
      linesPerMinute: 0
    };
  }
} 