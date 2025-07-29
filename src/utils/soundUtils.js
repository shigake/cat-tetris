export function playSound(soundName) {
  const audio = new Audio(SOUND_URLS[soundName]);
  audio.volume = 0.3;
  audio.play().catch(() => {});
}

export function playSoundWithVolume(soundName, volume = 0.3) {
  const audio = new Audio(SOUND_URLS[soundName]);
  audio.volume = volume;
  audio.play().catch(() => {});
}

export const SOUND_URLS = {
  'meow': 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
  'line-clear': 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
  'game-over': 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
};

export function playSoundWithFallback(soundName) {
  try {
    const audio = new Audio(SOUND_URLS[soundName] || SOUND_URLS['meow']);
    audio.volume = 0.2;
    audio.play().catch(() => {});
  } catch (error) {
    console.log(`Som ${soundName} não disponível`);
  }
}

export function checkSoundFile(soundName) {
  return new Promise((resolve) => {
    const audio = new Audio(`/sounds/${soundName}.mp3`);
    audio.addEventListener('canplaythrough', () => resolve(true));
    audio.addEventListener('error', () => resolve(false));
    audio.load();
  });
} 