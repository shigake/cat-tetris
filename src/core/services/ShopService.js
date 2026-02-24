const STD = {
 I: '#00F0F0', O: '#F0F000', T: '#A000F0',
 S: '#00F000', Z: '#F00000', J: '#0000F0', L: '#F0A000'
};
const stdPieces = () => ({
 I: { color: STD.I },
 O: { color: STD.O },
 T: { color: STD.T },
 S: { color: STD.S },
 Z: { color: STD.Z },
 J: { color: STD.J },
 L: { color: STD.L }
});

export const PIECE_THEMES = {
 classic: {
 id: 'classic',
 name: 'Tetris Clássico',
 description: 'Cores oficiais do Tetris',
 blockShape: 'classic',
 price: 0,
 default: true,
 pieces: stdPieces()
 },
 cats: {
 id: 'cats',
 name: 'Gatos Clássicos',
 description: 'Os gatinhos originais do Cat Tetris',
 blockShape: 'cats',
 price: 0,
 default: true,
 pieces: stdPieces()
 },
 dogs: {
 id: 'dogs',
 name: 'Cachorros Felizes',
 description: 'Amigos caninos adoráveis',
 blockShape: 'dogs',
 price: 500,
 pieces: stdPieces()
 },
 pandas: {
 id: 'pandas',
 name: 'Pandas Fofos',
 description: 'Ursinhos preto e branco',
 blockShape: 'pandas',
 price: 600,
 pieces: stdPieces()
 },
 foxes: {
 id: 'foxes',
 name: 'Raposas Astutas',
 description: 'Raposinhas espertas e ágeis',
 blockShape: 'foxes',
 price: 700,
 pieces: stdPieces()
 },
 robots: {
 id: 'robots',
 name: 'Robôs Futuristas',
 description: 'Tecnologia do futuro',
 blockShape: 'robots',
 price: 800,
 pieces: stdPieces()
 },
 cat_ear_orb: {
 id: 'cat_ear_orb',
 name: 'Cat Ear Orb',
 description: 'Bolinhas com orelhas de gato — básico e clean',
 blockShape: 'cat_ear_orb',
 price: 400,
 pieces: stdPieces(),
 preview: 'themes/cat_ear_orb/preview.png',
 imageTheme: true
 },
 cathead_block: {
 id: 'cathead_block',
 name: 'Cat Head Block',
 description: 'Blocos em silhueta de cabeça de gato',
 blockShape: 'cathead_block',
 price: 400,
 pieces: stdPieces(),
 preview: 'themes/cathead_block/preview.png',
 imageTheme: true
 },
 neko_badge: {
 id: 'neko_badge',
 name: 'Neko Badge Premium',
 description: 'Badges premium com emblema neko',
 blockShape: 'neko_badge',
 price: 1200,
 pieces: stdPieces(),
 preview: 'themes/neko_badge/preview.png',
 imageTheme: true
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
 if (saved) {

 const freeThemes = Object.values(PIECE_THEMES)
 .filter(t => t.price === 0)
 .map(t => t.id);
 let dirty = false;
 for (const id of freeThemes) {
 if (!saved.ownedThemes.includes(id)) {
 saved.ownedThemes.push(id);
 dirty = true;
 }
 }
 if (dirty) this.gameRepository.save('shopInventory', saved);
 return saved;
 }
 return {
 ownedThemes: ['cats', 'classic'],
 equippedTheme: 'cats',
 purchaseHistory: []
 };
 }

 save() {
 this.gameRepository.save('shopInventory', this.inventory);
 }

 getAllThemes() {
 return Object.values(PIECE_THEMES).map(theme => ({
 ...theme,
 owned: this.inventory.ownedThemes.includes(theme.id),
 equipped: this.inventory.equippedTheme === theme.id
 }));
 }

 getOwnedThemes() {
 return this.inventory.ownedThemes.map(id => PIECE_THEMES[id]);
 }

 getEquippedTheme() {
 return PIECE_THEMES[this.inventory.equippedTheme];
 }

 ownsTheme(themeId) {
 return this.inventory.ownedThemes.includes(themeId);
 }

 purchaseTheme(themeId) {
 const theme = PIECE_THEMES[themeId];

 if (!theme) {
 return { success: false, error: 'shop.error.notFound' };
 }

 if (this.ownsTheme(themeId)) {
 return { success: false, error: 'shop.error.alreadyOwned' };
 }

 if (!this.currencyService.canAfford(theme.price)) {
 return { success: false, error: 'shop.error.noFunds' };
 }

 const success = this.currencyService.spendFish(theme.price, `Theme: ${theme.name}`);

 if (success) {
 this.inventory.ownedThemes.push(themeId);
 this.inventory.purchaseHistory.push({
 themeId,
 purchasedAt: new Date().toISOString(),
 price: theme.price
 });
 this.save();

 return { success: true, theme };
 }

 return { success: false, error: 'shop.error.failed' };
 }

 equipTheme(themeId) {
 if (!this.ownsTheme(themeId)) {
 return { success: false, error: 'shop.error.notOwned' };
 }

 this.inventory.equippedTheme = themeId;
 this.save();

 const theme = PIECE_THEMES[themeId];

 window.dispatchEvent(new CustomEvent('themeEquipped', {
 detail: { themeId, theme }
 }));

 return { success: true, theme };
 }

 getStats() {
 return {
 totalThemes: Object.keys(PIECE_THEMES).length,
 ownedThemes: this.inventory.ownedThemes.length,
 totalSpent: this.inventory.purchaseHistory.reduce((sum, p) => sum + p.price, 0),
 equippedTheme: this.inventory.equippedTheme
 };
 }

 reset() {
 this.inventory = {
 ownedThemes: ['cats'],
 equippedTheme: 'cats',
 purchaseHistory: []
 };
 this.save();
 }
}
