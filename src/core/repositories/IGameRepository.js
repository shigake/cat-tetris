export class IGameRepository {
  saveHighScore(score) { throw new Error('Must be implemented'); }
  getHighScore() { throw new Error('Must be implemented'); }
  saveSettings(settings) { throw new Error('Must be implemented'); }
  getSettings() { throw new Error('Must be implemented'); }
  saveGameState(state) { throw new Error('Must be implemented'); }
  getGameState() { throw new Error('Must be implemented'); }
  clearGameState() { throw new Error('Must be implemented'); }
}
