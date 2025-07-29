import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MainMenu({ 
  onStartGame, 
  onShowSettings, 
  onShowStatistics, 
  onShowInstallPrompt,
  canInstallPWA 
}) {
  const [selectedOption, setSelectedOption] = useState(0);
  const [showParticles, setShowParticles] = useState(true);

  const menuOptions = [
    {
      id: 'play',
      icon: '🎮',
      title: 'Jogar',
      subtitle: 'Começar uma nova partida',
      action: onStartGame,
      gradient: 'from-green-500 to-emerald-600',
      hoverGradient: 'from-green-400 to-emerald-500'
    },
    {
      id: 'stats',
      icon: '📊',
      title: 'Estatísticas',
      subtitle: 'Ver recordes e conquistas',
      action: onShowStatistics,
      gradient: 'from-blue-500 to-cyan-600',
      hoverGradient: 'from-blue-400 to-cyan-500'
    },
    {
      id: 'settings',
      icon: '⚙️',
      title: 'Configurações',
      subtitle: 'Ajustar volume e controles',
      action: onShowSettings,
      gradient: 'from-purple-500 to-violet-600',
      hoverGradient: 'from-purple-400 to-violet-500'
    },
    ...(canInstallPWA ? [{
      id: 'install',
      icon: '📱',
      title: 'Instalar App',
      subtitle: 'Jogar offline como app nativo',
      action: onShowInstallPrompt,
      gradient: 'from-orange-500 to-red-600',
      hoverGradient: 'from-orange-400 to-red-500'
    }] : [])
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          setSelectedOption(prev => 
            prev === 0 ? menuOptions.length - 1 : prev - 1
          );
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedOption(prev => 
            prev === menuOptions.length - 1 ? 0 : prev + 1
          );
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          menuOptions[selectedOption]?.action();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedOption, menuOptions]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [-2, 2, -2],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen cat-bg flex items-center justify-center p-4 relative overflow-hidden">
      
      {showParticles && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      )}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-2xl w-full relative z-10"
      >
        <motion.div variants={itemVariants} className="text-center mb-12">
          <motion.div
            variants={floatingVariants}
            animate="animate"
            className="inline-block"
          >
            <h1 className="text-6xl md:text-8xl font-cat font-bold text-white mb-4 drop-shadow-2xl">
              🐱 Cat Tetris 🐱
            </h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="relative"
          >
            <p className="text-xl md:text-2xl text-white/90 font-medium mb-2">
              O jogo de Tetris mais fofo do mundo!
            </p>
            <p className="text-lg text-white/70">
              Empilhe blocos com seus amigos felinos 🐾
            </p>
          </motion.div>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="grid gap-4 md:gap-6"
        >
          {menuOptions.map((option, index) => (
            <motion.button
              key={option.id}
              onClick={option.action}
              onMouseEnter={() => setSelectedOption(index)}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={`
                group relative overflow-hidden rounded-2xl p-6 text-left
                bg-gradient-to-r ${selectedOption === index ? option.hoverGradient : option.gradient}
                shadow-2xl border-2 transition-all duration-300
                ${selectedOption === index 
                  ? 'border-white/50 shadow-white/20' 
                  : 'border-white/20 hover:border-white/40'
                }
              `}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative flex items-center">
                <div className="text-4xl mr-4 group-hover:scale-110 transition-transform duration-300">
                  {option.icon}
                </div>
                
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-yellow-200 transition-colors">
                    {option.title}
                  </h3>
                  <p className="text-white/80 group-hover:text-white transition-colors">
                    {option.subtitle}
                  </p>
                </div>

                <div className="text-white/60 group-hover:text-white transition-all duration-300 group-hover:translate-x-1">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z"/>
                  </svg>
                </div>
              </div>

              {selectedOption === index && (
                <motion.div
                  layoutId="selector"
                  className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 rounded-2xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>
          ))}
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="text-center mt-8 space-y-4"
        >
          <div className="flex justify-center space-x-8 text-white/60">
            <span className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-white/20 rounded text-sm">↑↓</kbd>
              Navegar
            </span>
            <span className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-white/20 rounded text-sm">Enter</kbd>
              Selecionar
            </span>
          </div>

          <motion.button
            onClick={() => setShowParticles(!showParticles)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-white/40 hover:text-white/60 transition-colors text-sm"
          >
            {showParticles ? '✨ Efeitos: ON' : '💫 Efeitos: OFF'}
          </motion.button>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="absolute -top-20 -right-20 text-9xl opacity-10 pointer-events-none"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          🐱
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="absolute -bottom-20 -left-20 text-7xl opacity-10 pointer-events-none"
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        >
          🎮
        </motion.div>
      </motion.div>
    </div>
  );
} 