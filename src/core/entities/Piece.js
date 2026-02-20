export class Piece {
  constructor(type, shape, color, emoji, position, isTSpin = false, rotationState = 0) {
    this.type = type;
    this.shape = shape;
    this.color = color;
    this.emoji = emoji;
    this.position = position;
    this.isTSpin = isTSpin;
    this.rotationState = rotationState; // 0-3 for SRS kick table lookups
  }

  move(deltaX, deltaY) {
    return new Piece(
      this.type,
      this.shape,
      this.color,
      this.emoji,
      { x: this.position.x + deltaX, y: this.position.y + deltaY },
      this.isTSpin,
      this.rotationState
    );
  }

  rotate() {
    const rotated = this.shape[0].map((_, index) =>
      this.shape.map(row => row[index]).reverse()
    );
    return new Piece(
      this.type,
      rotated,
      this.color,
      this.emoji,
      this.position,
      this.isTSpin,
      (this.rotationState + 1) % 4
    );
  }

  setTSpin(isTSpin) {
    return new Piece(
      this.type,
      this.shape,
      this.color,
      this.emoji,
      this.position,
      isTSpin,
      this.rotationState
    );
  }

  clone() {
    return new Piece(
      this.type,
      this.shape.map(row => [...row]),
      this.color,
      this.emoji,
      { ...this.position },
      this.isTSpin,
      this.rotationState
    );
  }

  reset(type, shape, color, emoji, position, isTSpin = false) {
    this.type = type;
    this.shape = shape;
    this.color = color;
    this.emoji = emoji;
    this.position = position;
    this.isTSpin = isTSpin;
    this.rotationState = 0;
    return this;
  }

  getWidth() {
    return this.shape[0]?.length || 0;
  }

  getHeight() {
    return this.shape.length || 0;
  }

  getCells() {
    const cells = [];
    this.shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) {
          cells.push({
            x: this.position.x + x,
            y: this.position.y + y,
            type: this.type,
            color: this.color,
            emoji: this.emoji
          });
        }
      });
    });
    return cells;
  }
} 