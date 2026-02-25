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
 neko_kawaii: {
 id: 'neko_kawaii',
 name: 'Neko Kawaii',
 description: 'Gatinhos anime super fofos com olhos brilhantes',
 blockShape: 'neko_kawaii',
 price: 500,
 pieces: stdPieces()
 },
 shadow_cat: {
 id: 'shadow_cat',
 name: 'Shadow Cat',
 description: 'Gato misterioso das sombras com olhos brilhantes',
 blockShape: 'shadow_cat',
 price: 800,
 pieces: stdPieces()
 },
 maneki_neko: {
 id: 'maneki_neko',
 name: 'Maneki Neko',
 description: 'Gato da sorte japonês com moeda de ouro',
 blockShape: 'maneki_neko',
 price: 1200,
 pieces: stdPieces()
 },
 cyber_cat: {
 id: 'cyber_cat',
 name: 'Cyber Cat',
 description: 'Gato cyberpunk com circuitos neon',
 blockShape: 'cyber_cat',
 price: 900,
 pieces: stdPieces()
 },
 royal_cat: {
 id: 'royal_cat',
 name: 'Royal Cat',
 description: 'Gato real com coroa e joias preciosas',
 blockShape: 'royal_cat',
 price: 1000,
 pieces: stdPieces()
 },
 pirate_cat: {
 id: 'pirate_cat',
 name: 'Pirate Cat',
 description: 'Gato pirata com tapa-olho e cicatriz',
 blockShape: 'pirate_cat',
 price: 700,
 pieces: stdPieces()
 },
 astro_cat: {
 id: 'astro_cat',
 name: 'Astro Cat',
 description: 'Gato astronauta com capacete espacial',
 blockShape: 'astro_cat',
 price: 1100,
 pieces: stdPieces()
 },
 sakura_cat: {
 id: 'sakura_cat',
 name: 'Sakura Cat',
 description: 'Gato delicado com flores de cerejeira',
 blockShape: 'sakura_cat',
 price: 600,
 pieces: stdPieces()
 },
 ice_cat: {
 id: 'ice_cat',
 name: 'Ice Cat',
 description: 'Gato gelado com olhos de cristal',
 blockShape: 'ice_cat',
 price: 800,
 pieces: stdPieces()
 },
 lava_cat: {
 id: 'lava_cat',
 name: 'Lava Cat',
 description: 'Gato vulc\u00e2nico com olhos de fogo e presas',
 blockShape: 'lava_cat',
 price: 1000,
 pieces: stdPieces()
 },
 ninja_cat: {
 id: 'ninja_cat',
 name: 'Ninja Cat',
 description: 'Gato ninja furtivo com m\u00e1scara e shuriken',
 blockShape: 'ninja_cat',
 price: 900,
 pieces: stdPieces()
 },
 galaxy_cat: {
 id: 'galaxy_cat',
 name: 'Galaxy Cat',
 description: 'Gato c\u00f3smico com olhos de nebulosa',
 blockShape: 'galaxy_cat',
 price: 1500,
 pieces: stdPieces()
 },
 chef_cat: {
 id: 'chef_cat',
 name: 'Chef Cat',
 description: 'Gato chef gourmet com chapéu e bigode',
 blockShape: 'chef_cat',
 price: 600,
 pieces: stdPieces()
 },
 // ── newskins: cat skins ──
 squished_cat: {
 id: 'squished_cat',
 name: 'Gatos Amassados',
 description: 'Gatinhos espremidos no formato do bloco',
 blockShape: 'squished_cat',
 price: 300,
 pieces: stdPieces()
 },
 box_cat: {
 id: 'box_cat',
 name: 'Gatos na Caixa',
 description: 'Gatinhos escondidos em caixas de papelão',
 blockShape: 'box_cat',
 price: 500,
 pieces: stdPieces()
 },
 cat_face: {
 id: 'cat_face',
 name: 'Carinhas de Gato',
 description: 'Rostos redondinhos de gato',
 blockShape: 'cat_face',
 price: 200,
 pieces: stdPieces()
 },
 yarn_ball: {
 id: 'yarn_ball',
 name: 'Novelos de Lã',
 description: 'Bolinhas de lã coloridas',
 blockShape: 'yarn_ball',
 price: 400,
 pieces: stdPieces()
 },
 paw_print: {
 id: 'paw_print',
 name: 'Patinhas',
 description: 'Almofadinhas fofas de gato',
 blockShape: 'paw_print',
 price: 350,
 pieces: stdPieces()
 },
 fish_block: {
 id: 'fish_block',
 name: 'Peixinhos',
 description: 'Peixes deliciosos para gatinhos',
 blockShape: 'fish_block',
 price: 300,
 pieces: stdPieces()
 },
 milk_carton: {
 id: 'milk_carton',
 name: 'Caixa de Leite',
 description: 'Caixinhas de leite fresco',
 blockShape: 'milk_carton',
 price: 450,
 pieces: stdPieces()
 },
 mouse_toy: {
 id: 'mouse_toy',
 name: 'Ratinhos',
 description: 'Ratinhos de brinquedo',
 blockShape: 'mouse_toy',
 price: 400,
 pieces: stdPieces()
 },
 // ── newskins: dog skins ──
 dog_face: {
 id: 'dog_face',
 name: 'Dog Face',
 description: 'Cachorros felizes e babões',
 blockShape: 'dog_face',
 price: 500,
 pieces: stdPieces()
 },
 pug_face: {
 id: 'pug_face',
 name: 'Pugs',
 description: 'Pugs enrugados e fofos',
 blockShape: 'pug_face',
 price: 600,
 pieces: stdPieces()
 },
 bone_block: {
 id: 'bone_block',
 name: 'Ossinhos',
 description: 'Ossos para roer',
 blockShape: 'bone_block',
 price: 450,
 pieces: stdPieces()
 },
 dog_house: {
 id: 'dog_house',
 name: 'Casinhas',
 description: 'Casinhas de cachorro com telhado',
 blockShape: 'dog_house',
 price: 550,
 pieces: stdPieces()
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
