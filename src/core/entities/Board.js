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
      if (!this.isWithinBounds(cell.x, cell.y)) return false;
      return this.getCell(cell.x, cell.y) === null;
    });
  }

  clearLines() {
    const linesToClear = [];
    
    for (let y = 0; y < this.height; y++) {
      if (this.grid[y].every(cell => cell !== null)) {
        linesToClear.push(y);
      }
    }

    if (linesToClear.length > 0) {
      linesToClear.forEach(lineY => {
        this.grid.splice(lineY, 1);
        this.grid.unshift(Array(this.width).fill(null));
      });
    }

    return linesToClear.length;
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
    return this.grid[0].some(cell => cell !== null);
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
} 