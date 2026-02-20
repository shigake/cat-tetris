export const LESSON_MODULES = {
  FUNDAMENTALS: 'fundamentals',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
  PRO: 'pro'
};

export class TutorialService {
  constructor(gameRepository) {
    this.gameRepository = gameRepository;
    this.lessons = this._buildLessons();
    this.progress = this._loadProgress();
  }

  _buildLessons() {
    return [

      {
        id: 1,
        module: LESSON_MODULES.FUNDAMENTALS,
        title: 'Movimentação',
        description: 'Mover, rotacionar e dropar peças',
        difficulty: 'beginner',
        estimatedTime: '2 min',
        intro: [
          '⬅️ ➡️  Setas movem a peça para os lados',
          '⬆️  Seta para cima rotaciona a peça',
          '⬇️  Seta para baixo = soft drop (desce rápido)',
          '␣  Espaço = hard drop (cai instantaneamente)',
          'A sombra mostra onde a peça vai pousar',
        ],
        practice: {
          objective: 'Limpe 3 linhas usando os controles',
          validate: (s) => {
            const lines = s.linesCleared || 0;
            return {
              complete: lines >= 3,
              progress: Math.min(1, lines / 3),
              feedback: lines >= 3 ? '🎉 Ótimo! Você dominou os controles!' : `${lines}/3 linhas`
            };
          },
        },
        rewards: { fishCoins: 100, xp: 50, badge: 'first_move', unlocks: [2] }
      },
      {
        id: 2,
        module: LESSON_MODULES.FUNDAMENTALS,
        title: 'Hold Piece',
        description: 'Segure uma peça para usar depois',
        difficulty: 'beginner',
        estimatedTime: '2 min',
        intro: [
          'Aperte C ou Shift para guardar a peça atual',
          'A peça guardada aparece no canto esquerdo',
          'Você pode trocar 1 vez por turno',
          'Dica: guarde peças valiosas como I e T',
          'Isso ajuda quando a peça atual não encaixa bem',
        ],
        practice: {
          objective: 'Use o hold e limpe 3 linhas',
          validate: (s) => {
            const used = s.hasUsedHold;
            const lines = s.linesCleared || 0;
            if (!used) return { complete: false, progress: 0, feedback: 'Aperte C para segurar a peça!' };
            return {
              complete: lines >= 3,
              progress: Math.min(1, lines / 3),
              feedback: lines >= 3 ? '🎉 Hold dominado!' : `✅ Hold usado! ${lines}/3 linhas`
            };
          },
        },
        rewards: { fishCoins: 100, xp: 50, badge: 'hold_learner', unlocks: [3] }
      },
      {
        id: 3,
        module: LESSON_MODULES.FUNDAMENTALS,
        title: 'Planejamento',
        description: 'Use o painel Next para planejar jogadas',
        difficulty: 'beginner',
        estimatedTime: '3 min',
        intro: [
          'O painel NEXT mostra as próximas peças',
          'Olhe as próximas 2-3 peças antes de agir',
          'Se vem uma peça I, deixe espaço vertical',
          'Pensar à frente = menos buracos = mais linhas',
          'Tente limpar muitas linhas sem criar buracos!',
        ],
        practice: {
          objective: 'Limpe 8 linhas (planeje bem!)',
          validate: (s) => {
            const lines = s.linesCleared || 0;
            return {
              complete: lines >= 8,
              progress: Math.min(1, lines / 8),
              feedback: lines >= 8 ? '🧠 Excelente planejamento!' : `${lines}/8 linhas`
            };
          },
        },
        rewards: { fishCoins: 150, xp: 75, badge: 'planner', unlocks: [4] }
      },

      {
        id: 4,
        module: LESSON_MODULES.INTERMEDIATE,
        title: 'Combos',
        description: 'Limpe linhas consecutivas para bônus',
        difficulty: 'intermediate',
        estimatedTime: '4 min',
        intro: [
          'Combo = limpar linhas em peças consecutivas',
          'Cada combo seguido dá +50 pontos de bônus',
          'Combo 5x = +250 pontos extras!',
          'Dica: empilhe baixo e limpe 1 linha por vez',
          'Foque em manter o ritmo, sem pausas',
        ],
        practice: {
          objective: 'Consiga um combo de 3 ou mais',
          validate: (s) => {
            const combo = s.currentCombo || 0;
            const maxCombo = s.maxCombo || combo;
            const best = Math.max(combo, maxCombo);
            return {
              complete: best >= 3,
              progress: Math.min(1, best / 3),
              feedback: best >= 3 ? '🔥 Combo master!' : `Melhor combo: ${best}x (precisa 3)`
            };
          },
        },
        rewards: { fishCoins: 200, xp: 100, badge: 'combo_starter', unlocks: [5] }
      },
      {
        id: 5,
        module: LESSON_MODULES.INTERMEDIATE,
        title: 'Tetris (4 linhas)',
        description: 'Limpe 4 linhas de uma vez para 800pts',
        difficulty: 'intermediate',
        estimatedTime: '5 min',
        intro: [
          'Tetris = limpar 4 linhas ao mesmo tempo',
          'Vale 800 pontos — o clear mais valioso!',
          'Deixe uma coluna vazia (geralmente a da direita)',
          'Preencha as outras 9 colunas em 4 linhas',
          'Use a peça I (barra) para completar o Tetris',
        ],
        practice: {
          objective: 'Alcance 2.000 pontos',
          validate: (s) => {
            const score = s.score || 0;
            return {
              complete: score >= 2000,
              progress: Math.min(1, score / 2000),
              feedback: score >= 2000 ? '💎 Pontuação alta!' : `${score.toLocaleString()}/2.000 pts`
            };
          },
        },
        rewards: { fishCoins: 250, xp: 125, badge: 'tetris_scorer', unlocks: [6] }
      },

      {
        id: 6,
        module: LESSON_MODULES.ADVANCED,
        title: 'T-Spin',
        description: 'Rotacione o T no último momento para bônus',
        difficulty: 'advanced',
        estimatedTime: '6 min',
        intro: [
          'T-Spin = rotacionar a peça T em espaço apertado',
          'Vale pontos extras e ativa back-to-back!',
          'Crie um buraco em forma de "T" na pilha',
          'Deslize a peça T para dentro e rotacione',
          'É difícil, mas dá muitos pontos!',
        ],
        practice: {
          objective: 'Faça pelo menos 1 T-Spin e 4.000 pontos',
          validate: (s) => {
            const tSpins = s.tSpins || 0;
            const score = s.score || 0;
            if (tSpins === 0) {
              return {
                complete: false,
                progress: Math.min(0.5, score / 8000),
                feedback: 'Tente rotacionar o T em espaço apertado!'
              };
            }
            return {
              complete: score >= 4000,
              progress: Math.min(1, score / 4000),
              feedback: score >= 4000 ? `🌀 T-Spin pro! (${tSpins} T-Spins)` : `✅ T-Spin! ${score.toLocaleString()}/4.000 pts`
            };
          },
        },
        rewards: { fishCoins: 400, xp: 250, badge: 'tspin_learner', unlocks: [7] }
      },
      {
        id: 7,
        module: LESSON_MODULES.ADVANCED,
        title: 'Back-to-Back',
        description: 'Tetris ou T-Spin seguidos dão 50% bônus',
        difficulty: 'advanced',
        estimatedTime: '6 min',
        intro: [
          'Back-to-Back = dois clears difíceis seguidos',
          'Conta como: Tetris (4 linhas) ou T-Spin',
          'Cada B2B seguido dá +50% de pontos!',
          'Limpar 1-3 linhas normais quebra a cadeia',
          'Combine T-Spins e Tetris para pontuação máxima',
        ],
        practice: {
          objective: 'Alcance 6.000 pontos com back-to-back',
          validate: (s) => {
            const score = s.score || 0;
            const b2b = s.backToBackActive;
            return {
              complete: score >= 6000,
              progress: Math.min(1, score / 6000),
              feedback: score >= 6000
                ? '⚡ Back-to-back dominado!'
                : b2b ? `⚡ B2B ativo! ${score.toLocaleString()}/6.000 pts` : `${score.toLocaleString()}/6.000 pts`
            };
          },
        },
        rewards: { fishCoins: 500, xp: 300, badge: 'b2b_learner', unlocks: [8] }
      },

      {
        id: 8,
        module: LESSON_MODULES.PRO,
        title: 'Desafio Final',
        description: 'Prove que domina o Tetris!',
        difficulty: 'pro',
        estimatedTime: '10 min',
        intro: [
          'Use TUDO que aprendeu até aqui',
          'Movimentação, hold, combos, T-Spins, B2B...',
          'O objetivo é alcançar uma pontuação alta',
          'Não tenha pressa — planeje cada jogada',
          'Boa sorte, mestre! 🏆',
        ],
        practice: {
          objective: 'Alcance 15.000 pontos',
          validate: (s) => {
            const score = s.score || 0;
            return {
              complete: score >= 15000,
              progress: Math.min(1, score / 15000),
              feedback: score >= 15000
                ? '👑 MESTRE DO TETRIS!'
                : `${score.toLocaleString()}/15.000 pts`
            };
          },
        },
        rewards: { fishCoins: 1000, xp: 500, badge: 'tetris_master', unlocks: [] }
      }
    ];
  }

  _loadProgress() {
    const saved = this.gameRepository?.load?.('tutorialProgress');
    return saved || {
      completedLessons: [],
      unlockedLessons: [1],
      badges: [],
      totalXP: 0,
      currentModule: LESSON_MODULES.FUNDAMENTALS
    };
  }

  _saveProgress() {
    this.gameRepository?.save?.('tutorialProgress', this.progress);
  }

  getProgress() { return this.progress; }

  getLessonById(id) {
    return this.lessons.find(l => l.id === id);
  }

  getAvailableLessons() {
    return this.lessons.filter(l => this.progress.unlockedLessons.includes(l.id));
  }

  completeLesson(lessonId, performance) {
    const lesson = this.getLessonById(lessonId);
    if (!lesson) return null;

    if (!this.progress.completedLessons.includes(lessonId)) {
      this.progress.completedLessons.push(lessonId);
    }

    (lesson.rewards.unlocks || []).forEach(id => {
      if (!this.progress.unlockedLessons.includes(id)) {
        this.progress.unlockedLessons.push(id);
      }
    });

    if (lesson.rewards.badge && !this.progress.badges.includes(lesson.rewards.badge)) {
      this.progress.badges.push(lesson.rewards.badge);
    }

    this.progress.totalXP += lesson.rewards.xp || 0;
    this._saveProgress();

    return {
      completed: true,
      lessonId,
      lessonTitle: lesson.title,
      rewards: lesson.rewards,
      nextLesson: lesson.rewards.unlocks?.[0] || null,
      performance
    };
  }

  resetProgress() {
    this.progress = {
      completedLessons: [],
      unlockedLessons: [1],
      badges: [],
      totalXP: 0,
      currentModule: LESSON_MODULES.FUNDAMENTALS
    };
    this._saveProgress();
  }
}

