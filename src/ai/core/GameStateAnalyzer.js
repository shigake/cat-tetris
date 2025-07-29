export class GameStateAnalyzer {
  constructor() {
    this.weights = {
      linesCleared: 1000,
      tSpinBonus: 5000,
      backToBackBonus: 2000,
      heightPenalty: -500,
      holesPenalty: -1000,
      bumpinessPenalty: -200,
      wellDepthBonus: 300,
      comboBonus: 1500
    };
  }

  evaluateBoard(board) {
    const height = this.calculateHeight(board);
    const holes = this.countHoles(board);
    const bumpiness = this.calculateBumpiness(board);
    const wells = this.calculateWells(board);
    
    return {
      height,
      holes,
      bumpiness,
      wells,
      score: this.calculateScore(height, holes, bumpiness, wells)
    };
  }

  calculateHeight(board) {
    let maxHeight = 0;
    for (let x = 0; x < board[0].length; x++) {
      for (let y = 0; y < board.length; y++) {
        if (board[y][x] !== null) {
          maxHeight = Math.max(maxHeight, board.length - y);
          break;
        }
      }
    }
    return maxHeight;
  }

  countHoles(board) {
    let holes = 0;
    const width = board[0].length;
    const height = board.length;

    for (let x = 0; x < width; x++) {
      let blockFound = false;
      for (let y = 0; y < height; y++) {
        if (board[y][x] !== null) {
          blockFound = true;
        } else if (blockFound) {
          holes++;
        }
      }
    }
    return holes;
  }

  calculateBumpiness(board) {
    const heights = this.getColumnHeights(board);
    let bumpiness = 0;
    
    for (let i = 0; i < heights.length - 1; i++) {
      bumpiness += Math.abs(heights[i] - heights[i + 1]);
    }
    return bumpiness;
  }

  calculateWells(board) {
    const heights = this.getColumnHeights(board);
    let wells = 0;
    
    for (let i = 0; i < heights.length; i++) {
      const leftHeight = i > 0 ? heights[i - 1] : 0;
      const rightHeight = i < heights.length - 1 ? heights[i + 1] : 0;
      const currentHeight = heights[i];
      
      if (leftHeight > currentHeight && rightHeight > currentHeight) {
        wells += Math.min(leftHeight - currentHeight, rightHeight - currentHeight);
      }
    }
    return wells;
  }

  getColumnHeights(board) {
    const heights = [];
    const width = board[0].length;
    const height = board.length;

    for (let x = 0; x < width; x++) {
      let columnHeight = 0;
      for (let y = 0; y < height; y++) {
        if (board[y][x] !== null) {
          columnHeight = height - y;
          break;
        }
      }
      heights.push(columnHeight);
    }
    return heights;
  }

  calculateScore(height, holes, bumpiness, wells) {
    return (
      this.weights.heightPenalty * height +
      this.weights.holesPenalty * holes +
      this.weights.bumpinessPenalty * bumpiness +
      this.weights.wellDepthBonus * wells
    );
  }

  evaluateMove(board, piece, position, rotation) {
    const simulatedBoard = this.simulateMove(board, piece, position, rotation);
    if (!simulatedBoard) return null;

    const evaluation = this.evaluateBoard(simulatedBoard.board);
    evaluation.linesCleared = simulatedBoard.linesCleared;
    evaluation.totalScore = evaluation.score + (evaluation.linesCleared * this.weights.linesCleared);
    
    return evaluation;
  }

  simulateMove(board, piece, position, rotation) {
    try {
      const boardCopy = board.map(row => [...row]);
      const rotatedPiece = this.rotatePiece(piece, rotation);
      
      const finalY = this.dropPiece(boardCopy, rotatedPiece, position);
      if (finalY === null) return null;

      this.placePiece(boardCopy, rotatedPiece, position, finalY);
      const linesCleared = this.clearLines(boardCopy);

      return {
        board: boardCopy,
        linesCleared
      };
    } catch (error) {
      return null;
    }
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

  dropPiece(board, piece, x) {
    for (let y = 0; y <= board.length; y++) {
      if (!this.canPlacePiece(board, piece, x, y)) {
        return y - 1;
      }
    }
    return board.length - piece.shape.length;
  }

  canPlacePiece(board, piece, x, y) {
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

  placePiece(board, piece, x, y) {
    for (let py = 0; py < piece.shape.length; py++) {
      for (let px = 0; px < piece.shape[py].length; px++) {
        if (piece.shape[py][px]) {
          const boardX = x + px;
          const boardY = y + py;
          if (boardY >= 0) {
            board[boardY][boardX] = piece.type;
          }
        }
      }
    }
  }

  clearLines(board) {
    let linesCleared = 0;
    for (let y = board.length - 1; y >= 0; y--) {
      if (board[y].every(cell => cell !== null)) {
        board.splice(y, 1);
        board.unshift(new Array(board[0].length).fill(null));
        linesCleared++;
        y++;
      }
    }
    return linesCleared;
  }
} 