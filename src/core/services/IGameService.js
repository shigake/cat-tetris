export class IGameService {
  initializeGame() { throw new Error('Must be implemented'); }
  movePiece(direction) { throw new Error('Must be implemented'); }
  rotatePiece() { throw new Error('Must be implemented'); }
  rotatePieceLeft() { throw new Error('Must be implemented'); }
  placePiece() { throw new Error('Must be implemented'); }
  holdPiece() { throw new Error('Must be implemented'); }
  hardDrop() { throw new Error('Must be implemented'); }
  updateGame(deltaTime) { throw new Error('Must be implemented'); }
  pause() { throw new Error('Must be implemented'); }
  resume() { throw new Error('Must be implemented'); }
  restart() { throw new Error('Must be implemented'); }
  getDropPreview() { throw new Error('Must be implemented'); }
} 