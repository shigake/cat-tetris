import { Piece } from '../../core/entities/Piece.js';

export class PieceBuilder {
  constructor() {
    this.reset();
  }

  reset() {
    this.piece = {
      type: null,
      shape: [],
      color: '#000000',
      emoji: '😺',
      position: { x: 3, y: 0 },
      isTSpin: false
    };
    return this;
  }

  setType(type) {
    this.piece.type = type;
    return this;
  }

  setShape(shape) {
    this.piece.shape = shape;
    return this;
  }

  setColor(color) {
    this.piece.color = color;
    return this;
  }

  setEmoji(emoji) {
    this.piece.emoji = emoji;
    return this;
  }

  setPosition(x, y) {
    this.piece.position = { x, y };
    return this;
  }

  setTSpin(isTSpin) {
    this.piece.isTSpin = isTSpin;
    return this;
  }

  build() {
    const piece = new Piece(
      this.piece.type,
      this.piece.shape,
      this.piece.color,
      this.piece.emoji,
      this.piece.position,
      this.piece.isTSpin
    );
    this.reset();
    return piece;
  }
} 