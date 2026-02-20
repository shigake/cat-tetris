import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LessonPlayer from './LessonPlayer';

function TutorialHub({ tutorialService, onClose, onLessonComplete }) {
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [progress, setProgress] = useState(tutorialService.getProgress());
  const [selectedModule, setSelectedModule] = useState('fundamentals');

  const lessons = tutorialService.lessons;

  const modules = [
    { key: 'fundamentals',  icon: '🎮', name: 'Fundamentos',    desc: 'O básico do Tetris' },
    { key: 'intermediate',  icon: '🌀', name: 'Intermediário',   desc: 'T-spins e combos' },
    { key: 'advanced',      icon: '💎', name: 'Avançado',        desc: 'Setups e estratégias' },
    { key: 'pro',           icon: '🏆', name: 'Profissional',    desc: 'Técnicas PRO' },
  ];

  const moduleLessons = lessons.filter(l => l.module === selectedModule);

  const getModuleProgress = (key) => {
    const ids = lessons.filter(l => l.module === key).map(l => l.id);
    const done = ids.filter(id => progress.completedLessons.includes(id)).length;
    return { done, total: ids.length };
  };

  const handleLessonComplete = (lessonId, performance) => {
    const result = tutorialService.completeLesson(lessonId, performance);
    setProgress(tutorialService.getProgress());
    setSelectedLesson(null);
    if (onLessonComplete) onLessonComplete(result);
  };

  const isUnlocked   = (id) => progress.unlockedLessons.includes(id);
  const isCompleted   = (id) => progress.completedLessons.includes(id);

  // ── Lesson Player ──
  if (selectedLesson) {
    return (
      <LessonPlayer
        lesson={selectedLesson}
        onComplete={handleLessonComplete}
        onExit={() => setSelectedLesson(null)}
      />
    );
  }

  const completedCount = progress.completedLessons.length;
  const totalCount = lessons.length;
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 z-40 overflow-y-auto"
    >
      <div className="min-h-screen max-w-lg mx-auto px-4 py-6 flex flex-col">

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-white">📚 Tutorial</h1>
            <p className="text-white/40 text-sm mt-0.5">Aprenda do zero ao PRO</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white/70 bg-white/[0.06] hover:bg-white/[0.1] rounded-lg px-3 py-1.5 text-sm transition-all"
          >
            ✕ Voltar
          </button>
        </div>

        {/* ── Progress bar ── */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-white/40 mb-1.5">
            <span>Progresso geral</span>
            <span>{completedCount}/{totalCount} ({pct}%)</span>
          </div>
          <div className="h-2 bg-white/[0.08] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* ── Module Tabs ── */}
        <div className="flex gap-1.5 mb-5 overflow-x-auto pb-1 -mx-1 px-1">
          {modules.map((mod) => {
            const mp = getModuleProgress(mod.key);
            const active = selectedModule === mod.key;
            return (
              <button
                key={mod.key}
                onClick={() => setSelectedModule(mod.key)}
                className={`flex-shrink-0 rounded-lg px-3 py-2 text-left transition-all duration-150 ${
                  active
                    ? 'bg-white/[0.12] border border-white/[0.15]'
                    : 'bg-white/[0.04] border border-transparent hover:bg-white/[0.07]'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-base">{mod.icon}</span>
                  <span className={`text-xs font-semibold ${active ? 'text-white' : 'text-white/50'}`}>
                    {mod.name}
                  </span>
                  <span className={`text-[10px] ml-1 ${
                    mp.done === mp.total && mp.total > 0 ? 'text-emerald-400' : 'text-white/30'
                  }`}>
                    {mp.done}/{mp.total}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* ── Lessons List ── */}
        <div className="flex-1 space-y-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedModule}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-2"
            >
              {moduleLessons.map((lesson, idx) => {
                const unlocked = isUnlocked(lesson.id);
                const completed = isCompleted(lesson.id);

                return (
                  <motion.button
                    key={lesson.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    disabled={!unlocked}
                    onClick={() => unlocked && setSelectedLesson(lesson)}
                    className={`w-full text-left rounded-xl p-4 transition-all duration-150 flex items-center gap-3 ${
                      unlocked
                        ? 'bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.06] hover:border-white/[0.12] active:scale-[0.99]'
                        : 'bg-white/[0.02] border border-white/[0.03] opacity-40 cursor-not-allowed'
                    } ${completed ? 'border-emerald-500/30' : ''}`}
                  >
                    {/* Left: status icon */}
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm flex-shrink-0 ${
                      completed
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : unlocked
                          ? 'bg-white/[0.08] text-white/60'
                          : 'bg-white/[0.04] text-white/20'
                    }`}>
                      {completed ? '✓' : unlocked ? (idx + 1) : '🔒'}
                    </div>

                    {/* Center: info */}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-white truncate">{lesson.title}</div>
                      <div className="text-xs text-white/35 mt-0.5 truncate">{lesson.description}</div>
                      <div className="flex items-center gap-3 mt-1.5 text-[10px] text-white/25">
                        <span>⏱ {lesson.estimatedTime}</span>
                        <span>🐟 {lesson.rewards?.fishCoins || 0}</span>
                        <span>⭐ {lesson.rewards?.xp || 0} XP</span>
                      </div>
                    </div>

                    {/* Right: difficulty dot + arrow */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`w-2 h-2 rounded-full ${
                        lesson.difficulty === 'beginner'      ? 'bg-green-400' :
                        lesson.difficulty === 'intermediate'  ? 'bg-yellow-400' :
                        lesson.difficulty === 'advanced'      ? 'bg-red-400' :
                                                                'bg-purple-400'
                      }`} />
                      {unlocked && (
                        <svg className="w-4 h-4 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                    </div>
                  </motion.button>
                );
              })}

              {moduleLessons.length === 0 && (
                <div className="text-center py-12 text-white/20 text-sm">
                  Nenhuma lição neste módulo
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Badges (collapsed, only if any) ── */}
        {progress.badges.length > 0 && (
          <div className="mt-6 pt-4 border-t border-white/[0.06]">
            <div className="text-xs text-white/30 mb-2">Badges conquistadas</div>
            <div className="flex flex-wrap gap-2">
              {progress.badges.map((badge) => (
                <span
                  key={badge}
                  className="bg-amber-500/10 text-amber-300/70 text-[10px] px-2 py-1 rounded-md font-medium"
                >
                  🏅 {badge.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default TutorialHub;
