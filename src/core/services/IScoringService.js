export class IScoringService {
  calculateScore(linesCleared, level, combo, isTSpin, backToBack) { throw new Error('Must be implemented'); }
  calculateSoftDropPoints() { throw new Error('Must be implemented'); }
  calculateTSpinBonus(linesCleared) { throw new Error('Must be implemented'); }
  calculateBackToBackBonus(basePoints) { throw new Error('Must be implemented'); }
  calculateComboBonus(combo) { throw new Error('Must be implemented'); }
}
