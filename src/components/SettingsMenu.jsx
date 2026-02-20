import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SettingsMenu = ({ isOpen, onClose, settings, onSettingsChange }) => {
  const [localSettings, setLocalSettings] = useState({
    ...settings,
    das: settings.das ?? 133,
    arr: settings.arr ?? 10,
  });

  const handleSave = () => {
    onSettingsChange(localSettings);
    onClose();
  };

  const handleCancel = () => {
    setLocalSettings({ ...settings, das: settings.das ?? 133, arr: settings.arr ?? 10 });
    onClose();
  };

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
              ⚙️ Configurações
            </h2>
            
            <div className="space-y-4">
              {/* ── Audio ── */}
              <div className="text-xs font-bold text-white/40 uppercase tracking-wider">Áudio</div>

              <div>
                <label className="text-white/80 text-sm">Volume Geral</label>
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
                <label htmlFor="soundEnabled" className="text-white/80 text-sm">Som Habilitado</label>
              </div>

              {/* ── Handling ── */}
              <div className="border-t border-white/10 pt-4 mt-4">
                <div className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">Handling (DAS/ARR)</div>

                <div>
                  <div className="flex justify-between">
                    <label className="text-white/80 text-sm">DAS (Delayed Auto-Shift)</label>
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
                  <p className="text-white/30 text-xs mt-0.5">Delay antes da peça mover automaticamente ao segurar a tecla. Pro: 83-100ms</p>
                </div>

                <div className="mt-3">
                  <div className="flex justify-between">
                    <label className="text-white/80 text-sm">ARR (Auto-Repeat Rate)</label>
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
                  <p className="text-white/30 text-xs mt-0.5">Velocidade de repetição ao segurar. 0 = teleporta. Pro: 0-2ms</p>
                </div>
              </div>

              {/* ── Controles ── */}
              <div className="border-t border-white/10 pt-4 mt-4">
                <div className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">Controles</div>
                <div className="grid grid-cols-2 gap-2 text-xs text-white/60">
                  <div className="bg-white/[0.04] rounded-lg p-2">
                    <span className="text-white/40">← →</span> Mover
                  </div>
                  <div className="bg-white/[0.04] rounded-lg p-2">
                    <span className="text-white/40">↑ / X</span> Girar →
                  </div>
                  <div className="bg-white/[0.04] rounded-lg p-2">
                    <span className="text-white/40">Z</span> Girar ←
                  </div>
                  <div className="bg-white/[0.04] rounded-lg p-2">
                    <span className="text-white/40">↓</span> Soft drop
                  </div>
                  <div className="bg-white/[0.04] rounded-lg p-2">
                    <span className="text-white/40">Espaço</span> Hard drop
                  </div>
                  <div className="bg-white/[0.04] rounded-lg p-2">
                    <span className="text-white/40">C / Shift</span> Hold
                  </div>
                  <div className="bg-white/[0.04] rounded-lg p-2">
                    <span className="text-white/40">P / Esc</span> Pausar
                  </div>
                </div>
              </div>

              {/* ── Visual ── */}
              <div className="border-t border-white/10 pt-4 mt-4">
                <div className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">Visual</div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="particlesEnabled"
                    checked={localSettings.particlesEnabled}
                    onChange={(e) => setLocalSettings({ ...localSettings, particlesEnabled: e.target.checked })}
                    className="mr-2"
                  />
                  <label htmlFor="particlesEnabled" className="text-white/80 text-sm">Efeitos de Partículas</label>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
              >
                Salvar
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCancel}
                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700"
              >
                Cancelar
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SettingsMenu; 