import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePracticeGame } from '../hooks/usePracticeGame';
import { useKeyboardInput } from '../hooks/useKeyboardInput';
import { DemonstrationPlayer } from '../core/services/DemonstrationPlayer';
import { getDemonstration, hasDemonstration } from '../core/services/DemonstrationLibrary';
import CelebrationParticles from './CelebrationParticles';
import IntroductionScreen from './lesson/IntroductionScreen';
import DemonstrationScreen from './lesson/DemonstrationScreen';
import PracticeScreen from './lesson/PracticeScreen';

/**
 * LessonPlayer - Coordenador principal das lições
 * Gerencia transição entre: introdução → demonstração → prática
 */
function LessonPlayer({ lesson, onComplete, onExit }) {
  // Estados
  const [mode, setMode] = useState('introduction');
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
  const [showCelebration, setShowCelebration] = useState(false);
  
  const demonstrationPlayerRef = useRef(null);
  const hasDemoAvailable = hasDemonstration(lesson.id);

  // Hooks
  const { gameState, actions, isInitialized, getValidationState } = usePracticeGame(
    mode === 'practice' ? lesson : null
  );
  useKeyboardInput(actions, gameState, mode === 'practice' && isInitialized);

  // ===== DEMONSTRAÇÃO =====
  const startDemonstration = useCallback(() => {
    if (!hasDemoAvailable || !gameState) return;

    const demo = getDemonstration(lesson.id);
    if (!demo) return;

    if (!demonstrationPlayerRef.current) {
      demonstrationPlayerRef.current = new DemonstrationPlayer(actions);
      
      demonstrationPlayerRef.current.onStep((step) => {
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

  // ===== PRÁTICA =====
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
      setShowCelebration(true);
      setTimeout(() => {
        onComplete(lesson.id, { attempts: practiceState.attempts + 1 });
      }, 2000);
    }
  }, [mode, isInitialized, gameState, lesson, getValidationState, practiceState.complete, onComplete]);

  // Sistema de hints
  useEffect(() => {
    if (mode !== 'practice') return;
    
    if (lesson.practice.hints && practiceState.attempts > 2) {
      const hints = lesson.practice.hints;
      const timer = setTimeout(() => {
        const randomHint = hints[Math.floor(Math.random() * hints.length)];
        setShowHint(randomHint);
        
        setTimeout(() => setShowHint(null), 8000);
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, [mode, lesson, practiceState]);

  // ===== HANDLERS =====
  const handleStartDemo = () => {
    setMode('demonstration');
    startDemonstration();
  };

  const handleStartPractice = () => {
    setMode('practice');
  };

  const handleSkipDemo = () => {
    stopDemonstration();
    setMode('practice');
  };

  // ===== RENDER =====
  const getModeIcon = () => {
    switch (mode) {
      case 'introduction': return '📖';
      case 'demonstration': return '🎬';
      case 'practice': return '🎮';
      default: return '📖';
    }
  };

  const getModeLabel = () => {
    switch (mode) {
      case 'introduction': return 'Introdução';
      case 'demonstration': return 'Demonstração';
      case 'practice': return 'Prática';
      default: return 'Introdução';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <span className="text-4xl">
              {lesson.module === 'fundamentals' ? '🎮' : 
               lesson.module === 'intermediate' ? '🌀' :
               lesson.module === 'advanced' ? '💎' : '🏆'}
            </span>
            <div>
              <h2 className="text-2xl font-bold text-white">{lesson.title}</h2>
              <p className="text-white/70">{lesson.description}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right text-white/80">
              <div className="text-sm uppercase">Modo</div>
              <div className="text-lg font-bold">
                {getModeIcon()} {getModeLabel()}
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
            {mode === 'introduction' && (
              <IntroductionScreen
                lesson={lesson}
                hasDemoAvailable={hasDemoAvailable}
                onStartDemo={handleStartDemo}
                onStartPractice={handleStartPractice}
              />
            )}

            {mode === 'demonstration' && (
              <DemonstrationScreen
                gameState={gameState}
                isInitialized={isInitialized}
                demonstrationState={demonstrationState}
                onPause={pauseDemonstration}
                onResume={resumeDemonstration}
                onSkip={handleSkipDemo}
              />
            )}

            {mode === 'practice' && (
              <PracticeScreen
                lesson={lesson}
                gameState={gameState}
                isInitialized={isInitialized}
                practiceState={practiceState}
                showHint={showHint}
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
