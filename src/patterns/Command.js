export class GameCommand {
  constructor(execute, undo) {
    this.execute = execute;
    this.undo = undo;
  }
}

export class CommandInvoker {
  constructor() {
    this.commands = [];
    this.currentIndex = -1;
  }

  execute(command) {
    this.commands = this.commands.slice(0, this.currentIndex + 1);
    this.commands.push(command);
    this.currentIndex++;
    
    command.execute();
  }

  undo() {
    if (this.currentIndex >= 0) {
      this.commands[this.currentIndex].undo();
      this.currentIndex--;
    }
  }

  redo() {
    if (this.currentIndex < this.commands.length - 1) {
      this.currentIndex++;
      this.commands[this.currentIndex].execute();
    }
  }

  clear() {
    this.commands = [];
    this.currentIndex = -1;
  }

  canUndo() {
    return this.currentIndex >= 0;
  }

  canRedo() {
    return this.currentIndex < this.commands.length - 1;
  }
}

export const gameCommandInvoker = new CommandInvoker(); 