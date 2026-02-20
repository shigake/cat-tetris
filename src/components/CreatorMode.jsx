import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PIECES } from '../utils/PieceGenerator';
import { GameService } from '../core/services/GameService';
import { PieceFactory, MovementStrategyFactory } from '../patterns/Factory';
import { ScoringService } from '../core/services/ScoringService';
import { Piece } from '../core/entities/Piece';
import TetrisBoard from './TetrisBoard';
import NextPieces from './NextPieces';
import HeldPiece from './HeldPiece';
import Scoreboard from './Scoreboard';

const BOARD_W = 10;
const BOARD_H = 20;
const PIECE_TYPES = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

const PIECE_COLORS = {
  I: '#00f5ff', O: '#ffff00', T: '#a000f0', S: '#00f000',
  Z: '#f00000', J: '#0000f0', L: '#ff7f00', G: '#888888'
};

const TEMPLATES = [
  {
    id: 'ts-single',
    name: 'T-Spin Single',
    emoji: '🎯',
    desc: 'O T-Spin mais simples — limpa 1 linha',
    board: mkRows(19, ['GG...GGGGG']),
    queue: ['T'],
    steps: [
      { key: '←', text: 'Mova 1x para a esquerda' },
      { key: 'Espaço', text: 'Hard Drop — o T encaixa no buraco' },
      { key: '🌀', text: 'T-Spin Single! Limpa 1 linha' },
    ],
  },
  {
    id: 'tsd-right',
    name: 'T-Spin Double (Direita)',
    emoji: '🌀',
    desc: 'O clássico TSD — limpa 2 linhas',
    board: mkRows(18, ['GGG...GGGG', 'GGGG.GGGGG']),
    queue: ['T'],
    steps: [
      { key: '↑', text: 'Gire 1x (90° horário)' },
      { key: '↑', text: 'Gire de novo (agora está de cabeça pra baixo)' },
      { key: 'Espaço', text: 'Hard Drop — T cai direto na cavidade' },
      { key: '🌀', text: 'T-Spin Double! Limpa 2 linhas' },
    ],
  },
  {
    id: 'tsd-left',
    name: 'T-Spin Double (Esquerda)',
    emoji: '🌀',
    desc: 'TSD espelhado — limpa 2 linhas',
    board: mkRows(18, ['GGGG...GGG', 'GGGGG.GGGG']),
    queue: ['T'],
    steps: [
      { key: '↑', text: 'Gire 1x (90° horário)' },
      { key: '↑', text: 'Gire de novo (cabeça pra baixo)' },
      { key: '→ →', text: 'Mova 2x para a direita' },
      { key: 'Espaço', text: 'Hard Drop — T cai na cavidade' },
      { key: '🌀', text: 'T-Spin Double! Limpa 2 linhas' },
    ],
  },
  {
    id: 'tst',
    name: 'T-Spin Triple',
    emoji: '🔥',
    desc: 'O mais poderoso — limpa 3 linhas!',
    board: mkRows(17, ['GGGG.GGGGG', 'GGGG..GGGG', 'GGGG.GGGGG']),
    queue: ['T'],
    steps: [
      { key: '↑', text: 'Gire 1x (T fica na vertical, ponta pra direita)' },
      { key: 'Espaço', text: 'Hard Drop — T desce direto no encaixe' },
      { key: '🔥', text: 'T-Spin Triple! Limpa 3 linhas de uma vez!' },
    ],
  },
  {
    id: 'tsd-chain',
    name: 'TSD em Cadeia',
    emoji: '🔁',
    desc: 'Dois T-Spin Doubles seguidos — Back-to-Back!',
    board: mkRows(14, [
      'GGG...GGGG', 'GGGG.GGGGG',
      '..........','..........',
      'GGGG...GGG', 'GGGGG.GGGG',
    ]),
    queue: ['T', 'T'],
    steps: [
      { key: '↑ ↑', text: '1º T: Gire 2x (cabeça pra baixo)' },
      { key: 'Espaço', text: 'Hard Drop → T-Spin Double!' },
      { key: '↑ ↑', text: '2º T: Gire 2x (cabeça pra baixo)' },
      { key: '→ →', text: 'Mova 2x para a direita' },
      { key: 'Espaço', text: 'Hard Drop → T-Spin Double em cadeia! Back-to-Back!' },
    ],
  },
];

function mkRows(startRow, patterns) {
  const rows = [];
  for (let y = 0; y < BOARD_H; y++) {
    if (y >= startRow && y < startRow + patterns.length) {
      rows.push(patterns[y - startRow]);
    } else {
      rows.push('..........');
    }
  }
  return rows;
}

function parseBoard(rows) {
  return rows.map(row =>
    Array.from(row).map(ch =>
      ch === '.' || ch === ' ' ? null : { type: 'G', color: PIECE_COLORS[ch] || '#888', emoji: '⬜' }
    )
  );
}

function emptyBoard() {
  return Array(BOARD_H).fill(null).map(() => Array(BOARD_W).fill(null));
}

function cloneBoard(b) {
  return b.map(r => r.map(c => c ? { ...c } : null));
}

function makeGameService(boardData, queue) {
  const gs = new GameService(new PieceFactory(), new MovementStrategyFactory(), null, new ScoringService());
  gs.initializeGame();
  gs.isPlaying = true;

  for (let y = 0; y < BOARD_H; y++)
    for (let x = 0; x < BOARD_W; x++)
      if (boardData[y][x]) gs.board.setCell(x, y, boardData[y][x]);

  if (queue.length > 0) {
    const makeP = (type) => {
      const cfg = PIECES[type];
      const pos = type === 'I' ? { x: 3, y: -2 } : { x: 3, y: 0 };
      return new Piece(type, cfg.shape, cfg.color, cfg.emoji, pos, false, 0);
    };
    gs.currentPiece = makeP(queue[0]);
    gs.nextPieces = queue.slice(1).map(makeP);
    while (gs.nextPieces.length < 3) gs.nextPieces.push(gs.pieceFactory.createRandomPiece());
  }

  gs._markDirty();
  return gs;
}

export default function CreatorMode({ onExit }) {
  const [screen, setScreen] = useState('menu');
  const [activeTemplate, setActiveTemplate] = useState(null);

  const [customBoard, setCustomBoard] = useState(emptyBoard);
  const [customQueue, setCustomQueue] = useState([]);
  const [selectedColor, setSelectedColor] = useState('G');

  const startTemplate = useCallback((tmpl) => {
    setActiveTemplate(tmpl);
    setScreen('play');
  }, []);

  const startCustom = useCallback(() => {
    setActiveTemplate({
      id: 'custom', name: 'Setup Personalizado', emoji: '🎨',
      board: null, queue: [...customQueue],
      _rawBoard: cloneBoard(customBoard),
    });
    setScreen('play');
  }, [customBoard, customQueue]);

  if (screen === 'play' && activeTemplate) {
    return <PlayScreen template={activeTemplate}
      onBack={() => setScreen(activeTemplate.id === 'custom' ? 'editor' : 'menu')} onExit={onExit} />;
  }

  if (screen === 'editor') {
    return <EditorScreen board={customBoard} setBoard={setCustomBoard}
      queue={customQueue} setQueue={setCustomQueue}
      selectedColor={selectedColor} setSelectedColor={setSelectedColor}
      onPlay={() => startCustom()}
      onBack={() => setScreen('menu')} onExit={onExit} />;
  }

  return (
    <div className="h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 flex flex-col items-center p-4 overflow-auto">
      <div className="flex justify-between items-center w-full max-w-lg mb-4">
        <h1 className="text-2xl font-bold text-white">🎨 Modo Criador</h1>
        <button onClick={onExit} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm font-bold">← Voltar</button>
      </div>
      <p className="text-white/50 text-sm mb-4 text-center max-w-md">Aprenda T-Spins com passo a passo ou crie seu setup!</p>

      <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setScreen('editor')}
        className="w-full max-w-lg mb-4 p-4 rounded-xl bg-gradient-to-r from-violet-600/30 to-fuchsia-600/30 hover:from-violet-600/40 hover:to-fuchsia-600/40 border border-violet-500/30 hover:border-violet-500/50 transition-all flex items-center gap-4">
        <span className="text-4xl">🛠️</span>
        <div className="text-left">
          <div className="text-white font-bold text-base">Criar Meu Setup</div>
          <div className="text-white/40 text-xs">Monte o tabuleiro e a fila de peças do zero</div>
        </div>
      </motion.button>

      <div className="text-white/40 text-xs font-semibold uppercase tracking-wide mb-3">Setups de T-Spin</div>
      <div className="grid grid-cols-1 gap-2 w-full max-w-lg">
        {TEMPLATES.map(t => (
          <TemplateCard key={t.id} template={t} onPlay={() => startTemplate(t)} />
        ))}
      </div>
    </div>
  );
}

function TemplateCard({ template, onPlay }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.07] transition-all">
      <div className="flex flex-col items-center min-w-[44px]">
        <BoardMini boardRows={template.board} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-lg">{template.emoji}</span>
          <span className="text-white font-bold text-sm truncate">{template.name}</span>
        </div>
        <p className="text-white/40 text-[11px] mt-0.5 leading-tight">{template.desc}</p>
        {template.steps && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {template.steps.map((s, i) => (
              <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/20">
                <span className="font-bold">{s.key}</span>
              </span>
            ))}
          </div>
        )}
      </div>
      <button onClick={onPlay} className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors shrink-0">🎮 Treinar</button>
    </div>
  );
}

function BoardMini({ boardRows }) {
  const sz = 3;
  const startRow = boardRows.findIndex(r => r !== '..........');
  const rows = boardRows.slice(Math.max(startRow >= 0 ? startRow : BOARD_H - 4, BOARD_H - 6));
  return (
    <div className="bg-black/40 rounded border border-white/10 p-0.5">
      {rows.map((row, y) => (
        <div key={y} className="flex">
          {Array.from(row).map((ch, x) => (
            <div key={x} style={{ width: sz, height: sz, backgroundColor: ch !== '.' ? '#888' : 'transparent' }} />
          ))}
        </div>
      ))}
    </div>
  );
}

function PlayScreen({ template, onBack, onExit }) {
  const [gameState, setGameState] = useState(null);
  const [playId, setPlayId] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const gsRef = useRef(null);
  const loopRef = useRef(null);
  const lastTimeRef = useRef(0);

  const boardData = useMemo(() => {
    if (template._rawBoard) return cloneBoard(template._rawBoard);
    return parseBoard(template.board);
  }, [template]);

  const initGame = useCallback(() => {
    if (loopRef.current) cancelAnimationFrame(loopRef.current);
    const gs = makeGameService(boardData, template.queue);
    gsRef.current = gs;
    setGameState(gs.getGameState());
    setCurrentStep(0);
    lastTimeRef.current = 0;
    setPlayId(p => p + 1);
  }, [boardData, template.queue]);

  useEffect(() => { initGame(); }, [initGame]);

  useEffect(() => {
    const loop = (t) => {
      if (!lastTimeRef.current) lastTimeRef.current = t;
      const dt = t - lastTimeRef.current;
      lastTimeRef.current = t;
      const gs = gsRef.current;
      if (!gs) return;
      if (!gs.gameOver && !gs.isPaused) gs.updateGame(dt);
      if (gs.isDirty) { setGameState(gs.getGameState()); gs.clearDirty(); }
      loopRef.current = requestAnimationFrame(loop);
    };
    loopRef.current = requestAnimationFrame(loop);
    return () => { if (loopRef.current) cancelAnimationFrame(loopRef.current); };
  }, [playId]);

  const advanceStep = useCallback(() => {
    if (template.steps) setCurrentStep(s => Math.min(s + 1, template.steps.length));
  }, [template.steps]);

  useEffect(() => {
    const handle = (e) => {
      const gs = gsRef.current;
      if (!gs || gs.gameOver) return;
      switch (e.key) {
        case 'ArrowLeft': e.preventDefault(); gs.movePiece('left'); advanceStep(); break;
        case 'ArrowRight': e.preventDefault(); gs.movePiece('right'); advanceStep(); break;
        case 'ArrowDown': e.preventDefault(); gs.movePiece('down'); advanceStep(); break;
        case 'ArrowUp': e.preventDefault(); gs.rotatePiece(); advanceStep(); break;
        case 'z': case 'Z': gs.rotatePieceLeft(); advanceStep(); break;
        case 'c': case 'C': case 'Shift': gs.holdPiece(); advanceStep(); break;
        case ' ': e.preventDefault(); gs.hardDrop(); advanceStep(); break;
        case 'r': case 'R': initGame(); break;
      }
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [initGame, advanceStep]);

  const dropPreview = useMemo(() => {
    if (!gameState?.currentPiece || gameState?.gameOver) return null;
    try { return gsRef.current?.getDropPreview(); } catch { return null; }
  }, [gameState?.currentPiece?.position?.x, gameState?.currentPiece?.position?.y,
      gameState?.currentPiece?.type, gameState?.currentPiece?.rotationState]);

  return (
    <div className="h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 flex flex-col items-center p-2 overflow-hidden">
      <div className="flex justify-between items-center w-full max-w-xl mb-2">
        <h1 className="text-lg font-bold text-white truncate">
          {template.emoji} {template.name}
        </h1>
        <div className="flex gap-2">
          <button onClick={initGame} className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded-lg text-xs font-bold">🔄 Replay</button>
          <button onClick={onBack} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-xs font-bold">← Voltar</button>
          <button onClick={onExit} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-xs font-bold">Sair</button>
        </div>
      </div>

      {template.steps && template.steps.length > 0 && (
        <div className="bg-purple-500/10 border border-purple-500/25 rounded-xl px-4 py-2.5 mb-2 max-w-xl w-full">
          <div className="text-purple-300/60 text-[10px] font-semibold uppercase tracking-wide mb-1.5">Passo a Passo</div>
          <div className="flex flex-col gap-1">
            {template.steps.map((s, i) => {
              const isDone = i < currentStep;
              const isCurrent = i === currentStep;
              return (
                <div key={i} className={`flex items-center gap-2 px-2 py-1 rounded-lg transition-all ${
                  isDone ? 'bg-green-500/15 opacity-60' : isCurrent ? 'bg-purple-500/20 border border-purple-400/30' : 'opacity-40'
                }`}>
                  <span className={`text-xs font-bold min-w-[40px] text-center px-1.5 py-0.5 rounded ${
                    isDone ? 'bg-green-500/30 text-green-300' : isCurrent ? 'bg-purple-500/30 text-purple-200' : 'bg-white/5 text-white/30'
                  }`}>{s.key}</span>
                  <span className={`text-xs ${
                    isDone ? 'text-green-300 line-through' : isCurrent ? 'text-white font-medium' : 'text-white/40'
                  }`}>{s.text}</span>
                  {isDone && <span className="text-green-400 text-xs ml-auto">✓</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {gameState && (
        <div className="flex gap-3 items-start justify-center">
          <div className="flex flex-col gap-2">
            <HeldPiece heldPiece={gameState.heldPiece} canHold={gameState.canHold} />
            <div className="text-white/50 text-[10px] leading-tight">←→ mover<br/>↑ girar<br/>C hold<br/>Espaço drop<br/>R replay</div>
          </div>
          <TetrisBoard board={gameState.board} currentPiece={gameState.currentPiece} dropPreview={dropPreview} gameOver={gameState.gameOver} />
          <div className="flex flex-col gap-2">
            <NextPieces pieces={gameState.nextPieces || []} />
            <Scoreboard score={gameState.score?.points || 0} level={gameState.score?.level || 1} lines={gameState.score?.lines || 0} combo={gameState.score?.combo || 0} />
          </div>
        </div>
      )}

      {gameState?.gameOver && (
        <div className="mt-4 flex gap-3">
          <button onClick={initGame} className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold text-lg">🔄 Tentar Novamente</button>
          <button onClick={onBack} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold text-lg">← Voltar</button>
        </div>
      )}
    </div>
  );
}

function EditorScreen({ board, setBoard, queue, setQueue, selectedColor, setSelectedColor, onPlay, onBack, onExit }) {
  const toggleCell = useCallback((x, y) => {
    setBoard(prev => {
      const nb = prev.map(r => [...r]);
      nb[y][x] = nb[y][x] ? null : { type: selectedColor, color: PIECE_COLORS[selectedColor], emoji: '⬜' };
      return nb;
    });
  }, [selectedColor, setBoard]);

  const fillRow = useCallback((y, gap) => {
    setBoard(prev => {
      const nb = prev.map(r => [...r]);
      for (let x = 0; x < BOARD_W; x++) nb[y][x] = x === gap ? null : { type: 'G', color: PIECE_COLORS.G, emoji: '⬜' };
      return nb;
    });
  }, [setBoard]);

  const clearRow = useCallback((y) => {
    setBoard(prev => {
      const nb = prev.map(r => [...r]);
      for (let x = 0; x < BOARD_W; x++) nb[y][x] = null;
      return nb;
    });
  }, [setBoard]);

  return (
    <div className="h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 flex flex-col items-center p-3 overflow-auto">
      <div className="flex justify-between items-center w-full max-w-2xl mb-3">
        <h1 className="text-xl font-bold text-white">🛠️ Criar Meu Setup</h1>
        <div className="flex gap-2">
          <button onClick={onBack} className="bg-slate-600 hover:bg-slate-700 text-white px-3 py-1 rounded-lg text-sm font-bold">← Templates</button>
          <button onClick={onExit} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm font-bold">Sair</button>
        </div>
      </div>
      <div className="flex gap-4 items-start justify-center flex-wrap max-w-2xl">
        <div className="flex flex-col gap-2">
          <div className="text-white/60 text-xs font-semibold mb-1">TABULEIRO (clique para editar)</div>
          <BoardEditor board={board} onToggle={toggleCell} onFillRow={fillRow} onClearRow={clearRow} />
          <div className="flex gap-1 items-center mt-1">
            <span className="text-white/50 text-xs mr-1">Cor:</span>
            {PIECE_TYPES.map(t => (
              <button key={t} onClick={() => setSelectedColor(t)}
                className={`w-6 h-6 rounded border-2 transition-all ${selectedColor === t ? 'border-white scale-110' : 'border-white/20'}`}
                style={{ backgroundColor: PIECE_COLORS[t] }} title={t} />
            ))}
            <button onClick={() => setSelectedColor('G')}
              className={`w-6 h-6 rounded border-2 transition-all ${selectedColor === 'G' ? 'border-white scale-110' : 'border-white/20'}`}
              style={{ backgroundColor: PIECE_COLORS.G }} title="Cinza" />
          </div>
          <button onClick={() => setBoard(emptyBoard())} className="bg-red-700/60 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-semibold mt-1 w-fit">Limpar Tudo</button>
        </div>

        <div className="flex flex-col gap-3 min-w-[160px]">
          <div>
            <div className="text-white/60 text-xs font-semibold mb-2">FILA DE PEÇAS</div>
            <div className="flex flex-wrap gap-1 mb-2">
              {PIECE_TYPES.map(t => (
                <button key={t} onClick={() => setQueue(q => [...q, t])}
                  className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 transition-all" title={`Adicionar ${t}`}>
                  <PieceMini type={t} />
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-1 min-h-[60px] bg-black/30 rounded-lg p-2">
              {queue.length === 0 ? (
                <span className="text-white/30 text-xs text-center py-2">Clique nas peças acima<br/>(vazio = fila aleatória)</span>
              ) : (
                <div className="flex flex-wrap gap-1">
                  {queue.map((t, i) => (
                    <button key={i} onClick={() => setQueue(q => q.filter((_, j) => j !== i))}
                      className="flex items-center justify-center w-8 h-8 rounded bg-white/10 hover:bg-red-500/30 border border-white/10 transition-all group relative" title="Remover">
                      <PieceMini type={t} size={10} />
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] rounded-full w-3 h-3 flex items-center justify-center opacity-0 group-hover:opacity-100">×</span>
                    </button>
                  ))}
                </div>
              )}
              {queue.length > 0 && <button onClick={() => setQueue([])} className="text-red-400 text-[10px] mt-1 hover:text-red-300">Limpar fila</button>}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <button onClick={onPlay} className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-white font-bold text-base shadow-lg shadow-emerald-500/25 transition-all active:scale-95">🎮 Jogar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BoardEditor({ board, onToggle, onFillRow, onClearRow }) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState(null);
  const cellSize = 22;

  const handlePointerDown = (x, y) => { setIsDragging(true); setDragMode(!board[y][x] ? 'place' : 'erase'); onToggle(x, y); };
  const handlePointerEnter = (x, y) => {
    if (!isDragging) return;
    if (dragMode === 'place' && !board[y][x]) onToggle(x, y);
    if (dragMode === 'erase' && board[y][x]) onToggle(x, y);
  };
  const handlePointerUp = () => { setIsDragging(false); setDragMode(null); };

  useEffect(() => { window.addEventListener('pointerup', handlePointerUp); return () => window.removeEventListener('pointerup', handlePointerUp); }, []);

  return (
    <div className="relative bg-black/50 rounded-lg border border-white/10 select-none" style={{ width: cellSize * BOARD_W + 2, padding: 1 }} onContextMenu={e => e.preventDefault()}>
      {board.map((row, y) => (
        <div key={y} className="flex" style={{ height: cellSize }}>
          {row.map((cell, x) => (
            <div key={x} onPointerDown={() => handlePointerDown(x, y)} onPointerEnter={() => handlePointerEnter(x, y)}
              className="cursor-pointer border border-white/[0.04] hover:border-white/20 transition-colors"
              style={{ width: cellSize, height: cellSize, backgroundColor: cell ? cell.color : 'transparent', opacity: cell ? 0.85 : 1 }} />
          ))}
          <button onClick={() => row.some(c => c) ? onClearRow(y) : onFillRow(y, Math.floor(Math.random() * BOARD_W))}
            className="ml-0.5 text-white/20 hover:text-white/60 text-[9px] w-4 flex items-center justify-center"
            title={row.some(c => c) ? 'Limpar linha' : 'Preencher linha'}>
            {row.some(c => c) ? '×' : '+'}
          </button>
        </div>
      ))}
    </div>
  );
}

function PieceMini({ type, size = 12 }) {
  const shape = PIECES[type]?.shape;
  if (!shape) return null;
  const color = PIECE_COLORS[type];
  // Filter empty rows
  const activeRows = shape.filter(row => row.some(c => c));
  // Find global min/max column across ALL rows (preserves spatial layout)
  let minCol = Infinity, maxCol = -1;
  for (const row of activeRows) {
    for (let x = 0; x < row.length; x++) {
      if (row[x]) { minCol = Math.min(minCol, x); maxCol = Math.max(maxCol, x); }
    }
  }
  if (maxCol < 0) return null;
  const trimmed = activeRows.map(row => row.slice(minCol, maxCol + 1));
  const w = maxCol - minCol + 1;
  return (
    <div className="flex flex-col items-center">
      {trimmed.map((row, y) => (
        <div key={y} className="flex">
          {Array.from({ length: w }, (_, x) => (
            <div key={x} style={{ width: size, height: size, backgroundColor: row[x] ? color : 'transparent', borderRadius: 1 }} />
          ))}
        </div>
      ))}
    </div>
  );
}
