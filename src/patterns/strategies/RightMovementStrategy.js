import { BaseMovementStrategy } from './BaseMovementStrategy.js';

export class RightMovementStrategy extends BaseMovementStrategy {
  execute(piece, board) {
    return this.movePiece(piece, board, 1, 0);
  }
}
