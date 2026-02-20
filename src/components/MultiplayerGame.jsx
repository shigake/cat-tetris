import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { serviceContainer } from '../core/container/ServiceRegistration';
import { GameService } from '../core/services/GameService';
import { AIOpponentService } from '../core/services/AIOpponentService';
import { PieceFactory, MovementStrategyFactory } from '../patterns/Factory';
import { ScoringService } from '../core/services/ScoringService';
import TetrisBoard from './TetrisBoard';
import NextPieces from './NextPieces';
import HeldPiece from './HeldPiece';
import Scoreboard from './Scoreboard';

function MultiplayerGame({ mode, aiDifficulty, ai1Difficulty, ai2Difficulty, onExit }) {
  const [player1State, setPlayer1State] = useState(null);
  const [player2State, setPlayer2State] = useState(null);
  const [winner, setWinner] = useState(null);
  const [p1Garbage, setP1Garbage] = useState(0);
  const [p2Garbage, setP2Garbage] = useState(0);
  const servicesRef = useRef({ p1: null, p2: null, ai: null, ai1: null, ai2: null });
  const lastTimeRef = useRef(0);
  const loopRef = useRef(null);

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
    let ai1Service = null;
    let ai2Service = null;

    if (mode === 'vsAI') {
      try {
        aiService = new AIOpponentService();
        aiService.setDifficulty(aiDifficulty || 'medium');
        if (aiDifficulty === 'expert') {
          p2Service.score._fixedLevel = 1;
        }
      } catch (e) { }
    } else if (mode === 'aiVsAI') {
      ai1Service = new AIOpponentService();
      ai1Service.setDifficulty(ai1Difficulty || 'expert');
      ai2Service = new AIOpponentService();
      ai2Service.setDifficulty(ai2Difficulty || 'expert');
      if ((ai1Difficulty || 'expert') === 'expert') {
        p1Service.score._fixedLevel = 1;
      }
      if ((ai2Difficulty || 'expert') === 'expert') {
        p2Service.score._fixedLevel = 1;
      }
    }

    p1Service.initializeGame();
    p1Service.isPlaying = true;
    p2Service.initializeGame();
    p2Service.isPlaying = true;

    if (mode === 'vsAI' && aiDifficulty === 'expert') {
      p2Service._lockDelayMax = 2000;
      p2Service._lockDelayMaxResets = 50;
    } else if (mode === 'aiVsAI') {
      if ((ai1Difficulty || 'expert') === 'expert') {
        p1Service._lockDelayMax = 2000;
        p1Service._lockDelayMaxResets = 50;
      }
      if ((ai2Difficulty || 'expert') === 'expert') {
        p2Service._lockDelayMax = 2000;
        p2Service._lockDelayMaxResets = 50;
      }
    }

    servicesRef.current = { p1: p1Service, p2: p2Service, ai: aiService, ai1: ai1Service, ai2: ai2Service };
    setPlayer1State(p1Service.getGameState());
    setPlayer2State(p2Service.getGameState());

    return () => {
      if (loopRef.current) cancelAnimationFrame(loopRef.current);
    };
  }, [mode, aiDifficulty, ai1Difficulty, ai2Difficulty]);

  useEffect(() => {
    const gameLoop = (currentTime) => {
      if (!lastTimeRef.current) lastTimeRef.current = currentTime;
      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      const { p1, p2, ai, ai1, ai2 } = servicesRef.current;
      if (!p1 || !p2) { loopRef.current = requestAnimationFrame(gameLoop); return; }

      if (p1.gameOver || p2.gameOver) {
        if (!p1.gameOver) { p1.gameOver = true; p1._markDirty(); }
        if (!p2.gameOver) { p2.gameOver = true; p2._markDirty(); }

        if (p1.isDirty) { setPlayer1State(p1.getGameState()); p1.clearDirty(); }
        if (p2.isDirty) { setPlayer2State(p2.getGameState()); p2.clearDirty(); }
        return;
      }

      if (!p1.isPaused) p1.updateGame(deltaTime);
      if (!p2.isPaused) p2.updateGame(deltaTime);

      const p1Attack = p1.consumeAttack();
      if (p1Attack > 0 && !p2.gameOver) {
        p2.receiveGarbage(p1Attack);
      }
      const p2Attack = p2.consumeAttack();
      if (p2Attack > 0 && !p1.gameOver) {
        p1.receiveGarbage(p2Attack);
      }

      const _execAI = (aiSvc, gameSvc) => {
        if (!aiSvc || gameSvc.gameOver) return;
        try {
          const maxActions = aiSvc._isExpert ? 20 : 1;
          for (let i = 0; i < maxActions; i++) {
            const d = aiSvc.decideNextMove(gameSvc.getGameState());
            if (!d) break;
            switch (d.action) {
              case 'left': gameSvc.movePiece('left'); break;
              case 'right': gameSvc.movePiece('right'); break;
              case 'rotate': gameSvc.rotatePiece(); break;
              case 'down': gameSvc.movePiece('down'); break;
              case 'drop': gameSvc.hardDrop(); break;
              case 'hold': gameSvc.holdPiece(); break;
            }
            if (d.action === 'drop') break;
          }
        } catch (e) { }
      };

      if (mode === 'aiVsAI') {
        _execAI(ai1, p1);
        _execAI(ai2, p2);
      } else if (mode === 'vsAI') {
        _execAI(ai, p2);
      }

      if (p1.isDirty) {
        setPlayer1State(p1.getGameState());
        setP1Garbage(p1.pendingGarbage);
        p1.clearDirty();
      }
      if (p2.isDirty) {
        setPlayer2State(p2.getGameState());
        setP2Garbage(p2.pendingGarbage);
        p2.clearDirty();
      }

      loopRef.current = requestAnimationFrame(gameLoop);
    };

    loopRef.current = requestAnimationFrame(gameLoop);
    return () => { if (loopRef.current) cancelAnimationFrame(loopRef.current); };
  }, [mode]);

  useEffect(() => {
    if (winner || !player1State || !player2State) return;
    if (player1State.gameOver && !player2State.gameOver) setWinner('player2');
    else if (player2State.gameOver && !player1State.gameOver) setWinner('player1');
    else if (player1State.gameOver && player2State.gameOver) {
      setWinner((player1State.score?.points || 0) >= (player2State.score?.points || 0) ? 'player1' : 'player2');
    }
  }, [player1State?.gameOver, player2State?.gameOver, winner]);

  useEffect(() => {
    if (winner || mode === 'aiVsAI') return;
    const handle = (e) => {
      const p1 = servicesRef.current.p1;
      if (!p1 || p1.gameOver) return;
      switch (e.key) {
        case 'ArrowLeft': e.preventDefault(); p1.movePiece('left'); break;
        case 'ArrowRight': e.preventDefault(); p1.movePiece('right'); break;
        case 'ArrowDown': e.preventDefault(); p1.movePiece('down'); break;
        case 'ArrowUp': e.preventDefault(); p1.rotatePiece(); break;
        case 'z': case 'Z': p1.rotatePiece('left'); break;
        case 'c': case 'C': case 'Shift': p1.holdPiece(); break;
        case ' ': e.preventDefault(); p1.hardDrop(); break;
      }
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [winner]);



  const p1DropPreview = React.useMemo(() => {
    if (!player1State?.currentPiece || player1State?.gameOver) return null;
    try { return servicesRef.current.p1?.getDropPreview(); } catch { return null; }
  }, [player1State?.currentPiece?.position?.x, player1State?.currentPiece?.position?.y, player1State?.currentPiece?.type, player1State?.currentPiece?.rotationState]);

  const p2DropPreview = React.useMemo(() => {
    if (!player2State?.currentPiece || player2State?.gameOver) return null;
    try { return servicesRef.current.p2?.getDropPreview(); } catch { return null; }
  }, [player2State?.currentPiece?.position?.x, player2State?.currentPiece?.position?.y, player2State?.currentPiece?.type, player2State?.currentPiece?.rotationState]);

  if (!player1State || !player2State) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900">
        <div className="text-white text-2xl">Carregando multiplayer...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col items-center bg-gradient-to-br from-purple-900 to-blue-900 p-2 overflow-hidden">

      <div className="flex justify-between items-center w-full max-w-5xl mb-2">
        <h1 className="text-xl sm:text-2xl font-bold text-white">
          {mode === 'aiVsAI' ? '🔬 IA vs IA (Debug)' : mode === 'vsAI' ? '🤖 vs IA' : '👥 1v1 Local'}
        </h1>
        <button onClick={onExit} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg transition-colors text-sm font-bold">
          ← Voltar
        </button>
      </div>

      <div className="flex gap-2 sm:gap-4 items-start justify-center flex-wrap">

        <div className="flex flex-col items-center">
          <div className="bg-blue-600 text-white px-4 py-1 rounded-t-lg font-bold text-sm sm:text-base">
            {mode === 'aiVsAI' ? `🤖 IA1 (${ai1Difficulty?.toUpperCase() || 'EXPERT'})` : mode === 'vsAI' ? '🎮 VOCÊ' : '🎮 P1'}
          </div>
          <div className="bg-black/40 p-2 rounded-b-lg">
            <div className="flex gap-2">
              <div className="flex flex-col gap-2">
                <HeldPiece heldPiece={player1State.heldPiece} canHold={player1State.canHold} />
                {mode !== 'aiVsAI' && (
                  <div className="text-white/60 text-[10px] leading-tight">
                    ←→ mover<br/>↑ rotacionar<br/>C segurar<br/>Espaço dropar
                  </div>
                )}
              </div>
              <TetrisBoard board={player1State.board} currentPiece={player1State.currentPiece} dropPreview={p1DropPreview} gameOver={player1State.gameOver} />
              {p1Garbage > 0 && <GarbageMeter count={p1Garbage} />}
              <div className="flex flex-col gap-2">
                <NextPieces pieces={player1State.nextPieces || []} />
                <Scoreboard score={player1State.score?.points || 0} level={player1State.score?.level || 1} lines={player1State.score?.lines || 0} combo={player1State.score?.combo || 0} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center self-center">
          <div className="bg-yellow-500 text-black font-bold text-2xl sm:text-3xl px-4 py-2 rounded-full shadow-2xl animate-pulse">VS</div>
        </div>

        <div className="flex flex-col items-center">
          <div className="bg-red-600 text-white px-4 py-1 rounded-t-lg font-bold text-sm sm:text-base">
            {mode === 'aiVsAI' ? `🤖 IA2 (${ai2Difficulty?.toUpperCase() || 'EXPERT'})` : mode === 'vsAI' ? `🤖 IA (${aiDifficulty?.toUpperCase() || 'MEDIUM'})` : '🎮 P2'}
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
              {p2Garbage > 0 && <GarbageMeter count={p2Garbage} />}
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
              <div className="text-8xl mb-4">{winner === 'player1' ? '🏆' : (mode === 'aiVsAI' ? '🏆' : '💀')}</div>
              <h2 className="text-5xl font-bold text-white mb-4">
                {mode === 'aiVsAI'
                  ? (winner === 'player1' ? 'IA 1 VENCEU!' : 'IA 2 VENCEU!')
                  : (winner === 'player1' ? 'VITÓRIA!' : 'DERROTA!')}
              </h2>
              <p className="text-2xl text-white/80 mb-8">
                {mode === 'aiVsAI'
                  ? `${winner === 'player1' ? ai1Difficulty?.toUpperCase() : ai2Difficulty?.toUpperCase()} é superior!`
                  : winner === 'player1'
                    ? (mode === 'vsAI' ? 'Você venceu a IA!' : 'Player 1 venceu!')
                    : (mode === 'vsAI' ? 'IA venceu!' : 'Player 2 venceu!')}
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8 text-white">
                <div className="bg-black/30 rounded-lg p-4">
                  <div className="text-sm opacity-60">{mode === 'aiVsAI' ? `IA1 (${ai1Difficulty})` : 'Player 1'}</div>
                  <div className="text-3xl font-bold">{(player1State.score?.points || 0).toLocaleString()}</div>
                </div>
                <div className="bg-black/30 rounded-lg p-4">
                  <div className="text-sm opacity-60">{mode === 'aiVsAI' ? `IA2 (${ai2Difficulty})` : mode === 'vsAI' ? 'IA' : 'Player 2'}</div>
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

function GarbageMeter({ count }) {
  const maxDisplay = 20;
  const display = Math.min(count, maxDisplay);
  return (
    <div className="flex flex-col-reverse justify-end w-3 rounded overflow-hidden" style={{ height: 'calc(var(--cell) * 22 + 22px)' }}>
      {Array.from({ length: display }, (_, i) => (
        <div
          key={i}
          className="w-full"
          style={{
            height: `${100 / maxDisplay}%`,
            backgroundColor: count > 8 ? '#ef4444' : count > 4 ? '#f59e0b' : '#ef4444',
            opacity: 0.7 + (i / display) * 0.3,
          }}
        />
      ))}
    </div>
  );
}

export default MultiplayerGame;

