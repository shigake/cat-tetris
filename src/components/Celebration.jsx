import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function Celebration({ trigger, duration = 3000, message }) {
  const [show, setShow] = useState(false);
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    if (trigger) {
      setShow(true);

      const pieces = [];
      for (let i = 0; i < 50; i++) {
        pieces.push({
          id: i,
          x: Math.random() * 100,
          y: -10,
          rotation: Math.random() * 360,
          color: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'][Math.floor(Math.random() * 6)],
          size: Math.random() * 10 + 5,
          delay: Math.random() * 0.5
        });
      }
      setConfetti(pieces);

      setTimeout(() => {
        setShow(false);
        setConfetti([]);
      }, duration);
    }
  }, [trigger, duration]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">

      {confetti.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{
            x: `${piece.x}vw`,
            y: piece.y,
            rotate: piece.rotation,
            opacity: 1
          }}
          animate={{
            y: '110vh',
            rotate: piece.rotation + 720,
            opacity: 0
          }}
          transition={{
            duration: 2 + Math.random(),
            delay: piece.delay,
            ease: 'easeIn'
          }}
          style={{
            position: 'absolute',
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '0',
          }}
        />
      ))}

      {message && (
        <motion.div
          initial={{ scale: 0, y: '50vh' }}
          animate={{ scale: 1, y: '40vh' }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="absolute inset-x-0 flex justify-center"
        >
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold text-4xl px-8 py-4 rounded-2xl shadow-2xl border-4 border-white">
            {message}
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 1, repeat: 3 }}
        className="absolute inset-0 bg-gradient-to-b from-yellow-400/20 via-transparent to-transparent"
      />
    </div>
  );
}

export default Celebration;

