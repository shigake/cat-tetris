import { PIECES, PIECE_TYPES, generateRandomPiece as originalGenerateRandomPiece, generateNextPieces as originalGenerateNextPieces } from '../utils/PieceGenerator.js';
import { IPieceFactory } from '../interfaces/IPieceFactory.js';
import { IMovementStrategy } from '../interfaces/IMovementStrategy.js';
import { LeftMovementStrategy } from './strategies/LeftMovementStrategy.js';
import { RightMovementStrategy } from './strategies/RightMovementStrategy.js';
import { DownMovementStrategy } from './strategies/DownMovementStrategy.js';
import { RotateMovementStrategy } from './strategies/RotateMovementStrategy.js';
import { HardDropMovementStrategy } from './strategies/HardDropMovementStrategy.js';

export class PieceFactory extends IPieceFactory {
  static createPiece(type, position = { x: 3, y: 0 }) {
    const config = PIECES[type];
    if (!config) {
      throw new Error(`Tipo de peça inválido: ${type}`);
    }

    return {
      type,
      shape: config.shape,
      color: config.color,
      emoji: config.emoji,
      name: config.name,
      position: { ...position }
    };
  }

  static createRandomPiece() {
    return originalGenerateRandomPiece();
  }

  static createNextPieces(count = 3) {
    return originalGenerateNextPieces(count);
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