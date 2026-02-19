/**
 * ShareService - Sistema de compartilhamento de scores
 */

export class ShareService {
  constructor(playerStatsService) {
    this.playerStatsService = playerStatsService;
  }

  // Generate share text
  generateShareText(scoreData) {
    const { score, level, lines, mode } = scoreData;
    
    const modeText = mode ? ` no modo ${mode}` : '';
    
    return `🐱 Cat Tetris${modeText}!\n` +
           `🎮 Pontuação: ${score.toLocaleString()}\n` +
           `📈 Nível: ${level}\n` +
           `🧹 Linhas: ${lines}\n\n` +
           `Consegue me superar? 🏆`;
  }

  // Generate share URL
  generateShareURL(scoreData) {
    const baseURL = window.location.origin + window.location.pathname;
    const params = new URLSearchParams({
      score: scoreData.score,
      level: scoreData.level,
      lines: scoreData.lines
    });
    
    return `${baseURL}?${params.toString()}`;
  }

  // Copy to clipboard
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return { success: true };
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return { success: false, error: error.message };
    }
  }

  // Share via Web Share API (mobile)
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
      console.error('Failed to share:', error);
      return { success: false, error: error.message };
    }
  }

  // Share to Twitter
  shareToTwitter(scoreData) {
    const shareText = this.generateShareText(scoreData);
    const shareURL = this.generateShareURL(scoreData);
    const twitterURL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareURL)}`;
    
    window.open(twitterURL, '_blank', 'width=600,height=400');
    return { success: true };
  }

  // Share to Facebook
  shareToFacebook(scoreData) {
    const shareURL = this.generateShareURL(scoreData);
    const facebookURL = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareURL)}`;
    
    window.open(facebookURL, '_blank', 'width=600,height=400');
    return { success: true };
  }

  // Share to WhatsApp
  shareToWhatsApp(scoreData) {
    const shareText = this.generateShareText(scoreData);
    const shareURL = this.generateShareURL(scoreData);
    const fullText = `${shareText}\n\n${shareURL}`;
    const whatsappURL = `https://wa.me/?text=${encodeURIComponent(fullText)}`;
    
    window.open(whatsappURL, '_blank');
    return { success: true };
  }

  // Take screenshot (requires html2canvas or similar)
  async takeScreenshot(elementId) {
    // Placeholder - would need html2canvas library
    console.log('Screenshot feature requires html2canvas library');
    return { success: false, error: 'Not implemented' };
  }

  // Get all available share methods
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
