import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SettingsMenu = ({ isOpen, onClose, settings, onSettingsChange }) => {
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = () => {
    onSettingsChange(localSettings);
    onClose();
  };

  const handleCancel = () => {
    setLocalSettings(settings);
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
            className="bg-gray-900/90 p-6 rounded-2xl border-2 border-white/20 shadow-2xl max-w-md w-full mx-4"
          >
            <h2 className="text-2xl font-cat font-bold text-white mb-6 text-center">
              ⚙️ Configurações
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-white/80 text-sm">Volume Geral</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={localSettings.volume}
                  onChange={(e) => setLocalSettings({
                    ...localSettings,
                    volume: parseInt(e.target.value)
                  })}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-white text-sm">{localSettings.volume}%</span>
              </div>

              <div>
                <label className="text-white/80 text-sm">Velocidade do Jogo</label>
                <select
                  value={localSettings.gameSpeed}
                  onChange={(e) => setLocalSettings({
                    ...localSettings,
                    gameSpeed: e.target.value
                  })}
                  className="w-full bg-gray-800 text-white p-2 rounded border border-gray-600"
                >
                  <option value="slow">Lenta</option>
                  <option value="normal">Normal</option>
                  <option value="fast">Rápida</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="soundEnabled"
                  checked={localSettings.soundEnabled}
                  onChange={(e) => setLocalSettings({
                    ...localSettings,
                    soundEnabled: e.target.checked
                  })}
                  className="mr-2"
                />
                <label htmlFor="soundEnabled" className="text-white/80 text-sm">
                  Som Habilitado
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="particlesEnabled"
                  checked={localSettings.particlesEnabled}
                  onChange={(e) => setLocalSettings({
                    ...localSettings,
                    particlesEnabled: e.target.checked
                  })}
                  className="mr-2"
                />
                <label htmlFor="particlesEnabled" className="text-white/80 text-sm">
                  Efeitos de Partículas
                </label>
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