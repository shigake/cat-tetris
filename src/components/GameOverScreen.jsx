import React from 'react';
import { motion } from 'framer-motion';

const GameOverScreen = ({ score, onRestart }) => {
  const getMotivationalMessage = (score) => {
    if (score < 1000) return "Não desista! Cada tentativa te torna melhor! 😸";
    if (score < 5000) return "Bom trabalho! Continue praticando! 😺";
    if (score < 10000) return "Excelente! Você está ficando muito bom! 😸";
    return "Incrível! Você é um mestre do Cat Tetris! 😻";
  };

  const getCatEmoji = (score) => {
    if (score < 1000) return "😿";
    if (score < 5000) return "😺";
    if (score < 10000) return "😸";
    return "😻";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 15 }}
        className="bg-gray-900/90 p-8 rounded-2xl border-2 border-white/20 shadow-2xl max-w-md w-full mx-4"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="text-6xl mb-4"
          >
            {getCatEmoji(score)}
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-cat font-bold text-white mb-2"
          >
            Game Over!
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 font-bold text-xl p-3 rounded-lg mb-4"
          >
            {score.toLocaleString()} pontos
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-white/80 mb-6 text-lg"
          >
            {getMotivationalMessage(score)}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-3"
          >
            <button
              onClick={onRestart}
              className="w-full bg-gradient-to-r from-cat-pink to-cat-purple text-white font-bold py-3 px-6 rounded-lg hover:from-cat-purple hover:to-cat-pink transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              🎮 Jogar Novamente
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gray-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-600 transition-all duration-300 transform hover:scale-105"
            >
              🔄 Reiniciar Jogo
            </button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6 text-center text-white/60 text-sm"
          >
            <p>💡 Dica: Use a sombra para planejar melhor!</p>
            <p>🎯 Tente fazer combos para mais pontos!</p>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GameOverScreen; 