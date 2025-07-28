import React from 'react';
import { motion } from 'framer-motion';

const GameOverScreen = ({ score, onRestart }) => {
  const [highScore, setHighScore] = React.useState(0);
  const [isNewRecord, setIsNewRecord] = React.useState(false);

  React.useEffect(() => {
    const saved = localStorage.getItem('cat-tetris-highscore');
    if (saved) {
      const savedScore = parseInt(saved);
      setHighScore(savedScore);
      setIsNewRecord(score >= savedScore);
    }
  }, [score]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        transition={{ type: "spring", damping: 15, stiffness: 300 }}
        className="bg-gradient-to-br from-cat-pink/90 to-cat-purple/90 backdrop-blur-md rounded-2xl p-8 border-2 border-white/30 shadow-2xl max-w-md w-full"
      >
        {/* Gato triste */}
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="text-center mb-6"
        >
          <div className="text-8xl mb-4 animate-bounce-slow">😿</div>
          <h1 className="text-3xl font-cat font-bold text-white mb-2">
            Game Over!
          </h1>
          <p className="text-white/80">O gatinho ficou triste...</p>
        </motion.div>

        {/* Pontuação */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center mb-6"
        >
          <div className="bg-white/20 rounded-lg p-4 mb-4">
            <div className="text-sm text-white/80 mb-1">Sua Pontuação</div>
            <div className="text-3xl font-bold text-white font-mono">
              {score.toString().padStart(6, '0')}
            </div>
          </div>

          {isNewRecord && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: "spring" }}
              className="bg-gradient-to-r from-cat-yellow to-cat-orange rounded-lg p-3 mb-4"
            >
              <div className="text-white font-bold text-lg">
                🎉 Novo Recorde! 🎉
              </div>
            </motion.div>
          )}

          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-sm text-white/80 mb-1">Recorde</div>
            <div className="text-xl font-bold text-white font-mono">
              {highScore.toString().padStart(6, '0')}
            </div>
          </div>
        </motion.div>

        {/* Botões */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col gap-3"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRestart}
            className="w-full bg-gradient-to-r from-cat-green to-cat-blue text-white font-bold py-3 px-6 rounded-xl hover:from-cat-blue hover:to-cat-green transition-all duration-200 border-2 border-white/30"
          >
            🐱 Jogar Novamente 🐱
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            className="w-full bg-gradient-to-r from-cat-orange to-cat-red text-white font-bold py-3 px-6 rounded-xl hover:from-cat-red hover:to-cat-orange transition-all duration-200 border-2 border-white/30"
          >
            🏠 Voltar ao Menu 🏠
          </motion.button>
        </motion.div>

        {/* Mensagem motivacional */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-6"
        >
          <p className="text-white/70 text-sm">
            Não desista! Os gatinhos acreditam em você! 😸
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default GameOverScreen; 