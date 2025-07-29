export class IKeyboardInputService {
  registerHandler(action, handler) {
    throw new Error('Method registerHandler must be implemented');
  }

  unregisterHandler(action, handler) {
    throw new Error('Method unregisterHandler must be implemented');
  }

  startListening() {
    throw new Error('Method startListening must be implemented');
  }

  stopListening() {
    throw new Error('Method stopListening must be implemented');
  }

  setKeyMapping(key, action) {
    throw new Error('Method setKeyMapping must be implemented');
  }

  getKeyMappings() {
    throw new Error('Method getKeyMappings must be implemented');
  }
} 