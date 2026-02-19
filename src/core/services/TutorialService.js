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
      },

      // ========================================
      // MÓDULO 3: AVANÇADO (continuação - lessons 12-18)
      // ========================================
      {
        id: 12,
        module: LESSON_MODULES.ADVANCED,
        title: '🌀 T-Spin Triple',
        description: 'O T-spin mais poderoso: 1200 pontos!',
        difficulty: 'advanced',
        estimatedTime: '12 min',
        
        demonstration: {
          narration: [
            { time: 0, text: '💎 T-SPIN TRIPLE = 1200 pontos + B2B!' },
            { time: 3000, text: '🏗️ SETUP: Buraco vertical de 3 linhas' },
            { time: 6000, text: '⚠️ DIFÍCIL: Requer setup perfeito' },
            { time: 9000, text: '🏆 Técnica de jogadores PRO' }
          ]
        },
        
        practice: {
          type: 'mastery',
          objective: 'Execute 2 T-spin Triples',
          targetCount: 2,
          
          validation: (state) => {
            const tsts = state.tspinTriplesExecuted || 0;
            return {
              complete: tsts >= 2,
              progress: tsts,
              feedback: tsts >= 2 ? '💎 LENDÁRIO!' : `${tsts}/2 TST executados`
            };
          }
        },
        
        rewards: {
          fishCoins: 1000,
          xp: 600,
          badge: 'tst_master',
          unlocks: [13]
        }
      },

      {
        id: 13,
        module: LESSON_MODULES.ADVANCED,
        title: '🎯 4-Wide Combo',
        description: 'Combo infinito com coluna de 4',
        difficulty: 'advanced',
        estimatedTime: '15 min',
        
        demonstration: {
          narration: [
            { time: 0, text: '🎯 4-WIDE = Técnica de combo infinito' },
            { time: 3000, text: '📐 SETUP: Deixe 4 colunas vazias' },
            { time: 6000, text: '🔄 MANUTENÇÃO: Sempre limpe 1 linha' },
            { time: 9000, text: '💰 RESULTADO: Combos de 20+ linhas' },
            { time: 12000, text: '⚠️ RISCO: Um erro = quebra o setup' }
          ]
        },
        
        practice: {
          type: 'challenge',
          objective: 'Mantenha 4-wide por 15 linhas',
          target4WideLines: 15,
          
          validation: (state) => {
            const fourWideLines = state.fourWideCount || 0;
            return {
              complete: fourWideLines >= 15,
              progress: fourWideLines,
              feedback: `${fourWideLines}/15 linhas em 4-wide`
            };
          }
        },
        
        rewards: {
          fishCoins: 1200,
          xp: 700,
          badge: 'four_wide_master',
          unlocks: [14]
        }
      },

      {
        id: 14,
        module: LESSON_MODULES.ADVANCED,
        title: '✨ Perfect Clear',
        description: 'Limpe o tabuleiro 100% = BÔNUS MASSIVO',
        difficulty: 'advanced',
        estimatedTime: '10 min',
        
        demonstration: {
          narration: [
            { time: 0, text: '✨ PERFECT CLEAR = Tabuleiro 100% vazio' },
            { time: 3000, text: '💰 BÔNUS: +3000 pontos!' },
            { time: 6000, text: '🎯 QUANDO: Primeiras 10-12 peças' },
            { time: 9000, text: '📚 Requer memorização de patterns' }
          ]
        },
        
        practice: {
          type: 'challenge',
          objective: 'Consiga 1 Perfect Clear',
          targetPCs: 1,
          
          validation: (state) => {
            const pcs = state.perfectClearsCount || 0;
            return {
              complete: pcs >= 1,
              progress: pcs,
              feedback: pcs >= 1 ? '✨ PERFEITO!' : 'Tente limpar TUDO'
            };
          }
        },
        
        rewards: {
          fishCoins: 1500,
          xp: 800,
          badge: 'perfect_clear',
          unlocks: [15]
        }
      },

      {
        id: 15,
        module: LESSON_MODULES.ADVANCED,
        title: '🚀 DT Cannon',
        description: 'Opener profissional para ataque rápido',
        difficulty: 'advanced',
        estimatedTime: '20 min',
        
        demonstration: {
          narration: [
            { time: 0, text: '🚀 DT CANNON = Opener usado em torneios' },
            { time: 3000, text: '💥 PODER: 6+ linhas de ataque instantâneo' },
            { time: 6000, text: '📐 SETUP: Sequência específica de peças' },
            { time: 9000, text: '🧠 MEMORIZAÇÃO: Requer prática repetida' }
          ]
        },
        
        practice: {
          type: 'mastery',
          objective: 'Execute o DT Cannon completo',
          targetDTCannons: 1,
          
          validation: (state) => {
            const dtCannons = state.dtCannonsExecuted || 0;
            return {
              complete: dtCannons >= 1,
              progress: dtCannons,
              feedback: dtCannons >= 1 ? '🚀 OPENER PRO!' : 'Siga o pattern exato'
            };
          }
        },
        
        rewards: {
          fishCoins: 2000,
          xp: 1000,
          badge: 'dt_cannon_master',
          unlocks: [16]
        }
      },

      {
        id: 16,
        module: LESSON_MODULES.ADVANCED,
        title: '⚡ TKI Opener',
        description: 'Outro opener poderoso para início rápido',
        difficulty: 'advanced',
        estimatedTime: '20 min',
        
        demonstration: {
          narration: [
            { time: 0, text: '⚡ TKI = Opener alternativo ao DT' },
            { time: 3000, text: '🎯 VANTAGEM: Mais flexível que DT' },
            { time: 6000, text: '💪 PODER: Setup para T-spin Double' },
            { time: 9000, text: '🌟 POPULAR: Usado em competições' }
          ]
        },
        
        practice: {
          type: 'mastery',
          objective: 'Execute o TKI Opener',
          targetTKIs: 1,
          
          validation: (state) => {
            const tkis = state.tkiOpenersExecuted || 0;
            return {
              complete: tkis >= 1,
              progress: tkis,
              feedback: tkis >= 1 ? '⚡ TKI MASTER!' : 'Continue tentando'
            };
          }
        },
        
        rewards: {
          fishCoins: 2000,
          xp: 1000,
          badge: 'tki_master',
          unlocks: [17]
        }
      },

      {
        id: 17,
        module: LESSON_MODULES.ADVANCED,
        title: '🔄 T-Spin Stacking',
        description: 'Mantenha oportunidades de T-spin continuamente',
        difficulty: 'advanced',
        estimatedTime: '18 min',
        
        demonstration: {
          narration: [
            { time: 0, text: '🔄 STACKING = Manter setups de T-spin' },
            { time: 3000, text: '🎯 OBJETIVO: Nunca perder oportunidades' },
            { time: 6000, text: '🏗️ TÉCNICA: "Overhang" e "Imperial"' },
            { time: 9000, text: '💎 RESULTADO: T-spins a cada 3-4 peças' }
          ]
        },
        
        practice: {
          type: 'challenge',
          objective: 'Faça 10 T-spins em 1 jogo',
          targetTSpins: 10,
          
          validation: (state) => {
            const tspins = state.tspinsInGame || 0;
            return {
              complete: tspins >= 10,
              progress: tspins,
              feedback: `${tspins}/10 T-spins em sequência`
            };
          }
        },
        
        rewards: {
          fishCoins: 1800,
          xp: 900,
          badge: 'tspin_stacker',
          unlocks: [18],
          achievement: 'advanced_complete'
        }
      },

      // ========================================
      // MÓDULO 4: PROFISSIONAL (lessons 18-21)
      // ========================================
      {
        id: 18,
        module: LESSON_MODULES.PRO,
        title: '⚡ Speed Techniques',
        description: 'Otimização DAS e ARR para velocidade máxima',
        difficulty: 'pro',
        estimatedTime: '25 min',
        
        demonstration: {
          narration: [
            { time: 0, text: '⚡ SPEED = DAS + ARR optimization' },
            { time: 3000, text: '🎮 DAS (Delayed Auto Shift): Tempo até repeat' },
            { time: 6000, text: '🔁 ARR (Auto Repeat Rate): Velocidade do repeat' },
            { time: 9000, text: '💡 FINESSE: Menor número de inputs' },
            { time: 12000, text: '🏆 PRO: <20 PPS (peças por segundo)' }
          ]
        },
        
        practice: {
          type: 'speed_trial',
          objective: 'Limpe 40 linhas em <2 minutos',
          targetTime: 120, // segundos
          targetLines: 40,
          
          validation: (state) => {
            const time = state.elapsedSeconds || 0;
            const lines = state.linesCleared || 0;
            return {
              complete: lines >= 40 && time <= 120,
              progress: lines,
              feedback: lines >= 40 
                ? `✅ ${time}s - ${time <= 120 ? 'SUB-2MIN!' : 'Continue treinando'}`
                : `${lines}/40 linhas (${time}s)`
            };
          }
        },
        
        rewards: {
          fishCoins: 3000,
          xp: 1500,
          badge: 'speed_demon',
          unlocks: [19]
        }
      },

      {
        id: 19,
        module: LESSON_MODULES.PRO,
        title: '🛡️ Reading Garbage',
        description: 'Defenda contra linhas de ataque (garbage)',
        difficulty: 'pro',
        estimatedTime: '15 min',
        
        demonstration: {
          narration: [
            { time: 0, text: '🛡️ GARBAGE = Linhas cinzas enviadas pelo oponente' },
            { time: 3000, text: '🔑 DEFESA: Limpar linhas cancela garbage' },
            { time: 6000, text: '💡 TÉCNICA: Downstack + combos' },
            { time: 9000, text: '⚡ CONTRA-ATAQUE: B2B enquanto defende' }
          ]
        },
        
        practice: {
          type: 'survival',
          objective: 'Sobreviva 3 ondas de garbage',
          garbageWaves: 3,
          
          validation: (state) => {
            const waves = state.garbageWavesSurvived || 0;
            return {
              complete: waves >= 3,
              progress: waves,
              feedback: waves >= 3 ? '🛡️ DEFENSE MASTER!' : `${waves}/3 ondas`
            };
          }
        },
        
        rewards: {
          fishCoins: 2500,
          xp: 1200,
          badge: 'garbage_master',
          unlocks: [20]
        }
      },

      {
        id: 20,
        module: LESSON_MODULES.PRO,
        title: '🎯 Multiplayer Strategy',
        description: 'Táticas para vencer vs IA e jogadores reais',
        difficulty: 'pro',
        estimatedTime: '30 min',
        
        demonstration: {
          narration: [
            { time: 0, text: '🎯 MULTIPLAYER = Tática + Execução' },
            { time: 3000, text: '📊 OPENER: Ataque rápido (DT/TKI)' },
            { time: 6000, text: '⚡ MID-GAME: Manter pressão constante' },
            { time: 9000, text: '🛡️ DEFENSE: Downstack sob ataque' },
            { time: 12000, text: '💀 KILL: Spike final com T-spin Triple' }
          ]
        },
        
        practice: {
          type: 'vs_ai',
          objective: 'Vença IA no modo HARD',
          aiDifficulty: 'hard',
          
          validation: (state) => {
            const won = state.defeatedAI;
            return {
              complete: won,
              progress: won ? 1 : 0,
              feedback: won ? '🏆 VITÓRIA!' : 'Continue lutando'
            };
          }
        },
        
        rewards: {
          fishCoins: 3500,
          xp: 1800,
          badge: 'multiplayer_master',
          unlocks: [21]
        }
      },

      {
        id: 21,
        module: LESSON_MODULES.PRO,
        title: '🏆 Final Challenge',
        description: 'Teste final: Prove que é um mestre do Tetris',
        difficulty: 'pro',
        estimatedTime: '45 min',
        
        demonstration: {
          narration: [
            { time: 0, text: '🏆 FINAL CHALLENGE = Teste de TUDO' },
            { time: 3000, text: '✅ Você aprendeu 20 lessons' },
            { time: 6000, text: '💎 Agora mostre seu domínio' },
            { time: 9000, text: '🎯 OBJETIVO: 100K pontos + T-spin Triple' }
          ]
        },
        
        practice: {
          type: 'final_exam',
          objective: 'Alcance 100.000 pontos E execute 1 T-spin Triple',
          targetScore: 100000,
          requiresTST: true,
          
          validation: (state) => {
            const score = state.score || 0;
            const hasTST = state.tspinTriplesExecuted >= 1;
            return {
              complete: score >= 100000 && hasTST,
              progress: score,
              feedback: !hasTST 
                ? '⚠️ Falta T-spin Triple!'
                : score >= 100000
                ? '👑 MESTRE DO TETRIS!'
                : `${score.toLocaleString()}/100K pts`
            };
          }
        },
        
        rewards: {
          fishCoins: 10000,
          xp: 5000,
          badge: 'tetris_master',
          unlocks: [],
          achievement: 'tutorial_master'
        }
      }
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
