import { BaseMovementStrategy } from './BaseMovementStrategy.js';

export class LeftMovementStrategy extends BaseMovementStrategy {
  execute(piece, board) {
    return this.movePiece(piece, board, -1, 0);
  }
}
