export class SoundService {
  constructor() {
    this.sounds = new Map();
    this.isEnabled = true;
    this.volume = 0.3;
  }

  loadSound(name, url) {
    try {
      const audio = new Audio(url);
      audio.preload = 'auto';
      this.sounds[name] = audio;
    } catch (error) {
      this.sounds[name] = null;
    }
  }

  playSound(name) {
    if (!this.isEnabled) return;

    const sound = this.sounds.get(name);
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(() => {});
    }
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    this.sounds.forEach(sound => {
      sound.volume = this.volume;
    });
  }

  enable() {
    this.isEnabled = true;
  }

  disable() {
    this.isEnabled = false;
  }

  isSoundEnabled() {
    return this.isEnabled;
  }
}

export const soundService = new SoundService(); 