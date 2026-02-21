/**
 * Generate PNG icons from SVG for PWA/Play Store
 * Run: node generate-icons.cjs
 * 
 * This creates a self-contained HTML file that generates PNGs via canvas.
 * Open the HTML file in a browser and click the buttons to download icons.
 * 
 * Alternatively, use https://realfavicongenerator.net or PWABuilder to generate icons.
 */

const fs = require('fs');
const path = require('path');

const svgContent = fs.readFileSync(path.join(__dirname, 'public', 'cat-icon.svg'), 'utf8');
const svgBase64 = Buffer.from(svgContent).toString('base64');

const sizes = [48, 72, 96, 128, 144, 192, 384, 512];

const html = `<!DOCTYPE html>
<html>
<head>
  <title>Cat Tetris - Icon Generator</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; background: #1a1a2e; color: white; }
    .icon-grid { display: flex; flex-wrap: wrap; gap: 20px; margin-top: 20px; }
    .icon-item { text-align: center; background: #16213e; padding: 15px; border-radius: 10px; }
    .icon-item canvas { border: 1px solid #444; border-radius: 8px; }
    .icon-item p { margin: 8px 0; }
    button { background: #764ba2; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin: 5px; font-size: 14px; }
    button:hover { background: #667eea; }
    .download-all { font-size: 18px; padding: 15px 30px; margin: 20px 0; }
    h1 { color: #FFB6C1; }
    .status { color: #4ade80; margin-top: 10px; }
    .maskable canvas { border: 2px solid #FFB6C1; }
  </style>
</head>
<body>
  <h1>🐱 Cat Tetris - Icon Generator</h1>
  <p>Click "Download All" to get all icon PNGs.</p>
  <p>Copy the downloaded files to <code>public/icons/</code></p>
  <button class="download-all" onclick="downloadAll()">📦 Download All Icons</button>
  <button class="download-all" onclick="downloadAllMaskable()">📦 Download All Maskable Icons</button>
  <div class="status" id="status"></div>
  
  <h2>Standard Icons (any)</h2>
  <div class="icon-grid" id="icons"></div>
  
  <h2>Maskable Icons (with padding)</h2>
  <div class="icon-grid maskable" id="maskable-icons"></div>

  <script>
    const svgDataUrl = 'data:image/svg+xml;base64,${svgBase64}';
    const sizes = [${sizes.join(',')}];
    const canvases = {};
    const maskableCanvases = {};

    function generateIcon(size, container, isMaskable) {
      const item = document.createElement('div');
      item.className = 'icon-item';
      
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      
      const img = new Image();
      img.onload = () => {
        if (isMaskable) {
          // Maskable: fill background + 10% safe zone padding
          ctx.fillStyle = '#764ba2';
          ctx.fillRect(0, 0, size, size);
          const padding = size * 0.1;
          ctx.drawImage(img, padding, padding, size - padding * 2, size - padding * 2);
          maskableCanvases[size] = canvas;
        } else {
          ctx.drawImage(img, 0, 0, size, size);
          canvases[size] = canvas;
        }
      };
      img.src = svgDataUrl;
      
      const label = document.createElement('p');
      label.textContent = size + 'x' + size;
      
      const btn = document.createElement('button');
      btn.textContent = '💾 Download';
      btn.onclick = () => {
        const link = document.createElement('a');
        const prefix = isMaskable ? 'maskable-icon-' : 'icon-';
        link.download = prefix + size + 'x' + size + '.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      };
      
      item.appendChild(canvas);
      item.appendChild(label);
      item.appendChild(btn);
      container.appendChild(item);
    }

    async function downloadAll() {
      const status = document.getElementById('status');
      status.textContent = 'Generating...';
      
      await new Promise(r => setTimeout(r, 500));
      
      for (const size of sizes) {
        const canvas = canvases[size];
        if (canvas) {
          const link = document.createElement('a');
          link.download = 'icon-' + size + 'x' + size + '.png';
          link.href = canvas.toDataURL('image/png');
          link.click();
          await new Promise(r => setTimeout(r, 200));
        }
      }
      status.textContent = '✅ All standard icons downloaded!';
    }

    async function downloadAllMaskable() {
      const status = document.getElementById('status');
      status.textContent = 'Generating maskable...';
      
      await new Promise(r => setTimeout(r, 500));
      
      for (const size of sizes) {
        const canvas = maskableCanvases[size];
        if (canvas) {
          const link = document.createElement('a');
          link.download = 'maskable-icon-' + size + 'x' + size + '.png';
          link.href = canvas.toDataURL('image/png');
          link.click();
          await new Promise(r => setTimeout(r, 200));
        }
      }
      status.textContent = '✅ All maskable icons downloaded!';
    }

    // Generate all
    const iconsDiv = document.getElementById('icons');
    const maskableDiv = document.getElementById('maskable-icons');
    sizes.forEach(s => generateIcon(s, iconsDiv, false));
    sizes.forEach(s => generateIcon(s, maskableDiv, true));
  </script>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, 'icon-generator.html'), html);
console.log('✅ icon-generator.html created!');
console.log('');
console.log('Next steps:');
console.log('1. Open icon-generator.html in Chrome');
console.log('2. Click "Download All Icons" and "Download All Maskable Icons"');
console.log('3. Move the PNGs to public/icons/');
console.log('4. Then run: npm run build');
