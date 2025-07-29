export class TSpinDetector {
  constructor() {
    this.tSpinPatterns = this.initializeTSpinPatterns();
  }

  initializeTSpinPatterns() {
    return {
      TSD: [
        {
          name: "TSD_LEFT",
          pattern: [
            [1, 1, 0],
            [1, 0, 0],
            [1, 1, 1]
          ],
          tPosition: { x: 1, y: 1 },
          expectedLines: 2
        },
        {
          name: "TSD_RIGHT", 
          pattern: [
            [0, 1, 1],
            [0, 0, 1],
            [1, 1, 1]
          ],
          tPosition: { x: 1, y: 1 },
          expectedLines: 2
        }
      ],
      
      TST: [
        {
          name: "TST_LEFT",
          pattern: [
            [1, 1, 0],
            [1, 0, 0], 
            [1, 0, 0],
            [1, 1, 1]
          ],
          tPosition: { x: 1, y: 2 },
          expectedLines: 3
        },
        {
          name: "TST_RIGHT",
          pattern: [
            [0, 1, 1],
            [0, 0, 1],
            [0, 0, 1], 
            [1, 1, 1]
          ],
          tPosition: { x: 1, y: 2 },
          expectedLines: 3
        }
      ]
    };
  }

  detectTSpinOpportunities(board, piece) {
    if (piece.type !== 'T') return [];

    const opportunities = [];
    const width = board[0].length;
    const height = board.length;

    for (let x = 0; x < width - 2; x++) {
      for (let y = 0; y < height - 3; y++) {
        const tsdOpportunity = this.checkTSpinDouble(board, x, y);
        if (tsdOpportunity) {
          opportunities.push({
            type: 'TSD',
            position: { x, y },
            expectedScore: 1200,
            priority: 9,
            ...tsdOpportunity
          });
        }

        const tstOpportunity = this.checkTSpinTriple(board, x, y);
        if (tstOpportunity) {
          opportunities.push({
            type: 'TST',
            position: { x, y },
            expectedScore: 1600,
            priority: 10,
            ...tstOpportunity
          });
        }
      }
    }

    return opportunities.sort((a, b) => b.priority - a.priority);
  }

  checkTSpinDouble(board, startX, startY) {
    for (const pattern of this.tSpinPatterns.TSD) {
      const match = this.matchPattern(board, startX, startY, pattern.pattern);
      if (match) {
        return {
          pattern: pattern.name,
          tPosition: {
            x: startX + pattern.tPosition.x,
            y: startY + pattern.tPosition.y
          },
          rotation: this.calculateRequiredRotation(pattern.name),
          setup: pattern.pattern
        };
      }
    }
    return null;
  }

  checkTSpinTriple(board, startX, startY) {
    for (const pattern of this.tSpinPatterns.TST) {
      const match = this.matchPattern(board, startX, startY, pattern.pattern);
      if (match) {
        return {
          pattern: pattern.name,
          tPosition: {
            x: startX + pattern.tPosition.x,
            y: startY + pattern.tPosition.y
          },
          rotation: this.calculateRequiredRotation(pattern.name),
          setup: pattern.pattern
        };
      }
    }
    return null;
  }

  matchPattern(board, startX, startY, pattern) {
    const height = board.length;
    const width = board[0].length;

    if (startX + pattern[0].length > width || startY + pattern.length > height) {
      return false;
    }

    for (let py = 0; py < pattern.length; py++) {
      for (let px = 0; px < pattern[py].length; px++) {
        const boardX = startX + px;
        const boardY = startY + py;
        const patternValue = pattern[py][px];
        const boardValue = board[boardY][boardX];

        if (patternValue === 1 && boardValue === null) {
          return false;
        }
        if (patternValue === 0 && boardValue !== null) {
          return false;
        }
      }
    }
    return true;
  }

  calculateRequiredRotation(patternName) {
    const rotationMap = {
      'TSD_LEFT': 3,
      'TSD_RIGHT': 1, 
      'TST_LEFT': 3,
      'TST_RIGHT': 1
    };
    return rotationMap[patternName] || 0;
  }

  isTSpinMove(board, piece, position, rotation) {
    if (piece.type !== 'T') return false;

    const simulatedBoard = this.simulateMove(board, piece, position, rotation);
    if (!simulatedBoard) return false;

    return this.detectTSpinInPosition(simulatedBoard.board, position, rotation);
  }

  detectTSpinInPosition(board, position, rotation) {
    const tShapes = [
      [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
      ],
      [
        [0, 1, 0],
        [0, 1, 1],
        [0, 1, 0]
      ],
      [
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0]
      ],
      [
        [0, 1, 0],
        [1, 1, 0],
        [0, 1, 0]
      ]
    ];

    const tShape = tShapes[rotation % 4];
    const corners = this.getTCorners(position, rotation);
    
    let filledCorners = 0;
    for (const corner of corners) {
      if (corner.x < 0 || corner.x >= board[0].length || 
          corner.y < 0 || corner.y >= board.length ||
          board[corner.y][corner.x] !== null) {
        filledCorners++;
      }
    }

    return filledCorners >= 3;
  }

  getTCorners(position, rotation) {
    const cornerOffsets = [
      [
        { x: -1, y: -1 }, { x: 1, y: -1 },
        { x: -1, y: 1 }, { x: 1, y: 1 }
      ],
      [
        { x: 1, y: -1 }, { x: 1, y: 1 },
        { x: -1, y: -1 }, { x: -1, y: 1 }
      ],
      [
        { x: 1, y: 1 }, { x: -1, y: 1 },
        { x: 1, y: -1 }, { x: -1, y: -1 }
      ],
      [
        { x: -1, y: 1 }, { x: -1, y: -1 },
        { x: 1, y: 1 }, { x: 1, y: -1 }
      ]
    ];

    const offsets = cornerOffsets[rotation % 4];
    return offsets.map(offset => ({
      x: position.x + 1 + offset.x,
      y: position.y + 1 + offset.y
    }));
  }

  simulateMove(board, piece, position, rotation) {
    try {
      const boardCopy = board.map(row => [...row]);
      const rotatedPiece = this.rotatePiece(piece, rotation);
      
      this.placePiece(boardCopy, rotatedPiece, position, position);
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

  placePiece(board, piece, position) {
    for (let py = 0; py < piece.shape.length; py++) {
      for (let px = 0; px < piece.shape[py].length; px++) {
        if (piece.shape[py][px]) {
          const boardX = position.x + px;
          const boardY = position.y + py;
          if (boardY >= 0 && boardY < board.length && 
              boardX >= 0 && boardX < board[0].length) {
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

  calculateTSpinScore(linesCleared, level = 1) {
    const tSpinScores = {
      0: 400,   // T-Spin Mini
      1: 800,   // T-Spin Single
      2: 1200,  // T-Spin Double  
      3: 1600   // T-Spin Triple
    };
    
    return (tSpinScores[linesCleared] || 0) * level;
  }
} 