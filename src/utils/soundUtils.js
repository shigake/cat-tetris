// Utilitários para lidar com sons
export const createMockSound = () => {
  return () => {
    // Função vazia para quando não há arquivo de som
    console.log('Som simulado tocado');
  };
};

// URLs de som padrão (você pode substituir por arquivos reais)
export const SOUND_URLS = {
  meow: '/sounds/meow.mp3',
  lineClear: '/sounds/line-clear.mp3',
  gameOver: '/sounds/game-over.mp3'
};

// Função para verificar se um arquivo de som existe
export const checkSoundFile = async (url) => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}; 