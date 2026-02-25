import React from 'react';

// ============================================================================
// 🐱 CAT TETRIS - SKINS COMPONENTS
// ============================================================================
// Copie este código para um arquivo como `src/components/Skins.tsx` no seu repositório.
// Você pode usar esses componentes dentro do seu componente de renderização do Tetris.
// Exemplo de uso: <SquishedCat color="#00d8ff" />

// --- CAT SKINS ---

export const SquishedCat = ({ color }: { color: string }) => (
  <div className="relative w-full h-full rounded-lg" style={{ backgroundColor: color }}>
    <div className="absolute inset-0 border-2 border-white/30 rounded-lg"></div>
    <div className="absolute inset-0 border-b-4 border-black/20 rounded-lg"></div>
    <svg viewBox="0 0 24 24" className="absolute inset-0 w-full h-full">
      <path d="M2 2 L6 6 M22 2 L18 6" stroke="rgba(0,0,0,0.3)" strokeWidth="2" strokeLinecap="round" />
      <path d="M5 12 Q7 10 9 12 M15 12 Q17 10 19 12" stroke="#1a1a1a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M11 16 Q12 17 13 16" stroke="#1a1a1a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <circle cx="4" cy="20" r="2" fill="rgba(255,255,255,0.5)" />
      <circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.5)" />
    </svg>
  </div>
);

export const BoxCat = ({ color }: { color: string }) => (
  <div className="relative w-full h-full rounded-md shadow-sm overflow-hidden" style={{ backgroundColor: '#d2b48c' }}>
    <div className="absolute inset-0 border-4 border-[#a68a61] rounded-md opacity-80"></div>
    <div className="absolute inset-1 rounded-sm" style={{ backgroundColor: color }}>
      <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-sm">
        <path d="M4 6 L3 1 L9 5 M20 6 L21 1 L15 5" fill={color} stroke="rgba(0,0,0,0.2)" strokeWidth="1" strokeLinejoin="round" />
        <circle cx="7.5" cy="12" r="1.5" fill="#1a1a1a" />
        <circle cx="16.5" cy="12" r="1.5" fill="#1a1a1a" />
        <path d="M11 14 Q12 15 13 14" stroke="#1a1a1a" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        <path d="M2 11 L5 12 M1 14 L5 13.5 M22 11 L19 12 M23 14 L19 13.5" stroke="#1a1a1a" strokeWidth="0.75" fill="none" strokeLinecap="round" opacity="0.4" />
      </svg>
    </div>
    <div className="absolute bottom-0 left-0 right-0 h-2 bg-[#c2a37a] border-t border-[#a68a61]"></div>
  </div>
);

export const CatFace = ({ color }: { color: string }) => (
  <div className="relative w-full h-full rounded-full" style={{ backgroundColor: color }}>
    <div className="absolute inset-0 border-2 border-white/20 rounded-full"></div>
    <div className="absolute inset-0 border-b-4 border-black/20 rounded-full"></div>
    <svg viewBox="0 0 24 24" className="absolute inset-0 w-full h-full">
      <path d="M3 10 L2 2 L10 5 M21 10 L22 2 L14 5" fill={color} stroke="rgba(0,0,0,0.2)" strokeWidth="1" strokeLinejoin="round" />
      <circle cx="8" cy="13" r="2" fill="#1a1a1a" />
      <circle cx="16" cy="13" r="2" fill="#1a1a1a" />
      <path d="M11 16 Q12 17 13 16" stroke="#1a1a1a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  </div>
);

export const YarnBall = ({ color }: { color: string }) => (
  <div className="relative w-full h-full flex items-center justify-center p-0.5">
    <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-md">
      <circle cx="12" cy="12" r="11" fill={color} />
      <path d="M4 8 Q12 2 20 8 M2 14 Q12 20 22 14 M6 19 Q12 24 18 19 M8 4 Q12 9 16 4" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M10 2 Q12 7 14 2" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M12 23 Q14 25 18 22" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M6 6 Q12 2 18 6" stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  </div>
);

export const PawPrint = ({ color }: { color: string }) => (
  <div className="relative w-full h-full rounded-xl border-b-4 border-black/20" style={{ backgroundColor: color }}>
    <div className="absolute inset-0 border-2 border-white/20 rounded-xl"></div>
    <svg viewBox="0 0 24 24" className="w-full h-full p-1.5 opacity-80">
      <path d="M12 12 C8 12 6 15 6 17.5 C6 20 9 22 12 22 C15 22 18 20 18 17.5 C18 15 16 12 12 12 Z" fill="#fff" />
      <circle cx="7" cy="9" r="2.5" fill="#fff" />
      <circle cx="12" cy="6.5" r="2.5" fill="#fff" />
      <circle cx="17" cy="9" r="2.5" fill="#fff" />
    </svg>
  </div>
);

export const FishBlock = ({ color }: { color: string }) => (
  <div className="relative w-full h-full rounded-md" style={{ backgroundColor: color }}>
    <div className="absolute inset-0 border-2 border-white/30 rounded-md"></div>
    <svg viewBox="0 0 24 24" className="w-full h-full p-2 opacity-90">
      <path d="M18 12 L23 8 L23 16 Z" fill="#fff" />
      <ellipse cx="10" cy="12" rx="9" ry="5" fill="#fff" />
      <circle cx="5" cy="11" r="1" fill={color} />
    </svg>
  </div>
);

export const MilkCarton = ({ color }: { color: string }) => (
  <div className="relative w-full h-full rounded-sm bg-white border-2 border-slate-200 overflow-hidden">
    <div className="absolute top-0 left-0 right-0 h-3" style={{ backgroundColor: color }}></div>
    <svg viewBox="0 0 24 24" className="absolute inset-0 w-full h-full">
      <path d="M12 8 Q12 14 15 14 A3 3 0 0 1 9 14 Q12 14 12 8" fill={color} />
      <line x1="4" y1="20" x2="20" y2="20" stroke="rgba(0,0,0,0.1)" strokeWidth="2" />
    </svg>
  </div>
);

export const MouseToy = ({ color }: { color: string }) => (
  <div className="relative w-full h-full rounded-full" style={{ backgroundColor: color }}>
    <div className="absolute inset-0 border-2 border-white/30 rounded-full"></div>
    <svg viewBox="0 0 24 24" className="absolute inset-0 w-full h-full">
      <ellipse cx="10" cy="12" rx="6" ry="4" fill="rgba(0,0,0,0.2)" />
      <circle cx="6" cy="8" r="2" fill="rgba(0,0,0,0.3)" />
      <circle cx="10" cy="8" r="2" fill="rgba(0,0,0,0.3)" />
      <path d="M16 12 Q20 12 22 16" stroke="rgba(0,0,0,0.3)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <circle cx="6" cy="11" r="0.5" fill="#fff" />
    </svg>
  </div>
);

// --- DOG SKINS ---

export const DogFace = ({ color }: { color: string }) => (
  <div className="relative w-full h-full rounded-lg" style={{ backgroundColor: color }}>
    <div className="absolute inset-0 border-2 border-white/30 rounded-lg"></div>
    <div className="absolute inset-0 border-b-4 border-black/20 rounded-lg"></div>
    <svg viewBox="0 0 24 24" className="absolute inset-0 w-full h-full">
      <path d="M4 6 Q1 12 4 18 M20 6 Q23 12 20 18" fill="rgba(0,0,0,0.1)" stroke="rgba(0,0,0,0.2)" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="11" r="1.5" fill="#1a1a1a" />
      <circle cx="16" cy="11" r="1.5" fill="#1a1a1a" />
      <ellipse cx="12" cy="15" rx="3" ry="2" fill="#1a1a1a" />
      <path d="M11 17 Q12 21 13 17" fill="#ff6b6b" />
    </svg>
  </div>
);

export const PugFace = ({ color }: { color: string }) => (
  <div className="relative w-full h-full rounded-md" style={{ backgroundColor: color }}>
    <div className="absolute inset-0 border-2 border-white/30 rounded-md"></div>
    <svg viewBox="0 0 24 24" className="absolute inset-0 w-full h-full">
      <path d="M8 6 Q12 8 16 6 M6 9 Q12 11 18 9" stroke="rgba(0,0,0,0.15)" strokeWidth="1" fill="none" />
      <ellipse cx="12" cy="15" rx="6" ry="5" fill="#1a1a1a" />
      <circle cx="8" cy="13" r="1.5" fill="#1a1a1a" />
      <circle cx="16" cy="13" r="1.5" fill="#1a1a1a" />
      <ellipse cx="12" cy="14" rx="1.5" ry="1" fill="#000" />
      <path d="M11 18 Q12 21 13 18" fill="#ff6b6b" />
    </svg>
  </div>
);

export const BoneBlock = ({ color }: { color: string }) => (
  <div className="relative w-full h-full flex items-center justify-center p-1">
    <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-md">
      <path d="M6 8 A3 3 0 0 0 6 16 L18 16 A3 3 0 0 0 18 8 Z" fill={color} />
      <circle cx="5" cy="8" r="3" fill={color} />
      <circle cx="5" cy="16" r="3" fill={color} />
      <circle cx="19" cy="8" r="3" fill={color} />
      <circle cx="19" cy="16" r="3" fill={color} />
      <path d="M6 8 A3 3 0 0 0 6 16 L18 16 A3 3 0 0 0 18 8 Z" stroke="rgba(0,0,0,0.2)" strokeWidth="1" fill="none" />
      <path d="M8 10 L16 10" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  </div>
);

export const DogHouse = ({ color }: { color: string }) => (
  <div className="relative w-full h-full rounded-sm" style={{ backgroundColor: color }}>
    <div className="absolute inset-0 border-2 border-white/20"></div>
    <div className="absolute inset-0 border-b-4 border-black/20"></div>
    <svg viewBox="0 0 24 24" className="absolute inset-0 w-full h-full">
      <path d="M2 10 L12 2 L22 10" fill="#c2410c" stroke="#9a3412" strokeWidth="2" strokeLinejoin="round" />
      <path d="M8 22 L8 14 A4 4 0 0 1 16 14 L16 22" fill="#1a1a1a" />
      <path d="M4 14 L6 14 M18 14 L20 14 M4 18 L6 18 M18 18 L20 18" stroke="rgba(0,0,0,0.2)" strokeWidth="1" strokeLinecap="round" />
    </svg>
  </div>
);
