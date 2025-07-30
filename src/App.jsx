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

          {/* 📱 MOBILE LAYOUT OTIMIZADO */}
          <div className="flex lg:hidden flex-col w-full h-full" data-testid="mobile-layout">
            {/* 📊 Informações compactas no topo */}
            <div className="flex justify-between items-center mb-2 px-2">
              <div className="flex gap-2">
                <HeldPiece 
                  heldPiece={gameState.heldPiece}
                  canHold={gameState.canHold}
                />
                <NextPieces pieces={gameState.nextPieces} />
              </div>
              
              <div className="flex-shrink-0">
                <Scoreboard 
                  score={gameState.score.points}
                  level={gameState.score.level}
                  lines={gameState.score.lines}
                  combo={gameState.score.combo}
                />
              </div>
            </div>
            
            {/* 🎮 ÁREA PRINCIPAL DE JOGO - Layout Horizontal */}
            <div className="flex items-center justify-center flex-1 relative px-2">
              {/* 🎯 Controles ESQUERDA (movimento) */}
              <div className="flex flex-col gap-2 mr-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onTouchStart={() => actions.rotatePiece()}
                  onClick={() => actions.rotatePiece()}
                  disabled={gameState.gameOver}
                  className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 disabled:opacity-50 touch-manipulation"
                >
                  🔄
                </motion.button>
                
                <div className="grid grid-rows-3 gap-1">
                  <div></div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onTouchStart={() => actions.movePiece('left')}
                    onClick={() => actions.movePiece('left')}
                    disabled={gameState.gameOver}
                    className="bg-gray-600 text-white p-3 rounded-lg shadow-lg hover:bg-gray-700 disabled:opacity-50 touch-manipulation"
                  >
                    ⬅️
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onTouchStart={() => actions.movePiece('down')}
                    onClick={() => actions.movePiece('down')}
                    disabled={gameState.gameOver}
                    className="bg-gray-600 text-white p-3 rounded-lg shadow-lg hover:bg-gray-700 disabled:opacity-50 touch-manipulation"
                  >
                    ⬇️
                  </motion.button>
                </div>
              </div>
              
              {/* 🎯 TABULEIRO CENTRAL */}
              <div className="flex-shrink-0">
                <TetrisBoard 
                  board={gameState.board} 
                  currentPiece={gameState.currentPiece}
                  dropPreview={actions.getDropPreview()}
                  gameOver={gameState.gameOver}
                />
              </div>
              
              {/* 🎯 Controles DIREITA (ações) */}
              <div className="flex flex-col gap-2 ml-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onTouchStart={() => actions.hardDrop()}
                  onClick={() => actions.hardDrop()}
                  disabled={gameState.gameOver}
                  className="bg-red-500 text-white p-3 rounded-full shadow-lg hover:bg-red-600 disabled:opacity-50 touch-manipulation"
                >
                  ⚡
                </motion.button>
                
                <div className="grid grid-rows-3 gap-1">
                  <div></div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onTouchStart={() => actions.movePiece('right')}
                    onClick={() => actions.movePiece('right')}
                    disabled={gameState.gameOver}
                    className="bg-gray-600 text-white p-3 rounded-lg shadow-lg hover:bg-gray-700 disabled:opacity-50 touch-manipulation"
                  >
                    ➡️
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onTouchStart={() => actions.holdPiece()}
                    onClick={() => actions.holdPiece()}
                    disabled={gameState.gameOver || !gameState.canHold}
                    className={`p-3 rounded-lg shadow-lg disabled:opacity-50 touch-manipulation ${
                      gameState.canHold 
                        ? 'bg-green-500 text-white hover:bg-green-600' 
                        : 'bg-gray-500 text-white'
                    }`}
                  >
                    💾
                  </motion.button>
                </div>
              </div>
            </div>
            
            {/* 🎮 Botão de pausa na parte inferior */}
            <div className="flex justify-center py-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onTouchStart={() => gameState.isPaused ? actions.resume() : actions.pause()}
                onClick={() => gameState.isPaused ? actions.resume() : actions.pause()}
                disabled={gameState.gameOver}
                className="bg-yellow-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-yellow-600 disabled:opacity-50 touch-manipulation"
              >
                {gameState.isPaused ? '▶️ Continuar' : '⏸️ Pausar'}
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

        {/* 🎮 Gamepad Indicator */}
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
  } = useGamepad();
  
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

  // 🎵 Controlar música baseado na tela atual e configurações
  React.useEffect(() => {
    if (!settings?.soundEnabled) {
      stopMusic();
      return;
    }

    if (currentScreen === 'menu') {
      startBackgroundMusic();
    } else if (currentScreen === 'game') {
      startGameMusic();
    }

    return () => {
      // Cleanup quando componente desmonta
      stopMusic();
    };
     }, [currentScreen, settings?.soundEnabled, startBackgroundMusic, startGameMusic, stopMusic]);

  // 🎮 Gamepad input processing - MAIS RESPONSIVO
  React.useEffect(() => {
    if (!isGamepadActive || currentScreen !== 'game') return;

    const gamepadInterval = setInterval(() => {
      processGamepadInput(actions);
    }, 16); // Check gamepad input every 16ms (~60fps) para fluidez máxima

    return () => {
      clearInterval(gamepadInterval);
    };
  }, [isGamepadActive, currentScreen, processGamepadInput, actions]);

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

  const handleSettingsChange = async (newSettings) => {
    try {
      await updateSettings(newSettings);
      
      // 🎵 Controlar música baseado nas configurações
      if (newSettings.soundEnabled) {
        if (currentScreen === 'menu') {
          startBackgroundMusic();
        } else if (currentScreen === 'game') {
          startGameMusic();
        }
      } else {
        stopMusic();
      }
    } catch (error) {
      console.error('Failed to update settings:', error);
    }
  };

  const handleStartGame = () => {
    setCurrentScreen('game');
    if (gameState?.gameOver) {
      actions.restart();
    } else if (gameState?.isPaused) {
      actions.resume();
    }
    
    // 🎮 Iniciar música de jogo se som estiver habilitado
    if (settings?.soundEnabled) {
      startGameMusic();
    }
  };

  const handleContinueGame = () => {
    setCurrentScreen('game');
    if (gameState?.isPaused) {
      actions.resume();
    }
    
    // 🎮 Continuar música de jogo se som estiver habilitado
    if (settings?.soundEnabled) {
      startGameMusic();
    }
  };

  const handleNewGame = () => {
    setCurrentScreen('game');
    actions.restart();
    
    // 🎮 Iniciar música de jogo se som estiver habilitado
    if (settings?.soundEnabled) {
      startGameMusic();
    }
  };

  const handleBackToMenu = () => {
    setCurrentScreen('menu');
    if (gameState && !gameState.gameOver) {
      actions.pause();
    }
    
    // 🏠 Voltar para música ambiente se som estiver habilitado
    if (settings?.soundEnabled) {
      startBackgroundMusic();
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