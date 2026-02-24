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
};

const IMG_THEME_LABELS = {
  cat_ear_orb: { label: 'Cat Ear Orb', desc: 'Bolinhas com orelhas de gato' },
  cathead_block: { label: 'Cat Head Block', desc: 'Silhueta de cabeça de gato' },
  neko_badge: { label: 'Neko Badge', desc: 'Badges premium com emblema neko' },
};

export const THEME_LABELS = {
  ...Object.fromEntries(Object.entries(THEME_STYLES).map(([k, v]) => [k, { label: v.label, desc: v.desc }])),
  ...IMG_THEME_LABELS,
};

export const SHAPE_NAMES = {
  ...Object.fromEntries(Object.entries(THEME_STYLES).map(([k, v]) => [k, v.label])),
  ...Object.fromEntries(Object.entries(IMG_THEME_LABELS).map(([k, v]) => [k, v.label])),
};

const _styleCache = new Map();

// Image-based theme helper: maps theme folder + pieceType → CSS background-image
const IMG_THEMES = {
  cat_ear_orb: 'themes/cat_ear_orb/32px',
  cathead_block: 'themes/cathead_block/32px',
  neko_badge: 'themes/neko_badge/32px',
};

function imgThemeStyle(folder, pieceType) {
  const base = typeof import.meta !== 'undefined' ? import.meta.env.BASE_URL : '/cat-tetris/';
  const file = pieceType || 'T'; // fallback to T if no piece type
  return {
    borderRadius: '2px',
    border: 'none',
    background: `url("${base}${folder}/${file}.png") center/cover no-repeat`,
    boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
    imageRendering: 'pixelated',
  };
}

export function getThemedCellStyle(themeName, baseColor, pieceType) {
  // Image-based themes — use tile images per piece type
  if (IMG_THEMES[themeName]) {
    const key = `${themeName}\0${pieceType || 'T'}`;
    const cached = _styleCache.get(key);
    if (cached) return cached;
    const style = imgThemeStyle(IMG_THEMES[themeName], pieceType);
    _styleCache.set(key, style);
    return style;
  }
  // CSS-based themes — existing logic
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
