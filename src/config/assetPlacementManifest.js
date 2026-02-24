/**
 * Cat Tetris — Asset Placement Manifest
 * ======================================
 * DO NOT infer by filename; use manifest aliases.
 *
 * This file defines WHERE each asset goes, per screen.
 * All components must import from here (or from catTetrisAssets.js).
 * If an asset is not in a screen's pool, it MUST NOT appear on that screen.
 *
 * Decorative images must have: pointer-events: none, aria-hidden="true"
 * Decorative z-index: behind content (z-0 or negative)
 * Gameplay board: NO decorative images covering board/score/next/hold
 */

import {
  // Logo
  LOGO,
  // Buttons
  BUTTON_CONTINUAR,
  BUTTON_NOVO_JOGO,
  BUTTON_VS_IA,
  BUTTON_CRIADOR,
  BUTTON_IA_EXPERT,
  BUTTON_LOJA,
  // Tutorial icons
  ICON_TUTORIAL_PROFESSOR_TILE,
  TILE_TUTORIAL_CAT,
  ICON_PROFESSOR_HEAD,
  // Paws
  PAW_NEUTRAL,
  PAW_HOVER_GLOW,
  PAW_COMPLETED,
  PAW_ACTIVE_PURPLE,
  PAW_ACTIVE_BLUE,
  PAW_LOCKED,
  PAW_SPECIAL,
  PAW_STAR,
  PAW_DISABLED,
  // Professors
  PROFESSOR_FUNDAMENTALS,
  PROFESSOR_READING,
  PROFESSOR_INTERMEDIATE,
  PROFESSOR_TECHNICAL,
  PROFESSOR_ADVANCED,
  PROFESSOR_REWARD,
  PROFESSORS,
  // Decorative sprites
  CAT_GRAY_WAVING,
  CAT_ORANGE_PLAYFUL,
  CAT_ORANGE_SITTING,
  CAT_GRAY_SITTING,
  CAT_BW_SITTING,
  CAT_SLEEPING_YELLOW,
  CAT_SLEEPING_PURPLE,
  CAT_LYING_PURPLE,
  CAT_LYING_YELLOW,
  CAT_GRAY_PURPLE_BLOCKS,
  CAT_BLACK_GREEN_BLOCKS,
  CAT_GRAY_BLUE_BLOCKS,
  CAT_GRAY_GREEN_MUSIC,
  CAT_ORANGE_BLUE_CUBE,
  CAT_BLACK_PURPLE_BLOCK,
  CAT_ORANGE_GREEN_BLOCK,
  CAT_ORANGE_L_BLOCK,
  CAT_BLACK_GREEN_CARRY,
  CAT_WITH_FISH,
  CAT_RUNNING_BLOCKS,
  CAT_HIDDEN_BLOCKS,
  CAT_IN_BOX,
  CAT_SCORE_SIGN,
  CAT_STATS_SIGN,
} from '../assets/catTetrisAssets.js';

// ──────────────────────────────────────────────
// A) MAIN MENU
// ──────────────────────────────────────────────
export const mainMenu = {
  logo: LOGO,
  buttons: {
    continuar: BUTTON_CONTINUAR,
    novoJogo: BUTTON_NOVO_JOGO,
    vsIA: BUTTON_VS_IA,
    tutorial: ICON_TUTORIAL_PROFESSOR_TILE, // professor tile as card icon
    criador: BUTTON_CRIADOR,
    iaExpert: BUTTON_IA_EXPERT,
    loja: BUTTON_LOJA,
  },
  quickButtons: {
    shop: BUTTON_LOJA,
    missions: PAW_HOVER_GLOW,        // gold paw for missions
    achievements: PAW_STAR,           // purple star paw for achievements
  },
  paws: {
    neutral: PAW_NEUTRAL,
    hover: PAW_HOVER_GLOW,
  },
  /** Decorative sprites allowed in menu corners/background only */
  decorativePool: [
    CAT_GRAY_WAVING,
    CAT_ORANGE_PLAYFUL,
    CAT_ORANGE_SITTING,
    CAT_GRAY_SITTING,
    CAT_BW_SITTING,
    CAT_ORANGE_GREEN_BLOCK,
    CAT_LYING_YELLOW,
  ],
};

// ──────────────────────────────────────────────
// B) GAMEPLAY (classic / single board)
// ──────────────────────────────────────────────
export const gameplay = {
  /** Only low-opacity background/corner decoration. NEVER cover board/HUD. */
  decorativePool: [
    CAT_SLEEPING_YELLOW,
    CAT_SLEEPING_PURPLE,
    CAT_GRAY_BLUE_BLOCKS,
    CAT_GRAY_GREEN_MUSIC,
    CAT_ORANGE_L_BLOCK,
    CAT_LYING_PURPLE,
    CAT_LYING_YELLOW,
  ],
  /** For "Game Start" / transition overlay (not during active play) */
  gameStartCat: CAT_RUNNING_BLOCKS,
  /** Score result / record screen */
  resultCats: {
    lowScore: CAT_LYING_PURPLE,       // sprite 19 — relaxed
    midScore: CAT_WITH_FISH,          // sprite 5 — rewarded
    highScore: CAT_GRAY_WAVING,       // sprite 1 — celebrating
    recordSign: CAT_SCORE_SIGN,       // sprite 23
  },
  decorativeOpacityRange: [0.06, 0.15],
};

// ──────────────────────────────────────────────
// C) VS IA / IA VS IA
// ──────────────────────────────────────────────
export const vsIA = {
  entryButton: BUTTON_VS_IA,
  /** Discrete side decoration during match */
  decorativePool: [
    CAT_BLACK_GREEN_BLOCKS,
    CAT_BLACK_PURPLE_BLOCK,
    CAT_BLACK_GREEN_CARRY,
  ],
  /** Score/ranking overlays */
  scoreCats: {
    scoreSign: CAT_SCORE_SIGN,
    statsSign: CAT_STATS_SIGN,
  },
};

// ──────────────────────────────────────────────
// D) TUTORIAL (lesson list, progress, lesson screens)
// ──────────────────────────────────────────────
export const tutorial = {
  /** Hub / lesson list header → professor with board (fundamentals) */
  hubHeader: PROFESSOR_FUNDAMENTALS,
  /** Cards / empty state → professor reading book */
  emptyState: PROFESSOR_READING,
  /** Intermediate section header */
  intermediateHeader: PROFESSOR_INTERMEDIATE,
  /** Technical lesson intro (T-Spin, setups) */
  technicalIntro: PROFESSOR_TECHNICAL,
  /** Advanced section / tips */
  advancedHeader: PROFESSOR_ADVANCED,
  /** Lesson complete / XP gained */
  lessonComplete: PROFESSOR_REWARD,
  /** All professors for step rotation */
  professors: PROFESSORS,
  /** Icons */
  professorTile: ICON_TUTORIAL_PROFESSOR_TILE,
  tutorialCatTile: TILE_TUTORIAL_CAT,
  professorHead: ICON_PROFESSOR_HEAD,
  /** Difficulty paws (beginner → expert) */
  difficultyPaws: {
    beginner: PAW_COMPLETED,       // green check
    intermediate: PAW_ACTIVE_BLUE, // blue
    advanced: PAW_ACTIVE_PURPLE,   // purple
    expert: PAW_HOVER_GLOW,        // gold
  },
  statusPaws: {
    completed: PAW_COMPLETED,
    locked: PAW_LOCKED,
    special: PAW_SPECIAL,
    disabled: PAW_DISABLED,
  },
  /** Decorative sprites (setup/piece themed) */
  decorativePool: [
    CAT_GRAY_PURPLE_BLOCKS,
    CAT_ORANGE_BLUE_CUBE,
    CAT_HIDDEN_BLOCKS,
    CAT_ORANGE_L_BLOCK,
    CAT_IN_BOX,
  ],
};

// ──────────────────────────────────────────────
// E) CREATOR MODE
// ──────────────────────────────────────────────
export const creator = {
  entryButton: BUTTON_CRIADOR,
  decorativePool: [
    CAT_HIDDEN_BLOCKS,
    CAT_ORANGE_L_BLOCK,
    CAT_IN_BOX,
    CAT_GRAY_PURPLE_BLOCKS,
    CAT_ORANGE_BLUE_CUBE,
  ],
  infoPanel: CAT_STATS_SIGN,      // sprite 24 for info/export/stats
  recordSign: CAT_SCORE_SIGN,     // sprite 23 for leaderboard/record
};

// ──────────────────────────────────────────────
// F) SHOP / ACHIEVEMENTS / MISSIONS
// ──────────────────────────────────────────────
export const shop = {
  entryButton: BUTTON_LOJA,
  decorativePool: [
    CAT_WITH_FISH,   // fish = shop/rewards
    CAT_IN_BOX,      // box = items/crate
  ],
};

export const achievements = {
  paws: {
    gold: PAW_HOVER_GLOW,
    star: PAW_STAR,
    locked: PAW_LOCKED,
    completed: PAW_COMPLETED,
  },
  decorativePool: [
    CAT_SCORE_SIGN,
    CAT_STATS_SIGN,
  ],
};

export const missions = {
  paws: {
    active: PAW_ACTIVE_PURPLE,
    completed: PAW_COMPLETED,
    neutral: PAW_NEUTRAL,
  },
  decorativePool: [
    CAT_RUNNING_BLOCKS,  // action/running
  ],
};

// ──────────────────────────────────────────────
// G) GLOBAL / SHARED
// ──────────────────────────────────────────────
export const global = {
  loadingSpinner: {
    centerCat: CAT_ORANGE_SITTING,    // sprite 7
    pawDots: PAW_ACTIVE_PURPLE,
  },
  scoreboard: {
    pawDecoration: PAW_ACTIVE_PURPLE,
  },
  gameOver: {
    lowScoreCat: CAT_LYING_PURPLE,    // sprite 19
    midScoreCat: CAT_WITH_FISH,       // sprite 5
    highScoreCat: CAT_GRAY_WAVING,    // sprite 1
    tipsPaw: PAW_NEUTRAL,
  },
  statistics: {
    headerCat: CAT_SLEEPING_YELLOW,   // sprite 3
  },
  leaderboard: {
    emptyState: CAT_BW_SITTING,       // sprite 15
  },
  dailyMissions: {
    emptyState: CAT_GRAY_GREEN_MUSIC, // sprite 10
  },
  achievementsPanel: {
    emptyState: CAT_BLACK_GREEN_CARRY, // sprite 21
  },
};

// ──────────────────────────────────────────────
// H) PAWS — status indicators (re-export for convenience)
// ──────────────────────────────────────────────
export const statusPaws = {
  neutral: PAW_NEUTRAL,
  hover: PAW_HOVER_GLOW,
  completed: PAW_COMPLETED,
  activePurple: PAW_ACTIVE_PURPLE,
  activeBlue: PAW_ACTIVE_BLUE,
  locked: PAW_LOCKED,
  special: PAW_SPECIAL,
  star: PAW_STAR,
  disabled: PAW_DISABLED,
};

// ──────────────────────────────────────────────
// Utility: pick N random decoratives from a pool (seeded per screen key)
// ──────────────────────────────────────────────

/**
 * deterministic pseudo-random from a string seed
 * Returns a function that produces values in [0,1)
 */
function seededRandom(seed) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
    h = Math.imul(h ^ (h >>> 13), 0x45d9f3b);
    h = (h ^ (h >>> 16)) >>> 0;
    return h / 0x100000000;
  };
}

/**
 * Pick `count` decorative sprites from a pool, deterministic per screenKey.
 * Returns array of { src, position } objects for placement.
 *
 * @param {string[]} pool - Array of image paths
 * @param {string} screenKey - e.g. 'mainMenu', 'gameplay', 'tutorial'
 * @param {number} count - How many to pick (default: 2)
 * @returns {{ src: string, style: object }[]}
 */
export function pickDecoratives(pool, screenKey, count = 2) {
  if (!pool || pool.length === 0) return [];
  const rand = seededRandom(screenKey);
  const picked = [];
  const used = new Set();

  const n = Math.min(count, pool.length);
  while (picked.length < n) {
    const idx = Math.floor(rand() * pool.length);
    if (used.has(idx)) continue;
    used.add(idx);

    // Generate corner-biased positions (avoid center content)
    const side = rand() > 0.5 ? 'right' : 'left';
    const vertical = rand() > 0.5 ? 'top' : 'bottom';

    picked.push({
      src: pool[idx],
      style: {
        position: 'absolute',
        [side]: `${Math.floor(rand() * 12)}px`,
        [vertical]: `${Math.floor(rand() * 40 + 10)}px`,
        width: '3rem',
        height: 'auto',
        opacity: 0.1 + rand() * 0.08,
        pointerEvents: 'none',
        zIndex: 0,
        transform: `rotate(${Math.floor(rand() * 30 - 15)}deg)`,
      },
    });
  }
  return picked;
}
