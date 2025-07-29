import React from 'react';
import { motion } from 'framer-motion';

const Statistics = ({ stats }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-900/50 p-4 rounded-xl border-2 border-white/20 shadow-2xl min-w-[250px]"
    >
      <h2 className="text-2xl font-cat font-bold text-white mb-4 text-center">
        📊 Estatísticas
      </h2>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-white/80">Tempo Jogado:</span>
          <span className="text-blue-400 font-bold">
            {formatTime(stats.playTime)}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-white/80">Peças Colocadas:</span>
          <span className="text-green-400 font-bold">
            {stats.piecesPlaced}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-white/80">Linhas Limpas:</span>
          <span className="text-yellow-400 font-bold">
            {stats.linesCleared}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-white/80">T-Spins:</span>
          <span className="text-purple-400 font-bold">
            {stats.tSpins}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-white/80">Back-to-Back:</span>
          <span className="text-orange-400 font-bold">
            {stats.backToBack}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-white/80">Combo Máximo:</span>
          <span className="text-red-400 font-bold">
            {stats.maxCombo}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-white/80">Tetris (4 linhas):</span>
          <span className="text-cyan-400 font-bold">
            {stats.tetrisCount}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-white/80">LPS (Linhas/seg):</span>
          <span className="text-pink-400 font-bold">
            {(typeof stats.linesPerSecond === 'number' ? stats.linesPerSecond : 0).toFixed(2)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default Statistics; 