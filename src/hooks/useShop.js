import { useState, useEffect, useCallback } from 'react';
import { serviceContainer } from '../core/container/ServiceRegistration.js';

export function useShop() {
  const [themes, setThemes] = useState([]);
  const [equippedTheme, setEquippedTheme] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const shopService = serviceContainer.resolve('shopService');
      setThemes(shopService.getAllThemes());
      setEquippedTheme(shopService.getEquippedTheme());
      setLoading(false);

      const handleThemeEquipped = (event) => {
        setEquippedTheme(event.detail.theme);
        setThemes(shopService.getAllThemes());
      };

      const handleCurrencyUpdate = () => {
        setThemes(shopService.getAllThemes());
      };

      window.addEventListener('themeEquipped', handleThemeEquipped);
      window.addEventListener('currencyUpdated', handleCurrencyUpdate);

      return () => {
        window.removeEventListener('themeEquipped', handleThemeEquipped);
        window.removeEventListener('currencyUpdated', handleCurrencyUpdate);
      };
    } catch (error) {

      setLoading(false);
    }
  }, []);

  const purchaseTheme = useCallback((themeId) => {
    try {
      const shopService = serviceContainer.resolve('shopService');
      const result = shopService.purchaseTheme(themeId);

      if (result.success) {
        setThemes(shopService.getAllThemes());
        window.dispatchEvent(new Event('currencyUpdated'));
      }

      return result;
    } catch (error) {

      return { success: false, error: error.message };
    }
  }, []);

  const equipTheme = useCallback((themeId) => {
    try {
      const shopService = serviceContainer.resolve('shopService');
      const result = shopService.equipTheme(themeId);

      if (result.success) {
        setEquippedTheme(result.theme);
        setThemes(shopService.getAllThemes());
      }

      return result;
    } catch (error) {

      return { success: false, error: error.message };
    }
  }, []);

  const getStats = useCallback(() => {
    try {
      const shopService = serviceContainer.resolve('shopService');
      return shopService.getStats();
    } catch (error) {

      return null;
    }
  }, []);

  return {
    themes,
    equippedTheme,
    loading,
    purchaseTheme,
    equipTheme,
    getStats
  };
}

