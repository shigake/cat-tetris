import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdvancedParticles({ 
  enabled = true, 
  type = 'mixed', // 'mixed', 'hearts', 'stars', 'cats', 'tetris'
  intensity = 'medium', // 'low', 'medium', 'high'
  className = '' 
}) {
  const [particles, setParticles] = useState([]);
  const [particleId, setParticleId] = useState(0);

  const particleTypes = useMemo(() => ({
    hearts: ['❤️', '💖', '💕', '💗', '🧡', '💛', '💚', '💙', '💜'],
    stars: ['⭐', '🌟', '✨', '💫', '🌠', '⚡', '🔥', '💎', '🌈'],
    cats: ['🐱', '😸', '😺', '😻', '😽', '🙀', '😿', '😾', '🐈'],
    tetris: ['🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '🟫', '⬛', '⬜'],
    magic: ['✨', '🌟', '💫', '🔮', '🎭', '🎪', '🎨', '🎭', '🦄']
  }), []);

  const getParticleCount = useCallback(() => {
    switch (intensity) {
      case 'low': return 5;
      case 'medium': return 8;
      case 'high': return 12;
      default: return 8;
    }
  }, [intensity]);

  const getRandomParticle = useCallback(() => {
    if (type === 'mixed') {
      const types = Object.keys(particleTypes);
      const randomType = types[Math.floor(Math.random() * types.length)];
      const particles = particleTypes[randomType];
      return particles[Math.floor(Math.random() * particles.length)];
    } else {
      const particles = particleTypes[type] || particleTypes.cats;
      return particles[Math.floor(Math.random() * particles.length)];
    }
  }, [type, particleTypes]);

  const generateParticle = useCallback(() => {
    return {
      id: particleId,
      emoji: getRandomParticle(),
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1, // Fixed size for consistency
      duration: 6, // Longer, consistent duration
      delay: Math.random() * 2,
      direction: Math.random() > 0.5 ? 1 : -1
    };
  }, [particleId, getRandomParticle]);

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
  }, [enabled, type, intensity, getParticleCount, generateParticle]);

  const refreshParticle = useCallback((id) => {
    setParticles(prev => 
      prev.map(p => 
        p.id === id 
          ? { ...generateParticle(), id } 
          : p
      )
    );
  }, [generateParticle]);

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
              opacity: [0, 0.6, 0],
              y: [0, -50]
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              ease: "linear",
              repeat: Infinity,
              repeatDelay: 3
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

      {/* Special effects temporarily disabled for performance */}
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
      
      const timer = setTimeout(() => {
        setParticles([]);
        if (onComplete) onComplete();
      }, 2000);

      return () => clearTimeout(timer);
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
      
      const timer = setTimeout(() => {
        setParticles([]);
        if (onComplete) onComplete();
      }, 3000);

      return () => clearTimeout(timer);
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