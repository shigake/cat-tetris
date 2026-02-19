import React from 'react';
import { motion } from 'framer-motion';
import { useCurrency } from '../hooks/useCurrency';

/**
 * CurrencyDisplay - Mostra moedas do jogador (sempre visível)
 */
function CurrencyDisplay({ className = '' }) {
  const { currency, loading } = useCurrency();

  if (loading || !currency) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="text-2xl">🐟</div>
        <div className="text-white/60">...</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center gap-2 bg-black/30 px-4 py-2 rounded-lg backdrop-blur-sm ${className}`}
    >
      <span className="text-2xl">🐟</span>
      <motion.span
        key={currency.fish}
        initial={{ scale: 1.2, color: '#fbbf24' }}
        animate={{ scale: 1, color: '#ffffff' }}
        transition={{ duration: 0.3 }}
        className="text-xl font-bold"
      >
        {currency.fish.toLocaleString()}
      </motion.span>
    </motion.div>
  );
}

export default CurrencyDisplay;
