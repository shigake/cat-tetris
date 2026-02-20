import { BaseMovementStrategy } from './BaseMovementStrategy.js';
import { GameConfig } from '../../config/GameConfig.js';

export class RotateMovementStrategy extends BaseMovementStrategy {
  execute(piece, board) {
    if (!piece || !piece.shape || !board) {
      return piece;
    }

    const rotated = this.rotatePiece(piece);
    let isTSpin = false;
    
    if (this.isValidMove(rotated, board, rotated.position)) {
      isTSpin = this.detectTSpin(rotated, board);
      return rotated.setTSpin(isTSpin);
    }

    // Use proper SRS kicks based on rotation transition
    const fromRot = piece.rotationState ?? 0;
    const toRot = (fromRot + 1) % 4;
    const kickKey = `${fromRot}>${toRot}`;
    const kicks = GameConfig.SRS_KICKS_CW?.[kickKey] || GameConfig.KICK_OFFSETS;

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

    // T-piece is 3x3, corners of bounding box are (0,0), (2,0), (0,2), (2,2)
    corners.push({ x: pieceX, y: pieceY });
    corners.push({ x: pieceX + 2, y: pieceY });
    corners.push({ x: pieceX, y: pieceY + 2 });
    corners.push({ x: pieceX + 2, y: pieceY + 2 });

    return corners;
  }

  rotatePiece(piece) {
    if (!piece || !piece.shape || !Array.isArray(piece.shape) || piece.shape.length === 0) {
      return piece;
    }

    return piece.rotate();
  }
} 