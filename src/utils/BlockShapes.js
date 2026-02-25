function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
}
function lighten(hex, amt) {
  const [r, g, b] = hexToRgb(hex);
  const f = amt / 100;
  return rgbToHex(r + (255 - r) * f, g + (255 - g) * f, b + (255 - b) * f);
}
function darken(hex, amt) {
  const [r, g, b] = hexToRgb(hex);
  const f = 1 - amt / 100;
  return rgbToHex(r * f, g * f, b * f);
}

function faceUri(svgStr) {
  return `url("data:image/svg+xml,${encodeURIComponent(svgStr)}")`;
}

const GLOSS = faceUri(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">` +
  `<ellipse cx="5.5" cy="4.5" rx="4.5" ry="3.2" fill="white" opacity=".32"/>` +
  `</svg>`
);

function withFace(faceKey, gradient) {
  const f = FACES[faceKey];
  if (!f) return `${GLOSS} center/100% 100% no-repeat, ${gradient}`;
  return `${f} center/82% 82% no-repeat, ${GLOSS} center/100% 100% no-repeat, ${gradient}`;
}

const NS = 'http://www.w3.org/2000/svg';
const svg = (inner) => `<svg xmlns="${NS}" viewBox="0 0 16 16">${inner}</svg>`;
const svg24 = (inner) => `<svg xmlns="${NS}" viewBox="0 0 24 24">${inner}</svg>`;

const FACES = {

  cats: faceUri(svg(

    '<path d="M1.5 6.5L3.5 0.5 5.5 5" fill="rgba(0,0,0,.2)" stroke="rgba(0,0,0,.15)" stroke-width=".3"/>' +
    '<path d="M10.5 5L12.5 0.5 14.5 6.5" fill="rgba(0,0,0,.2)" stroke="rgba(0,0,0,.15)" stroke-width=".3"/>' +

    '<path d="M2.5 5.5L3.5 1.8 4.5 5" fill="#ff8fae" opacity=".5"/>' +
    '<path d="M11.5 5L12.5 1.8 13.5 5.5" fill="#ff8fae" opacity=".5"/>' +

    '<ellipse cx="5.5" cy="7.5" rx="1" ry="1.8" fill="rgba(0,0,0,.5)"/>' +
    '<ellipse cx="10.5" cy="7.5" rx="1" ry="1.8" fill="rgba(0,0,0,.5)"/>' +

    '<circle cx="6" cy="6.8" r=".55" fill="white" opacity=".85"/>' +
    '<circle cx="11" cy="6.8" r=".55" fill="white" opacity=".85"/>' +

    '<ellipse cx="8" cy="10" rx=".9" ry=".65" fill="#ff6b8a" opacity=".75"/>' +

    '<path d="M7 10.8L8 11.5 9 10.8" stroke="rgba(0,0,0,.35)" stroke-width=".6" fill="none"/>' +

    '<line x1=".5" y1="8.5" x2="4.5" y2="9.5" stroke="rgba(0,0,0,.2)" stroke-width=".5"/>' +
    '<line x1=".5" y1="10.5" x2="4.5" y2="10" stroke="rgba(0,0,0,.2)" stroke-width=".5"/>' +
    '<line x1="11.5" y1="9.5" x2="15.5" y2="8.5" stroke="rgba(0,0,0,.2)" stroke-width=".5"/>' +
    '<line x1="11.5" y1="10" x2="15.5" y2="10.5" stroke="rgba(0,0,0,.2)" stroke-width=".5"/>' +

    '<circle cx="3.2" cy="10" r="1.2" fill="#ff6b9d" opacity=".3"/>' +
    '<circle cx="12.8" cy="10" r="1.2" fill="#ff6b9d" opacity=".3"/>'
  )),

  dogs: faceUri(svg(

    '<ellipse cx="2" cy="4.5" rx="2.3" ry="4" fill="rgba(0,0,0,.2)"/>' +
    '<ellipse cx="14" cy="4.5" rx="2.3" ry="4" fill="rgba(0,0,0,.2)"/>' +

    '<circle cx="5.5" cy="6.5" r="2.2" fill="rgba(0,0,0,.45)"/>' +
    '<circle cx="10.5" cy="6.5" r="2.2" fill="rgba(0,0,0,.45)"/>' +

    '<circle cx="6.2" cy="5.8" r=".9" fill="white" opacity=".85"/>' +
    '<circle cx="11.2" cy="5.8" r=".9" fill="white" opacity=".85"/>' +
    '<circle cx="5" cy="7" r=".35" fill="white" opacity=".5"/>' +
    '<circle cx="10" cy="7" r=".35" fill="white" opacity=".5"/>' +

    '<ellipse cx="8" cy="9.5" rx="1.3" ry="1" fill="rgba(0,0,0,.5)"/>' +
    '<ellipse cx="8" cy="9.2" rx=".5" ry=".3" fill="white" opacity=".4"/>' +

    '<ellipse cx="8" cy="12.8" rx="1.5" ry="1.8" fill="#ff7088" opacity=".6"/>' +
    '<path d="M8 11.5V13.5" stroke="#e05070" stroke-width=".4" opacity=".4"/>' +

    '<circle cx="3" cy="9.5" r="1.3" fill="#ff6b9d" opacity=".3"/>' +
    '<circle cx="13" cy="9.5" r="1.3" fill="#ff6b9d" opacity=".3"/>'
  )),

  pandas: faceUri(svg(

    '<ellipse cx="4.5" cy="6.5" rx="3" ry="2.5" fill="rgba(0,0,0,.55)"/>' +
    '<ellipse cx="11.5" cy="6.5" rx="3" ry="2.5" fill="rgba(0,0,0,.55)"/>' +

    '<circle cx="4.8" cy="6.5" r="1.3" fill="white" opacity=".9"/>' +
    '<circle cx="11.2" cy="6.5" r="1.3" fill="white" opacity=".9"/>' +

    '<circle cx="5" cy="6.7" r=".65" fill="rgba(0,0,0,.7)"/>' +
    '<circle cx="11" cy="6.7" r=".65" fill="rgba(0,0,0,.7)"/>' +

    '<circle cx="5.3" cy="6.3" r=".25" fill="white" opacity=".9"/>' +
    '<circle cx="11.3" cy="6.3" r=".25" fill="white" opacity=".9"/>' +

    '<ellipse cx="8" cy="9.8" rx=".8" ry=".55" fill="rgba(0,0,0,.5)"/>' +

    '<path d="M7 10.8Q8 12.2 9 10.8" stroke="rgba(0,0,0,.3)" stroke-width=".6" fill="none"/>' +

    '<circle cx="3" cy="10" r="1.4" fill="#ff6b9d" opacity=".35"/>' +
    '<circle cx="13" cy="10" r="1.4" fill="#ff6b9d" opacity=".35"/>'
  )),

  foxes: faceUri(svg(

    '<path d="M1.5 7L3.5 0 5.5 5.5" fill="rgba(0,0,0,.2)"/>' +
    '<path d="M10.5 5.5L12.5 0 14.5 7" fill="rgba(0,0,0,.2)"/>' +

    '<path d="M2.5 5L3.5 1.5 4.5 4.5" fill="#ffcc66" opacity=".4"/>' +
    '<path d="M11.5 4.5L12.5 1.5 13.5 5" fill="#ffcc66" opacity=".4"/>' +

    '<path d="M3.5 7Q5.5 5 7 7.5" stroke="rgba(0,0,0,.55)" stroke-width="1.2" fill="none" stroke-linecap="round"/>' +
    '<path d="M9 7.5Q10.5 5 12.5 7" stroke="rgba(0,0,0,.55)" stroke-width="1.2" fill="none" stroke-linecap="round"/>' +

    '<circle cx="5.5" cy="6.8" r=".5" fill="rgba(0,0,0,.5)"/>' +
    '<circle cx="10.5" cy="6.8" r=".5" fill="rgba(0,0,0,.5)"/>' +

    '<path d="M7.2 9.8L8 10.8 8.8 9.8Z" fill="rgba(0,0,0,.4)"/>' +

    '<path d="M6 11.5Q8 13 10 11.5" stroke="rgba(0,0,0,.3)" stroke-width=".6" fill="none"/>' +

    '<circle cx="3.5" cy="9.5" r="1.2" fill="#ffaa55" opacity=".3"/>' +
    '<circle cx="12.5" cy="9.5" r="1.2" fill="#ffaa55" opacity=".3"/>'
  )),

  robots: faceUri(svg(

    '<line x1="8" y1="0" x2="8" y2="3" stroke="rgba(0,0,0,.3)" stroke-width=".8"/>' +
    '<circle cx="8" cy="0.2" r="1" fill="#3af" opacity=".6"/>' +
    '<circle cx="8" cy="0.2" r=".4" fill="white" opacity=".7"/>' +

    '<rect x="3" y="5" width="4" height="3.2" rx=".6" fill="rgba(0,0,0,.35)"/>' +
    '<rect x="9" y="5" width="4" height="3.2" rx=".6" fill="rgba(0,0,0,.35)"/>' +

    '<rect x="3.5" y="5.5" width="3" height="2.2" rx=".4" fill="#3af" opacity=".5"/>' +
    '<rect x="9.5" y="5.5" width="3" height="2.2" rx=".4" fill="#3af" opacity=".5"/>' +

    '<circle cx="5" cy="6.6" r=".6" fill="white" opacity=".75"/>' +
    '<circle cx="11" cy="6.6" r=".6" fill="white" opacity=".75"/>' +

    '<rect x="4.5" y="10" width="7" height="2.5" rx=".6" fill="rgba(0,0,0,.25)"/>' +

    '<line x1="6.5" y1="10" x2="6.5" y2="12.5" stroke="rgba(0,0,0,.15)" stroke-width=".4"/>' +
    '<line x1="8" y1="10" x2="8" y2="12.5" stroke="rgba(0,0,0,.15)" stroke-width=".4"/>' +
    '<line x1="9.5" y1="10" x2="9.5" y2="12.5" stroke="rgba(0,0,0,.15)" stroke-width=".4"/>' +
    '<line x1="4.5" y1="11.2" x2="11.5" y2="11.2" stroke="rgba(0,0,0,.15)" stroke-width=".4"/>'
  )),

  neko_kawaii: faceUri(svg(
    // Big pointy ears
    '<path d="M2 7L4 1 6 5.5" fill="rgba(0,0,0,.18)" stroke="rgba(0,0,0,.12)" stroke-width=".3"/>' +
    '<path d="M10 5.5L12 1 14 7" fill="rgba(0,0,0,.18)" stroke="rgba(0,0,0,.12)" stroke-width=".3"/>' +
    // Inner ear pink
    '<path d="M3 5.5L4 2.5 5 5" fill="#ffb3d9" opacity=".55"/>' +
    '<path d="M11 5L12 2.5 13 5.5" fill="#ffb3d9" opacity=".55"/>' +
    // Huge sparkly eyes
    '<ellipse cx="5" cy="7.5" rx="2" ry="2.3" fill="rgba(0,0,0,.5)"/>' +
    '<ellipse cx="11" cy="7.5" rx="2" ry="2.3" fill="rgba(0,0,0,.5)"/>' +
    // Eye shine (big)
    '<circle cx="5.8" cy="6.6" r="1" fill="white" opacity=".9"/>' +
    '<circle cx="11.8" cy="6.6" r="1" fill="white" opacity=".9"/>' +
    // Eye shine (small)
    '<circle cx="4.2" cy="8" r=".45" fill="white" opacity=".7"/>' +
    '<circle cx="10.2" cy="8" r=".45" fill="white" opacity=".7"/>' +
    // Tiny nose
    '<ellipse cx="8" cy="10" rx=".6" ry=".4" fill="#ff6b8a" opacity=".8"/>' +
    // "w" mouth
    '<path d="M6.5 11L7.5 11.8 8 11.2 8.5 11.8 9.5 11" stroke="rgba(0,0,0,.35)" stroke-width=".55" fill="none" stroke-linecap="round"/>' +
    // Blush cheeks
    '<circle cx="3" cy="10" r="1.5" fill="#ff6b9d" opacity=".35"/>' +
    '<circle cx="13" cy="10" r="1.5" fill="#ff6b9d" opacity=".35"/>' +
    // Sparkle decorations  ✦
    '<path d="M1 3L1.3 2 1.6 3 2.3 3.3 1.6 3.6 1.3 4.3 1 3.6 0.3 3.3Z" fill="#ffe066" opacity=".7"/>' +
    '<path d="M14 2L14.2 1.4 14.4 2 14.8 2.2 14.4 2.4 14.2 2.8 14 2.4 13.6 2.2Z" fill="#ffe066" opacity=".5"/>'
  )),

  shadow_cat: faceUri(svg(
    // Pointy ears (dark)
    '<path d="M1.5 7L3.5 0.5 5.5 5.5" fill="rgba(0,0,0,.35)" stroke="rgba(0,0,0,.2)" stroke-width=".4"/>' +
    '<path d="M10.5 5.5L12.5 0.5 14.5 7" fill="rgba(0,0,0,.35)" stroke="rgba(0,0,0,.2)" stroke-width=".4"/>' +
    // Inner ear dark purple
    '<path d="M2.5 5.5L3.5 2 4.5 5" fill="#6b3fa0" opacity=".4"/>' +
    '<path d="M11.5 5L12.5 2 13.5 5.5" fill="#6b3fa0" opacity=".4"/>' +
    // Glowing slit eyes
    '<ellipse cx="5.5" cy="7.5" rx="1.8" ry="1" fill="rgba(0,0,0,.6)"/>' +
    '<ellipse cx="10.5" cy="7.5" rx="1.8" ry="1" fill="rgba(0,0,0,.6)"/>' +
    // Slit pupils (vertical)
    '<ellipse cx="5.5" cy="7.5" rx=".35" ry="1.4" fill="#50ff90" opacity=".85"/>' +
    '<ellipse cx="10.5" cy="7.5" rx=".35" ry="1.4" fill="#50ff90" opacity=".85"/>' +
    // Glow halos
    '<ellipse cx="5.5" cy="7.5" rx="2.2" ry="1.3" fill="none" stroke="#50ff90" stroke-width=".3" opacity=".25"/>' +
    '<ellipse cx="10.5" cy="7.5" rx="2.2" ry="1.3" fill="none" stroke="#50ff90" stroke-width=".3" opacity=".25"/>' +
    // Dark nose
    '<ellipse cx="8" cy="10" rx=".7" ry=".5" fill="rgba(0,0,0,.5)"/>' +
    // Subtle smirk
    '<path d="M7 10.8Q8 12 9 10.8" stroke="rgba(0,0,0,.3)" stroke-width=".5" fill="none"/>' +
    // Whiskers (thin, ghostly)
    '<line x1=".8" y1="8.5" x2="4" y2="9" stroke="rgba(255,255,255,.15)" stroke-width=".4"/>' +
    '<line x1=".8" y1="10" x2="4" y2="10" stroke="rgba(255,255,255,.15)" stroke-width=".4"/>' +
    '<line x1="12" y1="9" x2="15.2" y2="8.5" stroke="rgba(255,255,255,.15)" stroke-width=".4"/>' +
    '<line x1="12" y1="10" x2="15.2" y2="10" stroke="rgba(255,255,255,.15)" stroke-width=".4"/>'
  )),

  maneki_neko: faceUri(svg(
    // Round ears
    '<circle cx="3.5" cy="3" r="2.5" fill="rgba(0,0,0,.15)"/>' +
    '<circle cx="12.5" cy="3" r="2.5" fill="rgba(0,0,0,.15)"/>' +
    '<circle cx="3.5" cy="3" r="1.5" fill="#ffcc44" opacity=".35"/>' +
    '<circle cx="12.5" cy="3" r="1.5" fill="#ffcc44" opacity=".35"/>' +
    // Oval happy eyes (closed, smiling)
    '<path d="M3.5 7.5Q5 5.5 6.5 7.5" stroke="rgba(0,0,0,.55)" stroke-width="1" fill="none" stroke-linecap="round"/>' +
    '<path d="M9.5 7.5Q11 5.5 12.5 7.5" stroke="rgba(0,0,0,.55)" stroke-width="1" fill="none" stroke-linecap="round"/>' +
    // Nose
    '<ellipse cx="8" cy="9.2" rx=".7" ry=".5" fill="#e85d75" opacity=".8"/>' +
    // Raised paw (left side)
    '<ellipse cx="2" cy="12" rx="1.8" ry="1.4" fill="rgba(0,0,0,.12)"/>' +
    '<ellipse cx="2" cy="11" rx="1" ry="1.5" fill="rgba(0,0,0,.1)"/>' +
    // Coin / koban
    '<ellipse cx="2" cy="13.5" rx="1.3" ry=".9" fill="#ffd700" opacity=".7" stroke="#cca300" stroke-width=".3"/>' +
    '<text x="2" y="14" text-anchor="middle" font-size="1.4" fill="#8B6508" opacity=".8" font-weight="bold">$</text>' +
    // Cat mouth
    '<path d="M7 10L8 10.8 9 10" stroke="rgba(0,0,0,.3)" stroke-width=".5" fill="none"/>' +
    // Blush
    '<circle cx="4" cy="9.5" r="1.2" fill="#ff6b9d" opacity=".3"/>' +
    '<circle cx="12" cy="9.5" r="1.2" fill="#ff6b9d" opacity=".3"/>' +
    // Collar / bell
    '<line x1="4" y1="14" x2="12" y2="14" stroke="#cc3333" stroke-width="1" opacity=".4"/>' +
    '<circle cx="8" cy="14.5" r=".8" fill="#ffd700" opacity=".6" stroke="#cca300" stroke-width=".3"/>'
  )),

  // ───── 10 NEW CREATIVE THEMES ─────

  cyber_cat: faceUri(svg(
    // Sharp angular ears
    '<path d="M1 7L3.5 0 6 5" fill="rgba(0,0,0,.25)" stroke="#0ff" stroke-width=".4" opacity=".7"/>' +
    '<path d="M10 5L12.5 0 15 7" fill="rgba(0,0,0,.25)" stroke="#0ff" stroke-width=".4" opacity=".7"/>' +
    // Circuit lines in ears
    '<line x1="3" y1="3" x2="4.5" y2="5" stroke="#0ff" stroke-width=".3" opacity=".5"/>' +
    '<line x1="12" y1="3" x2="11.5" y2="5" stroke="#0ff" stroke-width=".3" opacity=".5"/>' +
    // Digital eyes (rectangular)
    '<rect x="3" y="6" width="4" height="2.5" rx=".5" fill="rgba(0,0,0,.5)"/>' +
    '<rect x="9" y="6" width="4" height="2.5" rx=".5" fill="rgba(0,0,0,.5)"/>' +
    // Neon pupils
    '<rect x="4" y="6.5" width="2" height="1.5" rx=".3" fill="#0ff" opacity=".85"/>' +
    '<rect x="10" y="6.5" width="2" height="1.5" rx=".3" fill="#0ff" opacity=".85"/>' +
    // Scan lines
    '<line x1="3" y1="7" x2="7" y2="7" stroke="#0ff" stroke-width=".15" opacity=".3"/>' +
    '<line x1="9" y1="7" x2="13" y2="7" stroke="#0ff" stroke-width=".15" opacity=".3"/>' +
    // Small nose
    '<path d="M7.5 10L8 9.5 8.5 10Z" fill="#0ff" opacity=".5"/>' +
    // Digital mouth
    '<path d="M6 11H10" stroke="#0ff" stroke-width=".4" opacity=".4" stroke-dasharray=".8 .4"/>' +
    // Circuit whiskers
    '<line x1="0" y1="8" x2="3" y2="8.5" stroke="#0ff" stroke-width=".3" opacity=".35"/>' +
    '<line x1="0" y1="9.5" x2="3" y2="9.5" stroke="#0ff" stroke-width=".3" opacity=".35"/>' +
    '<line x1="13" y1="8.5" x2="16" y2="8" stroke="#0ff" stroke-width=".3" opacity=".35"/>' +
    '<line x1="13" y1="9.5" x2="16" y2="9.5" stroke="#0ff" stroke-width=".3" opacity=".35"/>'
  )),

  royal_cat: faceUri(svg(
    // Crown
    '<path d="M3 4L5 0 8 3 11 0 13 4Z" fill="#ffd700" opacity=".7" stroke="#cca300" stroke-width=".3"/>' +
    '<circle cx="5" cy="1" r=".6" fill="#ff4444" opacity=".7"/>' +
    '<circle cx="8" cy="2" r=".6" fill="#4488ff" opacity=".7"/>' +
    '<circle cx="11" cy="1" r=".6" fill="#44ff44" opacity=".7"/>' +
    // Fluffy ears behind crown
    '<path d="M2 6L3 2.5 5 5.5" fill="rgba(0,0,0,.15)"/>' +
    '<path d="M11 5.5L13 2.5 14 6" fill="rgba(0,0,0,.15)"/>' +
    // Regal eyes (almond shaped)
    '<ellipse cx="5.5" cy="8" rx="1.5" ry="1.2" fill="rgba(0,0,0,.45)"/>' +
    '<ellipse cx="10.5" cy="8" rx="1.5" ry="1.2" fill="rgba(0,0,0,.45)"/>' +
    '<circle cx="6" cy="7.6" r=".65" fill="white" opacity=".85"/>' +
    '<circle cx="11" cy="7.6" r=".65" fill="white" opacity=".85"/>' +
    '<circle cx="5.2" cy="8.2" r=".3" fill="white" opacity=".5"/>' +
    '<circle cx="10.2" cy="8.2" r=".3" fill="white" opacity=".5"/>' +
    // Noble nose
    '<ellipse cx="8" cy="10.3" rx=".6" ry=".4" fill="#d4628a" opacity=".7"/>' +
    // Refined smile
    '<path d="M7 11Q8 12 9 11" stroke="rgba(0,0,0,.3)" stroke-width=".5" fill="none"/>' +
    // Royal blush
    '<circle cx="3.5" cy="10" r="1" fill="#e8a0b8" opacity=".25"/>' +
    '<circle cx="12.5" cy="10" r="1" fill="#e8a0b8" opacity=".25"/>'
  )),

  pirate_cat: faceUri(svg(
    // Ears
    '<path d="M1.5 7L3.5 1 5.5 5.5" fill="rgba(0,0,0,.2)" stroke="rgba(0,0,0,.15)" stroke-width=".3"/>' +
    '<path d="M10.5 5.5L12.5 1 14.5 7" fill="rgba(0,0,0,.2)" stroke="rgba(0,0,0,.15)" stroke-width=".3"/>' +
    // Eyepatch (left eye)
    '<ellipse cx="5.5" cy="7.5" rx="2" ry="1.8" fill="rgba(0,0,0,.65)"/>' +
    '<line x1="5.5" y1="5.5" x2="12" y2="3" stroke="rgba(0,0,0,.4)" stroke-width=".6"/>' +
    // Skull on patch
    '<circle cx="5.5" cy="7.3" r=".6" fill="white" opacity=".4"/>' +
    '<path d="M5 8L5.5 8.3 6 8" stroke="white" stroke-width=".3" opacity=".3"/>' +
    // Good eye (scarred)
    '<ellipse cx="10.5" cy="7.5" rx="1.3" ry="1.5" fill="rgba(0,0,0,.5)"/>' +
    '<circle cx="11" cy="7" r=".7" fill="white" opacity=".85"/>' +
    '<circle cx="10.2" cy="7.8" r=".3" fill="white" opacity=".5"/>' +
    // Scar
    '<line x1="9" y1="5" x2="10" y2="9.5" stroke="rgba(0,0,0,.25)" stroke-width=".5"/>' +
    // Nose
    '<ellipse cx="8" cy="10" rx=".7" ry=".5" fill="rgba(0,0,0,.4)"/>' +
    // Smirk
    '<path d="M7 11Q8.5 12.5 10 10.5" stroke="rgba(0,0,0,.35)" stroke-width=".6" fill="none"/>' +
    // Whiskers
    '<line x1="12" y1="9" x2="15.5" y2="8" stroke="rgba(0,0,0,.2)" stroke-width=".4"/>' +
    '<line x1="12" y1="10" x2="15.5" y2="10.5" stroke="rgba(0,0,0,.2)" stroke-width=".4"/>'
  )),

  astro_cat: faceUri(svg(
    // Helmet dome
    '<ellipse cx="8" cy="8" rx="7.5" ry="7" fill="none" stroke="rgba(255,255,255,.3)" stroke-width="1.2"/>' +
    '<ellipse cx="8" cy="8" rx="7" ry="6.5" fill="none" stroke="rgba(100,180,255,.15)" stroke-width=".5"/>' +
    // Visor reflection
    '<path d="M2 6Q3 3 8 2.5Q13 3 14 6" fill="none" stroke="rgba(100,200,255,.25)" stroke-width=".8"/>' +
    // Small ears inside helmet
    '<path d="M4 5L5 2.5 6 4.5" fill="rgba(0,0,0,.15)"/>' +
    '<path d="M10 4.5L11 2.5 12 5" fill="rgba(0,0,0,.15)"/>' +
    // Round space eyes
    '<circle cx="5.5" cy="7.5" r="1.5" fill="rgba(0,0,0,.45)"/>' +
    '<circle cx="10.5" cy="7.5" r="1.5" fill="rgba(0,0,0,.45)"/>' +
    '<circle cx="6" cy="7" r=".7" fill="white" opacity=".85"/>' +
    '<circle cx="11" cy="7" r=".7" fill="white" opacity=".85"/>' +
    // Star reflection in eye
    '<path d="M5 8L5.15 7.6 5.5 7.5 5.15 7.4 5 7Z" fill="white" opacity=".5"/>' +
    '<path d="M10 8L10.15 7.6 10.5 7.5 10.15 7.4 10 7Z" fill="white" opacity=".5"/>' +
    // Nose
    '<ellipse cx="8" cy="10" rx=".5" ry=".35" fill="#ff8ca0" opacity=".7"/>' +
    // Smile
    '<path d="M7 10.8Q8 11.8 9 10.8" stroke="rgba(0,0,0,.3)" stroke-width=".5" fill="none"/>' +
    // Antenna
    '<line x1="8" y1="0" x2="8" y2="1.5" stroke="rgba(255,255,255,.4)" stroke-width=".6"/>' +
    '<circle cx="8" cy="0" r=".7" fill="#ff4444" opacity=".6"/>'
  )),

  sakura_cat: faceUri(svg(
    // Soft rounded ears
    '<path d="M2 6.5L3.5 1.5 5.5 5" fill="rgba(0,0,0,.15)" stroke="rgba(0,0,0,.1)" stroke-width=".3"/>' +
    '<path d="M10.5 5L12.5 1.5 14 6.5" fill="rgba(0,0,0,.15)" stroke="rgba(0,0,0,.1)" stroke-width=".3"/>' +
    // Pink inner ears
    '<path d="M3 5L3.5 2.8 4.5 4.5" fill="#ffb8d0" opacity=".5"/>' +
    '<path d="M11.5 4.5L12.5 2.8 13 5" fill="#ffb8d0" opacity=".5"/>' +
    // Gentle eyes
    '<ellipse cx="5.5" cy="7.5" rx="1.2" ry="1.5" fill="rgba(0,0,0,.4)"/>' +
    '<ellipse cx="10.5" cy="7.5" rx="1.2" ry="1.5" fill="rgba(0,0,0,.4)"/>' +
    '<circle cx="6" cy="7" r=".6" fill="white" opacity=".85"/>' +
    '<circle cx="11" cy="7" r=".6" fill="white" opacity=".85"/>' +
    // Nose
    '<ellipse cx="8" cy="9.8" rx=".5" ry=".35" fill="#e88ca8" opacity=".75"/>' +
    // Gentle smile
    '<path d="M7 10.5Q8 11.5 9 10.5" stroke="rgba(0,0,0,.25)" stroke-width=".45" fill="none"/>' +
    // Cherry blossom petals (scattered)
    '<ellipse cx="1.5" cy="4" rx=".8" ry=".5" fill="#ffb8d0" opacity=".55" transform="rotate(-30 1.5 4)"/>' +
    '<ellipse cx="14" cy="3" rx=".7" ry=".4" fill="#ffb8d0" opacity=".45" transform="rotate(20 14 3)"/>' +
    '<ellipse cx="13" cy="12" rx=".6" ry=".35" fill="#ffc8dd" opacity=".5" transform="rotate(-15 13 12)"/>' +
    '<ellipse cx="2" cy="13" rx=".5" ry=".3" fill="#ffc8dd" opacity=".4" transform="rotate(25 2 13)"/>' +
    // Flower on ear
    '<circle cx="13.5" cy="2" r="1" fill="#ff8fae" opacity=".55"/>' +
    '<circle cx="13.5" cy="2" r=".4" fill="#ffdd66" opacity=".7"/>' +
    // Blush
    '<circle cx="3.5" cy="10" r="1.3" fill="#ff9dbf" opacity=".3"/>' +
    '<circle cx="12.5" cy="10" r="1.3" fill="#ff9dbf" opacity=".3"/>'
  )),

  ice_cat: faceUri(svg(
    // Crystalline ears (faceted)
    '<path d="M2 7L3 1.5 4 3.5 5 1 6 6" fill="rgba(150,220,255,.2)" stroke="rgba(180,230,255,.5)" stroke-width=".4"/>' +
    '<path d="M10 6L11 1 12 3.5 13 1.5 14 7" fill="rgba(150,220,255,.2)" stroke="rgba(180,230,255,.5)" stroke-width=".4"/>' +
    // Icy crystal eyes
    '<path d="M3.5 7L5.5 5.5 7.5 7 5.5 9Z" fill="rgba(100,200,255,.35)" stroke="rgba(180,230,255,.5)" stroke-width=".3"/>' +
    '<path d="M8.5 7L10.5 5.5 12.5 7 10.5 9Z" fill="rgba(100,200,255,.35)" stroke="rgba(180,230,255,.5)" stroke-width=".3"/>' +
    // Pupils
    '<circle cx="5.5" cy="7" r=".55" fill="rgba(0,0,0,.55)"/>' +
    '<circle cx="10.5" cy="7" r=".55" fill="rgba(0,0,0,.55)"/>' +
    '<circle cx="5.8" cy="6.7" r=".25" fill="white" opacity=".9"/>' +
    '<circle cx="10.8" cy="6.7" r=".25" fill="white" opacity=".9"/>' +
    // Nose
    '<path d="M7.5 10L8 9.4 8.5 10Z" fill="rgba(100,180,255,.5)"/>' +
    // Mouth
    '<path d="M7 10.8Q8 11.6 9 10.8" stroke="rgba(100,180,255,.35)" stroke-width=".4" fill="none"/>' +
    // Frost sparkle
    '<path d="M1.5 11L1.7 10.5 2.2 10.7 1.7 10.3 1.5 9.8 1.3 10.3 0.8 10.7 1.3 10.5Z" fill="white" opacity=".5"/>' +
    '<path d="M14 12L14.15 11.6 14.5 11.7 14.15 11.4 14 11 13.85 11.4 13.5 11.7 13.85 11.6Z" fill="white" opacity=".4"/>' +
    // Snowflake on forehead
    '<line x1="8" y1="3.5" x2="8" y2="5.5" stroke="rgba(200,230,255,.4)" stroke-width=".3"/>' +
    '<line x1="7" y1="4.5" x2="9" y2="4.5" stroke="rgba(200,230,255,.4)" stroke-width=".3"/>' +
    '<line x1="7.3" y1="3.8" x2="8.7" y2="5.2" stroke="rgba(200,230,255,.4)" stroke-width=".2"/>' +
    '<line x1="8.7" y1="3.8" x2="7.3" y2="5.2" stroke="rgba(200,230,255,.4)" stroke-width=".2"/>'
  )),

  lava_cat: faceUri(svg(
    // Flame ears
    '<path d="M1.5 7Q2 4 3.5 1Q4.5 3 5 2Q5.5 4 6 6" fill="rgba(255,100,0,.3)" stroke="rgba(255,150,0,.5)" stroke-width=".3"/>' +
    '<path d="M10 6Q10.5 4 11 2Q11.5 3 12.5 1Q14 4 14.5 7" fill="rgba(255,100,0,.3)" stroke="rgba(255,150,0,.5)" stroke-width=".3"/>' +
    // Glowing lava eyes
    '<ellipse cx="5.5" cy="7.5" rx="1.6" ry="1.3" fill="rgba(0,0,0,.5)"/>' +
    '<ellipse cx="10.5" cy="7.5" rx="1.6" ry="1.3" fill="rgba(0,0,0,.5)"/>' +
    // Fire iris
    '<ellipse cx="5.5" cy="7.5" rx="1" ry=".9" fill="#ff6600" opacity=".7"/>' +
    '<ellipse cx="10.5" cy="7.5" rx="1" ry=".9" fill="#ff6600" opacity=".7"/>' +
    // Slit pupils
    '<ellipse cx="5.5" cy="7.5" rx=".25" ry="1" fill="rgba(0,0,0,.7)"/>' +
    '<ellipse cx="10.5" cy="7.5" rx=".25" ry="1" fill="rgba(0,0,0,.7)"/>' +
    // Eye glow
    '<ellipse cx="5.5" cy="7.5" rx="2" ry="1.6" fill="none" stroke="#ff4400" stroke-width=".3" opacity=".3"/>' +
    '<ellipse cx="10.5" cy="7.5" rx="2" ry="1.6" fill="none" stroke="#ff4400" stroke-width=".3" opacity=".3"/>' +
    // Nose
    '<ellipse cx="8" cy="10" rx=".6" ry=".4" fill="rgba(0,0,0,.4)"/>' +
    // Fangs
    '<path d="M6.5 11L7 12.2" stroke="rgba(255,255,255,.5)" stroke-width=".5" stroke-linecap="round"/>' +
    '<path d="M9.5 11L9 12.2" stroke="rgba(255,255,255,.5)" stroke-width=".5" stroke-linecap="round"/>' +
    // Lava cracks
    '<path d="M1 13Q3 12 5 13.5" stroke="#ff6600" stroke-width=".3" opacity=".3" fill="none"/>' +
    '<path d="M11 13.5Q13 12 15 13" stroke="#ff6600" stroke-width=".3" opacity=".3" fill="none"/>'
  )),

  ninja_cat: faceUri(svg(
    // Ears poking above mask
    '<path d="M2 5L3.5 0.5 5 4" fill="rgba(0,0,0,.25)"/>' +
    '<path d="M11 4L12.5 0.5 14 5" fill="rgba(0,0,0,.25)"/>' +
    // Mask band
    '<rect x="0" y="5.5" width="16" height="4" rx="1" fill="rgba(0,0,0,.35)"/>' +
    // Eyes visible through mask slits
    '<ellipse cx="5.5" cy="7.5" rx="1.8" ry=".9" fill="rgba(0,0,0,.6)"/>' +
    '<ellipse cx="10.5" cy="7.5" rx="1.8" ry=".9" fill="rgba(0,0,0,.6)"/>' +
    // Sharp determined eyes
    '<ellipse cx="5.5" cy="7.5" rx="1" ry=".6" fill="white" opacity=".85"/>' +
    '<ellipse cx="10.5" cy="7.5" rx="1" ry=".6" fill="white" opacity=".85"/>' +
    '<circle cx="5.5" cy="7.5" r=".4" fill="rgba(0,0,0,.7)"/>' +
    '<circle cx="10.5" cy="7.5" r=".4" fill="rgba(0,0,0,.7)"/>' +
    // Headband knot (flowing)
    '<path d="M14.5 6Q15.5 5 15.8 3.5" stroke="rgba(0,0,0,.3)" stroke-width=".8" fill="none"/>' +
    '<path d="M14.5 7Q16 7 15.5 5" stroke="rgba(0,0,0,.25)" stroke-width=".8" fill="none"/>' +
    // Nose (subtle)
    '<ellipse cx="8" cy="10.5" rx=".5" ry=".3" fill="rgba(0,0,0,.25)"/>' +
    // Shuriken near ear
    '<path d="M1 12L1.5 11 2 12 2.5 11.5 2 13 1.5 12.5Z" fill="rgba(180,180,200,.35)"/>'
  )),

  galaxy_cat: faceUri(svg(
    // Cosmic ears
    '<path d="M2 7L4 1 6 5.5" fill="rgba(80,0,120,.25)" stroke="rgba(180,100,255,.3)" stroke-width=".3"/>' +
    '<path d="M10 5.5L12 1 14 7" fill="rgba(80,0,120,.25)" stroke="rgba(180,100,255,.3)" stroke-width=".3"/>' +
    // Stars in ears
    '<circle cx="3.5" cy="3.5" r=".4" fill="#ffe066" opacity=".6"/>' +
    '<circle cx="12.5" cy="3.5" r=".4" fill="#ffe066" opacity=".6"/>' +
    // Big galaxy eyes (nebula)
    '<circle cx="5.5" cy="7.5" r="2" fill="rgba(20,0,40,.6)"/>' +
    '<circle cx="10.5" cy="7.5" r="2" fill="rgba(20,0,40,.6)"/>' +
    // Nebula swirl in eyes
    '<ellipse cx="5.5" cy="7.5" rx="1.5" ry="1" fill="rgba(120,50,180,.4)" transform="rotate(-20 5.5 7.5)"/>' +
    '<ellipse cx="10.5" cy="7.5" rx="1.5" ry="1" fill="rgba(120,50,180,.4)" transform="rotate(20 10.5 7.5)"/>' +
    // Star pupils
    '<path d="M5.5 6.5L5.7 7.2 6.4 7.2 5.8 7.6 6 8.3 5.5 7.9 5 8.3 5.2 7.6 4.6 7.2 5.3 7.2Z" fill="white" opacity=".85"/>' +
    '<path d="M10.5 6.5L10.7 7.2 11.4 7.2 10.8 7.6 11 8.3 10.5 7.9 10 8.3 10.2 7.6 9.6 7.2 10.3 7.2Z" fill="white" opacity=".85"/>' +
    // Nose
    '<ellipse cx="8" cy="10" rx=".5" ry=".35" fill="#c888ff" opacity=".6"/>' +
    // Smile
    '<path d="M7 10.8Q8 11.8 9 10.8" stroke="rgba(180,130,255,.4)" stroke-width=".45" fill="none"/>' +
    // Orbiting stars
    '<circle cx="1" cy="5" r=".35" fill="#ffe066" opacity=".5"/>' +
    '<circle cx="15" cy="6" r=".25" fill="#88ccff" opacity=".5"/>' +
    '<circle cx="8" cy="14" r=".3" fill="#ff88cc" opacity=".4"/>' +
    '<circle cx="2" cy="12" r=".2" fill="#ffe066" opacity=".45"/>' +
    '<circle cx="14" cy="13" r=".2" fill="#88ccff" opacity=".4"/>'
  )),

  chef_cat: faceUri(svg(
    // Chef hat
    '<ellipse cx="8" cy="2.5" rx="5.5" ry="3" fill="rgba(255,255,255,.35)"/>' +
    '<rect x="3" y="2.5" width="10" height="2.5" rx=".5" fill="rgba(255,255,255,.3)"/>' +
    '<ellipse cx="8" cy="1.5" rx="3" ry="2" fill="rgba(255,255,255,.25)"/>' +
    // Ears peeking from under hat
    '<path d="M3 5.5L4 3 5 5" fill="rgba(0,0,0,.15)"/>' +
    '<path d="M11 5L12 3 13 5.5" fill="rgba(0,0,0,.15)"/>' +
    // Happy eyes (slightly squinted)
    '<ellipse cx="5.5" cy="8" rx="1.2" ry="1" fill="rgba(0,0,0,.45)"/>' +
    '<ellipse cx="10.5" cy="8" rx="1.2" ry="1" fill="rgba(0,0,0,.45)"/>' +
    '<circle cx="6" cy="7.5" r=".6" fill="white" opacity=".8"/>' +
    '<circle cx="11" cy="7.5" r=".6" fill="white" opacity=".8"/>' +
    // Nose
    '<ellipse cx="8" cy="10" rx=".6" ry=".4" fill="#ff6b8a" opacity=".7"/>' +
    // Curly mustache/whiskers
    '<path d="M5 10.8Q3 10 1.5 10.5Q2 11.5 3.5 11" stroke="rgba(0,0,0,.25)" stroke-width=".5" fill="none"/>' +
    '<path d="M11 10.8Q13 10 14.5 10.5Q14 11.5 12.5 11" stroke="rgba(0,0,0,.25)" stroke-width=".5" fill="none"/>' +
    // Satisfied smile
    '<path d="M6 12Q8 14 10 12" stroke="rgba(0,0,0,.3)" stroke-width=".6" fill="none"/>' +
    // Blush
    '<circle cx="3.5" cy="10.5" r="1" fill="#ff6b9d" opacity=".25"/>' +
    '<circle cx="12.5" cy="10.5" r="1" fill="#ff6b9d" opacity=".25"/>'
  )),

  // ── newskins: cat skins ──────────────────────────────────

  squished_cat: faceUri(svg24(
    '<path d="M2 2 L6 6 M22 2 L18 6" stroke="rgba(0,0,0,.3)" stroke-width="2" stroke-linecap="round"/>' +
    '<path d="M5 12 Q7 10 9 12 M15 12 Q17 10 19 12" stroke="rgba(0,0,0,.5)" stroke-width="1.5" fill="none" stroke-linecap="round"/>' +
    '<path d="M11 16 Q12 17 13 16" stroke="rgba(0,0,0,.45)" stroke-width="1.5" fill="none" stroke-linecap="round"/>' +
    '<circle cx="4" cy="20" r="2" fill="rgba(255,255,255,.4)"/>' +
    '<circle cx="20" cy="20" r="2" fill="rgba(255,255,255,.4)"/>'
  )),

  box_cat: faceUri(svg24(
    '<path d="M4 6 L3 1 L9 5 M20 6 L21 1 L15 5" fill="rgba(0,0,0,.15)" stroke="rgba(0,0,0,.2)" stroke-width="1" stroke-linejoin="round"/>' +
    '<circle cx="7.5" cy="12" r="1.5" fill="rgba(0,0,0,.5)"/>' +
    '<circle cx="16.5" cy="12" r="1.5" fill="rgba(0,0,0,.5)"/>' +
    '<circle cx="8" cy="11.5" r=".5" fill="white" opacity=".8"/>' +
    '<circle cx="17" cy="11.5" r=".5" fill="white" opacity=".8"/>' +
    '<path d="M11 14 Q12 15 13 14" stroke="rgba(0,0,0,.45)" stroke-width="1.2" fill="none" stroke-linecap="round"/>' +
    '<path d="M2 11 L5 12 M1 14 L5 13.5 M22 11 L19 12 M23 14 L19 13.5" stroke="rgba(0,0,0,.25)" stroke-width=".75" fill="none" stroke-linecap="round"/>'
  )),

  cat_face: faceUri(svg24(
    '<path d="M3 10 L2 2 L10 5 M21 10 L22 2 L14 5" fill="rgba(0,0,0,.15)" stroke="rgba(0,0,0,.2)" stroke-width="1" stroke-linejoin="round"/>' +
    '<circle cx="8" cy="13" r="2" fill="rgba(0,0,0,.5)"/>' +
    '<circle cx="16" cy="13" r="2" fill="rgba(0,0,0,.5)"/>' +
    '<circle cx="8.5" cy="12.5" r=".7" fill="white" opacity=".8"/>' +
    '<circle cx="16.5" cy="12.5" r=".7" fill="white" opacity=".8"/>' +
    '<path d="M11 16 Q12 17 13 16" stroke="rgba(0,0,0,.4)" stroke-width="1.5" fill="none" stroke-linecap="round"/>'
  )),

  yarn_ball: faceUri(svg24(
    '<circle cx="12" cy="12" r="10.5" fill="none" stroke="rgba(0,0,0,.1)" stroke-width="1"/>' +
    '<path d="M4 8 Q12 2 20 8 M2 14 Q12 20 22 14 M6 19 Q12 24 18 19 M8 4 Q12 9 16 4" stroke="rgba(0,0,0,.15)" stroke-width="1.5" fill="none" stroke-linecap="round"/>' +
    '<path d="M10 2 Q12 7 14 2" stroke="rgba(0,0,0,.15)" stroke-width="1.5" fill="none" stroke-linecap="round"/>' +
    '<path d="M6 6 Q12 2 18 6" stroke="rgba(255,255,255,.3)" stroke-width="2" fill="none" stroke-linecap="round"/>'
  )),

  paw_print: faceUri(svg24(
    '<path d="M12 12 C8 12 6 15 6 17.5 C6 20 9 22 12 22 C15 22 18 20 18 17.5 C18 15 16 12 12 12 Z" fill="rgba(255,255,255,.5)"/>' +
    '<circle cx="7" cy="9" r="2.5" fill="rgba(255,255,255,.45)"/>' +
    '<circle cx="12" cy="6.5" r="2.5" fill="rgba(255,255,255,.45)"/>' +
    '<circle cx="17" cy="9" r="2.5" fill="rgba(255,255,255,.45)"/>'
  )),

  fish_block: faceUri(svg24(
    '<path d="M18 12 L23 8 L23 16 Z" fill="rgba(255,255,255,.55)"/>' +
    '<ellipse cx="10" cy="12" rx="9" ry="5" fill="rgba(255,255,255,.45)"/>' +
    '<circle cx="5" cy="11" r="1.2" fill="rgba(0,0,0,.4)"/>' +
    '<circle cx="5.3" cy="10.7" r=".4" fill="white" opacity=".8"/>'
  )),

  milk_carton: faceUri(svg24(
    '<rect x="1" y="1" width="22" height="5" rx="1" fill="rgba(0,0,0,.1)"/>' +
    '<path d="M12 8 Q12 14 15 14 A3 3 0 0 1 9 14 Q12 14 12 8" fill="rgba(255,255,255,.4)"/>' +
    '<line x1="4" y1="20" x2="20" y2="20" stroke="rgba(0,0,0,.08)" stroke-width="2"/>'
  )),

  mouse_toy: faceUri(svg24(
    '<ellipse cx="10" cy="12" rx="6" ry="4" fill="rgba(0,0,0,.2)"/>' +
    '<circle cx="6" cy="8" r="2" fill="rgba(0,0,0,.25)"/>' +
    '<circle cx="10" cy="8" r="2" fill="rgba(0,0,0,.25)"/>' +
    '<path d="M16 12 Q20 12 22 16" stroke="rgba(0,0,0,.25)" stroke-width="1.5" fill="none" stroke-linecap="round"/>' +
    '<circle cx="6" cy="11" r=".6" fill="white" opacity=".8"/>'
  )),

  // ── newskins: dog skins ──────────────────────────────────

  dog_face: faceUri(svg24(
    '<path d="M4 6 Q1 12 4 18" fill="rgba(0,0,0,.1)" stroke="rgba(0,0,0,.2)" stroke-width="1.5"/>' +
    '<path d="M20 6 Q23 12 20 18" fill="rgba(0,0,0,.1)" stroke="rgba(0,0,0,.2)" stroke-width="1.5"/>' +
    '<circle cx="8" cy="11" r="1.5" fill="rgba(0,0,0,.5)"/>' +
    '<circle cx="16" cy="11" r="1.5" fill="rgba(0,0,0,.5)"/>' +
    '<circle cx="8.5" cy="10.5" r=".5" fill="white" opacity=".8"/>' +
    '<circle cx="16.5" cy="10.5" r=".5" fill="white" opacity=".8"/>' +
    '<ellipse cx="12" cy="15" rx="3" ry="2" fill="rgba(0,0,0,.5)"/>' +
    '<path d="M11 17 Q12 21 13 17" fill="#ff6b6b"/>'
  )),

  pug_face: faceUri(svg24(
    '<path d="M8 6 Q12 8 16 6 M6 9 Q12 11 18 9" stroke="rgba(0,0,0,.15)" stroke-width="1" fill="none"/>' +
    '<ellipse cx="12" cy="15" rx="6" ry="5" fill="rgba(0,0,0,.3)"/>' +
    '<circle cx="8" cy="13" r="1.5" fill="rgba(0,0,0,.5)"/>' +
    '<circle cx="16" cy="13" r="1.5" fill="rgba(0,0,0,.5)"/>' +
    '<circle cx="8.5" cy="12.5" r=".5" fill="white" opacity=".7"/>' +
    '<circle cx="16.5" cy="12.5" r=".5" fill="white" opacity=".7"/>' +
    '<ellipse cx="12" cy="14" rx="1.5" ry="1" fill="rgba(0,0,0,.6)"/>' +
    '<path d="M11 18 Q12 21 13 18" fill="#ff6b6b"/>'
  )),

  bone_block: faceUri(svg24(
    '<path d="M6 8 A3 3 0 0 0 6 16 L18 16 A3 3 0 0 0 18 8 Z" fill="rgba(255,255,255,.45)"/>' +
    '<circle cx="5" cy="8" r="3" fill="rgba(255,255,255,.4)"/>' +
    '<circle cx="5" cy="16" r="3" fill="rgba(255,255,255,.4)"/>' +
    '<circle cx="19" cy="8" r="3" fill="rgba(255,255,255,.4)"/>' +
    '<circle cx="19" cy="16" r="3" fill="rgba(255,255,255,.4)"/>' +
    '<path d="M8 10 L16 10" stroke="rgba(255,255,255,.55)" stroke-width="2" stroke-linecap="round"/>'
  )),

  dog_house: faceUri(svg24(
    '<path d="M2 10 L12 2 L22 10" fill="rgba(180,80,0,.5)" stroke="rgba(140,50,10,.55)" stroke-width="2" stroke-linejoin="round"/>' +
    '<path d="M8 22 L8 14 A4 4 0 0 1 16 14 L16 22" fill="rgba(0,0,0,.4)"/>' +
    '<path d="M4 14 L6 14 M18 14 L20 14 M4 18 L6 18 M18 18 L20 18" stroke="rgba(0,0,0,.15)" stroke-width="1" stroke-linecap="round"/>'
  )),
};

const THEME_STYLES = {

  classic: {
    label: 'Clássico',
    desc: 'Blocos 3D chanfrados',
    getStyle: (c) => ({
      borderRadius: '3px',
      border: '1.5px solid rgba(255,255,255,0.4)',
      background: withFace('classic', `linear-gradient(135deg, ${lighten(c, 45)} 0%, ${c} 40%, ${darken(c, 30)} 100%)`),
      boxShadow: `inset 2px 2px 0 ${lighten(c, 55)}, inset -2px -2px 0 ${darken(c, 45)}, 0 1px 3px rgba(0,0,0,0.5)`,
    }),
  },

  cats: {
    label: 'Gatinhos',
    desc: 'Patinhas macias e fofas',
    getStyle: (c) => ({
      borderRadius: '30% 30% 22% 22%',
      border: '1.5px solid rgba(255,255,255,0.35)',
      background: withFace('cats', `radial-gradient(circle at 40% 35%, ${lighten(c, 42)} 0%, ${c} 50%, ${darken(c, 22)} 100%)`),
      boxShadow: `inset 0 -3px 5px ${darken(c, 35)}, inset 0 3px 4px ${lighten(c, 35)}, 0 0 8px ${c}60`,
    }),
  },

  dogs: {
    label: 'Cachorrinhos',
    desc: 'Blocos gordinhos e alegres',
    getStyle: (c) => ({
      borderRadius: '30%',
      border: '1.5px solid rgba(255,255,255,0.3)',
      background: withFace('dogs', `radial-gradient(ellipse at 40% 30%, ${lighten(c, 50)} 0%, ${c} 48%, ${darken(c, 28)} 100%)`),
      boxShadow: `inset 0 3px 5px ${lighten(c, 45)}, inset 0 -3px 5px ${darken(c, 38)}, 0 2px 5px rgba(0,0,0,0.4)`,
    }),
  },

  pandas: {
    label: 'Pandas',
    desc: 'Bolinhas com anel escuro',
    getStyle: (c) => ({
      borderRadius: '50%',
      border: '2.5px solid rgba(20,20,20,0.55)',
      background: withFace('pandas', `radial-gradient(circle at 40% 38%, ${lighten(c, 45)} 0%, ${c} 55%, ${darken(c, 35)} 100%)`),
      boxShadow: `inset 0 0 5px ${lighten(c, 35)}, 0 0 0 1.5px rgba(0,0,0,0.35), 0 2px 4px rgba(0,0,0,0.45)`,
    }),
  },

  foxes: {
    label: 'Raposas',
    desc: 'Blocos angulares com fogo',
    getStyle: (c) => ({
      borderRadius: '4px 16px 4px 16px',
      border: '1.5px solid rgba(255,200,100,0.45)',
      background: withFace('foxes', `linear-gradient(145deg, ${lighten(c, 35)} 0%, ${c} 38%, ${darken(c, 22)} 75%, ${lighten(c, 18)} 100%)`),
      boxShadow: `inset 0 2px 4px ${lighten(c, 40)}, inset 0 -2px 3px ${darken(c, 35)}, 0 0 10px ${c}50`,
    }),
  },

  robots: {
    label: 'Robos',
    desc: 'Metal escovado industrial',
    getStyle: (c) => ({
      borderRadius: '3px',
      border: '2px solid rgba(120,160,190,0.55)',
      background: withFace('robots', `linear-gradient(180deg, ${lighten(c, 35)} 0%, ${c} 28%, ${darken(c, 12)} 72%, ${lighten(c, 20)} 100%)`),
      boxShadow: `inset 2px 2px 0 rgba(255,255,255,0.4), inset -2px -2px 0 rgba(0,0,0,0.4), 0 0 2px rgba(70,180,255,0.45), 0 2px 4px rgba(0,0,0,0.5)`,
    }),
  },

  neko_kawaii: {
    label: 'Neko Kawaii',
    desc: 'Gatinhos anime fofos',
    getStyle: (c) => ({
      borderRadius: '35% 35% 25% 25%',
      border: '1.5px solid rgba(255,180,220,0.5)',
      background: withFace('neko_kawaii', `radial-gradient(circle at 45% 30%, ${lighten(c, 55)} 0%, ${lighten(c, 25)} 30%, ${c} 60%, ${darken(c, 15)} 100%)`),
      boxShadow: `inset 0 3px 6px ${lighten(c, 45)}, inset 0 -2px 4px ${darken(c, 25)}, 0 0 12px ${lighten(c, 20)}50, 0 2px 6px rgba(0,0,0,0.3)`,
    }),
  },

  shadow_cat: {
    label: 'Shadow Cat',
    desc: 'Gato das sombras misterioso',
    getStyle: (c) => ({
      borderRadius: '25% 25% 18% 18%',
      border: '1.5px solid rgba(100,255,160,0.25)',
      background: withFace('shadow_cat', `radial-gradient(circle at 50% 45%, ${darken(c, 15)} 0%, ${darken(c, 40)} 55%, ${darken(c, 60)} 100%)`),
      boxShadow: `inset 0 2px 4px rgba(100,255,160,0.15), inset 0 -3px 5px ${darken(c, 50)}, 0 0 10px rgba(80,255,144,0.2), 0 2px 6px rgba(0,0,0,0.6)`,
    }),
  },

  maneki_neko: {
    label: 'Maneki Neko',
    desc: 'Gato da sorte japonês',
    getStyle: (c) => ({
      borderRadius: '40%',
      border: '2px solid rgba(255,215,0,0.45)',
      background: withFace('maneki_neko', `radial-gradient(circle at 42% 35%, ${lighten(c, 50)} 0%, ${lighten(c, 15)} 40%, ${c} 65%, ${darken(c, 20)} 100%)`),
      boxShadow: `inset 0 3px 5px ${lighten(c, 40)}, inset 0 -3px 5px ${darken(c, 30)}, 0 0 8px rgba(255,215,0,0.3), 0 2px 5px rgba(0,0,0,0.4)`,
    }),
  },

  cyber_cat: {
    label: 'Cyber Cat',
    desc: 'Gato cyberpunk neon',
    getStyle: (c) => ({
      borderRadius: '4px',
      border: '1.5px solid rgba(0,255,255,0.4)',
      background: withFace('cyber_cat', `linear-gradient(180deg, ${darken(c, 30)} 0%, ${darken(c, 45)} 40%, ${darken(c, 55)} 100%)`),
      boxShadow: `inset 0 1px 3px rgba(0,255,255,0.2), inset 0 -1px 2px rgba(0,0,0,0.5), 0 0 8px rgba(0,255,255,0.25), 0 0 2px rgba(0,255,255,0.15)`,
    }),
  },

  royal_cat: {
    label: 'Royal Cat',
    desc: 'Gato real com coroa',
    getStyle: (c) => ({
      borderRadius: '20% 20% 30% 30%',
      border: '2px solid rgba(255,215,0,0.5)',
      background: withFace('royal_cat', `radial-gradient(circle at 45% 40%, ${lighten(c, 40)} 0%, ${c} 45%, ${darken(c, 20)} 80%, ${darken(c, 35)} 100%)`),
      boxShadow: `inset 0 3px 5px ${lighten(c, 50)}, inset 0 -3px 5px ${darken(c, 35)}, 0 0 10px rgba(255,215,0,0.25), 0 2px 6px rgba(0,0,0,0.4)`,
    }),
  },

  pirate_cat: {
    label: 'Pirate Cat',
    desc: 'Gato pirata aventureiro',
    getStyle: (c) => ({
      borderRadius: '25% 35% 20% 30%',
      border: '1.5px solid rgba(139,90,43,0.5)',
      background: withFace('pirate_cat', `linear-gradient(160deg, ${lighten(c, 30)} 0%, ${c} 35%, ${darken(c, 25)} 70%, ${darken(c, 40)} 100%)`),
      boxShadow: `inset 2px 2px 3px ${lighten(c, 35)}, inset -2px -2px 3px ${darken(c, 40)}, 0 0 6px rgba(139,90,43,0.2), 0 2px 5px rgba(0,0,0,0.5)`,
    }),
  },

  astro_cat: {
    label: 'Astro Cat',
    desc: 'Gato astronauta espacial',
    getStyle: (c) => ({
      borderRadius: '50%',
      border: '2px solid rgba(200,220,255,0.4)',
      background: withFace('astro_cat', `radial-gradient(circle at 50% 45%, ${lighten(c, 45)} 0%, ${lighten(c, 10)} 35%, ${c} 60%, ${darken(c, 30)} 100%)`),
      boxShadow: `inset 0 3px 8px rgba(200,220,255,0.3), inset 0 -2px 4px ${darken(c, 35)}, 0 0 12px rgba(150,180,255,0.2), 0 2px 5px rgba(0,0,0,0.4)`,
    }),
  },

  sakura_cat: {
    label: 'Sakura Cat',
    desc: 'Gato cerejeira em flor',
    getStyle: (c) => ({
      borderRadius: '38% 38% 28% 28%',
      border: '1.5px solid rgba(255,180,200,0.45)',
      background: withFace('sakura_cat', `radial-gradient(circle at 45% 35%, ${lighten(c, 50)} 0%, ${lighten(c, 20)} 35%, ${c} 60%, ${darken(c, 15)} 100%)`),
      boxShadow: `inset 0 3px 6px ${lighten(c, 45)}, inset 0 -2px 4px ${darken(c, 20)}, 0 0 10px rgba(255,180,200,0.2), 0 2px 5px rgba(0,0,0,0.3)`,
    }),
  },

  ice_cat: {
    label: 'Ice Cat',
    desc: 'Gato de gelo cristalino',
    getStyle: (c) => ({
      borderRadius: '8px 2px 8px 2px',
      border: '1.5px solid rgba(150,220,255,0.5)',
      background: withFace('ice_cat', `linear-gradient(135deg, ${lighten(c, 55)} 0%, ${lighten(c, 30)} 25%, ${c} 50%, ${lighten(c, 15)} 75%, ${lighten(c, 45)} 100%)`),
      boxShadow: `inset 2px 2px 4px rgba(255,255,255,0.5), inset -1px -1px 3px ${darken(c, 20)}, 0 0 8px rgba(150,220,255,0.3), 0 1px 4px rgba(0,0,0,0.3)`,
    }),
  },

  lava_cat: {
    label: 'Lava Cat',
    desc: 'Gato vulcânico de fogo',
    getStyle: (c) => ({
      borderRadius: '20% 25% 18% 22%',
      border: '1.5px solid rgba(255,100,0,0.45)',
      background: withFace('lava_cat', `radial-gradient(circle at 50% 50%, ${lighten(c, 20)} 0%, ${c} 35%, ${darken(c, 30)} 65%, ${darken(c, 50)} 100%)`),
      boxShadow: `inset 0 2px 4px rgba(255,150,0,0.3), inset 0 -3px 5px ${darken(c, 45)}, 0 0 10px rgba(255,80,0,0.3), 0 2px 6px rgba(0,0,0,0.5)`,
    }),
  },

  ninja_cat: {
    label: 'Ninja Cat',
    desc: 'Gato ninja furtivo',
    getStyle: (c) => ({
      borderRadius: '5px',
      border: '1.5px solid rgba(80,80,100,0.5)',
      background: withFace('ninja_cat', `linear-gradient(180deg, ${darken(c, 25)} 0%, ${darken(c, 40)} 45%, ${darken(c, 50)} 100%)`),
      boxShadow: `inset 0 1px 3px rgba(255,255,255,0.1), inset 0 -2px 4px ${darken(c, 55)}, 0 0 6px rgba(0,0,0,0.4), 0 2px 5px rgba(0,0,0,0.5)`,
    }),
  },

  galaxy_cat: {
    label: 'Galaxy Cat',
    desc: 'Gato cósmico estelar',
    getStyle: (c) => ({
      borderRadius: '35%',
      border: '1.5px solid rgba(180,130,255,0.4)',
      background: withFace('galaxy_cat', `radial-gradient(circle at 40% 40%, ${lighten(c, 30)} 0%, ${c} 30%, ${darken(c, 25)} 60%, rgba(20,0,40,0.8) 100%)`),
      boxShadow: `inset 0 2px 5px rgba(180,130,255,0.25), inset 0 -2px 4px ${darken(c, 40)}, 0 0 12px rgba(150,100,255,0.2), 0 2px 6px rgba(0,0,0,0.5)`,
    }),
  },

  chef_cat: {
    label: 'Chef Cat',
    desc: 'Gato chef gourmet',
    getStyle: (c) => ({
      borderRadius: '30% 30% 25% 25%',
      border: '1.5px solid rgba(255,255,255,0.4)',
      background: withFace('chef_cat', `radial-gradient(circle at 45% 40%, ${lighten(c, 48)} 0%, ${lighten(c, 15)} 35%, ${c} 60%, ${darken(c, 18)} 100%)`),
      boxShadow: `inset 0 3px 5px ${lighten(c, 40)}, inset 0 -3px 5px ${darken(c, 25)}, 0 0 8px ${lighten(c, 20)}40, 0 2px 5px rgba(0,0,0,0.35)`,
    }),
  },

  // ── newskins: cat skins ──────────────────────────────────

  squished_cat: {
    label: 'Gatos Amassados',
    desc: 'Gatinhos espremidos no formato do bloco',
    getStyle: (c) => ({
      borderRadius: '8px',
      border: '1.5px solid rgba(255,255,255,.3)',
      background: withFace('squished_cat', `linear-gradient(180deg, ${lighten(c, 35)} 0%, ${c} 45%, ${darken(c, 20)} 100%)`),
      boxShadow: `inset 0 2px 4px ${lighten(c, 40)}, inset 0 -3px 4px ${darken(c, 30)}, 0 2px 4px rgba(0,0,0,.4)`,
    }),
  },

  box_cat: {
    label: 'Gatos na Caixa',
    desc: 'Gatinhos escondidos em caixas de papelão',
    getStyle: (c) => ({
      borderRadius: '4px',
      border: '2.5px solid rgba(166,138,97,.55)',
      background: withFace('box_cat', `linear-gradient(180deg, ${lighten(c, 30)} 0%, ${c} 50%, ${darken(c, 25)} 90%, rgba(194,163,122,.35) 100%)`),
      boxShadow: `inset 0 2px 3px ${lighten(c, 35)}, inset 0 -3px 3px ${darken(c, 35)}, 0 2px 4px rgba(0,0,0,.4)`,
    }),
  },

  cat_face: {
    label: 'Carinhas de Gato',
    desc: 'Rostos redondinhos de gato',
    getStyle: (c) => ({
      borderRadius: '50%',
      border: '1.5px solid rgba(255,255,255,.25)',
      background: withFace('cat_face', `radial-gradient(circle at 42% 38%, ${lighten(c, 45)} 0%, ${c} 50%, ${darken(c, 22)} 100%)`),
      boxShadow: `inset 0 3px 5px ${lighten(c, 40)}, inset 0 -3px 5px ${darken(c, 30)}, 0 0 8px ${c}50`,
    }),
  },

  yarn_ball: {
    label: 'Novelos de Lã',
    desc: 'Bolinhas de lã coloridas',
    getStyle: (c) => ({
      borderRadius: '50%',
      border: '1px solid rgba(0,0,0,.12)',
      background: withFace('yarn_ball', `radial-gradient(circle at 38% 35%, ${lighten(c, 40)} 0%, ${c} 45%, ${darken(c, 25)} 100%)`),
      boxShadow: `inset 0 3px 8px ${lighten(c, 45)}, inset 0 -3px 6px ${darken(c, 35)}, 0 3px 6px rgba(0,0,0,.45)`,
    }),
  },

  paw_print: {
    label: 'Patinhas',
    desc: 'Almofadinhas fofas de gato',
    getStyle: (c) => ({
      borderRadius: '14px',
      border: '1.5px solid rgba(255,255,255,.2)',
      background: withFace('paw_print', `radial-gradient(circle at 45% 40%, ${lighten(c, 35)} 0%, ${c} 50%, ${darken(c, 22)} 100%)`),
      boxShadow: `inset 0 2px 4px ${lighten(c, 40)}, inset 0 -3px 5px ${darken(c, 30)}, 0 2px 5px rgba(0,0,0,.4)`,
    }),
  },

  fish_block: {
    label: 'Peixinhos',
    desc: 'Peixes deliciosos para gatinhos',
    getStyle: (c) => ({
      borderRadius: '6px',
      border: '1.5px solid rgba(255,255,255,.3)',
      background: withFace('fish_block', `linear-gradient(135deg, ${lighten(c, 35)} 0%, ${c} 40%, ${darken(c, 25)} 100%)`),
      boxShadow: `inset 0 2px 4px ${lighten(c, 40)}, inset 0 -2px 3px ${darken(c, 30)}, 0 2px 5px rgba(0,0,0,.4)`,
    }),
  },

  milk_carton: {
    label: 'Caixa de Leite',
    desc: 'Caixinhas de leite fresco',
    getStyle: (c) => ({
      borderRadius: '3px',
      border: '1.5px solid rgba(200,210,220,.45)',
      background: withFace('milk_carton', `linear-gradient(180deg, ${c} 0%, ${lighten(c, 55)} 20%, ${lighten(c, 60)} 80%, ${lighten(c, 40)} 100%)`),
      boxShadow: `inset 0 2px 3px rgba(255,255,255,.4), inset 0 -2px 3px rgba(0,0,0,.15), 0 2px 4px rgba(0,0,0,.3)`,
    }),
  },

  mouse_toy: {
    label: 'Ratinhos',
    desc: 'Ratinhos de brinquedo',
    getStyle: (c) => ({
      borderRadius: '50%',
      border: '1.5px solid rgba(255,255,255,.25)',
      background: withFace('mouse_toy', `radial-gradient(circle at 40% 40%, ${lighten(c, 40)} 0%, ${c} 50%, ${darken(c, 20)} 100%)`),
      boxShadow: `inset 0 2px 5px ${lighten(c, 40)}, inset 0 -2px 4px ${darken(c, 25)}, 0 2px 5px rgba(0,0,0,.4)`,
    }),
  },

  // ── newskins: dog skins ──────────────────────────────────

  dog_face: {
    label: 'Dog Face',
    desc: 'Cachorros felizes e babões',
    getStyle: (c) => ({
      borderRadius: '8px',
      border: '1.5px solid rgba(255,255,255,.3)',
      background: withFace('dog_face', `radial-gradient(ellipse at 40% 35%, ${lighten(c, 42)} 0%, ${c} 48%, ${darken(c, 25)} 100%)`),
      boxShadow: `inset 0 3px 5px ${lighten(c, 40)}, inset 0 -3px 5px ${darken(c, 32)}, 0 2px 5px rgba(0,0,0,.4)`,
    }),
  },

  pug_face: {
    label: 'Pugs',
    desc: 'Pugs enrugados e fofos',
    getStyle: (c) => ({
      borderRadius: '6px',
      border: '1.5px solid rgba(255,255,255,.3)',
      background: withFace('pug_face', `radial-gradient(circle at 45% 40%, ${lighten(c, 40)} 0%, ${c} 45%, ${darken(c, 22)} 100%)`),
      boxShadow: `inset 0 2px 4px ${lighten(c, 35)}, inset 0 -3px 4px ${darken(c, 28)}, 0 2px 5px rgba(0,0,0,.4)`,
    }),
  },

  bone_block: {
    label: 'Ossinhos',
    desc: 'Ossos para roer',
    getStyle: (c) => ({
      borderRadius: '8px',
      border: '1.5px solid rgba(255,255,255,.25)',
      background: withFace('bone_block', `radial-gradient(circle at 45% 40%, ${lighten(c, 38)} 0%, ${c} 48%, ${darken(c, 22)} 100%)`),
      boxShadow: `inset 0 2px 5px ${lighten(c, 45)}, inset 0 -2px 4px ${darken(c, 30)}, 0 3px 6px rgba(0,0,0,.45)`,
    }),
  },

  dog_house: {
    label: 'Casinhas',
    desc: 'Casinhas de cachorro com telhado',
    getStyle: (c) => ({
      borderRadius: '3px',
      border: '1.5px solid rgba(255,255,255,.2)',
      background: withFace('dog_house', `linear-gradient(180deg, ${lighten(c, 30)} 0%, ${c} 40%, ${darken(c, 20)} 100%)`),
      boxShadow: `inset 0 2px 3px ${lighten(c, 35)}, inset 0 -3px 4px ${darken(c, 30)}, 0 2px 5px rgba(0,0,0,.5)`,
    }),
  },
};

export const THEME_LABELS = {
  ...Object.fromEntries(Object.entries(THEME_STYLES).map(([k, v]) => [k, { label: v.label, desc: v.desc }])),
};

export const SHAPE_NAMES = {
  ...Object.fromEntries(Object.entries(THEME_STYLES).map(([k, v]) => [k, v.label])),
};

const _styleCache = new Map();

export function getThemedCellStyle(themeName, baseColor, pieceType) {
  const key = `${themeName}\0${baseColor}`;
  const cached = _styleCache.get(key);
  if (cached) return cached;
  const theme = THEME_STYLES[themeName];
  const style = theme ? theme.getStyle(baseColor) : THEME_STYLES.classic.getStyle(baseColor);
  _styleCache.set(key, style);
  return style;
}

export function getBlockShapeStyle(shapeName) {
  const theme = THEME_STYLES[shapeName];
  if (!theme) return { borderRadius: '2px' };
  return { borderRadius: theme.getStyle('#888888').borderRadius || '2px' };
}
