import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { serviceContainer } from '../core/container/ServiceRegistration';
import { GameService } from '../core/services/GameService';
import { AIOpponentService } from '../core/services/AIOpponentService';
import { PieceFactory, MovementStrategyFactory } from '../patterns/Factory';
import { ScoringService } from '../core/services/ScoringService';
import { GameEventEmitter } from '../patterns/Observer';
import TetrisBoard from './TetrisBoard';
import NextPieces from './NextPieces';
import HeldPiece from './HeldPiece';
import Scoreboard from './Scoreboard';
import GamepadIndicator from './GamepadIndicator';
import { useGamepad } from '../hooks/useGamepad';
import { useGamepadNav } from '../hooks/useGamepadNav';
import { useKeyboardInput } from '../hooks/useKeyboardInput';
import { useI18n } from '../hooks/useI18n';
import { TrophyIcon, RobotIcon, SadCatIcon, BackIcon } from './Icons';

const SPEED_ZONES = [
 { time: 0,   level: 1,  name: 'START',      color: 'text-green-400',  bg: 'bg-green-500/20' },
 { time: 30,  level: 3,  name: 'SPEED UP',   color: 'text-green-300',  bg: 'bg-green-500/20' },
 { time: 60,  level: 5,  name: 'HEATING UP', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
 { time: 90,  level: 7,  name: 'INTENSE',    color: 'text-yellow-300', bg: 'bg-yellow-500/20' },
 { time: 120, level: 9,  name: 'DANGER',     color: 'text-orange-400', bg: 'bg-orange-500/20' },
 { time: 150, level: 11, name: 'EXTREME',    color: 'text-orange-300', bg: 'bg-orange-500/20' },
 { time: 180, level: 13, name: 'FRENZY',     color: 'text-red-400',    bg: 'bg-red-500/20' },
 { time: 210, level: 15, name: 'KILL ZONE',  color: 'text-red-500',    bg: 'bg-red-500/30' },
];

function getSpeedZone(elapsedSeconds) {
 let zone = SPEED_ZONES[0];
 for (const z of SPEED_ZONES) {
  if (elapsedSeconds >= z.time) zone = z;
  else break;
 }
 return zone;
}

function MultiplayerGame({ mode, aiDifficulty, ai1Difficulty, ai2Difficulty, onExit }) {
 const { t } = useI18n();
 const [player1State, setPlayer1State] = useState(null);
 const [player2State, setPlayer2State] = useState(null);
 const [winner, setWinner] = useState(null);
 const [p1Extra, setP1Extra] = useState({ garbage: 0, incoming: 0, queue: [], sent: 0 });
 const [p2Extra, setP2Extra] = useState({ garbage: 0, incoming: 0, queue: [], sent: 0 });
 const p1SentRef = useRef(0);
 const p2SentRef = useRef(0);
 const servicesRef = useRef({ p1: null, p2: null, ai: null, ai1: null, ai2: null, p1Events: null, p2Events: null });
 const lastTimeRef = useRef(0);
 const loopRef = useRef(null);
 const winnerRef = useRef(null);
 const matchTimeRef = useRef(0);
 const lastZoneRef = useRef(SPEED_ZONES[0]);
 const matchTimeDisplayRef = useRef(0);
 const [matchTime, setMatchTime] = useState(0);
 const [speedZone, setSpeedZone] = useState(SPEED_ZONES[0]);
 const [speedZoneFlash, setSpeedZoneFlash] = useState(false);

 useEffect(() => {
 const p1Service = new GameService(
 new PieceFactory(),
 new MovementStrategyFactory(),
 null,
 new ScoringService()
 );
 const p2Service = new GameService(
 new PieceFactory(),
 new MovementStrategyFactory(),
 null,
 new ScoringService()
 );

 const p1Events = new GameEventEmitter();
 const p2Events = new GameEventEmitter();
 p1Service.events = p1Events;
 p2Service.events = p2Events;
 let aiService = null;
 let ai1Service = null;
 let ai2Service = null;

 if (mode === 'vsAI') {
 try {
 aiService = new AIOpponentService();
 aiService.setDifficulty(aiDifficulty || 'medium');
 if (aiDifficulty === 'expert') {
 p2Service.score._fixedLevel = 1;
 }
 } catch (e) { }
 } else if (mode === 'aiVsAI') {
 ai1Service = new AIOpponentService();
 ai1Service.setDifficulty(ai1Difficulty || 'expert');
 ai1Service.setVisualMode(true);
 ai2Service = new AIOpponentService();
 ai2Service.setDifficulty(ai2Difficulty || 'expert');
 ai2Service.setVisualMode(true);
 if ((ai1Difficulty || 'expert') === 'expert') {
 p1Service.score._fixedLevel = 1;
 }
 if ((ai2Difficulty || 'expert') === 'expert') {
 p2Service.score._fixedLevel = 1;
 }
 }

 p1Service.initializeGame();
 p1Service.isPlaying = true;
 p2Service.initializeGame();
 p2Service.isPlaying = true;

 if (mode === 'vsAI' && aiDifficulty === 'expert') {
 p2Service._lockDelayMax = 2000;
 p2Service._lockDelayMaxResets = 50;
 } else if (mode === 'aiVsAI') {
 if ((ai1Difficulty || 'expert') === 'expert') {
 p1Service._lockDelayMax = 2000;
 p1Service._lockDelayMaxResets = 50;
 }
 if ((ai2Difficulty || 'expert') === 'expert') {
 p2Service._lockDelayMax = 2000;
 p2Service._lockDelayMaxResets = 50;
 }
 }

 servicesRef.current = { p1: p1Service, p2: p2Service, ai: aiService, ai1: ai1Service, ai2: ai2Service, p1Events, p2Events };
 setPlayer1State(p1Service.getGameState());
 setPlayer2State(p2Service.getGameState());

 return () => {
 if (loopRef.current) cancelAnimationFrame(loopRef.current);
 };
 }, [mode, aiDifficulty, ai1Difficulty, ai2Difficulty]);

 const lastRenderRef = useRef(0);
 const RENDER_INTERVAL = 16; // ms - throttle React renders to ~60fps, skip unnecessary frames
 const p1DirtyForRenderRef = useRef(false);
 const p2DirtyForRenderRef = useRef(false);

 useEffect(() => {
 const gameLoop = (currentTime) => {
 if (!lastTimeRef.current) lastTimeRef.current = currentTime;
 const deltaTime = currentTime - lastTimeRef.current;
 lastTimeRef.current = currentTime;

 const { p1, p2, ai, ai1, ai2 } = servicesRef.current;
 if (!p1 || !p2) { loopRef.current = requestAnimationFrame(gameLoop); return; }

 if (p1.gameOver || p2.gameOver) {

 if (!winnerRef.current) {
 if (p1.gameOver && !p2.gameOver) {
 winnerRef.current = 'player2';
 } else if (!p1.gameOver && p2.gameOver) {
 winnerRef.current = 'player1';
 } else {

 winnerRef.current = (p1.score?.points || 0) >= (p2.score?.points || 0) ? 'player1' : 'player2';
 }
 setWinner(winnerRef.current);
 }

 if (!p1.gameOver) { p1.gameOver = true; p1._markDirty(); }
 if (!p2.gameOver) { p2.gameOver = true; p2._markDirty(); }

 if (p1.isDirty) { setPlayer1State(p1.getGameState()); p1.clearDirty(); }
 if (p2.isDirty) { setPlayer2State(p2.getGameState()); p2.clearDirty(); }
 loopRef.current = requestAnimationFrame(gameLoop);
 return;
 }

 if (!p1.isPaused) p1.updateGame(deltaTime);
 if (!p2.isPaused) p2.updateGame(deltaTime);

 const p1Attack = p1.consumeAttack();
 if (p1Attack > 0 && !p2.gameOver) {
 p2.receiveGarbage(p1Attack);
 p1SentRef.current += p1Attack;
 }
 const p2Attack = p2.consumeAttack();
 if (p2Attack > 0 && !p1.gameOver) {
 p1.receiveGarbage(p2Attack);
 p2SentRef.current += p2Attack;
 }

 const _execAI = (aiSvc, gameSvc) => {
 if (!aiSvc || gameSvc.gameOver) return;
 try {
 const isAiVsAi = mode === 'aiVsAI';
 const maxActions = isAiVsAi ? 3 : 1;
 for (let i = 0; i < maxActions; i++) {
 const d = aiSvc.decideNextMove(gameSvc.getGameState());
 if (!d) break;
 switch (d.action) {
 case 'left': gameSvc.movePiece('left'); break;
 case 'right': gameSvc.movePiece('right'); break;
 case 'rotate': gameSvc.rotatePiece(); break;
 case 'down': gameSvc.movePiece('down'); break;
 case 'drop': gameSvc.hardDrop(); break;
 case 'hold': gameSvc.holdPiece(); break;
 }
 if (d.action === 'drop') break;
 }
 } catch (e) { }
 };

 if (mode === 'aiVsAI') {
 _execAI(ai1, p1);
 _execAI(ai2, p2);
 } else if (mode === 'vsAI') {
 _execAI(ai, p2);
 }

 matchTimeRef.current += deltaTime;
 const elapsedSec = Math.floor(matchTimeRef.current / 1000);
 const zone = getSpeedZone(elapsedSec);

 p1.score.setTimeLevel(zone.level);
 p2.score.setTimeLevel(zone.level);

 if (elapsedSec !== matchTimeDisplayRef.current) {
  matchTimeDisplayRef.current = elapsedSec;
  setMatchTime(elapsedSec);
 }

 if (zone !== lastZoneRef.current) {
  lastZoneRef.current = zone;
  setSpeedZone(zone);
  setSpeedZoneFlash(true);

  p1._markDirty();
  p2._markDirty();
 }

 // Track dirty flags
 if (p1.isDirty) { p1DirtyForRenderRef.current = true; p1.clearDirty(); }
 if (p2.isDirty) { p2DirtyForRenderRef.current = true; p2.clearDirty(); }

 // Flush React state updates at a controlled rate to avoid excessive re-renders
 const sinceLastRender = currentTime - lastRenderRef.current;
 if (sinceLastRender >= RENDER_INTERVAL || p1DirtyForRenderRef.current || p2DirtyForRenderRef.current) {
  if (p1DirtyForRenderRef.current) {
   const s1 = p1.getGameState();
   setPlayer1State(s1);
   setP1Extra({ garbage: p1.pendingGarbage, incoming: s1.incomingGarbage, queue: s1.garbageQueue, sent: p1SentRef.current });
   p1DirtyForRenderRef.current = false;
  }
  if (p2DirtyForRenderRef.current) {
   const s2 = p2.getGameState();
   setPlayer2State(s2);
   setP2Extra({ garbage: p2.pendingGarbage, incoming: s2.incomingGarbage, queue: s2.garbageQueue, sent: p2SentRef.current });
   p2DirtyForRenderRef.current = false;
  }
  lastRenderRef.current = currentTime;
 }

 loopRef.current = requestAnimationFrame(gameLoop);
 };

 loopRef.current = requestAnimationFrame(gameLoop);
 return () => { if (loopRef.current) cancelAnimationFrame(loopRef.current); };
 }, [mode]);

 useEffect(() => {
 if (speedZoneFlash) {
  const timer = setTimeout(() => setSpeedZoneFlash(false), 2000);
  return () => clearTimeout(timer);
 }
 }, [speedZoneFlash]);

 // Helper to immediately flush p1 state to React after a player action
 const flushP1 = React.useCallback(() => {
  const p1 = servicesRef.current.p1;
  if (p1?.isDirty) {
   const s1 = p1.getGameState();
   setPlayer1State(s1);
   setP1Extra({ garbage: p1.pendingGarbage, incoming: s1.incomingGarbage, queue: s1.garbageQueue, sent: p1SentRef.current });
   p1.clearDirty();
   p1DirtyForRenderRef.current = false;
  }
 }, []);

 const p1KeyActions = React.useMemo(() => ({
 movePiece: (dir) => {
  const p1 = servicesRef.current.p1;
  if (p1 && !p1.gameOver) { p1.movePiece(dir); flushP1(); }
 },
 rotatePiece: () => {
  const p1 = servicesRef.current.p1;
  if (p1 && !p1.gameOver) { p1.rotatePiece(); flushP1(); }
 },
 rotatePieceLeft: () => {
  const p1 = servicesRef.current.p1;
  if (p1 && !p1.gameOver) { p1.rotatePieceLeft(); flushP1(); }
 },
 hardDrop: () => {
  const p1 = servicesRef.current.p1;
  if (p1 && !p1.gameOver) { p1.hardDrop(); flushP1(); }
 },
 holdPiece: () => {
  const p1 = servicesRef.current.p1;
  if (p1 && !p1.gameOver) { p1.holdPiece(); flushP1(); }
 },
 pause: () => {},
 resume: () => {},
 }), [flushP1]);

 useKeyboardInput(p1KeyActions, player1State, !winner && mode !== 'aiVsAI');

 const gamepadP1Actions = React.useMemo(() => {

 const base = {
 backToMenu: onExit,
 togglePause: () => {},
 isGameOver: () => {
 const p1 = servicesRef.current.p1;
 return p1?.gameOver ?? true;
 }
 };
 if (winner || mode === 'aiVsAI') return base;
 return {
 ...base,
 movePiece: (dir) => {
 const p1 = servicesRef.current.p1;
 if (p1 && !p1.gameOver) { p1.movePiece(dir); flushP1(); }
 },
 rotatePiece: () => {
 const p1 = servicesRef.current.p1;
 if (p1 && !p1.gameOver) { p1.rotatePiece(); flushP1(); }
 },
 rotatePieceLeft: () => {
 const p1 = servicesRef.current.p1;
 if (p1 && !p1.gameOver) { p1.rotatePiece('left'); flushP1(); }
 },
 hardDrop: () => {
 const p1 = servicesRef.current.p1;
 if (p1 && !p1.gameOver) { p1.hardDrop(); flushP1(); }
 },
 holdPiece: () => {
 const p1 = servicesRef.current.p1;
 if (p1 && !p1.gameOver) { p1.holdPiece(); flushP1(); }
 },
 };
 }, [winner, mode, onExit, flushP1]);

 const { isGamepadActive, controllerCount, processGamepadInput, getGamepadInfo } = useGamepad(gamepadP1Actions);

 useEffect(() => {
 if (!isGamepadActive) return;
 const interval = setInterval(() => processGamepadInput(), 16);
 return () => clearInterval(interval);
 }, [isGamepadActive, processGamepadInput]);

 const handleRestart = useCallback(() => {
 const { p1, p2, ai, ai1, ai2 } = servicesRef.current;
 if (p1) { p1.initializeGame(); p1.isPlaying = true; }
 if (p2) { p2.initializeGame(); p2.isPlaying = true; }
 if (ai) ai.reset?.();
 if (ai1) ai1.reset?.();
 if (ai2) ai2.reset?.();
 winnerRef.current = null;
 lastTimeRef.current = 0;
 matchTimeRef.current = 0;
 matchTimeDisplayRef.current = 0;
 lastZoneRef.current = SPEED_ZONES[0];
 setWinner(null);
 setMatchTime(0);
 setSpeedZone(SPEED_ZONES[0]);
 setSpeedZoneFlash(false);
 setP1Extra({ garbage: 0, incoming: 0, queue: [], sent: 0 });
 setP2Extra({ garbage: 0, incoming: 0, queue: [], sent: 0 });
 p1SentRef.current = 0;
 p2SentRef.current = 0;
 if (p1) setPlayer1State(p1.getGameState());
 if (p2) setPlayer2State(p2.getGameState());
 }, []);

 const { selectedIndex: winnerSelIdx } = useGamepadNav({
 itemCount: 2,
 onConfirm: (index) => {
 if (index === 0) handleRestart();
 else onExit();
 },
 onBack: onExit,
 active: !!winner,
 wrap: true,
 });

 const p1DropPreview = React.useMemo(() => {
 if (!player1State?.currentPiece || player1State?.gameOver) return null;
 try { return servicesRef.current.p1?.getDropPreview(); } catch { return null; }
 }, [player1State?.currentPiece?.position?.x, player1State?.currentPiece?.position?.y, player1State?.currentPiece?.type, player1State?.currentPiece?.rotationState]);

 const p2DropPreview = React.useMemo(() => {
 if (!player2State?.currentPiece || player2State?.gameOver) return null;
 try { return servicesRef.current.p2?.getDropPreview(); } catch { return null; }
 }, [player2State?.currentPiece?.position?.x, player2State?.currentPiece?.position?.y, player2State?.currentPiece?.type, player2State?.currentPiece?.rotationState]);

 if (!player1State || !player2State) {
 return (
 <div className="h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900">
 <div className="text-white text-2xl">{t('multiplayer.loading')}</div>
 </div>
 );
 }

 return (
 <div className="h-screen flex flex-col items-center bg-gradient-to-br from-purple-900 to-blue-900 p-2 overflow-hidden">

 {isGamepadActive && (
 <GamepadIndicator
 isConnected={isGamepadActive}
 controllerCount={controllerCount}
 gamepadInfo={getGamepadInfo()}
 />
 )}

 <div className="flex justify-between items-center w-full max-w-5xl mb-2">
 <div className="flex items-center gap-2">
 <motion.button
 onClick={onExit}
 whileHover={{ scale: 1.05 }}
 whileTap={{ scale: 0.95 }}
 className="bg-white/15 hover:bg-white/25 text-white p-1.5 rounded-lg transition-colors"
 >
 <BackIcon size={16} />
 </motion.button>
 <h1 className="text-xl sm:text-2xl font-bold text-white">
 {mode === 'aiVsAI' ? t('multiplayer.aiVsAiTitle') : mode === 'vsAI' ? t('multiplayer.vsAiTitle') : t('multiplayer.localTitle')}
 </h1>
 </div>
 {}
 <div className="flex flex-col items-center">
  <div className="text-white/70 text-xs sm:text-sm font-mono tabular-nums">
   {Math.floor(matchTime / 60)}:{String(matchTime % 60).padStart(2, '0')}
  </div>
  <div className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full transition-all duration-300 ${speedZone.color} ${speedZone.bg} ${speedZoneFlash ? 'animate-pulse scale-110 ring-1 ring-white/40' : ''}`}>
   {speedZone.name}
  </div>
 </div>
 </div>

 <div className="multiplayer-boards flex gap-1 sm:gap-4 items-start justify-center">

 {/* Player 1 */}
 <div className="flex flex-col items-center min-w-0">
 <div className="bg-blue-600 text-white px-2 sm:px-4 py-0.5 sm:py-1 rounded-t-lg font-bold text-xs sm:text-base truncate max-w-full">
 {mode === 'aiVsAI' ? ` AI1 (${t(`multiplayer.diff.${ai1Difficulty}`)})` : mode === 'vsAI' ? t('multiplayer.you') : t('multiplayer.p1')}
 </div>
 <div className="bg-black/40 p-1 sm:p-2 rounded-b-lg">
 <div className="flex gap-1 sm:gap-2">
 <div className="hidden sm:flex flex-col gap-2">
 <HeldPiece heldPiece={player1State.heldPiece} canHold={player1State.canHold} />
 {mode !== 'aiVsAI' && (
 <div className="text-white/60 text-[10px] leading-tight whitespace-pre-line">
 {t('multiplayer.controlsP1')}
 </div>
 )}
 </div>
 <div className="relative">
 <TetrisBoard board={player1State.board} currentPiece={player1State.currentPiece} dropPreview={p1DropPreview} gameOver={player1State.gameOver} bufferRows={player1State.bufferRows} events={servicesRef.current.p1Events} />
 <GarbageWarning incoming={p1Extra.incoming} queue={p1Extra.queue} t={t} />
 </div>
 {(p1Extra.garbage > 0 || p1Extra.incoming > 0) && <GarbageMeter pending={p1Extra.garbage} incoming={p1Extra.incoming} queue={p1Extra.queue} />}
 <div className="hidden sm:flex flex-col gap-2">
 <NextPieces pieces={player1State.nextPieces || []} />
 <Scoreboard score={player1State.score?.points || 0} level={player1State.score?.effectiveLevel || player1State.score?.level || 1} lines={player1State.score?.lines || 0} combo={player1State.score?.combo || 0} sent={p1Extra.sent} />
 </div>
 </div>
 {/* Compact mobile score */}
 <div className="sm:hidden flex justify-between text-[9px] text-white/70 mt-1 px-0.5 font-mono">
 <span>{(player1State.score?.points || 0).toLocaleString()}</span>
 <span>{t('multiplayer.lvAbbr', { n: player1State.score?.effectiveLevel || player1State.score?.level || 1 })}</span>
 <span>{t('multiplayer.sentAbbr', { n: p1Extra.sent })}</span>
 </div>
 </div>
 </div>

 {/* VS badge */}
 <div className="flex items-center justify-center self-center">
 <div className="bg-yellow-500 text-black font-bold text-sm sm:text-3xl px-2 sm:px-4 py-1 sm:py-2 rounded-full shadow-lg">VS</div>
 </div>

 {/* Player 2 */}
 <div className="flex flex-col items-center min-w-0">
 <div className="bg-red-600 text-white px-2 sm:px-4 py-0.5 sm:py-1 rounded-t-lg font-bold text-xs sm:text-base truncate max-w-full">
 {mode === 'aiVsAI' ? ` AI2 (${t(`multiplayer.diff.${ai2Difficulty}`)})` : mode === 'vsAI' ? ` AI (${t(`multiplayer.diff.${aiDifficulty}`)})` : t('multiplayer.p2')}
 </div>
 <div className="bg-black/40 p-1 sm:p-2 rounded-b-lg">
 <div className="flex gap-1 sm:gap-2">
 <div className="hidden sm:flex flex-col gap-2">
 <HeldPiece heldPiece={player2State.heldPiece} canHold={player2State.canHold} />
 {mode === '1v1' && (
 <div className="text-white/60 text-[10px] leading-tight whitespace-pre-line">
 {t('multiplayer.controlsP2')}
 </div>
 )}
 </div>
 <div className="relative">
 <TetrisBoard board={player2State.board} currentPiece={player2State.currentPiece} dropPreview={p2DropPreview} gameOver={player2State.gameOver} bufferRows={player2State.bufferRows} events={servicesRef.current.p2Events} />
 <GarbageWarning incoming={p2Extra.incoming} queue={p2Extra.queue} t={t} />
 </div>
 {(p2Extra.garbage > 0 || p2Extra.incoming > 0) && <GarbageMeter pending={p2Extra.garbage} incoming={p2Extra.incoming} queue={p2Extra.queue} />}
 <div className="hidden sm:flex flex-col gap-2">
 <NextPieces pieces={player2State.nextPieces || []} />
 <Scoreboard score={player2State.score?.points || 0} level={player2State.score?.effectiveLevel || player2State.score?.level || 1} lines={player2State.score?.lines || 0} combo={player2State.score?.combo || 0} sent={p2Extra.sent} />
 </div>
 </div>
 {/* Compact mobile score */}
 <div className="sm:hidden flex justify-between text-[9px] text-white/70 mt-1 px-0.5 font-mono">
 <span>{(player2State.score?.points || 0).toLocaleString()}</span>
 <span>{t('multiplayer.lvAbbr', { n: player2State.score?.effectiveLevel || player2State.score?.level || 1 })}</span>
 <span>{t('multiplayer.sentAbbr', { n: p2Extra.sent })}</span>
 </div>
 </div>
 </div>
 </div>

 <AnimatePresence>
 {winner && (
 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
 <motion.div initial={{ scale: 0.8, y: 50 }} animate={{ scale: 1, y: 0 }} className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl p-12 text-center">
 <div className="text-8xl mb-4 flex justify-center">{winner === 'player1' ? <TrophyIcon size={80} className="text-yellow-300" /> : (mode === 'aiVsAI' ? <RobotIcon size={80} className="text-white" /> : <SadCatIcon size={80} className="text-white/60" />)}</div>
 <h2 className="text-5xl font-bold text-white mb-4">
 {mode === 'aiVsAI'
 ? (winner === 'player1' ? t('multiplayer.ai1Won') : t('multiplayer.ai2Won'))
 : (winner === 'player1' ? t('multiplayer.victory') : t('multiplayer.defeat'))}
 </h2>
 <p className="text-2xl text-white/80 mb-8">
 {mode === 'aiVsAI'
 ? `${winner === 'player1' ? ai1Difficulty?.toUpperCase() : ai2Difficulty?.toUpperCase()} ${t('multiplayer.isSuperior')}`
 : winner === 'player1'
 ? (mode === 'vsAI' ? t('multiplayer.youBeatAI') : t('multiplayer.player1Won'))
 : (mode === 'vsAI' ? t('multiplayer.aiBeatYou') : t('multiplayer.player2Won'))}
 </p>
 <div className="grid grid-cols-2 gap-4 mb-8 text-white">
 <div className="bg-black/30 rounded-lg p-4">
 <div className="text-sm opacity-60">{mode === 'aiVsAI' ? `AI1 (${t(`multiplayer.diff.${ai1Difficulty}`)})` : t('multiplayer.player1')}</div>
 <div className="text-3xl font-bold">{(player1State.score?.points || 0).toLocaleString()}</div>
 <div className="text-sm mt-1"><span className="opacity-60">{t('game.sentLabel')}</span> <span className="text-red-400 font-bold">{p1Extra.sent}</span></div>
 </div>
 <div className="bg-black/30 rounded-lg p-4">
 <div className="text-sm opacity-60">{mode === 'aiVsAI' ? `AI2 (${t(`multiplayer.diff.${ai2Difficulty}`)})` : mode === 'vsAI' ? 'AI' : t('multiplayer.player2')}</div>
 <div className="text-3xl font-bold">{(player2State.score?.points || 0).toLocaleString()}</div>
 <div className="text-sm mt-1"><span className="opacity-60">{t('game.sentLabel')}</span> <span className="text-red-400 font-bold">{p2Extra.sent}</span></div>
 </div>
 </div>
 <div className="flex gap-4">
 <button onClick={handleRestart} className={`bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold text-xl transition-colors ${winnerSelIdx === 0 ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-orange-600' : ''}`}>{t('multiplayer.playAgain')}</button>
 <button onClick={onExit} className={`bg-gray-700 hover:bg-gray-800 text-white px-8 py-3 rounded-lg font-bold text-xl transition-colors ${winnerSelIdx === 1 ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-orange-600' : ''}`}>{t('multiplayer.backToMenu')}</button>
 </div>
 </motion.div>
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 );
}

const GarbageMeter = React.memo(function GarbageMeter({ pending, incoming, queue }) {
 const maxDisplay = 20;
 const total = pending + incoming;
 const displayPending = Math.min(pending, maxDisplay);
 const displayIncoming = Math.min(incoming, maxDisplay - displayPending);
 const displayTotal = displayPending + displayIncoming;

 if (displayTotal === 0) return null;

 const maxProgress = queue && queue.length > 0
 ? Math.max(...queue.map(g => g.progress))
 : 0;

 return (
 <div className="flex flex-col-reverse justify-end w-3 rounded overflow-hidden relative" style={{ height: 'calc(var(--cell) * 22 + 22px)' }}>
 {/* Pending garbage (confirmed - red, solid) */}
 {Array.from({ length: displayPending }, (_, i) => (
 <div
 key={`p-${i}`}
 className="w-full"
 style={{
 height: `${100 / maxDisplay}%`,
 backgroundColor: '#ef4444',
 opacity: 0.7 + (i / Math.max(displayTotal, 1)) * 0.3,
 }}
 />
 ))}
 {/* Incoming garbage (warning - yellow, pulsing) */}
 {Array.from({ length: displayIncoming }, (_, i) => (
 <div
 key={`i-${i}`}
 className="w-full"
 style={{
 height: `${100 / maxDisplay}%`,
 backgroundColor: '#f59e0b',
 opacity: 0.4 + maxProgress * 0.5,
 animation: 'garbagePulse 0.8s ease-in-out infinite',
 }}
 />
 ))}
 {/* Progress bar overlay for nearest-to-arriving garbage */}
 {displayIncoming > 0 && (
 <div
 className="absolute bottom-0 left-0 w-full pointer-events-none"
 style={{
 height: `${(displayIncoming / maxDisplay) * 100}%`,
 background: `linear-gradient(to top, rgba(239,68,68,${maxProgress * 0.6}) 0%, transparent 100%)`,
 }}
 />
 )}
 </div>
 );
});

/** Warning overlay shown on the board when garbage is incoming */
const GarbageWarning = React.memo(function GarbageWarning({ incoming, queue, t }) {
 if (incoming <= 0) return null;

 const maxProgress = queue && queue.length > 0
 ? Math.max(...queue.map(g => g.progress))
 : 0;

 const isUrgent = maxProgress > 0.7;

 return (
 <>
 {/* Red flash on board edges when garbage is about to arrive */}
 <div
 className="absolute inset-0 pointer-events-none rounded"
 style={{
 boxShadow: isUrgent
 ? `inset 0 -${incoming * 4}px 20px -5px rgba(239, 68, 68, ${0.2 + maxProgress * 0.4})`
 : `inset 0 -${incoming * 3}px 15px -5px rgba(245, 158, 11, ${0.1 + maxProgress * 0.2})`,
 transition: 'box-shadow 0.3s ease',
 }}
 />
 {/* " INCOMING" text badge */}
 {isUrgent && (
 <div
 className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-red-600/90 text-white text-[9px] sm:text-xs font-bold px-2 py-0.5 rounded whitespace-nowrap z-10"
 style={{ animation: 'warningBlink 0.5s ease-in-out infinite' }}
 >
 {t('multiplayer.incoming')} x{incoming}
 </div>
 )}
 </>
 );
});

export default MultiplayerGame;
