const STORAGE_KEY = 'catTetris_gamepadConfig';

export const GAMEPAD_BUTTONS = {
 A: 0,
 B: 1,
 X: 2,
 Y: 3,
 LB: 4,
 RB: 5,
 LT: 6,
 RT: 7,
 BACK: 8,
 START: 9,
 L3: 10,
 R3: 11,
 DPAD_UP: 12,
 DPAD_DOWN: 13,
 DPAD_LEFT: 14,
 DPAD_RIGHT: 15,
};

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

export const DEFAULT_MAPPINGS = {

 menuConfirm: 0,
 menuBack: 1,
 menuAltConfirm: 9,

 rotateCW: 0,
 rotateCCW: 1,
 hardDrop: 12,
 hold: 4,
 pause: 9,
 backToMenu: 8,
};

export const ACTION_LABELS = {
 menuConfirm: 'gamepad.action.menuConfirm',
 menuBack: 'gamepad.action.menuBack',
 menuAltConfirm: 'gamepad.action.menuAltConfirm',
 rotateCW: 'gamepad.action.rotateCW',
 rotateCCW: 'gamepad.action.rotateCCW',
 hardDrop: 'gamepad.action.hardDrop',
 hold: 'gamepad.action.hold',
 pause: 'gamepad.action.pause',
 backToMenu: 'gamepad.action.backToMenu',
};

export const MENU_ACTIONS = ['menuConfirm', 'menuBack', 'menuAltConfirm'];
export const GAME_ACTIONS = ['rotateCW', 'rotateCCW', 'hardDrop', 'hold', 'pause', 'backToMenu'];

export function loadGamepadMappings() {
 try {
 const raw = localStorage.getItem(STORAGE_KEY);
 if (raw) {
 const saved = JSON.parse(raw);

 return { ...DEFAULT_MAPPINGS, ...saved };
 }
 } catch {  }
 return { ...DEFAULT_MAPPINGS };
}

export function saveGamepadMappings(mappings) {
 try {
 localStorage.setItem(STORAGE_KEY, JSON.stringify(mappings));
 } catch {  }
}

export function resetGamepadMappings() {
 try {
 localStorage.removeItem(STORAGE_KEY);
 } catch {  }
 return { ...DEFAULT_MAPPINGS };
}
