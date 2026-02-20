import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useMenuSounds } from '../hooks/useMenuSounds';
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
                className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-white font-bold text-lg shadow-lg shadow-emerald-500/20 transition-all duration-150"
              >
                ▶ Continuar
                <span className="block text-emerald-100/70 text-xs font-normal mt-0.5">
                  Nível {gameState?.score?.level || 1} • {(gameState?.score?.points || 0).toLocaleString()} pts
                </span>
              </button>
              <button
                onClick={() => play(onNewGame)}
                className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 active:scale-[0.98] text-white font-semibold text-base border border-white/10 transition-all duration-150"
              >
                Novo Jogo
              </button>
            </>
          ) : (
            <button
              onClick={() => play(onStartGame)}
              className="w-full py-5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 active:scale-[0.98] text-white font-bold text-xl shadow-lg shadow-emerald-500/25 transition-all duration-150"
            >
              🎮 Jogar
            </button>
          )}
        </motion.div>

        <motion.div {...fadeUp(0.18)} className="w-full grid grid-cols-3 gap-2 mb-4">
          <MenuCard icon="⚔️" label="VS IA"      sub="Desafie o bot"      onClick={() => play(onShowMultiplayer)} />
          <MenuCard icon="📚" label="Tutorial"   sub="Aprenda a jogar"    onClick={() => play(onShowTutorialHub)} />
          <MenuCard icon="🤖" label="IA Expert"  sub="Assista a IA jogar" onClick={() => play(onShowAIShowcase)} />
        </motion.div>

        <motion.div {...fadeUp(0.25)} className="w-full grid grid-cols-4 gap-1 mb-4">
          <QuickBtn icon="🛍️" label="Loja"       onClick={() => play(onShowShop)} />
          <QuickBtn icon="📋" label="Missões"     onClick={() => play(onShowMissions)} />
          <QuickBtn icon="🏅" label="Conquistas"  onClick={() => play(onShowAchievements)} />
          <QuickBtn icon="⚙️" label="Config"      onClick={() => play(onShowSettings)} />
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

function MenuCard({ icon, label, sub, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center text-center p-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.06] hover:border-white/[0.12] active:scale-[0.97] transition-all duration-150"
    >
      <span className="text-2xl mb-1">{icon}</span>
      <span className="text-white font-semibold text-sm leading-tight">{label}</span>
      <span className="text-white/40 text-[10px] mt-0.5 leading-tight">{sub}</span>
    </button>
  );
}

function QuickBtn({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1 px-2 py-2 rounded-lg hover:bg-white/[0.07] active:scale-95 transition-all duration-150"
    >
      <span className="text-lg">{icon}</span>
      <span className="text-white/40 text-[10px] leading-none">{label}</span>
    </button>
  );
}
