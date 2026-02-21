import { useState, useRef, useEffect, useCallback } from 'react';
import { loadGamepadMappings } from '../config/GamepadConfig';

const BUTTON_MAPPINGS = {
  DPAD_UP: 12,
  DPAD_DOWN: 13,
  DPAD_LEFT: 14,
  DPAD_RIGHT: 15,

  FACE_BUTTON_BOTTOM: 0,  // A (Xbox) / X (PS)
  FACE_BUTTON_RIGHT: 1,   // B (Xbox) / Circle (PS)
  FACE_BUTTON_LEFT: 2,    // X (Xbox) / Square (PS)
  FACE_BUTTON_TOP: 3,     // Y (Xbox) / Triangle (PS)

  BUMPER_LEFT: 4,          // LB / L1
  BUMPER_RIGHT: 5,         // RB / R1
  TRIGGER_LEFT: 6,         // LT / L2
  TRIGGER_RIGHT: 7,        // RT / R2

  BUTTON_BACK: 8,          // Back / Select / Share
  BUTTON_START: 9,         // Start / Options
  STICK_LEFT: 10,          // L3
  STICK_RIGHT: 11          // R3
};

export const useGamepad = (gameActions = null) => {
  const [connectedGamepads, setConnectedGamepads] = useState([]);
  const [isGamepadActive, setIsGamepadActive] = useState(false);

  const lastInputTimeRef = useRef({});
  const inputDelayRef = useRef(33);
  const lastButtonStatesRef = useRef({});
  const continuousInputRef = useRef({});
  const firstInputDelayRef = useRef(167);
  const TRIGGER_THRESHOLD = 0.5;
  const STICK_DEADZONE = 0.5;

  useEffect(() => {
    const handleGamepadConnected = (e) => {
      setConnectedGamepads(prev => {
        if (prev.some(gp => gp.index === e.gamepad.index)) return prev;
        return [...prev, e.gamepad];
      });
      setIsGamepadActive(true);

      try {
        if (e.gamepad.vibrationActuator) {
          e.gamepad.vibrationActuator.playEffect('dual-rumble', {
            duration: 200,
            strongMagnitude: 0.5,
            weakMagnitude: 0.5
          });
        }
      } catch (err) { /* vibration not supported */ }
    };

    const handleGamepadDisconnected = (e) => {
      setConnectedGamepads(prev => prev.filter(gp => gp.index !== e.gamepad.index));

      const remainingGamepads = navigator.getGamepads().filter(gp => gp && gp.connected);
      setIsGamepadActive(remainingGamepads.length > 0);
    };

    window.addEventListener('gamepadconnected', handleGamepadConnected);
    window.addEventListener('gamepaddisconnected', handleGamepadDisconnected);

    const checkInitialGamepads = () => {
      const gamepads = navigator.getGamepads();
      const connectedPads = Array.from(gamepads).filter(gp => gp && gp.connected);
      if (connectedPads.length > 0) {
        setConnectedGamepads(connectedPads);
        setIsGamepadActive(true);
      }
    };

    checkInitialGamepads();

    return () => {
      window.removeEventListener('gamepadconnected', handleGamepadConnected);
      window.removeEventListener('gamepaddisconnected', handleGamepadDisconnected);
    };
  }, []);

  const getStickDirection = useCallback((x, y, deadzone) => {
    const dz = deadzone ?? STICK_DEADZONE;
    if (Math.abs(x) < dz && Math.abs(y) < dz) return null;

    if (Math.abs(x) > Math.abs(y)) {
      return x > 0 ? 'right' : 'left';
    } else {
      return y > 0 ? 'down' : 'up';
    }
  }, []);

  const processGamepadInput = useCallback(() => {
    if (!isGamepadActive || !gameActions) {
      return;
    }

    const gamepads = navigator.getGamepads();
    const gamepad = Array.from(gamepads).find(gp => gp && gp.connected);

    if (!gamepad) return;

    const now = Date.now();
    const { movePiece, rotatePiece, rotatePieceLeft, hardDrop, holdPiece, pause, resume, togglePause } = gameActions;

    // Read user-configured button mappings
    const cfg = loadGamepadMappings();

    // System buttons: always active (pause, back to menu)
    const systemButtons = [
      {
        button: cfg.pause,
        action: () => {
          if (togglePause) {
            togglePause();
          } else if (pause) {
            pause();
          }
        }
      },
      {
        button: cfg.backToMenu,
        action: () => {
          if (gameActions.backToMenu) {
            gameActions.backToMenu();
          }
        }
      }
    ];

    systemButtons.forEach(({ button, action }) => {
      const pressed = gamepad.buttons[button]?.pressed;
      const wasPressed = lastButtonStatesRef.current[button];

      lastButtonStatesRef.current[button] = pressed;

      if (pressed && !wasPressed) {
        action();
        triggerVibration(gamepad, button);
      }
    });

    // Guard: if no movePiece, game actions not available yet
    if (!movePiece) {
      return;
    }

    // Guard: don't process game actions if game is over
    const isGameOver = gameActions.isGameOver?.() ?? false;

    const checkMovement = (action, buttonPressed) => {
      const actionKey = `movement_${action}`;
      const lastTime = lastInputTimeRef.current[actionKey] || 0;
      const wasPressed = continuousInputRef.current[actionKey] || false;

      if (buttonPressed && !wasPressed) {
        continuousInputRef.current[actionKey] = true;
        continuousInputRef.current[actionKey + '_start'] = now;
        lastInputTimeRef.current[actionKey] = now;
        executeMovementAction(action);
        return;
      }

      if (buttonPressed && wasPressed) {
        const timeSinceFirst = now - (continuousInputRef.current[actionKey + '_start'] || lastTime);
        const delay = timeSinceFirst < firstInputDelayRef.current
          ? firstInputDelayRef.current
          : inputDelayRef.current;

        if (now - lastTime >= delay) {
          lastInputTimeRef.current[actionKey] = now;
          executeMovementAction(action);
        }
        return;
      }

      if (!buttonPressed && wasPressed) {
        continuousInputRef.current[actionKey] = false;
        continuousInputRef.current[actionKey + '_start'] = 0;
      }
    };

    const executeMovementAction = (action) => {
      if (gameActions.movePiece) {
        gameActions.movePiece(action);
      }
    };

    // Movement: only when game is active
    if (!isGameOver) {
      const stickDir = getStickDirection(gamepad.axes[0], gamepad.axes[1]);

      const leftPressed = gamepad.buttons[BUTTON_MAPPINGS.DPAD_LEFT]?.pressed || stickDir === 'left';
      const rightPressed = gamepad.buttons[BUTTON_MAPPINGS.DPAD_RIGHT]?.pressed || stickDir === 'right';
      const downPressed = gamepad.buttons[BUTTON_MAPPINGS.DPAD_DOWN]?.pressed || stickDir === 'down';

      checkMovement('left', leftPressed);
      checkMovement('right', rightPressed);
      checkMovement('down', downPressed);

      // Hard drop from D-Pad Up or stick up (one-shot, not continuous)
      const currentButtonStates = {};

      // Build game buttons from user config
      // Collect unique button->action mappings, avoiding duplicates
      const gameButtonMap = new Map();
      const addBtn = (btn, action, isTrigger = false) => {
        if (btn !== undefined && btn !== null && !gameButtonMap.has(btn)) {
          gameButtonMap.set(btn, { action, isTrigger: isTrigger || btn === 6 || btn === 7 });
        }
      };

      addBtn(cfg.rotateCW, () => rotatePiece?.());
      addBtn(cfg.rotateCCW, () => rotatePieceLeft?.());
      addBtn(cfg.hardDrop, () => hardDrop?.());
      addBtn(cfg.hold, () => holdPiece?.());

      // Also keep some extra default bindings for buttons not remapped
      // X/Square and Y/Triangle rotate CW if not already used
      if (!gameButtonMap.has(2)) addBtn(2, () => rotatePiece?.());
      if (!gameButtonMap.has(3)) addBtn(3, () => rotatePiece?.());
      // Both bumpers hold if not already used
      if (!gameButtonMap.has(4)) addBtn(4, () => holdPiece?.());
      if (!gameButtonMap.has(5)) addBtn(5, () => holdPiece?.());
      // Triggers for rotation if not already used
      if (!gameButtonMap.has(6)) addBtn(6, () => rotatePieceLeft?.(), true);
      if (!gameButtonMap.has(7)) addBtn(7, () => rotatePiece?.(), true);

      const gameButtons = Array.from(gameButtonMap.entries()).map(([button, { action, isTrigger }]) => ({
        button, action, isTrigger
      }));

      gameButtons.forEach(({ button, action, isTrigger }) => {
        // For analog triggers (L2/R2), use threshold instead of .pressed
        const pressed = isTrigger
          ? (gamepad.buttons[button]?.value ?? 0) > TRIGGER_THRESHOLD
          : gamepad.buttons[button]?.pressed;
        const wasPressed = lastButtonStatesRef.current[button];

        currentButtonStates[button] = pressed;

        if (pressed && !wasPressed) {
          action();
          triggerVibration(gamepad, button);
        }
      });

      // Also check analog stick up as hard drop (one-shot)
      const stickUpKey = 'stick_up_hardDrop';
      if (stickDir === 'up' && !lastButtonStatesRef.current[stickUpKey]) {
        hardDrop?.();
        triggerVibration(gamepad, BUTTON_MAPPINGS.DPAD_UP);
      }
      currentButtonStates[stickUpKey] = stickDir === 'up';

      lastButtonStatesRef.current = { ...lastButtonStatesRef.current, ...currentButtonStates };
    }

  }, [isGamepadActive, getStickDirection, gameActions]);

  const triggerVibration = useCallback((gamepad, button) => {
    try {
      if (gamepad.vibrationActuator) {
        const isHardDrop = button === BUTTON_MAPPINGS.DPAD_UP;
        gamepad.vibrationActuator.playEffect('dual-rumble', {
          duration: isHardDrop ? 80 : 50,
          strongMagnitude: isHardDrop ? 0.3 : 0.1,
          weakMagnitude: isHardDrop ? 0.15 : 0.05
        });
      }
    } catch (err) { /* vibration not supported (Firefox, etc.) */ }
  }, []);

  const getGamepadInfo = useCallback(() => {
    const gamepads = navigator.getGamepads();
    const connectedPads = Array.from(gamepads).filter(gp => gp && gp.connected);

    if (connectedPads.length === 0) return [];

    return connectedPads.map(gp => ({
      id: gp.id,
      index: gp.index,
      connected: gp.connected,
      buttons: gp.buttons.length,
      axes: gp.axes.length,
      vibration: !!gp.vibrationActuator
    }));
  }, []);

  return {
    isGamepadActive,
    connectedGamepads,
    processGamepadInput,
    getGamepadInfo,
    controllerCount: connectedGamepads.length
  };
};
