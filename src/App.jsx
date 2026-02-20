import React, { useState, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TetrisBoard from './components/TetrisBoard';
import Scoreboard from './components/Scoreboard';
import Controls from './components/Controls';
import GameOverScreen from './components/GameOverScreen';
import NextPieces from './components/NextPieces';
import HeldPiece from './components/HeldPiece';
import ErrorBoundary from './components/ErrorBoundary';
import MainMenu from './components/MainMenu';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import CurrencyDisplay from './components/CurrencyDisplay';
import DailyMissionsPanel from './components/DailyMissionsPanel';
import AchievementsPanel from './components/AchievementsPanel';
import AchievementNotification from './components/AchievementNotification';
import MultiplayerGame from './components/MultiplayerGame';
import AIShowcase from './components/AIShowcase';
import ShopPanel from './components/ShopPanel';
import GameModesPanel from './components/GameModesPanel';
import MultiplayerPanel from './components/MultiplayerPanel';
import Tutorial from './components/Tutorial';
import TutorialHub from './components/TutorialHub';
import ToastNotification from './components/ToastNotification';
import RewardNotification from './components/RewardNotification';
import { serviceContainer } from './core/container/ServiceRegistration';
import { useGameService } from './hooks/useGameService';
import { useSettings } from './hooks/useSettings';
import { useKeyboardInput } from './hooks/useKeyboardInput';
import { useSoundManager } from './hooks/useSoundManager';
import { useBackgroundMusic } from './hooks/useBackgroundMusic';
import { useGamepad } from './hooks/useGamepad';
import { useMissions } from './hooks/useMissions';
import { useAchievements } from './hooks/useAchievements';
import { usePlayerStats } from './hooks/usePlayerStats';
import { useShop } from './hooks/useShop';
import { useGameModes } from './hooks/useGameModes';
import GamepadIndicator from './components/GamepadIndicator';
import { getPieceColor } from './utils/PieceGenerator';
import { errorLogger } from './services/ErrorLogger';

const SettingsMenu = lazy(() => import('./components/SettingsMenu'));

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="text-4xl"
      >
        🐱
      </motion.div>
    </div>
  );
}

function GameScreen({
  gameState,
  actions,
  onBackToMenu,
  onRestart,
  isGamepadActive,
  controllerCount,
  getGamepadInfo
}) {

  const dropPreview = React.useMemo(() => {
    if (!gameState?.currentPiece || gameState?.gameOver || gameState?.isPaused) return null;
    try {
      return actions.getDropPreview();
    } catch (e) {
      return null;
    }
  }, [
    gameState?.currentPiece?.position?.x,
    gameState?.currentPiece?.position?.y,
    gameState?.currentPiece?.type,
    gameState?.currentPiece?.shape,
    gameState?.gameOver,
    gameState?.isPaused
  ]);

  const [actionCooldowns, setActionCooldowns] = React.useState({
    hardDrop: false,
    hold: false,
    pause: false
  });

  const handleHardDropWithDelay = React.useCallback(() => {
    if (actionCooldowns.hardDrop || gameState?.gameOver) return;

    actions.hardDrop();
    setActionCooldowns(prev => ({ ...prev, hardDrop: true }));

    setTimeout(() => {
      setActionCooldowns(prev => ({ ...prev, hardDrop: false }));
    }, 300);
  }, [actions, actionCooldowns.hardDrop, gameState?.gameOver]);

  const handleHoldWithDelay = React.useCallback(() => {
    if (actionCooldowns.hold || gameState?.gameOver || !gameState?.canHold) return;

    actions.holdPiece();
    setActionCooldowns(prev => ({ ...prev, hold: true }));

    setTimeout(() => {
      setActionCooldowns(prev => ({ ...prev, hold: false }));
    }, 500);
  }, [actions, actionCooldowns.hold, gameState?.gameOver, gameState?.canHold]);

  const handlePauseWithDelay = React.useCallback(() => {
    if (actionCooldowns.pause || gameState?.gameOver) return;

    if (gameState?.isPaused) {
      actions.resume();
    } else {
      actions.pause();
    }

    setActionCooldowns(prev => ({ ...prev, pause: true }));

    setTimeout(() => {
      setActionCooldowns(prev => ({ ...prev, pause: false }));
    }, 300);
  }, [actions, actionCooldowns.pause, gameState?.gameOver, gameState?.isPaused]);
  return (
    <div className="h-screen cat-bg flex flex-col overflow-hidden">

      <div className="flex items-center justify-between px-3 py-1.5 bg-black/30 backdrop-blur-sm border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2">
          <motion.button
            onClick={onBackToMenu}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white/15 hover:bg-white/25 text-white p-1.5 rounded-lg transition-colors"
            title="Voltar ao Menu"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
          </motion.button>
          <span className="text-white font-bold text-sm">🐱 Cat Tetris</span>
        </div>

        <div className="flex items-center gap-3 text-xs text-white/70">
          <span className="text-yellow-400 font-bold">{gameState.score.points.toLocaleString()} pts</span>
          <span>Nv.{gameState.score.level}</span>
          <span>{gameState.score.lines} linhas</span>
        </div>

        <div className="flex items-center gap-1.5">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={gameState.isPaused ? actions.resume : actions.pause}
            disabled={gameState.gameOver}
            className="bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded-lg text-xs transition-colors disabled:opacity-50"
          >
            {gameState.isPaused ? '▶️' : '⏸️'}
          </motion.button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center overflow-hidden p-2">
        <div className="flex flex-col lg:flex-row gap-2 items-center justify-center">
          <div className="hidden lg:flex flex-col lg:flex-row gap-2 items-center justify-center">
            <div className="flex flex-col gap-2">
              <HeldPiece
                heldPiece={gameState.heldPiece}
                canHold={gameState.canHold}
              />

              <NextPieces pieces={gameState.nextPieces} />
            </div>

            <div className="flex flex-col items-center">
              <TetrisBoard
                board={gameState.board}
                currentPiece={gameState.currentPiece}
                dropPreview={dropPreview}
                gameOver={gameState.gameOver}
              />

              <Controls
                onMove={actions.movePiece}
                onRotate={actions.rotatePiece}
                onHardDrop={actions.hardDrop}
                onPause={gameState.isPaused ? actions.resume : actions.pause}
                onHold={actions.holdPiece}
                isPaused={gameState.isPaused}
                gameOver={gameState.gameOver}
                canHold={gameState.canHold}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Scoreboard
                score={gameState.score.points}
                level={gameState.score.level}
                lines={gameState.score.lines}
                combo={gameState.score.combo}
              />
            </div>
          </div>

          <div className="flex lg:hidden flex-col w-full h-full" data-testid="mobile-layout">
            <div className="flex justify-between items-center mb-2 px-2 bg-black/30 rounded-lg mx-2 py-1">
              <div className="text-white text-sm">
                <span className="text-yellow-400 font-bold">{gameState.score.points.toLocaleString()}</span>
                <span className="text-white/60 ml-2">Nv.{gameState.score.level}</span>
              </div>

              <div className="flex items-center gap-2">
                {gameState.heldPiece && (
                  <div className="text-xs text-white/60">💾</div>
                )}
                <div className="text-xs text-white/60">Próxima:</div>
                <div className="bg-gray-800/50 p-1 rounded">
                  {gameState.nextPieces[0] ? (
                    <div className="grid gap-0.5" style={{
                      gridTemplateColumns: `repeat(${Math.max(...gameState.nextPieces[0].shape.map(row => row.length))}, 8px)`,
                      gridTemplateRows: `repeat(${gameState.nextPieces[0].shape.length}, 8px)`
                    }}>
                      {gameState.nextPieces[0].shape.map((row, y) =>
                        row.map((cell, x) => (
                          <div
                            key={`next-${x}-${y}`}
                            className="w-2 h-2 rounded-sm"
                            style={{
                              backgroundColor: cell ? getPieceColor(gameState.nextPieces[0].color) : 'transparent',
                              border: cell ? '1px solid rgba(255,255,255,0.3)' : 'none'
                            }}
                          >
                            {cell && gameState.nextPieces[0].emoji ? (
                              <span className="text-[6px] leading-none block text-center">{gameState.nextPieces[0].emoji}</span>
                            ) : null}
                          </div>
                        ))
                      )}
                    </div>
                  ) : (
                    <div className="w-8 h-6 flex items-center justify-center">
                      <span className="text-xs text-white/40">?</span>
                    </div>
                  )}</div>
              </div>
            </div>

            <div className="flex items-center justify-center flex-1 relative px-1">
              <div className="flex flex-col gap-1 mr-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onTouchStart={() => actions.rotatePiece()}
                  onClick={() => actions.rotatePiece()}
                  disabled={gameState.gameOver}
                  className="bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 disabled:opacity-50 touch-manipulation text-lg"
                >
                  🔄
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onTouchStart={() => actions.movePiece('left')}
                  onClick={() => actions.movePiece('left')}
                  disabled={gameState.gameOver}
                  className="bg-gray-600 text-white p-4 rounded-lg shadow-lg hover:bg-gray-700 disabled:opacity-50 touch-manipulation text-lg"
                >
                  ⬅️
                </motion.button>
              </div>

              <div className="flex-shrink-0 mx-1">
                <TetrisBoard
                  board={gameState.board}
                  currentPiece={gameState.currentPiece}
                  dropPreview={dropPreview}
                  gameOver={gameState.gameOver}
                />
              </div>

              <div className="flex flex-col gap-1 ml-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onTouchStart={handleHardDropWithDelay}
                  onClick={handleHardDropWithDelay}
                  disabled={gameState.gameOver || actionCooldowns.hardDrop}
                  className={`text-white p-4 rounded-full shadow-lg disabled:opacity-50 touch-manipulation text-lg ${
                    actionCooldowns.hardDrop
                      ? 'bg-red-400'
                      : 'bg-red-500 hover:bg-red-600'
                  }`}
                >
                  ⚡
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onTouchStart={() => actions.movePiece('right')}
                  onClick={() => actions.movePiece('right')}
                  disabled={gameState.gameOver}
                  className="bg-gray-600 text-white p-4 rounded-lg shadow-lg hover:bg-gray-700 disabled:opacity-50 touch-manipulation text-lg"
                >
                  ➡️
                </motion.button>
              </div>
            </div>

            <div className="flex justify-center gap-2 py-2 px-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onTouchStart={() => actions.movePiece('down')}
                onClick={() => actions.movePiece('down')}
                disabled={gameState.gameOver}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-600 disabled:opacity-50 touch-manipulation"
              >
                ⬇️ Acelerar
              </motion.button>

              {gameState.canHold && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onTouchStart={handleHoldWithDelay}
                  onClick={handleHoldWithDelay}
                  disabled={gameState.gameOver || !gameState.canHold || actionCooldowns.hold}
                  className={`text-white px-4 py-2 rounded-lg shadow-lg disabled:opacity-50 touch-manipulation ${
                    actionCooldowns.hold
                      ? 'bg-green-400'
                      : gameState.canHold
                        ? 'bg-green-600 hover:bg-green-500'
                        : 'bg-gray-500'
                  }`}
                >
                  💾 Guardar
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onTouchStart={handlePauseWithDelay}
                onClick={handlePauseWithDelay}
                disabled={gameState.gameOver || actionCooldowns.pause}
                className={`text-white px-4 py-2 rounded-lg shadow-lg disabled:opacity-50 touch-manipulation ${
                  actionCooldowns.pause
                    ? 'bg-yellow-400'
                    : 'bg-yellow-500 hover:bg-yellow-600'
                }`}
              >
                {gameState.isPaused ? '▶️' : '⏸️'}
              </motion.button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {gameState.gameOver && (
            <GameOverScreen
              score={gameState.score}
              onRestart={onRestart}
              onBackToMenu={onBackToMenu}
            />
          )}
        </AnimatePresence>

        <GamepadIndicator
          isConnected={isGamepadActive}
          controllerCount={controllerCount}
          gamepadInfo={getGamepadInfo()}
        />
      </div>
    </div>
  );
}

function GameComponent() {
  const [currentScreen, setCurrentScreen] = useState('menu');
  const [showSettings, setShowSettings] = useState(false);
  const [showPWAPrompt, setShowPWAPrompt] = useState(false);
  const [canInstallPWA, setCanInstallPWA] = useState(false);
  const [hasActiveGame, setHasActiveGame] = useState(false);
  const [showMissions, setShowMissions] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showGameModes, setShowGameModes] = useState(false);
  const [showMultiplayer, setShowMultiplayer] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  const [showTutorialHub, setShowTutorialHub] = useState(false);
  const [rewardNotification, setRewardNotification] = useState(null);
  const [multiplayerMatch, setMultiplayerMatch] = useState(null);
  const [showAIShowcase, setShowAIShowcase] = useState(false);

  const { gameState, actions } = useGameService();

  React.useEffect(() => {
    errorLogger.setGameStateProvider(() => {
      try {
        const gs = serviceContainer.resolve('gameService');
        return gs.getGameState();
      } catch { return null; }
    });
  }, []);
  const { settings, updateSettings } = useSettings();
  const { startBackgroundMusic, startGameMusic, stopMusic } = useBackgroundMusic();
  const {
    isGamepadActive,
    controllerCount,
    processGamepadInput,
    getGamepadInfo
  } = useGamepad(actions);

  useMissions();
  useAchievements();
  usePlayerStats();
  useShop();
  useGameModes();

  useSoundManager();

  const isInGame = currentScreen === 'game';
  const { setDAS, setARR } = useKeyboardInput(actions, gameState, isInGame);

  React.useEffect(() => {
    if (settings?.das != null) setDAS(settings.das);
    if (settings?.arr != null) setARR(settings.arr);
  }, [settings?.das, settings?.arr, setDAS, setARR]);

  React.useEffect(() => {
    const handleModeChanged = (event) => {
      try {
        const gameService = serviceContainer.resolve('gameService');
        gameService.setGameMode(event.detail.mode);
      } catch (error) {

      }
    };

    window.addEventListener('gameModeChanged', handleModeChanged);
    return () => window.removeEventListener('gameModeChanged', handleModeChanged);
  }, []);

  React.useEffect(() => {
    if (gameState && !gameState.gameOver && gameState.score.points > 0 && gameState.isPlaying) {
      setHasActiveGame(true);
    } else {
      setHasActiveGame(false);
    }
  }, [gameState]);

  React.useEffect(() => {
    if (startBackgroundMusic && stopMusic && settings?.soundEnabled) {
      if (currentScreen === 'menu') {
        startBackgroundMusic();
      } else if (currentScreen === 'game') {
        startGameMusic();
      }
    } else {
      stopMusic();
    }

    return () => {
      stopMusic();
    };
  }, [currentScreen, settings?.soundEnabled, startBackgroundMusic, startGameMusic, stopMusic]);

  React.useEffect(() => {
    if (isGamepadActive && currentScreen === 'game') {
      const gamepadInterval = setInterval(() => {
        processGamepadInput();
      }, 16);

      return () => clearInterval(gamepadInterval);
    }
  }, [isGamepadActive, currentScreen, processGamepadInput]);

  React.useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setCanInstallPWA(true);
    };

    const handleAppInstalled = () => {
      setCanInstallPWA(false);
      setShowPWAPrompt(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setCanInstallPWA(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleSettingsChange = (newSettings) => {
    updateSettings(newSettings);

    if (newSettings.das != null) setDAS(newSettings.das);
    if (newSettings.arr != null) setARR(newSettings.arr);

    if (newSettings.soundEnabled) {
      if (currentScreen === 'menu') {
        startBackgroundMusic?.();
      } else if (currentScreen === 'game') {
        startGameMusic?.();
      }
    } else {
      stopMusic?.();
    }
  };

  const handleStartGame = () => {
    setCurrentScreen('game');
    if (settings?.soundEnabled) {
      startGameMusic?.();
    }
    if (gameState?.gameOver) {
      actions.restart();
    } else if (gameState?.isPaused) {
      actions.resume();
    } else if (!gameState?.isPlaying) {

      actions.restart();
    }
  };

  const handleContinueGame = () => {
    setCurrentScreen('game');
    if (settings?.soundEnabled) {
      startGameMusic?.();
    }
    if (gameState?.isPaused) {
      actions.resume();
    }
  };

  const handleNewGame = () => {
    setCurrentScreen('game');
    if (settings?.soundEnabled) {
      startGameMusic?.();
    }
    actions.restart();
  };

  const handleRestartGame = () => {
    actions.restart();
    setCurrentScreen('game');
  };

  const handleBackToMenu = () => {
    setCurrentScreen('menu');
    if (settings?.soundEnabled) {
      startBackgroundMusic?.();
    }
    if (gameState && !gameState.gameOver) {
      actions.pause();
    }
  };

  const handleShowSettings = () => {
    if (currentScreen === 'menu') {
      setShowSettings(true);
    } else {
      setShowSettings(!showSettings);
    }
  };

  const handleShowInstallPrompt = () => {
    setShowPWAPrompt(true);
  };

  if (showAIShowcase) {
    return (
      <AIShowcase onClose={() => setShowAIShowcase(false)} />
    );
  }

  if (multiplayerMatch) {
    return (
      <MultiplayerGame
        mode={multiplayerMatch.mode}
        aiDifficulty={multiplayerMatch.aiDifficulty}
        ai1Difficulty={multiplayerMatch.ai1Difficulty}
        ai2Difficulty={multiplayerMatch.ai2Difficulty}
        onExit={() => {
          setMultiplayerMatch(null);
          setCurrentScreen('menu');
        }}
      />
    );
  }

  if (currentScreen === 'menu') {
    return (
      <>
        <MainMenu
          onStartGame={hasActiveGame ? handleContinueGame : handleStartGame}
          onNewGame={handleNewGame}
          onShowSettings={() => setShowSettings(true)}
          onShowGameModes={() => setShowGameModes(true)}
          onShowShop={() => setShowShop(true)}
          onShowMissions={() => setShowMissions(true)}
          onShowAchievements={() => setShowAchievements(true)}
          onShowMultiplayer={() => setShowMultiplayer(true)}
          onShowTutorial={() => setShowTutorial(true)}
          onShowTutorialHub={() => setShowTutorialHub(true)}
          onShowAIShowcase={() => setShowAIShowcase(true)}
          onShowInstallPrompt={handleShowInstallPrompt}
          canInstallPWA={canInstallPWA}
          hasActiveGame={hasActiveGame}
          gameState={gameState}
        />

        <AnimatePresence>
          {showMultiplayer && (
            <MultiplayerPanel
              onClose={() => setShowMultiplayer(false)}
              onStartMatch={(match) => {
                setShowMultiplayer(false);
                setMultiplayerMatch(match);
              }}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showGameModes && (
            <GameModesPanel
              onClose={() => setShowGameModes(false)}
              onStartGame={handleNewGame}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showShop && (
            <ShopPanel
              onClose={() => setShowShop(false)}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showMissions && (
            <DailyMissionsPanel
              onClose={() => setShowMissions(false)}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showAchievements && (
            <AchievementsPanel
              onClose={() => setShowAchievements(false)}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showTutorialHub && (
            <TutorialHub
              tutorialService={serviceContainer.resolve('tutorialService')}
              onClose={() => setShowTutorialHub(false)}
              onLessonComplete={(result) => {
                if (!result || !result.rewards) return;

                try {
                  const currencyService = serviceContainer.resolve('currencyService');
                  if (result.rewards.fishCoins) {
                    currencyService.addFish(
                      result.rewards.fishCoins,
                      `Tutorial: ${result.lessonTitle || 'Lesson'}`
                    );
                  }
                } catch (e) {

                }

                try {
                  if (result.rewards.xp) {
                    const playerStatsService = serviceContainer.resolve('playerStatsService');
                    playerStatsService.incrementStat('totalPlayTime', result.rewards.xp);
                  }
                } catch (e) {

                }

                try {
                  if (result.rewards.achievement) {
                    const achievementsService = serviceContainer.resolve('achievementsService');
                    const playerStatsService = serviceContainer.resolve('playerStatsService');
                    achievementsService.checkAchievements(playerStatsService.getStats());
                  }
                } catch (e) {

                }

                setRewardNotification(result);
              }}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          <Suspense fallback={<LoadingSpinner />}>
            <SettingsMenu
              isOpen={showSettings}
              settings={settings || {}}
              onSettingsChange={handleSettingsChange}
              onClose={() => setShowSettings(false)}
            />
          </Suspense>
        </AnimatePresence>

        {showPWAPrompt && (
          <PWAInstallPrompt onClose={() => setShowPWAPrompt(false)} />
        )}

        <AchievementNotification />

        <AnimatePresence>
          {rewardNotification && (
            <RewardNotification
              reward={rewardNotification}
              onClose={() => setRewardNotification(null)}
            />
          )}
        </AnimatePresence>
      </>
    );
  }

  if (!gameState) {
    return (
      <div className="h-screen cat-bg flex items-center justify-center overflow-hidden">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <>
      <GameScreen
        gameState={gameState}
        actions={actions}
        onBackToMenu={handleBackToMenu}
        onRestart={handleRestartGame}
        isGamepadActive={isGamepadActive}
        controllerCount={controllerCount}
        getGamepadInfo={getGamepadInfo}
      />

      <AnimatePresence>
        {showTutorial && (
          <Tutorial onComplete={() => setShowTutorial(false)} />
        )}
      </AnimatePresence>
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <GameComponent />
      <ToastNotification />
    </ErrorBoundary>
  );
}

export default App;
