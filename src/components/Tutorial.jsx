import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGamepadNav } from '../hooks/useGamepadNav';

function Tutorial({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {

    const hasSeenTutorial = localStorage.getItem('catTetris_tutorialCompleted');
    if (!hasSeenTutorial) {
      setShow(true);
    }
  }, []);

  const steps = [
    {
      title: '🐱 Bem-vindo ao Cat Tetris!',
      description: 'Um Tetris com gatinhos e sistema de progressão viciante!',
      tips: [
        '🎮 Use as setas para mover as peças',
        '⬆️ Seta para cima para rotacionar',
        '⬇️ Seta para baixo para drop rápido',
        'C para segurar peça (Hold)'
      ]
    },
    {
      title: '🐟 Sistema de Moedas',
      description: 'Ganhe Peixes (🐟) completando missões e conquistas!',
      tips: [
        '📋 3 missões diárias (resetam à meia-noite)',
        '🏆 22 conquistas desbloqueáveis',
        '🛍️ Use 🐟 para comprar temas na loja',
        '💰 Quanto mais você joga, mais você ganha!'
      ]
    },
    {
      title: '🎯 Missões Diárias',
      description: 'Complete desafios diários para ganhar recompensas!',
      tips: [
        '🟢 Missão Fácil: 100🐟',
        '🟡 Missão Média: 200🐟',
        '🔴 Missão Difícil: 400🐟',
        '✨ Complete todas para celebração especial!'
      ]
    },
    {
      title: '🛍️ Loja e Personalização',
      description: 'Customize suas peças com temas exclusivos!',
      tips: [
        '🐶 10 temas diferentes disponíveis',
        '💎 Cristais e Espaço são os mais caros',
        '🎨 Cada tema muda os emojis das peças',
        '🔓 Desbloqueie todos com suas moedas!'
      ]
    },
    {
      title: '🏆 Ranking Global',
      description: 'Compete com jogadores do mundo todo!',
      tips: [
        '🌍 Veja sua posição no ranking global',
        '📊 4 tipos de ranking: Global, Semanal, País, Ao Redor',
        '📤 Compartilhe seus recordes',
        '🥇 Chegue ao Top 3 para medalha!'
      ]
    },
    {
      title: '🎮 Pronto para Jogar!',
      description: 'Agora você sabe tudo. Divirta-se!',
      tips: [
        '💡 Dica: Use a sombra da peça para planejar',
        '🔥 Faça combos para mais pontos',
        '⚡ T-Spins valem MUITO mais',
        '🌙 Modo Zen é perfeito para relaxar'
      ]
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    localStorage.setItem('catTetris_tutorialCompleted', 'true');
    setShow(false);
    if (onComplete) onComplete();
  };

  if (!show) return null;

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  // Items: on non-last step = [Skip, Next] = 2; on last step = [Start] = 1
  const navItemCount = isLastStep ? 1 : 2;

  const handleNavConfirm = useCallback((idx) => {
    if (isLastStep) {
      handleNext();
    } else {
      if (idx === 0) handleSkip();
      else handleNext();
    }
  }, [isLastStep, currentStep]);

  const { selectedIndex: tutSelectedIndex } = useGamepadNav({
    itemCount: navItemCount,
    onConfirm: handleNavConfirm,
    onBack: handleSkip,
    active: show,
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
    >
      <motion.div
        key={currentStep}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gradient-to-br from-purple-900/95 to-indigo-900/95 rounded-2xl p-8 max-w-lg w-full border-2 border-white/20 shadow-2xl max-h-[90vh] overflow-y-auto"
      >

        <div className="flex gap-2 mb-6">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 flex-1 rounded-full transition-colors ${
                index <= currentStep ? 'bg-green-500' : 'bg-white/20'
              }`}
            />
          ))}
        </div>

        <motion.h2
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-3xl font-bold text-white mb-3"
        >
          {step.title}
        </motion.h2>

        <motion.p
          initial={{ y: -10 }}
          animate={{ y: 0 }}
          className="text-white/80 text-lg mb-6"
        >
          {step.description}
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-black/30 rounded-lg p-4 mb-6 space-y-2"
        >
          {step.tips.map((tip, index) => (
            <motion.div
              key={index}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="text-white/90 flex items-start gap-2"
            >
              <span className="text-green-400 mt-0.5">✓</span>
              <span>{tip}</span>
            </motion.div>
          ))}
        </motion.div>

        <div className="flex gap-3">
          {!isLastStep && (
            <button
              onClick={handleSkip}
              className={`flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-lg transition-colors ${tutSelectedIndex === 0 ? 'ring-2 ring-yellow-400' : ''}`}
            >
              Pular Tutorial
            </button>
          )}
          <button
            onClick={handleNext}
            className={`flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg ${(isLastStep ? tutSelectedIndex === 0 : tutSelectedIndex === 1) ? 'ring-2 ring-yellow-400' : ''}`}
          >
            {isLastStep ? '🎮 Começar a Jogar!' : 'Próximo →'}
          </button>
        </div>

        <div className="text-center mt-4 text-white/40 text-sm">
          Passo {currentStep + 1} de {steps.length} | 🎮 Ⓑ Pular
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Tutorial;

