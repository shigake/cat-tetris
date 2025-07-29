import { DIContainer } from './DIContainer.js';
import { GameService } from '../services/GameService.js';
import { ScoringService } from '../services/ScoringService.js';
import { LocalStorageRepository } from '../repositories/LocalStorageRepository.js';
import { PieceFactory, MovementStrategyFactory } from '../../patterns/Factory.js';
import { SettingsService } from '../services/SettingsService.js';
import { StatisticsService } from '../services/StatisticsService.js';
import { KeyboardInputService } from '../services/KeyboardInputService.js';

export function registerServices(container = new DIContainer()) {
  container.registerSingleton('gameRepository', () => new LocalStorageRepository());
  
  container.registerSingleton('settingsService', () => new SettingsService());
  
  container.registerSingleton('statisticsService', () => new StatisticsService());
  
  container.registerSingleton('scoringService', () => new ScoringService());
  
  container.registerSingleton('pieceFactory', () => new PieceFactory());
  
  container.registerSingleton('movementStrategyFactory', () => new MovementStrategyFactory());
  
  container.registerSingleton('keyboardInputService', () => new KeyboardInputService());
  
  container.registerSingleton(
    'gameService',
    (pieceFactory, movementStrategyFactory, gameRepository, scoringService) => 
      new GameService(pieceFactory, movementStrategyFactory, gameRepository, scoringService),
    ['pieceFactory', 'movementStrategyFactory', 'gameRepository', 'scoringService']
  );

  return container;
}

export const serviceContainer = registerServices(); 