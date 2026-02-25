import React, { useState } from 'react';
import { Cat, CircleDashed, PawPrint as PawIcon, Fish, Box, Dog, Bone, Tent, Sparkles, Milk, Mouse, Footprints } from 'lucide-react';

// --- CAT SKINS ---

const BoxCat = ({ color }: { color: string }) => (
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

const YarnBall = ({ color }: { color: string }) => (
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

const PawPrint = ({ color }: { color: string }) => (
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

const SquishedCat = ({ color }: { color: string }) => (
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

const FishBlock = ({ color }: { color: string }) => (
  <div className="relative w-full h-full rounded-md" style={{ backgroundColor: color }}>
    <div className="absolute inset-0 border-2 border-white/30 rounded-md"></div>
    <svg viewBox="0 0 24 24" className="w-full h-full p-2 opacity-90">
      <path d="M18 12 L23 8 L23 16 Z" fill="#fff" />
      <ellipse cx="10" cy="12" rx="9" ry="5" fill="#fff" />
      <circle cx="5" cy="11" r="1" fill={color} />
    </svg>
  </div>
);

const CatFace = ({ color }: { color: string }) => (
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

const MilkCarton = ({ color }: { color: string }) => (
  <div className="relative w-full h-full rounded-sm bg-white border-2 border-slate-200 overflow-hidden">
    <div className="absolute top-0 left-0 right-0 h-3" style={{ backgroundColor: color }}></div>
    <svg viewBox="0 0 24 24" className="absolute inset-0 w-full h-full">
      {/* Milk drop */}
      <path d="M12 8 Q12 14 15 14 A3 3 0 0 1 9 14 Q12 14 12 8" fill={color} />
      {/* Lines */}
      <line x1="4" y1="20" x2="20" y2="20" stroke="rgba(0,0,0,0.1)" strokeWidth="2" />
    </svg>
  </div>
);

const MouseToy = ({ color }: { color: string }) => (
  <div className="relative w-full h-full rounded-full" style={{ backgroundColor: color }}>
    <div className="absolute inset-0 border-2 border-white/30 rounded-full"></div>
    <svg viewBox="0 0 24 24" className="absolute inset-0 w-full h-full">
      {/* Mouse body */}
      <ellipse cx="10" cy="12" rx="6" ry="4" fill="rgba(0,0,0,0.2)" />
      {/* Ears */}
      <circle cx="6" cy="8" r="2" fill="rgba(0,0,0,0.3)" />
      <circle cx="10" cy="8" r="2" fill="rgba(0,0,0,0.3)" />
      {/* Tail */}
      <path d="M16 12 Q20 12 22 16" stroke="rgba(0,0,0,0.3)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Eye */}
      <circle cx="6" cy="11" r="0.5" fill="#fff" />
    </svg>
  </div>
);

// --- DOG SKINS ---

const DogFace = ({ color }: { color: string }) => (
  <div className="relative w-full h-full rounded-lg" style={{ backgroundColor: color }}>
    <div className="absolute inset-0 border-2 border-white/30 rounded-lg"></div>
    <div className="absolute inset-0 border-b-4 border-black/20 rounded-lg"></div>
    <svg viewBox="0 0 24 24" className="absolute inset-0 w-full h-full">
      {/* Floppy Ears */}
      <path d="M4 6 Q1 12 4 18 M20 6 Q23 12 20 18" fill="rgba(0,0,0,0.1)" stroke="rgba(0,0,0,0.2)" strokeWidth="1.5" strokeLinecap="round" />
      {/* Eyes */}
      <circle cx="8" cy="11" r="1.5" fill="#1a1a1a" />
      <circle cx="16" cy="11" r="1.5" fill="#1a1a1a" />
      {/* Big Nose */}
      <ellipse cx="12" cy="15" rx="3" ry="2" fill="#1a1a1a" />
      {/* Tongue */}
      <path d="M11 17 Q12 21 13 17" fill="#ff6b6b" />
    </svg>
  </div>
);

const BoneBlock = ({ color }: { color: string }) => (
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

const DogHouse = ({ color }: { color: string }) => (
  <div className="relative w-full h-full rounded-sm" style={{ backgroundColor: color }}>
    <div className="absolute inset-0 border-2 border-white/20"></div>
    <div className="absolute inset-0 border-b-4 border-black/20"></div>
    <svg viewBox="0 0 24 24" className="absolute inset-0 w-full h-full">
      {/* Roof */}
      <path d="M2 10 L12 2 L22 10" fill="#c2410c" stroke="#9a3412" strokeWidth="2" strokeLinejoin="round" />
      {/* Door */}
      <path d="M8 22 L8 14 A4 4 0 0 1 16 14 L16 22" fill="#1a1a1a" />
      {/* Wood lines */}
      <path d="M4 14 L6 14 M18 14 L20 14 M4 18 L6 18 M18 18 L20 18" stroke="rgba(0,0,0,0.2)" strokeWidth="1" strokeLinecap="round" />
    </svg>
  </div>
);

const HotDog = ({ color }: { color: string }) => (
  <div className="relative w-full h-full rounded-full border-2 border-amber-800/30" style={{ backgroundColor: '#d97706' }}>
    <div className="absolute inset-0 border-t-4 border-white/20 rounded-full"></div>
    <svg viewBox="0 0 24 24" className="absolute inset-0 w-full h-full">
      {/* Sausage */}
      <rect x="4" y="8" width="16" height="8" rx="4" fill="#991b1b" />
      {/* Mustard/Ketchup based on piece color */}
      <path d="M6 12 Q9 8 12 12 T18 12" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  </div>
);

const PugFace = ({ color }: { color: string }) => (
  <div className="relative w-full h-full rounded-md" style={{ backgroundColor: color }}>
    <div className="absolute inset-0 border-2 border-white/30 rounded-md"></div>
    <svg viewBox="0 0 24 24" className="absolute inset-0 w-full h-full">
      {/* Wrinkles */}
      <path d="M8 6 Q12 8 16 6 M6 9 Q12 11 18 9" stroke="rgba(0,0,0,0.15)" strokeWidth="1" fill="none" />
      {/* Dark mask */}
      <ellipse cx="12" cy="15" rx="6" ry="5" fill="#1a1a1a" />
      {/* Eyes */}
      <circle cx="8" cy="13" r="1.5" fill="#1a1a1a" />
      <circle cx="16" cy="13" r="1.5" fill="#1a1a1a" />
      {/* Nose */}
      <ellipse cx="12" cy="14" rx="1.5" ry="1" fill="#000" />
      {/* Tongue */}
      <path d="M11 18 Q12 21 13 18" fill="#ff6b6b" />
    </svg>
  </div>
);

const FireHydrant = ({ color }: { color: string }) => (
  <div className="relative w-full h-full rounded-md" style={{ backgroundColor: '#ef4444' }}>
    <div className="absolute inset-0 border-2 border-white/20 rounded-md"></div>
    <svg viewBox="0 0 24 24" className="absolute inset-0 w-full h-full">
      {/* Base */}
      <rect x="6" y="18" width="12" height="4" fill="#b91c1c" />
      {/* Body */}
      <rect x="8" y="8" width="8" height="10" fill="#dc2626" />
      {/* Top */}
      <path d="M8 8 Q12 2 16 8 Z" fill="#b91c1c" />
      {/* Side caps */}
      <rect x="5" y="12" width="3" height="4" rx="1" fill="#b91c1c" />
      <rect x="16" y="12" width="3" height="4" rx="1" fill="#b91c1c" />
      {/* Color indicator */}
      <circle cx="12" cy="14" r="2" fill={color} />
    </svg>
  </div>
);

const SKINS = {
  // Cats
  squished: { type: 'cat', name: 'Gatos Amassados', icon: Cat, component: SquishedCat, desc: 'Gatinhos espremidos no formato do bloco.' },
  boxcat: { type: 'cat', name: 'Gatos na Caixa', icon: Box, component: BoxCat, desc: 'Gatinhos escondidos em caixas de papelão.' },
  catface: { type: 'cat', name: 'Carinhas', icon: Cat, component: CatFace, desc: 'Rostos redondinhos de gato.' },
  yarn: { type: 'cat', name: 'Novelos de Lã', icon: CircleDashed, component: YarnBall, desc: 'Bolinhas de lã coloridas.' },
  paw: { type: 'cat', name: 'Patinhas', icon: PawIcon, component: PawPrint, desc: 'Almofadinhas fofas de gato.' },
  fish: { type: 'cat', name: 'Petiscos', icon: Fish, component: FishBlock, desc: 'Peixinhos deliciosos.' },
  milk: { type: 'cat', name: 'Caixa de Leite', icon: Milk, component: MilkCarton, desc: 'Caixinhas de leite fresco.' },
  mouse: { type: 'cat', name: 'Ratinhos', icon: Mouse, component: MouseToy, desc: 'Ratinhos de brinquedo.' },
  
  // Dogs
  dogface: { type: 'dog', name: 'Cachorrinhos', icon: Dog, component: DogFace, desc: 'Cachorros felizes e babões.' },
  pug: { type: 'dog', name: 'Pugs', icon: Dog, component: PugFace, desc: 'Pugs enrugados e fofos.' },
  bone: { type: 'dog', name: 'Ossinhos', icon: Bone, component: BoneBlock, desc: 'Ossos para roer.' },
  doghouse: { type: 'dog', name: 'Casinhas', icon: Tent, component: DogHouse, desc: 'Casinhas de cachorro com telhado.' },
};

const TETROMINOES = {
  I: { shape: [[1, 1, 1, 1]], color: '#00d8ff' }, // Cyan
  J: { shape: [[1, 0, 0], [1, 1, 1]], color: '#0058ff' }, // Blue
  L: { shape: [[0, 0, 1], [1, 1, 1]], color: '#ff7f00' }, // Orange
  O: { shape: [[1, 1], [1, 1]], color: '#ffbf00' }, // Yellow
  S: { shape: [[0, 1, 1], [1, 1, 0]], color: '#00ff00' }, // Green
  T: { shape: [[0, 1, 0], [1, 1, 1]], color: '#b200ff' }, // Purple
  Z: { shape: [[1, 1, 0], [0, 1, 1]], color: '#ff0000' }, // Red
};

export default function App() {
  const [activeSkin, setActiveSkin] = useState<keyof typeof SKINS>('squished');
  const [filter, setFilter] = useState<'all' | 'cat' | 'dog'>('all');

  const filteredSkins = Object.entries(SKINS).filter(([_, skin]) => filter === 'all' || skin.type === filter);

  return (
    <div className="min-h-screen bg-[#1a1a2e] text-slate-200 font-sans p-4 md:p-8 selection:bg-orange-500/30">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <header className="text-center space-y-4 mt-8">
          <div className="inline-flex items-center justify-center p-3 bg-orange-500/10 rounded-full mb-4 gap-4">
            <Cat className="w-10 h-10 text-orange-400" />
            <span className="text-2xl font-bold text-slate-600">vs</span>
            <Dog className="w-10 h-10 text-blue-400" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white">
            Cat <span className="text-slate-500">&</span> Dog <span className="text-orange-400">Tetris Skins</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Ideias visuais para os blocos do seu repositório <strong>shigake/cat-tetris</strong>. 
            Selecione uma skin abaixo para visualizar.
          </p>
        </header>

        {/* Filters */}
        <div className="flex justify-center gap-4">
          <button 
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-full font-bold transition-colors ${filter === 'all' ? 'bg-slate-700 text-white' : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'}`}
          >
            Todos
          </button>
          <button 
            onClick={() => setFilter('cat')}
            className={`px-6 py-2 rounded-full font-bold flex items-center gap-2 transition-colors ${filter === 'cat' ? 'bg-orange-500 text-white' : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'}`}
          >
            <Cat className="w-4 h-4" /> Gatos
          </button>
          <button 
            onClick={() => setFilter('dog')}
            className={`px-6 py-2 rounded-full font-bold flex items-center gap-2 transition-colors ${filter === 'dog' ? 'bg-blue-500 text-white' : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'}`}
          >
            <Dog className="w-4 h-4" /> Cachorros
          </button>
        </div>

        {/* Skin Selector */}
        <div className="flex flex-wrap justify-center gap-4">
          {filteredSkins.map(([key, skin]) => {
            const Icon = skin.icon;
            const isActive = activeSkin === key;
            const isDog = skin.type === 'dog';
            
            const activeColor = isDog ? 'bg-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.3)] border-blue-400' : 'bg-orange-500 shadow-[0_0_30px_rgba(249,115,22,0.3)] border-orange-400';
            
            return (
              <button
                key={key}
                onClick={() => setActiveSkin(key as keyof typeof SKINS)}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl font-semibold transition-all duration-300 w-36 ${
                  isActive 
                    ? `${activeColor} text-white scale-110 border-2` 
                    : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border-2 border-transparent hover:scale-105'
                }`}
              >
                <Icon className={`w-8 h-8 ${isActive ? 'animate-bounce' : ''}`} />
                <span className="text-sm text-center leading-tight">{skin.name}</span>
              </button>
            );
          })}
        </div>

        {/* Active Skin Description */}
        <div className="text-center animate-fade-in">
          <p className={`font-medium text-lg inline-block px-6 py-2 rounded-full border ${
            SKINS[activeSkin].type === 'dog' 
              ? 'text-blue-300 bg-blue-500/10 border-blue-500/20' 
              : 'text-orange-300 bg-orange-500/10 border-orange-500/20'
          }`}>
            {SKINS[activeSkin].desc}
          </p>
        </div>

        {/* Tetromino Grid */}
        <div className="bg-slate-900/50 rounded-[2.5rem] p-8 md:p-16 border border-slate-800 shadow-2xl backdrop-blur-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-12 gap-y-16 place-items-center">
            {Object.entries(TETROMINOES).map(([name, tetro]) => (
              <div key={name} className="flex flex-col items-center gap-8 group">
                {/* Block Display */}
                <div 
                  className="grid gap-1 p-4 rounded-2xl bg-slate-800/30 border border-slate-700/50 transition-transform duration-500 group-hover:scale-110 group-hover:bg-slate-800/80" 
                  style={{ 
                    gridTemplateColumns: `repeat(${tetro.shape[0].length}, 3rem)`,
                    gridTemplateRows: `repeat(${tetro.shape.length}, 3rem)`
                  }}
                >
                  {tetro.shape.map((row, y) => 
                    row.map((cell, x) => (
                      <div key={`${x}-${y}`} className="w-12 h-12">
                        {cell === 1 && (
                          <div className="w-full h-full transition-transform hover:scale-110 cursor-pointer drop-shadow-lg">
                            {React.createElement(SKINS[activeSkin].component, { color: tetro.color })}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
                {/* Label */}
                <div className={`font-black text-2xl tracking-widest transition-colors ${
                  SKINS[activeSkin].type === 'dog' ? 'text-slate-500 group-hover:text-blue-400' : 'text-slate-500 group-hover:text-orange-400'
                }`}>
                  {name}-PIECE
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Extra Ideas Section */}
        <div className={`rounded-[2rem] p-8 md:p-12 border shadow-lg relative overflow-hidden transition-colors duration-500 ${
          SKINS[activeSkin].type === 'dog' 
            ? 'bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20' 
            : 'bg-gradient-to-br from-orange-500/10 to-purple-500/10 border-orange-500/20'
        }`}>
          <div className="absolute top-0 right-0 p-8 opacity-10">
            {SKINS[activeSkin].type === 'dog' ? <Dog className="w-64 h-64" /> : <Cat className="w-64 h-64" />}
          </div>
          
          <div className="relative z-10">
            <h3 className="text-3xl font-black text-white mb-8 flex items-center gap-3">
              <span className={`${SKINS[activeSkin].type === 'dog' ? 'bg-blue-500' : 'bg-orange-500'} text-white p-2 rounded-xl transition-colors`}>
                {SKINS[activeSkin].type === 'dog' ? <Dog className="w-8 h-8" /> : <Cat className="w-8 h-8" />}
              </span>
              Ideias Avançadas para o seu Repositório
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className={`bg-slate-900/60 p-6 rounded-2xl border border-slate-700/50 transition-colors ${SKINS[activeSkin].type === 'dog' ? 'hover:border-blue-500/50' : 'hover:border-orange-500/50'}`}>
                <h4 className={`text-xl font-bold mb-3 ${SKINS[activeSkin].type === 'dog' ? 'text-blue-400' : 'text-orange-400'}`}>
                  {SKINS[activeSkin].type === 'dog' ? 'Cachorros Longos (Salsichas)' : 'Gatos Contorcionistas'}
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  {SKINS[activeSkin].type === 'dog' 
                    ? 'Em vez de blocos repetidos, desenhe um único cachorro salsicha (Dachshund) que se contorce no formato da peça. O "I" é um salsicha esticado!' 
                    : 'Em vez de blocos repetidos, desenhe um único gato longo que se contorce no formato da peça. O "I" é um gato espreguiçando!'}
                </p>
              </div>

              <div className={`bg-slate-900/60 p-6 rounded-2xl border border-slate-700/50 transition-colors ${SKINS[activeSkin].type === 'dog' ? 'hover:border-blue-500/50' : 'hover:border-orange-500/50'}`}>
                <h4 className={`text-xl font-bold mb-3 ${SKINS[activeSkin].type === 'dog' ? 'text-blue-400' : 'text-orange-400'}`}>
                  {SKINS[activeSkin].type === 'dog' ? 'Cachorros Cavando (Física)' : 'Gatos Pendurados (Física)'}
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  {SKINS[activeSkin].type === 'dog' 
                    ? 'Quando a peça cai rápido (Hard Drop), os cachorrinhos podem fazer uma animação de cavar o chão ou soltar um latido com o impacto.' 
                    : 'Como você mencionou gatos pendurados, você pode adicionar uma física sutil. Quando a peça cai rápido (Hard Drop), os gatinhos podem balançar com o impacto.'}
                </p>
              </div>

              <div className={`bg-slate-900/60 p-6 rounded-2xl border border-slate-700/50 transition-colors ${SKINS[activeSkin].type === 'dog' ? 'hover:border-blue-500/50' : 'hover:border-orange-500/50'}`}>
                <h4 className={`text-xl font-bold mb-3 ${SKINS[activeSkin].type === 'dog' ? 'text-blue-400' : 'text-orange-400'}`}>Estados de "Clear" (Linha Completa)</h4>
                <p className="text-slate-300 leading-relaxed">
                  {SKINS[activeSkin].type === 'dog' 
                    ? 'Quando uma linha é eliminada, os blocos podem virar cachorrinhos correndo atrás de uma bola para fora da tela, com um som de "Au Au!".' 
                    : 'Quando uma linha é eliminada, os blocos podem virar gatinhos assustados que pulam para fora da tela, acompanhados de um som de "Miau!".'}
                </p>
              </div>

              <div className={`bg-slate-900/60 p-6 rounded-2xl border border-slate-700/50 transition-colors ${SKINS[activeSkin].type === 'dog' ? 'hover:border-blue-500/50' : 'hover:border-orange-500/50'}`}>
                <h4 className={`text-xl font-bold mb-3 ${SKINS[activeSkin].type === 'dog' ? 'text-blue-400' : 'text-orange-400'}`}>Ghost Piece (Sombra)</h4>
                <p className="text-slate-300 leading-relaxed">
                  A peça fantasma (onde o bloco vai cair) pode ser apenas o contorno de um {SKINS[activeSkin].type === 'dog' ? 'cachorrinho' : 'gatinho'}, ou patinhas translúcidas marcando o chão.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
