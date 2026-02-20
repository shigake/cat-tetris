export const PIECE_TYPES = {
  I: 'I',
  O: 'O',
  T: 'T',
  S: 'S',
  Z: 'Z',
  J: 'J',
  L: 'L'
};

// Default pieces configuration
const DEFAULT_PIECES = {
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

// Current active pieces (can be customized by themes)
export let PIECES = { ...DEFAULT_PIECES };

// Apply theme to pieces
export function applyTheme(theme) {
  if (!theme || !theme.pieces) {
    PIECES = { ...DEFAULT_PIECES };
    return;
  }

  // Update pieces with theme data
  Object.keys(PIECES).forEach(pieceType => {
    if (theme.pieces[pieceType]) {
      PIECES[pieceType] = {
        ...PIECES[pieceType],
        color: theme.pieces[pieceType].color,
        emoji: theme.pieces[pieceType].emoji
      };
    }
  });
}

// Load theme from shop on startup
if (typeof window !== 'undefined') {
  window.addEventListener('themeEquipped', (event) => {
    applyTheme(event.detail.theme);
  });

  // Try to load equipped theme from localStorage on init
  try {
    const savedInventory = localStorage.getItem('cat-tetris-shopInventory');
    if (savedInventory) {
      const inventory = JSON.parse(savedInventory);
      const equippedThemeId = inventory.equippedTheme;
      
      // Import theme data
      import('../core/services/ShopService.js').then(({ PIECE_THEMES }) => {
        if (PIECE_THEMES[equippedThemeId]) {
          applyTheme(PIECE_THEMES[equippedThemeId]);
        }
      });
    }
  } catch (error) {
    console.error('Failed to load theme:', error);
  }
}

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

export function resetBag() {
  bag = [];
  bagIndex = 0;
}

export function generateRandomPiece() {
  if (bagIndex >= bag.length) {
    refillBag();
  }
  
  const pieceType = bag[bagIndex++];
  let position = { x: 3, y: 0 };
  if (pieceType === 'I') {
    position = { x: 3, y: -2 };
  }
  return {
    type: pieceType,
    shape: PIECES[pieceType].shape,
    color: PIECES[pieceType].color,
    emoji: PIECES[pieceType].emoji,
    name: PIECES[pieceType].name,
    position
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