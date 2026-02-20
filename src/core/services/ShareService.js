export class ShareService {
  constructor(playerStatsService) {
    this.playerStatsService = playerStatsService;
  }

  generateShareText(scoreData) {
    const { score, level, lines, mode } = scoreData;

    const modeText = mode ? ` no modo ${mode}` : '';

    return `🐱 Cat Tetris${modeText}!\n` +
           `🎮 Pontuação: ${score.toLocaleString()}\n` +
           `📈 Nível: ${level}\n` +
           `🧹 Linhas: ${lines}\n\n` +
           `Consegue me superar? 🏆`;
  }

  generateShareURL(scoreData) {
    const baseURL = window.location.origin + window.location.pathname;
    const params = new URLSearchParams({
      score: scoreData.score,
      level: scoreData.level,
      lines: scoreData.lines
    });

    return `${baseURL}?${params.toString()}`;
  }

  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return { success: true };
    } catch (error) {

      return { success: false, error: error.message };
    }
  }

  async shareNative(scoreData) {
    if (!navigator.share) {
      return { success: false, error: 'Web Share API not supported' };
    }

    try {
      const shareText = this.generateShareText(scoreData);
      const shareURL = this.generateShareURL(scoreData);

      await navigator.share({
        title: 'Minha pontuação no Cat Tetris',
        text: shareText,
        url: shareURL
      });

      return { success: true };
    } catch (error) {
      if (error.name === 'AbortError') {
        return { success: false, error: 'Share cancelled' };
      }

      return { success: false, error: error.message };
    }
  }

  shareToTwitter(scoreData) {
    const shareText = this.generateShareText(scoreData);
    const shareURL = this.generateShareURL(scoreData);
    const twitterURL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareURL)}`;

    window.open(twitterURL, '_blank', 'width=600,height=400');
    return { success: true };
  }

  shareToFacebook(scoreData) {
    const shareURL = this.generateShareURL(scoreData);
    const facebookURL = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareURL)}`;

    window.open(facebookURL, '_blank', 'width=600,height=400');
    return { success: true };
  }

  shareToWhatsApp(scoreData) {
    const shareText = this.generateShareText(scoreData);
    const shareURL = this.generateShareURL(scoreData);
    const fullText = `${shareText}\n\n${shareURL}`;
    const whatsappURL = `https://wa.me/?text=${encodeURIComponent(fullText)}`;

    window.open(whatsappURL, '_blank');
    return { success: true };
  }

  async takeScreenshot(elementId) {

    return { success: false, error: 'Not implemented' };
  }

  getAvailableMethods() {
    return {
      native: !!navigator.share,
      clipboard: !!navigator.clipboard,
      twitter: true,
      facebook: true,
      whatsapp: true
    };
  }
}

