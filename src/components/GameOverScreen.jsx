import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import ShareButtons from './ShareButtons';
import { useGamepadNav } from '../hooks/useGamepadNav';
import { useI18n } from '../hooks/useI18n';
import { SadCatIcon, HappyCatIcon, HeartCatIcon } from './Icons';

const GameOverScreen = ({ score, onRestart, onBackToMenu }) => {

 const { t } = useI18n();
 const scoreValue = typeof score === 'number' ? score : score.points;
 const level = typeof score === 'object' ? score.level : 1;
 const lines = typeof score === 'object' ? score.lines : 0;

 const gameOverActions = [onRestart, onBackToMenu];
 const handleConfirm = useCallback((index) => {
 gameOverActions[index]?.();
 }, [onRestart, onBackToMenu]);

 const { selectedIndex } = useGamepadNav({
 itemCount: 2,
 onConfirm: handleConfirm,
 active: true,
 wrap: true,
 });

 const getMotivationalMessage = (score) => {
 if (score < 1000) return t('gameOver.msgLow');
 if (score < 5000) return t('gameOver.msgMed');
 if (score < 10000) return t('gameOver.msgHigh');
 return t('gameOver.msgTop');
 };

 const getCatEmoji = (score) => {
 if (score < 1000) return <SadCatIcon size={48} className="text-white/60" />;
 if (score < 5000) return <HappyCatIcon size={48} className="text-yellow-300" />;
 if (score < 10000) return <HappyCatIcon size={48} className="text-green-300" />;
 return <HeartCatIcon size={48} className="text-pink-300" />;
 };

 return (
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
 >
 <motion.div
 initial={{ scale: 0.8, y: 20 }}
 animate={{ scale: 1, y: 0 }}
 transition={{ type: "spring", damping: 15 }}
 className="bg-gray-900/90 p-8 rounded-2xl border-2 border-white/20 shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto relative overflow-hidden"
 >
 {/* Decorative corner blocks */}
 <div className="absolute top-2 left-2 w-4 h-4 rounded bg-purple-500/15" />
 <div className="absolute top-2 left-8 w-4 h-4 rounded bg-purple-500/10" />
 <div className="absolute top-8 left-2 w-4 h-4 rounded bg-purple-500/10" />
 <div className="absolute bottom-2 right-2 w-4 h-4 rounded bg-cyan-500/15" />
 <div className="absolute bottom-2 right-8 w-4 h-4 rounded bg-cyan-500/10" />
 <div className="absolute bottom-8 right-2 w-4 h-4 rounded bg-cyan-500/10" />
 <div className="text-center">
 <motion.h1
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.3 }}
 className="text-3xl font-cat font-bold text-white mb-2"
 >
 {t('gameOver.title')}
 </motion.h1>

 <motion.div
 initial={{ opacity: 0, scale: 0.5 }}
 animate={{ opacity: 1, scale: 1 }}
 transition={{ delay: 0.35 }}
 className="flex justify-center mb-2"
 >
 <img src={`${import.meta.env.BASE_URL}cats/cat-${scoreValue < 5000 ? 3 : scoreValue < 10000 ? 2 : 1}.png`} alt="" className="w-20 h-20 rounded-full border-2 border-white/20 shadow-lg" />
 </motion.div>

 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.4 }}
 className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 font-bold text-xl p-3 rounded-lg mb-4"
 >
 {t('gameOver.points', { score: scoreValue.toLocaleString() })}
 </motion.div>

 <motion.p
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.5 }}
 className="text-white/80 mb-6 text-lg"
 >
 {getMotivationalMessage(scoreValue)}
 </motion.p>

 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.55 }}
 >
 <ShareButtons
 scoreData={{
 score: scoreValue,
 level: level,
 lines: lines
 }}
 />
 </motion.div>

 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.6 }}
 className="space-y-3 mt-4"
 >
 <motion.button
 onClick={(e) => { e.stopPropagation(); onRestart(); }}
 whileHover={{ scale: 1.05 }}
 whileTap={{ scale: 0.95 }}
 className={`w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-6 rounded-lg hover:from-green-400 hover:to-emerald-500 transition-all duration-300 shadow-lg ${selectedIndex === 0 ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-gray-900 scale-105' : ''}`}
 >
 {t('gameOver.playAgain')}
 </motion.button>

 <motion.button
 onClick={(e) => { e.stopPropagation(); onBackToMenu(); }}
 whileHover={{ scale: 1.05 }}
 whileTap={{ scale: 0.95 }}
 className={`w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-bold py-3 px-6 rounded-lg hover:from-blue-400 hover:to-cyan-500 transition-all duration-300 shadow-lg ${selectedIndex === 1 ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-gray-900 scale-105' : ''}`}
 >
 {t('gameOver.backToMenu')}
 </motion.button>
 </motion.div>

 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 transition={{ delay: 0.8 }}
 className="mt-6 text-center text-white/60 text-sm flex flex-col items-center gap-2"
 >
 <div className="flex items-center gap-2 justify-center">
 <span className="text-xs opacity-40">🐾</span>
 <p>{t('gameOver.tip1')}</p>
 </div>
 <div className="flex items-center gap-2 justify-center">
 <span className="text-xs opacity-40">🐾</span>
 <p>{t('gameOver.tip2')}</p>
 </div>
 </motion.div>
 </div>
 </motion.div>
 </motion.div>
 );
};

export default GameOverScreen;
