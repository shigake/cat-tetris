import { useState, useEffect, useCallback, useRef } from 'react';
import { GameService } from '../core/services/GameService';
import { PieceFactory, MovementStrategyFactory } from '../patterns/Factory';
import { ScoringService } from '../core/services/ScoringService';
import { ExpertAI } from '../core/services/ExpertAI';
import { gameEvents, GAME_EVENTS } from '../patterns/Observer';

const AI_MOVE_INTERVAL = 50; // ms between AI actions

/**
 * useAIShowcase — runs a self-playing game with an expert AI.
 * Tracks combos and line clears. Auto-restarts on game over.
 */
export function useAIShowcase(active) {
  const [gameState, setGameState] = useState(null);
  const [stats, setStats] = useState({ lines: 0, combos: 0, tetrises: 0, maxCombo: 0 });
  const [comboFlash, setComboFlash] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const svcRef = useRef(null);
  const aiRef = useRef(null);
  const loopRef = useRef(null);
  const lastTimeRef = useRef(0);
  const aiTimerRef = useRef(0);
  const statsRef = useRef({ lines: 0, combos: 0, tetrises: 0, maxCombo: 0, currentCombo: 0 });

  const initGame = useCallback(() => {
    const svc = new GameService(
      new PieceFactory(),
      new MovementStrategyFactory(),
      null,
      new ScoringService()
    );
    svc.initializeGame();
    svc.isPlaying = true;

    const ai = new ExpertAI();

    svcRef.current = svc;
    aiRef.current = ai;
    aiTimerRef.current = 0;
    lastTimeRef.current = 0;

    // Keep accumulated stats across restarts
    statsRef.current.currentCombo = 0;
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
      setStats({ lines: 0, combos: 0, tetrises: 0, maxCombo: 0 });
      statsRef.current = { lines: 0, combos: 0, tetrises: 0, maxCombo: 0, currentCombo: 0 };
      return;
    }

    initGame();

    const handleLineCleared = ({ linesCleared }) => {
      const s = statsRef.current;
      s.lines += linesCleared;
      s.currentCombo++;
      if (s.currentCombo > 1) {
        s.combos++;
        if (s.currentCombo > s.maxCombo) s.maxCombo = s.currentCombo;
        setComboFlash(true);
        setTimeout(() => setComboFlash(false), 600);
      }
      if (linesCleared >= 4) s.tetrises++;
      setStats({ lines: s.lines, combos: s.combos, tetrises: s.tetrises, maxCombo: s.maxCombo });
    };

    const handlePiecePlaced = ({ linesCleared }) => {
      if (linesCleared === 0) {
        statsRef.current.currentCombo = 0;
      }
    };

    gameEvents.on(GAME_EVENTS.LINE_CLEARED, handleLineCleared);
    gameEvents.on(GAME_EVENTS.PIECE_PLACED, handlePiecePlaced);

    return () => {
      if (loopRef.current) cancelAnimationFrame(loopRef.current);
      gameEvents.off(GAME_EVENTS.LINE_CLEARED, handleLineCleared);
      gameEvents.off(GAME_EVENTS.PIECE_PLACED, handlePiecePlaced);
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
          console.warn('[AIShowcase] AI error:', e);
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

  return { gameState, stats, comboFlash, isRunning, getDropPreview };
}
