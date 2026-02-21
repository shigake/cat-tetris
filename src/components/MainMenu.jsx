import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useMenuSounds } from '../hooks/useMenuSounds';
import { useGamepadNav } from '../hooks/useGamepadNav';
import CurrencyDisplay from './CurrencyDisplay';

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
  onShowInstallPrompt,
  canInstallPWA,
  hasActiveGame,
  gameState
}) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const sounds = useMenuSounds();

  const play = useCallback((fn) => {
    if (soundEnabled) sounds.playMenuSelect?.();
    fn?.();
  }, [soundEnabled, sounds]);

  // Build menu items list for gamepad navigation
  const menuItems = useMemo(() => {
    const items = [];
    if (hasActiveGame) {
      items.push({ label: 'Continuar', action: onStartGame });
      items.push({ label: 'Novo Jogo', action: onNewGame });
    } else {
      items.push({ label: 'Jogar', action: onStartGame });
    }
    items.push({ label: 'VS IA', action: onShowMultiplayer });
    items.push({ label: 'Tutorial', action: onShowTutorialHub });
    items.push({ label: 'Criador', action: onShowCreatorMode });
    items.push({ label: 'IA Expert', action: onShowAIShowcase });
    items.push({ label: 'Loja', action: onShowShop });
    items.push({ label: 'Missões', action: onShowMissions });
    items.push({ label: 'Conquistas', action: onShowAchievements });
    items.push({ label: 'Config', action: onShowSettings });
    return items;
  }, [hasActiveGame, onStartGame, onNewGame, onShowMultiplayer, onShowTutorialHub, onShowCreatorMode, onShowAIShowcase, onShowShop, onShowMissions, onShowAchievements, onShowSettings]);

  const handleGamepadConfirm = useCallback((index) => {
    if (menuItems[index]) {
      play(menuItems[index].action);
    }
  }, [menuItems, play]);

  const { selectedIndex } = useGamepadNav({
    itemCount: menuItems.length,
    onConfirm: handleGamepadConfirm,
    active: true,
    wrap: true,
  });

  // Helper to check if a menu item is selected by gamepad
  const isSelected = useCallback((label) => {
    return menuItems[selectedIndex]?.label === label;
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
            🐱 Cat Tetris
          </h1>
          <p className="text-white/50 text-xs mt-1">Empilhe blocos com seus amigos felinos</p>
        </motion.div>

        <motion.div {...fadeUp(0.1)} className="w-full space-y-2 mb-4">
          {hasActiveGame ? (
            <>
              <button
                onClick={() => play(onStartGame)}
                className={`w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-white font-bold text-lg shadow-lg shadow-emerald-500/20 transition-all duration-150 ${isSelected('Continuar') ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-slate-900 scale-[1.02]' : ''}`}
              >
                ▶ Continuar
                <span className="block text-emerald-100/70 text-xs font-normal mt-0.5">
                  Nível {gameState?.score?.level || 1} • {(gameState?.score?.points || 0).toLocaleString()} pts
                </span>
              </button>
              <button
                onClick={() => play(onNewGame)}
                className={`w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 active:scale-[0.98] text-white font-semibold text-base border border-white/10 transition-all duration-150 ${isSelected('Novo Jogo') ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-slate-900 scale-[1.02]' : ''}`}
              >
                Novo Jogo
              </button>
            </>
          ) : (
            <button
              onClick={() => play(onStartGame)}
              className={`w-full py-5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 active:scale-[0.98] text-white font-bold text-xl shadow-lg shadow-emerald-500/25 transition-all duration-150 ${isSelected('Jogar') ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-slate-900 scale-[1.02]' : ''}`}
            >
              🎮 Jogar
            </button>
          )}
        </motion.div>

        <motion.div {...fadeUp(0.18)} className="w-full grid grid-cols-2 gap-2 mb-4">
          <MenuCard icon="⚔️" label="VS IA"      sub="Desafie o bot"      onClick={() => play(onShowMultiplayer)} selected={isSelected('VS IA')} />
          <MenuCard icon="📚" label="Tutorial"   sub="Aprenda a jogar"    onClick={() => play(onShowTutorialHub)} selected={isSelected('Tutorial')} />
          <MenuCard icon="🎨" label="Criador"    sub="Treine T-Spins"     onClick={() => play(onShowCreatorMode)} selected={isSelected('Criador')} />
          <MenuCard icon="🤖" label="IA Expert"  sub="Assista a IA jogar" onClick={() => play(onShowAIShowcase)} selected={isSelected('IA Expert')} />
        </motion.div>

        <motion.div {...fadeUp(0.25)} className="w-full grid grid-cols-4 gap-1 mb-4">
          <QuickBtn icon="🛍️" label="Loja"       onClick={() => play(onShowShop)} selected={isSelected('Loja')} />
          <QuickBtn icon="📋" label="Missões"     onClick={() => play(onShowMissions)} selected={isSelected('Missões')} />
          <QuickBtn icon="🏅" label="Conquistas"  onClick={() => play(onShowAchievements)} selected={isSelected('Conquistas')} />
          <QuickBtn icon="⚙️" label="Config"      onClick={() => play(onShowSettings)} selected={isSelected('Config')} />
        </motion.div>

        <motion.div {...fadeUp(0.3)} className="flex items-center gap-3 text-xs text-white/25">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="hover:text-white/50 transition-colors"
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>

          {canInstallPWA && (
            <button
              onClick={() => play(onShowInstallPrompt)}
              className="hover:text-white/50 transition-colors"
            >
              📱 Instalar
            </button>
          )}

          <span className="select-none">v1.0</span>
        </motion.div>
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
      <span className="text-2xl mb-1">{icon}</span>
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
      <span className="text-lg">{icon}</span>
      <span className="text-white/40 text-[10px] leading-none">{label}</span>
    </button>
  );
}
