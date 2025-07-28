// Definição das peças do Tetris com tema de gatos
export const PIECES = {
  I: {
    shape: [
      [1, 1, 1, 1]
    ],
    color: 'cat-blue',
    emoji: '🐱',
    name: 'Gato Azul'
  },
  O: {
    shape: [
      [1, 1],
      [1, 1]
    ],
    color: 'cat-yellow',
    emoji: '😺',
    name: 'Gato Amarelo'
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1]
    ],
    color: 'cat-purple',
    emoji: '😸',
    name: 'Gato Roxo'
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0]
    ],
    color: 'cat-green',
    emoji: '😻',
    name: 'Gato Verde'
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1]
    ],
    color: 'cat-red',
    emoji: '😽',
    name: 'Gato Vermelho'
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1]
    ],
    color: 'cat-orange',
    emoji: '😹',
    name: 'Gato Laranja'
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1]
    ],
    color: 'cat-pink',
    emoji: '😿',
    name: 'Gato Rosa'
  }
};

export const PIECE_TYPES = Object.keys(PIECES);

// 7-bag generator state
let bag = [];

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function refillBag() {
  bag = shuffle([...PIECE_TYPES]);
}

// Função para gerar uma peça do sistema 7-bag
export const generateRandomPiece = () => {
  if (bag.length === 0) refillBag();
  const type = bag.shift();
  return {
    type,
    ...PIECES[type],
    position: { x: 3, y: 0 }
  };
};

// Função para gerar as próximas peças
export const generateNextPieces = (count = 3) => {
  const pieces = [];
  for (let i = 0; i < count; i++) {
    pieces.push(generateRandomPiece());
  }
  return pieces;
};

// Função para rotacionar uma peça
export const rotatePiece = (piece) => {
  const rotated = piece.shape[0].map((_, index) =>
    piece.shape.map(row => row[index]).reverse()
  );
  
  return {
    ...piece,
    shape: rotated
  };
};

// Função para obter a cor CSS da peça
export const getPieceColor = (pieceType) => {
  const colors = {
    'cat-blue': '#87CEEB',
    'cat-yellow': '#FFD700',
    'cat-purple': '#DDA0DD',
    'cat-green': '#98FB98',
    'cat-red': '#FF6B6B',
    'cat-orange': '#FFA500',
    'cat-pink': '#FFB6C1'
  };
  return colors[pieceType] || '#F0F0F0';
}; 