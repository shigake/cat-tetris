import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { serviceContainer } from '../core/container/ServiceRegistration';
import { GameService } from '../core/services/GameService';
import { PieceFactory, MovementStrategyFactory } from '../patterns/Factory';
import { ScoringService } from '../core/services/ScoringService';
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
  const servicesRef = useRef({ p1: null, p2: null, ai: null });
  const lastTimeRef = useRef(0);
  const loopRef = useRef(null);

  // Initialize games
  useEffect(() => {
    const p1Service = new GameService(
      new PieceFactory(),
      new MovementStrategyFactory(),
      null,
      new ScoringService()
    );
    const p2Service = new GameService(
      new PieceFactory(),
      new MovementStrategyFactory(),
      null,
      new ScoringService()
    );

    let aiService = null;
    if (mode === 'vsAI') {
      try {
        aiService = serviceContainer.resolve('aiOpponentService');
        aiService.setDifficulty(aiDifficulty || 'medium');
      } catch (e) {
        console.warn('AI opponent service not available:', e);
      }
    }

    p1Service.initializeGame();
    p1Service.isPlaying = true;
    p2Service.initializeGame();
    p2Service.isPlaying = true;

    servicesRef.current = { p1: p1Service, p2: p2Service, ai: aiService };
    setPlayer1State(p1Service.getGameState());
    setPlayer2State(p2Service.getGameState());

    return () => {
      if (loopRef.current) cancelAnimationFrame(loopRef.current);
    };
  }, [mode, aiDifficulty]);

  // Game loop — gravity + AI + state sync
  useEffect(() => {
    const gameLoop = (currentTime) => {
      if (!lastTimeRef.current) lastTimeRef.current = currentTime;
      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      const { p1, p2, ai } = servicesRef.current;
      if (!p1 || !p2) { loopRef.current = requestAnimationFrame(gameLoop); return; }

      if (!p1.gameOver && !p1.isPaused) p1.updateGame(deltaTime);
      if (!p2.gameOver && !p2.isPaused) p2.updateGame(deltaTime);

      if (mode === 'vsAI' && ai && !p2.gameOver) {
        try {
          const decision = ai.decideNextMove(p2.getGameState());
          if (decision) {
            switch (decision.action) {
              case 'left': p2.movePiece('left'); break;
              case 'right': p2.movePiece('right'); break;
              case 'rotate': p2.rotatePiece(); break;
              case 'down': p2.movePiece('down'); break;
              case 'drop': p2.hardDrop(); break;
            }
          }
        } catch (e) { /* AI error — ignore */ }
      }

      setPlayer1State(p1.getGameState());
      setPlayer2State(p2.getGameState());
      loopRef.current = requestAnimationFrame(gameLoop);
    };

    loopRef.current = requestAnimationFrame(gameLoop);
    return () => { if (loopRef.current) cancelAnimationFrame(loopRef.current); };
  }, [mode]);

  // Check winner
  useEffect(() => {
    if (winner || !player1State || !player2State) return;
    if (player1State.gameOver && !player2State.gameOver) setWinner('player2');
    else if (player2State.gameOver && !player1State.gameOver) setWinner('player1');
    else if (player1State.gameOver && player2State.gameOver) {
      setWinner((player1State.score?.points || 0) >= (player2State.score?.points || 0) ? 'player1' : 'player2');
    }
  }, [player1State?.gameOver, player2State?.gameOver, winner]);

  // P1 controls (WASD + Q/E + Space)
  useEffect(() => {
    if (winner) return;
    const handle = (e) => {
      const p1 = servicesRef.current.p1;
      if (!p1 || p1.gameOver) return;
      const key = e.key.toLowerCase();
      switch (key) {
        case 'a': p1.movePiece('left'); break;
        case 'd': p1.movePiece('right'); break;
        case 's': p1.movePiece('down'); break;
        case 'w': case 'q': p1.rotatePiece(); break;
        case 'e': p1.holdPiece(); break;
        case ' ': e.preventDefault(); p1.hardDrop(); break;
      }
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [winner]);

  // P2 controls (Arrows + Enter + Ctrl)
  useEffect(() => {
    if (winner || mode === 'vsAI') return;
    const handle = (e) => {
      const p2 = servicesRef.current.p2;
      if (!p2 || p2.gameOver) return;
      switch (e.key) {
        case 'ArrowLeft': e.preventDefault(); p2.movePiece('left'); break;
        case 'ArrowRight': e.preventDefault(); p2.movePiece('right'); break;
        case 'ArrowDown': e.preventDefault(); p2.movePiece('down'); break;
        case 'ArrowUp': e.preventDefault(); p2.rotatePiece(); break;
        case 'Control': p2.holdPiece(); break;
        case 'Enter': e.preventDefault(); p2.hardDrop(); break;
      }
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [winner, mode]);

  // Drop previews
  const p1DropPreview = React.useMemo(() => {
    if (!player1State?.currentPiece || player1State?.gameOver) return null;
    try { return servicesRef.current.p1?.getDropPreview(); } catch { return null; }
  }, [player1State?.currentPiece?.position?.x, player1State?.currentPiece?.position?.y, player1State?.currentPiece?.type]);

  const p2DropPreview = React.useMemo(() => {
    if (!player2State?.currentPiece || player2State?.gameOver) return null;
    try { return servicesRef.current.p2?.getDropPreview(); } catch { return null; }
  }, [player2State?.currentPiece?.position?.x, player2State?.currentPiece?.position?.y, player2State?.currentPiece?.type]);

  if (!player1State || !player2State) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900">
        <div className="text-white text-2xl">Carregando multiplayer...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col items-center bg-gradient-to-br from-purple-900 to-blue-900 p-2 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center w-full max-w-5xl mb-2">
        <h1 className="text-xl sm:text-2xl font-bold text-white">
          {mode === 'vsAI' ? '🤖 vs IA' : '👥 1v1 Local'}
        </h1>
        <button onClick={onExit} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg transition-colors text-sm font-bold">
          ← Voltar
        </button>
      </div>

      {/* Boards container */}
      <div className="flex gap-2 sm:gap-4 items-start justify-center flex-wrap">
        {/* Player 1 */}
        <div className="flex flex-col items-center">
          <div className="bg-blue-600 text-white px-4 py-1 rounded-t-lg font-bold text-sm sm:text-base">
            {mode === 'vsAI' ? '🎮 VOCÊ' : '🎮 P1'}
          </div>
          <div className="bg-black/40 p-2 rounded-b-lg">
            <div className="flex gap-2">
              <div className="flex flex-col gap-2">
                <HeldPiece heldPiece={player1State.heldPiece} canHold={player1State.canHold} />
                <div className="text-white/60 text-[10px] leading-tight">
                  WASD mover<br/>Q rotacionar<br/>E segurar<br/>Espaço dropar
                </div>
              </div>
              <TetrisBoard board={player1State.board} currentPiece={player1State.currentPiece} dropPreview={p1DropPreview} gameOver={player1State.gameOver} />
              <div className="flex flex-col gap-2">
                <NextPieces pieces={player1State.nextPieces || []} />
                <Scoreboard score={player1State.score?.points || 0} level={player1State.score?.level || 1} lines={player1State.score?.lines || 0} combo={player1State.score?.combo || 0} />
              </div>
            </div>
          </div>
        </div>

        {/* VS badge */}
        <div className="flex items-center justify-center self-center">
          <div className="bg-yellow-500 text-black font-bold text-2xl sm:text-3xl px-4 py-2 rounded-full shadow-2xl animate-pulse">VS</div>
        </div>

        {/* Player 2 / AI */}
        <div className="flex flex-col items-center">
          <div className="bg-red-600 text-white px-4 py-1 rounded-t-lg font-bold text-sm sm:text-base">
            {mode === 'vsAI' ? `🤖 IA (${aiDifficulty?.toUpperCase() || 'MEDIUM'})` : '🎮 P2'}
          </div>
          <div className="bg-black/40 p-2 rounded-b-lg">
            <div className="flex gap-2">
              <div className="flex flex-col gap-2">
                <HeldPiece heldPiece={player2State.heldPiece} canHold={player2State.canHold} />
                {mode === '1v1' && (
                  <div className="text-white/60 text-[10px] leading-tight">
                    Setas mover<br/>↑ rotacionar<br/>Ctrl segurar<br/>Enter dropar
                  </div>
                )}
              </div>
              <TetrisBoard board={player2State.board} currentPiece={player2State.currentPiece} dropPreview={p2DropPreview} gameOver={player2State.gameOver} />
              <div className="flex flex-col gap-2">
                <NextPieces pieces={player2State.nextPieces || []} />
                <Scoreboard score={player2State.score?.points || 0} level={player2State.score?.level || 1} lines={player2State.score?.lines || 0} combo={player2State.score?.combo || 0} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {winner && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
            <motion.div initial={{ scale: 0.8, y: 50 }} animate={{ scale: 1, y: 0 }} className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl p-12 text-center">
              <div className="text-8xl mb-4">{winner === 'player1' ? '🏆' : '💀'}</div>
              <h2 className="text-5xl font-bold text-white mb-4">{winner === 'player1' ? 'VITÓRIA!' : 'DERROTA!'}</h2>
              <p className="text-2xl text-white/80 mb-8">
                {winner === 'player1'
                  ? (mode === 'vsAI' ? 'Você venceu a IA!' : 'Player 1 venceu!')
                  : (mode === 'vsAI' ? 'IA venceu!' : 'Player 2 venceu!')}
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8 text-white">
                <div className="bg-black/30 rounded-lg p-4">
                  <div className="text-sm opacity-60">Player 1</div>
                  <div className="text-3xl font-bold">{(player1State.score?.points || 0).toLocaleString()}</div>
                </div>
                <div className="bg-black/30 rounded-lg p-4">
                  <div className="text-sm opacity-60">{mode === 'vsAI' ? 'IA' : 'Player 2'}</div>
                  <div className="text-3xl font-bold">{(player2State.score?.points || 0).toLocaleString()}</div>
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => window.location.reload()} className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold text-xl transition-colors">🔄 Jogar Novamente</button>
                <button onClick={onExit} className="bg-gray-700 hover:bg-gray-800 text-white px-8 py-3 rounded-lg font-bold text-xl transition-colors">← Menu</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MultiplayerGame;
