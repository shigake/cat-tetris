import { useState, useEffect, useCallback, useRef } from 'react';
import { GameService } from '../core/services/GameService';
import { PieceFactory, MovementStrategyFactory } from '../patterns/Factory';
import { ScoringService } from '../core/services/ScoringService';
import { TSpinExpertAI } from '../core/services/TSpinExpertAI';
import { gameEvents, GAME_EVENTS } from '../patterns/Observer';

const AI_MOVE_INTERVAL = 50;

export function useTSpinShowcase(active) {
  const [gameState, setGameState] = useState(null);
  const [tspinCount, setTspinCount] = useState(0);
  const [tspinFlash, setTspinFlash] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const svcRef = useRef(null);
  const aiRef = useRef(null);
  const loopRef = useRef(null);
  const lastTimeRef = useRef(0);
  const aiTimerRef = useRef(0);
  const tspinCountRef = useRef(0);

  const initGame = useCallback(() => {
    const svc = new GameService(
      new PieceFactory(),
      new MovementStrategyFactory(),
      null,
      new ScoringService()
    );
    svc.initializeGame();
    svc.isPlaying = true;

    const ai = new TSpinExpertAI();

    svcRef.current = svc;
    aiRef.current = ai;
    tspinCountRef.current = 0;
    aiTimerRef.current = 0;
    lastTimeRef.current = 0;

    setTspinCount(0);
    setGameState(svc.getGameState());
    setIsRunning(true);
  }, []);

  useEffect(() => {
    if (!active) {
      if (loopRef.current) cancelAnimationFrame(loopRef.current);
      svcRef.current = null;
      aiRef.current = null;
      setIsRunning(false);
      setGameState(null);
      setTspinCount(0);
      return;
    }

    initGame();

    const handleTSpin = () => {
      tspinCountRef.current++;
      setTspinCount(tspinCountRef.current);
      setTspinFlash(true);
      setTimeout(() => setTspinFlash(false), 900);
    };
    gameEvents.on(GAME_EVENTS.T_SPIN, handleTSpin);

    return () => {
      if (loopRef.current) cancelAnimationFrame(loopRef.current);
      gameEvents.off(GAME_EVENTS.T_SPIN, handleTSpin);
      svcRef.current = null;
      aiRef.current = null;
    };
  }, [active, initGame]);

  useEffect(() => {
    if (!isRunning || !svcRef.current || !active) return;

    const loop = (ts) => {
      if (!lastTimeRef.current) lastTimeRef.current = ts;
      let dt = ts - lastTimeRef.current;
      lastTimeRef.current = ts;

      if (dt > 200) dt = 16;

      const svc = svcRef.current;
      const ai = aiRef.current;
      if (!svc || !ai) return;

      if (svc.gameOver) {
        initGame();
        loopRef.current = requestAnimationFrame(loop);
        return;
      }

      if (svc.isPlaying && !svc.isPaused) {
        svc.updateGame(dt);
      }

      aiTimerRef.current += dt;
      if (aiTimerRef.current >= AI_MOVE_INTERVAL) {
        aiTimerRef.current = 0;

        try {
          const state = svc.getGameState();
          const action = ai.decideNextMove(state);

          if (action) {
            switch (action.action) {
              case 'left':       svc.movePiece('left'); break;
              case 'right':      svc.movePiece('right'); break;
              case 'rotate':     svc.rotatePiece(); break;
              case 'rotateLeft': svc.rotatePieceLeft(); break;
              case 'down':       svc.movePiece('down'); break;
              case 'drop':       svc.hardDrop(); break;
              case 'hold':       svc.holdPiece(); break;
            }
          }

          setGameState(svc.getGameState());
        } catch (e) {

        }
      }

      loopRef.current = requestAnimationFrame(loop);
    };

    loopRef.current = requestAnimationFrame(loop);

    return () => {
      if (loopRef.current) cancelAnimationFrame(loopRef.current);
    };
  }, [isRunning, active, initGame]);

  const getDropPreview = useCallback(() => {
    try { return svcRef.current?.getDropPreview() || null; } catch { return null; }
  }, []);

  return { gameState, tspinCount, tspinFlash, isRunning, getDropPreview };
}

