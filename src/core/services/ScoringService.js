import { IScoringService } from './IScoringService.js';

export class ScoringService extends IScoringService {
  calculateScore(linesCleared, level, combo, isTSpin, backToBack) {
    let basePoints = this.getBasePoints(linesCleared);
    
    if (isTSpin) {
      basePoints = this.calculateTSpinBonus(linesCleared);
    }
    
    if (backToBack) {
      basePoints = this.calculateBackToBackBonus(basePoints);
    }
    
    basePoints *= level;
    basePoints += this.calculateComboBonus(combo);
    
    return basePoints;
  }

  calculateSoftDropPoints() {
    return 1;
  }

  calculateTSpinBonus(linesCleared) {
    const tspinPoints = [0, 800, 1200, 1600, 2000];
    return tspinPoints[linesCleared] || 0;
  }

  calculateBackToBackBonus(basePoints) {
    return Math.floor(basePoints * 1.5);
  }

  calculateComboBonus(combo) {
    return combo * 50;
  }

  getBasePoints(linesCleared) {
    const basePoints = [0, 100, 300, 500, 800];
    return basePoints[linesCleared] || 0;
  }
} 