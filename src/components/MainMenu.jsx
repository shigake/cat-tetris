import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMenuSounds } from '../hooks/useMenuSounds';

export default function MainMenu({ 
  onStartGame, 
  onShowSettings, 
  onShowStatistics, 
  onShowInstallPrompt,
  canInstallPWA 
}) {
  const [selectedOption, setSelectedOption] = useState(0);
  const [showParticles, setShowParticles] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);

  const sounds = useMenuSounds();

  const menuOptions = [
    {
      id: 'play',
      icon: '🎮',
      title: 'Jogar',
      subtitle: 'Começar uma nova partida',
      action: () => {
        if (soundEnabled) sounds.playGameStart();
        setTimeout(() => onStartGame(), 300);
      },
      gradient: 'from-green-500 to-emerald-600',
      hoverGradient: 'from-green-400 to-emerald-500',
      glow: 'shadow-green-500/25'
    },
    {
      id: 'stats',
      icon: '📊',
      title: 'Estatísticas',
      subtitle: 'Ver recordes e conquistas',
      action: () => {
        if (soundEnabled) sounds.playMenuSelect();
        onShowStatistics();
      },
      gradient: 'from-blue-500 to-cyan-600',
      hoverGradient: 'from-blue-400 to-cyan-500',
      glow: 'shadow-blue-500/25'
    },
    {
      id: 'settings',
      icon: '⚙️',
      title: 'Configurações',
      subtitle: 'Ajustar volume e controles',
      action: () => {
        if (soundEnabled) sounds.playMenuSelect();
        onShowSettings();
      },
      gradient: 'from-purple-500 to-violet-600',
      hoverGradient: 'from-purple-400 to-violet-500',
      glow: 'shadow-purple-500/25'
    },
    ...(canInstallPWA ? [{
      id: 'install',
      icon: '📱',
      title: 'Instalar App',
      subtitle: 'Jogar offline como app nativo',
      action: () => {
        if (soundEnabled) sounds.playPWAInstall();
        onShowInstallPrompt();
      },
      gradient: 'from-orange-500 to-red-600',
      hoverGradient: 'from-orange-400 to-red-500',
      glow: 'shadow-orange-500/25'
    }] : [])
  ];

  useEffect(() => {
    setMenuVisible(true);
    if (soundEnabled) {
      setTimeout(() => sounds.playMenuOpen(), 500);
    }
  }, [sounds, soundEnabled]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          if (soundEnabled) sounds.playMenuHover();
          setSelectedOption(prev => 
            prev === 0 ? menuOptions.length - 1 : prev - 1
          );
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (soundEnabled) sounds.playMenuHover();
          setSelectedOption(prev => 
            prev === menuOptions.length - 1 ? 0 : prev + 1
          );
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          menuOptions[selectedOption]?.action();
          break;
        case 'Escape':
          e.preventDefault();
          if (soundEnabled) sounds.playMenuBack();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedOption, menuOptions, sounds, soundEnabled]);

  const handleOptionHover = (index) => {
    if (selectedOption !== index) {
      if (soundEnabled) sounds.playMenuHover();
      setSelectedOption(index);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1,
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.8, 
        ease: "easeOut",
        type: "spring",
        damping: 20,
        stiffness: 100
      }
    }
  };

  const floatingVariants = {
    animate: {
      y: [-15, 15, -15],
      rotate: [-3, 3, -3],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen cat-bg flex items-center justify-center p-4 relative overflow-hidden">
      
      {showParticles && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 0.8, 0],
                y: [0, -30, -60],
              }}
              transition={{
                duration: 4 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          ))}
          
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={`cat-${i}`}
              className="absolute text-4xl opacity-10"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: `${10 + Math.random() * 80}%`,
              }}
              animate={{
                rotate: [0, 360],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 15 + i * 3,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              🐱
            </motion.div>
          ))}
        </div>
      )}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={menuVisible ? "visible" : "hidden"}
        className="max-w-2xl w-full relative z-10"
      >
        <motion.div variants={itemVariants} className="text-center mb-12">
          <motion.div
            variants={floatingVariants}
            animate="animate"
            className="inline-block"
          >
            <motion.h1 
              variants={pulseVariants}
              animate="animate"
              className="text-6xl md:text-8xl font-cat font-bold text-white mb-4 drop-shadow-2xl"
              style={{
                textShadow: '0 0 20px rgba(255,255,255,0.5), 0 0 40px rgba(255,255,255,0.3)',
                filter: 'drop-shadow(0 0 10px rgba(147, 51, 234, 0.5))'
              }}
            >
              🐱 Cat Tetris 🐱
            </motion.h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="relative"
          >
            <p className="text-xl md:text-2xl text-white/90 font-medium mb-2 drop-shadow-lg">
              O jogo de Tetris mais fofo do mundo!
            </p>
            <p className="text-lg text-white/70 drop-shadow-md">
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
              onMouseEnter={() => handleOptionHover(index)}
              whileHover={{ 
                scale: 1.03, 
                y: -4,
                rotateY: selectedOption === index ? 2 : 0
              }}
              whileTap={{ scale: 0.97 }}
              className={`
                group relative overflow-hidden rounded-2xl p-6 text-left
                bg-gradient-to-r ${selectedOption === index ? option.hoverGradient : option.gradient}
                shadow-2xl border-2 transition-all duration-500
                ${selectedOption === index 
                  ? `border-white/60 shadow-2xl ${option.glow}` 
                  : 'border-white/20 hover:border-white/40'
                }
              `}
              style={{
                transform: selectedOption === index ? 'perspective(1000px) rotateX(2deg)' : 'none'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {selectedOption === index && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/5 rounded-2xl"
                  animate={{
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity
                  }}
                />
              )}
              
              <div className="relative flex items-center">
                <motion.div 
                  className="text-4xl mr-4 transition-transform duration-300"
                  animate={selectedOption === index ? {
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, 0]
                  } : {}}
                  transition={{
                    duration: 0.6,
                    repeat: selectedOption === index ? Infinity : 0,
                    repeatDelay: 2
                  }}
                >
                  {option.icon}
                </motion.div>
                
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-yellow-200 transition-colors duration-300">
                    {option.title}
                  </h3>
                  <p className="text-white/80 group-hover:text-white transition-colors duration-300">
                    {option.subtitle}
                  </p>
                </div>

                <motion.div 
                  className="text-white/60 group-hover:text-white transition-all duration-300"
                  animate={selectedOption === index ? {
                    x: [0, 5, 0],
                    scale: [1, 1.1, 1]
                  } : {}}
                  transition={{
                    duration: 1,
                    repeat: selectedOption === index ? Infinity : 0
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z"/>
                  </svg>
                </motion.div>
              </div>
            </motion.button>
          ))}
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="text-center mt-8 space-y-4"
        >
          <div className="flex justify-center space-x-8 text-white/60">
            <span className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-white/20 rounded text-sm backdrop-blur-sm">↑↓</kbd>
              Navegar
            </span>
            <span className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-white/20 rounded text-sm backdrop-blur-sm">Enter</kbd>
              Selecionar
            </span>
            <span className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-white/20 rounded text-sm backdrop-blur-sm">Esc</kbd>
              Sair
            </span>
          </div>

          <div className="flex justify-center space-x-6">
            <motion.button
              onClick={() => {
                setShowParticles(!showParticles);
                if (soundEnabled) sounds.playMenuSelect();
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-white/40 hover:text-white/70 transition-colors text-sm px-3 py-1 rounded-lg bg-white/10 backdrop-blur-sm"
            >
              {showParticles ? '✨ Efeitos: ON' : '💫 Efeitos: OFF'}
            </motion.button>

            <motion.button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                if (!soundEnabled) sounds.playMenuSelect();
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-white/40 hover:text-white/70 transition-colors text-sm px-3 py-1 rounded-lg bg-white/10 backdrop-blur-sm"
            >
              {soundEnabled ? '🔊 Sons: ON' : '🔇 Sons: OFF'}
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="absolute -top-20 -right-20 text-9xl opacity-5 pointer-events-none"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          🎮
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="absolute -bottom-20 -left-20 text-7xl opacity-5 pointer-events-none"
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        >
          🐱
        </motion.div>
      </motion.div>
    </div>
  );
} 