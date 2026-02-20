export class DemonstrationPlayer {
  constructor(gameService) {
    this.gameService = gameService;
    this.recording = null;
    this.currentStep = 0;
    this.isPlaying = false;
    this.isPaused = false;
    this.playbackSpeed = 1.0;
    this.onStepCallback = null;
    this.onCompleteCallback = null;
    this.stepTimer = null;
  }

  loadRecording(recording) {
    this.recording = recording;
    this.currentStep = 0;
    this.isPlaying = false;
    this.isPaused = false;
  }

  play() {
    if (!this.recording || this.recording.steps.length === 0) {

      return;
    }

    this.isPlaying = true;
    this.isPaused = false;
    this.executeNextStep();
  }

  pause() {
    this.isPaused = true;
    if (this.stepTimer) {
      clearTimeout(this.stepTimer);
      this.stepTimer = null;
    }
  }

  resume() {
    if (this.isPaused) {
      this.isPaused = false;
      this.executeNextStep();
    }
  }

  stop() {
    this.isPlaying = false;
    this.isPaused = false;
    this.currentStep = 0;
    if (this.stepTimer) {
      clearTimeout(this.stepTimer);
      this.stepTimer = null;
    }
  }

  setPlaybackSpeed(speed) {
    this.playbackSpeed = Math.max(0.1, Math.min(3.0, speed));
  }

  executeNextStep() {
    if (!this.isPlaying || this.isPaused) return;
    if (this.currentStep >= this.recording.steps.length) {
      this.finish();
      return;
    }

    const step = this.recording.steps[this.currentStep];

    this.executeAction(step.action, step.params);

    if (this.onStepCallback) {
      this.onStepCallback(step, this.currentStep);
    }

    this.currentStep++;

    const delay = (step.delayMs || 100) / this.playbackSpeed;
    this.stepTimer = setTimeout(() => {
      this.executeNextStep();
    }, delay);
  }

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

        break;
      default:

    }
  }

  finish() {
    this.isPlaying = false;
    this.isPaused = false;

    if (this.onCompleteCallback) {
      this.onCompleteCallback();
    }

  }

  onStep(callback) {
    this.onStepCallback = callback;
  }

  onComplete(callback) {
    this.onCompleteCallback = callback;
  }

  getProgress() {
    if (!this.recording) return 0;
    return this.currentStep / this.recording.steps.length;
  }

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

export class DemonstrationRecorder {
  constructor(gameService) {
    this.gameService = gameService;
    this.recording = false;
    this.steps = [];
    this.startTime = null;
    this.lastStepTime = null;
  }

  start(metadata = {}) {
    this.recording = true;
    this.steps = [];
    this.startTime = Date.now();
    this.lastStepTime = this.startTime;
    this.metadata = metadata;

  }

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

    return recording;
  }

  captureGameState() {
    const state = this.gameService.getGameState();
    return {
      score: state.score?.points || 0,
      level: state.score?.level || 1,
      combo: state.score?.combo || 0,
      backToBack: state.backToBack || false
    };
  }

  export() {
    if (this.recording) {

      return null;
    }

    return JSON.stringify({
      metadata: this.metadata,
      steps: this.steps
    }, null, 2);
  }
}

