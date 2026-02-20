import React from 'react';
import { motion } from 'framer-motion';

/**
 * IntroductionScreen - Mostra objetivo e dicas, com opção de ver IA ou ir direto
 */
function IntroductionScreen({ lesson, onStartDemo, onStartPractice }) {
  return (
    <motion.div
      key="intro"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-lg mx-auto"
    >
      {/* Objetivo */}
      <div className="bg-white/[0.06] border border-white/[0.08] rounded-xl p-6 mb-5 text-center">
        <div className="text-4xl mb-3">🎯</div>
        <h3 className="text-lg font-bold text-white mb-2">Objetivo</h3>
        <p className="text-white/70 text-base leading-relaxed">
          {lesson.practice.objective}
        </p>
      </div>

      {/* Dicas */}
      {lesson.intro && lesson.intro.length > 0 && (
        <div className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-5 mb-5">
          <h4 className="text-sm font-semibold text-white/50 uppercase tracking-wide mb-3">Como funciona</h4>
          <div className="space-y-2.5">
            {lesson.intro.map((tip, idx) => (
              <motion.p
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="text-white/70 text-sm leading-relaxed flex items-start gap-2"
              >
                <span className="text-white/25 font-mono text-xs mt-0.5 flex-shrink-0">{idx + 1}.</span>
                <span>{tip}</span>
              </motion.p>
            ))}
          </div>
        </div>
      )}

      {/* Recompensas */}
      {lesson.rewards && (
        <div className="flex justify-center gap-4 mb-5 text-xs text-white/30">
          <span>🐟 {lesson.rewards.fishCoins}</span>
          <span>⭐ {lesson.rewards.xp} XP</span>
        </div>
      )}

      {/* Botões */}
      <div className="flex flex-col items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onStartDemo}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500
                   text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-900/30 transition-all
                   flex items-center gap-2"
        >
          <span>🤖</span>
          <span>Ver IA Jogar Primeiro</span>
        </motion.button>

        <button
          onClick={onStartPractice}
          className="text-white/30 hover:text-white/50 text-xs transition-all"
        >
          Ir direto para prática →
        </button>
      </div>
    </motion.div>
  );
}

export default IntroductionScreen;
