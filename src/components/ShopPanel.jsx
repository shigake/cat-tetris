import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useShop } from '../hooks/useShop';
import { useCurrency } from '../hooks/useCurrency';
import { showToast } from './ToastNotification';

/**
 * ShopPanel - Loja de temas
 */
function ShopPanel({ onClose }) {
  console.log('[ShopPanel] Renderizando...');
  
  const { themes, equippedTheme, loading, purchaseTheme, equipTheme, getStats } = useShop();
  console.log('[ShopPanel] useShop:', { themesCount: themes?.length, equippedTheme, loading });
  
  const { currency } = useCurrency();
  console.log('[ShopPanel] currency:', currency);
  
  const [selectedTheme, setSelectedTheme] = useState(null);

  const stats = getStats();
  console.log('[ShopPanel] stats:', stats);

  // Safety checks
  if (!themes || themes.length === 0) {
    console.warn('[ShopPanel] No themes available');
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-red-900/90 text-white p-6 rounded-lg">
          <p className="text-xl">❌ Erro ao carregar temas</p>
          <button onClick={onClose} className="mt-4 bg-white text-black px-4 py-2 rounded">
            Fechar
          </button>
        </div>
      </div>
    );
  }

  const handlePurchase = (themeId) => {
    const result = purchaseTheme(themeId);
    
    if (result.success) {
      showToast(`✅ ${result.theme.name} comprado com sucesso!`, 'success');
    } else {
      showToast(`❌ ${result.error}`, 'error');
    }
  };

  const handleEquip = (themeId) => {
    const result = equipTheme(themeId);
    
    if (result.success) {
      showToast(`🎨 ${result.theme.name} equipado!`, 'success');
    } else {
      showToast(`❌ ${result.error}`, 'error');
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="text-white text-xl">Carregando loja...</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-gradient-to-br from-pink-900/95 to-purple-900/95 rounded-2xl p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto border-2 border-white/20 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white flex items-center gap-2">
              🛍️ Loja de Temas
            </h2>
            <p className="text-white/60 text-sm mt-1">
              Personalize suas peças de Tetris
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white text-2xl transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Currency & Stats */}
        <div className="bg-black/30 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400 flex items-center justify-center gap-1">
                🐟 {currency?.fish?.toLocaleString() || 0}
              </div>
              <div className="text-white/60 text-sm">Seus Peixes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {stats?.ownedThemes}/{stats?.totalThemes}
              </div>
              <div className="text-white/60 text-sm">Temas Desbloqueados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {Math.floor((stats?.ownedThemes / stats?.totalThemes) * 100)}%
              </div>
              <div className="text-white/60 text-sm">Coleção</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400 flex items-center justify-center gap-1">
                🐟 {stats?.totalSpent?.toLocaleString() || 0}
              </div>
              <div className="text-white/60 text-sm">Gasto Total</div>
            </div>
          </div>
        </div>

        {/* Themes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {themes.map((theme, index) => {
            const canAfford = !theme.owned && currency?.fish >= theme.price;
            
            return (
              <motion.div
                key={theme.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-black/40 rounded-lg p-4 border-2 relative ${
                  theme.equipped
                    ? 'border-green-500 shadow-lg shadow-green-500/30'
                    : theme.owned
                    ? 'border-white/20'
                    : 'border-white/10'
                }`}
              >
                {/* Equipped Badge */}
                {theme.equipped && (
                  <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                    ✓ Equipado
                  </div>
                )}

                {/* Premium Badge */}
                {theme.premium && (
                  <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                    ⭐ Premium
                  </div>
                )}

                {/* Theme Info */}
                <div className="mb-4">
                  <h3 className="text-white font-bold text-lg mb-1">
                    {theme.name}
                  </h3>
                  <p className="text-white/60 text-sm">
                    {theme.description}
                  </p>
                </div>

                {/* Pieces Preview */}
                <div className="bg-black/30 rounded-lg p-3 mb-4">
                  <div className="flex justify-center gap-2 flex-wrap">
                    {Object.entries(theme.pieces).map(([type, piece]) => (
                      <div
                        key={type}
                        className="w-12 h-12 rounded flex items-center justify-center text-2xl border border-white/10"
                        style={{ backgroundColor: piece.color }}
                      >
                        {piece.emoji}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price / Actions */}
                <div className="flex gap-2">
                  {!theme.owned ? (
                    <button
                      onClick={() => handlePurchase(theme.id)}
                      disabled={!canAfford}
                      className={`flex-1 py-2 px-4 rounded-lg font-bold transition-colors ${
                        canAfford
                          ? 'bg-yellow-600 hover:bg-yellow-500 text-white'
                          : 'bg-gray-600 text-white/40 cursor-not-allowed'
                      }`}
                    >
                      {theme.default ? (
                        'Gratuito'
                      ) : (
                        <>
                          🐟 {theme.price.toLocaleString()}
                        </>
                      )}
                    </button>
                  ) : !theme.equipped ? (
                    <button
                      onClick={() => handleEquip(theme.id)}
                      className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-lg font-bold transition-colors"
                    >
                      Equipar
                    </button>
                  ) : (
                    <button
                      disabled
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-bold cursor-default"
                    >
                      Em Uso
                    </button>
                  )}

                  {/* Preview Button */}
                  <button
                    onClick={() => setSelectedTheme(theme)}
                    className="bg-purple-600 hover:bg-purple-500 text-white py-2 px-4 rounded-lg font-bold transition-colors"
                  >
                    👁️
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Theme Preview Modal */}
        <AnimatePresence>
          {selectedTheme && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60]"
              onClick={() => setSelectedTheme(null)}
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="bg-gray-900 rounded-xl p-6 max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-white font-bold text-2xl mb-4">
                  {selectedTheme.name}
                </h3>
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {Object.entries(selectedTheme.pieces).map(([type, piece]) => (
                    <div key={type} className="text-center">
                      <div
                        className="w-16 h-16 rounded-lg flex items-center justify-center text-3xl mb-2 border-2 border-white/20"
                        style={{ backgroundColor: piece.color }}
                      >
                        {piece.emoji}
                      </div>
                      <div className="text-white/60 text-xs">{type}</div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setSelectedTheme(null)}
                  className="w-full bg-purple-600 hover:bg-purple-500 text-white py-2 rounded-lg font-bold"
                >
                  Fechar
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export default ShopPanel;
