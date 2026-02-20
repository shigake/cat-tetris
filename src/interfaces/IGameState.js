export class IGameState {
  get board() { throw new Error('Must be implemented'); }
  get currentPiece() { throw new Error('Must be implemented'); }
  get nextPieces() { throw new Error('Must be implemented'); }
  get heldPiece() { throw new Error('Must be implemented'); }
  get canHold() { throw new Error('Must be implemented'); }
  get score() { throw new Error('Must be implemented'); }
  get level() { throw new Error('Must be implemented'); }
  get lines() { throw new Error('Must be implemented'); }
  get gameOver() { throw new Error('Must be implemented'); }
  get isPaused() { throw new Error('Must be implemented'); }
  get isPlaying() { throw new Error('Must be implemented'); }
  get combo() { throw new Error('Must be implemented'); }
  get dropTime() { throw new Error('Must be implemented'); }
}
