export class IGameActions {
  initializeGame(board, currentPiece, nextPieces) { throw new Error('Must be implemented'); }
  movePiece(piece) { throw new Error('Must be implemented'); }
  rotatePiece(piece) { throw new Error('Must be implemented'); }
  rotatePieceLeft(piece) { throw new Error('Must be implemented'); }
  placePiece(board, nextPiece, nextPieces) { throw new Error('Must be implemented'); }
  holdPiece(heldPiece, currentPiece) { throw new Error('Must be implemented'); }
  clearLines(board, linesCleared) { throw new Error('Must be implemented'); }
  updateScore(points) { throw new Error('Must be implemented'); }
  setGameOver() { throw new Error('Must be implemented'); }
  setPaused(isPaused) { throw new Error('Must be implemented'); }
  setPlaying(isPlaying) { throw new Error('Must be implemented'); }
  updateLevel(level, dropTime) { throw new Error('Must be implemented'); }
  updateCombo() { throw new Error('Must be implemented'); }
  resetCombo() { throw new Error('Must be implemented'); }
}
