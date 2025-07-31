import { BaseMovementStrategy } from './BaseMovementStrategy.js';
import { GameConfig } from '../../config/GameConfig.js';
import { Piece } from '../../core/entities/Piece.js';

export class RotateLeftMovementStrategy extends BaseMovementStrategy {
  execute(piece, board) {
    if (!piece || !piece.shape || !board) {
      return piece;
    }

    const rotated = this.rotatePieceLeft(piece);
    let isTSpin = false;
    
    if (this.isValidMove(rotated, board, rotated.position)) {
      isTSpin = this.detectTSpin(rotated, board);
      return rotated.setTSpin(isTSpin);
    }

    const kicks = GameConfig.KICK_OFFSETS;

    for (const kick of kicks) {
      const kickedPosition = {
        x: rotated.position.x + kick.x,
        y: rotated.position.y + kick.y
      };
      
      if (this.isValidMove(rotated, board, kickedPosition)) {
        const kickedPiece = rotated.move(kick.x, kick.y);
        isTSpin = this.detectTSpin(kickedPiece, board);
        return kickedPiece.setTSpin(isTSpin);
      }
    }

    return piece;
  }

  detectTSpin(piece, board) {
    if (piece.type !== 'T') return false;

    const corners = this.getCornerPositions(piece);
    const filledCorners = corners.filter(corner => 
      corner.x < 0 || corner.x >= GameConfig.BOARD_WIDTH || 
      corner.y < 0 || corner.y >= GameConfig.BOARD_HEIGHT || 
      (board[corner.y] && board[corner.y][corner.x])
    );

    const isTSpin = filledCorners.length >= 3;
    
    return isTSpin;
  }

  getCornerPositions(piece) {
    const corners = [];
    const pieceX = piece.position.x;
    const pieceY = piece.position.y;

    corners.push({ x: pieceX - 1, y: pieceY - 1 });
    corners.push({ x: pieceX + 3, y: pieceY - 1 });
    corners.push({ x: pieceX - 1, y: pieceY + 3 });
    corners.push({ x: pieceX + 3, y: pieceY + 3 });

    return corners;
  }

  rotatePieceLeft(piece) {
    if (!piece || !piece.shape || !Array.isArray(piece.shape) || piece.shape.length === 0) {
      return piece;
    }

    const rotated = piece.shape[0].map((_, index) =>
      piece.shape.map(row => row[row.length - 1 - index])
    );
    
    return new Piece(
      piece.type,
      rotated,
      piece.color,
      piece.emoji,
      piece.position,
      piece.isTSpin
    );
  }
} 