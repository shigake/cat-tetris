/**
 * Gamepad button mapping configuration.
 * Users can remap actions to different buttons.
 * Stored in localStorage for persistence.
 */

const STORAGE_KEY = 'catTetris_gamepadConfig';

// Standard gamepad button indices (Gamepad API)
export const GAMEPAD_BUTTONS = {
  A: 0,           // Face bottom (A/Cross)
  B: 1,           // Face right (B/Circle)
  X: 2,           // Face left (X/Square)
  Y: 3,           // Face top (Y/Triangle)
  LB: 4,          // Left bumper
  RB: 5,          // Right bumper
  LT: 6,          // Left trigger
  RT: 7,          // Right trigger
  BACK: 8,        // Back/Select/Share
  START: 9,       // Start/Options
  L3: 10,         // Left stick press
  R3: 11,         // Right stick press
  DPAD_UP: 12,
  DPAD_DOWN: 13,
  DPAD_LEFT: 14,
  DPAD_RIGHT: 15,
};

// Human-readable labels for each button
export const BUTTON_LABELS = {
  0: 'A',
  1: 'B',
  2: 'X',
  3: 'Y',
  4: 'LB',
  5: 'RB',
  6: 'LT',
  7: 'RT',
  8: 'Back',
  9: 'Start',
  10: 'L3',
  11: 'R3',
  12: 'D-Pad ↑',
  13: 'D-Pad ↓',
  14: 'D-Pad ←',
  15: 'D-Pad →',
};

// All remappable actions with default bindings
export const DEFAULT_MAPPINGS = {
  // --- Menu actions ---
  menuConfirm: 0,    // A
  menuBack: 1,       // B
  menuAltConfirm: 9, // Start

  // --- Game actions ---
  rotateCW: 0,       // A = rotate clockwise
  rotateCCW: 1,      // B = rotate counter-clockwise
  hardDrop: 12,      // D-Pad Up
  hold: 4,           // LB = hold piece
  pause: 9,          // Start = pause
  backToMenu: 8,     // Back = return to menu
};

// Descriptions for each action (Portuguese)
export const ACTION_LABELS = {
  menuConfirm: 'Confirmar (Menu)',
  menuBack: 'Voltar (Menu)',
  menuAltConfirm: 'Confirmar Alt (Menu)',
  rotateCW: 'Rotação Horária',
  rotateCCW: 'Rotação Anti-horária',
  hardDrop: 'Hard Drop',
  hold: 'Segurar Peça',
  pause: 'Pausar',
  backToMenu: 'Voltar ao Menu',
};

// Which actions are available for remapping (UI sections)
export const MENU_ACTIONS = ['menuConfirm', 'menuBack', 'menuAltConfirm'];
export const GAME_ACTIONS = ['rotateCW', 'rotateCCW', 'hardDrop', 'hold', 'pause', 'backToMenu'];

/**
 * Load saved mappings or return defaults.
 */
export function loadGamepadMappings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      // Merge with defaults so new actions get defaults
      return { ...DEFAULT_MAPPINGS, ...saved };
    }
  } catch { /* ignore */ }
  return { ...DEFAULT_MAPPINGS };
}

/**
 * Save mappings to localStorage.
 */
export function saveGamepadMappings(mappings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mappings));
  } catch { /* ignore */ }
}

/**
 * Reset to defaults and clear saved config.
 */
export function resetGamepadMappings() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch { /* ignore */ }
  return { ...DEFAULT_MAPPINGS };
}
