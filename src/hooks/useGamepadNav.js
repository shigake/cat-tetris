import { useState, useEffect, useRef, useCallback } from 'react';
import { loadGamepadMappings } from '../config/GamepadConfig';

/**
 * Hook for gamepad-based UI navigation.
 * Provides D-pad/stick navigation, A to confirm, B to go back.
 * 
 * @param {Object} options
 * @param {number} options.itemCount - Total navigable items
 * @param {Function} options.onConfirm - Called with selected index when A pressed
 * @param {Function} options.onBack - Called when B pressed
 * @param {boolean} options.active - Whether this navigator is active (default true)
 * @param {boolean} options.vertical - Navigate vertically (default true)
 * @param {number} options.columns - Grid columns for 2D navigation (default 1)
 * @param {boolean} options.wrap - Wrap around edges (default true)
 */
export function useGamepadNav({
  itemCount = 0,
  onConfirm,
  onBack,
  active = true,
  vertical = true,
  columns = 1,
  wrap = true,
  navMap = null,
} = {}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedIndexRef = useRef(0);
  const lastNavTimeRef = useRef({});
  const lastButtonStatesRef = useRef({});
  const NAV_REPEAT_DELAY = 250;
  const NAV_FIRST_DELAY = 400;
  const navStartRef = useRef({});
  const STICK_DEADZONE = 0.5;

  // Keep ref in sync with state
  useEffect(() => {
    selectedIndexRef.current = selectedIndex;
  }, [selectedIndex]);

  // Store callbacks in refs to avoid recreating processNavigation
  const onConfirmRef = useRef(onConfirm);
  const onBackRef = useRef(onBack);
  const navMapRef = useRef(navMap);
  useEffect(() => { onConfirmRef.current = onConfirm; }, [onConfirm]);
  useEffect(() => { onBackRef.current = onBack; }, [onBack]);
  useEffect(() => { navMapRef.current = navMap; }, [navMap]);

  // Reset selection when item count changes
  useEffect(() => {
    setSelectedIndex(prev => {
      if (prev >= itemCount) return Math.max(0, itemCount - 1);
      return prev;
    });
  }, [itemCount]);

  // Reset to 0 when becoming active, and snapshot current button states
  // so that buttons already held from a previous screen don't double-fire.
  useEffect(() => {
    if (active) {
      setSelectedIndex(0);
      // Pre-seed button states with whatever is currently held
      try {
        const gamepads = navigator.getGamepads();
        const gp = Array.from(gamepads).find(g => g && g.connected);
        if (gp) {
          const m = loadGamepadMappings();
          lastButtonStatesRef.current = {
            confirm: gp.buttons[m.menuConfirm]?.pressed || false,
            back: gp.buttons[m.menuBack]?.pressed || false,
            altConfirm: gp.buttons[m.menuAltConfirm]?.pressed || false,
          };
        }
      } catch (e) { /* ignore */ }
    }
  }, [active]);

  const getStickDirection = useCallback((axes) => {
    if (!axes || axes.length < 2) return null;
    const x = axes[0], y = axes[1];
    if (Math.abs(x) < STICK_DEADZONE && Math.abs(y) < STICK_DEADZONE) return null;
    if (Math.abs(x) > Math.abs(y)) {
      return x > 0 ? 'right' : 'left';
    }
    return y > 0 ? 'down' : 'up';
  }, []);

  const processNavigation = useCallback(() => {
    if (!active || itemCount === 0) return;

    const gamepads = navigator.getGamepads();
    const gamepad = Array.from(gamepads).find(gp => gp && gp.connected);
    if (!gamepad) return;

    const now = Date.now();
    const stickDir = getStickDirection(gamepad.axes);

    // Navigation with DAS-style repeat
    const handleNav = (direction, isPressed) => {
      const key = `nav_${direction}`;
      const wasPressed = navStartRef.current[key + '_pressed'] || false;
      const startTime = navStartRef.current[key + '_start'] || 0;
      const lastTime = lastNavTimeRef.current[key] || 0;

      if (isPressed && !wasPressed) {
        // First press
        navStartRef.current[key + '_pressed'] = true;
        navStartRef.current[key + '_start'] = now;
        lastNavTimeRef.current[key] = now;
        doNav(direction);
        return;
      }

      if (isPressed && wasPressed) {
        // Held - repeat after initial delay
        const elapsed = now - startTime;
        if (elapsed >= NAV_FIRST_DELAY && now - lastTime >= NAV_REPEAT_DELAY) {
          lastNavTimeRef.current[key] = now;
          doNav(direction);
        }
        return;
      }

      if (!isPressed && wasPressed) {
        navStartRef.current[key + '_pressed'] = false;
      }
    };

    const doNav = (direction) => {
      setSelectedIndex(prev => {
        let next = prev;

        // Use spatial navMap if provided
        if (navMapRef.current) {
          const mapping = navMapRef.current[prev];
          if (mapping && mapping[direction] !== undefined) {
            return mapping[direction];
          }
          return prev;
        }

        if (columns === 1) {
          // 1D navigation
          if (direction === 'up' || direction === 'left') {
            next = prev - 1;
            if (next < 0) next = wrap ? itemCount - 1 : 0;
          } else if (direction === 'down' || direction === 'right') {
            next = prev + 1;
            if (next >= itemCount) next = wrap ? 0 : itemCount - 1;
          }
        } else {
          // 2D grid navigation
          const row = Math.floor(prev / columns);
          const col = prev % columns;
          const rows = Math.ceil(itemCount / columns);

          if (direction === 'up') {
            const newRow = row - 1 < 0 ? (wrap ? rows - 1 : 0) : row - 1;
            next = newRow * columns + col;
          } else if (direction === 'down') {
            const newRow = row + 1 >= rows ? (wrap ? 0 : rows - 1) : row + 1;
            next = newRow * columns + col;
          } else if (direction === 'left') {
            next = prev - 1;
            if (next < 0) next = wrap ? itemCount - 1 : 0;
          } else if (direction === 'right') {
            next = prev + 1;
            if (next >= itemCount) next = wrap ? 0 : itemCount - 1;
          }

          if (next >= itemCount) next = itemCount - 1;
        }
        return next;
      });

      // Vibration feedback
      try {
        if (gamepad.vibrationActuator) {
          gamepad.vibrationActuator.playEffect('dual-rumble', {
            duration: 30,
            strongMagnitude: 0.05,
            weakMagnitude: 0.03
          });
        }
      } catch (e) { /* ignore */ }
    };

    // D-pad
    const upPressed = gamepad.buttons[12]?.pressed || stickDir === 'up';
    const downPressed = gamepad.buttons[13]?.pressed || stickDir === 'down';
    const leftPressed = gamepad.buttons[14]?.pressed || stickDir === 'left';
    const rightPressed = gamepad.buttons[15]?.pressed || stickDir === 'right';

    if (vertical) {
      handleNav('up', upPressed);
      handleNav('down', downPressed);
      handleNav('left', leftPressed);
      handleNav('right', rightPressed);
    } else {
      handleNav('left', leftPressed);
      handleNav('right', rightPressed);
    }

    // Read user-configured button mappings
    const mappings = loadGamepadMappings();
    const confirmBtn = mappings.menuConfirm;
    const backBtn = mappings.menuBack;
    const altConfirmBtn = mappings.menuAltConfirm;

    // Confirm button
    const confirmPressed = gamepad.buttons[confirmBtn]?.pressed;
    const confirmWasPressed = lastButtonStatesRef.current['confirm'];
    if (confirmPressed && !confirmWasPressed) {
      onConfirmRef.current?.(selectedIndexRef.current);
      try {
        if (gamepad.vibrationActuator) {
          gamepad.vibrationActuator.playEffect('dual-rumble', {
            duration: 50, strongMagnitude: 0.15, weakMagnitude: 0.1
          });
        }
      } catch (e) { /* ignore */ }
    }

    // Back button
    const backPressed = gamepad.buttons[backBtn]?.pressed;
    const backWasPressed = lastButtonStatesRef.current['back'];
    if (backPressed && !backWasPressed) {
      onBackRef.current?.();
    }

    // Alt confirm button (only if different from confirm)
    let altPressed = false;
    if (altConfirmBtn !== confirmBtn) {
      altPressed = gamepad.buttons[altConfirmBtn]?.pressed;
      const altWasPressed = lastButtonStatesRef.current['altConfirm'];
      if (altPressed && !altWasPressed) {
        onConfirmRef.current?.(selectedIndexRef.current);
      }
    }

    // Update button states
    lastButtonStatesRef.current = {
      confirm: confirmPressed,
      back: backPressed,
      altConfirm: altPressed,
    };

  }, [active, itemCount, columns, wrap, vertical, getStickDirection]);

  // Polling loop
  useEffect(() => {
    if (!active) return;

    const interval = setInterval(processNavigation, 16);
    return () => clearInterval(interval);
  }, [active, processNavigation]);

  return {
    selectedIndex,
    setSelectedIndex,
  };
}
