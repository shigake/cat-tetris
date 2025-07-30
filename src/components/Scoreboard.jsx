import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { scoreService } from '../services/ScoreService';

const Scoreboard = ({ score, level, lines, combo }) => {
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    setHighScore(scoreService.getHighScore());
  }, []);

  useEffect(() => {
    if (scoreService.saveHighScore(score)) {
      setHighScore(score);
    }
  }, [score]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-900/50 p-2 lg:p-4 rounded-xl border-2 border-white/20 shadow-2xl min-w-[140px] lg:min-w-[200px]"
    >
      <h2 className="text-lg lg:text-2xl font-cat font-bold text-white mb-2 lg:mb-4 text-center">
        📊 <span className="hidden lg:inline">Pontuação</span>
      </h2>
      
      <div className="space-y-1 lg:space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-white/80 text-sm lg:text-base">Pontos:</span>
          <span className="text-yellow-400 font-bold text-sm lg:text-lg">
            {score.toLocaleString()}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-white/80 text-sm lg:text-base">Recorde:</span>
          <span className="text-green-400 font-bold text-sm lg:text-lg">
            {highScore.toLocaleString()}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-white/80 text-sm lg:text-base">Nível:</span>
          <span className="text-blue-400 font-bold text-sm lg:text-lg">
            {level}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-white/80 text-sm lg:text-base">Linhas:</span>
          <span className="text-purple-400 font-bold text-sm lg:text-lg">
            {lines}
          </span>
        </div>
        
        {combo > 0 && (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="flex justify-between items-center bg-orange-500/20 p-2 rounded-lg border border-orange-400/30"
          >
            <span className="text-white/90">Combo:</span>
            <span className="text-orange-400 font-bold text-lg">
              {combo}x
            </span>
          </motion.div>
        )}
      </div>
      
      <div className="mt-4 pt-4 border-t border-white/20">
        <div className="text-center text-white/60 text-sm">
          <p>🎯 Objetivo: Limpar linhas!</p>
          <p>⚡ Combos dão pontos extras</p>
        </div>
      </div>
    </motion.div>
  );
};

export default Scoreboard; 