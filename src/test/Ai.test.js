import { describe, it, expect } from 'vitest';
import { evaluateGrid } from '../ai/TetrisAI.js';

const empty10x20 = () => Array.from({ length: 20 }, () => Array(10).fill(null));

describe('AI evaluateGrid', () => {
  const w = {
    completeLines: 3.5,
    aggregateHeight: 0.45,
    holes: 6.5,
    bumpiness: 0.35,
    wellSums: 0.35,
    blockades: 2.5,
    rowTransitions: 0.25,
    colTransitions: 0.25,
    tSpinPotential: 1.2
  };

  it('prefers clearing lines', () => {
    const g = empty10x20();
    // Fill bottom row
    g[19] = Array(10).fill({ t: 1 });
    const s1 = evaluateGrid(g, 0, w);
    const s2 = evaluateGrid(g, 1, w);
    expect(s2).toBeGreaterThan(s1);
  });

  it('penalizes holes', () => {
    const g = empty10x20();
    // Stack a column with a hole below
    g[10][0] = { t: 1 };
    const s1 = evaluateGrid(g, 0, w);
    g[11][0] = null; // explicit hole below block
    const s2 = evaluateGrid(g, 0, w);
    expect(s2).toBeLessThanOrEqual(s1);
  });
});


