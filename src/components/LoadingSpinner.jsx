import React from 'react';
import { motion } from 'framer-motion';

/**
 * LoadingSpinner - Spinner de loading temático
 */
function LoadingSpinner({ size = 'md', message, catEmoji = '🐱' }) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      {/* Spinning cat */}
      <motion.div
        animate={{
          rotate: 360
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear'
        }}
        className={`${sizes[size]} flex items-center justify-center`}
      >
        <span className="text-6xl">{catEmoji}</span>
      </motion.div>

      {/* Pulsing dots */}
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0.5, 1]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2
            }}
            className="w-3 h-3 bg-white rounded-full"
          />
        ))}
      </div>

      {/* Message */}
      {message && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`text-white/80 font-medium ${textSizes[size]}`}
        >
          {message}
        </motion.p>
      )}
    </div>
  );
}

export default LoadingSpinner;
