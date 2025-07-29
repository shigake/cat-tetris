import { GameCommand } from '../Command.js';

export class HoldCommand extends GameCommand {
  constructor(currentPiece, heldPiece, gameState) {
    super(
      () => {
        gameState.actions.holdPiece(heldPiece, currentPiece);
      },
      () => {
        gameState.actions.holdPiece(currentPiece, heldPiece);
      }
    );
  }
} 