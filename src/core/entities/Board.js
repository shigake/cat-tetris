export class Board {
  constructor(width = 10, height = 20) {
    this.width = width;
    this.height = height;
    this.bufferHeight = 4; // Hidden rows above visible area (official Tetris guideline)
    this.grid = this.createEmptyGrid();
    this._buffer = this.createEmptyBuffer();
  }

  createEmptyGrid() {
    return Array(this.height).fill(null).map(() => Array(this.width).fill(null));
  }

  createEmptyBuffer() {
    return Array(this.bufferHeight).fill(null).map(() => Array(this.width).fill(null));
  }

  clone() {
    const newBoard = new Board(this.width, this.height);
    newBoard.grid = this.grid.map(row => [...row]);
    newBoard._buffer = this._buffer.map(row => [...row]);
    return newBoard;
  }

  isWithinBounds(x, y) {
    return x >= 0 && x < this.width && y >= -this.bufferHeight && y < this.height;
  }

  getCell(x, y) {
    if (x < 0 || x >= this.width) return undefined;
    if (y < -this.bufferHeight || y >= this.height) return undefined;
    if (y < 0) return this._buffer[this.bufferHeight + y][x];
    return this.grid[y][x];
  }

  setCell(x, y, cell) {
    if (x < 0 || x >= this.width) return false;
    if (y < -this.bufferHeight || y >= this.height) return false;
    if (y < 0) {
      this._buffer[this.bufferHeight + y][x] = cell;
      return true;
    }
    this.grid[y][x] = cell;
    return true;
  }

  clearCell(x, y) {
    return this.setCell(x, y, null);
  }

  placePiece(piece) {
    const cells = piece.getCells();
    cells.forEach(cell => {
      this.setCell(cell.x, cell.y, {
        type: cell.type,
        color: cell.color,
        emoji: cell.emoji
      });
    });
  }

  canPlacePiece(piece) {
    const cells = piece.getCells();
    return cells.every(cell => {
      if (cell.x < 0 || cell.x >= this.width) return false;
      if (cell.y >= this.height) return false;
      // Allow cells above the visible board (buffer zone), just check no overlap
      if (cell.y < -this.bufferHeight) return false;
      const boardCell = this.getCell(cell.x, cell.y);
      return boardCell === null;
    });
  }

  clearLines() {
    // Combine buffer + visible grid for unified clearing
    const fullGrid = [...this._buffer, ...this.grid];
    const newFullGrid = [];
    let linesCleared = 0;

    for (let y = fullGrid.length - 1; y >= 0; y--) {
      const isLineFull = fullGrid[y].every(cell => cell !== null);

      if (!isLineFull) {
        newFullGrid.unshift(fullGrid[y]);
      } else {
        linesCleared++;
      }
    }

    while (newFullGrid.length < fullGrid.length) {
      newFullGrid.unshift(Array(this.width).fill(null));
    }

    // Split back into buffer and visible grid
    this._buffer = newFullGrid.slice(0, this.bufferHeight);
    this.grid = newFullGrid.slice(this.bufferHeight);
    return linesCleared;
  }

  getFilledRows() {
    const filledRows = [];
    for (let y = 0; y < this.height; y++) {
      if (this.grid[y].every(cell => cell !== null)) {
        filledRows.push(y);
      }
    }
    return filledRows;
  }

  isGameOver() {
    // Block out: any block in the buffer zone means game over
    return this._buffer.some(row => row.some(cell => cell !== null));
  }

  getBoardState() {
    return this.grid.map(row => [...row]);
  }

  setBoardState(grid) {
    this.grid = grid.map(row => [...row]);
    // Reset buffer when restoring state
    this._buffer = this.createEmptyBuffer();
  }

  clear() {
    this.grid = this.createEmptyGrid();
    this._buffer = this.createEmptyBuffer();
  }

  addGarbageLines(count, gapColumn = -1) {
    if (count <= 0) return false;

    const gap = gapColumn >= 0 ? gapColumn : Math.floor(Math.random() * this.width);

    const garbageRows = [];
    for (let i = 0; i < count; i++) {
      const row = Array(this.width).fill(null).map((_, x) =>
        x === gap ? null : { type: 'garbage', color: '#808080', emoji: '⬜' }
      );
      garbageRows.push(row);
    }

    // Shift visible grid up — top rows go into buffer
    const removedFromGrid = this.grid.splice(0, count);
    // Shift buffer up and absorb removed grid rows
    const removedFromBuffer = this._buffer.splice(0, count);
    this._buffer.push(...removedFromGrid);

    this.grid.push(...garbageRows);

    const overflow = removedFromBuffer.some(row => row.some(cell => cell !== null));
    return overflow;
  }
}
