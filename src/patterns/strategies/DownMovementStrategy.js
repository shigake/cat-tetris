import { BaseMovementStrategy } from './BaseMovementStrategy';

export class DownMovementStrategy extends BaseMovementStrategy {
  execute(piece, board) {
    if (!piece || !board) return piece;

    const newPosition = {
      x: piece.position.x,
      y: piece.position.y + 1
    };

    if (!this.isValidMove(piece, board, newPosition)) {
      return piece;
    }

    return piece.move(0, 1);
  }

  getSoftDropPoints() {
    return 1;
  }
}
