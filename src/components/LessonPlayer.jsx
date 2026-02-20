import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePracticeGame } from '../hooks/usePracticeGame';
import { useDemoGame } from '../hooks/useDemoGame';
import { useKeyboardInput } from '../hooks/useKeyboardInput';
import CelebrationParticles from './CelebrationParticles';
import IntroductionScreen from './lesson/IntroductionScreen';
import DemoScreen from './lesson/DemoScreen';
import PracticeScreen from './lesson/PracticeScreen';

/**
 * LessonPlayer - Coordena introdução → demo (IA) → prática
 */
function LessonPlayer({ lesson, onComplete, onExit }) {
  const [mode, setMode] = useState('introduction');
  const [practiceState, setPracticeState] = useState({
    progress: 0,
    feedback: '',
    complete: false
  });
  const [showCelebration, setShowCelebration] = useState(false);

  // Demo game (AI plays) — passa lessonId para IA adaptar comportamento
  const {
    gameState: demoGameState,
    isInitialized: demoInitialized,
    demoComplete,
    statusLabel: demoStatusLabel,
    getDropPreview: getDemoPreview
  } = useDemoGame(mode === 'demo', lesson?.id);

  const demoDropPreview = useMemo(() => {
    if (mode !== 'demo' || !demoInitialized) return null;
    return getDemoPreview?.() || null;
  }, [mode, demoInitialized, getDemoPreview, demoGameState]);

  // Practice game (player plays)
  const { gameState, actions, isInitialized, getValidationState } = usePracticeGame(
    mode === 'practice' ? lesson : null
  );
  useKeyboardInput(actions, gameState, mode === 'practice' && isInitialized);

  // Ghost / drop preview for practice
  const dropPreview = useMemo(() => {
    if (mode !== 'practice' || !isInitialized) return null;
    return actions.getDropPreview?.() || null;
  }, [mode, isInitialized, actions, gameState]);

  // ===== VALIDAÇÃO DA PRÁTICA =====
  useEffect(() => {
    if (mode !== 'practice' || !isInitialized || !gameState) return;

    const validationState = getValidationState();
    if (!validationState || !lesson.practice?.validate) return;

    const result = lesson.practice.validate(validationState);

    setPracticeState(prev => ({
      ...prev,
      progress: result.progress || 0,
      feedback: result.feedback || '',
      complete: result.complete || false
    }));

    if (result.complete && !practiceState.complete) {
      setShowCelebration(true);
      setTimeout(() => {
        onComplete(lesson.id, { score: validationState.score });
      }, 2000);
    }
  }, [mode, isInitialized, gameState, lesson, getValidationState, practiceState.complete, onComplete]);

  const handleStartDemo = useCallback(() => {
    setMode('demo');
  }, []);

  const handleStartPractice = useCallback(() => {
    setMode('practice');
    setPracticeState({ progress: 0, feedback: '', complete: false });
  }, []);

  const handleRestart = useCallback(() => {
    actions.restart?.();
    setPracticeState({ progress: 0, feedback: '', complete: false });
  }, [actions]);

  const modeLabel = mode === 'introduction' ? '📖 Introdução'
    : mode === 'demo' ? '🤖 Demonstração'
    : '🎮 Prática';

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-black/30 border-b border-white/[0.06] px-4 py-2 flex-shrink-0">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <span className="text-2xl">
              {lesson.module === 'fundamentals' ? '🎮' :
               lesson.module === 'intermediate' ? '🌀' :
               lesson.module === 'advanced' ? '💎' : '🏆'}
            </span>
            <div>
              <h2 className="text-lg font-bold text-white">{lesson.title}</h2>
              <p className="text-white/40 text-xs">{lesson.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-white/30 bg-white/[0.06] px-2 py-1 rounded">
              {modeLabel}
            </span>
            <button
              onClick={onExit}
              className="text-white/40 hover:text-white/70 bg-white/[0.06] hover:bg-white/[0.1] rounded-lg px-3 py-1.5 text-sm transition-all"
            >
              ✕ Sair
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-3">
        <div className="max-w-4xl w-full mx-auto">
          <AnimatePresence mode="wait">
            {mode === 'introduction' && (
              <IntroductionScreen
                lesson={lesson}
                onStartDemo={handleStartDemo}
                onStartPractice={handleStartPractice}
              />
            )}

            {mode === 'demo' && (
              <DemoScreen
                lesson={lesson}
                gameState={demoGameState}
                isInitialized={demoInitialized}
                demoComplete={demoComplete}
                dropPreview={demoDropPreview}
                statusLabel={demoStatusLabel}
                onSkip={handleStartPractice}
              />
            )}

            {mode === 'practice' && (
              <PracticeScreen
                lesson={lesson}
                gameState={gameState}
                isInitialized={isInitialized}
                practiceState={practiceState}
                onRestart={handleRestart}
                dropPreview={dropPreview}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Celebration */}
      <CelebrationParticles
        show={showCelebration}
        onComplete={() => setShowCelebration(false)}
      />
    </div>
  );
}

export default LessonPlayer;
