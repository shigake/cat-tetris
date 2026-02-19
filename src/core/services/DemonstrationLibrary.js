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
