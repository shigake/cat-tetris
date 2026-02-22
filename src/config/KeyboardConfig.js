/**
 * Keyboard key mapping configuration.
 * Users can remap actions to different keys.
 * Stored in localStorage for persistence.
 */

const STORAGE_KEY = 'catTetris_keyboardConfig';

// All remappable actions with default key bindings
export const DEFAULT_KEY_MAPPINGS = {
  moveLeft: 'ArrowLeft',
  moveRight: 'ArrowRight',
  moveDown: 'ArrowDown',
  rotate: 'ArrowUp',
  rotateLeft: 'z',
  hardDrop: ' ',
  hold: 'c',
  pause: 'Escape',
};

// Human-readable label for a key value
export function keyDisplayName(key) {
  const names = {
    ' ': 'Space',
    'ArrowLeft': '←',
    'ArrowRight': '→',
    'ArrowUp': '↑',
    'ArrowDown': '↓',
    'Escape': 'Esc',
    'Shift': 'Shift',
    'Control': 'Ctrl',
    'Alt': 'Alt',
    'Tab': 'Tab',
    'Enter': 'Enter',
    'Backspace': 'Backspace',
    'Delete': 'Delete',
    'CapsLock': 'CapsLock',
  };
  return names[key] || key.toUpperCase();
}

// All keyboard-remappable game actions
export const KEYBOARD_ACTIONS = [
  'moveLeft',
  'moveRight',
  'moveDown',
  'rotate',
  'rotateLeft',
  'hardDrop',
  'hold',
  'pause',
];

/**
 * Load saved key mappings or return defaults.
 */
export function loadKeyboardMappings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      return { ...DEFAULT_KEY_MAPPINGS, ...saved };
    }
  } catch { /* ignore */ }
  return { ...DEFAULT_KEY_MAPPINGS };
}

/**
 * Save key mappings to localStorage.
 */
export function saveKeyboardMappings(mappings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mappings));
  } catch { /* ignore */ }
}

/**
 * Reset to defaults and clear saved config.
 */
export function resetKeyboardMappings() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch { /* ignore */ }
  return { ...DEFAULT_KEY_MAPPINGS };
}

/**
 * Build the reverse map (key → action) used by KeyboardInputService.
 * Includes secondary bindings (X for rotate, Shift for hold, P for pause).
 */
export function buildKeyToActionMap(mappings) {
  const map = {};
  for (const [action, key] of Object.entries(mappings)) {
    map[key] = action;
    // Also add uppercase variant for letter keys
    if (key.length === 1 && key !== key.toUpperCase()) {
      map[key.toUpperCase()] = action;
    }
  }
  // Add common secondary bindings that don't conflict
  if (!map['x'] && !map['X']) {
    map['x'] = 'rotate';
    map['X'] = 'rotate';
  }
  if (!map['Shift']) {
    map['Shift'] = 'hold';
  }
  if (!map['p'] && !map['P']) {
    map['p'] = 'pause';
    map['P'] = 'pause';
  }
  return map;
}
