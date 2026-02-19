/**
 * CurrencyService - Gerencia moedas (🐟 Fish) do jogador
 */
export class CurrencyService {
  constructor(gameRepository) {
    this.gameRepository = gameRepository;
    this.currency = this.loadCurrency();
  }

  loadCurrency() {
    const saved = this.gameRepository.load('playerCurrency');
    return saved || {
      fish: 0, // 🐟 Moeda principal
      totalEarned: 0,
      totalSpent: 0
    };
  }

  save() {
    this.gameRepository.save('playerCurrency', this.currency);
  }

  // Getters
  getFish() {
    return this.currency.fish;
  }

  getCurrency() {
    return { ...this.currency };
  }

  // Add currency
  addFish(amount, reason = 'unknown') {
    if (amount <= 0) return false;
    
    this.currency.fish += amount;
    this.currency.totalEarned += amount;
    this.save();
    
    console.log(`💰 +${amount} 🐟 (${reason})`);
    return true;
  }

  // Spend currency
  spendFish(amount, reason = 'unknown') {
    if (amount <= 0) return false;
    if (this.currency.fish < amount) return false;
    
    this.currency.fish -= amount;
    this.currency.totalSpent += amount;
    this.save();
    
    console.log(`💸 -${amount} 🐟 (${reason})`);
    return true;
  }

  // Check if player can afford
  canAfford(amount) {
    return this.currency.fish >= amount;
  }

  // Reset (for testing)
  reset() {
    this.currency = {
      fish: 0,
      totalEarned: 0,
      totalSpent: 0
    };
    this.save();
  }

  // Stats
  getStats() {
    return {
      currentFish: this.currency.fish,
      totalEarned: this.currency.totalEarned,
      totalSpent: this.currency.totalSpent,
      netWorth: this.currency.totalEarned - this.currency.totalSpent
    };
  }
}
