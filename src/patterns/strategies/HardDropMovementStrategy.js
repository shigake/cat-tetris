import { BaseMovementStrategy } from './BaseMovementStrategy.js';

export class HardDropMovementStrategy extends BaseMovementStrategy {
  execute(piece, board) {
    if (!piece || !board) {
      return { piece, dropDistance: 0 };
    }

    let droppedPiece = piece;
    let dropDistance = 0;

    while (true) {
      const newPosition = {
        x: droppedPiece.position.x,
        y: droppedPiece.position.y + 1
      };

      if (this.isValidMove(droppedPiece, board, newPosition)) {
        droppedPiece = droppedPiece.move(0, 1);
        dropDistance++;
      } else {
        break;
      }
    }

    return { piece: droppedPiece, dropDistance };
  }
}
