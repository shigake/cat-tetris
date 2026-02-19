import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { serviceContainer } from '../core/container/ServiceRegistration';
import { gameEvents, GAME_EVENTS } from '../patterns/Observer';
import TetrisBoard from './TetrisBoard';
import NextPieces from './NextPieces';
import HeldPiece from './HeldPiece';
import Scoreboard from './Scoreboard';

/**
 * MultiplayerGame - Jogo multiplayer (1v1 Local ou vs IA)
 */
function MultiplayerGame({ mode, aiDifficulty, onExit }) {
  const [player1State, setPlayer1State] = useState(null);
  const [player2State, setPlayer2State] = useState(null);
  const [winner, setWinner] = useState(null);
  const [gameServices, setGameServices] = useState({ p1: null, p2: null });

  // Inicializar jogos
  useEffect(() => {
    const multiplayerService = serviceContainer.resolve('multiplayerService');
    
    // Criar instâncias de GameService para cada jogador
    const p1Service = serviceContainer.resolve('gameService');
    const p2Service = mode === 'vsAI' 
      ? serviceContainer.resolve('aiOpponentService') 
      : serviceContainer.resolve('gameService');

    p1Service.initializeGame();
    if (mode === 'vsAI') {
      p2Service.setDifficulty(aiDifficulty || 'medium');
      p2Service.startGame();
    } else {
      p2Service.initializeGame();
    }

    setGameServices({ p1: p1Service, p2: p2Service });
    setPlayer1State(p1Service.getState());
    setPlayer2State(mode === 'vsAI' ? p2Service.getAIState() : p2Service.getState());

    // Escutar game over
    const handleP1GameOver = () => {
      if (!winner) {
        setWinner('player2');
        multiplayerService.recordMatch({
          mode,
          winner: 'player2',
          p1Score: p1Service.getState().score?.points || 0,
          p2Score: mode === 'vsAI' 
            ? p2Service.getAIState().score 
            : p2Service.getState().score?.points || 0
        });
      }
    };

    const handleP2GameOver = () => {
      if (!winner) {
        setWinner('player1');
        multiplayerService.recordMatch({
          mode,
          winner: 'player1',
          p1Score: p1Service.getState().score?.points || 0,
          p2Score: mode === 'vsAI' 
            ? p2Service.getAIState().score 
            : p2Service.getState().score?.points || 0
        });
      }
    };

    // Subscribe to game over events
    // TODO: Need separate event emitters per game instance
    // For now, check game over in update loop

    return () => {
      // Cleanup
    };
  }, [mode, aiDifficulty, winner]);

  // Game loop
  useEffect(() => {
    if (!gameServices.p1 || !gameServices.p2) return;

    const interval = setInterval(() => {
      // Update P1
      const p1State = gameServices.p1.getState();
      setPlayer1State(p1State);

      // Check P1 game over
      if (p1State.gameOver && !winner) {
        setWinner('player2');
      }

      // Update P2
      if (mode === 'vsAI') {
        gameServices.p2.update(); // AI makes moves
        const p2State = gameServices.p2.getAIState();
        setPlayer2State(p2State);

        // Check P2 game over
        if (p2State.gameOver && !winner) {
          setWinner('player1');
        }
      } else {
        const p2State = gameServices.p2.getState();
        setPlayer2State(p2State);

        // Check P2 game over
        if (p2State.gameOver && !winner) {
          setWinner('player1');
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [gameServices, mode, winner]);

  // Player 1 controls (WASD + Q for rotate, E for hold, Space for hard drop)
  useEffect(() => {
    if (!gameServices.p1 || winner) return;

    const handleP1Input = (e) => {
      switch(e.key.toLowerCase()) {
        case 'a':
          gameServices.p1.movePiece('left');
          break;
        case 'd':
          gameServices.p1.movePiece('right');
          break;
        case 's':
          gameServices.p1.movePiece('down');
          break;
        case 'w':
        case 'q':
          gameServices.p1.rotatePiece();
          break;
        case 'e':
          gameServices.p1.holdPiece();
          break;
        case ' ':
          if (e.shiftKey) { // Shift+Space for P1
            e.preventDefault();
            gameServices.p1.hardDrop();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleP1Input);
    return () => window.removeEventListener('keydown', handleP1Input);
  }, [gameServices, winner]);

  // Player 2 controls (Arrows + NumPad for rotate/hold)
  useEffect(() => {
    if (!gameServices.p2 || winner || mode === 'vsAI') return;

    const handleP2Input = (e) => {
      switch(e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          gameServices.p2.movePiece('left');
          break;
        case 'ArrowRight':
          e.preventDefault();
          gameServices.p2.movePiece('right');
          break;
        case 'ArrowDown':
          e.preventDefault();
          gameServices.p2.movePiece('down');
          break;
        case 'ArrowUp':
          e.preventDefault();
          gameServices.p2.rotatePiece();
          break;
        case 'Control': // Right Ctrl for hold
          gameServices.p2.holdPiece();
          break;
        case 'Enter': // Enter for hard drop
          e.preventDefault();
          gameServices.p2.hardDrop();
          break;
      }
    };

    window.addEventListener('keydown', handleP2Input);
    return () => window.removeEventListener('keydown', handleP2Input);
  }, [gameServices, winner, mode]);

  if (!player1State || !player2State) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900">
        <div className="text-white text-2xl">Carregando multiplayer...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900 p-4">
      {/* Header */}
      <div className="flex justify-between items-center w-full max-w-7xl mb-4">
        <h1 className="text-3xl font-bold text-white">
          {mode === 'vsAI' ? '🤖 vs IA' : '👥 1v1 Local'}
        </h1>
        <button
          onClick={onExit}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          ← Sair
        </button>
      </div>

      {/* Split Screen */}
      <div className="flex gap-8 items-start">
        {/* Player 1 */}
        <div className="flex flex-col items-center">
          <div className="bg-blue-600 text-white px-6 py-2 rounded-t-lg font-bold text-xl">
            {mode === 'vsAI' ? '🎮 VOCÊ' : '🎮 PLAYER 1'}
          </div>
          <div className="bg-black/40 p-4 rounded-b-lg">
            <div className="flex gap-4">
              {/* Hold */}
              <div className="flex flex-col gap-4">
                <HeldPiece heldPiece={player1State.heldPiece} />
                <div className="text-white/60 text-xs">WASD + Q/E</div>
              </div>

              {/* Board */}
              <TetrisBoard
                board={player1State.board}
                currentPiece={player1State.currentPiece}
                dropPreview={player1State.dropPreview}
                clearingLines={player1State.clearingLines || []}
              />

              {/* Next + Score */}
              <div className="flex flex-col gap-4">
                <NextPieces nextPieces={player1State.nextPieces || []} />
                <Scoreboard score={player1State.score} />
              </div>
            </div>
          </div>
        </div>

        {/* VS Badge */}
        <div className="flex items-center justify-center h-full">
          <div className="bg-yellow-500 text-black font-bold text-4xl px-8 py-4 rounded-full shadow-2xl animate-pulse">
            VS
          </div>
        </div>

        {/* Player 2 / AI */}
        <div className="flex flex-col items-center">
          <div className="bg-red-600 text-white px-6 py-2 rounded-t-lg font-bold text-xl">
            {mode === 'vsAI' ? `🤖 IA (${aiDifficulty?.toUpperCase()})` : '🎮 PLAYER 2'}
          </div>
          <div className="bg-black/40 p-4 rounded-b-lg">
            <div className="flex gap-4">
              {/* Hold */}
              <div className="flex flex-col gap-4">
                <HeldPiece heldPiece={player2State.heldPiece} />
                {mode === '1v1' && (
                  <div className="text-white/60 text-xs">Arrows + Enter</div>
                )}
              </div>

              {/* Board */}
              <TetrisBoard
                board={player2State.board}
                currentPiece={player2State.currentPiece}
                dropPreview={player2State.dropPreview}
                clearingLines={player2State.clearingLines || []}
              />

              {/* Next + Score */}
              <div className="flex flex-col gap-4">
                <NextPieces nextPieces={player2State.nextPieces || []} />
                <Scoreboard score={player2State.score} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Win/Loss Screen */}
      <AnimatePresence>
        {winner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl p-12 text-center"
            >
              <div className="text-8xl mb-4">
                {winner === 'player1' ? '🏆' : '💀'}
              </div>
              <h2 className="text-5xl font-bold text-white mb-4">
                {winner === 'player1' ? 'VITÓRIA!' : 'DERROTA!'}
              </h2>
              <p className="text-2xl text-white/80 mb-8">
                {winner === 'player1' 
                  ? (mode === 'vsAI' ? 'Você venceu a IA!' : 'Player 1 venceu!') 
                  : (mode === 'vsAI' ? 'IA venceu!' : 'Player 2 venceu!')
                }
              </p>

              {/* Match Stats */}
              <div className="grid grid-cols-2 gap-4 mb-8 text-white">
                <div className="bg-black/30 rounded-lg p-4">
                  <div className="text-sm opacity-60">Player 1</div>
                  <div className="text-3xl font-bold">{player1State.score?.points?.toLocaleString() || 0}</div>
                </div>
                <div className="bg-black/30 rounded-lg p-4">
                  <div className="text-sm opacity-60">{mode === 'vsAI' ? 'IA' : 'Player 2'}</div>
                  <div className="text-3xl font-bold">
                    {mode === 'vsAI' 
                      ? player2State.score?.toLocaleString() || 0
                      : player2State.score?.points?.toLocaleString() || 0
                    }
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  onClick={() => window.location.reload()}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold text-xl transition-colors"
                >
                  🔄 Jogar Novamente
                </button>
                <button
                  onClick={onExit}
                  className="bg-gray-700 hover:bg-gray-800 text-white px-8 py-3 rounded-lg font-bold text-xl transition-colors"
                >
                  ← Menu
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MultiplayerGame;
