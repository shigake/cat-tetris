const STORAGE_KEY = 'catTetris_keyboardConfig';

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

export function loadKeyboardMappings() {
 try {
 const raw = localStorage.getItem(STORAGE_KEY);
 if (raw) {
 const saved = JSON.parse(raw);
 return { ...DEFAULT_KEY_MAPPINGS, ...saved };
 }
 } catch {  }
 return { ...DEFAULT_KEY_MAPPINGS };
}

export function saveKeyboardMappings(mappings) {
 try {
 localStorage.setItem(STORAGE_KEY, JSON.stringify(mappings));
 } catch {  }
}

export function resetKeyboardMappings() {
 try {
 localStorage.removeItem(STORAGE_KEY);
 } catch {  }
 return { ...DEFAULT_KEY_MAPPINGS };
}

export function buildKeyToActionMap(mappings) {
 const map = {};
 for (const [action, key] of Object.entries(mappings)) {
 map[key] = action;

 if (key.length === 1 && key !== key.toUpperCase()) {
 map[key.toUpperCase()] = action;
 }
 }

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
