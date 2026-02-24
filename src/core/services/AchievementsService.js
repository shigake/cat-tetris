const ACHIEVEMENTS = [

 {
 id: 'first_line',
 title: ' Primeira Linha',
 description: 'Limpe sua primeira linha',
 requirement: { type: 'lines_total', value: 1 },
 reward: 50,
 tier: 'bronze'
 },
 {
 id: 'first_game',
 title: ' Primeira Partida',
 description: 'Complete sua primeira partida',
 requirement: { type: 'games_played', value: 1 },
 reward: 50,
 tier: 'bronze'
 },
 {
 id: 'scorer',
 title: ' Pontuador',
 description: 'Alcance 10.000 pontos em uma partida',
 requirement: { type: 'score_single', value: 10000 },
 reward: 100,
 tier: 'bronze'
 },

 {
 id: 'combo_starter',
 title: ' Combo Starter',
 description: 'Alcance um combo de 5x',
 requirement: { type: 'max_combo', value: 5 },
 reward: 150,
 tier: 'silver'
 },
 {
 id: 'tspin_novice',
 title: ' Aprendiz T-Spin',
 description: 'Faça seu primeiro T-Spin',
 requirement: { type: 'tspins_total', value: 1 },
 reward: 150,
 tier: 'silver'
 },
 {
 id: 'survivor',
 title: ' Sobrevivente',
 description: 'Sobreviva por 5 minutos',
 requirement: { type: 'survive_time', value: 300 },
 reward: 150,
 tier: 'silver'
 },
 {
 id: 'level_5',
 title: ' Nível 5',
 description: 'Alcance o nível 5',
 requirement: { type: 'max_level', value: 5 },
 reward: 100,
 tier: 'silver'
 },
 {
 id: 'line_clearer',
 title: ' Limpador',
 description: 'Limpe 100 linhas no total',
 requirement: { type: 'lines_total', value: 100 },
 reward: 200,
 tier: 'silver'
 },

 {
 id: 'combo_master',
 title: ' Combo Master',
 description: 'Alcance um combo de 10x',
 requirement: { type: 'max_combo', value: 10 },
 reward: 300,
 tier: 'gold'
 },
 {
 id: 'tspin_master',
 title: ' Mestre T-Spin',
 description: 'Faça 50 T-Spins no total',
 requirement: { type: 'tspins_total', value: 50 },
 reward: 400,
 tier: 'gold'
 },
 {
 id: 'speed_demon',
 title: ' Speed Demon',
 description: 'Alcance o nível 15',
 requirement: { type: 'max_level', value: 15 },
 reward: 350,
 tier: 'gold'
 },
 {
 id: 'high_scorer',
 title: ' Alto Pontuador',
 description: 'Alcance 100.000 pontos em uma partida',
 requirement: { type: 'score_single', value: 100000 },
 reward: 400,
 tier: 'gold'
 },
 {
 id: 'dedicated',
 title: ' Dedicado',
 description: 'Jogue 50 partidas',
 requirement: { type: 'games_played', value: 50 },
 reward: 300,
 tier: 'gold'
 },
 {
 id: 'marathon',
 title: ' Maratonista',
 description: 'Limpe 500 linhas no total',
 requirement: { type: 'lines_total', value: 500 },
 reward: 350,
 tier: 'gold'
 },

 {
 id: 'cat_king',
 title: ' Rei dos Gatos',
 description: 'Alcance 1.000.000 de pontos em uma partida',
 requirement: { type: 'score_single', value: 1000000 },
 reward: 1000,
 tier: 'platinum'
 },
 {
 id: 'immortal',
 title: ' Imortal',
 description: 'Alcance o nível 20',
 requirement: { type: 'max_level', value: 20 },
 reward: 800,
 tier: 'platinum'
 },
 {
 id: 'combo_legend',
 title: ' Lenda do Combo',
 description: 'Alcance um combo de 15x',
 requirement: { type: 'max_combo', value: 15 },
 reward: 700,
 tier: 'platinum'
 },
 {
 id: 'tspin_legend',
 title: ' Lenda T-Spin',
 description: 'Faça 200 T-Spins no total',
 requirement: { type: 'tspins_total', value: 200 },
 reward: 800,
 tier: 'platinum'
 },
 {
 id: 'veteran',
 title: ' Veterano',
 description: 'Jogue 200 partidas',
 requirement: { type: 'games_played', value: 200 },
 reward: 600,
 tier: 'platinum'
 },
 {
 id: 'ultimate_cleaner',
 title: ' Limpador Supremo',
 description: 'Limpe 2.000 linhas no total',
 requirement: { type: 'lines_total', value: 2000 },
 reward: 700,
 tier: 'platinum'
 }
];

export class AchievementsService {
 constructor(gameRepository, currencyService, statisticsService) {
 this.gameRepository = gameRepository;
 this.currencyService = currencyService;
 this.statisticsService = statisticsService;
 this.achievements = this.loadAchievements();
 }

 loadAchievements() {
 const saved = this.gameRepository.load('achievements');

 if (!saved) {
 return ACHIEVEMENTS.map(achievement => ({
 ...achievement,
 unlocked: false,
 unlockedAt: null,
 progress: 0
 }));
 }

 const savedMap = new Map(saved.map(a => [a.id, a]));

 return ACHIEVEMENTS.map(achievement => {
 const savedAchievement = savedMap.get(achievement.id);
 if (savedAchievement) {

 return {
 ...achievement,
 unlocked: savedAchievement.unlocked || false,
 unlockedAt: savedAchievement.unlockedAt || null,
 progress: savedAchievement.progress || 0
 };
 }
 return {
 ...achievement,
 unlocked: false,
 unlockedAt: null,
 progress: 0
 };
 });
 }

 save() {
 this.gameRepository.save('achievements', this.achievements);
 }

 getAchievements() {
 return [...this.achievements];
 }

 getUnlocked() {
 return this.achievements.filter(a => a.unlocked);
 }

 getLocked() {
 return this.achievements.filter(a => !a.unlocked);
 }

 getByTier(tier) {
 return this.achievements.filter(a => a.tier === tier);
 }

 checkAchievements(stats) {
 const newUnlocks = [];

 this.achievements.forEach(achievement => {
 if (achievement.unlocked) return;

 const { type, value } = achievement.requirement;
 let currentValue = 0;

 switch (type) {
 case 'lines_total':
 currentValue = stats.linesCleared || 0;
 break;
 case 'games_played':
 currentValue = stats.gamesPlayed || 0;
 break;
 case 'score_single':
 currentValue = stats.highScore || 0;
 break;
 case 'max_combo':
 currentValue = stats.maxCombo || 0;
 break;
 case 'tspins_total':
 currentValue = stats.tSpins || 0;
 break;
 case 'survive_time':
 currentValue = stats.longestGame || 0;
 break;
 case 'max_level':
 currentValue = stats.maxLevel || 0;
 break;
 }

 achievement.progress = Math.min(currentValue, value);

 if (currentValue >= value) {
 achievement.unlocked = true;
 achievement.unlockedAt = new Date().toISOString();

 this.currencyService.addFish(achievement.reward, `Achievement: ${achievement.title}`);

 newUnlocks.push(achievement);

 }
 });

 if (newUnlocks.length > 0) {
 this.save();
 }

 return newUnlocks;
 }

 getStats() {
 const total = this.achievements.length;
 const unlocked = this.achievements.filter(a => a.unlocked).length;
 const totalRewards = this.achievements.reduce((sum, a) => sum + a.reward, 0);
 const earnedRewards = this.achievements
 .filter(a => a.unlocked)
 .reduce((sum, a) => sum + a.reward, 0);

 const byTier = {
 bronze: this.getByTier('bronze').filter(a => a.unlocked).length,
 silver: this.getByTier('silver').filter(a => a.unlocked).length,
 gold: this.getByTier('gold').filter(a => a.unlocked).length,
 platinum: this.getByTier('platinum').filter(a => a.unlocked).length
 };

 return {
 total,
 unlocked,
 percentage: Math.floor((unlocked / total) * 100),
 totalRewards,
 earnedRewards,
 byTier
 };
 }

 reset() {
 this.achievements = ACHIEVEMENTS.map(achievement => ({
 ...achievement,
 unlocked: false,
 unlockedAt: null,
 progress: 0
 }));
 this.save();
 }
}

export { ACHIEVEMENTS };
