import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TetrisBoard from './components/TetrisBoard';
import Scoreboard from './components/Scoreboard';
import Controls from './components/Controls';
import GameOverScreen from './components/GameOverScreen';
import NextPieces from './components/NextPieces';
import HeldPiece from './components/HeldPiece';
import Statistics from './components/Statistics';
import SettingsMenu from './components/SettingsMenu';
import ErrorBoundary from './components/ErrorBoundary';
import { useGameService } from './hooks/useGameService';
import { useSoundManager } from './hooks/useSoundManager';

function GameComponent() {
  const { 
    gameState, 
    movePiece, 
    rotatePiece, 
    hardDrop, 
    holdPiece, 
    pause, 
    resume, 
    restart, 
    getDropPreview 
  } = useGameService();
  
  useSoundManager();
  
  const [showStats, setShowStats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    volume: 80,
    gameSpeed: 'normal',
    soundEnabled: true,
    particlesEnabled: true
  });

  const [stats, setStats] = useState({
    playTime: 0,
    piecesPlaced: 0,
    linesCleared: 0,
    tSpins: 0,
    backToBack: 0,
    maxCombo: 0,
    tetrisCount: 0,
    linesPerSecond: 0
  });

  useEffect(() => {
    if (gameState?.isPlaying && !gameState?.gameOver && !gameState?.isPaused) {
      const timer = setInterval(() => {
        setStats(prev => ({
          ...prev,
          playTime: prev.playTime + 1
        }));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState?.isPlaying, gameState?.gameOver, gameState?.isPaused]);

  const handleSettingsChange = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem('cat-tetris-settings', JSON.stringify(newSettings));
  };

  useEffect(() => {
    const savedSettings = localStorage.getItem('cat-tetris-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        ['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', ' ', 'Space'].includes(event.key)
      ) {
        event.preventDefault();
      }

      if (gameState?.gameOver) return;

      switch (event.key) {
        case 'ArrowLeft':
          movePiece('left');
          break;
        case 'ArrowRight':
          movePiece('right');
          break;
        case 'ArrowDown':
          movePiece('down');
          break;
        case 'ArrowUp':
          rotatePiece();
          break;
        case ' ':
        case 'Space':
          hardDrop();
          break;
        case 'Shift':
          holdPiece();
          break;
        case 'p':
        case 'P':
          if (gameState?.isPaused) {
            resume();
          } else {
            pause();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePiece, rotatePiece, hardDrop, holdPiece, pause, resume, gameState]);

  if (!gameState) {
    return (
      <div className="min-h-screen cat-bg flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen cat-bg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="game-container rounded-2xl p-6 shadow-2xl"
      >
        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-6xl font-cat font-bold text-white mb-2">
            🐱 Cat Tetris 🐱
          </h1>
          <p className="text-white/80 text-lg">Jogue com seus amigos felinos!</p>
          
          <div className="flex justify-center gap-4 mt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowStats(!showStats)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              📊 Estatísticas
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSettings(true)}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              ⚙️ Configurações
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
                dropPreview={getDropPreview()}
                gameOver={gameState.gameOver}
              />
              
              <Controls 
                onMove={movePiece}
                onRotate={rotatePiece}
                onHardDrop={hardDrop}
                onPause={gameState.isPaused ? resume : pause}
                onHold={holdPiece}
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

          <div className="lg:hidden flex flex-col gap-6 items-center">
            <div className="flex flex-col items-center">
              <TetrisBoard 
                board={gameState.board} 
                currentPiece={gameState.currentPiece}
                dropPreview={getDropPreview()}
                gameOver={gameState.gameOver}
              />
              
              <Controls 
                onMove={movePiece}
                onRotate={rotatePiece}
                onHardDrop={hardDrop}
                onPause={gameState.isPaused ? resume : pause}
                onHold={holdPiece}
                isPaused={gameState.isPaused}
                gameOver={gameState.gameOver}
                canHold={gameState.canHold}
              />
            </div>

            <div className="flex flex-row gap-3 justify-center max-w-full overflow-x-auto">
              <Scoreboard 
                score={gameState.score.points}
                level={gameState.score.level}
                lines={gameState.score.lines}
                combo={gameState.score.combo}
              />
              
              <div className="flex flex-col gap-3">
                <HeldPiece 
                  heldPiece={gameState.heldPiece}
                  canHold={gameState.canHold}
                />
                
                <NextPieces pieces={gameState.nextPieces} />
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {gameState.gameOver && (
            <GameOverScreen 
              score={gameState.score.points}
              onRestart={restart}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showStats && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-6"
            >
              <Statistics stats={stats} />
            </motion.div>
          )}
        </AnimatePresence>

        <SettingsMenu
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          settings={settings}
          onSettingsChange={handleSettingsChange}
        />
      </motion.div>
    </div>
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