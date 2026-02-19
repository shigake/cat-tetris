/**
 * AnimationPresets - Presets de animações reutilizáveis
 */

// Page transitions
export const pageTransition = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.3, ease: 'easeInOut' }
};

export const slideUpTransition = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -50 },
  transition: { duration: 0.4, ease: 'easeOut' }
};

export const slideInFromRight = {
  initial: { opacity: 0, x: 100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -100 },
  transition: { duration: 0.3, ease: 'easeInOut' }
};

export const slideInFromLeft = {
  initial: { opacity: 0, x: -100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 100 },
  transition: { duration: 0.3, ease: 'easeInOut' }
};

// Component animations
export const scaleIn = {
  initial: { scale: 0, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { type: 'spring', stiffness: 200, damping: 20 }
};

export const bounceIn = {
  initial: { scale: 0, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { type: 'spring', stiffness: 300, damping: 15 }
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.3 }
};

// Hover animations
export const hoverScale = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
  transition: { type: 'spring', stiffness: 400, damping: 10 }
};

export const hoverGlow = {
  whileHover: { 
    boxShadow: '0 0 20px rgba(255, 255, 255, 0.5)',
    scale: 1.02
  },
  transition: { duration: 0.2 }
};

export const hoverLift = {
  whileHover: { y: -5, scale: 1.02 },
  whileTap: { y: 0, scale: 0.98 },
  transition: { type: 'spring', stiffness: 400, damping: 17 }
};

// List stagger
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.05
    }
  }
};

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 }
};

// Loading animations
export const pulseAnimation = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1]
  },
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: 'easeInOut'
  }
};

export const spinAnimation = {
  animate: {
    rotate: 360
  },
  transition: {
    duration: 1,
    repeat: Infinity,
    ease: 'linear'
  }
};

// Success/Error animations
export const successShake = {
  animate: {
    x: [0, -10, 10, -10, 10, 0],
    scale: [1, 1.1, 1]
  },
  transition: {
    duration: 0.5,
    ease: 'easeInOut'
  }
};

export const errorShake = {
  animate: {
    x: [0, -20, 20, -20, 20, 0]
  },
  transition: {
    duration: 0.4,
    ease: 'easeInOut'
  }
};

// Number count up animation
export const numberCountUp = (from, to, duration = 1) => ({
  from,
  to,
  duration,
  onUpdate: (latest) => latest
});

// Gradient shift animation
export const gradientShift = {
  animate: {
    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
  },
  transition: {
    duration: 5,
    repeat: Infinity,
    ease: 'linear'
  },
  style: {
    backgroundSize: '200% 200%'
  }
};

// Particle/confetti animations
export const confettiPiece = (delay = 0) => ({
  initial: { 
    y: -100, 
    rotate: 0, 
    opacity: 1 
  },
  animate: { 
    y: window.innerHeight + 100,
    rotate: 720,
    opacity: 0
  },
  transition: {
    duration: 2 + Math.random(),
    delay,
    ease: 'easeIn'
  }
});

// Modal/overlay animations
export const modalBackdrop = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 }
};

export const modalContent = {
  initial: { opacity: 0, scale: 0.9, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.9, y: 20 },
  transition: { type: 'spring', damping: 25, stiffness: 300 }
};

// Card flip animation
export const cardFlip = {
  initial: { rotateY: 0 },
  animate: { rotateY: 180 },
  transition: { duration: 0.6 }
};

// Tooltip animations
export const tooltipFade = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
  transition: { duration: 0.15 }
};

export default {
  pageTransition,
  slideUpTransition,
  slideInFromRight,
  slideInFromLeft,
  scaleIn,
  bounceIn,
  fadeIn,
  hoverScale,
  hoverGlow,
  hoverLift,
  staggerContainer,
  staggerItem,
  pulseAnimation,
  spinAnimation,
  successShake,
  errorShake,
  numberCountUp,
  gradientShift,
  confettiPiece,
  modalBackdrop,
  modalContent,
  cardFlip,
  tooltipFade
};
