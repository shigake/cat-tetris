import { useState, useRef, useEffect, useCallback } from 'react';

const BUTTON_MAPPINGS = {
  DPAD_UP: 12,
  DPAD_DOWN: 13, 
  DPAD_LEFT: 14,
  DPAD_RIGHT: 15,
  
  FACE_BUTTON_BOTTOM: 0,  // A (Xbox) / X (PlayStation)
  FACE_BUTTON_RIGHT: 1,   // B (Xbox) / Circle (PlayStation)
  FACE_BUTTON_LEFT: 2,    // X (Xbox) / Square (PlayStation)
  FACE_BUTTON_TOP: 3,     // Y (Xbox) / Triangle (PlayStation)
  
  BUMPER_LEFT: 4,         // LB (Xbox) / L1 (PlayStation)
  BUMPER_RIGHT: 5,        // RB (Xbox) / R1 (PlayStation)
  TRIGGER_LEFT: 6,        // LT (Xbox) / L2 (PlayStation)
  TRIGGER_RIGHT: 7,       // RT (Xbox) / R2 (PlayStation)
  
  BUTTON_BACK: 8,         // Back (Xbox) / Select (PlayStation)
  BUTTON_START: 9,        // Start (Xbox) / Start (PlayStation)
  STICK_LEFT: 10,         // Left Stick Button
  STICK_RIGHT: 11         // Right Stick Button
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
      console.log('🎮 Gamepad connected:', e.gamepad.id);
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
      console.log('🎮 Gamepad disconnected:', e.gamepad.id);
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
    const { movePiece, rotatePiece, hardDrop, holdPiece, pause } = gameActions;
    
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

    // D-Pad e Stick Left para movimento
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
    
    // Mapeamento oficial do Tetris:
    // A (Xbox) / X (PlayStation) = Hard Drop
    // B (Xbox) / Circle (PlayStation) = Rotate Right
    // X (Xbox) / Square (PlayStation) = Rotate Left
    // Y (Xbox) / Triangle (PlayStation) = Hold
    // Start = Pause
    // Back/Select = Pause (alternativo)
    
    [
      { button: BUTTON_MAPPINGS.FACE_BUTTON_BOTTOM, action: () => hardDrop?.() }, // A/X
      { button: BUTTON_MAPPINGS.FACE_BUTTON_RIGHT, action: () => rotatePiece?.() }, // B/Circle
      { button: BUTTON_MAPPINGS.FACE_BUTTON_LEFT, action: () => rotatePiece?.() }, // X/Square
      { button: BUTTON_MAPPINGS.FACE_BUTTON_TOP, action: () => holdPiece?.() }, // Y/Triangle
      { button: BUTTON_MAPPINGS.BUTTON_START, action: () => pause?.() }, // Start
      { button: BUTTON_MAPPINGS.BUTTON_BACK, action: () => pause?.() } // Back/Select
    ].forEach(({ button, action }) => {
      const pressed = gamepad.buttons[button]?.pressed;
      const wasPressed = lastButtonStatesRef.current[button];
      
      currentButtonStates[button] = pressed;
      
      if (pressed && !wasPressed) {
        action();
        
        if (gamepad.vibrationActuator) {
          const intensity = button === BUTTON_MAPPINGS.FACE_BUTTON_BOTTOM ? 0.3 : 0.1;
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

  const setInputDelay = useCallback((delay) => {
    inputDelayRef.current = Math.max(50, Math.min(500, delay));
  }, []);

  const setMovementSpeed = useCallback((preset) => {
    switch (preset) {
      case 'slow': setInputDelay(200); break;
      case 'normal': setInputDelay(150); break;
      case 'fast': setInputDelay(100); break;
      case 'turbo': setInputDelay(50); break;
      default: setInputDelay(150);
    }
  }, [setInputDelay]);

  return {
    isGamepadActive,
    connectedGamepads,
    processGamepadInput,
    getGamepadInfo,
    setInputDelay,
    setMovementSpeed,
    controllerCount: connectedGamepads.length
  };
}; 