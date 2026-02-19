import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LessonPlayer from './LessonPlayer';

/**
 * TutorialHub - Menu de lessons do tutorial educativo
 * Mostra progresso, badges e permite selecionar lessons
 */
function TutorialHub({ tutorialService, onClose, onLessonComplete }) {
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [progress, setProgress] = useState(tutorialService.getProgress());
  const [selectedModule, setSelectedModule] = useState('fundamentals');

  const lessons = tutorialService.lessons;
  const availableLessons = tutorialService.getAvailableLessons();

  const modules = {
    fundamentals: {
      name: '🎮 Fundamentos',
      description: 'Aprenda o básico do Tetris',
      color: 'from-blue-600 to-cyan-600'
    },
    intermediate: {
      name: '🌀 Intermediário',
      description: 'T-spins, combos e técnicas',
      color: 'from-purple-600 to-pink-600'
    },
    advanced: {
      name: '💎 Avançado',
      description: 'Setups complexos e estratégias',
      color: 'from-orange-600 to-red-600'
    },
    pro: {
      name: '🏆 Profissional',
      description: 'Técnicas de jogadores PRO',
      color: 'from-yellow-600 to-amber-600'
    }
  };

  const moduleLessons = lessons.filter(l => l.module === selectedModule);
  
  const getModuleProgress = (moduleName) => {
    const moduleLessonsIds = lessons.filter(l => l.module === moduleName).map(l => l.id);
    const completed = moduleLessonsIds.filter(id => progress.completedLessons.includes(id)).length;
    return { completed, total: moduleLessonsIds.length };
  };

  const handleLessonComplete = (lessonId, performance) => {
    const result = tutorialService.completeLesson(lessonId, performance);
    setProgress(tutorialService.getProgress());
    setSelectedLesson(null);
    
    if (onLessonComplete) {
      onLessonComplete(result);
    }
  };

  const isLessonUnlocked = (lessonId) => {
    return progress.unlockedLessons.includes(lessonId);
  };

  const isLessonCompleted = (lessonId) => {
    return progress.completedLessons.includes(lessonId);
  };

  if (selectedLesson) {
    return (
      <LessonPlayer
        lesson={selectedLesson}
        onComplete={handleLessonComplete}
        onExit={() => setSelectedLesson(null)}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/95 backdrop-blur-sm z-40 overflow-y-auto"
    >
      <div className="min-h-screen p-6">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                📚 Tutorial Educativo
              </h1>
              <p className="text-white/70 text-lg">
                Aprenda Tetris do zero ao PRO
              </p>
            </div>
            
            <button
              onClick={onClose}
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg transition-colors"
            >
              ✕ Fechar
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl p-4">
              <div className="text-3xl mb-2">🏆</div>
              <div className="text-2xl font-bold text-white">
                {progress.completedLessons.length}/{lessons.length}
              </div>
              <div className="text-white/80 text-sm">Lessons Completas</div>
            </div>
            
            <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl p-4">
              <div className="text-3xl mb-2">⭐</div>
              <div className="text-2xl font-bold text-white">
                {progress.totalXP}
              </div>
              <div className="text-white/80 text-sm">XP Total</div>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-600 to-orange-600 rounded-xl p-4">
              <div className="text-3xl mb-2">🏅</div>
              <div className="text-2xl font-bold text-white">
                {progress.badges.length}
              </div>
              <div className="text-white/80 text-sm">Badges Conquistadas</div>
            </div>
            
            <div className="bg-gradient-to-br from-pink-600 to-rose-600 rounded-xl p-4">
              <div className="text-3xl mb-2">🔓</div>
              <div className="text-2xl font-bold text-white">
                {progress.unlockedLessons.length}
              </div>
              <div className="text-white/80 text-sm">Lessons Disponíveis</div>
            </div>
          </div>
        </div>

        {/* Module Tabs */}
        <div className="max-w-7xl mx-auto mb-6">
          <div className="flex gap-4 overflow-x-auto pb-2">
            {Object.entries(modules).map(([key, module]) => {
              const moduleProgress = getModuleProgress(key);
              const isActive = selectedModule === key;
              
              return (
                <motion.button
                  key={key}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedModule(key)}
                  className={`
                    flex-shrink-0 rounded-xl p-4 min-w-[200px]
                    transition-all duration-200
                    ${isActive 
                      ? `bg-gradient-to-r ${module.color} shadow-lg` 
                      : 'bg-white/5 hover:bg-white/10'
                    }
                  `}
                >
                  <div className="text-left">
                    <div className="text-xl font-bold text-white mb-1">
                      {module.name}
                    </div>
                    <div className="text-white/70 text-sm mb-2">
                      {module.description}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-white transition-all duration-300"
                          style={{ width: `${(moduleProgress.completed / moduleProgress.total) * 100}%` }}
                        />
                      </div>
                      <span className="text-white/80 text-sm font-bold">
                        {moduleProgress.completed}/{moduleProgress.total}
                      </span>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Lessons Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {moduleLessons.map((lesson, index) => {
              const unlocked = isLessonUnlocked(lesson.id);
              const completed = isLessonCompleted(lesson.id);
              
              return (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`
                    rounded-xl p-6 transition-all duration-200
                    ${unlocked 
                      ? 'bg-white/10 hover:bg-white/15 cursor-pointer' 
                      : 'bg-white/5 cursor-not-allowed opacity-50'
                    }
                    ${completed ? 'border-2 border-green-500' : 'border border-white/10'}
                  `}
                  onClick={() => unlocked && setSelectedLesson(lesson)}
                >
                  {/* Status Badge */}
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-3xl">{lesson.module === 'fundamentals' ? '🎮' : 
                                                  lesson.module === 'intermediate' ? '🌀' :
                                                  lesson.module === 'advanced' ? '💎' : '🏆'}</span>
                    <div>
                      {completed && (
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                          ✓ Completo
                        </span>
                      )}
                      {!unlocked && (
                        <span className="bg-gray-600 text-white text-xs px-2 py-1 rounded-full">
                          🔒 Bloqueado
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-white mb-2">
                    {lesson.title}
                  </h3>
                  <p className="text-white/70 text-sm mb-4">
                    {lesson.description}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-white/60 text-sm">
                    <span className="flex items-center gap-1">
                      ⏱️ {lesson.estimatedTime}
                    </span>
                    <span className="flex items-center gap-1">
                      {lesson.difficulty === 'beginner' && '🟢 Iniciante'}
                      {lesson.difficulty === 'intermediate' && '🟡 Intermediário'}
                      {lesson.difficulty === 'advanced' && '🔴 Avançado'}
                      {lesson.difficulty === 'pro' && '💎 PRO'}
                    </span>
                  </div>

                  {/* Rewards Preview */}
                  <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-3">
                    <span className="text-white/80 text-sm">
                      🐟 {lesson.rewards.fishCoins}
                    </span>
                    <span className="text-white/80 text-sm">
                      ⭐ {lesson.rewards.xp} XP
                    </span>
                    <span className="text-white/80 text-sm">
                      🏅 Badge
                    </span>
                  </div>

                  {/* Action */}
                  {unlocked && !completed && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="mt-4 w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-2 px-4 rounded-lg"
                      onClick={() => setSelectedLesson(lesson)}
                    >
                      🎮 Iniciar Lesson
                    </motion.button>
                  )}

                  {completed && (
                    <button
                      className="mt-4 w-full bg-white/10 text-white/70 font-bold py-2 px-4 rounded-lg"
                      onClick={() => setSelectedLesson(lesson)}
                    >
                      🔄 Refazer Lesson
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Badges Section */}
        {progress.badges.length > 0 && (
          <div className="max-w-7xl mx-auto mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">
              🏅 Suas Badges
            </h2>
            <div className="grid grid-cols-6 gap-4">
              {progress.badges.map((badge, index) => (
                <motion.div
                  key={badge}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gradient-to-br from-yellow-600 to-orange-600 rounded-lg p-4 text-center"
                >
                  <div className="text-3xl mb-2">🏅</div>
                  <div className="text-white text-xs font-bold">
                    {badge.replace(/_/g, ' ').toUpperCase()}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default TutorialHub;
