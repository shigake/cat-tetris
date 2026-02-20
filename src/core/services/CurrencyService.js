export class CurrencyService {
  constructor(gameRepository) {
    this.gameRepository = gameRepository;
    this.currency = this.loadCurrency();
  }

  loadCurrency() {
    const saved = this.gameRepository.load('playerCurrency');
    return saved || {
      fish: 0,
      totalEarned: 0,
      totalSpent: 0
    };
  }

  save() {
    this.gameRepository.save('playerCurrency', this.currency);
  }

  getFish() {
    return this.currency.fish;
  }

  getCurrency() {
    return { ...this.currency };
  }

  addFish(amount, reason = 'unknown') {
    if (amount <= 0) return false;

    this.currency.fish += amount;
    this.currency.totalEarned += amount;
    this.save();

    return true;
  }

  spendFish(amount, reason = 'unknown') {
    if (amount <= 0) return false;
    if (this.currency.fish < amount) return false;

    this.currency.fish -= amount;
    this.currency.totalSpent += amount;
    this.save();

    return true;
  }

  canAfford(amount) {
    return this.currency.fish >= amount;
  }

  reset() {
    this.currency = {
      fish: 0,
      totalEarned: 0,
      totalSpent: 0
    };
    this.save();
  }

  getStats() {
    return {
      currentFish: this.currency.fish,
      totalEarned: this.currency.totalEarned,
      totalSpent: this.currency.totalSpent,
      netWorth: this.currency.totalEarned - this.currency.totalSpent
    };
  }
}

