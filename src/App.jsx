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
  statistics
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

          <div className="flex lg:hidden flex-col gap-4 w-full max-w-md" data-testid="mobile-layout">
            <div className="flex gap-4">
              <HeldPiece 
                heldPiece={gameState.heldPiece}
                canHold={gameState.canHold}
              />
              <NextPieces pieces={gameState.nextPieces} />
            </div>
            
            <TetrisBoard 
              board={gameState.board} 
              currentPiece={gameState.currentPiece}
              dropPreview={actions.getDropPreview()}
              gameOver={gameState.gameOver}
            />
            
            <Scoreboard 
              score={gameState.score.points}
              level={gameState.score.level}
              lines={gameState.score.lines}
              combo={gameState.score.combo}
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
      </motion.div>
    </div>
  );
}

function GameComponent() {
  const [currentScreen, setCurrentScreen] = useState('menu'); // 'menu' | 'game'
  const [showStats, setShowStats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPWAPrompt, setShowPWAPrompt] = useState(false);
  const [canInstallPWA, setCanInstallPWA] = useState(false);
  const [hasActiveGame, setHasActiveGame] = useState(false);

  const { gameState, actions } = useGameService();
  const { settings, updateSettings } = useSettings();
  const { statistics } = useStatistics();
  
  useSoundManager();
  
  const isInGame = currentScreen === 'game';
  useKeyboardInput(actions, gameState, isInGame);

  // Check if there's an active game that can be continued
  React.useEffect(() => {
    if (gameState && !gameState.gameOver && gameState.score.points > 0 && gameState.isPlaying) {
      setHasActiveGame(true);
    } else {
      setHasActiveGame(false);
    }
  }, [gameState]);

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
  };

  const handleContinueGame = () => {
    setCurrentScreen('game');
    if (gameState?.isPaused) {
      actions.resume();
    }
  };

  const handleNewGame = () => {
    setCurrentScreen('game');
    actions.restart();
  };

  const handleBackToMenu = () => {
    setCurrentScreen('menu');
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