import React from 'react';

function ClassicIcon({ size = 64, className = '' }) {
  const id = 'classic';
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className}>
      <defs>
        <linearGradient id={`${id}g1`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00F0F0"/>
          <stop offset="100%" stopColor="#009999"/>
        </linearGradient>
        <linearGradient id={`${id}g2`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F0F000"/>
          <stop offset="100%" stopColor="#B0B000"/>
        </linearGradient>
        <linearGradient id={`${id}g3`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A000F0"/>
          <stop offset="100%" stopColor="#6800A0"/>
        </linearGradient>
        <linearGradient id={`${id}g4`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F00000"/>
          <stop offset="100%" stopColor="#A00000"/>
        </linearGradient>
        <filter id={`${id}sh`}><feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.3"/></filter>
      </defs>
      {}
      <g filter={`url(#${id}sh)`}>
        <rect x="4" y="48" width="14" height="12" rx="2" fill={`url(#${id}g1)`}/>
        <rect x="18" y="48" width="14" height="12" rx="2" fill={`url(#${id}g1)`}/>
        <rect x="32" y="48" width="14" height="12" rx="2" fill={`url(#${id}g1)`}/>
        <rect x="46" y="48" width="14" height="12" rx="2" fill={`url(#${id}g1)`}/>
        {}
        <rect x="5" y="49" width="12" height="3" rx="1" fill="white" opacity="0.3"/>
        <rect x="19" y="49" width="12" height="3" rx="1" fill="white" opacity="0.3"/>
        <rect x="33" y="49" width="12" height="3" rx="1" fill="white" opacity="0.3"/>
        <rect x="47" y="49" width="12" height="3" rx="1" fill="white" opacity="0.3"/>
      </g>
      {/* T-piece */}
      <g filter={`url(#${id}sh)`}>
        <rect x="4" y="34" width="14" height="12" rx="2" fill={`url(#${id}g3)`}/>
        <rect x="18" y="34" width="14" height="12" rx="2" fill={`url(#${id}g3)`}/>
        <rect x="32" y="34" width="14" height="12" rx="2" fill={`url(#${id}g3)`}/>
        <rect x="18" y="22" width="14" height="12" rx="2" fill={`url(#${id}g3)`}/>
        <rect x="5" y="35" width="12" height="3" rx="1" fill="white" opacity="0.25"/>
        <rect x="19" y="35" width="12" height="3" rx="1" fill="white" opacity="0.25"/>
        <rect x="33" y="35" width="12" height="3" rx="1" fill="white" opacity="0.25"/>
        <rect x="19" y="23" width="12" height="3" rx="1" fill="white" opacity="0.25"/>
      </g>
      {/* O-piece top right */}
      <g filter={`url(#${id}sh)`}>
        <rect x="36" y="4" width="12" height="12" rx="2" fill={`url(#${id}g2)`}/>
        <rect x="48" y="4" width="12" height="12" rx="2" fill={`url(#${id}g2)`}/>
        <rect x="36" y="16" width="12" height="12" rx="2" fill={`url(#${id}g2)`}/>
        <rect x="48" y="16" width="12" height="12" rx="2" fill={`url(#${id}g2)`}/>
        <rect x="37" y="5" width="10" height="3" rx="1" fill="white" opacity="0.3"/>
        <rect x="49" y="5" width="10" height="3" rx="1" fill="white" opacity="0.3"/>
      </g>
      {/* Z-piece top left */}
      <g filter={`url(#${id}sh)`}>
        <rect x="4" y="4" width="12" height="12" rx="2" fill={`url(#${id}g4)`}/>
        <rect x="16" y="4" width="12" height="12" rx="2" fill={`url(#${id}g4)`}/>
        <rect x="16" y="16" width="12" height="12" rx="2" fill={`url(#${id}g4)`}/>
        <rect x="28" y="16" width="12" height="12" rx="2" fill={`url(#${id}g4)`}/>
        <rect x="5" y="5" width="10" height="3" rx="1" fill="white" opacity="0.25"/>
        <rect x="17" y="5" width="10" height="3" rx="1" fill="white" opacity="0.25"/>
      </g>
      {/* grid lines on each block */}
      <rect x="4" y="4" width="56" height="56" rx="4" stroke="white" strokeWidth="0.5" fill="none" opacity="0.1"/>
    </svg>
  );
}

function CatIcon({ size = 64, className = '' }) {
  const id = 'cats';
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className}>
      <defs>
        <radialGradient id={`${id}fur`} cx="50%" cy="40%">
          <stop offset="0%" stopColor="#FFD49A"/>
          <stop offset="70%" stopColor="#F5A623"/>
          <stop offset="100%" stopColor="#D4881F"/>
        </radialGradient>
        <radialGradient id={`${id}inner`} cx="50%" cy="30%">
          <stop offset="0%" stopColor="#FFE0C0"/>
          <stop offset="100%" stopColor="#FFCFA0"/>
        </radialGradient>
        <radialGradient id={`${id}nose`} cx="40%" cy="30%">
          <stop offset="0%" stopColor="#FF9AAA"/>
          <stop offset="100%" stopColor="#E07080"/>
        </radialGradient>
        <filter id={`${id}sh`}><feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.25"/></filter>
      </defs>
      {}
      <path d="M10 26L6 4 22 18Z" fill={`url(#${id}fur)`} stroke="#D4881F" strokeWidth="1"/>
      <path d="M54 26L58 4 42 18Z" fill={`url(#${id}fur)`} stroke="#D4881F" strokeWidth="1"/>
      {}
      <path d="M13 22L10 9 20 18Z" fill="#FFB8C6" opacity="0.7"/>
      <path d="M51 22L54 9 44 18Z" fill="#FFB8C6" opacity="0.7"/>
      {}
      <ellipse cx="32" cy="36" rx="24" ry="22" fill={`url(#${id}fur)`} filter={`url(#${id}sh)`}/>
      {/* Light belly/face patch */}
      <ellipse cx="32" cy="40" rx="16" ry="14" fill={`url(#${id}inner)`} opacity="0.6"/>
      {}
      <ellipse cx="22" cy="32" rx="5" ry="5.5" fill="white"/>
      <ellipse cx="42" cy="32" rx="5" ry="5.5" fill="white"/>
      <ellipse cx="23" cy="32" rx="3" ry="4" fill="#3D2B1F"/>
      <ellipse cx="43" cy="32" rx="3" ry="4" fill="#3D2B1F"/>
      {}
      <ellipse cx="23" cy="32" rx="1.2" ry="3.5" fill="black"/>
      <ellipse cx="43" cy="32" rx="1.2" ry="3.5" fill="black"/>
      {}
      <circle cx="24.5" cy="30.5" r="1.3" fill="white"/>
      <circle cx="44.5" cy="30.5" r="1.3" fill="white"/>
      {}
      <ellipse cx="32" cy="40" rx="3" ry="2.2" fill={`url(#${id}nose)`}/>
      {/* Mouth */}
      <path d="M32 42.2v3" stroke="#C06070" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M29 44c1.5 1.8 4.5 1.8 6 0" stroke="#C06070" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      {}
      <line x1="4" y1="36" x2="18" y2="38" stroke="#D4881F" strokeWidth="0.8" opacity="0.7"/>
      <line x1="4" y1="40" x2="18" y2="40" stroke="#D4881F" strokeWidth="0.8" opacity="0.7"/>
      <line x1="4" y1="44" x2="18" y2="42" stroke="#D4881F" strokeWidth="0.8" opacity="0.7"/>
      <line x1="60" y1="36" x2="46" y2="38" stroke="#D4881F" strokeWidth="0.8" opacity="0.7"/>
      <line x1="60" y1="40" x2="46" y2="40" stroke="#D4881F" strokeWidth="0.8" opacity="0.7"/>
      <line x1="60" y1="44" x2="46" y2="42" stroke="#D4881F" strokeWidth="0.8" opacity="0.7"/>
      {}
      <ellipse cx="17" cy="40" rx="4" ry="2.5" fill="#FF9AAA" opacity="0.3"/>
      <ellipse cx="47" cy="40" rx="4" ry="2.5" fill="#FF9AAA" opacity="0.3"/>
    </svg>
  );
}

function DogIcon({ size = 64, className = '' }) {
  const id = 'dogs';
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className}>
      <defs>
        <radialGradient id={`${id}fur`} cx="50%" cy="40%">
          <stop offset="0%" stopColor="#D4A574"/>
          <stop offset="100%" stopColor="#8B5E3C"/>
        </radialGradient>
        <radialGradient id={`${id}snout`} cx="50%" cy="40%">
          <stop offset="0%" stopColor="#FFE8D0"/>
          <stop offset="100%" stopColor="#EECBA0"/>
        </radialGradient>
        <filter id={`${id}sh`}><feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.25"/></filter>
      </defs>
      {}
      <ellipse cx="10" cy="28" rx="9" ry="18" fill="#6B3A1F" transform="rotate(-15 10 28)"/>
      <ellipse cx="54" cy="28" rx="9" ry="18" fill="#6B3A1F" transform="rotate(15 54 28)"/>
      <ellipse cx="11" cy="28" rx="6" ry="14" fill="#A0704A" transform="rotate(-15 11 28)" opacity="0.5"/>
      <ellipse cx="53" cy="28" rx="6" ry="14" fill="#A0704A" transform="rotate(15 53 28)" opacity="0.5"/>
      {}
      <ellipse cx="32" cy="32" rx="22" ry="23" fill={`url(#${id}fur)`} filter={`url(#${id}sh)`}/>
      {/* Forehead patch */}
      <ellipse cx="32" cy="24" rx="8" ry="6" fill="#6B3A1F" opacity="0.4"/>
      {}
      <ellipse cx="32" cy="42" rx="12" ry="10" fill={`url(#${id}snout)`}/>
      {/* Eyes */}
      <circle cx="23" cy="30" r="5" fill="white"/>
      <circle cx="41" cy="30" r="5" fill="white"/>
      <circle cx="24" cy="30" r="3.2" fill="#3D2B1F"/>
      <circle cx="42" cy="30" r="3.2" fill="#3D2B1F"/>
      <circle cx="25" cy="29" r="1.2" fill="white"/>
      <circle cx="43" cy="29" r="1.2" fill="white"/>
      {}
      <path d="M18 24c2-2 5-3 8-2" stroke="#5C3310" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M46 24c-2-2-5-3-8-2" stroke="#5C3310" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {}
      <ellipse cx="32" cy="39" rx="4" ry="3" fill="#2D1B0E"/>
      <ellipse cx="31" cy="38" rx="1.5" ry="1" fill="#5A3A20" opacity="0.5"/>
      {}
      <path d="M32 42v4" stroke="#8B5E3C" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M28 45c2 2 6 2 8 0" stroke="#8B5E3C" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      {}
      <ellipse cx="32" cy="50" rx="4" ry="5" fill="#FF6B7A"/>
      <ellipse cx="32" cy="49" rx="3" ry="3.5" fill="#FF8A95" opacity="0.5"/>
      <line x1="32" y1="47" x2="32" y2="53" stroke="#E05060" strokeWidth="0.8"/>
      {}
      <ellipse cx="19" cy="39" rx="3" ry="2" fill="#FF9AAA" opacity="0.25"/>
      <ellipse cx="45" cy="39" rx="3" ry="2" fill="#FF9AAA" opacity="0.25"/>
    </svg>
  );
}

function PandaIcon({ size = 64, className = '' }) {
  const id = 'pandas';
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className}>
      <defs>
        <radialGradient id={`${id}face`} cx="50%" cy="40%">
          <stop offset="0%" stopColor="#FFFFFF"/>
          <stop offset="100%" stopColor="#E8E8E8"/>
        </radialGradient>
        <linearGradient id={`${id}bamboo`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7BC67E"/>
          <stop offset="50%" stopColor="#4CAF50"/>
          <stop offset="100%" stopColor="#388E3C"/>
        </linearGradient>
        <filter id={`${id}sh`}><feDropShadow dx="0" dy="2" stdDeviation="1.5" floodOpacity="0.2"/></filter>
      </defs>
      {}
      <rect x="52" y="0" width="5" height="64" rx="2.5" fill={`url(#${id}bamboo)`}/>
      <line x1="52" y1="15" x2="57" y2="15" stroke="#2E7D32" strokeWidth="1.5"/>
      <line x1="52" y1="35" x2="57" y2="35" stroke="#2E7D32" strokeWidth="1.5"/>
      <line x1="52" y1="55" x2="57" y2="55" stroke="#2E7D32" strokeWidth="1.5"/>
      {}
      <path d="M57 14c4-6 8-4 6 0s-6 2-6 0z" fill="#66BB6A"/>
      <path d="M57 34c3-5 7-3 5 1s-5 1-5-1z" fill="#66BB6A"/>
      {}
      <circle cx="12" cy="14" r="8" fill="#2D2D2D"/>
      <circle cx="44" cy="14" r="8" fill="#2D2D2D"/>
      <circle cx="12" cy="14" r="5" fill="#3D3D3D" opacity="0.4"/>
      <circle cx="44" cy="14" r="5" fill="#3D3D3D" opacity="0.4"/>
      {}
      <ellipse cx="28" cy="34" rx="23" ry="22" fill={`url(#${id}face)`} filter={`url(#${id}sh)`}/>
      {/* Eye patches */}
      <ellipse cx="18" cy="30" rx="8" ry="9" fill="#2D2D2D" transform="rotate(-10 18 30)"/>
      <ellipse cx="38" cy="30" rx="8" ry="9" fill="#2D2D2D" transform="rotate(10 38 30)"/>
      {}
      <ellipse cx="19" cy="30" rx="4" ry="4.5" fill="white"/>
      <ellipse cx="37" cy="30" rx="4" ry="4.5" fill="white"/>
      <circle cx="20" cy="30" r="2.5" fill="#1A1A1A"/>
      <circle cx="38" cy="30" r="2.5" fill="#1A1A1A"/>
      <circle cx="21" cy="29" r="1" fill="white"/>
      <circle cx="39" cy="29" r="1" fill="white"/>
      {}
      <ellipse cx="28" cy="38" rx="3.5" ry="2.5" fill="#2D2D2D"/>
      {}
      <path d="M28 40.5v2" stroke="#555" strokeWidth="1" strokeLinecap="round"/>
      <path d="M24 42c2 1.5 6 1.5 8 0" stroke="#555" strokeWidth="1" fill="none" strokeLinecap="round"/>
      {}
      <ellipse cx="13" cy="38" rx="4" ry="2.5" fill="#FFB3C1" opacity="0.35"/>
      <ellipse cx="43" cy="38" rx="4" ry="2.5" fill="#FFB3C1" opacity="0.35"/>
    </svg>
  );
}

function FoxIcon({ size = 64, className = '' }) {
  const id = 'foxes';
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className}>
      <defs>
        <radialGradient id={`${id}fur`} cx="50%" cy="45%">
          <stop offset="0%" stopColor="#FF8040"/>
          <stop offset="100%" stopColor="#D45500"/>
        </radialGradient>
        <radialGradient id={`${id}chest`} cx="50%" cy="30%">
          <stop offset="0%" stopColor="#FFFFFF"/>
          <stop offset="100%" stopColor="#FFE8D0"/>
        </radialGradient>
        <filter id={`${id}sh`}><feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.25"/></filter>
      </defs>
      {}
      <path d="M10 26L4 2 24 18Z" fill="#D45500"/>
      <path d="M54 26L60 2 40 18Z" fill="#D45500"/>
      <path d="M12 22L8 7 21 18Z" fill="#1A1A1A" opacity="0.7"/>
      <path d="M52 22L56 7 43 18Z" fill="#1A1A1A" opacity="0.7"/>
      {}
      <path d="M14 20L11 11 19 18Z" fill="#FF9060" opacity="0.4"/>
      <path d="M50 20L53 11 45 18Z" fill="#FF9060" opacity="0.4"/>
      {}
      <ellipse cx="32" cy="34" rx="24" ry="22" fill={`url(#${id}fur)`} filter={`url(#${id}sh)`}/>
      {/* White face/chest mark */}
      <path d="M32 22c-8 0-14 6-14 14 0 6 6 16 14 20 8-4 14-14 14-20 0-8-6-14-14-14z" fill={`url(#${id}chest)`} opacity="0.7"/>
      {}
      <ellipse cx="22" cy="32" rx="4.5" ry="5" fill="white"/>
      <ellipse cx="42" cy="32" rx="4.5" ry="5" fill="white"/>
      <ellipse cx="23" cy="32" rx="2.8" ry="3.5" fill="#4A2800"/>
      <ellipse cx="43" cy="32" rx="2.8" ry="3.5" fill="#4A2800"/>
      {}
      <ellipse cx="23" cy="32" rx="1" ry="3" fill="black"/>
      <ellipse cx="43" cy="32" rx="1" ry="3" fill="black"/>
      <circle cx="24" cy="30.5" r="1.2" fill="white"/>
      <circle cx="44" cy="30.5" r="1.2" fill="white"/>
      {}
      <ellipse cx="32" cy="40" rx="3" ry="2.2" fill="#1A1A1A"/>
      <ellipse cx="31.2" cy="39.3" rx="1" ry="0.6" fill="#444" opacity="0.5"/>
      {}
      <path d="M32 42.2v2.5" stroke="#AA4400" strokeWidth="1" strokeLinecap="round"/>
      <path d="M28.5 44c1.8 2 5.2 2 7 0" stroke="#AA4400" strokeWidth="1" fill="none" strokeLinecap="round"/>
      {}
      <line x1="2" y1="37" x2="17" y2="39" stroke="#CC5500" strokeWidth="0.7" opacity="0.5"/>
      <line x1="2" y1="42" x2="17" y2="41" stroke="#CC5500" strokeWidth="0.7" opacity="0.5"/>
      <line x1="62" y1="37" x2="47" y2="39" stroke="#CC5500" strokeWidth="0.7" opacity="0.5"/>
      <line x1="62" y1="42" x2="47" y2="41" stroke="#CC5500" strokeWidth="0.7" opacity="0.5"/>
      {}
      <ellipse cx="14" cy="40" rx="4" ry="3" fill="#FF9060" opacity="0.25"/>
      <ellipse cx="50" cy="40" rx="4" ry="3" fill="#FF9060" opacity="0.25"/>
    </svg>
  );
}

function RobotSkinIcon({ size = 64, className = '' }) {
  const id = 'robots';
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className}>
      <defs>
        <linearGradient id={`${id}body`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A0B4C8"/>
          <stop offset="100%" stopColor="#607080"/>
        </linearGradient>
        <linearGradient id={`${id}visor`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00E5FF"/>
          <stop offset="100%" stopColor="#0080FF"/>
        </linearGradient>
        <filter id={`${id}glow`}><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <filter id={`${id}sh`}><feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.3"/></filter>
      </defs>
      {}
      <line x1="32" y1="2" x2="32" y2="12" stroke="#888" strokeWidth="2.5"/>
      <circle cx="32" cy="3" r="3" fill="#FF4444" filter={`url(#${id}glow)`}/>
      <circle cx="32" cy="3" r="1.5" fill="#FF8888"/>
      {}
      <line x1="16" y1="16" x2="10" y2="8" stroke="#888" strokeWidth="1.5"/>
      <circle cx="10" cy="8" r="2" fill="#00E5FF" filter={`url(#${id}glow)`}/>
      <line x1="48" y1="16" x2="54" y2="8" stroke="#888" strokeWidth="1.5"/>
      <circle cx="54" cy="8" r="2" fill="#00E5FF" filter={`url(#${id}glow)`}/>
      {/* Head */}
      <rect x="8" y="12" width="48" height="36" rx="6" fill={`url(#${id}body)`} filter={`url(#${id}sh)`}/>
      {/* Head plate lines */}
      <rect x="10" y="14" width="44" height="32" rx="4" fill="none" stroke="#7A8A9A" strokeWidth="0.8"/>
      <line x1="12" y1="18" x2="52" y2="18" stroke="#7A8A9A" strokeWidth="0.5" opacity="0.5"/>
      {}
      <circle cx="14" cy="16" r="2" fill="#555" stroke="#444" strokeWidth="0.5"/>
      <circle cx="50" cy="16" r="2" fill="#555" stroke="#444" strokeWidth="0.5"/>
      <circle cx="14" cy="44" r="2" fill="#555" stroke="#444" strokeWidth="0.5"/>
      <circle cx="50" cy="44" r="2" fill="#555" stroke="#444" strokeWidth="0.5"/>
      <line x1="13" y1="15" x2="15" y2="17" stroke="#666" strokeWidth="0.8"/>
      <line x1="49" y1="15" x2="51" y2="17" stroke="#666" strokeWidth="0.8"/>
      {}
      <rect x="14" y="22" width="14" height="10" rx="3" fill={`url(#${id}visor)`} filter={`url(#${id}glow)`}/>
      <rect x="36" y="22" width="14" height="10" rx="3" fill={`url(#${id}visor)`} filter={`url(#${id}glow)`}/>
      {}
      <rect x="18" y="24" width="6" height="6" rx="2" fill="white" opacity="0.6"/>
      <rect x="40" y="24" width="6" height="6" rx="2" fill="white" opacity="0.6"/>
      <rect x="20" y="25" width="3" height="3" rx="1" fill="white" opacity="0.3"/>
      <rect x="42" y="25" width="3" height="3" rx="1" fill="white" opacity="0.3"/>
      {}
      <rect x="20" y="36" width="24" height="8" rx="2" fill="#4A5568"/>
      <line x1="24" y1="36" x2="24" y2="44" stroke="#5A6578" strokeWidth="1.5"/>
      <line x1="28" y1="36" x2="28" y2="44" stroke="#5A6578" strokeWidth="1.5"/>
      <line x1="32" y1="36" x2="32" y2="44" stroke="#5A6578" strokeWidth="1.5"/>
      <line x1="36" y1="36" x2="36" y2="44" stroke="#5A6578" strokeWidth="1.5"/>
      <line x1="40" y1="36" x2="40" y2="44" stroke="#5A6578" strokeWidth="1.5"/>
      {}
      <rect x="4" y="24" width="3" height="3" rx="1" fill="#00FF88" opacity="0.8" filter={`url(#${id}glow)`}/>
      <rect x="4" y="30" width="3" height="3" rx="1" fill="#FFD700" opacity="0.8"/>
      <rect x="57" y="24" width="3" height="3" rx="1" fill="#00FF88" opacity="0.8" filter={`url(#${id}glow)`}/>
      <rect x="57" y="30" width="3" height="3" rx="1" fill="#FFD700" opacity="0.8"/>
      {}
      <rect x="24" y="50" width="16" height="6" rx="2" fill="#708090"/>
      <rect x="20" y="56" width="24" height="6" rx="2" fill="#607080"/>
      {}
      <path d="M28 50v4h-4v4" stroke="#00E5FF" strokeWidth="0.5" fill="none" opacity="0.4"/>
      <path d="M36 50v4h4v4" stroke="#00E5FF" strokeWidth="0.5" fill="none" opacity="0.4"/>
    </svg>
  );
}

export const THEME_ICONS = {
  classic: ClassicIcon,
  cats: CatIcon,
  dogs: DogIcon,
  pandas: PandaIcon,
  foxes: FoxIcon,
  robots: RobotSkinIcon,
};

export function ThemePieceIcon({ themeId, size = 64, className = '' }) {
  const Icon = THEME_ICONS[themeId] || ClassicIcon;
  return <Icon size={size} className={className} />;
}
