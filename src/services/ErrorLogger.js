const MAX_LOG_ENTRIES = 500;
const STORAGE_KEY = 'cat_tetris_error_log';
const EVENT_LOG_KEY = 'cat_tetris_event_log';

class ErrorLoggerService {
  constructor() {
    this.logs = this._loadLogs();
    this.eventLog = [];
    this.sessionId = this._generateSessionId();
    this.sessionStart = new Date().toISOString();
    this._gameStateProvider = null;

    this._setupGlobalHandlers();

    if (typeof window !== 'undefined') {
      window.__ERROR_LOGGER__ = this;
    }

    this.logInfo('ErrorLogger', 'init', 'Sistema de logging iniciado', {
      sessionId: this.sessionId,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A',
      timestamp: this.sessionStart
    });
  }

  _generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
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
    } catch (e) {

      this.logs = this.logs.slice(-50);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.logs));
      } catch {

      }
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
        currentPiecePos: state.currentPiece?.position,
        heldPiece: state.heldPiece?.type,
        canHold: state.canHold,
        gameMode: state.gameMode?.id || state.gameMode?.name || null,
        backToBack: state.backToBack,
        nextPieces: state.nextPieces?.map(p => p?.type),
        boardFilledRows: state.board?.filter(row => row.some(c => c !== null)).length
      };
    } catch (e) {
      return { snapshotError: e.message };
    }
  }

  _createEntry(level, source, action, message, details = null) {
    return {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      level,
      source,
      action,
      message,
      details,
      gameState: level === 'error' || level === 'warn' ? this._getGameStateSnapshot() : undefined
    };
  }

  logError(source, action, message, details = null) {
    const entry = this._createEntry('error', source, action, message, details);
    this.logs.push(entry);
    this._saveLogs();

    return entry;
  }

  logWarn(source, action, message, details = null) {
    const entry = this._createEntry('warn', source, action, message, details);
    this.logs.push(entry);
    this._saveLogs();
    return entry;
  }

  logInfo(source, action, message, details = null) {
    const entry = this._createEntry('info', source, action, message, details);
    this.logs.push(entry);
    this._saveLogs();
    return entry;
  }

  logAction(source, action, details = null) {
    const entry = this._createEntry('action', source, action, `User action: ${action}`, details);
    this.logs.push(entry);

    if (this.logs.length % 10 === 0) {
      this._saveLogs();
    }
    return entry;
  }

  getLogs(filter = null) {
    if (!filter) return [...this.logs];
    return this.logs.filter(entry => {
      if (filter.level && entry.level !== filter.level) return false;
      if (filter.source && entry.source !== filter.source) return false;
      if (filter.sessionId && entry.sessionId !== filter.sessionId) return false;
      return true;
    });
  }

  getErrors() {
    return this.getLogs({ level: 'error' });
  }

  getCurrentSessionLogs() {
    return this.getLogs({ sessionId: this.sessionId });
  }

  clearLogs() {
    this.logs = [];
    this._saveLogs();
  }

  exportLogs() {
    const exportData = {
      exportDate: new Date().toISOString(),
      sessionId: this.sessionId,
      sessionStart: this.sessionStart,
      totalEntries: this.logs.length,
      errorCount: this.logs.filter(l => l.level === 'error').length,
      warnCount: this.logs.filter(l => l.level === 'warn').length,
      logs: this.logs
    };
    return JSON.stringify(exportData, null, 2);
  }

  downloadLogs() {
    const data = this.exportLogs();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cat-tetris-errors-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

  }

  saveForExternalAccess() {
    try {
      localStorage.setItem('cat_tetris_error_export', this.exportLogs());
    } catch {

    }
  }

  printLogs(level = null) {
    return level ? this.getLogs({ level }) : this.logs;
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

