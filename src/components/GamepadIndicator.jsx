import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '../hooks/useI18n';

const GamepadIndicator = ({
  isConnected,
  controllerCount,
  gamepadInfo,
  className = ""
}) => {
  const { t } = useI18n();
  const [showControls, setShowControls] = useState(false);

  if (!isConnected) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 ${className}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, x: 20 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        exit={{ opacity: 0, scale: 0.8, x: 20 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-900/90 backdrop-blur-sm text-white p-3 rounded-lg border border-green-500/30 shadow-lg"
      >
        <div className="flex items-center gap-2">
          <motion.div
            animate={{
              rotate: [0, -10, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3
            }}
          >
            🎮
          </motion.div>

          <div className="text-sm">
            <div className="text-green-400 font-semibold">
              {controllerCount === 1 ? t('gamepad.connected', { n: controllerCount }) : t('gamepad.connectedPlural', { n: controllerCount })}
            </div>
            <div className="text-gray-300 text-xs">
              {t('gamepad.ready')}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowControls(!showControls)}
            className="ml-2 text-gray-400 hover:text-white transition-colors"
            title={t('gamepad.showControls')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
          </motion.button>
        </div>

        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-3 pt-3 border-t border-gray-700"
            >
              <div className="text-xs text-gray-300 space-y-1">
                <div className="font-semibold text-white mb-2">{t('gamepad.controlsTitle')}</div>

                <div className="grid grid-cols-2 gap-1 text-xs">
                  <div>
                    <span className="text-yellow-400">D-Pad ← →</span>
                    <div className="text-gray-400">{t('gamepad.move')}</div>
                  </div>
                  <div>
                    <span className="text-yellow-400">D-Pad ↓</span>
                    <div className="text-gray-400">{t('gamepad.accelerate')}</div>
                  </div>
                  <div>
                    <span className="text-yellow-400">D-Pad ↑</span>
                    <div className="text-gray-400">{t('gamepad.hardDrop')}</div>
                  </div>
                  <div>
                    <span className="text-yellow-400">A/X/Y</span>
                    <div className="text-gray-400">{t('gamepad.rotateRight')}</div>
                  </div>
                  <div>
                    <span className="text-yellow-400">B</span>
                    <div className="text-gray-400">{t('gamepad.rotateLeft')}</div>
                  </div>
                  <div>
                    <span className="text-yellow-400">L/R</span>
                    <div className="text-gray-400">{t('gamepad.hold')}</div>
                  </div>
                  <div>
                    <span className="text-yellow-400">Start</span>
                    <div className="text-gray-400">{t('gamepad.pause')}</div>
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-gray-700">
                  <div className="text-green-400 text-xs">
                    {t('gamepad.analogNote')}
                  </div>
                  <div className="text-blue-400 text-xs">
                    {t('gamepad.triggerNote')}
                  </div>
                  <div className="text-purple-400 text-xs">
                    {t('gamepad.backNote')}
                  </div>
                </div>

                {gamepadInfo && (Array.isArray(gamepadInfo) ? gamepadInfo : [gamepadInfo]).length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-700">
                    <div className="text-xs text-gray-400">
                      {(Array.isArray(gamepadInfo) ? gamepadInfo : [gamepadInfo]).map((gp, index) => (
                        <div key={index} className="mb-1">
                          <div className="font-semibold text-white">
                            {t('gamepad.controllerLabel', { n: gp.index + 1 })}
                          </div>
                          <div className="text-gray-300 truncate">
                            {gp.id.length > 30 ? gp.id.substring(0, 30) + '...' : gp.id}
                          </div>
                          <div className="flex gap-2 text-xs">
                            <span className="text-blue-400">
                              {t('gamepad.buttons', { n: gp.buttons })}
                            </span>
                            <span className="text-green-400">
                              {t('gamepad.axes', { n: gp.axes })}
                            </span>
                            {gp.vibration && (
                              <span className="text-purple-400">
                                {t('gamepad.vibration')}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default GamepadIndicator;
