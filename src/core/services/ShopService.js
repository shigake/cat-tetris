/**
 * ShopService - Gerencia loja de itens cosméticos
 */

// Catálogo de temas de peças
export const PIECE_THEMES = {
  cats: {
    id: 'cats',
    name: '🐱 Gatos Clássicos',
    description: 'Os gatinhos originais do Cat Tetris',
    price: 0,
    default: true,
    pieces: {
      I: { emoji: '🐱', color: '#00f0f0' },
      O: { emoji: '😺', color: '#f0f000' },
      T: { emoji: '😸', color: '#a000f0' },
      S: { emoji: '😻', color: '#00f000' },
      Z: { emoji: '😽', color: '#f00000' },
      J: { emoji: '😹', color: '#f0a000' },
      L: { emoji: '😿', color: '#ffc0cb' }
    }
  },
  dogs: {
    id: 'dogs',
    name: '🐶 Cachorros Felizes',
    description: 'Amigos caninos adoráveis',
    price: 500,
    pieces: {
      I: { emoji: '🐶', color: '#8B4513' },
      O: { emoji: '🐕', color: '#D2691E' },
      T: { emoji: '🦮', color: '#CD853F' },
      S: { emoji: '🐕‍🦺', color: '#DEB887' },
      Z: { emoji: '🐩', color: '#F4A460' },
      J: { emoji: '🦴', color: '#FFDEAD' },
      L: { emoji: '🐾', color: '#FFE4B5' }
    }
  },
  pandas: {
    id: 'pandas',
    name: '🐼 Pandas Fofos',
    description: 'Ursinhos preto e branco',
    price: 600,
    pieces: {
      I: { emoji: '🐼', color: '#000000' },
      O: { emoji: '🐨', color: '#808080' },
      T: { emoji: '🐻', color: '#A0A0A0' },
      S: { emoji: '🐻‍❄️', color: '#FFFFFF' },
      Z: { emoji: '🧸', color: '#D3D3D3' },
      J: { emoji: '🎋', color: '#90EE90' },
      L: { emoji: '🎍', color: '#98FB98' }
    }
  },
  foxes: {
    id: 'foxes',
    name: '🦊 Raposas Astutas',
    description: 'Raposinhas espertas e ágeis',
    price: 700,
    pieces: {
      I: { emoji: '🦊', color: '#FF4500' },
      O: { emoji: '🦝', color: '#FF6347' },
      T: { emoji: '🐺', color: '#FF7F50' },
      S: { emoji: '🌰', color: '#CD5C5C' },
      Z: { emoji: '🍂', color: '#D2691E' },
      J: { emoji: '🍁', color: '#8B4513' },
      L: { emoji: '🌾', color: '#DAA520' }
    }
  },
  unicorns: {
    id: 'unicorns',
    name: '🦄 Unicórnios Mágicos',
    description: 'Criaturas místicas e coloridas',
    price: 900,
    pieces: {
      I: { emoji: '🦄', color: '#FF00FF' },
      O: { emoji: '🌈', color: '#FFD700' },
      T: { emoji: '⭐', color: '#87CEEB' },
      S: { emoji: '✨', color: '#FF69B4' },
      Z: { emoji: '💫', color: '#9370DB' },
      J: { emoji: '🌟', color: '#DA70D6' },
      L: { emoji: '💖', color: '#FFC0CB' }
    }
  },
  robots: {
    id: 'robots',
    name: '🤖 Robôs Futuristas',
    description: 'Tecnologia do futuro',
    price: 800,
    pieces: {
      I: { emoji: '🤖', color: '#708090' },
      O: { emoji: '⚙️', color: '#778899' },
      T: { emoji: '🔧', color: '#4682B4' },
      S: { emoji: '🔩', color: '#5F9EA0' },
      Z: { emoji: '⚡', color: '#00CED1' },
      J: { emoji: '🔌', color: '#1E90FF' },
      L: { emoji: '💡', color: '#4169E1' }
    }
  },
  foods: {
    id: 'foods',
    name: '🍕 Comidas Deliciosas',
    description: 'Para quem joga com fome',
    price: 750,
    pieces: {
      I: { emoji: '🍕', color: '#FF6347' },
      O: { emoji: '🍔', color: '#FFD700' },
      T: { emoji: '🍟', color: '#FFA500' },
      S: { emoji: '🌭', color: '#FF4500' },
      Z: { emoji: '🍩', color: '#FFB6C1' },
      J: { emoji: '🍰', color: '#DDA0DD' },
      L: { emoji: '🍪', color: '#D2691E' }
    }
  },
  crystals: {
    id: 'crystals',
    name: '💎 Cristais Brilhantes',
    description: 'Gemas preciosas reluzentes',
    price: 1000,
    premium: true,
    pieces: {
      I: { emoji: '💎', color: '#00FFFF' },
      O: { emoji: '💠', color: '#FFD700' },
      T: { emoji: '🔷', color: '#9370DB' },
      S: { emoji: '🔶', color: '#00FF00' },
      Z: { emoji: '💠', color: '#FF0000' },
      J: { emoji: '✨', color: '#FFA500' },
      L: { emoji: '🌟', color: '#FF1493' }
    }
  },
  ocean: {
    id: 'ocean',
    name: '🌊 Mundo Marinho',
    description: 'Criaturas do oceano',
    price: 850,
    pieces: {
      I: { emoji: '🐋', color: '#1E90FF' },
      O: { emoji: '🐠', color: '#00CED1' },
      T: { emoji: '🐡', color: '#4682B4' },
      S: { emoji: '🐟', color: '#87CEEB' },
      Z: { emoji: '🦈', color: '#5F9EA0' },
      J: { emoji: '🐙', color: '#6495ED' },
      L: { emoji: '🦀', color: '#FF6347' }
    }
  },
  space: {
    id: 'space',
    name: '🚀 Espaço Sideral',
    description: 'Exploração espacial',
    price: 950,
    pieces: {
      I: { emoji: '🚀', color: '#4169E1' },
      O: { emoji: '🛸', color: '#00FFFF' },
      T: { emoji: '🌎', color: '#32CD32' },
      S: { emoji: '🌙', color: '#FFD700' },
      Z: { emoji: '⭐', color: '#FFFF00' },
      J: { emoji: '🪐', color: '#FF8C00' },
      L: { emoji: '☄️', color: '#FF4500' }
    }
  }
};

export class ShopService {
  constructor(gameRepository, currencyService) {
    this.gameRepository = gameRepository;
    this.currencyService = currencyService;
    this.inventory = this.loadInventory();
  }

  loadInventory() {
    const saved = this.gameRepository.load('shopInventory');
    return saved || {
      ownedThemes: ['cats'], // Default theme
      equippedTheme: 'cats',
      purchaseHistory: []
    };
  }

  save() {
    this.gameRepository.save('shopInventory', this.inventory);
  }

  // Get all available themes
  getAllThemes() {
    return Object.values(PIECE_THEMES).map(theme => ({
      ...theme,
      owned: this.inventory.ownedThemes.includes(theme.id),
      equipped: this.inventory.equippedTheme === theme.id
    }));
  }

  // Get owned themes
  getOwnedThemes() {
    return this.inventory.ownedThemes.map(id => PIECE_THEMES[id]);
  }

  // Get equipped theme
  getEquippedTheme() {
    return PIECE_THEMES[this.inventory.equippedTheme];
  }

  // Check if theme is owned
  ownsTheme(themeId) {
    return this.inventory.ownedThemes.includes(themeId);
  }

  // Purchase theme
  purchaseTheme(themeId) {
    const theme = PIECE_THEMES[themeId];
    
    if (!theme) {
      return { success: false, error: 'Theme not found' };
    }

    if (this.ownsTheme(themeId)) {
      return { success: false, error: 'Already owned' };
    }

    if (!this.currencyService.canAfford(theme.price)) {
      return { success: false, error: 'Insufficient funds' };
    }

    // Purchase
    const success = this.currencyService.spendFish(theme.price, `Theme: ${theme.name}`);
    
    if (success) {
      this.inventory.ownedThemes.push(themeId);
      this.inventory.purchaseHistory.push({
        themeId,
        purchasedAt: new Date().toISOString(),
        price: theme.price
      });
      this.save();
      
      console.log(`✅ Tema comprado: ${theme.name}`);
      return { success: true, theme };
    }

    return { success: false, error: 'Purchase failed' };
  }

  // Equip theme
  equipTheme(themeId) {
    if (!this.ownsTheme(themeId)) {
      return { success: false, error: 'Theme not owned' };
    }

    this.inventory.equippedTheme = themeId;
    this.save();
    
    const theme = PIECE_THEMES[themeId];
    console.log(`🎨 Tema equipado: ${theme.name}`);
    
    // Dispatch event for UI update
    window.dispatchEvent(new CustomEvent('themeEquipped', { 
      detail: { themeId, theme } 
    }));
    
    return { success: true, theme };
  }

  // Get stats
  getStats() {
    return {
      totalThemes: Object.keys(PIECE_THEMES).length,
      ownedThemes: this.inventory.ownedThemes.length,
      totalSpent: this.inventory.purchaseHistory.reduce((sum, p) => sum + p.price, 0),
      equippedTheme: this.inventory.equippedTheme
    };
  }

  // Reset (for testing)
  reset() {
    this.inventory = {
      ownedThemes: ['cats'],
      equippedTheme: 'cats',
      purchaseHistory: []
    };
    this.save();
  }
}
