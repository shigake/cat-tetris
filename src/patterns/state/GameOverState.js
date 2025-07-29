import { IGameState } from './IGameState.js';

export class GameOverState extends IGameState {
  enter(game) {
    game.setGameOver(true);
    game.saveHighScore();
  }

  exit(game) {
    game.setGameOver(false);
  }

  update(game, deltaTime) {
  }

  handleInput(game, input) {
    switch(input) {
      case 'restart':
        game.restart();
        break;
    }
  }

  getName() {
    return 'gameOver';
  }
} 