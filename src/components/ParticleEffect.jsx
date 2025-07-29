import React from 'react';
import { motion } from 'framer-motion';

const ParticleEffect = ({ isActive, position }) => {
  if (!isActive) return null;

  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 200 - 100,
    y: Math.random() * 200 - 100,
    size: Math.random() * 4 + 2,
    color: ['#FFD700', '#FFA500', '#FF6B6B', '#4ECDC4'][Math.floor(Math.random() * 4)]
  }));

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 25 }}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{
            x: position.x,
            y: position.y,
            scale: 0,
            opacity: 1
          }}
          animate={{
            x: position.x + particle.x,
            y: position.y + particle.y,
            scale: [0, 1, 0],
            opacity: [1, 0.8, 0]
          }}
          transition={{
            duration: 1.5,
            ease: "easeOut"
          }}
          className="absolute w-2 h-2 rounded-full"
          style={{
            backgroundColor: particle.color,
            boxShadow: `0 0 ${particle.size}px ${particle.color}`,
            width: `${particle.size}px`,
            height: `${particle.size}px`
          }}
        />
      ))}
    </div>
  );
};

export default ParticleEffect; 