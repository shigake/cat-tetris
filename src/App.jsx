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
import { useGameService } from './hooks/useGameService';
import { useSettings } from './hooks/useSettings';
import { useStatistics } from './hooks/useStatistics';
import { useKeyboardInput } from './hooks/useKeyboardInput';
import { useSoundManager } from './hooks/useSoundManager';
import { useBackgroundMusic } from './hooks/useBackgroundMusic';
import { useGamepad } from './hooks/useGamepad';
import GamepadIndicator from './components/GamepadIndicator';
import { getPieceColor } from './utils/PieceGenerator';

const Statistics = lazy(() => import('./components/Statistics'));
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
  onShowStats, 
  onBackToMenu,
  showStats,
  setShowStats,
  statistics,
  isGamepadActive,
  controllerCount,
  getGamepadInfo
}) {
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
    <div className="min-h-screen cat-bg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="game-container rounded-2xl p-6 shadow-2xl relative"
      >
        <motion.button
          onClick={onBackToMenu}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute top-4 left-4 z-10 bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-colors backdrop-blur-sm"
          title="Voltar ao Menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
        </motion.button>

        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-6xl font-cat font-bold text-white mb-2">
            🐱 Cat Tetris 🐱
          </h1>
          <p className="text-white/80 text-lg">Jogue com seus amigos felinos!</p>
          
          <div className="flex gap-4 mb-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBackToMenu}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            >
              🏠 Menu
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onShowStats}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              📊 Estatísticas
            </motion.button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start justify-center">
          <div className="hidden lg:flex lg:flex-row gap-6 items-start justify-center w-full">
            <div className="flex flex-col gap-6 min-w-[200px]">
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
                dropPreview={actions.getDropPreview()}
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

            <div className="flex flex-col gap-6 min-w-[200px]">
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
                  dropPreview={actions.getDropPreview()}
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
              score={gameState.score.points}
              onRestart={actions.restart}
              onBackToMenu={onBackToMenu}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showStats && (
            <Suspense fallback={<LoadingSpinner />}>
              <Statistics 
                stats={statistics || {}}
                onClose={() => setShowStats(false)}
              />
            </Suspense>
          )}
        </AnimatePresence>

        <GamepadIndicator
          isConnected={isGamepadActive}
          controllerCount={controllerCount}
          gamepadInfo={getGamepadInfo()}
        />
      </motion.div>
    </div>
  );
}

function GameComponent() {
  const [currentScreen, setCurrentScreen] = useState('menu');
  const [showStats, setShowStats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPWAPrompt, setShowPWAPrompt] = useState(false);
  const [canInstallPWA, setCanInstallPWA] = useState(false);
  const [hasActiveGame, setHasActiveGame] = useState(false);
  const { gameState, actions } = useGameService();
  const { settings, updateSettings } = useSettings();
  const { statistics } = useStatistics();
  const { startBackgroundMusic, startGameMusic, stopMusic } = useBackgroundMusic();
  const { 
    isGamepadActive, 
    controllerCount, 
    processGamepadInput, 
    getGamepadInfo 
  } = useGamepad(actions);
  
  useSoundManager();
  
  const isInGame = currentScreen === 'game';
  useKeyboardInput(actions, gameState, isInGame);


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

  const handleBackToMenu = () => {
    setCurrentScreen('menu');
    if (settings?.soundEnabled) {
      startBackgroundMusic?.();
    }
    if (gameState && !gameState.gameOver) {
      actions.pause();
    }
  };

  const handleShowStats = () => {
    if (currentScreen === 'menu') {
      setShowStats(true);
    } else {
      setShowStats(!showStats);
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

  if (currentScreen === 'menu') {
    return (
      <>
        <MainMenu
          onStartGame={hasActiveGame ? handleContinueGame : handleStartGame}
          onNewGame={handleNewGame}
          onShowSettings={() => setShowSettings(true)}
          onShowStatistics={() => setShowStats(true)}
          onShowInstallPrompt={handleShowInstallPrompt}
          canInstallPWA={canInstallPWA}
          hasActiveGame={hasActiveGame}
          gameState={gameState}
        />

        <AnimatePresence>
          {showStats && statistics && (
            <Suspense fallback={<LoadingSpinner />}>
              <Statistics 
                stats={statistics}
                onClose={() => setShowStats(false)}
              />
            </Suspense>
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
      </>
    );
  }

  if (!gameState) {
    return (
      <div className="min-h-screen cat-bg flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <GameScreen
      gameState={gameState}
      actions={actions}
      onShowStats={handleShowStats}
      onBackToMenu={handleBackToMenu}
      showStats={showStats}
      setShowStats={setShowStats}
      statistics={statistics}
      isGamepadActive={isGamepadActive}
      controllerCount={controllerCount}
      getGamepadInfo={getGamepadInfo}
    />
  );
}

function App() {
  return (
    <ErrorBoundary>
      <GameComponent />
    </ErrorBoundary>
  );
}

export default App; 