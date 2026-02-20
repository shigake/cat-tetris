export class IGameState {
  enter(game) { throw new Error('Must be implemented'); }
  exit(game) { throw new Error('Must be implemented'); }
  update(game, deltaTime) { throw new Error('Must be implemented'); }
  handleInput(game, input) { throw new Error('Must be implemented'); }
  getName() { throw new Error('Must be implemented'); }
}
