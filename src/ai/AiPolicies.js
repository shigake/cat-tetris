export const Difficulty = {
  Easy: 'Easy',
  Normal: 'Normal',
  Hard: 'Hard'
};

export const Personality = {
  GatoPreguicoso: 'GatoPreguicoso',
  GatoEquilibrado: 'GatoEquilibrado',
  GatoAgressivo: 'GatoAgressivo'
};

// Base weights tuned for sensible play
const baseWeights = {
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

export const AiPresets = {
  Easy: { depth: 1, weights: { ...baseWeights, holes: 8, aggregateHeight: 0.6, bumpiness: 0.5 }, garbageFactor: 0.8, speedMs: 140, nodeBudget: 120, timeBudgetMs: 0.5 },
  Normal: { depth: 2, weights: { ...baseWeights }, garbageFactor: 1.0, speedMs: 110, nodeBudget: 240, timeBudgetMs: 0.7 },
  Hard: { depth: 3, weights: { ...baseWeights, holes: 8.5, rowTransitions: 0.4, colTransitions: 0.4 }, garbageFactor: 1.2, speedMs: 90, nodeBudget: 480, timeBudgetMs: 0.9 },
  Personalities: {
    GatoPreguicoso: { tweak: { aggregateHeight: +0.2, holes: -1.0, bumpiness: +0.2, speedMs: +20 } },
    GatoEquilibrado: { tweak: {} },
    GatoAgressivo: { tweak: { completeLines: +1.2, tSpinPotential: +0.6, bumpiness: -0.1, speedMs: -15 } }
  }
};

export function mergePolicy(difficulty, personality) {
  const base = { ...(AiPresets[difficulty] || AiPresets.Normal) };
  const tweak = AiPresets.Personalities[personality]?.tweak || {};
  const merged = {
    ...base,
    weights: { ...base.weights },
  };
  for (const [k, v] of Object.entries(tweak)) {
    if (k === 'speedMs') {
      merged.speedMs = Math.max(30, (merged.speedMs || 110) + v);
    } else if (k in merged.weights) {
      merged.weights[k] = merged.weights[k] + v;
    }
  }
  return merged;
}


