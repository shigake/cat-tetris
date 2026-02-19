/**
 * TutorialService - Sistema educativo profissional de Tetris
 * Ensina do básico ao avançado: fundamentos → T-spins → 4-wide → técnicas PRO
 */

export const LESSON_MODULES = {
  FUNDAMENTALS: 'fundamentals',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
  PRO: 'pro'
};

export class TutorialService {
  constructor(gameRepository) {
    this.gameRepository = gameRepository;
    this.lessons = this.initializeLessons();
    this.progress = this.loadProgress();
  }

  initializeLessons() {
    return [
      // ========================================
      // MÓDULO 1: FUNDAMENTOS (5 lessons)
      // ========================================
      {
        id: 1,
        module: LESSON_MODULES.FUNDAMENTALS,
        title: '🎮 Movimentação Básica',
        description: 'Aprenda a mover, rotacionar e posicionar peças',
        difficulty: 'beginner',
        estimatedTime: '2 min',
        
        demonstration: {
          narration: [
            { time: 0, text: '👋 Bem-vindo! Vou te ensinar os controles básicos.' },
            { time: 2000, text: '⬅️ Seta ESQUERDA move a peça para esquerda' },
            { time: 5000, text: '➡️ Seta DIREITA move a peça para direita' },
            { time: 8000, text: '⬆️ Seta CIMA rotaciona a peça' },
            { time: 11000, text: '⬇️ Seta BAIXO desce mais rápido (soft drop)' },
            { time: 14000, text: '🚀 ESPAÇO = Hard Drop (cai instantaneamente)' },
            { time: 17000, text: '💡 A sombra mostra onde a peça vai cair' }
          ],
          moves: [
            { time: 2500, action: 'moveLeft' },
            { time: 3000, action: 'moveLeft' },
            { time: 5500, action: 'moveRight' },
            { time: 6000, action: 'moveRight' },
            { time: 8500, action: 'rotate' },
            { time: 11500, action: 'softDrop' },
            { time: 12000, action: 'softDrop' },
            { time: 12500, action: 'softDrop' },
            { time: 14500, action: 'hardDrop' }
          ]
        },
        
        practice: {
          type: 'guided',
          objective: 'Mova a peça I para a direita e drope na coluna marcada',
          targetColumn: 8,
          pieces: ['I'], // Sequência fixa
          boardSetup: null, // Tabuleiro vazio
          
          validation: (state) => {
            // Verifica se dropou na coluna correta
            if (!state.lastPlacedPiece) return { complete: false };
            const x = state.lastPlacedPiece.position.x;
            return {
              complete: x >= 7 && x <= 9,
              feedback: x < 7 ? 'Muito à esquerda! Tente mais à direita.' : 
                       x > 9 ? 'Muito à direita! Tente um pouco à esquerda.' :
                       '🎉 Perfeito! Você acertou!'
            };
          },
          
          hints: [
            { trigger: 'idle:5000', text: '💡 Dica: Use as setas ← → para mover' },
            { trigger: 'attempt:3', text: '👀 Olhe a sombra da peça! Ela mostra onde vai cair.' }
          ]
        },
        
        rewards: {
          fishCoins: 100,
          xp: 50,
          badge: 'first_move',
          unlocks: [2]
        }
      },

      {
        id: 2,
        module: LESSON_MODULES.FUNDAMENTALS,
        title: '⬇️ Soft Drop vs Hard Drop',
        description: 'Aprenda quando usar cada tipo de drop',
        difficulty: 'beginner',
        estimatedTime: '3 min',
        
        demonstration: {
          narration: [
            { time: 0, text: '📚 Existem 2 tipos de drop no Tetris' },
            { time: 3000, text: '⬇️ SOFT DROP: Desce mais rápido, você controla' },
            { time: 6000, text: '➕ Ganha 1 ponto por célula descida' },
            { time: 9000, text: '🚀 HARD DROP: Cai instantaneamente' },
            { time: 12000, text: '➕ Ganha 2 pontos por célula descida' },
            { time: 15000, text: '⚡ Use hard drop quando souber EXATAMENTE onde quer' },
            { time: 18000, text: '🎯 Use soft drop quando ainda estiver pensando' }
          ],
          moves: [
            { time: 3500, action: 'softDrop' },
            { time: 4000, action: 'softDrop' },
            { time: 4500, action: 'softDrop' },
            { time: 5000, action: 'softDrop' },
            { time: 12500, action: 'hardDrop' }
          ]
        },
        
        practice: {
          type: 'timed',
          objective: 'Faça 5 hard drops corretos o mais rápido possível',
          targetCount: 5,
          pieces: ['I', 'O', 'T', 'L', 'J'],
          
          validation: (state) => {
            const hardDropCount = state.hardDropsUsed || 0;
            return {
              complete: hardDropCount >= 5,
              progress: hardDropCount,
              feedback: `${hardDropCount}/5 hard drops! ${5 - hardDropCount > 0 ? 'Continue!' : '🔥 Você é rápido!'}`
            };
          },
          
          hints: [
            { trigger: 'idle:3000', text: '🚀 Aperte ESPAÇO para hard drop!' },
            { trigger: 'softdrop_used', text: '⚠️ Isso é soft drop! Use ESPAÇO para hard drop.' }
          ]
        },
        
        rewards: {
          fishCoins: 150,
          xp: 75,
          badge: 'speed_dropper',
          unlocks: [3]
        }
      },

      {
        id: 3,
        module: LESSON_MODULES.FUNDAMENTALS,
        title: '💾 Hold Piece',
        description: 'Segure peças para usá-las no momento ideal',
        difficulty: 'beginner',
        estimatedTime: '3 min',
        
        demonstration: {
          narration: [
            { time: 0, text: '💾 HOLD = Guardar a peça atual para usar depois' },
            { time: 3000, text: '⌨️ Aperte C (ou Shift) para segurar' },
            { time: 6000, text: '🔄 Você pode trocar 1x por turno' },
            { time: 9000, text: '🧠 ESTRATÉGIA: Segure peças valiosas (I, T)' },
            { time: 12000, text: '❌ Segure peças ruins quando não souber onde usar' },
            { time: 15000, text: '💡 Hold é ESSENCIAL para jogadores PRO' }
          ],
          moves: [
            { time: 3500, action: 'hold' },
            { time: 7000, action: 'hardDrop' },
            { time: 9500, action: 'hold' }
          ]
        },
        
        practice: {
          type: 'scenario',
          objective: 'Use hold para conseguir a peça I e fazer um Tetris',
          scenario: 'tetris_setup', // Tabuleiro com 3 colunas cheias
          pieces: ['T', 'O', 'L', 'I'],
          
          validation: (state) => {
            const usedHold = state.hasUsedHold;
            const tetrisScored = state.lastLinesClearedCount === 4;
            
            return {
              complete: usedHold && tetrisScored,
              progress: usedHold ? 1 : 0,
              feedback: !usedHold ? '💾 Use C para segurar a peça!' :
                       !tetrisScored ? '🎯 Agora faça o Tetris (4 linhas)!' :
                       '🔥 TETRIS! Você entendeu o hold!'
            };
          },
          
          hints: [
            { trigger: 'idle:5000', text: '💡 Segure as peças ruins até conseguir o I' },
            { trigger: 'wrong_piece', text: '❌ Essa não é a peça certa! Use hold (C)' }
          ]
        },
        
        rewards: {
          fishCoins: 200,
          xp: 100,
          badge: 'hold_master',
          unlocks: [4]
        }
      },

      {
        id: 4,
        module: LESSON_MODULES.FUNDAMENTALS,
        title: '👀 Ler o Next',
        description: 'Planeje suas jogadas olhando as próximas peças',
        difficulty: 'beginner',
        estimatedTime: '4 min',
        
        demonstration: {
          narration: [
            { time: 0, text: '👁️ Jogadores PRO olham 3-5 peças à frente!' },
            { time: 3000, text: '📊 O painel "NEXT" mostra as próximas peças' },
            { time: 6000, text: '🧠 ESTRATÉGIA: Planeje onde colocar ANTES de cair' },
            { time: 9000, text: '💡 Exemplo: Se vem um I, deixe espaço vertical' },
            { time: 12000, text: '🎯 Se vem T, prepare setup para T-spin' },
            { time: 15000, text: '⚡ Quanto mais você prevê, mais rápido fica' }
          ]
        },
        
        practice: {
          type: 'challenge',
          objective: 'Limpe 10 linhas planejando com antecedência',
          pieces: 'random',
          targetLines: 10,
          
          validation: (state) => {
            const lines = state.totalLinesCleared || 0;
            const efficiency = state.movesPerPiece || 0;
            
            return {
              complete: lines >= 10,
              progress: lines,
              feedback: lines >= 10 
                ? `✅ Completo! Eficiência: ${efficiency.toFixed(1)} movimentos/peça`
                : `${lines}/10 linhas. Continue!`
            };
          },
          
          hints: [
            { trigger: 'high_moves', text: '🐢 Muitos movimentos! Olhe o Next antes da peça cair.' },
            { trigger: 'idle:4000', text: '👀 Olhe as próximas 3 peças! O que vem depois?' }
          ]
        },
        
        rewards: {
          fishCoins: 250,
          xp: 125,
          badge: 'forward_thinker',
          unlocks: [5]
        }
      },

      {
        id: 5,
        module: LESSON_MODULES.FUNDAMENTALS,
        title: '🏗️ Empilhamento Limpo',
        description: 'Construa sem buracos e mantenha o topo plano',
        difficulty: 'beginner',
        estimatedTime: '5 min',
        
        demonstration: {
          narration: [
            { time: 0, text: '🏗️ REGRA #1 do Tetris: EVITE BURACOS!' },
            { time: 3000, text: '❌ Buracos = difícil de limpar = Game Over' },
            { time: 6000, text: '✅ Topo plano = mais opções = sobrevivência' },
            { time: 9000, text: '📐 TÉCNICA: Pense em "camadas horizontais"' },
            { time: 12000, text: '🎯 Priorize preencher completamente cada linha' },
            { time: 15000, text: '💡 Às vezes é melhor deixar a peça "feia" mas sem buraco' }
          ]
        },
        
        practice: {
          type: 'challenge',
          objective: 'Empilhe 15 linhas com ZERO buracos',
          pieces: 'random',
          targetLines: 15,
          
          validation: (state) => {
            const holes = this.countHoles(state.board);
            const lines = state.totalLinesCleared || 0;
            
            return {
              complete: lines >= 15 && holes === 0,
              progress: lines,
              feedback: holes > 0 
                ? `⚠️ ${holes} buraco(s) detectado(s)! Tente de novo.`
                : lines >= 15
                ? `🏆 PERFEITO! 15 linhas SEM BURACOS!`
                : `${lines}/15 linhas. ${holes === 0 ? '✅ Sem buracos!' : ''}`
            };
          },
          
          hints: [
            { trigger: 'hole_created', text: '❌ Buraco criado! Pressione R para resetar.' },
            { trigger: 'good_placement', text: '✅ Ótimo! Continue assim.' }
          ]
        },
        
        rewards: {
          fishCoins: 300,
          xp: 150,
          badge: 'clean_stacker',
          unlocks: [6],
          achievement: 'fundamentals_complete'
        }
      },

      // ========================================
      // MÓDULO 2: INTERMEDIÁRIO (6 lessons)
      // ========================================
      {
        id: 6,
        module: LESSON_MODULES.INTERMEDIATE,
        title: '🌀 T-Spin Básico',
        description: 'Aprenda o movimento mais importante do Tetris moderno',
        difficulty: 'intermediate',
        estimatedTime: '8 min',
        
        demonstration: {
          narration: [
            { time: 0, text: '🌀 T-SPIN = Técnica que vale 400-1200 pontos!' },
            { time: 3000, text: '📚 DEFINIÇÃO: Rotacionar o T no último momento' },
            { time: 6000, text: '🔑 REQUISITO: T deve entrar em espaço "apertado"' },
            { time: 9000, text: '🏗️ SETUP: Faça um "buraco em forma de T"' },
            { time: 12000, text: '⏱️ TIMING: Drope e DEPOIS rotacione' },
            { time: 15000, text: '💰 RECOMPENSA: 400 pts + back-to-back bonus' },
            { time: 18000, text: '🎯 Veja a execução:' }
          ],
          setupBoard: [
            // Cria setup de T-spin
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [1,1,1,0,0,0,1,1,1,1], // Setup em L
            [1,1,1,1,0,1,1,1,1,1],
            [1,1,1,1,0,1,1,1,1,1]
          ],
          moves: [
            { time: 19000, action: 'moveRight' },
            { time: 19500, action: 'moveRight' },
            { time: 20000, action: 'moveRight' },
            { time: 20500, action: 'moveRight' },
            { time: 21000, action: 'softDrop' },
            { time: 21200, action: 'softDrop' },
            { time: 21400, action: 'softDrop' },
            { time: 21600, action: 'rotate' }, // T-spin!
            { time: 22000, text: '🔥 T-SPIN! +400 pontos!' }
          ]
        },
        
        practice: {
          type: 'mastery',
          objective: 'Execute 3 T-spins corretos',
          targetCount: 3,
          providedSetups: true, // Fornece setups pré-feitos
          
          validation: (state) => {
            const tspins = state.tspinsExecuted || 0;
            
            return {
              complete: tspins >= 3,
              progress: tspins,
              feedback: tspins >= 3
                ? '🏆 MESTRE DO T-SPIN! Você está PRO!'
                : `${tspins}/3 T-spins executados. ${3 - tspins > 0 ? 'Continue!' : ''}`
            };
          },
          
          hints: [
            { trigger: 'idle:8000', text: '💡 Lembre: Drope PRIMEIRO, rotacione DEPOIS!' },
            { trigger: 'failed_tspin', text: '❌ Não foi T-spin. Tente rotacionar mais tarde.' },
            { trigger: 'success_tspin', text: '🔥 ISSO AÍ! Você conseguiu!' }
          ]
        },
        
        rewards: {
          fishCoins: 500,
          xp: 300,
          badge: 'tspin_apprentice',
          unlocks: [7]
        }
      },

      {
        id: 7,
        module: LESSON_MODULES.INTERMEDIATE,
        title: '🌀 T-Spin Mini',
        description: 'Versão menor do T-spin, útil em situações apertadas',
        difficulty: 'intermediate',
        estimatedTime: '5 min',
        
        demonstration: {
          narration: [
            { time: 0, text: '🌀 T-SPIN MINI = Versão simplificada (200 pts)' },
            { time: 3000, text: '📏 DIFERENÇA: Limpa apenas 1 linha' },
            { time: 6000, text: '✅ VANTAGEM: Setup mais fácil' },
            { time: 9000, text: '🎯 Use quando não conseguir setup completo' }
          ]
        },
        
        practice: {
          type: 'mastery',
          objective: 'Execute 5 T-spin minis',
          targetCount: 5,
          
          validation: (state) => {
            const minis = state.tspinMinisExecuted || 0;
            return {
              complete: minis >= 5,
              progress: minis
            };
          }
        },
        
        rewards: {
          fishCoins: 300,
          xp: 150,
          badge: 'tspin_mini_master',
          unlocks: [8]
        }
      },

      {
        id: 8,
        module: LESSON_MODULES.INTERMEDIATE,
        title: '🔥 Combos',
        description: 'Limpe linhas consecutivamente para multiplicar pontos',
        difficulty: 'intermediate',
        estimatedTime: '6 min',
        
        demonstration: {
          narration: [
            { time: 0, text: '🔥 COMBO = Limpar linhas seguidas SEM PARAR' },
            { time: 3000, text: '📊 BÔNUS: +50 pts por combo level' },
            { time: 6000, text: '💡 Combo 10x = +500 pontos EXTRA!' },
            { time: 9000, text: '🎯 ESTRATÉGIA: Prepare pilhas baixas' }
          ]
        },
        
        practice: {
          type: 'challenge',
          objective: 'Faça um combo de 8+ linhas',
          targetCombo: 8,
          
          validation: (state) => {
            const maxCombo = state.maxComboReached || 0;
            return {
              complete: maxCombo >= 8,
              progress: maxCombo,
              feedback: `Combo máximo: ${maxCombo}x`
            };
          }
        },
        
        rewards: {
          fishCoins: 400,
          xp: 200,
          badge: 'combo_master',
          unlocks: [9]
        }
      },

      {
        id: 9,
        module: LESSON_MODULES.INTERMEDIATE,
        title: '⚡ Back-to-Back',
        description: 'Faça Tetris ou T-spins consecutivos para 50% bonus',
        difficulty: 'intermediate',
        estimatedTime: '7 min',
        
        demonstration: {
          narration: [
            { time: 0, text: '⚡ BACK-TO-BACK = Difíceis consecutivas' },
            { time: 3000, text: '✅ CONTA: Tetris (4 linhas) ou T-spin' },
            { time: 6000, text: '💰 BÔNUS: +50% de pontos!' },
            { time: 9000, text: '❌ QUEBRA: Se limpar 1-3 linhas normais' },
            { time: 12000, text: '🎯 Mantenha chain infinita!' }
          ]
        },
        
        practice: {
          type: 'challenge',
          objective: 'Faça 3 ações back-to-back consecutivas',
          targetB2B: 3,
          
          validation: (state) => {
            const b2bChain = state.backToBackChain || 0;
            return {
              complete: b2bChain >= 3,
              progress: b2bChain,
              feedback: b2bChain >= 3 ? '⚡ B2B CHAIN MASTER!' : `B2B: ${b2bChain}/3`
            };
          }
        },
        
        rewards: {
          fishCoins: 600,
          xp: 350,
          badge: 'b2b_master',
          unlocks: [10]
        }
      },

      {
        id: 10,
        module: LESSON_MODULES.INTERMEDIATE,
        title: '📉 Downstacking',
        description: 'Limpe pilhas rapidamente sob pressão',
        difficulty: 'intermediate',
        estimatedTime: '6 min',
        
        demonstration: {
          narration: [
            { time: 0, text: '📉 DOWNSTACKING = Limpar pilha alta rapidamente' },
            { time: 3000, text: '⚠️ SITUAÇÃO: Quando errou e empilhou demais' },
            { time: 6000, text: '🎯 OBJETIVO: Chegar embaixo sem game over' },
            { time: 9000, text: '💡 TÉCNICA: Combos + decisões rápidas' }
          ]
        },
        
        practice: {
          type: 'survival',
          objective: 'Sobreviva e limpe até altura 5',
          startHeight: 15, // Começa com pilha alta
          targetHeight: 5,
          
          validation: (state) => {
            const height = this.calculateHeight(state.board);
            return {
              complete: height <= 5,
              progress: Math.max(0, 15 - height),
              feedback: height <= 5 ? '✅ Salvou!' : `Altura: ${height}`
            };
          }
        },
        
        rewards: {
          fishCoins: 500,
          xp: 250,
          badge: 'downstack_master',
          unlocks: [11],
          achievement: 'intermediate_complete'
        }
      },

      // ========================================
      // MÓDULO 3: AVANÇADO (próximas lessons)
      // ========================================
      {
        id: 11,
        module: LESSON_MODULES.ADVANCED,
        title: '🏗️ T-Spin Double',
        description: 'O T-spin mais valioso: 800 pontos!',
        difficulty: 'advanced',
        estimatedTime: '10 min',
        
        demonstration: {
          narration: [
            { time: 0, text: '💎 T-SPIN DOUBLE = 800 pontos + B2B!' },
            { time: 3000, text: '🏗️ SETUP: Buraco em forma de "L"' },
            { time: 6000, text: '📐 ALTURA: 2 linhas de buraco' },
            { time: 9000, text: '⏱️ Veja a construção:' }
          ],
          setupBoard: this.createTSDSetup()
        },
        
        practice: {
          type: 'mastery',
          objective: 'Execute 3 T-spin Doubles',
          targetCount: 3,
          
          validation: (state) => {
            const tsds = state.tspinDoublesExecuted || 0;
            return {
              complete: tsds >= 3,
              progress: tsds
            };
          }
        },
        
        rewards: {
          fishCoins: 800,
          xp: 500,
          badge: 'tsd_master',
          unlocks: [12]
        }
      }

      // TODO: Adicionar lessons 12-21 (continuação)
    ];
  }

  // ========================================
  // MÉTODOS AUXILIARES
  // ========================================

  countHoles(board) {
    let holes = 0;
    for (let x = 0; x < 10; x++) {
      let foundBlock = false;
      for (let y = 0; y < 20; y++) {
        if (board[y][x]) {
          foundBlock = true;
        } else if (foundBlock) {
          holes++;
        }
      }
    }
    return holes;
  }

  calculateHeight(board) {
    for (let y = 0; y < 20; y++) {
      if (board[y].some(cell => cell)) {
        return 20 - y;
      }
    }
    return 0;
  }

  createTSDSetup() {
    const board = Array(20).fill(null).map(() => Array(10).fill(0));
    // Preenche setup para T-spin Double
    for (let y = 17; y < 20; y++) {
      for (let x = 0; x < 10; x++) {
        if (x === 3 || x === 4) continue; // Buraco para T
        board[y][x] = 1;
      }
    }
    return board;
  }

  // ========================================
  // PROGRESSO
  // ========================================

  loadProgress() {
    const saved = this.gameRepository.load('tutorialProgress');
    return saved || {
      completedLessons: [],
      unlockedLessons: [1], // Apenas lesson 1 disponível
      badges: [],
      totalXP: 0,
      currentModule: LESSON_MODULES.FUNDAMENTALS
    };
  }

  saveProgress() {
    this.gameRepository.save('tutorialProgress', this.progress);
  }

  getLessonById(id) {
    return this.lessons.find(l => l.id === id);
  }

  getAvailableLessons() {
    return this.lessons.filter(l => 
      this.progress.unlockedLessons.includes(l.id)
    );
  }

  completeLesson(lessonId, performance) {
    const lesson = this.getLessonById(lessonId);
    if (!lesson) return;

    // Adiciona aos completados
    if (!this.progress.completedLessons.includes(lessonId)) {
      this.progress.completedLessons.push(lessonId);
    }

    // Desbloqueia próximas lessons
    if (lesson.rewards.unlocks) {
      lesson.rewards.unlocks.forEach(id => {
        if (!this.progress.unlockedLessons.includes(id)) {
          this.progress.unlockedLessons.push(id);
        }
      });
    }

    // Adiciona badge
    if (lesson.rewards.badge && !this.progress.badges.includes(lesson.rewards.badge)) {
      this.progress.badges.push(lesson.rewards.badge);
    }

    // Adiciona XP
    this.progress.totalXP += lesson.rewards.xp || 0;

    this.saveProgress();

    return {
      completed: true,
      rewards: lesson.rewards,
      nextLesson: lesson.rewards.unlocks?.[0] || null
    };
  }

  getProgress() {
    return this.progress;
  }

  resetProgress() {
    this.progress = {
      completedLessons: [],
      unlockedLessons: [1],
      badges: [],
      totalXP: 0,
      currentModule: LESSON_MODULES.FUNDAMENTALS
    };
    this.saveProgress();
  }
}
