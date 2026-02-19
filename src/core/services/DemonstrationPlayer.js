/**
 * DemonstrationPlayer - Sistema que executa demonstrações automáticas de técnicas
 * 
 * Reproduz uma sequência pré-gravada de ações para mostrar ao jogador como executar
 * técnicas específicas de Tetris (T-spins, combos, openers, etc.)
 */

export class DemonstrationPlayer {
  constructor(gameService) {
    this.gameService = gameService;
    this.recording = null;
    this.currentStep = 0;
    this.isPlaying = false;
    this.isPaused = false;
    this.playbackSpeed = 1.0; // 1.0 = normal, 2.0 = 2x speed
    this.onStepCallback = null;
    this.onCompleteCallback = null;
    this.stepTimer = null;
  }

  /**
   * Carrega uma gravação de demonstração
   * @param {Object} recording - { steps: Array, metadata: Object }
   */
  loadRecording(recording) {
    this.recording = recording;
    this.currentStep = 0;
    this.isPlaying = false;
    this.isPaused = false;
  }

  /**
   * Inicia a reprodução da demonstração
   */
  play() {
    if (!this.recording || this.recording.steps.length === 0) {
      console.warn('[DemonstrationPlayer] No recording loaded');
      return;
    }

    this.isPlaying = true;
    this.isPaused = false;
    this.executeNextStep();
  }

  /**
   * Pausa a reprodução
   */
  pause() {
    this.isPaused = true;
    if (this.stepTimer) {
      clearTimeout(this.stepTimer);
      this.stepTimer = null;
    }
  }

  /**
   * Retoma a reprodução
   */
  resume() {
    if (this.isPaused) {
      this.isPaused = false;
      this.executeNextStep();
    }
  }

  /**
   * Para a reprodução e reseta
   */
  stop() {
    this.isPlaying = false;
    this.isPaused = false;
    this.currentStep = 0;
    if (this.stepTimer) {
      clearTimeout(this.stepTimer);
      this.stepTimer = null;
    }
  }

  /**
   * Ajusta velocidade de reprodução
   * @param {number} speed - 0.5 = metade, 1.0 = normal, 2.0 = dobro
   */
  setPlaybackSpeed(speed) {
    this.playbackSpeed = Math.max(0.1, Math.min(3.0, speed));
  }

  /**
   * Executa o próximo passo da demonstração
   */
  executeNextStep() {
    if (!this.isPlaying || this.isPaused) return;
    if (this.currentStep >= this.recording.steps.length) {
      this.finish();
      return;
    }

    const step = this.recording.steps[this.currentStep];
    
    // Executar ação no GameService
    this.executeAction(step.action, step.params);

    // Callback para UI (narração, highlight)
    if (this.onStepCallback) {
      this.onStepCallback(step, this.currentStep);
    }

    this.currentStep++;

    // Agendar próximo passo
    const delay = (step.delayMs || 100) / this.playbackSpeed;
    this.stepTimer = setTimeout(() => {
      this.executeNextStep();
    }, delay);
  }

  /**
   * Executa uma ação específica no jogo
   */
  executeAction(action, params = {}) {
    switch (action) {
      case 'move':
        this.gameService.movePiece(params.direction);
        break;
      case 'rotate':
        this.gameService.rotatePiece(params.direction || 'clockwise');
        break;
      case 'hold':
        this.gameService.holdPiece();
        break;
      case 'softDrop':
        this.gameService.movePiece('down');
        break;
      case 'hardDrop':
        this.gameService.hardDrop();
        break;
      case 'wait':
        // Apenas espera (já tratado pelo delayMs)
        break;
      default:
        console.warn(`[DemonstrationPlayer] Unknown action: ${action}`);
    }
  }

  /**
   * Finaliza a demonstração
   */
  finish() {
    this.isPlaying = false;
    this.isPaused = false;
    
    if (this.onCompleteCallback) {
      this.onCompleteCallback();
    }

    console.log('[DemonstrationPlayer] Demonstration complete!');
  }

  /**
   * Registra callback para cada passo
   */
  onStep(callback) {
    this.onStepCallback = callback;
  }

  /**
   * Registra callback para conclusão
   */
  onComplete(callback) {
    this.onCompleteCallback = callback;
  }

  /**
   * Retorna progresso atual (0.0 a 1.0)
   */
  getProgress() {
    if (!this.recording) return 0;
    return this.currentStep / this.recording.steps.length;
  }

  /**
   * Retorna estado atual
   */
  getState() {
    return {
      isPlaying: this.isPlaying,
      isPaused: this.isPaused,
      currentStep: this.currentStep,
      totalSteps: this.recording?.steps.length || 0,
      progress: this.getProgress(),
      playbackSpeed: this.playbackSpeed
    };
  }
}

/**
 * DemonstrationRecorder - Grava ações do jogador para criar demonstrações
 */
export class DemonstrationRecorder {
  constructor(gameService) {
    this.gameService = gameService;
    this.recording = false;
    this.steps = [];
    this.startTime = null;
    this.lastStepTime = null;
  }

  /**
   * Inicia gravação
   */
  start(metadata = {}) {
    this.recording = true;
    this.steps = [];
    this.startTime = Date.now();
    this.lastStepTime = this.startTime;
    this.metadata = metadata;
    
    console.log('[DemonstrationRecorder] Recording started');
  }

  /**
   * Grava uma ação
   */
  recordAction(action, params = {}) {
    if (!this.recording) return;

    const now = Date.now();
    const delayMs = now - this.lastStepTime;
    
    this.steps.push({
      action,
      params,
      delayMs,
      timestamp: now - this.startTime,
      gameState: this.captureGameState()
    });

    this.lastStepTime = now;
  }

  /**
   * Para gravação e retorna recording
   */
  stop() {
    this.recording = false;
    
    const recording = {
      metadata: {
        ...this.metadata,
        duration: Date.now() - this.startTime,
        stepCount: this.steps.length,
        recordedAt: new Date().toISOString()
      },
      steps: this.steps
    };

    console.log('[DemonstrationRecorder] Recording stopped:', recording);
    
    return recording;
  }

  /**
   * Captura snapshot do estado do jogo
   */
  captureGameState() {
    const state = this.gameService.getState();
    return {
      score: state.score?.points || 0,
      level: state.score?.level || 1,
      combo: state.combo || 0,
      backToBack: state.backToBack || false
    };
  }

  /**
   * Salva recording em JSON
   */
  export() {
    if (this.recording) {
      console.warn('[DemonstrationRecorder] Cannot export while recording');
      return null;
    }

    return JSON.stringify({
      metadata: this.metadata,
      steps: this.steps
    }, null, 2);
  }
}
