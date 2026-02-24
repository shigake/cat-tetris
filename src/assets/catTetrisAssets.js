/**
 * Cat Tetris — Semantic Asset Aliases
 * ====================================
 * DO NOT infer asset role by filename. Many source filenames are inconsistent.
 * Every image used in the app MUST be referenced through these aliases.
 *
 * Mapping was hand-verified by the project owner (visual inspection, not by name).
 *
 * Source (gpteco/)                         → Processed (public/cats/)      → Alias
 * ─────────────────────────────────────────────────────────────────────────────────
 * logo.png                                 → (public/)cat-icon.png         → LOGO
 * 02_button_continuar.png                  → btn-continuar.png             → ICON_TUTORIAL_PROFESSOR_TILE
 * 03_button_novo_jogo.png                  → btn-novo-jogo.png             → BUTTON_CONTINUAR
 * 04_button_vs_ia.png                      → btn-vs-ia.png                 → BUTTON_NOVO_JOGO
 * 05_icon_tutorial_cat_professor_square.png→ btn-tutorial-icon.png         → BUTTON_VS_IA
 * 06_button_criador_cat.png                → btn-criador.png               → TILE_TUTORIAL_CAT
 * 07_button_tutorial_cat_professor.png     → btn-tutorial.png              → BUTTON_LOJA
 * 08_button_ia_expert_cat.png              → btn-ia-expert.png             → BUTTON_CRIADOR
 * 09_button_loja_cat.png                   → btn-loja.png                  → BUTTON_IA_EXPERT
 */

const BASE = import.meta.env.BASE_URL;

// ──────────────────────────────────────────────
// 1) LOGO
// ──────────────────────────────────────────────
export const LOGO = `${BASE}cat-icon.png`;

// ──────────────────────────────────────────────
// 2) UI BUTTONS (role ≠ filename!)
// ──────────────────────────────────────────────

/** Green "Continuar" button (source: 03_button_novo_jogo.png) */
export const BUTTON_CONTINUAR = `${BASE}cats/btn-novo-jogo.png`;

/** Purple "Novo Jogo" button (source: 04_button_vs_ia.png) */
export const BUTTON_NOVO_JOGO = `${BASE}cats/btn-vs-ia.png`;

/** "VS IA" button (source: 05_icon_tutorial_cat_professor_square.png) */
export const BUTTON_VS_IA = `${BASE}cats/btn-tutorial-icon.png`;

/** "Criador" button with cat wearing a cap (source: 08_button_ia_expert_cat.png) */
export const BUTTON_CRIADOR = `${BASE}cats/btn-ia-expert.png`;

/** "IA Expert" button (source: 09_button_loja_cat.png) */
export const BUTTON_IA_EXPERT = `${BASE}cats/btn-loja.png`;

/** "Loja" button with bag (source: 07_button_tutorial_cat_professor.png) */
export const BUTTON_LOJA = `${BASE}cats/btn-tutorial.png`;

// ──────────────────────────────────────────────
// 3) TUTORIAL-SPECIFIC ICONS (not buttons)
// ──────────────────────────────────────────────

/** Square tile — professor cat with book (source: 02_button_continuar.png) */
export const ICON_TUTORIAL_PROFESSOR_TILE = `${BASE}cats/btn-continuar.png`;

/** Square tile — professor cat waving/paw (source: 06_button_criador_cat.png) */
export const TILE_TUTORIAL_CAT = `${BASE}cats/btn-criador.png`;

/** Professor head icon (source: 15_cat_professor_head.png) */
export const ICON_PROFESSOR_HEAD = `${BASE}cats/professor-head.png`;

// ──────────────────────────────────────────────
// 4) PAWS — status indicators
// ──────────────────────────────────────────────

export const PAW_NEUTRAL = `${BASE}cats/paw-white.png`;
export const PAW_HOVER_GLOW = `${BASE}cats/paw-gold.png`;
export const PAW_COMPLETED = `${BASE}cats/paw-green.png`;
export const PAW_ACTIVE_PURPLE = `${BASE}cats/paw-purple.png`;
export const PAW_ACTIVE_BLUE = `${BASE}cats/paw-blue.png`;
export const PAW_LOCKED = `${BASE}cats/paw-gold-lock.png`;
export const PAW_SPECIAL = `${BASE}cats/paw-gold-special.png`;
export const PAW_STAR = `${BASE}cats/paw-purple-star.png`;
export const PAW_DISABLED = `${BASE}cats/paw-blue-disabled.png`;

// ──────────────────────────────────────────────
// 5) PROFESSOR CATS — Tutorial ecosystem only
// ──────────────────────────────────────────────

/** Professor with board — fundamentals / tutorial home */
export const PROFESSOR_FUNDAMENTALS = `${BASE}cats/professor-1.png`;

/** Professor reading book — lesson cards / empty state */
export const PROFESSOR_READING = `${BASE}cats/professor-2.png`;

/** Professor with books & wand — intermediate header */
export const PROFESSOR_INTERMEDIATE = `${BASE}cats/professor-3.png`;

/** Professor with Tetris-piece board — technical lessons / T-Spin */
export const PROFESSOR_TECHNICAL = `${BASE}cats/professor-4.png`;

/** Professor with potion/lamp — advanced / tips / curiosities */
export const PROFESSOR_ADVANCED = `${BASE}cats/professor-5.png`;

/** Professor with laptop XP +100 — lesson complete / reward / XP */
export const PROFESSOR_REWARD = `${BASE}cats/professor-6.png`;

/** Array for indexed access (1-based → [0] = professor-1) */
export const PROFESSORS = [
  PROFESSOR_FUNDAMENTALS,
  PROFESSOR_READING,
  PROFESSOR_INTERMEDIATE,
  PROFESSOR_TECHNICAL,
  PROFESSOR_ADVANCED,
  PROFESSOR_REWARD,
];

// ──────────────────────────────────────────────
// 6) DECORATIVE SPRITES (cat_sprite_01..24)
// ──────────────────────────────────────────────

/** Helper to build sprite path */
const sprite = (n) => `${BASE}cats/sprite-${n}.png`;

// NEUTRAL / SIMPLE (menu, tutorial, empty states)
export const CAT_GRAY_WAVING = sprite(1);
export const CAT_ORANGE_PLAYFUL = sprite(2);
export const CAT_ORANGE_SITTING = sprite(7);
export const CAT_GRAY_SITTING = sprite(11);
export const CAT_BW_SITTING = sprite(15);

// SLEEPING / RESTING (loading, pause, idle, splash)
export const CAT_SLEEPING_YELLOW = sprite(3);
export const CAT_SLEEPING_PURPLE = sprite(4);
export const CAT_LYING_PURPLE = sprite(19);
export const CAT_LYING_YELLOW = sprite(20);

// WITH BLOCKS (gameplay HUD decoration, modes, creator, tutorial setup)
export const CAT_GRAY_PURPLE_BLOCKS = sprite(6);
export const CAT_BLACK_GREEN_BLOCKS = sprite(8);
export const CAT_GRAY_BLUE_BLOCKS = sprite(9);
export const CAT_GRAY_GREEN_MUSIC = sprite(10);
export const CAT_ORANGE_BLUE_CUBE = sprite(13);
export const CAT_BLACK_PURPLE_BLOCK = sprite(16);
export const CAT_ORANGE_GREEN_BLOCK = sprite(17);
export const CAT_ORANGE_L_BLOCK = sprite(18);
export const CAT_BLACK_GREEN_CARRY = sprite(21);

// THEMATIC / SPECIAL (specific screens)
export const CAT_WITH_FISH = sprite(5);        // Shop / rewards
export const CAT_RUNNING_BLOCKS = sprite(12);  // New game / sprint / transition
export const CAT_HIDDEN_BLOCKS = sprite(14);   // Creator / setups / puzzle mode
export const CAT_IN_BOX = sprite(22);          // Empty state / import-export
export const CAT_SCORE_SIGN = sprite(23);      // Record / high score / achievements
export const CAT_STATS_SIGN = sprite(24);      // Stats / ranking / benchmark

/** All sprites (1-based index → sprites[0] = sprite-1) */
export const ALL_SPRITES = Array.from({ length: 24 }, (_, i) => sprite(i + 1));
