import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePracticeGame } from '../hooks/usePracticeGame';
import { useKeyboardInput } from '../hooks/useKeyboardInput';
import { DemonstrationPlayer } from '../core/services/DemonstrationPlayer';
import { getDemonstration, hasDemonstration } from '../core/services/DemonstrationLibrary';
import TetrisBoard from './TetrisBoard';
import NextPieces from './NextPieces';
import HeldPiece from './HeldPiece';
import Scoreboard from './Scoreboard';

/**
 * LessonPlayer - Executa uma lesson do tutorial
 * Modos: demonstration (CPU joga) | practice (jogador pratica)
 */
function LessonPlayer({ lesson, onComplete, onExit }) {
  const [mode, setMode] = useState('introduction'); // introduction | demonstration | practice
  const [demonstrationStep, setDemonstrationStep] = useState(0);
  const [practiceState, setPracticeState] = useState({
    attempts: 0,
    progress: 0,
    feedback: '',
    complete: false
  });
  const [showHint, setShowHint] = useState(null);
  const [demonstrationState, setDemonstrationState] = useState({
    isPlaying: false,
    isPaused: false,
    progress: 0,
    currentNarration: ''
  });
  
  const demonstrationPlayerRef = useRef(null);
  const hasDemoAvailable = hasDemonstration(lesson.id);

  // Game de prática (só ativa no modo practice)
  const { gameState, actions, isInitialized, getValidationState } = usePracticeGame(
    mode === 'practice' ? lesson : null
  );

  // Keyboard input (só ativo no modo practice)
  useKeyboardInput(actions, gameState, mode === 'practice' && isInitialized);

  // Inicializar demonstração
  const startDemonstration = useCallback(() => {
    if (!hasDemoAvailable || !gameState) return;

    const demo = getDemonstration(lesson.id);
    if (!demo) return;

    // Criar player de demonstração se não existir
    if (!demonstrationPlayerRef.current) {
      demonstrationPlayerRef.current = new DemonstrationPlayer(actions);
      
      // Callbacks
      demonstrationPlayerRef.current.onStep((step, stepIndex) => {
        setDemonstrationState(prev => ({
          ...prev,
          currentNarration: step.narration || ''
        }));
      });

      demonstrationPlayerRef.current.onComplete(() => {
        setDemonstrationState(prev => ({
          ...prev,
          isPlaying: false,
          progress: 1.0
        }));
      });
    }

    demonstrationPlayerRef.current.loadRecording(demo);
    demonstrationPlayerRef.current.play();

    setDemonstrationState(prev => ({
      ...prev,
      isPlaying: true,
      isPaused: false
    }));
  }, [hasDemoAvailable, gameState, lesson.id, actions]);

  const pauseDemonstration = useCallback(() => {
    demonstrationPlayerRef.current?.pause();
    setDemonstrationState(prev => ({ ...prev, isPaused: true }));
  }, []);

  const resumeDemonstration = useCallback(() => {
    demonstrationPlayerRef.current?.resume();
    setDemonstrationState(prev => ({ ...prev, isPaused: false }));
  }, []);

  const stopDemonstration = useCallback(() => {
    demonstrationPlayerRef.current?.stop();
    setDemonstrationState({
      isPlaying: false,
      isPaused: false,
      progress: 0,
      currentNarration: ''
    });
  }, []);

  // Atualizar progresso da demonstração
  useEffect(() => {
    if (!demonstrationState.isPlaying || demonstrationState.isPaused) return;

    const interval = setInterval(() => {
      if (demonstrationPlayerRef.current) {
        const progress = demonstrationPlayerRef.current.getProgress();
        setDemonstrationState(prev => ({ ...prev, progress }));
      }
    }, 100);

    return () => clearInterval(interval);
  }, [demonstrationState.isPlaying, demonstrationState.isPaused]);

  // Validação contínua durante prática
  useEffect(() => {
    if (mode !== 'practice' || !isInitialized || !gameState) return;

    const validationState = getValidationState();
    if (!validationState) return;

    const validation = lesson.practice.validation(validationState);
    
    setPracticeState(prev => ({
      ...prev,
      progress: validation.progress || 0,
      feedback: validation.feedback || '',
      complete: validation.complete || false
    }));

    if (validation.complete && !practiceState.complete) {
      setTimeout(() => {
        onComplete(lesson.id, { attempts: practiceState.attempts + 1 });
      }, 2000);
    }
  }, [mode, isInitialized, gameState, lesson, getValidationState, practiceState.complete, onComplete]);

  // Sistema de hints
  useEffect(() => {
    if (mode !== 'practice') return;
    if (!lesson.practice.hints) return;

    lesson.practice.hints.forEach(hint => {
      if (hint.trigger.startsWith('idle:')) {
        const delay = parseInt(hint.trigger.split(':')[1]);
        const timer = setTimeout(() => {
          setShowHint(hint.text);
          setTimeout(() => setShowHint(null), 5000);
        }, delay);
        return () => clearTimeout(timer);
      }
    });
  }, [mode, lesson, practiceState]);

  const handlePracticeAction = useCallback((gameState) => {
    if (mode !== 'practice') return;

    const validation = lesson.practice.validation(gameState);
    
    setPracticeState(prev => ({
      ...prev,
      progress: validation.progress || 0,
      feedback: validation.feedback || '',
      complete: validation.complete || false
    }));

    if (validation.complete) {
      setTimeout(() => {
        onComplete(lesson.id, { attempts: practiceState.attempts + 1 });
      }, 2000);
    }
  }, [mode, lesson, practiceState, onComplete]);

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-4xl">{lesson.module === 'fundamentals' ? '🎮' : 
                                          lesson.module === 'intermediate' ? '🌀' :
                                          lesson.module === 'advanced' ? '💎' : '🏆'}</span>
              <div>
                <h2 className="text-2xl font-bold text-white">{lesson.title}</h2>
                <p className="text-white/70">{lesson.description}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right text-white/80">
              <div className="text-sm uppercase">Modo</div>
              <div className="text-lg font-bold">
                {mode === 'introduction' ? '📖 Introdução' :
                 mode === 'demonstration' ? '🎬 Demonstração' : '🎮 Prática'}
              </div>
            </div>
            
            <button
              onClick={onExit}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors"
            >
              ❌ Sair
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
        <div className="max-w-7xl w-full">
          <AnimatePresence mode="wait">
            {/* TELA DE INTRODUÇÃO */}
            {mode === 'introduction' && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-4xl mx-auto"
              >
                {/* Objetivo da Lição */}
                <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl p-8 mb-8 text-center">
                  <div className="text-6xl mb-4">🎯</div>
                  <h3 className="text-3xl font-bold text-white mb-4">O que você vai aprender</h3>
                  <p className="text-2xl text-white/90 leading-relaxed">
                    {lesson.practice.objective}
                  </p>
                </div>

                {/* Explicação Detalhada */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8">
                  <h4 className="text-2xl font-bold text-white mb-4">💡 Como funciona</h4>
                  <div className="text-xl text-white/80 leading-relaxed space-y-4">
                    {lesson.demonstration.narration.map((narr, idx) => (
                      <p key={idx} className="flex items-start gap-3">
                        <span className="text-purple-400 font-bold">{idx + 1}.</span>
                        <span>{narr.text}</span>
                      </p>
                    ))}
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="flex gap-4 justify-center">
                  {hasDemoAvailable && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setMode('demonstration');
                        startDemonstration();
                      }}
                      className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 
                               text-white px-8 py-4 rounded-xl font-bold text-xl shadow-2xl flex items-center gap-3"
                    >
                      <span className="text-3xl">🎬</span>
                      <span>Ver Demonstração (CPU joga)</span>
                    </motion.button>
                  )}
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setMode('practice')}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 
                             text-white px-8 py-4 rounded-xl font-bold text-xl shadow-2xl flex items-center gap-3"
                  >
                    <span className="text-3xl">🎮</span>
                    <span>Ir Direto para Prática</span>
                  </motion.button>
                </div>

                {/* Dica */}
                <div className="mt-8 text-center text-white/60 text-lg">
                  <p>💡 Recomendamos ver a demonstração primeiro para entender a técnica</p>
                </div>
              </motion.div>
            )}

            {/* TELA DE DEMONSTRAÇÃO */}
            {mode === 'demonstration' && (
              <motion.div
                key="demo"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center gap-6"
              >
                {/* Narração Atual */}
                {demonstrationState.currentNarration && (
                  <motion.div
                    key={demonstrationState.currentNarration}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 max-w-3xl"
                  >
                    <div className="text-xl text-white leading-relaxed">
                      {demonstrationState.currentNarration}
                    </div>
                  </motion.div>
                )}

                {/* Board de Demonstração */}
                {gameState && isInitialized && (
                  <div className="bg-gray-900/50 rounded-xl p-6">
                    <div className="text-white/80 mb-4 text-center">
                      <span className="text-2xl">🎬</span>
                      <span className="ml-2 text-lg font-bold">CPU jogando...</span>
                    </div>
                    
                    <div className="flex gap-4">
                      {/* Hold */}
                      <HeldPiece heldPiece={gameState.heldPiece} />

                      {/* Board */}
                      <TetrisBoard
                        board={gameState.board}
                        currentPiece={gameState.currentPiece}
                        dropPreview={gameState.dropPreview}
                        clearingLines={gameState.clearingLines || []}
                      />

                      {/* Next + Score */}
                      <div className="flex flex-col gap-4">
                        <NextPieces nextPieces={gameState.nextPieces || []} />
                        <Scoreboard score={gameState.score} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Controles de Demonstração */}
                <div className="flex items-center gap-4">
                  {demonstrationState.isPlaying ? (
                    demonstrationState.isPaused ? (
                      <button
                        onClick={resumeDemonstration}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold text-lg"
                      >
                        ▶️ Continuar
                      </button>
                    ) : (
                      <button
                        onClick={pauseDemonstration}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-bold text-lg"
                      >
                        ⏸️ Pausar
                      </button>
                    )
                  ) : null}

                  <button
                    onClick={() => {
                      stopDemonstration();
                      setMode('practice');
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold text-lg"
                  >
                    ⏭️ Ir para Prática
                  </button>

                  {/* Progress Bar */}
                  <div className="flex-1 bg-gray-700 rounded-full h-3 overflow-hidden">
                    <motion.div
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${demonstrationState.progress * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <div className="text-white/80 font-mono">
                    {Math.round(demonstrationState.progress * 100)}%
                  </div>
                </div>
              </motion.div>
            )}

            {/* TELA DE PRÁTICA */}
            {mode === 'practice' && (
              <motion.div
                key="practice"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center"
              >
                {/* Objective */}
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 mb-6 max-w-3xl mx-auto">
                  <div className="text-sm uppercase text-white/80 mb-2">🎯 Objetivo</div>
                  <p className="text-2xl font-bold text-white">
                    {lesson.practice.objective}
                  </p>
                </div>

                {/* Practice Area */}
                <div className="bg-gray-900/50 rounded-xl p-6 max-w-4xl mx-auto">
                  {/* Progress */}
                  {practiceState.progress > 0 && (
                    <div className="mb-4">
                      <div className="flex justify-between text-white/80 mb-2">
                        <span>Progresso</span>
                        <span className="font-bold">{practiceState.progress}/{lesson.practice.targetCount || lesson.practice.targetLines || 100}</span>
                      </div>
                      <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(practiceState.progress / (lesson.practice.targetCount || lesson.practice.targetLines || 100)) * 100}%` }}
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                        />
                      </div>
                    </div>
                  )}

                  {/* Feedback */}
                  {practiceState.feedback && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-blue-600/20 border border-blue-500/50 rounded-lg p-4 mb-4"
                    >
                      <p className="text-white text-lg">{practiceState.feedback}</p>
                    </motion.div>
                  )}

                  {/* Game Board - REAL */}
                  {isInitialized && gameState ? (
                    <div className="flex items-start justify-center gap-4">
                      {/* Left Panel - Hold */}
                      <div className="flex flex-col gap-4">
                        <HeldPiece heldPiece={gameState.heldPiece} />
                      </div>

                      {/* Center - Board */}
                      <div>
                        <TetrisBoard
                          board={gameState.board}
                          currentPiece={gameState.currentPiece}
                          dropPreview={gameState.dropPreview}
                          clearingLines={gameState.clearingLines || []}
                        />
                      </div>

                      {/* Right Panel - Next + Score */}
                      <div className="flex flex-col gap-4">
                        <NextPieces nextPieces={gameState.nextPieces || []} />
                        <Scoreboard score={gameState.score} />
                      </div>
                    </div>
                  ) : (
                    <div className="h-96 bg-black/30 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <span className="text-6xl mb-4 block animate-pulse">🎮</span>
                        <p className="text-white/60 text-lg">
                          Inicializando jogo de prática...
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Hint */}
                  <AnimatePresence>
                    {showHint && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mt-4 bg-yellow-600/20 border border-yellow-500/50 rounded-lg p-4"
                      >
                        <p className="text-yellow-200">💡 {showHint}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Controls hint */}
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-white/60 text-sm">
                    ⌨️ Use as setas para mover | ↑ rotacionar | ESPAÇO hard drop | C hold
                  </div>
                  
                  <button
                    onClick={() => actions?.restart()}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    🔄 Resetar
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Completion */}
      <AnimatePresence>
        {practiceState.complete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl p-12 text-center max-w-2xl"
            >
              <div className="text-8xl mb-6">🏆</div>
              <h2 className="text-4xl font-bold text-white mb-4">
                Lesson Completa!
              </h2>
              <p className="text-2xl text-white/90 mb-8">
                {lesson.title}
              </p>

              {/* Rewards */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-3xl mb-2">🐟</div>
                  <div className="text-2xl font-bold text-white">+{lesson.rewards.fishCoins}</div>
                  <div className="text-white/70 text-sm">Peixes</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-3xl mb-2">⭐</div>
                  <div className="text-2xl font-bold text-white">+{lesson.rewards.xp}</div>
                  <div className="text-white/70 text-sm">XP</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-3xl mb-2">🏅</div>
                  <div className="text-lg font-bold text-white">Badge</div>
                  <div className="text-white/70 text-sm">{lesson.rewards.badge}</div>
                </div>
              </div>

              <button
                onClick={onExit}
                className="bg-white text-green-600 font-bold px-8 py-4 rounded-lg text-xl hover:bg-white/90 transition-colors"
              >
                Continuar →
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default LessonPlayer;
