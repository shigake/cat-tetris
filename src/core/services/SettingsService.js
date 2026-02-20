import { ISettingsService } from '../../interfaces/ISettingsService.js';

export class SettingsService extends ISettingsService {
  constructor() {
    super();
    this.storageKey = 'cat-tetris-settings';
    this.defaultSettings = {
      volume: 80,
      gameSpeed: 'normal',
      soundEnabled: true,
      particlesEnabled: true
    };
  }

  getSettings() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      return saved ? { ...this.defaultSettings, ...JSON.parse(saved) } : this.defaultSettings;
    } catch (error) {

      return this.defaultSettings;
    }
  }

  saveSettings(settings) {
    try {
      const mergedSettings = { ...this.defaultSettings, ...settings };
      localStorage.setItem(this.storageKey, JSON.stringify(mergedSettings));
      return mergedSettings;
    } catch (error) {

      throw new Error('Failed to save settings');
    }
  }

  resetSettings() {
    try {
      localStorage.removeItem(this.storageKey);
      return this.defaultSettings;
    } catch (error) {

      throw new Error('Failed to reset settings');
    }
  }

  updateSetting(key, value) {
    const currentSettings = this.getSettings();
    const updatedSettings = { ...currentSettings, [key]: value };
    return this.saveSettings(updatedSettings);
  }
}
