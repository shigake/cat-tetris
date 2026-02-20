/**
 * ErrorLogger - Sistema centralizado de logging de erros e eventos
 * 
 * Grava tudo em localStorage e permite exportar para arquivo JSON.
 * Cada entrada tem: quando, onde, qual ação, o erro, e um snapshot do estado.
 * 
 * Para exportar os logs no console do browser:
 *   window.__ERROR_LOGGER__.downloadLogs()
 * 
 * Para ver os logs no console:
 *   window.__ERROR_LOGGER__.printLogs()
 */

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
    
    // Capturar erros globais do window
    this._setupGlobalHandlers();
    
    // Expor no window para acesso fácil
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
      // Manter apenas os últimos MAX_LOG_ENTRIES
      if (this.logs.length > MAX_LOG_ENTRIES) {
        this.logs = this.logs.slice(-MAX_LOG_ENTRIES);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.logs));
    } catch (e) {
      // localStorage cheio - limpar logs antigos
      this.logs = this.logs.slice(-50);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.logs));
      } catch {
        // Desistir silenciosamente
      }
    }
  }

  _setupGlobalHandlers() {
    if (typeof window === 'undefined') return;

    // Erros JavaScript não capturados
    window.addEventListener('error', (event) => {
      this.logError('window', 'uncaughtError', event.message, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
      });
    });

    // Promises rejeitadas não tratadas
    window.addEventListener('unhandledrejection', (event) => {
      this.logError('window', 'unhandledRejection', String(event.reason), {
        stack: event.reason?.stack,
        type: typeof event.reason
      });
    });
  }

  /**
   * Registra um provider de game state para incluir snapshots nos logs
   */
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
      level,        // 'error' | 'warn' | 'info' | 'action'
      source,       // Onde: componente/arquivo (ex: 'GameService', 'TetrisBoard')
      action,       // Qual ação (ex: 'movePiece', 'holdPiece', 'render')
      message,      // O que aconteceu
      details,      // Dados extras
      gameState: level === 'error' || level === 'warn' ? this._getGameStateSnapshot() : undefined
    };
  }

  /**
   * Loga um ERRO - algo quebrou
   */
  logError(source, action, message, details = null) {
    const entry = this._createEntry('error', source, action, message, details);
    this.logs.push(entry);
    this._saveLogs();
    console.error(`[ErrorLogger] ❌ ${source}.${action}: ${message}`, details || '');
    return entry;
  }

  /**
   * Loga um WARNING - algo suspeito
   */
  logWarn(source, action, message, details = null) {
    const entry = this._createEntry('warn', source, action, message, details);
    this.logs.push(entry);
    this._saveLogs();
    return entry;
  }

  /**
   * Loga INFO - eventos normais importantes
   */
  logInfo(source, action, message, details = null) {
    const entry = this._createEntry('info', source, action, message, details);
    this.logs.push(entry);
    this._saveLogs();
    return entry;
  }

  /**
   * Loga uma AÇÃO do usuário (para rastrear o que levou ao erro)
   */
  logAction(source, action, details = null) {
    const entry = this._createEntry('action', source, action, `User action: ${action}`, details);
    this.logs.push(entry);
    // Salvar menos frequente para ações (a cada 10)
    if (this.logs.length % 10 === 0) {
      this._saveLogs();
    }
    return entry;
  }

  /**
   * Retorna todos os logs
   */
  getLogs(filter = null) {
    if (!filter) return [...this.logs];
    return this.logs.filter(entry => {
      if (filter.level && entry.level !== filter.level) return false;
      if (filter.source && entry.source !== filter.source) return false;
      if (filter.sessionId && entry.sessionId !== filter.sessionId) return false;
      return true;
    });
  }

  /**
   * Retorna apenas erros
   */
  getErrors() {
    return this.getLogs({ level: 'error' });
  }

  /**
   * Retorna logs da sessão atual
   */
  getCurrentSessionLogs() {
    return this.getLogs({ sessionId: this.sessionId });
  }

  /**
   * Limpa todos os logs
   */
  clearLogs() {
    this.logs = [];
    this._saveLogs();
  }

  /**
   * Exporta os logs como JSON string
   */
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

  /**
   * Download dos logs como arquivo JSON
   */
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
    console.log(`📁 Downloaded ${this.logs.length} log entries`);
  }

  /**
   * Salva logs no localStorage com key especial para o script Node acessar
   * (O script dump-errors.cjs lê de um arquivo local via Playwright)
   */
  saveForExternalAccess() {
    try {
      localStorage.setItem('cat_tetris_error_export', this.exportLogs());
    } catch {
      // ignore
    }
  }

  /**
   * Printa logs formatados no console
   */
  printLogs(level = null) {
    const logs = level ? this.getLogs({ level }) : this.logs;
    console.group(`🐱 Cat Tetris Error Log (${logs.length} entries)`);
    logs.forEach(entry => {
      const icon = { error: '❌', warn: '⚠️', info: 'ℹ️', action: '🎮' }[entry.level] || '📝';
      const time = new Date(entry.timestamp).toLocaleTimeString();
      console.log(`${icon} [${time}] ${entry.source}.${entry.action}: ${entry.message}`);
      if (entry.details) console.log('  Details:', entry.details);
      if (entry.gameState) console.log('  GameState:', entry.gameState);
    });
    console.groupEnd();
  }
}

// Singleton global
export const errorLogger = new ErrorLoggerService();

/**
 * Helper: Wrap uma função para logar erros automaticamente
 */
export function withErrorLogging(source, action, fn) {
  return function(...args) {
    try {
      const result = fn.apply(this, args);
      // Se retorna promise, capturar erros async também
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
