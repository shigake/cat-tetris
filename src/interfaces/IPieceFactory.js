export class IPieceFactory {
  createPiece(type, position) { throw new Error('Must be implemented'); }
  createRandomPiece() { throw new Error('Must be implemented'); }
  createNextPieces(count) { throw new Error('Must be implemented'); }
}
