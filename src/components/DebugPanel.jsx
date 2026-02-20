import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { errorLogger } from '../services/ErrorLogger';

/**
 * DebugPanel - Painel flutuante que mostra erros e logs em tempo real.
 * Ativado com Ctrl+Shift+D ou pelo botão 🐛 no canto.
 */
function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all' | 'error' | 'warn' | 'action'
  const [errorCount, setErrorCount] = useState(0);

  // Atualizar logs periodicamente quando aberto
  useEffect(() => {
    const updateLogs = () => {
      const allLogs = errorLogger.getCurrentSessionLogs();
      setLogs(allLogs);
      setErrorCount(allLogs.filter(l => l.level === 'error').length);
    };

    updateLogs();
    const interval = setInterval(updateLogs, 2000);
    return () => clearInterval(interval);
  }, []);

  // Atalho Ctrl+Shift+D
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredLogs = filter === 'all' 
    ? logs 
    : logs.filter(l => l.level === filter);

  const handleExport = () => {
    errorLogger.saveForExternalAccess();
    errorLogger.downloadLogs();
  };

  const handleClear = () => {
    errorLogger.clearLogs();
    setLogs([]);
    setErrorCount(0);
  };

  const levelIcon = {
    error: '❌',
    warn: '⚠️',
    info: 'ℹ️',
    action: '🎮'
  };

  const levelColor = {
    error: 'text-red-400 bg-red-900/30',
    warn: 'text-yellow-400 bg-yellow-900/30',
    info: 'text-blue-400 bg-blue-900/30',
    action: 'text-green-400 bg-green-900/30'
  };

  return (
    <>
      {/* Botão flutuante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 left-4 z-[9999] bg-gray-900/90 hover:bg-gray-800 
                   text-white rounded-full w-10 h-10 flex items-center justify-center
                   border border-gray-600 shadow-lg transition-all"
        title="Debug Panel (Ctrl+Shift+D)"
      >
        <span className="text-lg">🐛</span>
        {errorCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs 
                          rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {errorCount > 99 ? '99+' : errorCount}
          </span>
        )}
      </button>

      {/* Painel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-16 left-4 z-[9999] w-[500px] max-w-[90vw] max-h-[70vh] 
                       bg-gray-900/95 backdrop-blur-sm border border-gray-600 rounded-xl 
                       shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700 bg-gray-800/50">
              <div className="flex items-center gap-2">
                <span className="text-lg">🐛</span>
                <span className="text-white font-bold text-sm">Debug Log</span>
                <span className="text-gray-400 text-xs">
                  ({filteredLogs.length} entries)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExport}
                  className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded"
                  title="Exportar logs para arquivo JSON"
                >
                  📁 Exportar
                </button>
                <button
                  onClick={handleClear}
                  className="text-xs bg-red-600 hover:bg-red-500 text-white px-2 py-1 rounded"
                  title="Limpar todos os logs"
                >
                  🗑️ Limpar
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white text-xl leading-none"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Filtros */}
            <div className="flex gap-1 px-4 py-2 border-b border-gray-700">
              {['all', 'error', 'warn', 'info', 'action'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`text-xs px-2 py-1 rounded transition-colors ${
                    filter === f 
                      ? 'bg-white/20 text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {f === 'all' ? '📋 Todos' : `${levelIcon[f]} ${f}`}
                  {f === 'error' && errorCount > 0 && (
                    <span className="ml-1 text-red-400">({errorCount})</span>
                  )}
                </button>
              ))}
            </div>

            {/* Log entries */}
            <div className="flex-1 overflow-y-auto px-2 py-1 space-y-1 font-mono text-xs">
              {filteredLogs.length === 0 ? (
                <div className="text-gray-500 text-center py-8">
                  {filter === 'error' ? '✅ Nenhum erro registrado!' : 'Nenhum log ainda.'}
                </div>
              ) : (
                [...filteredLogs].reverse().map((entry) => (
                  <LogEntry key={entry.id} entry={entry} levelIcon={levelIcon} levelColor={levelColor} />
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-1 border-t border-gray-700 text-gray-500 text-xs flex justify-between">
              <span>Session: {errorLogger.sessionId.slice(-8)}</span>
              <span>Ctrl+Shift+D para toggle</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function LogEntry({ entry, levelIcon, levelColor }) {
  const [expanded, setExpanded] = useState(false);
  const time = new Date(entry.timestamp).toLocaleTimeString();
  
  return (
    <div 
      className={`rounded px-2 py-1 cursor-pointer hover:bg-white/5 ${levelColor[entry.level] || 'text-gray-300'}`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start gap-1">
        <span className="flex-shrink-0">{levelIcon[entry.level] || '📝'}</span>
        <span className="text-gray-500 flex-shrink-0">[{time}]</span>
        <span className="text-white/70 flex-shrink-0">{entry.source}</span>
        <span className="text-gray-600">.</span>
        <span className="text-purple-300 flex-shrink-0">{entry.action}</span>
        <span className="text-gray-300 truncate">{entry.message}</span>
      </div>
      
      {expanded && (
        <div className="mt-1 ml-6 space-y-1">
          {entry.details && (
            <div className="text-gray-400 bg-black/30 rounded p-1 overflow-x-auto">
              <div className="text-gray-500 text-[10px] uppercase">Details:</div>
              <pre className="whitespace-pre-wrap break-all">
                {typeof entry.details === 'string' 
                  ? entry.details 
                  : JSON.stringify(entry.details, null, 2)}
              </pre>
            </div>
          )}
          {entry.gameState && (
            <div className="text-gray-400 bg-black/30 rounded p-1 overflow-x-auto">
              <div className="text-gray-500 text-[10px] uppercase">Game State:</div>
              <pre className="whitespace-pre-wrap break-all">
                {JSON.stringify(entry.gameState, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default DebugPanel;
