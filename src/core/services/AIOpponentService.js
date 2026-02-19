/**
 * AIOpponentService - IA adversária com múltiplos níveis
 */

export class AIOpponentService {
  constructor() {
    this.difficulty = 'medium'; // easy, medium, hard, expert
    this.thinkingTime = 100; // ms entre decisões
    this.lastDecision = Date.now();
  }

  setDifficulty(difficulty) {
    this.difficulty = difficulty;
    
    // Ajusta velocidade de decisão baseada na dificuldade
    switch (difficulty) {
      case 'easy':
        this.thinkingTime = 300;
        break;
      case 'medium':
        this.thinkingTime = 150;
        break;
      case 'hard':
        this.thinkingTime = 80;
        break;
      case 'expert':
        this.thinkingTime = 30;
        break;
    }
  }

  /**
   * Decide próxima ação da IA
   * @param {Object} gameState - Estado atual do jogo
   * @returns {Object} - { action: 'left'|'right'|'rotate'|'down'|'drop', reason: string }
   */
  decideNextMove(gameState) {
    const now = Date.now();
    if (now - this.lastDecision < this.thinkingTime) {
      return null; // Ainda pensando...
    }
    
    this.lastDecision = now;
    
    const { currentPiece, board, nextPieces } = gameState;
    
    if (!currentPiece) return null;

    // Avalia todas as posições possíveis
    const possibleMoves = this.evaluateAllPositions(currentPiece, board);
    
    // Escolhe a melhor baseada na dificuldade
    const bestMove = this.selectBestMove(possibleMoves, gameState);
    
    return bestMove;
  }

  /**
   * Avalia todas as posições possíveis para a peça atual
   */
  evaluateAllPositions(piece, board) {
    const moves = [];
    const rotations = [0, 1, 2, 3];
    
    for (const rotation of rotations) {
      // Simula cada rotação
      const rotatedPiece = this.simulateRotation(piece, rotation);
      
      // Para cada coluna possível
      for (let col = 0; col < 10; col++) {
        const score = this.evaluatePosition(rotatedPiece, board, col, rotation);
        
        moves.push({
          rotation,
          column: col,
          score,
          piece: rotatedPiece
        });
      }
    }
    
    return moves.sort((a, b) => b.score - a.score);
  }

  /**
   * Avalia qualidade de uma posição específica
   */
  evaluatePosition(piece, board, targetCol, rotation) {
    let score = 0;
    
    // Simula colocação da peça
    const simulatedBoard = this.simulatePlacement(piece, board, targetCol);
    
    if (!simulatedBoard) return -10000; // Posição inválida
    
    // Fatores de avaliação:
    
    // 1. Linhas completas (MUITO BOM!)
    const linesCleared = this.countCompletedLines(simulatedBoard);
    score += linesCleared * 1000;
    
    // 2. Altura do tabuleiro (quanto menor, melhor)
    const height = this.calculateHeight(simulatedBoard);
    score -= height * 50;
    
    // 3. Buracos (MUITO RUIM!)
    const holes = this.countHoles(simulatedBoard);
    score -= holes * 500;
    
    // 4. Suavidade (diferença de altura entre colunas)
    const bumpiness = this.calculateBumpiness(simulatedBoard);
    score -= bumpiness * 40;
    
    // 5. Linhas completas adjacentes (combos!)
    const potentialCombo = this.evaluatePotentialCombo(simulatedBoard);
    score += potentialCombo * 300;
    
    // 6. Teto nivelado (bom para T-spins)
    const flatness = this.calculateFlatness(simulatedBoard);
    score += flatness * 20;
    
    // Ajustes por dificuldade
    if (this.difficulty === 'easy') {
      // IA fácil comete erros propositais
      score += (Math.random() - 0.5) * 1000;
    } else if (this.difficulty === 'expert') {
      // IA expert prioriza T-spins
      const tSpinPotential = this.evaluateTSpinSetup(simulatedBoard, piece);
      score += tSpinPotential * 800;
    }
    
    return score;
  }

  /**
   * Seleciona melhor movimento baseado na avaliação
   */
  selectBestMove(possibleMoves, gameState) {
    if (possibleMoves.length === 0) return { action: 'down' };
    
    // Dificuldades mais baixas podem escolher movimentos subótimos
    let selectedMove;
    
    if (this.difficulty === 'easy' && Math.random() < 0.3) {
      // 30% de chance de escolher movimento ruim
      selectedMove = possibleMoves[Math.floor(Math.random() * Math.min(5, possibleMoves.length))];
    } else if (this.difficulty === 'medium' && Math.random() < 0.15) {
      // 15% de chance de não escolher o ótimo
      selectedMove = possibleMoves[Math.floor(Math.random() * Math.min(3, possibleMoves.length))];
    } else {
      // Escolhe o melhor
      selectedMove = possibleMoves[0];
    }
    
    // Calcula sequência de ações para chegar lá
    const actions = this.calculateActionSequence(
      gameState.currentPiece,
      selectedMove.rotation,
      selectedMove.column
    );
    
    return actions[0] || { action: 'down' };
  }

  /**
   * Calcula sequência de ações para alcançar posição alvo
   */
  calculateActionSequence(currentPiece, targetRotation, targetColumn) {
    const actions = [];
    
    // Rotações necessárias
    const rotationsNeeded = (targetRotation - currentPiece.rotation + 4) % 4;
    for (let i = 0; i < rotationsNeeded; i++) {
      actions.push({ action: 'rotate' });
    }
    
    // Movimentos horizontais necessários
    const horizontalDiff = targetColumn - currentPiece.x;
    const direction = horizontalDiff > 0 ? 'right' : 'left';
    for (let i = 0; i < Math.abs(horizontalDiff); i++) {
      actions.push({ action: direction });
    }
    
    // Drop final
    actions.push({ action: 'drop' });
    
    return actions;
  }

  // Métodos de avaliação do tabuleiro
  
  countCompletedLines(board) {
    let count = 0;
    for (let row of board) {
      if (row.every(cell => cell !== 0)) count++;
    }
    return count;
  }

  calculateHeight(board) {
    for (let y = 0; y < board.length; y++) {
      if (board[y].some(cell => cell !== 0)) {
        return board.length - y;
      }
    }
    return 0;
  }

  countHoles(board) {
    let holes = 0;
    const width = board[0].length;
    
    for (let x = 0; x < width; x++) {
      let blockFound = false;
      for (let y = 0; y < board.length; y++) {
        if (board[y][x] !== 0) {
          blockFound = true;
        } else if (blockFound && board[y][x] === 0) {
          holes++;
        }
      }
    }
    
    return holes;
  }

  calculateBumpiness(board) {
    const heights = [];
    const width = board[0].length;
    
    for (let x = 0; x < width; x++) {
      let height = 0;
      for (let y = 0; y < board.length; y++) {
        if (board[y][x] !== 0) {
          height = board.length - y;
          break;
        }
      }
      heights.push(height);
    }
    
    let bumpiness = 0;
    for (let i = 0; i < heights.length - 1; i++) {
      bumpiness += Math.abs(heights[i] - heights[i + 1]);
    }
    
    return bumpiness;
  }

  evaluatePotentialCombo(board) {
    // Conta linhas quase completas adjacentes
    let potentialCombo = 0;
    for (let y = 0; y < board.length - 1; y++) {
      const filled1 = board[y].filter(cell => cell !== 0).length;
      const filled2 = board[y + 1].filter(cell => cell !== 0).length;
      if (filled1 >= 8 && filled2 >= 8) {
        potentialCombo++;
      }
    }
    return potentialCombo;
  }

  calculateFlatness(board) {
    const heights = [];
    const width = board[0].length;
    
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < board.length; y++) {
        if (board[y][x] !== 0) {
          heights.push(board.length - y);
          break;
        }
      }
      if (heights.length === x) heights.push(0);
    }
    
    const variance = heights.reduce((sum, h) => sum + Math.pow(h - heights[0], 2), 0);
    return 100 - variance; // Quanto menor a variância, mais plano
  }

  evaluateTSpinSetup(board, piece) {
    // Avalia se há setup para T-spin (simplificado)
    if (piece.type !== 'T') return 0;
    
    // Procura por "slots" em formato de T
    let tSpinSlots = 0;
    for (let y = 1; y < board.length - 1; y++) {
      for (let x = 1; x < board[0].length - 1; x++) {
        if (this.isTSpinSlot(board, x, y)) {
          tSpinSlots++;
        }
      }
    }
    
    return tSpinSlots;
  }

  isTSpinSlot(board, x, y) {
    // Detecta se posição pode receber T-spin (simplificado)
    return board[y][x] === 0 &&
           board[y][x-1] !== 0 &&
           board[y][x+1] !== 0 &&
           board[y-1][x] === 0;
  }

  simulatePlacement(piece, board, targetCol) {
    // Simula colocação da peça (retorna novo board ou null se inválido)
    // Implementação simplificada
    const newBoard = board.map(row => [...row]);
    
    // TODO: Implementar lógica completa de simulação
    // Por ora, retorna board original
    return newBoard;
  }

  simulateRotation(piece, rotations) {
    // Simula rotação da peça
    return {
      ...piece,
      rotation: rotations
    };
  }

  // Getters para dificuldade
  getDifficulties() {
    return [
      { id: 'easy', name: 'Fácil', emoji: '🐱', description: 'IA iniciante' },
      { id: 'medium', name: 'Médio', emoji: '😺', description: 'IA intermediária' },
      { id: 'hard', name: 'Difícil', emoji: '😸', description: 'IA avançada' },
      { id: 'expert', name: 'Expert', emoji: '😻', description: 'IA mestre' }
    ];
  }
}
