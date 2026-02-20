export class Board {
  constructor(width = 10, height = 20) {
    this.width = width;
    this.height = height;
    this.grid = this.createEmptyGrid();
  }

  createEmptyGrid() {
    return Array(this.height).fill(null).map(() => Array(this.width).fill(null));
  }

  clone() {
    const newBoard = new Board(this.width, this.height);
    newBoard.grid = this.grid.map(row => [...row]);
    return newBoard;
  }

  isWithinBounds(x, y) {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  getCell(x, y) {
    if (!this.isWithinBounds(x, y)) return null;
    return this.grid[y][x];
  }

  setCell(x, y, cell) {
    if (!this.isWithinBounds(x, y)) return false;
    this.grid[y][x] = cell;
    return true;
  }

  clearCell(x, y) {
    if (!this.isWithinBounds(x, y)) return false;
    this.grid[y][x] = null;
    return true;
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
      if (!this.isWithinBounds(cell.x, cell.y)) {
        return false;
      }
      const boardCell = this.getCell(cell.x, cell.y);
      if (boardCell !== null) {
        return false;
      }
      return true;
    });
  }

  clearLines() {
    const newGrid = [];
    let linesCleared = 0;

    for (let y = this.height - 1; y >= 0; y--) {
      const isLineFull = this.grid[y].every(cell => cell !== null);

      if (!isLineFull) {
        newGrid.unshift(this.grid[y]);
      } else {
        linesCleared++;
      }
    }

    while (newGrid.length < this.height) {
      newGrid.unshift(Array(this.width).fill(null));
    }

    this.grid = newGrid;
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

    return this.grid[0].some(cell => cell !== null) ||
           this.grid[1].some(cell => cell !== null);
  }

  getBoardState() {
    return this.grid.map(row => [...row]);
  }

  setBoardState(grid) {
    this.grid = grid.map(row => [...row]);
  }

  clear() {
    this.grid = this.createEmptyGrid();
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

    const removed = this.grid.splice(0, count);
    const overflow = removed.some(row => row.some(cell => cell !== null));

    this.grid.push(...garbageRows);

    return overflow;
  }
}
