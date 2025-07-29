import { Piece } from '../core/entities/Piece.js';

/**
 * Object Pool Pattern for Pieces
 * Reduces garbage collection by reusing piece instances
 * Complexity: O(1) for get/return operations
 */
export class PiecePool {
  constructor() {
    this.pool = [];
    this.maxPoolSize = 50; // Reasonable limit to prevent memory bloat
  }

  /**
   * Get a piece from pool or create new one
   * @returns {Piece} Reused or new piece instance
   */
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

  /**
   * Return piece to pool for reuse
   * @param {Piece} piece Piece to return to pool
   */
  returnPiece(piece) {
    if (!piece || this.pool.length >= this.maxPoolSize) {
      return; // Don't exceed max pool size
    }
    
    this.pool.push(piece);
  }

  /**
   * Get current pool statistics
   * @returns {Object} Pool metrics
   */
  getStats() {
    return {
      poolSize: this.pool.length,
      maxPoolSize: this.maxPoolSize,
      utilizationRate: (this.pool.length / this.maxPoolSize) * 100
    };
  }

  /**
   * Clear the entire pool
   */
  clear() {
    this.pool = [];
  }
} 