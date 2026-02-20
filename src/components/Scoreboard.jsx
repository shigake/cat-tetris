import React, { useState, useEffect } from 'react';
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
    <div
      className="bg-gray-900/50 p-2 rounded-xl border-2 border-white/20 shadow-2xl w-28"
    >
      <h2 className="text-xs font-bold text-white mb-1 text-center">
        📊 Pontuação
      </h2>
      
      <div className="space-y-0.5 text-xs">
        <div className="flex justify-between items-center">
          <span className="text-white/70">Pontos:</span>
          <span className="text-yellow-400 font-bold">
            {score.toLocaleString()}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-white/70">Recorde:</span>
          <span className="text-green-400 font-bold">
            {highScore.toLocaleString()}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-white/70">Nível:</span>
          <span className="text-blue-400 font-bold">
            {level}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-white/70">Linhas:</span>
          <span className="text-purple-400 font-bold">
            {lines}
          </span>
        </div>
        
        {combo > 0 && (
          <div
            className="flex justify-between items-center bg-orange-500/20 px-1.5 py-0.5 rounded border border-orange-400/30 mt-0.5"
          >
            <span className="text-white/90">Combo:</span>
            <span className="text-orange-400 font-bold">
              {combo}x
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Scoreboard; 