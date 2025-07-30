import { IKeyboardInputService } from '../../interfaces/IKeyboardInputService.js';

export class KeyboardInputService extends IKeyboardInputService {
  constructor() {
    super();
    this.keyMappings = {
      'ArrowLeft': 'moveLeft',
      'ArrowRight': 'moveRight',
      'ArrowDown': 'moveDown',
      'ArrowUp': 'rotate',
      ' ': 'hardDrop',
      'Space': 'hardDrop',
      'Shift': 'hold',
      'p': 'pause',
      'P': 'pause'
    };

    this.preventDefaultKeys = [
      'ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', ' ', 'Space'
    ];

    this.handlers = new Map();
    this.isListening = false;
  }

  registerHandler(action, handler) {
    if (!this.handlers.has(action)) {
      this.handlers.set(action, []);
    }
    this.handlers.get(action).push(handler);
  }

  unregisterHandler(action, handler) {
    if (this.handlers.has(action)) {
      const handlers = this.handlers.get(action);
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  startListening() {
    if (!this.isListening) {
      window.addEventListener('keydown', this.handleKeyDown);
      this.isListening = true;
    }
  }

  stopListening() {
    if (this.isListening) {
      window.removeEventListener('keydown', this.handleKeyDown);
      this.isListening = false;
    }
  }

  handleKeyDown = (event) => {
    console.log('KeyboardInputService handleKeyDown:', event.key);
    if (this.preventDefaultKeys.includes(event.key)) {
      event.preventDefault();
    }

    const action = this.keyMappings[event.key];
    console.log('KeyboardInputService action:', action);
    if (action && this.handlers.has(action)) {
      console.log('KeyboardInputService executing handlers for:', action);
      this.handlers.get(action).forEach(handler => {
        try {
          handler(event);
        } catch (error) {
          console.error(`Error executing handler for action ${action}:`, error);
        }
      });
    } else {
      console.log('KeyboardInputService: no action or handlers for key:', event.key);
    }
  }

  setKeyMapping(key, action) {
    this.keyMappings[key] = action;
  }

  removeKeyMapping(key) {
    delete this.keyMappings[key];
  }

  getKeyMappings() {
    return { ...this.keyMappings };
  }

  clear() {
    this.handlers.clear();
    this.stopListening();
  }
} 