import { IMovementStrategy } from '../../interfaces/IMovementStrategy.js';
import { BOARD_WIDTH, BOARD_HEIGHT } from '../../utils/GameLogic.js';

export class BaseMovementStrategy extends IMovementStrategy {
  execute(piece, board) {
    throw new Error('execute method must be implemented');
  }

  movePiece(piece, board, deltaX, deltaY) {
    if (!piece || !board || !Array.isArray(board)) {
      return piece;
    }

    const newPosition = {
      x: piece.position.x + deltaX,
      y: piece.position.y + deltaY
    };

    if (this.isValidMove(piece, board, newPosition)) {
      return { ...piece, position: newPosition };
    }
    return piece;
  }

  isValidMove(piece, board, position) {
    if (!piece || !piece.shape || !board || !Array.isArray(board)) {
      return false;
    }

    return piece.shape.every((row, y) => {
      if (!Array.isArray(row)) return true;
      return row.every((cell, x) => {
        if (!cell) return true;
        const boardX = position.x + x;
        const boardY = position.y + y;
        return boardX >= 0 && boardX < BOARD_WIDTH && boardY >= 0 && boardY < BOARD_HEIGHT && 
               board[boardY] && Array.isArray(board[boardY]) && !board[boardY][boardX];
      });
    });
  }
} 