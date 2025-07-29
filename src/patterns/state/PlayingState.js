import { IGameState } from './IGameState.js';

export class PlayingState extends IGameState {
  enter(game) {
    game.setIsPlaying(true);
    game.startGameLoop();
  }

  exit(game) {
    game.setIsPlaying(false);
    game.stopGameLoop();
  }

  update(game, deltaTime) {
    game.updateGameLoop(deltaTime);
  }

  handleInput(game, input) {
    switch(input) {
      case 'pause':
        game.setState('paused');
        break;
      case 'gameOver':
        game.setState('gameOver');
        break;
      case 'left':
        game.movePiece('left');
        break;
      case 'right':
        game.movePiece('right');
        break;
      case 'down':
        game.movePiece('down');
        break;
      case 'rotate':
        game.rotatePiece();
        break;
      case 'hardDrop':
        game.hardDrop();
        break;
      case 'hold':
        game.holdPiece();
        break;
    }
  }

  getName() {
    return 'playing';
  }
} 