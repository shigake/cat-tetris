import { PIECES, PIECE_TYPES, generateRandomPiece as originalGenerateRandomPiece, generateNextPieces as originalGenerateNextPieces } from '../utils/PieceGenerator.js';
import { IPieceFactory } from '../interfaces/IPieceFactory.js';
import { IMovementStrategy } from '../interfaces/IMovementStrategy.js';
import { LeftMovementStrategy } from './strategies/LeftMovementStrategy.js';
import { RightMovementStrategy } from './strategies/RightMovementStrategy.js';
import { DownMovementStrategy } from './strategies/DownMovementStrategy.js';
import { RotateMovementStrategy } from './strategies/RotateMovementStrategy.js';
import { RotateLeftMovementStrategy } from './strategies/RotateLeftMovementStrategy.js';
import { HardDropMovementStrategy } from './strategies/HardDropMovementStrategy.js';
import { PieceBuilder } from './builder/PieceBuilder.js';

export class PieceFactory extends IPieceFactory {
  constructor() {
    super();
    this.pieceConfigs = PIECES;
  }

  createPiece(type, position = { x: 3, y: 0 }) {
    const config = this.pieceConfigs[type];
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

  createRandomPiece() {
    const pieceData = originalGenerateRandomPiece();
    return new PieceBuilder()
      .setType(pieceData.type)
      .setShape(pieceData.shape)
      .setColor(pieceData.color)
      .setEmoji(pieceData.emoji)
      .setPosition(pieceData.position.x, pieceData.position.y)
      .build();
  }

  createNextPieces(count = 3) {
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

  registerPieceType(type, config) {
    this.pieceConfigs[type] = config;
  }

  getPieceTypes() {
    return Object.keys(this.pieceConfigs);
  }
}

export class MovementStrategyFactory {
  constructor() {
    this.strategies = new Map();
    this.registerDefaultStrategies();
  }

  registerDefaultStrategies() {
    this.strategies.set('left', () => new LeftMovementStrategy());
    this.strategies.set('right', () => new RightMovementStrategy());
    this.strategies.set('down', () => new DownMovementStrategy());
    this.strategies.set('rotate', () => new RotateMovementStrategy());
    this.strategies.set('rotateLeft', () => new RotateLeftMovementStrategy());
    this.strategies.set('hardDrop', () => new HardDropMovementStrategy());
  }

  createStrategy(type) {
    const strategyFactory = this.strategies.get(type);
    if (!strategyFactory) {
      throw new Error(`Strategy type '${type}' not found`);
    }
    return strategyFactory();
  }

  registerStrategy(type, strategyFactory) {
    if (typeof strategyFactory !== 'function') {
      throw new Error('Strategy factory must be a function');
    }
    this.strategies.set(type, strategyFactory);
  }

  unregisterStrategy(type) {
    this.strategies.delete(type);
  }

  getAvailableStrategies() {
    return Array.from(this.strategies.keys());
  }

  hasStrategy(type) {
    return this.strategies.has(type);
  }
} 