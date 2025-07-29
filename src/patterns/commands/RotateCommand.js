import { GameCommand } from '../Command.js';

export class RotateCommand extends GameCommand {
  constructor(piece, oldShape, newShape, gameState) {
    super(
      () => {
        gameState.actions.rotatePiece({ ...piece, shape: newShape });
      },
      () => {
        gameState.actions.rotatePiece({ ...piece, shape: oldShape });
      }
    );
  }
} 