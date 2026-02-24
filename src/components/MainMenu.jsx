import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useMenuSounds } from '../hooks/useMenuSounds';
import { useGamepadNav } from '../hooks/useGamepadNav';
import { useI18n, LANGUAGES } from '../hooks/useI18n';
import CurrencyDisplay from './CurrencyDisplay';
import { SwordsIcon, BookIcon, PaletteIcon, BrainIcon, ShopBagIcon, ClipboardIcon, TrophyIcon, GearIcon, SoundOnIcon, SoundOffIcon, GlobeIcon } from './Icons';

export default function MainMenu({
 onStartGame,
 onNewGame,
 onShowSettings,
 onShowShop,
 onShowMissions,
 onShowAchievements,
 onShowMultiplayer,
 onShowTutorial,
 onShowTutorialHub,
 onShowAIShowcase,
 onShowCreatorMode,
 hasActiveGame,
 gameState,
 hasOverlayOpen,
 settings,
 onSettingsChange
}) {
 const soundEnabled = settings?.soundEnabled ?? true;
 const [showLangPicker, setShowLangPicker] = useState(false);
 const sounds = useMenuSounds();
 const { t, language, setLanguage } = useI18n();

 const toggleSound = useCallback(() => {
 const newVal = !soundEnabled;
 onSettingsChange?.({ ...settings, soundEnabled: newVal });
 }, [soundEnabled, settings, onSettingsChange]);

 const play = useCallback((fn) => {
 if (soundEnabled) sounds.playMenuSelect?.();
 fn?.();
 }, [soundEnabled, sounds]);

 const menuItems = useMemo(() => {
 const items = [];
 if (hasActiveGame) {
 items.push({ id: 'continue', action: onStartGame });
 items.push({ id: 'newGame', action: onNewGame });
 } else {
 items.push({ id: 'play', action: onStartGame });
 }
 items.push({ id: 'vsAI', action: onShowMultiplayer });
 items.push({ id: 'tutorial', action: onShowTutorialHub });
 items.push({ id: 'creator', action: onShowCreatorMode });
 items.push({ id: 'aiExpert', action: onShowAIShowcase });
 items.push({ id: 'shop', action: onShowShop });
 items.push({ id: 'missions', action: onShowMissions });
 items.push({ id: 'achievements', action: onShowAchievements });
 items.push({ id: 'settings', action: onShowSettings });
 return items;
 }, [hasActiveGame, onStartGame, onNewGame, onShowMultiplayer, onShowTutorialHub, onShowCreatorMode, onShowAIShowcase, onShowShop, onShowMissions, onShowAchievements, onShowSettings]);

 const spatialNavMap = useMemo(() => {
 if (hasActiveGame) {

 return {
 0: { up: 7, down: 2, left: 1, right: 1 },
 1: { up: 8, down: 3, left: 0, right: 0 },
 2: { up: 0, down: 4, left: 3, right: 3 },
 3: { up: 1, down: 5, left: 2, right: 2 },
 4: { up: 2, down: 7, left: 5, right: 5 },
 5: { up: 3, down: 8, left: 4, right: 4 },
 6: { up: 4, down: 0, left: 9, right: 7 },
 7: { up: 4, down: 0, left: 6, right: 8 },
 8: { up: 5, down: 1, left: 7, right: 9 },
 9: { up: 5, down: 1, left: 8, right: 6 },
 };
 }

 return {
 0: { up: 6, down: 1, left: 0, right: 0 },
 1: { up: 0, down: 3, left: 2, right: 2 },
 2: { up: 0, down: 4, left: 1, right: 1 },
 3: { up: 1, down: 6, left: 4, right: 4 },
 4: { up: 2, down: 7, left: 3, right: 3 },
 5: { up: 3, down: 0, left: 8, right: 6 },
 6: { up: 3, down: 0, left: 5, right: 7 },
 7: { up: 4, down: 0, left: 6, right: 8 },
 8: { up: 4, down: 0, left: 7, right: 5 },
 };
 }, [hasActiveGame]);

 const handleGamepadConfirm = useCallback((index) => {
 if (menuItems[index]) {
 play(menuItems[index].action);
 }
 }, [menuItems, play]);

 const { selectedIndex } = useGamepadNav({
 itemCount: menuItems.length,
 onConfirm: handleGamepadConfirm,
 active: !hasOverlayOpen && !showLangPicker,
 wrap: true,
 navMap: spatialNavMap,
 });

 const isSelected = useCallback((id) => {
 return menuItems[selectedIndex]?.id === id;
 }, [menuItems, selectedIndex]);

 useEffect(() => {
 const handle = (e) => {
 if (e.key === 'Enter') {
 e.preventDefault();
 play(onStartGame);
 }
 };
 window.addEventListener('keydown', handle);
 return () => window.removeEventListener('keydown', handle);
 }, [play, onStartGame]);

 const fadeUp = (delay = 0) => ({
 initial: { opacity: 0, y: 16 },
 animate: { opacity: 1, y: 0 },
 transition: { duration: 0.35, delay, ease: 'easeOut' }
 });

 return (
 <div className="h-screen bg-gradient-to-b from-slate-900 via-purple-950 to-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">

 <div className="absolute inset-0 overflow-hidden pointer-events-none">
 <div className="absolute top-1/4 -left-32 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl" />
 <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl" />
 </div>

 <div className="fixed top-3 right-3 z-50">
 <CurrencyDisplay />
 </div>

 <div className="w-full max-w-sm relative z-10 flex flex-col items-center">

 <motion.div {...fadeUp(0)} className="text-center mb-4">
 <h1 className="text-4xl font-extrabold text-white tracking-tight drop-shadow-lg select-none">
 {t('menu.title')}
 </h1>
 <p className="text-white/50 text-xs mt-1">{t('menu.subtitle')}</p>
 </motion.div>

 <motion.div {...fadeUp(0.1)} className="w-full space-y-2 mb-4">
 {hasActiveGame ? (
 <>
 <button
 onClick={() => play(onStartGame)}
 className={`w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-white font-bold text-lg shadow-lg shadow-emerald-500/20 transition-all duration-150 ${isSelected('continue') ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-slate-900 scale-[1.02]' : ''}`}
 >
 {t('menu.continue')}
 <span className="block text-emerald-100/70 text-xs font-normal mt-0.5">
 {t('menu.continueInfo', { level: gameState?.score?.level || 1, points: (gameState?.score?.points || 0).toLocaleString() })}
 </span>
 </button>
 <button
 onClick={() => play(onNewGame)}
 className={`w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 active:scale-[0.98] text-white font-semibold text-base border border-white/10 transition-all duration-150 ${isSelected('newGame') ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-slate-900 scale-[1.02]' : ''}`}
 >
 {t('menu.newGame')}
 </button>
 </>
 ) : (
 <button
 onClick={() => play(onStartGame)}
 className={`w-full py-5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 active:scale-[0.98] text-white font-bold text-xl shadow-lg shadow-emerald-500/25 transition-all duration-150 ${isSelected('play') ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-slate-900 scale-[1.02]' : ''}`}
 >
 {t('menu.play')}
 </button>
 )}
 </motion.div>

 <motion.div {...fadeUp(0.18)} className="w-full grid grid-cols-2 gap-2 mb-4">
 <MenuCard icon={<SwordsIcon size={28} />} label={t('menu.vsAI')} sub={t('menu.vsAISub')} onClick={() => play(onShowMultiplayer)} selected={isSelected('vsAI')} />
 <MenuCard icon={<BookIcon size={28} />} label={t('menu.tutorial')} sub={t('menu.tutorialSub')} onClick={() => play(onShowTutorialHub)} selected={isSelected('tutorial')} />
 <MenuCard icon={<PaletteIcon size={28} />} label={t('menu.creator')} sub={t('menu.creatorSub')} onClick={() => play(onShowCreatorMode)} selected={isSelected('creator')} />
 <MenuCard icon={<BrainIcon size={28} />} label={t('menu.aiExpert')} sub={t('menu.aiExpertSub')} onClick={() => play(onShowAIShowcase)} selected={isSelected('aiExpert')} />
 </motion.div>

 <motion.div {...fadeUp(0.25)} className="w-full grid grid-cols-4 gap-1 mb-4">
 <QuickBtn icon={<ShopBagIcon size={20} />} label={t('menu.shop')} onClick={() => play(onShowShop)} selected={isSelected('shop')} />
 <QuickBtn icon={<ClipboardIcon size={20} />} label={t('menu.missions')} onClick={() => play(onShowMissions)} selected={isSelected('missions')} />
 <QuickBtn icon={<TrophyIcon size={20} />} label={t('menu.achievements')} onClick={() => play(onShowAchievements)} selected={isSelected('achievements')} />
 <QuickBtn icon={<GearIcon size={20} />} label={t('menu.settings')} onClick={() => play(onShowSettings)} selected={isSelected('settings')} />
 </motion.div>

 <motion.div {...fadeUp(0.3)} className="flex items-center gap-3 text-xs text-white/25">
 <button
 onClick={toggleSound}
 className="hover:text-white/50 transition-colors"
 >
 {soundEnabled ? <SoundOnIcon size={16} /> : <SoundOffIcon size={16} />}
 </button>

 <button
 onClick={() => setShowLangPicker(p => !p)}
 className="hover:text-white/50 transition-colors flex items-center gap-1"
 >
 <GlobeIcon size={14} />
 {language.toUpperCase()}
 </button>

 <span className="select-none">v1.0</span>
 </motion.div>

 {/* Language picker dropdown */}
 {showLangPicker && (
 <motion.div
 initial={{ opacity: 0, y: 8 }}
 animate={{ opacity: 1, y: 0 }}
 className="absolute bottom-16 bg-slate-800/95 backdrop-blur-sm rounded-xl border border-white/10 p-2 z-50 shadow-xl"
 >
 {LANGUAGES.map(lang => (
 <button
 key={lang.code}
 onClick={() => { setLanguage(lang.code); setShowLangPicker(false); }}
 className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${language === lang.code ? 'bg-purple-600/40 text-white font-semibold' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
 >
 {lang.label}
 </button>
 ))}
 </motion.div>
 )}
 </div>
 </div>
 );
}

function MenuCard({ icon, label, sub, onClick, selected }) {
 return (
 <button
 onClick={onClick}
 className={`flex flex-col items-center text-center p-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.06] hover:border-white/[0.12] active:scale-[0.97] transition-all duration-150 ${selected ? 'ring-2 ring-yellow-400 bg-white/[0.12] border-yellow-400/30 scale-[1.03]' : ''}`}
 >
 <div className="text-white/80 mb-1">{icon}</div>
 <span className="text-white font-semibold text-sm leading-tight">{label}</span>
 <span className="text-white/40 text-[10px] mt-0.5 leading-tight">{sub}</span>
 </button>
 );
}

function QuickBtn({ icon, label, onClick, selected }) {
 return (
 <button
 onClick={onClick}
 className={`flex flex-col items-center gap-1 px-2 py-2 rounded-lg hover:bg-white/[0.07] active:scale-95 transition-all duration-150 ${selected ? 'ring-2 ring-yellow-400 bg-white/[0.1] scale-105' : ''}`}
 >
 <div className="text-white/50">{icon}</div>
 <span className="text-white/40 text-[10px] leading-none">{label}</span>
 </button>
 );
}
