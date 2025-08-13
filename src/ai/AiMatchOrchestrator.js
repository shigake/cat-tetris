import { TetrisAI } from './TetrisAI.js';
import { gameEvents, GAME_EVENTS } from '../patterns/Observer.js';

/** Simple orchestrator that observes a given GameService-like API */
export class AiMatchOrchestrator {
  constructor(gameService, policy, { seed = null, isVersus = false, opponentService = null } = {}) {
    this.gameService = gameService;
    this.opponentService = opponentService;
    this.isVersus = isVersus;
    this.ai = new TetrisAI();
    this.policy = policy;
    this.plan = [];
    this.timer = null;
    this.seed = seed;
    this.enabled = false;
    this.apmCounter = { actions: 0, start: Date.now() };
    this.lastKnownStateKey = '';
    this.prevAILines = 0;
    this.prevOppLines = 0;
  }

  start() {
    if (this.enabled) return;
    this.enabled = true;
    this.plan = [];
    this.lastKnownStateKey = '';
    this._onInit = () => { this.plan = []; this.lastKnownStateKey = ''; };
    gameEvents.on(GAME_EVENTS.GAME_INITIALIZED, this._onInit);
    console.log('[AI] start orchestrator');
    this.tick();
  }

  stop() {
    this.enabled = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.plan = [];
    this.lastKnownStateKey = '';
    if (this._onInit) {
      gameEvents.off(GAME_EVENTS.GAME_INITIALIZED, this._onInit);
      this._onInit = null;
    }
    console.log('[AI] stop orchestrator');
  }

  getTelemetry() {
    const minutes = (Date.now() - this.apmCounter.start) / 60000;
    const apm = minutes > 0 ? Math.round(this.apmCounter.actions / minutes) : 0;
    return {
      ...this.ai.telemetry,
      apm
    };
  }

  injectGarbage(otherService, n) {
    const board = otherService.board;
    for (let i = 0; i < n; i++) {
      const holeX = Math.floor(Math.random() * board.width);
      board.grid.shift();
      const row = Array(board.width).fill({ type: 'G', color: '#333', emoji: '⬛' });
      row[holeX] = null;
      board.grid.push(row);
    }
  }

  // Recompute when state diverges (e.g., garbage, locking, etc.)
  computeKey(state) {
    // Be robust to gravity: ignore Y to avoid replanning every frame
    const bottomRows = state.board.slice(-4);
    const rowSig = bottomRows.map(r => (Array.isArray(r) ? r.map(c => (c ? 1 : 0)).join('') : '')).join('/');
    // Ignore current X while a plan exists; only replan on board change or piece/hold/next swap
    return `${state.currentPiece?.type ?? 'none'}|hold:${state.heldPiece?.type ?? 'none'}|next:${state.nextPieces?.[0]?.type ?? 'none'}|${rowSig}`;
  }

  buildSnapshot() {
    const gs = this.gameService.getGameState();
    return {
      currentPiece: gs.currentPiece,
      nextPieces: gs.nextPieces,
      boardInstance: this.gameService.board,
      canHold: gs.canHold,
      heldPiece: gs.heldPiece
    };
  }

  decide() {
    const snapshot = this.buildSnapshot();
    const plan = this.ai.decide(snapshot, this.policy);
    this.plan = plan;
    // Update key baseline after deciding
    try {
      const state = this.gameService.getGameState();
      this.lastKnownStateKey = this.computeKey(state);
    } catch {}
    console.log('[AI] decide plan size=', plan.length);
  }

  executeNext() {
    if (this.plan.length === 0) return;
    const action = this.plan.shift();
    console.log('[AI] exec', action);
    switch(action) {
      case 'left': this.gameService.movePiece('left'); break;
      case 'right': this.gameService.movePiece('right'); break;
      case 'rotate': this.gameService.rotatePiece(); break;
      case 'rotateLeft': this.gameService.rotatePieceLeft?.(); break;
      case 'hardDrop': this.gameService.hardDrop(); break;
      default: break;
    }
    this.apmCounter.actions++;
  }

  tick() {
    if (!this.enabled) return;
    const state = this.gameService.getGameState();
    if (!state || state.gameOver || state.isPaused) {
      this.timer = setTimeout(() => this.tick(), this.policy.speedMs || 100);
      return;
    }
    // Versus garbage exchange based on lines delta
    if (this.isVersus && this.opponentService) {
      const aiLines = state.score?.lines ?? 0;
      const oppState = this.opponentService.getGameState?.();
      const oppLines = oppState?.score?.lines ?? 0;
      const factor = this.policy.garbageFactor || 1.0;
      if (aiLines > this.prevAILines) {
        const cleared = aiLines - this.prevAILines;
        if (cleared >= 2) {
          const amount = Math.floor((cleared === 2 ? 1 : cleared === 3 ? 2 : 4) * factor);
          if (amount > 0) this.injectGarbage(this.opponentService, amount);
        }
      }
      if (oppLines > this.prevOppLines) {
        const cleared = oppLines - this.prevOppLines;
        if (cleared >= 2) {
          const amount = Math.floor((cleared === 2 ? 1 : cleared === 3 ? 2 : 4) * factor);
          if (amount > 0) this.injectGarbage(this.gameService, amount);
        }
      }
      this.prevAILines = aiLines;
      this.prevOppLines = oppLines;
    }
    const currentKey = this.computeKey(state);
    if (this.plan.length === 0 || currentKey !== this.lastKnownStateKey) {
      const prevKey = this.lastKnownStateKey;
      this.decide();
      if (prevKey !== this.lastKnownStateKey) {
        console.log('[AI] replan due to key change');
      }
    }
    // Emit uma sequência de ações por tick para evitar travas visuais (move + drop mais rápido)
    const stepsPerTick = Math.max(1, Math.floor((100 / (this.policy.speedMs || 100))));
    for (let i = 0; i < stepsPerTick; i++) {
      this.executeNext();
      if (this.plan.length === 0) break;
    }
    this.timer = setTimeout(() => this.tick(), this.policy.speedMs || 100);
  }
}

export default AiMatchOrchestrator;


