import { PIECES, PIECE_TYPES, generateRandomPiece as originalGenerateRandomPiece, generateNextPieces as originalGenerateNextPieces } from '../utils/PieceGenerator.js';
import { IPieceFactory } from '../interfaces/IPieceFactory.js';
import { IMovementStrategy } from '../interfaces/IMovementStrategy.js';
import { LeftMovementStrategy } from './strategies/LeftMovementStrategy.js';
import { RightMovementStrategy } from './strategies/RightMovementStrategy.js';
import { DownMovementStrategy } from './strategies/DownMovementStrategy.js';
import { RotateMovementStrategy } from './strategies/RotateMovementStrategy.js';
import { HardDropMovementStrategy } from './strategies/HardDropMovementStrategy.js';
import { PieceBuilder } from './builder/PieceBuilder.js';

export class PieceFactory extends IPieceFactory {
  static createPiece(type, position = { x: 3, y: 0 }) {
    const config = PIECES[type];
    if (!config) {
      throw new Error(`Tipo de peça inválido: ${type}`);
    }

    return new PieceBuilder()
      .setType(type)
      .setShape(config.shape)
      .setColor(config.color)
      .setEmoji(config.emoji)
      .setPosition(position.x, position.y)
      .build();
  }

  static createRandomPiece() {
    const pieceData = originalGenerateRandomPiece();
    return new PieceBuilder()
      .setType(pieceData.type)
      .setShape(pieceData.shape)
      .setColor(pieceData.color)
      .setEmoji(pieceData.emoji)
      .setPosition(pieceData.position.x, pieceData.position.y)
      .build();
  }

  static createNextPieces(count = 3) {
    const piecesData = originalGenerateNextPieces(count);
    return piecesData.map(pieceData => 
      new PieceBuilder()
        .setType(pieceData.type)
        .setShape(pieceData.shape)
        .setColor(pieceData.color)
        .setEmoji(pieceData.emoji)
        .setPosition(pieceData.position.x, pieceData.position.y)
        .build()
    );
  }
}

export class MovementStrategyFactory {
  static createStrategy(type) {
    const strategies = {
      left: new LeftMovementStrategy(),
      right: new RightMovementStrategy(),
      down: new DownMovementStrategy(),
      rotate: new RotateMovementStrategy(),
      hardDrop: new HardDropMovementStrategy()
    };

    return strategies[type] || strategies.down;
  }
} 