import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMenuSounds } from '../hooks/useMenuSounds';
import { useAmbientMusic } from '../hooks/useAmbientMusic';
import AdvancedParticles from './AdvancedParticles';

export default function MainMenu({ 
  onStartGame, 
  onNewGame,
  onShowSettings, 
  onShowStatistics, 
  onShowInstallPrompt,
  canInstallPWA,
  hasActiveGame,
  gameState
}) {
  const [selectedOption, setSelectedOption] = useState(0);
  const [showParticles, setShowParticles] = useState(false); // Disabled by default
  const [particleType, setParticleType] = useState('mixed');
  const [particleIntensity, setParticleIntensity] = useState('medium');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);

  const sounds = useMenuSounds();
  const music = useAmbientMusic();

  const menuOptions = useMemo(() => {
    const baseOptions = [];

    if (hasActiveGame) {
      // Show continue and new game options
      baseOptions.push({
        id: 'continue',
        icon: '▶️',
        title: 'Continuar Jogo',
        subtitle: `Nível ${gameState?.score?.level || 1} • ${gameState?.score?.points?.toLocaleString() || 0} pts`,
        action: () => {
          if (soundEnabled) sounds.playGameStart();
          if (musicEnabled) music.stopAmbientMusic();
          setTimeout(() => onStartGame(), 300);
        },
        gradient: 'from-emerald-500 to-green-600',
        hoverGradient: 'from-emerald-400 to-green-500',
        glow: 'shadow-emerald-500/25',
        isPrimary: true
      });

      baseOptions.push({
        id: 'new',
        icon: '🆕',
        title: 'Novo Jogo',
        subtitle: 'Começar uma nova partida',
        action: () => {
          if (soundEnabled) sounds.playGameStart();
          if (musicEnabled) music.stopAmbientMusic();
          setTimeout(() => onNewGame(), 300);
        },
        gradient: 'from-blue-500 to-indigo-600',
        hoverGradient: 'from-blue-400 to-indigo-500',
        glow: 'shadow-blue-500/25'
      });
    } else {
      // Show play option
      baseOptions.push({
        id: 'play',
        icon: '🎮',
        title: 'Jogar',
        subtitle: 'Começar uma nova partida',
        action: () => {
          if (soundEnabled) sounds.playGameStart();
          if (musicEnabled) music.stopAmbientMusic();
          setTimeout(() => onStartGame(), 300);
        },
        gradient: 'from-green-500 to-emerald-600',
        hoverGradient: 'from-green-400 to-emerald-500',
        glow: 'shadow-green-500/25',
        isPrimary: true
      });
    }

    // Add other options
    baseOptions.push(
      {
        id: 'stats',
        icon: '📊',
        title: 'Estatísticas',
        subtitle: 'Ver recordes e conquistas',
        action: () => {
          if (soundEnabled) sounds.playMenuSelect();
          onShowStatistics();
        },
        gradient: 'from-purple-500 to-violet-600',
        hoverGradient: 'from-purple-400 to-violet-500',
        glow: 'shadow-purple-500/25'
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
        gradient: 'from-gray-500 to-slate-600',
        hoverGradient: 'from-gray-400 to-slate-500',
        glow: 'shadow-gray-500/25'
      }
    );

    if (canInstallPWA) {
      baseOptions.push({
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
      });
    }

    return baseOptions;
  }, [
    hasActiveGame, 
    gameState?.score?.level, 
    gameState?.score?.points, 
    canInstallPWA,
    soundEnabled,
    musicEnabled,
    sounds,
    music,
    onStartGame,
    onNewGame,
    onShowStatistics,
    onShowSettings,
    onShowInstallPrompt
  ]);

  const particleThemes = useMemo(() => [
    { name: 'Misto', value: 'mixed', icon: '🎭' },
    { name: 'Corações', value: 'hearts', icon: '❤️' },
    { name: 'Estrelas', value: 'stars', icon: '⭐' },
    { name: 'Gatos', value: 'cats', icon: '🐱' },
    { name: 'Tetris', value: 'tetris', icon: '🟩' },
    { name: 'Magia', value: 'magic', icon: '✨' }
  ], []);

  useEffect(() => {
    setMenuVisible(true);
    let soundTimer, musicTimer;
    
    if (soundEnabled) {
      soundTimer = setTimeout(() => sounds.playMenuOpen(), 500);
    }
    if (musicEnabled) {
      musicTimer = setTimeout(() => music.startAmbientMusic(), 1000);
    }

    return () => {
      if (soundTimer) clearTimeout(soundTimer);
      if (musicTimer) clearTimeout(musicTimer);
      if (musicEnabled) music.stopAmbientMusic();
    };
  }, []); // Only run once on mount

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
        case 'p':
        case 'P':
          e.preventDefault();
          setShowParticles(!showParticles);
          if (soundEnabled) sounds.playMenuSelect();
          break;
        case 'm':
        case 'M':
          e.preventDefault();
          setMusicEnabled(!musicEnabled);
          if (!musicEnabled) {
            music.startAmbientMusic();
          } else {
            music.stopAmbientMusic();
          }
          if (soundEnabled) sounds.playMenuSelect();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedOption, menuOptions.length, soundEnabled, showParticles, musicEnabled, music, sounds]);

  const handleOptionHover = useCallback((index) => {
    if (selectedOption !== index) {
      if (soundEnabled) sounds.playMenuHover();
      setSelectedOption(index);
    }
  }, [selectedOption, soundEnabled, sounds]);

  const cycleParticleType = useCallback(() => {
    const currentIndex = particleThemes.findIndex(theme => theme.value === particleType);
    const nextIndex = (currentIndex + 1) % particleThemes.length;
    setParticleType(particleThemes[nextIndex].value);
    if (soundEnabled) sounds.playMenuSelect();
  }, [particleThemes, particleType, soundEnabled, sounds]);

  const cycleParticleIntensity = useCallback(() => {
    const intensities = ['low', 'medium', 'high'];
    const currentIndex = intensities.indexOf(particleIntensity);
    const nextIndex = (currentIndex + 1) % intensities.length;
    setParticleIntensity(intensities[nextIndex]);
    if (soundEnabled) sounds.playMenuSelect();
  }, [particleIntensity, soundEnabled, sounds]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        duration: 0.2
      }
    }
  };



  const currentTheme = particleThemes.find(theme => theme.value === particleType);

  return (
    <div className="min-h-screen cat-bg flex items-center justify-center p-4 relative overflow-hidden">
      
      <AdvancedParticles 
        enabled={showParticles}
        type={particleType}
        intensity={particleIntensity}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={menuVisible ? "visible" : "hidden"}
        className="max-w-2xl w-full relative z-10"
      >
        <motion.div variants={itemVariants} className="text-center mb-12">
          <div className="inline-block">
            <h1 
              className="text-6xl md:text-8xl font-cat font-bold text-white mb-4 drop-shadow-2xl"
              style={{
                textShadow: '0 0 20px rgba(255,255,255,0.5), 0 0 40px rgba(255,255,255,0.3)',
                filter: 'drop-shadow(0 0 10px rgba(147, 51, 234, 0.5))'
              }}
            >
              🐱 Cat Tetris 🐱
            </h1>
          </div>
          
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
            {hasActiveGame && (
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="text-sm text-yellow-300 mt-2 drop-shadow-md"
              >
                ✨ Você tem um jogo em andamento!
              </motion.p>
            )}
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

              className={`
                group relative overflow-hidden rounded-2xl p-6 text-left
                bg-gradient-to-r ${selectedOption === index ? option.hoverGradient : option.gradient}
                shadow-2xl border-2 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]
                ${selectedOption === index 
                  ? `border-white/60 shadow-2xl ${option.glow}` 
                  : 'border-white/20 hover:border-white/40'
                }
                ${option.isPrimary ? 'ring-2 ring-yellow-400/30' : ''}
              `}
              style={{
                transform: selectedOption === index ? 'perspective(1000px) rotateX(2deg)' : 'none'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {option.isPrimary && (
                <div className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs px-2 py-1 rounded-full font-bold">
                  ⭐
                </div>
              )}
              
              {selectedOption === index && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/15 to-white/5 rounded-2xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.4 }}
                  transition={{
                    duration: 0.3,
                    ease: "easeOut"
                  }}
                />
              )}
              
              <div className="relative flex items-center">
                <div 
                  className={`text-4xl mr-4 transition-all duration-300 ${
                    selectedOption === index ? 'transform scale-105' : ''
                  }`}
                >
                  {option.icon}
                </div>
                
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-yellow-200 transition-colors duration-300">
                    {option.title}
                  </h3>
                  <p className="text-white/80 group-hover:text-white transition-colors duration-300">
                    {option.subtitle}
                  </p>
                </div>

                <div className={`text-white/60 group-hover:text-white transition-all duration-300 ${
                  selectedOption === index ? 'transform translate-x-1' : ''
                }`}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z"/>
                  </svg>
                </div>
              </div>
            </motion.button>
          ))}
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="text-center mt-8 space-y-4"
        >
          <div className="flex justify-center space-x-6 text-white/60 text-sm">
            <span className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-white/20 rounded text-xs backdrop-blur-sm">↑↓</kbd>
              Navegar
            </span>
            <span className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-white/20 rounded text-xs backdrop-blur-sm">Enter</kbd>
              Selecionar
            </span>
            <span className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-white/20 rounded text-xs backdrop-blur-sm">P</kbd>
              Partículas
            </span>
            <span className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-white/20 rounded text-xs backdrop-blur-sm">M</kbd>
              Música
            </span>
          </div>

          <div className="flex justify-center flex-wrap gap-3">
            <button
              onClick={() => {
                setShowParticles(!showParticles);
                if (soundEnabled) sounds.playMenuSelect();
              }}
              className="text-white/40 hover:text-white/70 transition-all duration-200 text-sm px-3 py-1 rounded-lg bg-white/10 backdrop-blur-sm hover:scale-105 active:scale-95"
                          >
                {showParticles ? '✨ Efeitos: ON' : '💫 Efeitos: OFF'}
              </button>

            <button
              onClick={cycleParticleType}
              className="text-white/40 hover:text-white/70 transition-all duration-200 text-sm px-3 py-1 rounded-lg bg-white/10 backdrop-blur-sm hover:scale-105 active:scale-95"
              disabled={!showParticles}
            >
              {currentTheme?.icon} {currentTheme?.name}
            </button>

            <button
              onClick={cycleParticleIntensity}
              className="text-white/40 hover:text-white/70 transition-all duration-200 text-sm px-3 py-1 rounded-lg bg-white/10 backdrop-blur-sm hover:scale-105 active:scale-95"
              disabled={!showParticles}
            >
              🎚️ {particleIntensity.toUpperCase()}
            </button>

            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                if (!soundEnabled) sounds.playMenuSelect();
              }}
              className="text-white/40 hover:text-white/70 transition-all duration-200 text-sm px-3 py-1 rounded-lg bg-white/10 backdrop-blur-sm hover:scale-105 active:scale-95"
            >
              {soundEnabled ? '🔊 Sons: ON' : '🔇 Sons: OFF'}
            </button>

            <button
              onClick={() => {
                setMusicEnabled(!musicEnabled);
                if (!musicEnabled) {
                  music.startAmbientMusic();
                } else {
                  music.stopAmbientMusic();
                }
                if (soundEnabled) sounds.playMenuSelect();
              }}
              className="text-white/40 hover:text-white/70 transition-all duration-200 text-sm px-3 py-1 rounded-lg bg-white/10 backdrop-blur-sm hover:scale-105 active:scale-95"
            >
              {musicEnabled ? '🎵 Música: ON' : '🎶 Música: OFF'}
            </button>
          </div>
        </motion.div>

        <div className="absolute -top-20 -right-20 text-6xl opacity-5 pointer-events-none">
          🎮
        </div>

        <div className="absolute -bottom-20 -left-20 text-5xl opacity-5 pointer-events-none">
          🐱
        </div>
      </motion.div>
    </div>
  );
} 