import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useShop } from '../hooks/useShop';
import { useCurrency } from '../hooks/useCurrency';
import { showToast } from './ToastNotification';
import { useGamepadNav } from '../hooks/useGamepadNav';
import { CloseIcon } from './Icons';
import { ThemePieceIcon } from './ThemeIcons';
import { getThemedCellStyle, SHAPE_NAMES, THEME_LABELS } from '../utils/BlockShapes';
import { useI18n } from '../hooks/useI18n';
import Starfield from './Starfield';
// DO NOT infer by filename; use manifest aliases.
import { shop as shopAssets } from '../config/assetPlacementManifest.js';

function ShopPanel({ onClose }) {

 const { themes, equippedTheme, loading, purchaseTheme, equipTheme, getStats } = useShop();

 const { currency } = useCurrency();

 const [selectedTheme, setSelectedTheme] = useState(null);

 const { t } = useI18n();

 const stats = getStats();

 const handlePurchase = (themeId) => {
 const result = purchaseTheme(themeId);

 if (result.success) {
 showToast(t('shop.purchaseSuccess', { name: t(`shop.theme.${themeId}.name`) }), 'success');
 } else {
 showToast(` ${t(result.error)}`, 'error');
 }
 };

 const handleEquip = (themeId) => {
 const result = equipTheme(themeId);

 if (result.success) {
 showToast(t('shop.equipSuccess', { name: t(`shop.theme.${themeId}.name`) }), 'success');
 } else {
 showToast(` ${t(result.error)}`, 'error');
 }
 };

 const { selectedIndex } = useGamepadNav({
 itemCount: themes?.length || 0,
 onConfirm: (index) => {
 const theme = themes[index];
 if (!theme) return;
 if (!theme.owned) {
 handlePurchase(theme.id);
 } else if (!theme.equipped) {
 handleEquip(theme.id);
 }
 },
 onBack: onClose,
 active: !selectedTheme && !loading,
 wrap: true,
 });

 useGamepadNav({
 itemCount: 1,
 onConfirm: () => setSelectedTheme(null),
 onBack: () => setSelectedTheme(null),
 active: !!selectedTheme,
 });

 if (loading) {
 return (
 <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
 <div className="text-white text-lg">{t('shop.loading')}</div>
 </div>
 );
 }

 if (!themes || themes.length === 0) {

 return (
 <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
 <div className="bg-red-900/90 text-white p-6 rounded-lg">
 <p className="text-xl">{t('shop.errorLoading')}</p>
 <button onClick={onClose} className="mt-4 bg-white text-black px-4 py-2 rounded">
 {t('shop.close')}
 </button>
 </div>
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
 <Starfield />
 <motion.div
 initial={{ scale: 0.9, y: 20 }}
 animate={{ scale: 1, y: 0 }}
 exit={{ scale: 0.9, y: 20 }}
 className="bg-gradient-to-br from-pink-900/95 to-purple-900/95 rounded-2xl p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto border-2 border-white/20 shadow-2xl"
 onClick={(e) => e.stopPropagation()}
 >

 <div className="flex justify-between items-center mb-6">
 <div>
 <h2 className="text-3xl font-bold text-white flex items-center gap-2">
 {t('shop.title')}
 </h2>
 <p className="text-white/60 text-sm mt-1">
 {t('shop.subtitle')}
 </p>
 </div>
 <button
 onClick={onClose}
 className="text-white/60 hover:text-white text-2xl transition-colors"
 >
 <CloseIcon size={24} />
 </button>
 </div>

 <div className="bg-black/30 rounded-lg p-4 mb-6 relative">
 <img src={shopAssets.entryButton} alt="" className="absolute -top-5 -right-3 w-14 h-auto object-contain drop-shadow-lg rotate-12 opacity-80" aria-hidden="true" />
 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
 <div className="text-center">
 <div className="text-2xl font-bold text-yellow-400 flex items-center justify-center gap-1">
 {currency?.fish?.toLocaleString() || 0}
 </div>
 <div className="text-white/60 text-sm">{t('shop.yourFish')}</div>
 </div>
 <div className="text-center">
 <div className="text-2xl font-bold text-white">
 {stats?.ownedThemes}/{stats?.totalThemes}
 </div>
 <div className="text-white/60 text-sm">{t('shop.themesUnlocked')}</div>
 </div>
 <div className="text-center">
 <div className="text-2xl font-bold text-green-400">
 {stats?.totalThemes ? Math.floor((stats.ownedThemes / stats.totalThemes) * 100) : 0}%
 </div>
 <div className="text-white/60 text-sm">{t('shop.collection')}</div>
 </div>
 <div className="text-center">
 <div className="text-2xl font-bold text-purple-400 flex items-center justify-center gap-1">
 {stats?.totalSpent?.toLocaleString() || 0}
 </div>
 <div className="text-white/60 text-sm">{t('shop.totalSpent')}</div>
 </div>
 </div>
 </div>

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
 } ${index === selectedIndex ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-purple-900 scale-[1.02]' : ''}`}
 >

 {theme.equipped && (
 <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full font-bold z-10">
 {t('shop.equipped')}
 </div>
 )}

 {theme.premium && (
 <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold z-10">
 {t('shop.premium')}
 </div>
 )}

 {/* Theme illustration */}
 <div className="flex justify-center mb-3 py-3 bg-gradient-to-b from-white/5 to-transparent rounded-lg">
 {theme.preview ? (
 <img src={`${import.meta.env.BASE_URL}${theme.preview}`} alt={theme.name} className="h-20 w-auto object-contain rounded-md drop-shadow-lg" />
 ) : (
 <ThemePieceIcon themeId={theme.id} size={80} />
 )}
 </div>

 <div className="mb-3">
 <h3 className="text-white font-bold text-lg mb-0.5">
 {t(`shop.theme.${theme.id}.name`) || theme.name}
 </h3>
 <p className="text-white/50 text-xs">
 {t(`shop.theme.${theme.id}.desc`) || theme.description}
 </p>
 </div>

 {/* Block shape preview: 7 official-colored cells with the theme's style */}
 <div className="bg-black/30 rounded-lg p-3 mb-3">
 <div className="text-white/40 text-[10px] uppercase tracking-wider mb-2 text-center font-semibold">
 {(THEME_LABELS[theme.blockShape] || {}).label || SHAPE_NAMES[theme.blockShape] || theme.blockShape}
 </div>
 <div className="flex justify-center gap-1.5">
 {Object.entries(theme.pieces).map(([type, piece]) => (
 <div
 key={type}
 className="w-8 h-8 flex items-center justify-center"
 style={getThemedCellStyle(theme.blockShape, piece.color, type)}
 title={type}
 />
 ))}
 </div>
 </div>

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
 t('shop.free')
 ) : (
 <>
 {theme.price.toLocaleString()}
 </>
 )}
 </button>
 ) : !theme.equipped ? (
 <button
 onClick={() => handleEquip(theme.id)}
 className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-lg font-bold transition-colors"
 >
 {t('shop.equip')}
 </button>
 ) : (
 <button
 disabled
 className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-bold cursor-default"
 >
 {t('shop.inUse')}
 </button>
 )}

 <button
 onClick={() => setSelectedTheme(theme)}
 className="bg-purple-600 hover:bg-purple-500 text-white py-2 px-4 rounded-lg font-bold transition-colors"
 >
 {t('shop.preview')}
 </button>
 </div>
 </motion.div>
 );
 })}
 </div>

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
 className="bg-gray-900 rounded-xl p-6 max-w-md w-full"
 onClick={(e) => e.stopPropagation()}
 >
 {/* Theme illustration large */}
 <div className="flex justify-center mb-4 py-4 bg-gradient-to-b from-white/5 to-transparent rounded-lg">
 {selectedTheme.preview ? (
 <img src={`${import.meta.env.BASE_URL}${selectedTheme.preview}`} alt={selectedTheme.name} className="h-28 w-auto object-contain rounded-md drop-shadow-lg" />
 ) : (
 <ThemePieceIcon themeId={selectedTheme.id} size={120} />
 )}
 </div>

 <h3 className="text-white font-bold text-2xl mb-1 text-center">
 {t(`shop.theme.${selectedTheme.id}.name`) || selectedTheme.name}
 </h3>
 <p className="text-white/50 text-sm mb-4 text-center">
 {t(`shop.theme.${selectedTheme.id}.desc`) || selectedTheme.description}
 </p>

 {/* Shape label */}
 <div className="text-white/40 text-xs uppercase tracking-wider mb-2 text-center font-semibold">
 {(THEME_LABELS[selectedTheme.blockShape] || {}).desc || SHAPE_NAMES[selectedTheme.blockShape] || selectedTheme.blockShape}
 </div>

 {/* Block shape preview with piece type labels */}
 <div className="grid grid-cols-7 gap-2 mb-5">
 {Object.entries(selectedTheme.pieces).map(([type, piece]) => (
 <div key={type} className="text-center">
 <div
 className="w-12 h-12 mx-auto flex items-center justify-center mb-1"
 style={getThemedCellStyle(selectedTheme.blockShape, piece.color, type)}
 />
 <div className="text-white/60 text-[10px] font-bold">{type}</div>
 </div>
 ))}
 </div>

 <button
 onClick={() => setSelectedTheme(null)}
 className="w-full bg-purple-600 hover:bg-purple-500 text-white py-2.5 rounded-lg font-bold transition-colors"
 >
 {t('shop.close')}
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
