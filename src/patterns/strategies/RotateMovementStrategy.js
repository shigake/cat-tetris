import { BaseMovementStrategy } from './BaseMovementStrategy.js';

export class RotateMovementStrategy extends BaseMovementStrategy {
  execute(piece, board) {
    if (!piece || !piece.shape || !board) {
      return piece;
    }

    const rotated = this.rotatePiece(piece);
    let isTSpin = false;
    
    if (this.isValidMove(rotated, board, rotated.position)) {
      isTSpin = this.detectTSpin(rotated, board);
      return { ...rotated, isTSpin };
    }

    const kicks = [
      { x: -1, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: -1 },
      { x: -1, y: -1 },
      { x: 1, y: -1 }
    ];

    for (const kick of kicks) {
      const kickedPosition = {
        x: rotated.position.x + kick.x,
        y: rotated.position.y + kick.y
      };
      
      if (this.isValidMove(rotated, board, kickedPosition)) {
        const kickedPiece = { ...rotated, position: kickedPosition };
        isTSpin = this.detectTSpin(kickedPiece, board);
        return { ...kickedPiece, isTSpin };
      }
    }

    return piece;
  }

  detectTSpin(piece, board) {
    if (piece.type !== 'T') return false;

    const corners = this.getCornerPositions(piece);
    const filledCorners = corners.filter(corner => 
      corner.x < 0 || corner.x >= 10 || corner.y < 0 || corner.y >= 20 || 
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

  rotatePiece(piece) {
    if (!piece || !piece.shape || !Array.isArray(piece.shape) || piece.shape.length === 0) {
      return piece;
    }

    const rotated = piece.shape[0].map((_, index) =>
      piece.shape.map(row => row[index]).reverse()
    );
    return { ...piece, shape: rotated };
  }
} 