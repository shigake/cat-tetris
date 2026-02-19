/**
 * MissionsService - Gerencia missões diárias
 * Reseta a cada 24h, oferece recompensas em 🐟
 */

const MISSION_TYPES = {
  CLEAR_LINES: 'clear_lines',
  T_SPINS: 't_spins',
  COMBOS: 'combos',
  SURVIVE_TIME: 'survive_time',
  REACH_LEVEL: 'reach_level',
  SCORE_POINTS: 'score_points',
  PLACE_PIECES: 'place_pieces',
  BACK_TO_BACK: 'back_to_back',
  TETRIS_CLEAR: 'tetris_clear' // 4 linhas de uma vez
};

const MISSION_POOL = [
  // Easy missions (100-150 🐟)
  { type: MISSION_TYPES.CLEAR_LINES, target: 20, reward: 100, difficulty: 'easy', 
    title: 'Limpeza Básica', description: 'Limpe 20 linhas' },
  { type: MISSION_TYPES.PLACE_PIECES, target: 30, reward: 100, difficulty: 'easy',
    title: 'Gato Trabalhador', description: 'Coloque 30 peças' },
  { type: MISSION_TYPES.SURVIVE_TIME, target: 180, reward: 120, difficulty: 'easy',
    title: 'Sobrevivente', description: 'Sobreviva por 3 minutos' },
  { type: MISSION_TYPES.SCORE_POINTS, target: 5000, reward: 150, difficulty: 'easy',
    title: 'Fazendo Pontos', description: 'Alcance 5.000 pontos' },
  
  // Medium missions (150-250 🐟)
  { type: MISSION_TYPES.CLEAR_LINES, target: 40, reward: 200, difficulty: 'medium',
    title: 'Limpeza Profunda', description: 'Limpe 40 linhas em uma partida' },
  { type: MISSION_TYPES.T_SPINS, target: 3, reward: 250, difficulty: 'medium',
    title: 'Mestre do T-Spin', description: 'Faça 3 T-Spins' },
  { type: MISSION_TYPES.COMBOS, target: 7, reward: 200, difficulty: 'medium',
    title: 'Combo Felino', description: 'Alcance um combo de 7x' },
  { type: MISSION_TYPES.REACH_LEVEL, target: 8, reward: 180, difficulty: 'medium',
    title: 'Subindo de Nível', description: 'Alcance o nível 8' },
  { type: MISSION_TYPES.TETRIS_CLEAR, target: 2, reward: 220, difficulty: 'medium',
    title: 'Tetris Duplo', description: 'Faça 2 Tetris (4 linhas)' },
  
  // Hard missions (250-400 🐟)
  { type: MISSION_TYPES.T_SPINS, target: 5, reward: 350, difficulty: 'hard',
    title: 'Ninja T-Spin', description: 'Faça 5 T-Spins em uma partida' },
  { type: MISSION_TYPES.COMBOS, target: 10, reward: 300, difficulty: 'hard',
    title: 'Combo Insano', description: 'Alcance um combo de 10x' },
  { type: MISSION_TYPES.SURVIVE_TIME, target: 600, reward: 400, difficulty: 'hard',
    title: 'Resistência Felina', description: 'Sobreviva por 10 minutos' },
  { type: MISSION_TYPES.REACH_LEVEL, target: 12, reward: 350, difficulty: 'hard',
    title: 'Mestre dos Gatos', description: 'Alcance o nível 12' },
  { type: MISSION_TYPES.SCORE_POINTS, target: 50000, reward: 400, difficulty: 'hard',
    title: 'Pontuação Lendária', description: 'Alcance 50.000 pontos' },
  { type: MISSION_TYPES.BACK_TO_BACK, target: 3, reward: 380, difficulty: 'hard',
    title: 'Back-to-Back Master', description: 'Faça 3 back-to-backs' },
];

export class MissionsService {
  constructor(gameRepository, currencyService) {
    this.gameRepository = gameRepository;
    this.currencyService = currencyService;
    this.missions = this.loadMissions();
    this.checkAndResetDaily();
  }

  loadMissions() {
    const saved = this.gameRepository.load('dailyMissions');
    return saved || this.generateNewMissions();
  }

  save() {
    this.gameRepository.save('dailyMissions', this.missions);
  }

  // Check if it's time to reset (new day)
  checkAndResetDaily() {
    const now = new Date();
    const today = now.toDateString();
    
    if (this.missions.lastResetDate !== today) {
      console.log('🔄 Resetando missões diárias...');
      this.missions = this.generateNewMissions();
      this.save();
    }
  }

  // Generate 3 new daily missions (1 easy, 1 medium, 1 hard)
  generateNewMissions() {
    const easyMissions = MISSION_POOL.filter(m => m.difficulty === 'easy');
    const mediumMissions = MISSION_POOL.filter(m => m.difficulty === 'medium');
    const hardMissions = MISSION_POOL.filter(m => m.difficulty === 'hard');
    
    const selectedMissions = [
      this.selectRandomMission(easyMissions),
      this.selectRandomMission(mediumMissions),
      this.selectRandomMission(hardMissions)
    ];

    const now = new Date();
    
    return {
      lastResetDate: now.toDateString(),
      missions: selectedMissions.map((mission, index) => ({
        id: `mission_${now.getTime()}_${index}`,
        ...mission,
        progress: 0,
        completed: false,
        claimed: false
      }))
    };
  }

  selectRandomMission(pool) {
    return pool[Math.floor(Math.random() * pool.length)];
  }

  // Get current missions
  getMissions() {
    this.checkAndResetDaily();
    return this.missions.missions;
  }

  // Update mission progress
  updateProgress(type, value) {
    let updated = false;
    
    this.missions.missions.forEach(mission => {
      if (mission.type === type && !mission.completed) {
        mission.progress = Math.max(mission.progress, value);
        
        if (mission.progress >= mission.target) {
          mission.completed = true;
          updated = true;
          console.log(`✅ Missão completa: ${mission.title}!`);
        }
      }
    });
    
    if (updated) {
      this.save();
    }
    
    return updated;
  }

  // Increment mission progress
  incrementProgress(type, amount = 1) {
    let updated = false;
    
    this.missions.missions.forEach(mission => {
      if (mission.type === type && !mission.completed) {
        mission.progress += amount;
        
        if (mission.progress >= mission.target) {
          mission.completed = true;
          updated = true;
          console.log(`✅ Missão completa: ${mission.title}!`);
        }
      }
    });
    
    if (updated) {
      this.save();
    }
    
    return updated;
  }

  // Claim mission reward
  claimReward(missionId) {
    const mission = this.missions.missions.find(m => m.id === missionId);
    
    if (!mission) return { success: false, error: 'Mission not found' };
    if (!mission.completed) return { success: false, error: 'Mission not completed' };
    if (mission.claimed) return { success: false, error: 'Already claimed' };
    
    mission.claimed = true;
    this.currencyService.addFish(mission.reward, `Mission: ${mission.title}`);
    this.save();
    
    return { 
      success: true, 
      reward: mission.reward,
      title: mission.title 
    };
  }

  // Get stats
  getStats() {
    const total = this.missions.missions.length;
    const completed = this.missions.missions.filter(m => m.completed).length;
    const claimed = this.missions.missions.filter(m => m.claimed).length;
    const totalRewards = this.missions.missions.reduce((sum, m) => sum + m.reward, 0);
    const claimedRewards = this.missions.missions
      .filter(m => m.claimed)
      .reduce((sum, m) => sum + m.reward, 0);
    
    return {
      total,
      completed,
      claimed,
      totalRewards,
      claimedRewards,
      allCompleted: completed === total,
      allClaimed: claimed === total
    };
  }

  // Reset (for testing)
  reset() {
    this.missions = this.generateNewMissions();
    this.save();
  }
}

export { MISSION_TYPES };
