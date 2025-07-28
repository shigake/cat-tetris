import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Scoreboard = ({ score, level, lines, combo }) => {
  const [highScore, setHighScore] = useState(0);

  // Carregar recorde do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('cat-tetris-highscore');
    if (saved) {
      setHighScore(parseInt(saved));
    }
  }, []);

  // Salvar recorde quando necessário
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('cat-tetris-highscore', score.toString());
    }
  }, [score, highScore]);

  const formatNumber = (num) => {
    return num.toString().padStart(6, '0');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white/10 backdrop-blur-sm rounded-xl p-3 lg:p-4 border border-white/20"
    >
      <h2 className="text-lg lg:text-xl font-cat font-bold text-white mb-3 lg:mb-4 text-center">
        📊 Pontuação
      </h2>
      
      <div className="space-y-2 lg:space-y-3">
        {/* Pontuação Atual */}
        <div className="bg-gradient-to-r from-cat-pink to-cat-purple rounded-lg p-3">
          <div className="text-sm text-white/80">Pontuação</div>
          <motion.div
            key={score}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className="text-2xl font-bold text-white font-mono"
          >
            {formatNumber(score)}
          </motion.div>
        </div>

        {/* Recorde */}
        <div className="bg-gradient-to-r from-cat-yellow to-cat-orange rounded-lg p-3">
          <div className="text-sm text-white/80">Recorde</div>
          <div className="text-xl font-bold text-white font-mono">
            {formatNumber(highScore)}
          </div>
        </div>

        {/* Nível */}
        <div className="bg-gradient-to-r from-cat-blue to-cat-green rounded-lg p-3">
          <div className="text-sm text-white/80">Nível</div>
          <motion.div
            key={level}
            initial={{ scale: 1.2, rotate: 5 }}
            animate={{ scale: 1, rotate: 0 }}
            className="text-xl font-bold text-white"
          >
            {level} 🐱
          </motion.div>
        </div>

        {/* Linhas */}
        <div className="bg-gradient-to-r from-cat-green to-cat-blue rounded-lg p-3">
          <div className="text-sm text-white/80">Linhas</div>
          <div className="text-xl font-bold text-white">
            {lines} 📏
          </div>
        </div>

        {/* Combo */}
        {combo > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-gradient-to-r from-cat-red to-cat-pink rounded-lg p-3"
          >
            <div className="text-sm text-white/80">Combo</div>
            <div className="text-xl font-bold text-white animate-pulse">
              {combo}x 🔥
            </div>
          </motion.div>
        )}
      </div>

      {/* Próximo nível */}
      <div className="mt-4 text-center">
        <div className="text-xs text-white/60">
          Próximo nível em {1000 - (score % 1000)} pontos
        </div>
        <div className="w-full bg-white/20 rounded-full h-2 mt-1">
          <motion.div
            className="bg-gradient-to-r from-cat-pink to-cat-purple h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(score % 1000) / 10}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Scoreboard; 