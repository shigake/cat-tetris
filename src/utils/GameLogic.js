import { PIECES } from './PieceGenerator.js';

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;
export const INITIAL_DROP_TIME = 1000;

export function createEmptyBoard() {
  return Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(null));
}

export function isWithinBounds(x, y) {
  return x >= 0 && x < BOARD_WIDTH && y >= 0 && y < BOARD_HEIGHT;
}

export function checkCollision(piece, board, offsetX = 0, offsetY = 0) {
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x]) {
        const boardX = piece.position.x + x + offsetX;
        const boardY = piece.position.y + y + offsetY;
        
        if (!isWithinBounds(boardX, boardY)) {
          return true;
        }
        
        if (board[boardY][boardX]) {
          return true;
        }
      }
    }
  }
  return false;
}

export function movePiece(piece, board, direction) {
  const offsets = {
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 },
    down: { x: 0, y: 1 }
  };

  const offset = offsets[direction];
  if (!offset) return piece;

  if (!checkCollision(piece, board, offset.x, offset.y)) {
    return {
      ...piece,
      position: {
        x: piece.position.x + offset.x,
        y: piece.position.y + offset.y
      }
    };
  }

  return piece;
}

export function rotatePiece(piece, board) {
  const rotated = piece.shape[0].map((_, index) =>
    piece.shape.map(row => row[index]).reverse()
  );

  const rotatedPiece = { ...piece, shape: rotated };

  if (!checkCollision(rotatedPiece, board)) {
    return rotatedPiece;
  }

  const kicks = [
    { x: -1, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: -1 },
    { x: -1, y: -1 },
    { x: 1, y: -1 }
  ];

  for (const kick of kicks) {
    const kickedPiece = {
      ...rotatedPiece,
      position: {
        x: rotatedPiece.position.x + kick.x,
        y: rotatedPiece.position.y + kick.y
      }
    };

    if (!checkCollision(kickedPiece, board)) {
      return kickedPiece;
    }
  }

  return piece;
}

export function placePieceOnBoard(piece, board) {
  const newBoard = board.map(row => [...row]);

  piece.shape.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell) {
        const boardX = piece.position.x + x;
        const boardY = piece.position.y + y;
        if (boardX >= 0 && boardX < BOARD_WIDTH && boardY >= 0 && boardY < BOARD_HEIGHT) {
          newBoard[boardY][boardX] = {
            type: piece.type,
            color: piece.color,
            emoji: piece.emoji
          };
        }
      }
    });
  });

  return newBoard;
}

export function clearLines(board) {
  if (!board || !Array.isArray(board)) {
    return { board: createEmptyBoard(), linesCleared: 0 };
  }

  const newBoard = board.map(row => Array.isArray(row) ? [...row] : Array(BOARD_WIDTH).fill(null));
  let linesCleared = 0;

  for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
    if (newBoard[y] && Array.isArray(newBoard[y]) && newBoard[y].every(cell => cell !== null)) {
      newBoard.splice(y, 1);
      linesCleared++;
      y++;
    }
  }

  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.unshift(Array(BOARD_WIDTH).fill(null));
  }

  return { board: newBoard, linesCleared };
}

export function calculateScore(linesCleared, level, combo = 0, isTSpin = false, backToBack = false) {
  const basePoints = [0, 100, 300, 500, 800];
  let points = basePoints[linesCleared] || 0;
  
  if (isTSpin) {
    const tspinPoints = [0, 800, 1200, 1600, 2000];
    points = tspinPoints[linesCleared] || points;
    
    if (backToBack) {
      points = Math.floor(points * 1.5);
    }
  }
  
  points *= level;
  
  if (combo > 0) {
    points += combo * 50;
  }
  
  return points;
}

export function checkGameOver(board) {
  return board[0].some(cell => cell !== null);
}

export function hardDrop(piece, board) {
  let droppedPiece = { ...piece };
  let dropDistance = 0;

  while (true) {
    const newPosition = {
      x: droppedPiece.position.x,
      y: droppedPiece.position.y + 1
    };

    if (!checkCollision({ ...droppedPiece, position: newPosition }, board)) {
      droppedPiece.position = newPosition;
      dropDistance++;
    } else {
      break;
    }
  }

  return { piece: droppedPiece, dropDistance };
}

export function getLevel(lines) {
  return Math.min(15, Math.floor(lines / 10) + 1);
}

export function getDropTime(level) {
  const dropTimes = [
    1000,
    850,
    700,
    600,
    500,
    400,
    350,
    300,
    250,
    200,
    150,
    100,
    80,
    60,
    50
  ];
  return dropTimes[Math.min(level - 1, dropTimes.length - 1)] || 50;
} 