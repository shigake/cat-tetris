import { useState, useEffect, useCallback } from 'react';
import { serviceContainer } from '../core/container/ServiceRegistration.js';
import { gameEvents, GAME_EVENTS } from '../patterns/Observer.js';

/**
 * Hook para gerenciar moedas do jogador
 */
export function useCurrency() {
  const [currency, setCurrency] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const currencyService = serviceContainer.resolve('currencyService');
      setCurrency(currencyService.getCurrency());
      setLoading(false);

      // Listen for currency changes
      const updateCurrency = () => {
        setCurrency(currencyService.getCurrency());
      };

      // Custom event for currency updates
      window.addEventListener('currencyUpdated', updateCurrency);

      return () => {
        window.removeEventListener('currencyUpdated', updateCurrency);
      };
    } catch (error) {
      console.error('Failed to initialize currency service:', error);
      setLoading(false);
    }
  }, []);

  const addFish = useCallback((amount, reason) => {
    try {
      const currencyService = serviceContainer.resolve('currencyService');
      const success = currencyService.addFish(amount, reason);
      if (success) {
        setCurrency(currencyService.getCurrency());
        window.dispatchEvent(new Event('currencyUpdated'));
      }
      return success;
    } catch (error) {
      console.error('Failed to add fish:', error);
      return false;
    }
  }, []);

  const spendFish = useCallback((amount, reason) => {
    try {
      const currencyService = serviceContainer.resolve('currencyService');
      const success = currencyService.spendFish(amount, reason);
      if (success) {
        setCurrency(currencyService.getCurrency());
        window.dispatchEvent(new Event('currencyUpdated'));
      }
      return success;
    } catch (error) {
      console.error('Failed to spend fish:', error);
      return false;
    }
  }, []);

  const canAfford = useCallback((amount) => {
    try {
      const currencyService = serviceContainer.resolve('currencyService');
      return currencyService.canAfford(amount);
    } catch (error) {
      console.error('Failed to check affordability:', error);
      return false;
    }
  }, []);

  return {
    currency,
    loading,
    addFish,
    spendFish,
    canAfford
  };
}
