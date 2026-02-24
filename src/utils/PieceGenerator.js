export const PIECE_TYPES = {
 I: 'I',
 O: 'O',
 T: 'T',
 S: 'S',
 Z: 'Z',
 J: 'J',
 L: 'L'
};

const DEFAULT_PIECES = {
 [PIECE_TYPES.I]: {
 shape: [
 [0, 0, 0, 0],
 [1, 1, 1, 1],
 [0, 0, 0, 0],
 [0, 0, 0, 0]
 ],
 color: '#00F0F0',
 emoji: '',
 name: 'I-Piece'
 },
 [PIECE_TYPES.O]: {
 shape: [
 [1, 1],
 [1, 1]
 ],
 color: '#F0F000',
 emoji: '',
 name: 'O-Piece'
 },
 [PIECE_TYPES.T]: {
 shape: [
 [0, 1, 0],
 [1, 1, 1],
 [0, 0, 0]
 ],
 color: '#A000F0',
 emoji: '',
 name: 'T-Piece'
 },
 [PIECE_TYPES.S]: {
 shape: [
 [0, 1, 1],
 [1, 1, 0],
 [0, 0, 0]
 ],
 color: '#00F000',
 emoji: '',
 name: 'S-Piece'
 },
 [PIECE_TYPES.Z]: {
 shape: [
 [1, 1, 0],
 [0, 1, 1],
 [0, 0, 0]
 ],
 color: '#F00000',
 emoji: '',
 name: 'Z-Piece'
 },
 [PIECE_TYPES.J]: {
 shape: [
 [1, 0, 0],
 [1, 1, 1],
 [0, 0, 0]
 ],
 color: '#0000F0',
 emoji: '',
 name: 'J-Piece'
 },
 [PIECE_TYPES.L]: {
 shape: [
 [0, 0, 1],
 [1, 1, 1],
 [0, 0, 0]
 ],
 color: '#F0A000',
 emoji: '',
 name: 'L-Piece'
 }
};

export let PIECES = { ...DEFAULT_PIECES };

let _currentBlockShape = 'classic';

export function getBlockShape() {
 return _currentBlockShape;
}

export function applyTheme(theme) {
 if (!theme || !theme.pieces) {
 PIECES = { ...DEFAULT_PIECES };
 _currentBlockShape = 'classic';
 return;
 }

 _currentBlockShape = theme.blockShape || 'classic';

 Object.keys(PIECES).forEach(pieceType => {
 if (theme.pieces[pieceType]) {
 PIECES[pieceType] = {
 ...PIECES[pieceType],
 color: theme.pieces[pieceType].color,
 emoji: theme.pieces[pieceType].emoji || ''
 };
 }
 });
}

if (typeof window !== 'undefined') {
 window.addEventListener('themeEquipped', (event) => {
 applyTheme(event.detail.theme);
 });

 try {
 const savedInventory = localStorage.getItem('cat-tetris-shopInventory');
 if (savedInventory) {
 const inventory = JSON.parse(savedInventory);
 const equippedThemeId = inventory.equippedTheme;

 import('../core/services/ShopService.js').then(({ PIECE_THEMES }) => {
 if (PIECE_THEMES[equippedThemeId]) {
 applyTheme(PIECE_THEMES[equippedThemeId]);
 }
 });
 }
 } catch (error) {

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
 '#00f5ff': '#00F0F0',
 '#ffff00': '#F0F000',
 '#ff7f00': '#F0A000',
 '#00f0f0': '#00F0F0',
 '#f0f000': '#F0F000',
 '#a000f0': '#A000F0',
 '#00f000': '#00F000',
 '#f00000': '#F00000',
 '#0000f0': '#0000F0',
 '#f0a000': '#F0A000',
 };
 return colorMap[color?.toLowerCase()] || color;
}
