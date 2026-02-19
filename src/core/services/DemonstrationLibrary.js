/**
 * DemonstrationLibrary - Biblioteca de demonstrações pré-gravadas
 * 
 * Contém sequências de ações para demonstrar técnicas de Tetris
 */

export const DEMONSTRATIONS = {
  // FUNDAMENTOS
  'lesson-1-movement': {
    metadata: {
      lessonId: 'lesson-1-movement',
      title: 'Movimentação Básica',
      description: 'Como mover peças para os lados',
      duration: 8000
    },
    steps: [
      { action: 'wait', delayMs: 500 },
      { action: 'move', params: { direction: 'left' }, delayMs: 200 },
      { action: 'move', params: { direction: 'left' }, delayMs: 200 },
      { action: 'move', params: { direction: 'left' }, delayMs: 200 },
      { action: 'wait', delayMs: 500 },
      { action: 'move', params: { direction: 'right' }, delayMs: 200 },
      { action: 'move', params: { direction: 'right' }, delayMs: 200 },
      { action: 'move', params: { direction: 'right' }, delayMs: 200 },
      { action: 'move', params: { direction: 'right' }, delayMs: 200 },
      { action: 'move', params: { direction: 'right' }, delayMs: 200 },
      { action: 'move', params: { direction: 'right' }, delayMs: 200 },
      { action: 'wait', delayMs: 500 },
      { action: 'hardDrop', delayMs: 300 }
    ]
  },

  'lesson-2-rotation': {
    metadata: {
      lessonId: 'lesson-2-rotation',
      title: 'Rotação de Peças',
      description: 'Como rotacionar peças',
      duration: 10000
    },
    steps: [
      { action: 'wait', delayMs: 500 },
      { action: 'rotate', params: { direction: 'clockwise' }, delayMs: 400 },
      { action: 'wait', delayMs: 300 },
      { action: 'rotate', params: { direction: 'clockwise' }, delayMs: 400 },
      { action: 'wait', delayMs: 300 },
      { action: 'rotate', params: { direction: 'clockwise' }, delayMs: 400 },
      { action: 'wait', delayMs: 300 },
      { action: 'rotate', params: { direction: 'clockwise' }, delayMs: 400 },
      { action: 'wait', delayMs: 500 },
      { action: 'move', params: { direction: 'left' }, delayMs: 200 },
      { action: 'move', params: { direction: 'left' }, delayMs: 200 },
      { action: 'hardDrop', delayMs: 300 }
    ]
  },

  'lesson-3-soft-hard-drop': {
    metadata: {
      lessonId: 'lesson-3-soft-hard-drop',
      title: 'Soft Drop e Hard Drop',
      description: 'Diferença entre soft drop (lento) e hard drop (instantâneo)',
      duration: 12000
    },
    steps: [
      // Demonstrar soft drop
      { action: 'wait', delayMs: 500 },
      { action: 'move', params: { direction: 'left' }, delayMs: 200 },
      { action: 'move', params: { direction: 'left' }, delayMs: 200 },
      { action: 'softDrop', delayMs: 150 },
      { action: 'softDrop', delayMs: 150 },
      { action: 'softDrop', delayMs: 150 },
      { action: 'softDrop', delayMs: 150 },
      { action: 'softDrop', delayMs: 150 },
      { action: 'softDrop', delayMs: 150 },
      { action: 'wait', delayMs: 1000 },
      
      // Demonstrar hard drop
      { action: 'move', params: { direction: 'right' }, delayMs: 200 },
      { action: 'move', params: { direction: 'right' }, delayMs: 200 },
      { action: 'move', params: { direction: 'right' }, delayMs: 200 },
      { action: 'wait', delayMs: 300 },
      { action: 'hardDrop', delayMs: 100 }
    ]
  },

  'lesson-4-hold': {
    metadata: {
      lessonId: 'lesson-4-hold',
      title: 'Sistema de Hold',
      description: 'Como guardar peças para usar depois',
      duration: 15000
    },
    steps: [
      { action: 'wait', delayMs: 500 },
      // Segurar primeira peça
      { action: 'hold', delayMs: 800 },
      { action: 'wait', delayMs: 500 },
      // Jogar a nova peça
      { action: 'move', params: { direction: 'left' }, delayMs: 200 },
      { action: 'hardDrop', delayMs: 800 },
      { action: 'wait', delayMs: 500 },
      // Recuperar peça guardada
      { action: 'hold', delayMs: 800 },
      { action: 'wait', delayMs: 500 },
      // Jogar
      { action: 'move', params: { direction: 'right' }, delayMs: 200 },
      { action: 'move', params: { direction: 'right' }, delayMs: 200 },
      { action: 'hardDrop', delayMs: 300 }
    ]
  },

  // T-SPIN BÁSICO
  'lesson-6-tspin-basic': {
    metadata: {
      lessonId: 'lesson-6-tspin-basic',
      title: 'T-Spin Básico',
      description: 'Configuração clássica de T-Spin',
      duration: 20000
    },
    steps: [
      // Setup: criar overhang
      { action: 'wait', delayMs: 1000 },
      { action: 'move', params: { direction: 'left' }, delayMs: 200 },
      { action: 'move', params: { direction: 'left' }, delayMs: 200 },
      { action: 'hardDrop', delayMs: 800 },
      
      // Peça T - posicionar
      { action: 'wait', delayMs: 500 },
      { action: 'move', params: { direction: 'left' }, delayMs: 200 },
      { action: 'rotate', params: { direction: 'clockwise' }, delayMs: 400 },
      { action: 'wait', delayMs: 300 },
      // Mover para o overhang
      { action: 'move', params: { direction: 'left' }, delayMs: 200 },
      { action: 'softDrop', delayMs: 150 },
      { action: 'softDrop', delayMs: 150 },
      { action: 'wait', delayMs: 500 },
      // Rotação final (T-Spin!)
      { action: 'rotate', params: { direction: 'clockwise' }, delayMs: 400 },
      { action: 'wait', delayMs: 800 },
      { action: 'hardDrop', delayMs: 300 }
    ]
  },

  // COMBOS
  'lesson-9-combos': {
    metadata: {
      lessonId: 'lesson-9-combos',
      title: 'Sistema de Combos',
      description: 'Como encadear clears para multiplicar pontos',
      duration: 25000
    },
    steps: [
      // Clear 1
      { action: 'wait', delayMs: 500 },
      { action: 'move', params: { direction: 'left' }, delayMs: 200 },
      { action: 'move', params: { direction: 'left' }, delayMs: 200 },
      { action: 'hardDrop', delayMs: 600 },
      
      // Clear 2
      { action: 'wait', delayMs: 300 },
      { action: 'rotate', params: { direction: 'clockwise' }, delayMs: 300 },
      { action: 'move', params: { direction: 'right' }, delayMs: 200 },
      { action: 'hardDrop', delayMs: 600 },
      
      // Clear 3
      { action: 'wait', delayMs: 300 },
      { action: 'move', params: { direction: 'left' }, delayMs: 200 },
      { action: 'hardDrop', delayMs: 600 },
      
      // Clear 4
      { action: 'wait', delayMs: 300 },
      { action: 'rotate', params: { direction: 'clockwise' }, delayMs: 300 },
      { action: 'move', params: { direction: 'right' }, delayMs: 200 },
      { action: 'move', params: { direction: 'right' }, delayMs: 200 },
      { action: 'hardDrop', delayMs: 600 }
    ]
  },

  // LIÇÕES INTERMEDIÁRIAS ADICIONAIS
  'lesson-7-tspin-mini': {
    metadata: {
      lessonId: 'lesson-7-tspin-mini',
      title: 'T-Spin Mini',
      description: 'Variação menor do T-Spin',
      duration: 18000
    },
    steps: [
      { action: 'wait', delayMs: 500 },
      { action: 'move', params: { direction: 'left' }, delayMs: 200 },
      { action: 'hardDrop', delayMs: 600 },
      { action: 'wait', delayMs: 400 },
      { action: 'rotate', params: { direction: 'clockwise' }, delayMs: 300 },
      { action: 'move', params: { direction: 'left' }, delayMs: 200 },
      { action: 'softDrop', delayMs: 150 },
      { action: 'rotate', params: { direction: 'clockwise' }, delayMs: 300 },
      { action: 'hardDrop', delayMs: 400 }
    ]
  },

  'lesson-8-tspin-double': {
    metadata: {
      lessonId: 'lesson-8-tspin-double',
      title: 'T-Spin Double',
      description: 'T-Spin que limpa 2 linhas',
      duration: 20000
    },
    steps: [
      { action: 'wait', delayMs: 500 },
      { action: 'move', params: { direction: 'left' }, delayMs: 200 },
      { action: 'move', params: { direction: 'left' }, delayMs: 200 },
      { action: 'hardDrop', delayMs: 600 },
      { action: 'wait', delayMs: 500 },
      { action: 'rotate', params: { direction: 'clockwise' }, delayMs: 300 },
      { action: 'move', params: { direction: 'left' }, delayMs: 200 },
      { action: 'softDrop', delayMs: 150 },
      { action: 'softDrop', delayMs: 150 },
      { action: 'rotate', params: { direction: 'clockwise' }, delayMs: 300 },
      { action: 'wait', delayMs: 500 },
      { action: 'hardDrop', delayMs: 400 }
    ]
  },

  'lesson-10-back-to-back': {
    metadata: {
      lessonId: 'lesson-10-back-to-back',
      title: 'Back-to-Back Chain',
      description: 'Encadear Tetris e T-Spins para bônus',
      duration: 22000
    },
    steps: [
      // Tetris 1
      { action: 'wait', delayMs: 500 },
      { action: 'rotate', params: { direction: 'clockwise' }, delayMs: 300 },
      { action: 'move', params: { direction: 'right' }, delayMs: 200 },
      { action: 'move', params: { direction: 'right' }, delayMs: 200 },
      { action: 'move', params: { direction: 'right' }, delayMs: 200 },
      { action: 'hardDrop', delayMs: 800 },
      
      // T-Spin (B2B!)
      { action: 'wait', delayMs: 400 },
      { action: 'rotate', params: { direction: 'clockwise' }, delayMs: 300 },
      { action: 'move', params: { direction: 'left' }, delayMs: 200 },
      { action: 'softDrop', delayMs: 150 },
      { action: 'rotate', params: { direction: 'clockwise' }, delayMs: 300 },
      { action: 'hardDrop', delayMs: 400 }
    ]
  },

  'lesson-11-downstacking': {
    metadata: {
      lessonId: 'lesson-11-downstacking',
      title: 'Downstacking',
      description: 'Técnica de limpar pilhas altas',
      duration: 25000
    },
    steps: [
      { action: 'wait', delayMs: 500 },
      { action: 'move', params: { direction: 'left' }, delayMs: 200 },
      { action: 'hardDrop', delayMs: 500 },
      { action: 'wait', delayMs: 300 },
      { action: 'rotate', params: { direction: 'clockwise' }, delayMs: 300 },
      { action: 'hardDrop', delayMs: 500 },
      { action: 'wait', delayMs: 300 },
      { action: 'move', params: { direction: 'right' }, delayMs: 200 },
      { action: 'hardDrop', delayMs: 500 },
      { action: 'wait', delayMs: 300 },
      { action: 'hardDrop', delayMs: 500 }
    ]
  },

  // LIÇÕES AVANÇADAS
  'lesson-12-tspin-triple': {
    metadata: {
      lessonId: 'lesson-12-tspin-triple',
      title: 'T-Spin Triple',
      description: 'T-Spin que limpa 3 linhas',
      duration: 25000
    },
    steps: [
      { action: 'wait', delayMs: 1000 },
      { action: 'move', params: { direction: 'left' }, delayMs: 200 },
      { action: 'move', params: { direction: 'left' }, delayMs: 200 },
      { action: 'hardDrop', delayMs: 600 },
      { action: 'wait', delayMs: 500 },
      { action: 'rotate', params: { direction: 'clockwise' }, delayMs: 300 },
      { action: 'rotate', params: { direction: 'clockwise' }, delayMs: 300 },
      { action: 'move', params: { direction: 'left' }, delayMs: 200 },
      { action: 'softDrop', delayMs: 150 },
      { action: 'softDrop', delayMs: 150 },
      { action: 'softDrop', delayMs: 150 },
      { action: 'rotate', params: { direction: 'clockwise' }, delayMs: 300 },
      { action: 'hardDrop', delayMs: 400 }
    ]
  },

  'lesson-13-4wide': {
    metadata: {
      lessonId: 'lesson-13-4wide',
      title: 'Técnica 4-Wide',
      description: 'Manter coluna de 4 espaços para combos',
      duration: 30000
    },
    steps: [
      { action: 'wait', delayMs: 500 },
      { action: 'move', params: { direction: 'left' }, delayMs: 200 },
      { action: 'move', params: { direction: 'left' }, delayMs: 200 },
      { action: 'hardDrop', delayMs: 500 },
      { action: 'rotate', params: { direction: 'clockwise' }, delayMs: 300 },
      { action: 'move', params: { direction: 'right' }, delayMs: 200 },
      { action: 'hardDrop', delayMs: 500 },
      { action: 'wait', delayMs: 300 },
      { action: 'move', params: { direction: 'right' }, delayMs: 200 },
      { action: 'hardDrop', delayMs: 500 }
    ]
  },

  'lesson-14-perfect-clear': {
    metadata: {
      lessonId: 'lesson-14-perfect-clear',
      title: 'Perfect Clear',
      description: 'Limpar todo o tabuleiro',
      duration: 20000
    },
    steps: [
      { action: 'wait', delayMs: 500 },
      { action: 'rotate', params: { direction: 'clockwise' }, delayMs: 300 },
      { action: 'move', params: { direction: 'left' }, delayMs: 200 },
      { action: 'hardDrop', delayMs: 500 },
      { action: 'wait', delayMs: 300 },
      { action: 'hardDrop', delayMs: 500 },
      { action: 'wait', delayMs: 300 },
      { action: 'rotate', params: { direction: 'clockwise' }, delayMs: 300 },
      { action: 'move', params: { direction: 'right' }, delayMs: 200 },
      { action: 'hardDrop', delayMs: 500 }
    ]
  },

  // OPENERS PROFISSIONAIS
  'lesson-16-tki-opener': {
    metadata: {
      lessonId: 'lesson-16-tki-opener',
      title: 'TKI Opener',
      description: 'Opener profissional TKI-3',
      duration: 35000
    },
    steps: [
      { action: 'wait', delayMs: 1000 },
      { action: 'rotate', params: { direction: 'clockwise' }, delayMs: 300 },
      { action: 'move', params: { direction: 'left' }, delayMs: 200 },
      { action: 'move', params: { direction: 'left' }, delayMs: 200 },
      { action: 'hardDrop', delayMs: 600 },
      { action: 'wait', delayMs: 400 },
      { action: 'rotate', params: { direction: 'clockwise' }, delayMs: 300 },
      { action: 'move', params: { direction: 'right' }, delayMs: 200 },
      { action: 'hardDrop', delayMs: 600 }
    ]
  },

  'lesson-17-tspin-stacking': {
    metadata: {
      lessonId: 'lesson-17-tspin-stacking',
      title: 'T-Spin Stacking',
      description: 'Empilhar para múltiplos T-Spins',
      duration: 40000
    },
    steps: [
      { action: 'wait', delayMs: 500 },
      { action: 'move', params: { direction: 'left' }, delayMs: 200 },
      { action: 'hardDrop', delayMs: 600 },
      { action: 'wait', delayMs: 400 },
      { action: 'rotate', params: { direction: 'clockwise' }, delayMs: 300 },
      { action: 'hardDrop', delayMs: 600 },
      { action: 'wait', delayMs: 400 },
      { action: 'move', params: { direction: 'right' }, delayMs: 200 },
      { action: 'hardDrop', delayMs: 600 }
    ]
  },

  // LIÇÕES PROFISSIONAIS
  'lesson-18-speed-40l': {
    metadata: {
      lessonId: 'lesson-18-speed-40l',
      title: 'Sprint 40 Linhas',
      description: 'Velocidade máxima - limpar 40 linhas rápido',
      duration: 45000
    },
    steps: [
      { action: 'wait', delayMs: 300 },
      { action: 'rotate', params: { direction: 'clockwise' }, delayMs: 100 },
      { action: 'move', params: { direction: 'right' }, delayMs: 100 },
      { action: 'hardDrop', delayMs: 200 },
      { action: 'rotate', params: { direction: 'clockwise' }, delayMs: 100 },
      { action: 'hardDrop', delayMs: 200 },
      { action: 'move', params: { direction: 'left' }, delayMs: 100 },
      { action: 'hardDrop', delayMs: 200 },
      { action: 'hardDrop', delayMs: 200 },
      { action: 'hardDrop', delayMs: 200 }
    ]
  },

  'lesson-19-garbage-defense': {
    metadata: {
      lessonId: 'lesson-19-garbage-defense',
      title: 'Defesa contra Garbage',
      description: 'Como sobreviver sob pressão',
      duration: 35000
    },
    steps: [
      { action: 'wait', delayMs: 500 },
      { action: 'move', params: { direction: 'right' }, delayMs: 200 },
      { action: 'move', params: { direction: 'right' }, delayMs: 200 },
      { action: 'hardDrop', delayMs: 400 },
      { action: 'wait', delayMs: 300 },
      { action: 'rotate', params: { direction: 'clockwise' }, delayMs: 200 },
      { action: 'move', params: { direction: 'left' }, delayMs: 200 },
      { action: 'hardDrop', delayMs: 400 }
    ]
  },

  'lesson-20-multiplayer-tactics': {
    metadata: {
      lessonId: 'lesson-20-multiplayer-tactics',
      title: 'Táticas Multiplayer',
      description: 'Como vencer em partidas 1v1',
      duration: 40000
    },
    steps: [
      { action: 'wait', delayMs: 500 },
      { action: 'rotate', params: { direction: 'clockwise' }, delayMs: 200 },
      { action: 'move', params: { direction: 'right' }, delayMs: 150 },
      { action: 'move', params: { direction: 'right' }, delayMs: 150 },
      { action: 'hardDrop', delayMs: 300 },
      { action: 'wait', delayMs: 300 },
      { action: 'rotate', params: { direction: 'clockwise' }, delayMs: 200 },
      { action: 'hardDrop', delayMs: 300 }
    ]
  },

  'lesson-21-final-challenge': {
    metadata: {
      lessonId: 'lesson-21-final-challenge',
      title: 'Desafio Final',
      description: 'Demonstração completa de todas as técnicas',
      duration: 60000
    },
    steps: [
      // Combo inicial
      { action: 'wait', delayMs: 500 },
      { action: 'move', params: { direction: 'left' }, delayMs: 200 },
      { action: 'hardDrop', delayMs: 400 },
      
      // T-Spin
      { action: 'rotate', params: { direction: 'clockwise' }, delayMs: 300 },
      { action: 'move', params: { direction: 'left' }, delayMs: 200 },
      { action: 'softDrop', delayMs: 150 },
      { action: 'rotate', params: { direction: 'clockwise' }, delayMs: 300 },
      { action: 'hardDrop', delayMs: 400 },
      
      // Tetris
      { action: 'wait', delayMs: 300 },
      { action: 'rotate', params: { direction: 'clockwise' }, delayMs: 200 },
      { action: 'move', params: { direction: 'right' }, delayMs: 150 },
      { action: 'move', params: { direction: 'right' }, delayMs: 150 },
      { action: 'hardDrop', delayMs: 400 },
      
      // Combo final
      { action: 'move', params: { direction: 'left' }, delayMs: 150 },
      { action: 'hardDrop', delayMs: 300 },
      { action: 'hardDrop', delayMs: 300 },
      { action: 'rotate', params: { direction: 'clockwise' }, delayMs: 200 },
      { action: 'hardDrop', delayMs: 300 }
    ]
  }
};

/**
 * Retorna demonstração por ID de lição
 */
export function getDemonstration(lessonId) {
  return DEMONSTRATIONS[lessonId] || null;
}

/**
 * Verifica se existe demonstração para uma lição
 */
export function hasDemonstration(lessonId) {
  return lessonId in DEMONSTRATIONS;
}

/**
 * Lista todas as demonstrações disponíveis
 */
export function listDemonstrations() {
  return Object.keys(DEMONSTRATIONS);
}
