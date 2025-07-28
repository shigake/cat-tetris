import { generateRandomPiece, rotatePiece } from './PieceGenerator.js';

// Constantes do jogo
export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;
export const INITIAL_DROP_TIME = 1000; // 1 segundo

// Função para criar um tabuleiro vazio
export const createEmptyBoard = () => {
  return Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(0));
};

// Função para verificar se uma posição está dentro dos limites do tabuleiro
export const isWithinBounds = (x, y) => {
  return x >= 0 && x < BOARD_WIDTH && y >= 0 && y < BOARD_HEIGHT;
};

// Função para verificar colisão entre uma peça e o tabuleiro
export const checkCollision = (piece, board, offsetX = 0, offsetY = 0) => {
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x]) {
        const newX = piece.position.x + x + offsetX;
        const newY = piece.position.y + y + offsetY;
        
        // Verificar se está fora dos limites
        if (!isWithinBounds(newX, newY)) {
          return true;
        }
        
        // Verificar se há colisão com uma peça já colocada
        if (board[newY][newX]) {
          return true;
        }
      }
    }
  }
  return false;
};

// Função para mover uma peça
export const movePiece = (piece, board, direction) => {
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
};

// Função para rotacionar uma peça
export const rotatePieceInGame = (piece, board) => {
  const rotated = rotatePiece(piece);
  
  // Tentar rotação normal
  if (!checkCollision(rotated, board)) {
    return rotated;
  }
  
  // Tentar rotação com ajuste de posição (wall kick)
  const kicks = [
    { x: -1, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: -1 },
    { x: -1, y: -1 },
    { x: 1, y: -1 }
  ];
  
  for (const kick of kicks) {
    if (!checkCollision(rotated, board, kick.x, kick.y)) {
      return {
        ...rotated,
        position: {
          x: rotated.position.x + kick.x,
          y: rotated.position.y + kick.y
        }
      };
    }
  }
  
  return piece; // Retorna a peça original se não conseguir rotacionar
};

// Função para colocar uma peça no tabuleiro
export const placePiece = (piece, board) => {
  const newBoard = board.map(row => [...row]);
  
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x]) {
        const boardX = piece.position.x + x;
        const boardY = piece.position.y + y;
        
        if (isWithinBounds(boardX, boardY)) {
          newBoard[boardY][boardX] = {
            type: piece.type,
            color: piece.color,
            emoji: piece.emoji
          };
        }
      }
    }
  }
  
  return newBoard;
};

// Função para verificar e limpar linhas completas
export const clearLines = (board) => {
  const newBoard = [];
  const linesCleared = [];
  
  for (let y = 0; y < board.length; y++) {
    const isLineFull = board[y].every(cell => cell !== 0);
    
    if (isLineFull) {
      linesCleared.push(y);
    } else {
      newBoard.push([...board[y]]);
    }
  }
  
  // Adicionar linhas vazias no topo
  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.unshift(Array(BOARD_WIDTH).fill(0));
  }
  
  return {
    board: newBoard,
    linesCleared: linesCleared.length,
    clearedRows: linesCleared
  };
};

// Função para calcular pontuação
export const calculateScore = (linesCleared, level, combo = 0) => {
  const baseScores = {
    1: 100,
    2: 300,
    3: 500,
    4: 800
  };
  
  const baseScore = baseScores[linesCleared] || 0;
  const levelMultiplier = level + 1;
  const comboBonus = combo * 50;
  
  return (baseScore * levelMultiplier) + comboBonus;
};

// Função para verificar game over
export const checkGameOver = (board) => {
  // Verificar se há peças na linha superior
  return board[0].some(cell => cell !== 0);
};

// Função para fazer drop instantâneo
export const hardDrop = (piece, board) => {
  let droppedPiece = { ...piece };
  let dropDistance = 0;
  
  while (!checkCollision(droppedPiece, board, 0, 1)) {
    droppedPiece = movePiece(droppedPiece, board, 'down');
    dropDistance++;
  }
  
  return {
    piece: droppedPiece,
    dropDistance
  };
};

// Função para obter o nível baseado na pontuação
export const getLevel = (score) => {
  return Math.floor(score / 1000) + 1;
};

// Função para calcular o tempo de queda baseado no nível
export const getDropTime = (level) => {
  return Math.max(50, INITIAL_DROP_TIME - (level - 1) * 100);
}; 