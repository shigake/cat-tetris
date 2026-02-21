const sharp = require('sharp');

async function createFeatureGraphic() {
  const width = 1024;
  const height = 500;

  // Create SVG with game-themed gradient background and cat tetris branding
  const svg = `
  <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#667eea"/>
        <stop offset="50%" style="stop-color:#764ba2"/>
        <stop offset="100%" style="stop-color:#f093fb"/>
      </linearGradient>
      <linearGradient id="titleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#fbbf24"/>
        <stop offset="100%" style="stop-color:#f59e0b"/>
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="3" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <filter id="shadow">
        <feDropShadow dx="2" dy="4" stdDeviation="4" flood-color="#000" flood-opacity="0.5"/>
      </filter>
    </defs>
    
    <!-- Background -->
    <rect width="${width}" height="${height}" fill="url(#bg)"/>
    
    <!-- Decorative tetris blocks scattered -->
    <!-- I-piece -->
    <rect x="50" y="80" width="30" height="120" rx="4" fill="#00d4ff" opacity="0.3"/>
    <!-- T-piece -->
    <rect x="900" y="350" width="90" height="30" rx="4" fill="#a855f7" opacity="0.3"/>
    <rect x="930" y="320" width="30" height="30" rx="4" fill="#a855f7" opacity="0.3"/>
    <!-- L-piece -->
    <rect x="120" y="380" width="30" height="90" rx="4" fill="#f97316" opacity="0.3"/>
    <rect x="150" y="440" width="30" height="30" rx="4" fill="#f97316" opacity="0.3"/>
    <!-- S-piece -->
    <rect x="880" y="60" width="60" height="30" rx="4" fill="#22c55e" opacity="0.3"/>
    <rect x="850" y="90" width="60" height="30" rx="4" fill="#22c55e" opacity="0.3"/>
    <!-- O-piece -->
    <rect x="200" y="30" width="50" height="50" rx="4" fill="#eab308" opacity="0.25"/>
    <!-- Z-piece -->
    <rect x="780" y="420" width="60" height="30" rx="4" fill="#ef4444" opacity="0.3"/>
    <rect x="810" y="450" width="60" height="30" rx="4" fill="#ef4444" opacity="0.3"/>
    
    <!-- Small blocks pattern -->
    <rect x="300" y="20" width="20" height="20" rx="3" fill="#60a5fa" opacity="0.15"/>
    <rect x="700" y="15" width="20" height="20" rx="3" fill="#c084fc" opacity="0.15"/>
    <rect x="150" y="200" width="20" height="20" rx="3" fill="#34d399" opacity="0.15"/>
    <rect x="850" y="220" width="20" height="20" rx="3" fill="#fb923c" opacity="0.15"/>
    <rect x="100" y="450" width="20" height="20" rx="3" fill="#f472b6" opacity="0.15"/>
    <rect x="950" y="150" width="20" height="20" rx="3" fill="#fbbf24" opacity="0.15"/>
    
    <!-- Cat ears (big, centered above title area) -->
    <polygon points="390,100 430,170 350,170" fill="#fbbf24" opacity="0.9"/>
    <polygon points="634,100 674,170 594,170" fill="#fbbf24" opacity="0.9"/>
    <!-- Inner ears -->
    <polygon points="390,115 420,165 360,165" fill="#f59e0b" opacity="0.7"/>
    <polygon points="634,115 664,165 604,165" fill="#f59e0b" opacity="0.7"/>
    
    <!-- Cat face circle -->
    <circle cx="512" cy="210" r="60" fill="#fbbf24" opacity="0.9"/>
    <!-- Eyes -->
    <ellipse cx="492" cy="200" rx="8" ry="10" fill="#1e1e3c"/>
    <ellipse cx="532" cy="200" rx="8" ry="10" fill="#1e1e3c"/>
    <!-- Eye shine -->
    <circle cx="495" cy="196" r="3" fill="white" opacity="0.8"/>
    <circle cx="535" cy="196" r="3" fill="white" opacity="0.8"/>
    <!-- Nose -->
    <polygon points="512,215 507,222 517,222" fill="#f59e0b"/>
    <!-- Mouth -->
    <path d="M500,228 Q512,240 524,228" fill="none" stroke="#1e1e3c" stroke-width="2"/>
    <!-- Whiskers -->
    <line x1="450" y1="215" x2="485" y2="210" stroke="#1e1e3c" stroke-width="1.5" opacity="0.6"/>
    <line x1="450" y1="225" x2="485" y2="222" stroke="#1e1e3c" stroke-width="1.5" opacity="0.6"/>
    <line x1="574" y1="215" x2="539" y2="210" stroke="#1e1e3c" stroke-width="1.5" opacity="0.6"/>
    <line x1="574" y1="225" x2="539" y2="222" stroke="#1e1e3c" stroke-width="1.5" opacity="0.6"/>
    
    <!-- Title: CAT TETRIS -->
    <text x="512" y="340" font-family="Arial Black, Arial, sans-serif" font-size="72" font-weight="900" 
          text-anchor="middle" fill="url(#titleGrad)" filter="url(#shadow)" letter-spacing="4">
      CAT TETRIS
    </text>
    
    <!-- Subtitle -->
    <text x="512" y="385" font-family="Arial, sans-serif" font-size="22" font-weight="600" 
          text-anchor="middle" fill="white" opacity="0.9" letter-spacing="6">
      PUZZLE GAME WITH CATS
    </text>
    
    <!-- Bottom tagline -->
    <text x="512" y="450" font-family="Arial, sans-serif" font-size="16" 
          text-anchor="middle" fill="white" opacity="0.6" letter-spacing="2">
      AI Battles • Creator Mode • Multiplayer • Tutorials
    </text>
    
    <!-- Stars/sparkles -->
    <text x="280" y="320" font-size="20" fill="white" opacity="0.4">✦</text>
    <text x="740" y="300" font-size="16" fill="white" opacity="0.3">✦</text>
    <text x="180" y="150" font-size="14" fill="white" opacity="0.25">✦</text>
    <text x="820" y="170" font-size="18" fill="white" opacity="0.35">✦</text>
    <text x="350" y="460" font-size="12" fill="white" opacity="0.2">✦</text>
    <text x="680" y="450" font-size="15" fill="white" opacity="0.25">✦</text>
  </svg>`;

  await sharp(Buffer.from(svg))
    .png()
    .toFile('public/feature-graphic.png');

  const meta = await sharp('public/feature-graphic.png').metadata();
  console.log(`Feature graphic created: ${meta.width}x${meta.height}`);
}

createFeatureGraphic().catch(console.error);
