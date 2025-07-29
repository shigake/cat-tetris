import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function AIControls({ 
  isActive, 
  speed, 
  metrics, 
  isThinking, 
  lastMove,
  onActivate, 
  onDeactivate, 
  onSpeedChange,
  onResetMetrics,
  strategyInfo 
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showMetrics, setShowMetrics] = useState(true);

  return (
    <motion.div 
      className="bg-gray-900/95 backdrop-blur-sm border border-purple-500/30 rounded-xl p-4 space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
          <h3 className="text-white font-bold text-lg">🤖 AI TETRIS MASTER</h3>
          {isThinking && (
            <motion.div
              className="w-2 h-2 bg-yellow-400 rounded-full"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
            />
          )}
        </div>
        <div className="text-xs text-gray-400">
          {strategyInfo?.name || 'Heuristic AI'}
        </div>
      </div>

      {/* Main Controls */}
      <div className="flex items-center space-x-4">
                 <motion.button
          onClick={isActive ? onDeactivate : onActivate}
          className={`px-6 py-2 rounded-lg font-bold text-sm transition-all duration-200 ${
            isActive 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isActive ? '⏹️ STOP AI' : '▶️ START AI'}
        </motion.button>

        <motion.button
          onClick={() => {
            console.log('🐛 Debug: Forcing game restart');
            const gameService = window.gameServiceRef?.current;
            if (gameService) {
              console.log('🐛 Before restart:', {
                isPlaying: gameService.isPlaying,
                isPaused: gameService.isPaused,
                gameOver: gameService.gameOver
              });
              
              gameService.restart();
              
              console.log('🐛 After restart:', {
                isPlaying: gameService.isPlaying,
                isPaused: gameService.isPaused,
                gameOver: gameService.gameOver
              });
              
              // Force piece movement test
              setTimeout(() => {
                console.log('🐛 Testing piece movement...');
                if (gameService.currentPiece) {
                  console.log('🐛 Current piece before:', {
                    type: gameService.currentPiece.type,
                    position: gameService.currentPiece.position
                  });
                  
                  // Test all movements
                  gameService.movePiece('left');
                  console.log('🐛 After left:', gameService.currentPiece.position);
                  
                  setTimeout(() => {
                    gameService.movePiece('right');
                    console.log('🐛 After right:', gameService.currentPiece.position);
                    
                    setTimeout(() => {
                      gameService.movePiece('down');
                      console.log('🐛 After down:', gameService.currentPiece.position);
                    }, 500);
                  }, 500);
                }
              }, 1000);
            }
          }}
          className="px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white font-bold text-sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🔧 FORCE RESTART
        </motion.button>

        <motion.button
          onClick={() => {
            console.log('🔄 Force refresh state');
            const gameService = window.gameServiceRef?.current;
            if (gameService) {
              // Force emit game state update
              const currentState = gameService.getGameState();
              console.log('🔄 Current game state:', currentState);
              
              // Force trigger state update
              window.dispatchEvent(new CustomEvent('tetris-force-update'));
            }
          }}
          className="px-3 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🔄 REFRESH
        </motion.button>

        {/* Speed Control */}
        <div className="flex items-center space-x-2">
          <span className="text-white text-sm font-medium">Speed:</span>
          <div className="flex items-center space-x-2">
            <input
              type="range"
              min="0.1"
              max="10"
              step="0.1"
              value={speed}
              onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
              className="w-20 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-purple-300 text-sm font-mono w-12">
              {speed.toFixed(1)}x
            </span>
          </div>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="flex items-center space-x-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-400' : 'bg-gray-500'}`}></div>
          <span className="text-gray-300">
            Status: {isActive ? 'ACTIVE' : 'INACTIVE'}
          </span>
        </div>
        
        {isThinking && (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
            <span className="text-yellow-300">Calculating...</span>
          </div>
        )}

        {lastMove && (
          <div className="flex items-center space-x-2">
            <span className="text-blue-300">
              Last: x{lastMove.x} rot{lastMove.rotation}
            </span>
            {lastMove.confidence && (
              <span className="text-green-300">
                ({lastMove.confidence.toFixed(0)}% conf)
              </span>
            )}
          </div>
        )}
      </div>

      {/* Metrics Toggle */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowMetrics(!showMetrics)}
          className="text-purple-300 hover:text-purple-200 text-sm font-medium"
        >
          📊 {showMetrics ? 'Hide' : 'Show'} Metrics
        </button>
        
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-gray-400 hover:text-gray-300 text-sm"
        >
          ⚙️ {showAdvanced ? 'Hide' : 'Show'} Advanced
        </button>
      </div>

      {/* Metrics Panel */}
      <AnimatePresence>
        {showMetrics && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-800/50 rounded-lg p-3 space-y-2"
          >
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Games:</span>
                <span className="text-white ml-2 font-mono">
                  {metrics.gamesPlayed || 0}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Best Score:</span>
                <span className="text-green-300 ml-2 font-mono">
                  {metrics.bestScore?.toLocaleString() || '0'}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Avg Score:</span>
                <span className="text-blue-300 ml-2 font-mono">
                  {Math.round(metrics.averageScore || 0).toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-gray-400">T-Spin Rate:</span>
                <span className="text-purple-300 ml-2 font-mono">
                  {(metrics.tSpinRate || 0).toFixed(1)}%
                </span>
              </div>
              <div>
                <span className="text-gray-400">Lines/Min:</span>
                <span className="text-yellow-300 ml-2 font-mono">
                  {(metrics.linesPerMinute || 0).toFixed(1)}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Total Lines:</span>
                <span className="text-cyan-300 ml-2 font-mono">
                  {metrics.linesCleared || 0}
                </span>
              </div>
            </div>
            
            <div className="flex justify-end pt-2">
              <button
                onClick={onResetMetrics}
                className="text-red-400 hover:text-red-300 text-xs font-medium"
              >
                🗑️ Reset Metrics
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Advanced Panel */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-800/50 rounded-lg p-3 space-y-3"
          >
            <h4 className="text-white font-medium text-sm">🧠 Strategy Info</h4>
            
            {strategyInfo && (
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-gray-400">Description:</span>
                  <span className="text-white ml-2">{strategyInfo.description}</span>
                </div>
                
                <div>
                  <span className="text-gray-400">Features:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {strategyInfo.features?.map((feature, index) => (
                      <span 
                        key={index}
                        className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-xs"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {strategyInfo.weights && (
                  <div>
                    <span className="text-gray-400">Weights:</span>
                    <div className="grid grid-cols-2 gap-1 mt-1 text-xs font-mono">
                      {Object.entries(strategyInfo.weights).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-gray-400">{key}:</span>
                          <span className="text-white">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {lastMove?.evaluation && (
              <div>
                <h5 className="text-purple-300 font-medium text-sm">Last Move Analysis:</h5>
                <div className="grid grid-cols-2 gap-1 text-xs font-mono mt-1">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Score:</span>
                    <span className="text-green-300">{Math.round(lastMove.evaluation.totalScore)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Height:</span>
                    <span className="text-blue-300">{lastMove.evaluation.height}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Holes:</span>
                    <span className="text-red-300">{lastMove.evaluation.holes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Lines:</span>
                    <span className="text-yellow-300">{lastMove.evaluation.linesCleared}</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
} 