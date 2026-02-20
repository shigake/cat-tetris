const MAX_LOG_ENTRIES = 500;
const STORAGE_KEY = 'cat_tetris_error_log';

class ErrorLoggerService {
  constructor() {
    this.logs = this._loadLogs();
    this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    this._gameStateProvider = null;
    this._setupGlobalHandlers();
  }

  _loadLogs() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  _saveLogs() {
    try {
      if (this.logs.length > MAX_LOG_ENTRIES) {
        this.logs = this.logs.slice(-MAX_LOG_ENTRIES);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.logs));
    } catch {
      this.logs = this.logs.slice(-50);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.logs));
      } catch {}
    }
  }

  _setupGlobalHandlers() {
    if (typeof window === 'undefined') return;

    window.addEventListener('error', (event) => {
      this.logError('window', 'uncaughtError', event.message, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.logError('window', 'unhandledRejection', String(event.reason), {
        stack: event.reason?.stack,
        type: typeof event.reason
      });
    });
  }

  setGameStateProvider(provider) {
    this._gameStateProvider = provider;
  }

  _getGameStateSnapshot() {
    if (!this._gameStateProvider) return null;
    try {
      const state = this._gameStateProvider();
      if (!state) return null;
      return {
        isPlaying: state.isPlaying,
        isPaused: state.isPaused,
        gameOver: state.gameOver,
        score: state.score?.points,
        level: state.score?.level,
        lines: state.score?.lines,
        currentPiece: state.currentPiece?.type,
        gameMode: state.gameMode?.id || state.gameMode?.name || null
      };
    } catch (e) {
      return { snapshotError: e.message };
    }
  }

  logError(source, action, message, details = null) {
    const entry = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      level: 'error',
      source,
      action,
      message,
      details,
      gameState: this._getGameStateSnapshot()
    };
    this.logs.push(entry);
    this._saveLogs();
    return entry;
  }

  logWarn(source, action, message, details = null) {
    const entry = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      level: 'warn',
      source,
      action,
      message,
      details,
      gameState: this._getGameStateSnapshot()
    };
    this.logs.push(entry);
    this._saveLogs();
    return entry;
  }

  getErrors() {
    return this.logs.filter(l => l.level === 'error');
  }

  clearLogs() {
    this.logs = [];
    this._saveLogs();
  }
}

export const errorLogger = new ErrorLoggerService();

export function withErrorLogging(source, action, fn) {
  return function(...args) {
    try {
      const result = fn.apply(this, args);
      if (result && typeof result.catch === 'function') {
        return result.catch(error => {
          errorLogger.logError(source, action, error.message, {
            stack: error.stack,
            args: args.map(a => typeof a === 'object' ? JSON.stringify(a).slice(0, 200) : String(a))
          });
          throw error;
        });
      }
      return result;
    } catch (error) {
      errorLogger.logError(source, action, error.message, {
        stack: error.stack,
        args: args.map(a => typeof a === 'object' ? JSON.stringify(a).slice(0, 200) : String(a))
      });
      throw error;
    }
  };
}

