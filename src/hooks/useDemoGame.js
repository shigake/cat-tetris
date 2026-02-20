import { useState, useEffect, useCallback, useRef } from 'react';
import { GameService } from '../core/services/GameService';
import { PieceFactory, MovementStrategyFactory } from '../patterns/Factory';
import { ScoringService } from '../core/services/ScoringService';
import { AIOpponentService } from '../core/services/AIOpponentService';

/**
 * Lesson-specific AI behavior hints.
 * Each entry tweaks how the AI plays so it demonstrates
 * the mechanic the lesson is teaching.
 */
const LESSON_HINTS = {
  // 1: Movimentação — just play normally, user sees moves
  1: { difficulty: 'easy', forceHold: false, comboBoost: false, label: 'Movendo peças...' },
  // 2: Hold — use hold frequently so user sees it
  2: { difficulty: 'easy', forceHold: true, comboBoost: false, label: 'Usando Hold (C)...' },
  // 3: Planejamento — play clean, medium
  3: { difficulty: 'medium', forceHold: false, comboBoost: false, label: 'Planejando jogadas...' },
  // 4: Combos — boost combo weight
  4: { difficulty: 'medium', forceHold: false, comboBoost: true, label: 'Buscando combos...' },
  // 5: Tetris (4 lines) — play well, try to leave a column open
  5: { difficulty: 'hard', forceHold: false, comboBoost: false, label: 'Montando Tetris...' },
  // 6: T-Spin — expert AI already tries T-Spin setups
  6: { difficulty: 'expert', forceHold: true, comboBoost: false, label: 'Tentando T-Spins...' },
  // 7: Back-to-Back — expert
  7: { difficulty: 'expert', forceHold: true, comboBoost: false, label: 'Buscando Back-to-Back...' },
  // 8: Desafio Final — hard, good overall play
  8: { difficulty: 'hard', forceHold: true, comboBoost: false, label: 'Jogando no máximo...' },
};

/**
 * useDemoGame - IA joga demonstrando a mecânica da lição.
 * @param {boolean} active - Whether demo is active
 * @param {number} lessonId - Which lesson to demonstrate
 */
export function useDemoGame(active, lessonId) {
  const [gameState, setGameState] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [demoComplete, setDemoComplete] = useState(false);
  const [statusLabel, setStatusLabel] = useState('');
  const gameServiceRef = useRef(null);
  const aiRef = useRef(null);
  const lastTimeRef = useRef(0);
  const loopRef = useRef(null);
  const aiTimerRef = useRef(0);
  const piecesPlacedRef = useRef(0);
  const holdCounterRef = useRef(0);
  const hintsRef = useRef(null);

  const AI_MOVE_INTERVAL = 250;
  const MAX_PIECES = 25;

  // Initialize
  useEffect(() => {
    if (!active) {
      setGameState(null);
      setIsInitialized(false);
      setDemoComplete(false);
      setStatusLabel('');
      gameServiceRef.current = null;
      aiRef.current = null;
      piecesPlacedRef.current = 0;
      holdCounterRef.current = 0;
      if (loopRef.current) cancelAnimationFrame(loopRef.current);
      return;
    }

    const hints = LESSON_HINTS[lessonId] || LESSON_HINTS[1];
    hintsRef.current = hints;
    setStatusLabel(hints.label);

    const service = new GameService(
      new PieceFactory(),
      new MovementStrategyFactory(),
      null,
      new ScoringService()
    );
    service.initializeGame();
    service.isPlaying = true;

    const ai = new AIOpponentService();
    ai.setDifficulty(hints.difficulty);
    ai.thinkingTime = 0;

    // Boost combo weight when lesson is about combos
    if (hints.comboBoost) {
      const origEval = ai._evaluateBoard.bind(ai);
      ai._evaluateBoard = (board, piece) => {
        let score = origEval(board, piece);
        // Heavily favor rows that are nearly full (combo potential)
        for (let y = 0; y < board.length; y++) {
          const filled = board[y].filter(c => c != null).length;
          if (filled >= 8) score += 200;
          if (filled >= 9) score += 500;
        }
        return score;
      };
    }

    gameServiceRef.current = service;
    aiRef.current = ai;
    piecesPlacedRef.current = 0;
    holdCounterRef.current = 0;
    aiTimerRef.current = 0;
    lastTimeRef.current = 0;

    setGameState(service.getGameState());
    setIsInitialized(true);
    setDemoComplete(false);

    return () => {
      if (loopRef.current) cancelAnimationFrame(loopRef.current);
      gameServiceRef.current = null;
      aiRef.current = null;
    };
  }, [active, lessonId]);

  // Game loop — gravity + lesson-aware AI moves
  useEffect(() => {
    if (!gameServiceRef.current || !isInitialized || !active) return;
    lastTimeRef.current = 0;
    aiTimerRef.current = 0;

    let lastPieceType = null;

    const loop = (currentTime) => {
      if (!lastTimeRef.current) lastTimeRef.current = currentTime;
      const dt = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      const svc = gameServiceRef.current;
      const ai = aiRef.current;
      const hints = hintsRef.current;

      if (svc && ai && !svc.gameOver) {
        if (svc.isPlaying && !svc.isPaused) {
          svc.updateGame(dt);
        }

        const state = svc.getGameState();
        const curType = state.currentPiece?.type;
        if (lastPieceType && curType !== lastPieceType) {
          piecesPlacedRef.current++;
          holdCounterRef.current++;
          if (piecesPlacedRef.current >= MAX_PIECES) {
            setDemoComplete(true);
            setGameState(state);
            return;
          }
        }
        lastPieceType = curType;

        aiTimerRef.current += dt;
        if (aiTimerRef.current >= AI_MOVE_INTERVAL) {
          aiTimerRef.current = 0;

          // Force hold every 3-4 pieces if lesson is about hold
          if (hints?.forceHold && holdCounterRef.current >= 3 && state.currentPiece) {
            const canHold = state.canHold !== false;
            if (canHold) {
              svc.holdPiece();
              holdCounterRef.current = 0;
              setGameState(svc.getGameState());
              loopRef.current = requestAnimationFrame(loop);
              return;
            }
          }

          const action = ai.decideNextMove(state);
          if (action) {
            switch (action.action) {
              case 'left':   svc.movePiece('left'); break;
              case 'right':  svc.movePiece('right'); break;
              case 'rotate': svc.rotatePiece(); break;
              case 'down':   svc.movePiece('down'); break;
              case 'drop':   svc.hardDrop(); break;
              case 'hold':   svc.holdPiece(); break;
            }
          }
        }

        setGameState(state);
      } else if (svc?.gameOver) {
        setDemoComplete(true);
        setGameState(svc.getGameState());
        return;
      }

      loopRef.current = requestAnimationFrame(loop);
    };

    loopRef.current = requestAnimationFrame(loop);

    return () => {
      if (loopRef.current) cancelAnimationFrame(loopRef.current);
    };
  }, [isInitialized, active]);

  const getDropPreview = useCallback(() => {
    try { return gameServiceRef.current?.getDropPreview() || null; } catch { return null; }
  }, []);

  return {
    gameState,
    isInitialized,
    demoComplete,
    statusLabel,
    getDropPreview
  };
}
