import React, { useState } from 'react';
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
import { useSettings } from './hooks/useSettings';
import { useStatistics } from './hooks/useStatistics';
import { useKeyboardInput } from './hooks/useKeyboardInput';
import { useSoundManager } from './hooks/useSoundManager';

function GameComponent() {
  const { gameState, actions } = useGameService();
  const { settings, updateSettings } = useSettings();
  const { statistics } = useStatistics();
  
  useSoundManager();
  useKeyboardInput(actions, gameState);
  
  const [showStats, setShowStats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleSettingsChange = async (newSettings) => {
    try {
      await updateSettings(newSettings);
    } catch (error) {
      console.error('Failed to update settings:', error);
    }
  };

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

          <div className="flex lg:hidden flex-col gap-4 w-full max-w-md">
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
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showStats && statistics && (
            <Statistics 
              stats={statistics}
              onClose={() => setShowStats(false)}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showSettings && settings && (
            <SettingsMenu 
              settings={settings}
              onSettingsChange={handleSettingsChange}
              onClose={() => setShowSettings(false)}
            />
          )}
        </AnimatePresence>
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