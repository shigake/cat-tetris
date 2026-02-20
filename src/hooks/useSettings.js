import { useState, useEffect, useCallback } from 'react';
import { serviceContainer } from '../core/container/ServiceRegistration.js';

export function useSettings() {
  const [settings, setSettings] = useState({
    volume: 80,
    gameSpeed: 'normal',
    soundEnabled: true,
    particlesEnabled: true,
    das: 167,
    arr: 33
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const settingsService = serviceContainer.resolve('settingsService');
      const currentSettings = settingsService.getSettings();
      setSettings(currentSettings || {
        volume: 80,
        gameSpeed: 'normal',
        soundEnabled: true,
        particlesEnabled: true,
        das: 167,
        arr: 33
      });
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      setSettings({
        volume: 80,
        gameSpeed: 'normal',
        soundEnabled: true,
        particlesEnabled: true,
        das: 167,
        arr: 33
      });
    }
  }, []);

  const updateSettings = useCallback(async (newSettings) => {
    try {
      setError(null);
      const settingsService = serviceContainer.resolve('settingsService');
      const updatedSettings = settingsService.saveSettings(newSettings);
      setSettings(updatedSettings);
      return updatedSettings;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const updateSetting = useCallback(async (key, value) => {
    try {
      setError(null);
      const settingsService = serviceContainer.resolve('settingsService');
      const updatedSettings = settingsService.updateSetting(key, value);
      setSettings(updatedSettings);
      return updatedSettings;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const resetSettings = useCallback(async () => {
    try {
      setError(null);
      const settingsService = serviceContainer.resolve('settingsService');
      const defaultSettings = settingsService.resetSettings();
      setSettings(defaultSettings);
      return defaultSettings;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  return {
    settings,
    loading,
    error,
    updateSettings,
    updateSetting,
    resetSettings
  };
}
