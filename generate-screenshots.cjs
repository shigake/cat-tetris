/**
 * Generate placeholder screenshots for PWA manifest
 * Run: node generate-screenshots.cjs
 */
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const outDir = path.join(__dirname, 'public', 'screenshots');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

async function createScreenshot(width, height, filename, label, bgColor) {
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${bgColor[0]}"/>
        <stop offset="100%" style="stop-color:${bgColor[1]}"/>
      </linearGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#bg)"/>
    <text x="${width/2}" y="${height * 0.35}" text-anchor="middle" font-family="Arial,sans-serif" font-size="${Math.round(width * 0.12)}" font-weight="bold" fill="#fff">🐱</text>
    <text x="${width/2}" y="${height * 0.50}" text-anchor="middle" font-family="Arial,sans-serif" font-size="${Math.round(width * 0.07)}" font-weight="bold" fill="#fff">Cat Tetris</text>
    <text x="${width/2}" y="${height * 0.62}" text-anchor="middle" font-family="Arial,sans-serif" font-size="${Math.round(width * 0.035)}" fill="rgba(255,255,255,0.8)">${label}</text>
    <g transform="translate(${width*0.3}, ${height*0.68})">
      <rect x="0" y="0" width="${width*0.08}" height="${width*0.08}" rx="4" fill="#9b59b6" opacity="0.8"/>
      <rect x="${width*0.09}" y="0" width="${width*0.08}" height="${width*0.08}" rx="4" fill="#9b59b6" opacity="0.8"/>
      <rect x="${width*0.18}" y="0" width="${width*0.08}" height="${width*0.08}" rx="4" fill="#9b59b6" opacity="0.8"/>
      <rect x="${width*0.09}" y="${width*0.09}" width="${width*0.08}" height="${width*0.08}" rx="4" fill="#9b59b6" opacity="0.8"/>
    </g>
    <g transform="translate(${width*0.55}, ${height*0.72})">
      <rect x="0" y="0" width="${width*0.06}" height="${width*0.06}" rx="3" fill="#2ecc71" opacity="0.7"/>
      <rect x="${width*0.07}" y="0" width="${width*0.06}" height="${width*0.06}" rx="3" fill="#2ecc71" opacity="0.7"/>
      <rect x="${width*0.07}" y="${width*0.07}" width="${width*0.06}" height="${width*0.06}" rx="3" fill="#2ecc71" opacity="0.7"/>
      <rect x="${width*0.14}" y="${width*0.07}" width="${width*0.06}" height="${width*0.06}" rx="3" fill="#2ecc71" opacity="0.7"/>
    </g>
  </svg>`;

  await sharp(Buffer.from(svg)).png().toFile(path.join(outDir, filename));
  console.log(`✅ ${filename} (${width}x${height})`);
}

async function main() {
  // Mobile screenshots (narrow form factor)
  await createScreenshot(1080, 1920, 'mobile-1.png', 'Jogue Tetris com gatos fofos!', ['#667eea', '#764ba2']);
  await createScreenshot(1080, 1920, 'mobile-2.png', 'Conquistas, T-Spins e muito mais!', ['#764ba2', '#e74c9a']);
  
  // Desktop/wide screenshots
  await createScreenshot(1920, 1080, 'desktop-1.png', 'Jogue no navegador ou instale como app!', ['#667eea', '#4834d4']);
  
  console.log('\n🎉 Screenshots generated in public/screenshots/');
}

main().catch(console.error);
