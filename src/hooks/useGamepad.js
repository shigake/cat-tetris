import { useState, useRef, useEffect, useCallback } from 'react';

const BUTTON_MAPPINGS = {
  DPAD_UP: 12,
  DPAD_DOWN: 13, 
  DPAD_LEFT: 14,
  DPAD_RIGHT: 15,
  
  FACE_BUTTON_BOTTOM: 0,
  FACE_BUTTON_RIGHT: 1,
  FACE_BUTTON_LEFT: 2,
  FACE_BUTTON_TOP: 3,
  
  BUMPER_LEFT: 4,
  BUMPER_RIGHT: 5,
  TRIGGER_LEFT: 6,
  TRIGGER_RIGHT: 7,
  
  BUTTON_BACK: 8,
  BUTTON_START: 9,
  STICK_LEFT: 10,
  STICK_RIGHT: 11
};

export const useGamepad = (gameActions = null) => {
  const [connectedGamepads, setConnectedGamepads] = useState([]);
  const [isGamepadActive, setIsGamepadActive] = useState(false);
  
  const lastInputTimeRef = useRef({});
  const inputDelayRef = useRef(100);
  const lastButtonStatesRef = useRef({});
  const continuousInputRef = useRef({});
  const firstInputDelayRef = useRef(200);

  useEffect(() => {
    const handleGamepadConnected = (e) => {
      setConnectedGamepads(prev => [...prev, e.gamepad]);
      setIsGamepadActive(true);
      
      if (e.gamepad.vibrationActuator) {
        e.gamepad.vibrationActuator.playEffect('dual-rumble', {
          duration: 200,
          strongMagnitude: 0.5,
          weakMagnitude: 0.5
        });
      }
    };

    const handleGamepadDisconnected = (e) => {
      setConnectedGamepads(prev => prev.filter(gp => gp.id !== e.gamepad.id));
      
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

  const getStickDirection = useCallback((x, y, deadzone = 0.3) => {
    if (Math.abs(x) < deadzone && Math.abs(y) < deadzone) return null;
    
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
    const { movePiece, rotatePiece, rotatePieceLeft, hardDrop, holdPiece, pause } = gameActions;
    
    if (!movePiece) {
      return;
    }

    const checkMovement = (action, buttonPressed) => {
      const actionKey = `movement_${action}`;
      const lastTime = lastInputTimeRef.current[actionKey] || 0;
      const wasPressed = continuousInputRef.current[actionKey] || false;

      if (buttonPressed && !wasPressed) {
        continuousInputRef.current[actionKey] = true;
        lastInputTimeRef.current[actionKey] = now;
        executeMovementAction(action);
        return;
      }

      if (buttonPressed && wasPressed) {
        const firstDelay = firstInputDelayRef.current;
        const repeatDelay = inputDelayRef.current;
        
        const timeThreshold = (lastTime === lastInputTimeRef.current[actionKey] && 
                             now - lastTime >= firstDelay) ? firstDelay : repeatDelay;
        
        if (now - lastTime >= timeThreshold) {
          lastInputTimeRef.current[actionKey] = now;
          executeMovementAction(action);
        }
        return;
      }

      if (!buttonPressed && wasPressed) {
        continuousInputRef.current[actionKey] = false;
      }
    };

    const executeMovementAction = (action) => {
      if (gameActions.movePiece) {
        gameActions.movePiece(action);
      }
    };

    const leftPressed = gamepad.buttons[BUTTON_MAPPINGS.DPAD_LEFT]?.pressed || 
                       getStickDirection(gamepad.axes[0], gamepad.axes[1]) === 'left';
    const rightPressed = gamepad.buttons[BUTTON_MAPPINGS.DPAD_RIGHT]?.pressed || 
                        getStickDirection(gamepad.axes[0], gamepad.axes[1]) === 'right';
    const downPressed = gamepad.buttons[BUTTON_MAPPINGS.DPAD_DOWN]?.pressed || 
                       getStickDirection(gamepad.axes[0], gamepad.axes[1]) === 'down';

    checkMovement('left', leftPressed);
    checkMovement('right', rightPressed);
    checkMovement('down', downPressed);

    const currentButtonStates = {};
    
    [
      { button: BUTTON_MAPPINGS.DPAD_UP, action: () => hardDrop?.() },
      { button: BUTTON_MAPPINGS.FACE_BUTTON_BOTTOM, action: () => rotatePiece?.() },
      { button: BUTTON_MAPPINGS.FACE_BUTTON_RIGHT, action: () => rotatePieceLeft?.() },
      { button: BUTTON_MAPPINGS.FACE_BUTTON_LEFT, action: () => rotatePiece?.() },
      { button: BUTTON_MAPPINGS.FACE_BUTTON_TOP, action: () => rotatePiece?.() },
      { button: BUTTON_MAPPINGS.BUMPER_LEFT, action: () => holdPiece?.() },
      { button: BUTTON_MAPPINGS.BUMPER_RIGHT, action: () => holdPiece?.() },
      { button: BUTTON_MAPPINGS.BUTTON_START, action: () => pause?.() }
    ].forEach(({ button, action }) => {
      const pressed = gamepad.buttons[button]?.pressed;
      const wasPressed = lastButtonStatesRef.current[button];
      
      currentButtonStates[button] = pressed;
      
      if (pressed && !wasPressed) {
        action();
        
        if (gamepad.vibrationActuator) {
          const intensity = button === BUTTON_MAPPINGS.DPAD_UP ? 0.3 : 0.1;
          gamepad.vibrationActuator.playEffect('dual-rumble', {
            duration: 50,
            strongMagnitude: intensity,
            weakMagnitude: intensity * 0.5
          });
        }
      }
    });

    lastButtonStatesRef.current = currentButtonStates;
  }, [isGamepadActive, getStickDirection, gameActions]);

  const getGamepadInfo = useCallback(() => {
    const gamepads = navigator.getGamepads();
    const gamepad = Array.from(gamepads).find(gp => gp && gp.connected);
    
    if (!gamepad) return null;
    
    return {
      id: gamepad.id,
      index: gamepad.index,
      connected: gamepad.connected,
      buttonsCount: gamepad.buttons.length,
      axesCount: gamepad.axes.length
    };
  }, []);

  return {
    isGamepadActive,
    connectedGamepads,
    processGamepadInput,
    getGamepadInfo,
    controllerCount: connectedGamepads.length
  };
}; 