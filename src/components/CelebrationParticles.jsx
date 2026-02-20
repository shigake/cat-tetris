import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

function CelebrationParticles({ show, onComplete }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!show) return;

    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: -20,
      rotation: Math.random() * 360,
      color: [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
        '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'
      ][Math.floor(Math.random() * 8)],
      size: Math.random() * 10 + 5,
      delay: Math.random() * 0.5,
      duration: Math.random() * 2 + 2,
      xOffset: (Math.random() - 0.5) * 300
    }));

    setParticles(newParticles);

    const timer = setTimeout(() => {
      setParticles([]);
      if (onComplete) onComplete();
    }, 4000);

    return () => clearTimeout(timer);
  }, [show, onComplete]);

  if (!show || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{
            x: particle.x,
            y: particle.y,
            rotate: 0,
            opacity: 1
          }}
          animate={{
            x: particle.x + particle.xOffset,
            y: window.innerHeight + 100,
            rotate: particle.rotation + 720,
            opacity: 0
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            ease: 'easeIn'
          }}
          style={{
            position: 'absolute',
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            borderRadius: '50%'
          }}
        />
      ))}
    </div>
  );
}

export function SuccessFireworks({ show, onComplete }) {
  const [bursts, setBursts] = useState([]);

  useEffect(() => {
    if (!show) return;

    const newBursts = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      x: Math.random() * (window.innerWidth - 200) + 100,
      y: Math.random() * (window.innerHeight / 2) + 100,
      delay: i * 0.3,
      particles: Array.from({ length: 20 }, (_, j) => ({
        id: j,
        angle: (360 / 20) * j,
        color: ['#FFD700', '#FFA500', '#FF6347', '#FF1493', '#00CED1'][i % 5]
      }))
    }));

    setBursts(newBursts);

    const timer = setTimeout(() => {
      setBursts([]);
      if (onComplete) onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [show, onComplete]);

  if (!show || bursts.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {bursts.map((burst) => (
        <div
          key={burst.id}
          style={{
            position: 'absolute',
            left: burst.x,
            top: burst.y
          }}
        >
          {burst.particles.map((particle) => (
            <motion.div
              key={particle.id}
              initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
              animate={{
                x: Math.cos((particle.angle * Math.PI) / 180) * 150,
                y: Math.sin((particle.angle * Math.PI) / 180) * 150,
                scale: 0,
                opacity: 0
              }}
              transition={{
                duration: 1.5,
                delay: burst.delay,
                ease: 'easeOut'
              }}
              style={{
                position: 'absolute',
                width: 8,
                height: 8,
                backgroundColor: particle.color,
                borderRadius: '50%',
                boxShadow: `0 0 10px ${particle.color}`
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SparkleEffect({ x, y, show }) {
  if (!show) return null;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 1 }}
      animate={{ scale: 2, opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 20,
        height: 20,
        pointerEvents: 'none',
        zIndex: 100
      }}
    >
      <div className="text-yellow-300 text-2xl">✨</div>
    </motion.div>
  );
}

export default CelebrationParticles;

