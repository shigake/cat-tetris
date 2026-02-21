/**
 * Generate PNG icons from SVG for PWA / Play Store
 * Run: node generate-icons-png.cjs
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, 'public', 'cat-icon.svg');
const outDir = path.join(__dirname, 'public', 'icons');

const sizes = [48, 72, 96, 128, 144, 192, 384, 512];

async function generate() {
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const svgBuffer = fs.readFileSync(svgPath);

  // Standard icons (any)
  for (const size of sizes) {
    const outPath = path.join(outDir, `icon-${size}x${size}.png`);
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outPath);
    console.log(`✅ ${outPath}`);
  }

  // Maskable icons (with background + safe zone padding)
  for (const size of sizes) {
    const padding = Math.round(size * 0.1);
    const innerSize = size - padding * 2;

    const innerPng = await sharp(svgBuffer)
      .resize(innerSize, innerSize)
      .png()
      .toBuffer();

    const outPath = path.join(outDir, `maskable-icon-${size}x${size}.png`);
    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 118, g: 75, b: 162, alpha: 1 } // #764ba2
      }
    })
      .composite([{ input: innerPng, left: padding, top: padding }])
      .png()
      .toFile(outPath);
    console.log(`✅ ${outPath} (maskable)`);
  }

  console.log('\n🎉 All icons generated in public/icons/');
}

generate().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
