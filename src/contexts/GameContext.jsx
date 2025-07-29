import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { IGameState } from '../interfaces/IGameState.js';
import { IGameActions } from '../interfaces/IGameActions.js';
import { createEmptyBoard } from '../utils/GameLogic.js';

export const GAME_ACTIONS = {
  INITIALIZE_GAME: 'INITIALIZE_GAME',
  MOVE_PIECE: 'MOVE_PIECE',
  ROTATE_PIECE: 'ROTATE_PIECE',
  PLACE_PIECE: 'PLACE_PIECE',
  HOLD_PIECE: 'HOLD_PIECE',
  CLEAR_LINES: 'CLEAR_LINES',
  UPDATE_SCORE: 'UPDATE_SCORE',
  SET_GAME_OVER: 'SET_GAME_OVER',
  SET_PAUSED: 'SET_PAUSED',
  SET_PLAYING: 'SET_PLAYING',
  UPDATE_LEVEL: 'UPDATE_LEVEL',
  UPDATE_COMBO: 'UPDATE_COMBO',
  RESET_COMBO: 'RESET_COMBO',
  SET_LOCK_DELAY_TIMER: 'SET_LOCK_DELAY_TIMER',
  SET_BACK_TO_BACK: 'SET_BACK_TO_BACK',
  RESET_LOCK_DELAY: 'RESET_LOCK_DELAY'
};

const initialState = {
  board: createEmptyBoard(),
  currentPiece: null,
  nextPieces: [],
  heldPiece: null,
  canHold: true,
  score: 0,
  level: 1,
  lines: 0,
  combo: 0,
  gameOver: false,
  isPaused: false,
  isPlaying: true,
  dropTime: 1000,
  lockDelay: 500,
  lockDelayTimer: null,
  backToBack: false
};

class GameStateManager extends IGameState {
  constructor(state) {
    super();
    this._state = state;
  }

  get board() { return this._state.board; }
  get currentPiece() { return this._state.currentPiece; }
  get nextPieces() { return this._state.nextPieces; }
  get heldPiece() { return this._state.heldPiece; }
  get canHold() { return this._state.canHold; }
  get score() { return this._state.score; }
  get level() { return this._state.level; }
  get lines() { return this._state.lines; }
  get gameOver() { return this._state.gameOver; }
  get isPaused() { return this._state.isPaused; }
  get isPlaying() { return this._state.isPlaying; }
  get combo() { return this._state.combo; }
  get dropTime() { return this._state.dropTime; }
  get lockDelay() { return this._state.lockDelay; }
  get lockDelayTimer() { return this._state.lockDelayTimer; }
  get backToBack() { return this._state.backToBack; }

  updateState(newState) {
    this._state = { ...this._state, ...newState };
  }
}

class GameActionsManager extends IGameActions {
  constructor(dispatch) {
    super();
    this.dispatch = dispatch;
  }

  initializeGame(board, currentPiece, nextPieces) {
    this.dispatch({
      type: GAME_ACTIONS.INITIALIZE_GAME,
      payload: { board, currentPiece, nextPieces }
    });
  }

  movePiece(piece) {
    this.dispatch({
      type: GAME_ACTIONS.MOVE_PIECE,
      payload: { piece }
    });
  }

  rotatePiece(piece) {
    this.dispatch({
      type: GAME_ACTIONS.ROTATE_PIECE,
      payload: { piece }
    });
  }

  placePiece(board, nextPiece, nextPieces) {
    this.dispatch({
      type: GAME_ACTIONS.PLACE_PIECE,
      payload: { board, nextPiece, nextPieces }
    });
  }

  holdPiece(heldPiece, currentPiece) {
    this.dispatch({
      type: GAME_ACTIONS.HOLD_PIECE,
      payload: { heldPiece, currentPiece }
    });
  }

  clearLines(board, linesCleared) {
    this.dispatch({
      type: GAME_ACTIONS.CLEAR_LINES,
      payload: { board, linesCleared }
    });
  }

  updateScore(points) {
    this.dispatch({
      type: GAME_ACTIONS.UPDATE_SCORE,
      payload: { points }
    });
  }

  setGameOver() {
    this.dispatch({ type: GAME_ACTIONS.SET_GAME_OVER });
  }

  setPaused(isPaused) {
    this.dispatch({
      type: GAME_ACTIONS.SET_PAUSED,
      payload: isPaused
    });
  }

  setPlaying(isPlaying) {
    this.dispatch({
      type: GAME_ACTIONS.SET_PLAYING,
      payload: isPlaying
    });
  }

  updateLevel(level, dropTime) {
    this.dispatch({
      type: GAME_ACTIONS.UPDATE_LEVEL,
      payload: { level, dropTime }
    });
  }

  updateCombo() {
    this.dispatch({ type: GAME_ACTIONS.UPDATE_COMBO });
  }

  resetCombo() {
    this.dispatch({ type: GAME_ACTIONS.RESET_COMBO });
  }

  setLockDelayTimer(timer) {
    this.dispatch({ type: GAME_ACTIONS.SET_LOCK_DELAY_TIMER, payload: timer });
  }

  setBackToBack(value) {
    this.dispatch({ type: GAME_ACTIONS.SET_BACK_TO_BACK, payload: value });
  }

  resetLockDelay() {
    this.dispatch({ type: GAME_ACTIONS.RESET_LOCK_DELAY });
  }
}

function gameReducer(state, action) {
  switch (action.type) {
    case GAME_ACTIONS.INITIALIZE_GAME:
      return {
        ...initialState,
        board: action.payload.board || createEmptyBoard(),
        currentPiece: action.payload.currentPiece,
        nextPieces: action.payload.nextPieces,
        isPlaying: true
      };

    case GAME_ACTIONS.MOVE_PIECE:
      return {
        ...state,
        currentPiece: action.payload.piece
      };

    case GAME_ACTIONS.ROTATE_PIECE:
      return {
        ...state,
        currentPiece: action.payload.piece
      };

    case GAME_ACTIONS.PLACE_PIECE:
      return {
        ...state,
        board: action.payload.board || state.board,
        currentPiece: action.payload.nextPiece,
        nextPieces: action.payload.nextPieces,
        canHold: true
      };

    case GAME_ACTIONS.HOLD_PIECE:
      return {
        ...state,
        heldPiece: action.payload.heldPiece,
        currentPiece: action.payload.currentPiece,
        canHold: false
      };

    case GAME_ACTIONS.CLEAR_LINES:
      return {
        ...state,
        board: action.payload.board || state.board,
        lines: state.lines + action.payload.linesCleared,
        combo: state.combo + 1
      };

    case GAME_ACTIONS.UPDATE_SCORE:
      return {
        ...state,
        score: state.score + action.payload.points
      };

    case GAME_ACTIONS.SET_GAME_OVER:
      return {
        ...state,
        gameOver: true,
        isPlaying: false
      };

    case GAME_ACTIONS.SET_PAUSED:
      return {
        ...state,
        isPaused: action.payload
      };

    case GAME_ACTIONS.SET_PLAYING:
      return {
        ...state,
        isPlaying: action.payload
      };

    case GAME_ACTIONS.UPDATE_LEVEL:
      return {
        ...state,
        level: action.payload.level,
        dropTime: action.payload.dropTime
      };

    case GAME_ACTIONS.UPDATE_COMBO:
      return {
        ...state,
        combo: state.combo + 1
      };

    case GAME_ACTIONS.RESET_COMBO:
      return {
        ...state,
        combo: 0
      };

    case GAME_ACTIONS.SET_LOCK_DELAY_TIMER:
      return {
        ...state,
        lockDelayTimer: action.payload
      };

    case GAME_ACTIONS.SET_BACK_TO_BACK:
      return {
        ...state,
        backToBack: action.payload
      };

    case GAME_ACTIONS.RESET_LOCK_DELAY:
      return {
        ...state,
        lockDelayTimer: null
      };

    default:
      return state;
  }
}

const GameContext = createContext();

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  
  const gameState = new GameStateManager(state);
  const gameActions = new GameActionsManager(dispatch);

  const value = {
    ...state,
    actions: gameActions
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
} 