export class ISettingsService {
  getSettings() {
    throw new Error('Method getSettings must be implemented');
  }

  saveSettings(settings) {
    throw new Error('Method saveSettings must be implemented');
  }

  updateSetting(key, value) {
    throw new Error('Method updateSetting must be implemented');
  }

  resetSettings() {
    throw new Error('Method resetSettings must be implemented');
  }
}
