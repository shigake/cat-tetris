import { DIContainer } from './DIContainer.js';
import { GameService } from '../services/GameService.js';
import { ScoringService } from '../services/ScoringService.js';
import { LocalStorageRepository } from '../repositories/LocalStorageRepository.js';
import { PieceFactory, MovementStrategyFactory } from '../../patterns/Factory.js';
import { SettingsService } from '../services/SettingsService.js';
import { StatisticsService } from '../services/StatisticsService.js';
import { KeyboardInputService } from '../services/KeyboardInputService.js';
import { CurrencyService } from '../services/CurrencyService.js';
import { MissionsService } from '../services/MissionsService.js';
import { AchievementsService } from '../services/AchievementsService.js';
import { PlayerStatsService } from '../services/PlayerStatsService.js';
import { ShopService } from '../services/ShopService.js';
import { GameModesService } from '../services/GameModesService.js';
import { LeaderboardService } from '../services/LeaderboardService.js';
import { ShareService } from '../services/ShareService.js';
import { AIOpponentService } from '../services/AIOpponentService.js';
import { MultiplayerService } from '../services/MultiplayerService.js';

export function registerServices(container = new DIContainer()) {
  container.registerSingleton('gameRepository', () => new LocalStorageRepository());
  
  container.registerSingleton('settingsService', () => new SettingsService());
  
  container.registerSingleton('statisticsService', () => new StatisticsService());
  
  container.registerSingleton('scoringService', () => new ScoringService());
  
  container.registerSingleton('pieceFactory', () => {
    const factory = new PieceFactory();
    return factory;
  });
  
  container.registerSingleton('movementStrategyFactory', () => {
    const factory = new MovementStrategyFactory();
    return factory;
  });
  
  container.registerSingleton('keyboardInputService', () => new KeyboardInputService());
  
  // New progression services
  container.registerSingleton(
    'playerStatsService',
    (gameRepository) => new PlayerStatsService(gameRepository),
    ['gameRepository']
  );
  
  container.registerSingleton(
    'currencyService',
    (gameRepository) => new CurrencyService(gameRepository),
    ['gameRepository']
  );
  
  container.registerSingleton(
    'missionsService',
    (gameRepository, currencyService) => new MissionsService(gameRepository, currencyService),
    ['gameRepository', 'currencyService']
  );
  
  container.registerSingleton(
    'achievementsService',
    (gameRepository, currencyService, playerStatsService) => 
      new AchievementsService(gameRepository, currencyService, playerStatsService),
    ['gameRepository', 'currencyService', 'playerStatsService']
  );
  
  container.registerSingleton(
    'shopService',
    (gameRepository, currencyService) => new ShopService(gameRepository, currencyService),
    ['gameRepository', 'currencyService']
  );
  
  container.registerSingleton(
    'gameModesService',
    (gameRepository) => new GameModesService(gameRepository),
    ['gameRepository']
  );
  
  container.registerSingleton(
    'leaderboardService',
    (gameRepository, playerStatsService) => 
      new LeaderboardService(gameRepository, playerStatsService),
    ['gameRepository', 'playerStatsService']
  );
  
  container.registerSingleton(
    'shareService',
    (playerStatsService) => new ShareService(playerStatsService),
    ['playerStatsService']
  );
  
  container.registerSingleton(
    'aiOpponentService',
    () => new AIOpponentService()
  );
  
  container.registerSingleton(
    'multiplayerService',
    (gameRepository) => new MultiplayerService(gameRepository),
    ['gameRepository']
  );
  
  container.registerSingleton(
    'gameService',
    (pieceFactory, movementStrategyFactory, gameRepository, scoringService) => 
      new GameService(pieceFactory, movementStrategyFactory, gameRepository, scoringService),
    ['pieceFactory', 'movementStrategyFactory', 'gameRepository', 'scoringService']
  );

  return container;
}

export const serviceContainer = registerServices(); 