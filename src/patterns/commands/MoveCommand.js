import { GameCommand } from '../Command.js';

export class MoveCommand extends GameCommand {
  constructor(piece, oldPosition, newPosition, gameState) {
    super(
      () => {
        gameState.actions.movePiece({ ...piece, position: newPosition });
      },
      () => {
        gameState.actions.movePiece({ ...piece, position: oldPosition });
      }
    );
  }
} 