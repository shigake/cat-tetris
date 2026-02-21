import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGamepadNav } from '../hooks/useGamepadNav';
import { useI18n } from '../hooks/useI18n';
import {
  loadGamepadMappings,
  saveGamepadMappings,
  resetGamepadMappings,
  DEFAULT_MAPPINGS,
  BUTTON_LABELS,
  ACTION_LABELS,
  MENU_ACTIONS,
  GAME_ACTIONS,
} from '../config/GamepadConfig';

const SettingsMenu = ({ isOpen, onClose, settings, onSettingsChange }) => {
  const { t } = useI18n();
  const [localSettings, setLocalSettings] = useState({
    ...settings,
    das: settings.das ?? 133,
    arr: settings.arr ?? 10,
  });

  // Gamepad remapping state
  const [gamepadMappings, setGamepadMappings] = useState(() => loadGamepadMappings());
  const [listeningAction, setListeningAction] = useState(null);
  const listenIntervalRef = useRef(null);

  // Refresh mappings when settings open
  useEffect(() => {
    if (isOpen) setGamepadMappings(loadGamepadMappings());
  }, [isOpen]);

  // Listen for button press to remap
  useEffect(() => {
    if (!listeningAction) {
      if (listenIntervalRef.current) {
        clearInterval(listenIntervalRef.current);
        listenIntervalRef.current = null;
      }
      return;
    }

    // Wait a frame so the A press that started listening doesn't register
    const startTime = Date.now();

    listenIntervalRef.current = setInterval(() => {
      if (Date.now() - startTime < 200) return; // debounce
      const gamepads = navigator.getGamepads();
      const gp = Array.from(gamepads).find(g => g && g.connected);
      if (!gp) return;

      for (let i = 0; i < gp.buttons.length; i++) {
        if (gp.buttons[i]?.pressed) {
          // D-pad (12-15) can't be remapped — they're used for navigation
          if (i >= 12 && i <= 15) continue;
          const newMappings = { ...gamepadMappings, [listeningAction]: i };
          setGamepadMappings(newMappings);
          saveGamepadMappings(newMappings);
          setListeningAction(null);
          return;
        }
      }
    }, 16);

    // Auto-cancel after 5 seconds
    const timeout = setTimeout(() => setListeningAction(null), 5000);

    return () => {
      clearInterval(listenIntervalRef.current);
      listenIntervalRef.current = null;
      clearTimeout(timeout);
    };
  }, [listeningAction, gamepadMappings]);

  const handleResetGamepad = useCallback(() => {
    const defaults = resetGamepadMappings();
    setGamepadMappings(defaults);
  }, []);

  const handleSave = () => {
    onSettingsChange(localSettings);
    onClose();
  };

  const handleCancel = () => {
    setLocalSettings({ ...settings, das: settings.das ?? 133, arr: settings.arr ?? 10 });
    onClose();
  };

  const settingsActions = [handleSave, handleCancel];
  const handleConfirm = useCallback((index) => {
    settingsActions[index]?.();
  }, [handleSave, handleCancel]);

  const { selectedIndex } = useGamepadNav({
    itemCount: 2,
    onConfirm: handleConfirm,
    onBack: handleCancel,
    active: isOpen && !listeningAction,
    wrap: true,
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="bg-gray-900/90 p-6 rounded-2xl border-2 border-white/20 shadow-2xl max-w-md w-full mx-4 max-h-[85vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-cat font-bold text-white mb-5 text-center">
              {t('settings.title')}
            </h2>

            <div className="space-y-4">

              <div className="text-xs font-bold text-white/40 uppercase tracking-wider">{t('settings.audio')}</div>

              <div>
                <label className="text-white/80 text-sm">{t('settings.volume')}</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={localSettings.volume}
                  onChange={(e) => setLocalSettings({ ...localSettings, volume: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-white text-sm">{localSettings.volume}%</span>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="soundEnabled"
                  checked={localSettings.soundEnabled}
                  onChange={(e) => setLocalSettings({ ...localSettings, soundEnabled: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="soundEnabled" className="text-white/80 text-sm">{t('settings.soundEnabled')}</label>
              </div>

              <div className="border-t border-white/10 pt-4 mt-4">
                <div className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">{t('settings.handling')}</div>

                <div>
                  <div className="flex justify-between">
                    <label className="text-white/80 text-sm">{t('settings.dasLabel')}</label>
                    <span className="text-cyan-400 text-sm font-mono">{localSettings.das}ms</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="300"
                    step="1"
                    value={localSettings.das}
                    onChange={(e) => setLocalSettings({ ...localSettings, das: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                  <p className="text-white/30 text-xs mt-0.5">{t('settings.dasHelp')}</p>
                </div>

                <div className="mt-3">
                  <div className="flex justify-between">
                    <label className="text-white/80 text-sm">{t('settings.arrLabel')}</label>
                    <span className="text-cyan-400 text-sm font-mono">{localSettings.arr}ms</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={localSettings.arr}
                    onChange={(e) => setLocalSettings({ ...localSettings, arr: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                  <p className="text-white/30 text-xs mt-0.5">{t('settings.arrHelp')}</p>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4 mt-4">
                <div className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">{t('settings.controls')}</div>
                <div className="grid grid-cols-2 gap-2 text-xs text-white/60">
                  <div className="bg-white/[0.04] rounded-lg p-2">
                    <span className="text-white/40">← →</span> {t('settings.ctrlMove')}
                  </div>
                  <div className="bg-white/[0.04] rounded-lg p-2">
                    <span className="text-white/40">↑ / X</span> {t('settings.ctrlRotateR')}
                  </div>
                  <div className="bg-white/[0.04] rounded-lg p-2">
                    <span className="text-white/40">Z</span> {t('settings.ctrlRotateL')}
                  </div>
                  <div className="bg-white/[0.04] rounded-lg p-2">
                    <span className="text-white/40">↓</span> {t('settings.ctrlSoftDrop')}
                  </div>
                  <div className="bg-white/[0.04] rounded-lg p-2">
                    <span className="text-white/40">Espaço</span> {t('settings.ctrlHardDrop')}
                  </div>
                  <div className="bg-white/[0.04] rounded-lg p-2">
                    <span className="text-white/40">C / Shift</span> {t('settings.ctrlHold')}
                  </div>
                  <div className="bg-white/[0.04] rounded-lg p-2">
                    <span className="text-white/40">P / Esc</span> {t('settings.ctrlPause')}
                  </div>
                </div>
              </div>

              {/* Gamepad Button Remapping */}
              <div className="border-t border-white/10 pt-4 mt-4">
                <div className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">🎮 Botões do Controle</div>

                <div className="mb-3">
                  <div className="text-white/50 text-[10px] uppercase tracking-wider mb-1.5">Menu</div>
                  <div className="space-y-1">
                    {MENU_ACTIONS.map(action => (
                      <button
                        key={action}
                        onClick={() => setListeningAction(action)}
                        className={`w-full flex items-center justify-between bg-white/[0.04] rounded-lg px-3 py-1.5 text-xs transition-colors
                          ${listeningAction === action ? 'ring-2 ring-yellow-400 bg-yellow-400/10' : 'hover:bg-white/[0.08]'}`}
                      >
                        <span className="text-white/70">{ACTION_LABELS[action]}</span>
                        <span className={`font-mono font-bold ${listeningAction === action ? 'text-yellow-400 animate-pulse' : 'text-cyan-400'}`}>
                          {listeningAction === action ? 'Pressione...' : BUTTON_LABELS[gamepadMappings[action]] ?? '?'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-3">
                  <div className="text-white/50 text-[10px] uppercase tracking-wider mb-1.5">Jogo</div>
                  <div className="space-y-1">
                    {GAME_ACTIONS.map(action => (
                      <button
                        key={action}
                        onClick={() => setListeningAction(action)}
                        className={`w-full flex items-center justify-between bg-white/[0.04] rounded-lg px-3 py-1.5 text-xs transition-colors
                          ${listeningAction === action ? 'ring-2 ring-yellow-400 bg-yellow-400/10' : 'hover:bg-white/[0.08]'}`}
                      >
                        <span className="text-white/70">{ACTION_LABELS[action]}</span>
                        <span className={`font-mono font-bold ${listeningAction === action ? 'text-yellow-400 animate-pulse' : 'text-cyan-400'}`}>
                          {listeningAction === action ? 'Pressione...' : BUTTON_LABELS[gamepadMappings[action]] ?? '?'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-white/30 text-[10px] mb-2">D-Pad não pode ser remapeado (navegação)</div>

                <button
                  onClick={handleResetGamepad}
                  className="w-full bg-white/[0.06] hover:bg-white/[0.12] text-white/60 hover:text-white/90 text-xs py-1.5 rounded-lg transition-colors"
                >
                  🔄 Restaurar Padrão
                </button>
              </div>

              <div className="border-t border-white/10 pt-4 mt-4">
                <div className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">{t('settings.visual')}</div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="particlesEnabled"
                    checked={localSettings.particlesEnabled}
                    onChange={(e) => setLocalSettings({ ...localSettings, particlesEnabled: e.target.checked })}
                    className="mr-2"
                  />
                  <label htmlFor="particlesEnabled" className="text-white/80 text-sm">{t('settings.particles')}</label>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                className={`flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 ${selectedIndex === 0 ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-gray-900' : ''}`}
              >
                {t('settings.save')}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCancel}
                className={`flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 ${selectedIndex === 1 ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-gray-900' : ''}`}
              >
                {t('settings.cancel')}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SettingsMenu;
