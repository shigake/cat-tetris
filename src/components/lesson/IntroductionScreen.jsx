import React from 'react';
import { motion } from 'framer-motion';

/**
 * IntroductionScreen - Tela inicial da lição
 */
function IntroductionScreen({ lesson, hasDemoAvailable, onStartDemo, onStartPractice }) {
  return (
    <motion.div
      key="intro"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto"
    >
      {/* Objetivo */}
      <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl p-8 mb-8 text-center">
        <div className="text-6xl mb-4">🎯</div>
        <h3 className="text-3xl font-bold text-white mb-4">O que você vai aprender</h3>
        <p className="text-2xl text-white/90 leading-relaxed">
          {lesson.practice.objective}
        </p>
      </div>

      {/* Explicação */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8">
        <h4 className="text-2xl font-bold text-white mb-4">💡 Como funciona</h4>
        <div className="text-xl text-white/80 leading-relaxed space-y-4">
          {lesson.demonstration.narration.map((narr, idx) => (
            <p key={idx} className="flex items-start gap-3">
              <span className="text-purple-400 font-bold">{idx + 1}.</span>
              <span>{narr.text}</span>
            </p>
          ))}
        </div>
      </div>

      {/* Botões */}
      <div className="flex gap-4 justify-center">
        {hasDemoAvailable && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStartDemo}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 
                     text-white px-8 py-4 rounded-xl font-bold text-xl shadow-2xl flex items-center gap-3"
          >
            <span className="text-3xl">🎬</span>
            <span>Ver Demonstração</span>
          </motion.button>
        )}
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStartPractice}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 
                   text-white px-8 py-4 rounded-xl font-bold text-xl shadow-2xl flex items-center gap-3"
        >
          <span className="text-3xl">🎮</span>
          <span>Ir para Prática</span>
        </motion.button>
      </div>

      {/* Dica */}
      <div className="mt-8 text-center text-white/60 text-lg">
        <p>💡 Recomendamos ver a demonstração primeiro</p>
      </div>
    </motion.div>
  );
}

export default IntroductionScreen;
