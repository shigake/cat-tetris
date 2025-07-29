export const PIECE_TYPES = {
  I: 'I',
  O: 'O',
  T: 'T',
  S: 'S',
  Z: 'Z',
  J: 'J',
  L: 'L'
};

export const PIECES = {
  [PIECE_TYPES.I]: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    color: '#00f5ff',
    emoji: '🐱',
    name: 'I-Piece'
  },
  [PIECE_TYPES.O]: {
    shape: [
      [1, 1],
      [1, 1]
    ],
    color: '#ffff00',
    emoji: '😺',
    name: 'O-Piece'
  },
  [PIECE_TYPES.T]: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: '#a000f0',
    emoji: '😸',
    name: 'T-Piece'
  },
  [PIECE_TYPES.S]: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0]
    ],
    color: '#00f000',
    emoji: '😹',
    name: 'S-Piece'
  },
  [PIECE_TYPES.Z]: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0]
    ],
    color: '#f00000',
    emoji: '😻',
    name: 'Z-Piece'
  },
  [PIECE_TYPES.J]: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: '#0000f0',
    emoji: '😼',
    name: 'J-Piece'
  },
  [PIECE_TYPES.L]: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: '#ff7f00',
    emoji: '😽',
    name: 'L-Piece'
  }
};

let bag = [];
let bagIndex = 0;

function refillBag() {
  bag = Object.keys(PIECES);
  for (let i = bag.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [bag[i], bag[j]] = [bag[j], bag[i]];
  }
  bagIndex = 0;
}

export function generateRandomPiece() {
  if (bagIndex >= bag.length) {
    refillBag();
  }
  
  const pieceType = bag[bagIndex++];
  return {
    type: pieceType,
    shape: PIECES[pieceType].shape,
    color: PIECES[pieceType].color,
    emoji: PIECES[pieceType].emoji,
    name: PIECES[pieceType].name,
    position: { x: 3, y: 0 }
  };
}

export function generateNextPieces(count = 3) {
  const pieces = [];
  for (let i = 0; i < count; i++) {
    pieces.push(generateRandomPiece());
  }
  return pieces;
}

export function rotatePiece(piece) {
  const rotated = piece.shape[0].map((_, index) =>
    piece.shape.map(row => row[index]).reverse()
  );
  return { ...piece, shape: rotated };
}

export function getPieceColor(color) {
  const colorMap = {
    '#00f5ff': '#00f5ff',
    '#ffff00': '#ffff00',
    '#a000f0': '#a000f0',
    '#00f000': '#00f000',
    '#f00000': '#f00000',
    '#0000f0': '#0000f0',
    '#ff7f00': '#ff7f00'
  };
  return colorMap[color] || color;
} 