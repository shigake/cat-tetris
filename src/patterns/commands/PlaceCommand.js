import { GameCommand } from '../Command.js';
import { placePieceOnBoard } from '../../utils/GameLogic.js';

export class PlaceCommand extends GameCommand {
  constructor(piece, board, gameState) {
    super(
      () => {
        const newBoard = placePieceOnBoard(piece, board);
        gameState.actions.placePiece(newBoard, null, []);
      },
      () => {
        gameState.actions.placePiece(board, piece, []);
      }
    );
  }
} 