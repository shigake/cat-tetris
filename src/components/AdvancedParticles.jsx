import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdvancedParticles({ 
  enabled = true, 
  type = 'mixed', // 'mixed', 'hearts', 'stars', 'cats', 'tetris'
  intensity = 'medium', // 'low', 'medium', 'high'
  className = '' 
}) {
  const [particles, setParticles] = useState([]);
  const [particleId, setParticleId] = useState(0);

  const particleTypes = {
    hearts: ['❤️', '💖', '💕', '💗', '🧡', '💛', '💚', '💙', '💜'],
    stars: ['⭐', '🌟', '✨', '💫', '🌠', '⚡', '🔥', '💎', '🌈'],
    cats: ['🐱', '😸', '😺', '😻', '😽', '🙀', '😿', '😾', '🐈'],
    tetris: ['🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '🟫', '⬛', '⬜'],
    magic: ['✨', '🌟', '💫', '🔮', '🎭', '🎪', '🎨', '🎭', '🦄']
  };

  const getParticleCount = () => {
    switch (intensity) {
      case 'low': return 15;
      case 'medium': return 30;
      case 'high': return 50;
      default: return 30;
    }
  };

  const getRandomParticle = () => {
    if (type === 'mixed') {
      const types = Object.keys(particleTypes);
      const randomType = types[Math.floor(Math.random() * types.length)];
      const particles = particleTypes[randomType];
      return particles[Math.floor(Math.random() * particles.length)];
    } else {
      const particles = particleTypes[type] || particleTypes.cats;
      return particles[Math.floor(Math.random() * particles.length)];
    }
  };

  const generateParticle = () => {
    return {
      id: particleId,
      emoji: getRandomParticle(),
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 0.8 + Math.random() * 1.2,
      duration: 3 + Math.random() * 4,
      delay: Math.random() * 2,
      direction: Math.random() > 0.5 ? 1 : -1,
      rotationSpeed: 0.5 + Math.random() * 1.5
    };
  };

  useEffect(() => {
    if (!enabled) {
      setParticles([]);
      return;
    }

    const count = getParticleCount();
    const newParticles = [];
    
    for (let i = 0; i < count; i++) {
      newParticles.push({
        ...generateParticle(),
        id: i
      });
    }
    
    setParticles(newParticles);
    setParticleId(count);
  }, [enabled, type, intensity]);

  const refreshParticle = (id) => {
    setParticles(prev => 
      prev.map(p => 
        p.id === id 
          ? { ...generateParticle(), id } 
          : p
      )
    );
  };

  if (!enabled) return null;

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              fontSize: `${particle.size}rem`,
              zIndex: 1
            }}
            initial={{ 
              opacity: 0, 
              scale: 0,
              rotate: 0,
              y: 0
            }}
            animate={{
              opacity: [0, 0.8, 0.6, 0],
              scale: [0, 1, 1.2, 0.8, 0],
              rotate: [0, particle.direction * 360 * particle.rotationSpeed],
              y: [-20, -40, -60, -80],
              x: [0, particle.direction * 10, particle.direction * 20, particle.direction * 15]
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              ease: "easeOut",
              repeat: Infinity,
              repeatDelay: 1 + Math.random() * 3
            }}
            onAnimationComplete={() => {
              if (Math.random() > 0.7) {
                refreshParticle(particle.id);
              }
            }}
          >
            {particle.emoji}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Special effects for certain types */}
      {type === 'magic' && (
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(circle at 20% 80%, rgba(255, 182, 193, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 20%, rgba(255, 215, 0, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 40% 40%, rgba(135, 206, 235, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 60% 60%, rgba(255, 105, 180, 0.1) 0%, transparent 50%)'
            ]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}

      {type === 'tetris' && (
        <>
          {/* Falling tetris blocks animation */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`tetris-bg-${i}`}
              className="absolute opacity-5"
              style={{
                left: `${10 + i * 12}%`,
                fontSize: '2rem'
              }}
              animate={{
                y: ['100vh', '-10vh']
              }}
              transition={{
                duration: 8 + i,
                repeat: Infinity,
                delay: i * 2,
                ease: "linear"
              }}
            >
              {particleTypes.tetris[i % particleTypes.tetris.length]}
            </motion.div>
          ))}
        </>
      )}
    </div>
  );
}

// Specialized particle components for specific scenarios
export function LineClearParticles({ linesCleared, onComplete }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (linesCleared > 0) {
      const count = linesCleared * 15;
      const newParticles = [];
      
      for (let i = 0; i < count; i++) {
        newParticles.push({
          id: i,
          emoji: linesCleared === 4 ? '🎉' : linesCleared >= 3 ? '✨' : linesCleared >= 2 ? '⭐' : '💫',
          x: 20 + Math.random() * 60,
          y: 30 + Math.random() * 40,
          size: 1 + Math.random() * 1.5,
          direction: Math.random() > 0.5 ? 1 : -1
        });
      }
      
      setParticles(newParticles);
      
      setTimeout(() => {
        setParticles([]);
        if (onComplete) onComplete();
      }, 2000);
    }
  }, [linesCleared, onComplete]);

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              fontSize: `${particle.size}rem`
            }}
            initial={{ 
              opacity: 0, 
              scale: 0,
              rotate: 0
            }}
            animate={{
              opacity: [0, 1, 0.8, 0],
              scale: [0, 1.5, 1.2, 0],
              rotate: [0, particle.direction * 720],
              y: [0, -100, -150, -200],
              x: [0, particle.direction * 50]
            }}
            exit={{
              opacity: 0,
              scale: 0
            }}
            transition={{
              duration: 2,
              ease: "easeOut"
            }}
          >
            {particle.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export function LevelUpParticles({ show, onComplete }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (show) {
      const levelParticles = [];
      
      // Create a burst of celebration particles
      for (let i = 0; i < 40; i++) {
        levelParticles.push({
          id: i,
          emoji: ['🎊', '🎉', '⭐', '🌟', '💫', '✨', '🔥', '🎆'][Math.floor(Math.random() * 8)],
          x: 30 + Math.random() * 40,
          y: 40 + Math.random() * 20,
          size: 1.5 + Math.random() * 1,
          angle: (Math.PI * 2 * i) / 40,
          speed: 100 + Math.random() * 50
        });
      }
      
      setParticles(levelParticles);
      
      setTimeout(() => {
        setParticles([]);
        if (onComplete) onComplete();
      }, 3000);
    }
  }, [show, onComplete]);

  return (
    <div className="absolute inset-0 pointer-events-none z-30">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              fontSize: `${particle.size}rem`
            }}
            initial={{ 
              opacity: 0, 
              scale: 0
            }}
            animate={{
              opacity: [0, 1, 0.8, 0],
              scale: [0, 1.5, 1, 0],
              x: [0, Math.cos(particle.angle) * particle.speed],
              y: [0, Math.sin(particle.angle) * particle.speed],
              rotate: [0, 720]
            }}
            exit={{
              opacity: 0,
              scale: 0
            }}
            transition={{
              duration: 3,
              ease: "easeOut"
            }}
          >
            {particle.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
} 