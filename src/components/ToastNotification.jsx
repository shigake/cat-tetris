import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function ToastNotification() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleToast = (event) => {
      const { message, type = 'info', duration = 3000 } = event.detail;

      const toast = {
        id: `toast_${Date.now()}_${Math.random()}`,
        message,
        type,
        duration
      };

      setToasts(prev => [...prev, toast]);

      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== toast.id));
      }, duration);
    };

    window.addEventListener('showToast', handleToast);
    return () => window.removeEventListener('showToast', handleToast);
  }, []);

  const getToastColors = (type) => {
    switch (type) {
      case 'success':
        return 'from-green-600 to-emerald-600 border-green-400';
      case 'error':
        return 'from-red-600 to-rose-600 border-red-400';
      case 'warning':
        return 'from-yellow-600 to-amber-600 border-yellow-400';
      case 'info':
      default:
        return 'from-blue-600 to-cyan-600 border-blue-400';
    }
  };

  const getToastIcon = (type) => {
    switch (type) {
      case 'success': return '✓';
      case 'error': return '✕';
      case 'warning': return '⚠';
      case 'info':
      default: return 'ℹ';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            className={`bg-gradient-to-r ${getToastColors(toast.type)} border-2 rounded-lg px-4 py-3 shadow-2xl min-w-[250px] max-w-[400px] pointer-events-auto`}
          >
            <div className="flex items-center gap-3">
              <span className="text-white text-xl font-bold">
                {getToastIcon(toast.type)}
              </span>
              <span className="text-white font-medium flex-1">
                {toast.message}
              </span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export function showToast(message, type = 'info', duration = 3000) {
  window.dispatchEvent(new CustomEvent('showToast', {
    detail: { message, type, duration }
  }));
}

export default ToastNotification;

