import { IGameState } from './IGameState.js';

export class PausedState extends IGameState {
  enter(game) {
    game.setIsPaused(true);
  }

  exit(game) {
    game.setIsPaused(false);
  }

  update(game, deltaTime) {
  }

  handleInput(game, input) {
    switch(input) {
      case 'resume':
        game.setState('playing');
        break;
      case 'restart':
        game.restart();
        break;
    }
  }

  getName() {
    return 'paused';
  }
}
