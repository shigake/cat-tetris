import { Piece } from '../core/entities/Piece.js';

export class PiecePool {
  constructor() {
    this.pool = [];
    this.maxPoolSize = 50;
  }

  getPiece(type, shape, color, emoji, position, isTSpin = false) {
    let piece;

    if (this.pool.length > 0) {
      piece = this.pool.pop();
      piece.reset(type, shape, color, emoji, position, isTSpin);
    } else {
      piece = new Piece(type, shape, color, emoji, position, isTSpin);
    }

    return piece;
  }

  returnPiece(piece) {
    if (!piece || this.pool.length >= this.maxPoolSize) {
      return;
    }

    this.pool.push(piece);
  }

  getStats() {
    return {
      poolSize: this.pool.length,
      maxPoolSize: this.maxPoolSize,
      utilizationRate: (this.pool.length / this.maxPoolSize) * 100
    };
  }

  clear() {
    this.pool = [];
  }
}
