import { useState, useEffect, useCallback, useRef } from 'react';

export function useGamepad() {
  const [connectedGamepads, setConnectedGamepads] = useState([]);
  const [isGamepadActive, setIsGamepadActive] = useState(false);
  const lastInputTimeRef = useRef(0);
  const inputDelayRef = useRef(100); // ms delay between inputs (mais rápido)
  const lastButtonStatesRef = useRef(new Map());
  const continuousInputRef = useRef(new Map()); // Para inputs contínuos
  const firstInputDelayRef = useRef(200); // Delay inicial antes de repetir

  // 🎮 Gamepad button mapping for different controllers
  const BUTTON_MAPPINGS = {
    // Standard gamepad mapping (Xbox, PlayStation, etc.)
    // Based on HTML5 Gamepad API standard mapping
    standard: {
      // D-pad and left stick for movement
      moveLeft: [14, 'leftStickLeft'],   // D-pad left (14) or left stick left
      moveRight: [15, 'leftStickRight'], // D-pad right (15) or left stick right
      moveDown: [13, 'leftStickDown'],   // D-pad down (13) or left stick down
      softDrop: [13, 'leftStickDown'],   // D-pad down (same as move down)
      
      // Face buttons for actions (A=0, B=1, X=2, Y=3)
      rotate: [0, 1, 2, 3],             // A, B, X, Y buttons for rotate
      hardDrop: [12],                   // D-pad up (12) for hard drop
      hold: [4, 5],                     // LB(4)/RB(5) shoulder buttons for hold
      pause: [9, 8],                    // Start(9) or Select(8) button for pause
      
      // Trigger buttons (LT=6, RT=7)
      rotateCW: [7],                    // Right trigger (RT) for clockwise rotate
      rotateCCW: [6],                   // Left trigger (LT) for counter-clockwise
    }
  };

  // 🎮 Detect gamepad connection/disconnection
  useEffect(() => {
    const handleGamepadConnected = (event) => {
      console.log('🎮 Gamepad connected:', event.gamepad);
      setConnectedGamepads(prev => [...prev, event.gamepad]);
      setIsGamepadActive(true);
      
      // Haptic feedback for connection
      if (event.gamepad.vibrationActuator) {
        event.gamepad.vibrationActuator.playEffect('dual-rumble', {
          duration: 200,
          strongMagnitude: 0.3,
          weakMagnitude: 0.3,
        });
      }
    };

    const handleGamepadDisconnected = (event) => {
      console.log('🎮 Gamepad disconnected:', event.gamepad);
      setConnectedGamepads(prev => prev.filter(gp => gp.index !== event.gamepad.index));
      
      // Check if any gamepads still connected
      const remainingGamepads = navigator.getGamepads().filter(gp => gp && gp.connected);
      setIsGamepadActive(remainingGamepads.length > 0);
    };

    window.addEventListener('gamepadconnected', handleGamepadConnected);
    window.addEventListener('gamepaddisconnected', handleGamepadDisconnected);

    // Initial check for already connected gamepads
    const checkInitialGamepads = () => {
      const gamepads = navigator.getGamepads();
      const connected = Array.from(gamepads).filter(gp => gp && gp.connected);
      if (connected.length > 0) {
        setConnectedGamepads(connected);
        setIsGamepadActive(true);
        console.log('🎮 Found existing gamepads:', connected.length);
      }
    };

    checkInitialGamepads();

    return () => {
      window.removeEventListener('gamepadconnected', handleGamepadConnected);
      window.removeEventListener('gamepaddisconnected', handleGamepadDisconnected);
    };
  }, []);

  // 🎮 Check analog stick direction
  const getStickDirection = useCallback((gamepad) => {
    const leftStickX = gamepad.axes[0];
    const leftStickY = gamepad.axes[1];
    const deadzone = 0.3; // Ignore small movements

    const directions = {
      leftStickLeft: leftStickX < -deadzone,
      leftStickRight: leftStickX > deadzone,
      leftStickUp: leftStickY < -deadzone,
      leftStickDown: leftStickY > deadzone,
    };

    return directions;
  }, []);

  // 🎮 Process gamepad input and call appropriate game actions
  const processGamepadInput = useCallback((gameActions) => {
    if (!isGamepadActive || !gameActions) return;

    const now = Date.now();
    if (now - lastInputTimeRef.current < inputDelayRef.current) return;

    const gamepads = navigator.getGamepads();
    
    for (let i = 0; i < gamepads.length; i++) {
      const gamepad = gamepads[i];
      if (!gamepad || !gamepad.connected) continue;

      const mapping = BUTTON_MAPPINGS.standard;
      const stickDirections = getStickDirection(gamepad);
      const lastButtonStates = lastButtonStatesRef.current.get(i) || {};

      // 🎮 Movement actions (D-pad and left stick) - CONTINUOUS INPUT
      const checkMovement = (action, buttonIndices, stickKey) => {
        // Check D-pad buttons
        const buttonPressed = buttonIndices.some(btnIndex => 
          typeof btnIndex === 'number' && gamepad.buttons[btnIndex]?.pressed
        );
        
        // Check analog stick
        const stickPressed = stickKey && stickDirections[stickKey];
        const isPressed = buttonPressed || stickPressed;
        
        const actionKey = `${action}_${i}`;
        const continuousKey = `${actionKey}_continuous`;
        
        if (isPressed) {
          // 🎮 PRIMEIRA VEZ pressionando
          if (!lastButtonStates[actionKey]) {
            console.log(`🎮 Gamepad ${i}: ${action} (primeira vez)`);
            executeMovementAction(action, gameActions, gamepad);
            
            lastButtonStates[actionKey] = true;
            continuousInputRef.current.set(continuousKey, {
              lastTime: now,
              firstInput: true
            });
            
          } else {
            // 🎮 SEGURAR botão - input contínuo
            const continuousData = continuousInputRef.current.get(continuousKey);
            if (continuousData) {
              const timeSinceLastInput = now - continuousData.lastTime;
              const requiredDelay = continuousData.firstInput ? firstInputDelayRef.current : inputDelayRef.current;
              
              if (timeSinceLastInput >= requiredDelay) {
                console.log(`🎮 Gamepad ${i}: ${action} (repetindo)`);
                executeMovementAction(action, gameActions, gamepad);
                
                continuousInputRef.current.set(continuousKey, {
                  lastTime: now,
                  firstInput: false
                });
              }
            }
          }
        } else {
          // 🎮 Botão SOLTO - resetar estado
          if (lastButtonStates[actionKey]) {
            console.log(`🎮 Gamepad ${i}: ${action} (solto)`);
          }
          lastButtonStates[actionKey] = false;
          continuousInputRef.current.delete(continuousKey);
        }
      };

      // 🎮 Executar ação de movimento
      const executeMovementAction = (action, gameActions, gamepad) => {
        switch (action) {
          case 'moveLeft':
            gameActions.movePiece('left');
            break;
          case 'moveRight':
            gameActions.movePiece('right');
            break;
          case 'moveDown':
            gameActions.movePiece('down');
            break;
          case 'hardDrop':
            gameActions.hardDrop();
            // Stronger haptic feedback for hard drop
            if (gamepad.vibrationActuator) {
              gamepad.vibrationActuator.playEffect('dual-rumble', {
                duration: 100,
                strongMagnitude: 0.7,
                weakMagnitude: 0.3,
              });
            }
            break;
        }
      };

      // 🎮 Check all movement actions
      checkMovement('moveLeft', mapping.moveLeft, 'leftStickLeft');
      checkMovement('moveRight', mapping.moveRight, 'leftStickRight');
      checkMovement('moveDown', mapping.moveDown, 'leftStickDown');
      checkMovement('hardDrop', mapping.hardDrop);

      // 🎮 Action buttons (single press)
      const checkButtonPress = (action, buttonIndices, gameAction) => {
        const pressed = buttonIndices.some(btnIndex => 
          gamepad.buttons[btnIndex]?.pressed
        );
        
        const actionKey = `${action}_${i}`;
        if (pressed && !lastButtonStates[actionKey]) {
          console.log(`🎮 Gamepad ${i}: ${action}`);
          gameAction();
          
          // Light haptic feedback for actions
          if (gamepad.vibrationActuator) {
            gamepad.vibrationActuator.playEffect('dual-rumble', {
              duration: 50,
              strongMagnitude: 0.2,
              weakMagnitude: 0.4,
            });
          }
          
          lastInputTimeRef.current = now;
          lastButtonStates[actionKey] = true;
        } else if (!pressed) {
          lastButtonStates[actionKey] = false;
        }
      };

      // 🎮 Map action buttons
      checkButtonPress('rotate', mapping.rotate, () => gameActions.rotatePiece());
      checkButtonPress('hold', mapping.hold, () => gameActions.holdPiece());
      checkButtonPress('pause', mapping.pause, () => gameActions.pause());
      
      // 🎮 Trigger buttons for rotation direction (if supported)
      checkButtonPress('rotateCW', mapping.rotateCW, () => gameActions.rotatePiece());
      checkButtonPress('rotateCCW', mapping.rotateCCW, () => gameActions.rotatePiece());

      // Update last button states
      lastButtonStatesRef.current.set(i, lastButtonStates);
    }
  }, [isGamepadActive, getStickDirection]);

  // 🎮 Get gamepad info for UI display
  const getGamepadInfo = useCallback(() => {
    const gamepads = navigator.getGamepads();
    return Array.from(gamepads)
      .filter(gp => gp && gp.connected)
      .map(gp => ({
        index: gp.index,
        id: gp.id,
        buttons: gp.buttons.length,
        axes: gp.axes.length,
        connected: gp.connected,
        vibration: !!gp.vibrationActuator
      }));
  }, []);

  // 🎮 Adjust input sensitivity
  const setInputDelay = useCallback((delay) => {
    inputDelayRef.current = Math.max(50, Math.min(500, delay));
  }, []);

  // 🎮 Set movement speed (presets for different play styles)
  const setMovementSpeed = useCallback((speed) => {
    switch (speed) {
      case 'slow':
        inputDelayRef.current = 150;
        firstInputDelayRef.current = 300;
        break;
      case 'normal':
        inputDelayRef.current = 100;
        firstInputDelayRef.current = 200;
        break;
      case 'fast':
        inputDelayRef.current = 80;
        firstInputDelayRef.current = 150;
        break;
      case 'ultra':
        inputDelayRef.current = 60;
        firstInputDelayRef.current = 120;
        break;
      default:
        inputDelayRef.current = 100;
        firstInputDelayRef.current = 200;
    }
    console.log(`🎮 Movement speed set to: ${speed} (repeat: ${inputDelayRef.current}ms, initial: ${firstInputDelayRef.current}ms)`);
  }, []);

  return {
    isGamepadActive,
    connectedGamepads: connectedGamepads.length,
    processGamepadInput,
    getGamepadInfo,
    setInputDelay,
    setMovementSpeed,
    
    // Helper functions
    isControllerConnected: isGamepadActive,
    controllerCount: connectedGamepads.length,
  };
} 