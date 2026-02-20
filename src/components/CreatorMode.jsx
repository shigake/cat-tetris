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

const DEFAULT_TEMPLATES = [
  {
    id: 'tss',
    name: 'T-Spin Single',
    emoji: '🎯',
    desc: 'O T-Spin mais simples — limpa 1 linha',
    board: mkRows(18, [
      'GGG..GGGGG',
      'GGG...GGGG',
    ]),
    queue: ['T'],
    isDefault: true,
  },
  {
    id: 'tsd-right',
    name: 'T-Spin Double (Direita)',
    emoji: '🌀',
    desc: 'O clássico TSD — limpa 2 linhas',
    board: mkRows(17, [
      'GGG..GGGGG',
      'GGG...GGGG',
      'GGGG.GGGGG',
    ]),
    queue: ['T'],
    isDefault: true,
  },
  {
    id: 'tsd-left',
    name: 'T-Spin Double (Esquerda)',
    emoji: '🌀',
    desc: 'TSD espelhado — limpa 2 linhas',
    board: mkRows(17, [
      'GGGGG..GGG',
      'GGGG...GGG',
      'GGGGG.GGGG',
    ]),
    queue: ['T'],
    isDefault: true,
  },
  {
    id: 'tsd-chain',
    name: 'TSD em Cadeia',
    emoji: '🔁',
    desc: 'Dois T-Spin Doubles seguidos — Back-to-Back!',
    board: mkRows(12, [
      'G....GGGGG',
      'G...GGGGGG',
      'GGG..GGGGG',
      'GGG...GGGG',
      'GGGG.GGGGG',
      'GGG..GGGGG',
      'GGG...GGGG',
      'GGGG.GGGGG',
    ]),
    queue: ['T', 'T'],
    isDefault: true,
  },
  {
    id: 'dt-cannon',
    name: 'DT Cannon',
    emoji: '💣',
    desc: 'TSD + TST combinados!',
    board: mkRows(13, [
      'G...GGGGGG',
      'G....GGGGG',
      'GGGG.GGGGG',
      'GGG..GGGGG',
      'GGG...GGGG',
      'GGGG.GGGGG',
      'GGGG.GGGGG',
    ]),
    queue: ['T', 'T'],
    isDefault: true,
  },
  {
    id: 'stsd',
    name: 'Super T-Spin Double',
    emoji: '⚡',
    desc: 'STSD — usa wall kick avançado pra entrar na cavidade!',
    board: mkRows(13, [
      'GGG..GGGGG',
      'GGG..GGGGG',
      'GGG..GGGGG',
      'GGG...GGGG',
      'GGGGG.GGGG',
      'GGGG..GGGG',
      'GGGG..GGGG',
    ]),
    queue: ['T', 'T'],
    isDefault: true,
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

// --- Serialization helpers ---
const STORAGE_KEY = 'cattetris_all_setups';

function boardToRows(board) {
  return board.map(row =>
    row.map(cell => cell ? (cell.type || 'G') : '.').join('')
  );
}

function rowsToBoard(rows) {
  return rows.map(row =>
    Array.from(row).map(ch =>
      ch === '.' ? null : { type: ch, color: PIECE_COLORS[ch] || '#888', emoji: '⬜' }
    )
  );
}

function serializeSetup(setup) {
  return {
    id: setup.id,
    name: setup.name,
    emoji: setup.emoji || '🎨',
    desc: setup.desc || '',
    board: Array.isArray(setup.board) && typeof setup.board[0] === 'string' ? setup.board : boardToRows(setup.board || []),
    queue: setup.queue || [],
    steps: setup.steps || [],
    isDefault: setup.isDefault || false,
  };
}

function loadAllSetups() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  // First load — seed with defaults
  const defaults = DEFAULT_TEMPLATES.map(serializeSetup);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
  return defaults;
}

function saveAllSetups(setups) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(setups));
}

function exportSetups(setups) {
  const json = JSON.stringify(setups, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'cat-tetris-setups.json';
  a.click();
  URL.revokeObjectURL(url);
}

function importSetups(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (!Array.isArray(data)) throw new Error('not array');
        const valid = data.filter(s => s.name && s.board && Array.isArray(s.board) && Array.isArray(s.queue));
        resolve(valid.map(s => ({ ...s, id: s.id || ('imp_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6)) })));
      } catch (err) { reject(err); }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
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
  const [allSetups, setAllSetups] = useState(() => loadAllSetups());
  const [editingSetup, setEditingSetup] = useState(null);
  const [importMsg, setImportMsg] = useState(null);

  const [customBoard, setCustomBoard] = useState(emptyBoard);
  const [customQueue, setCustomQueue] = useState([]);
  const [customName, setCustomName] = useState('');
  const [customEmoji, setCustomEmoji] = useState('🎨');
  const [customDesc, setCustomDesc] = useState('');
  const [selectedColor, setSelectedColor] = useState('G');
  const fileInputRef = useRef(null);

  const persist = useCallback((setups) => {
    setAllSetups(setups);
    saveAllSetups(setups);
  }, []);

  const playSetup = useCallback((setup) => {
    setActiveTemplate(setup);
    setScreen('play');
  }, []);

  const startCustomPlay = useCallback(() => {
    setActiveTemplate({
      id: 'custom_preview', name: customName || 'Setup Personalizado', emoji: customEmoji,
      board: null, queue: [...customQueue],
      _rawBoard: cloneBoard(customBoard),
    });
    setScreen('play');
  }, [customBoard, customQueue, customName, customEmoji]);

  const openNewEditor = useCallback(() => {
    setEditingSetup(null);
    setCustomBoard(emptyBoard());
    setCustomQueue([]);
    setCustomName('');
    setCustomEmoji('🎨');
    setCustomDesc('');
    setScreen('editor');
  }, []);

  const openEditEditor = useCallback((setup) => {
    setEditingSetup(setup);
    setCustomBoard(rowsToBoard(setup.board));
    setCustomQueue([...setup.queue]);
    setCustomName(setup.name);
    setCustomEmoji(setup.emoji || '🎨');
    setCustomDesc(setup.desc || '');
    setScreen('editor');
  }, []);

  const saveSetup = useCallback(() => {
    const name = customName.trim() || 'Meu Setup';
    const boardRows = boardToRows(customBoard);
    if (editingSetup) {
      const updated = allSetups.map(s =>
        s.id === editingSetup.id ? { ...s, name, emoji: customEmoji, desc: customDesc, board: boardRows, queue: [...customQueue] } : s
      );
      persist(updated);
    } else {
      const newSetup = {
        id: 'custom_' + Date.now(),
        name,
        emoji: customEmoji,
        desc: customDesc,
        board: boardRows,
        queue: [...customQueue],
        steps: [],
        isDefault: false,
      };
      persist([...allSetups, newSetup]);
    }
    setScreen('menu');
  }, [customBoard, customQueue, customName, customEmoji, customDesc, editingSetup, allSetups, persist]);

  const deleteSetup = useCallback((id) => {
    persist(allSetups.filter(s => s.id !== id));
  }, [allSetups, persist]);

  const resetDefaults = useCallback(() => {
    const defaults = DEFAULT_TEMPLATES.map(serializeSetup);
    const customs = allSetups.filter(s => !s.isDefault);
    persist([...defaults, ...customs]);
  }, [allSetups, persist]);

  const handleImport = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imported = await importSetups(file);
      if (imported.length === 0) { setImportMsg('Nenhum setup válido no arquivo.'); return; }
      persist([...allSetups, ...imported]);
      setImportMsg(`${imported.length} setup(s) importado(s)!`);
      setTimeout(() => setImportMsg(null), 3000);
    } catch {
      setImportMsg('Erro ao ler o arquivo JSON.');
      setTimeout(() => setImportMsg(null), 3000);
    }
    e.target.value = '';
  }, [allSetups, persist]);

  const handleExportAll = useCallback(() => {
    if (allSetups.length === 0) return;
    exportSetups(allSetups);
  }, [allSetups]);

  const moveSetup = useCallback((id, dir) => {
    const idx = allSetups.findIndex(s => s.id === id);
    if (idx < 0) return;
    const target = idx + dir;
    if (target < 0 || target >= allSetups.length) return;
    const copy = [...allSetups];
    [copy[idx], copy[target]] = [copy[target], copy[idx]];
    persist(copy);
  }, [allSetups, persist]);

  if (screen === 'play' && activeTemplate) {
    return <PlayScreen template={activeTemplate}
      onBack={() => setScreen('menu')} onExit={onExit} />;
  }

  if (screen === 'editor') {
    return <EditorScreen board={customBoard} setBoard={setCustomBoard}
      queue={customQueue} setQueue={setCustomQueue}
      name={customName} setName={setCustomName}
      emoji={customEmoji} setEmoji={setCustomEmoji}
      desc={customDesc} setDesc={setCustomDesc}
      selectedColor={selectedColor} setSelectedColor={setSelectedColor}
      onPlay={startCustomPlay} onSave={saveSetup}
      isEditing={!!editingSetup}
      onBack={() => setScreen('menu')} onExit={onExit} />;
  }

  return (
    <div className="h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 flex flex-col items-center p-4 overflow-auto">
      <div className="flex justify-between items-center w-full max-w-lg mb-4">
        <h1 className="text-2xl font-bold text-white">🎨 Modo Criador</h1>
        <button onClick={onExit} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm font-bold">← Voltar</button>
      </div>
      <p className="text-white/50 text-sm mb-4 text-center max-w-md">Crie, edite e organize seus setups de treino!</p>

      {/* Action bar */}
      <div className="flex gap-2 w-full max-w-lg mb-4 flex-wrap justify-center">
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={openNewEditor}
          className="flex-1 min-w-[140px] p-3 rounded-xl bg-gradient-to-r from-violet-600/30 to-fuchsia-600/30 hover:from-violet-600/40 hover:to-fuchsia-600/40 border border-violet-500/30 hover:border-violet-500/50 transition-all flex items-center gap-3">
          <span className="text-2xl">➕</span>
          <div className="text-left">
            <div className="text-white font-bold text-sm">Criar Novo</div>
            <div className="text-white/40 text-[10px]">Monte do zero</div>
          </div>
        </motion.button>
        <button onClick={() => fileInputRef.current?.click()} className="bg-green-600/40 hover:bg-green-600/60 text-white px-4 py-3 rounded-xl text-xs font-bold transition-colors border border-green-500/20">📥 Importar</button>
        <button onClick={handleExportAll} className="bg-blue-600/40 hover:bg-blue-600/60 text-white px-4 py-3 rounded-xl text-xs font-bold transition-colors border border-blue-500/20" disabled={allSetups.length === 0}>📤 Exportar</button>
        <button onClick={resetDefaults} className="bg-orange-600/40 hover:bg-orange-600/60 text-white px-4 py-3 rounded-xl text-xs font-bold transition-colors border border-orange-500/20">🔄 Resetar Padrão</button>
      </div>

      <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} className="hidden" />

      {importMsg && (
        <div className="w-full max-w-lg mb-3 px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-200 text-xs text-center font-medium">{importMsg}</div>
      )}

      {/* All setups */}
      <div className="text-white/40 text-xs font-semibold uppercase tracking-wide mb-2">Todos os Setups ({allSetups.length})</div>
      <div className="grid grid-cols-1 gap-2 w-full max-w-lg pb-8">
        {allSetups.map((s, i) => (
          <SetupCard key={s.id} setup={s}
            onPlay={() => playSetup(s)}
            onEdit={() => openEditEditor(s)}
            onDelete={() => deleteSetup(s.id)}
            onExport={() => exportSetups([s])}
            onMoveUp={i > 0 ? () => moveSetup(s.id, -1) : null}
            onMoveDown={i < allSetups.length - 1 ? () => moveSetup(s.id, 1) : null} />
        ))}
        {allSetups.length === 0 && (
          <div className="text-center py-8 text-white/30 text-sm">
            Nenhum setup. Clique em "Criar Novo" ou "Resetar Padrão".
          </div>
        )}
      </div>
    </div>
  );
}

function SetupCard({ setup, onPlay, onEdit, onDelete, onExport, onMoveUp, onMoveDown }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const isDefault = setup.isDefault;
  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
      isDefault ? 'bg-white/[0.04] border-white/[0.06] hover:bg-white/[0.07]' : 'bg-violet-500/[0.06] border-violet-500/[0.12] hover:bg-violet-500/[0.1]'
    }`}>
      <div className="flex flex-col items-center min-w-[44px]">
        <BoardMini boardRows={setup.board} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-lg">{setup.emoji || '🎨'}</span>
          <span className="text-white font-bold text-sm truncate">{setup.name}</span>
          {isDefault && <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/20 shrink-0">padrão</span>}
        </div>
        {setup.desc && <p className="text-white/40 text-[11px] mt-0.5 leading-tight truncate">{setup.desc}</p>}
        <div className="flex items-center gap-1.5 mt-1">
          <span className="text-white/30 text-[10px]">Peças:</span>
          {(setup.queue || []).map((t, i) => (
            <span key={i} className="inline-block w-3.5 h-3.5 rounded" style={{ backgroundColor: PIECE_COLORS[t] }} title={t} />
          ))}
          {(!setup.queue || setup.queue.length === 0) && <span className="text-white/20 text-[10px]">aleatória</span>}
        </div>
      </div>
      <div className="flex flex-col gap-1 shrink-0">
        <div className="flex gap-1">
          <button onClick={onPlay} className="bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 rounded text-[10px] font-bold transition-colors" title="Jogar">🎮</button>
          <button onClick={onEdit} className="bg-blue-600 hover:bg-blue-500 text-white px-2.5 py-1 rounded text-[10px] font-bold transition-colors" title="Editar">✏️</button>
          <button onClick={onExport} className="bg-slate-600 hover:bg-slate-500 text-white px-2.5 py-1 rounded text-[10px] font-bold transition-colors" title="Exportar">📤</button>
        </div>
        <div className="flex gap-1">
          {onMoveUp && <button onClick={onMoveUp} className="bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded text-[10px] font-bold flex-1" title="Mover pra cima">▲</button>}
          {onMoveDown && <button onClick={onMoveDown} className="bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded text-[10px] font-bold flex-1" title="Mover pra baixo">▼</button>}
        </div>
        {!confirmDelete ? (
          <button onClick={() => setConfirmDelete(true)} className="bg-red-700/40 hover:bg-red-700/70 text-red-300 px-2.5 py-1 rounded text-[10px] font-bold transition-colors w-full">🗑️ Excluir</button>
        ) : (
          <div className="flex gap-1">
            <button onClick={() => { onDelete(); setConfirmDelete(false); }} className="bg-red-600 hover:bg-red-500 text-white px-2 py-1 rounded text-[9px] font-bold flex-1">Sim</button>
            <button onClick={() => setConfirmDelete(false)} className="bg-slate-600 hover:bg-slate-500 text-white px-2 py-1 rounded text-[9px] font-bold flex-1">Não</button>
          </div>
        )}
      </div>
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

  useEffect(() => {
    const handle = (e) => {
      const gs = gsRef.current;
      if (!gs || gs.gameOver) return;
      switch (e.key) {
        case 'ArrowLeft': e.preventDefault(); gs.movePiece('left'); break;
        case 'ArrowRight': e.preventDefault(); gs.movePiece('right'); break;
        case 'ArrowDown': e.preventDefault(); gs.movePiece('down'); break;
        case 'ArrowUp': e.preventDefault(); gs.rotatePiece(); break;
        case 'z': case 'Z': gs.rotatePieceLeft(); break;
        case 'c': case 'C': case 'Shift': gs.holdPiece(); break;
        case ' ': e.preventDefault(); gs.hardDrop(); break;
        case 'r': case 'R': initGame(); break;
      }
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [initGame]);

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

function EditorScreen({ board, setBoard, queue, setQueue, name, setName, emoji, setEmoji, desc, setDesc, selectedColor, setSelectedColor, onPlay, onSave, isEditing, onBack, onExit }) {
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
        <h1 className="text-xl font-bold text-white">{isEditing ? '✏️ Editar Setup' : '🛠️ Criar Meu Setup'}</h1>
        <div className="flex gap-2">
          <button onClick={onBack} className="bg-slate-600 hover:bg-slate-700 text-white px-3 py-1 rounded-lg text-sm font-bold">← Voltar</button>
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
          <div>
            <div className="text-white/60 text-xs font-semibold mb-2">DETALHES</div>
            <div className="flex gap-2 mb-2">
              <input type="text" value={emoji} onChange={e => setEmoji(e.target.value)}
                placeholder="🎨" maxLength={4}
                className="w-14 px-2 py-2 rounded-lg bg-black/30 border border-white/10 text-white text-center text-lg focus:border-violet-500/50 focus:outline-none" title="Emoji" />
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="Nome do setup" maxLength={40}
                className="flex-1 px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-white text-sm placeholder-white/20 focus:border-violet-500/50 focus:outline-none" />
            </div>
            <input type="text" value={desc} onChange={e => setDesc(e.target.value)}
              placeholder="Descrição (opcional)" maxLength={80}
              className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-white text-xs placeholder-white/20 focus:border-violet-500/50 focus:outline-none mb-3" />
          </div>
          <div className="flex flex-col gap-2">
            <button onClick={onSave} className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-400 hover:to-purple-400 text-white font-bold text-base shadow-lg shadow-violet-500/25 transition-all active:scale-95">{isEditing ? '💾 Salvar Alterações' : '💾 Salvar Setup'}</button>
            <button onClick={onPlay} className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all active:scale-95">🎮 Testar (sem salvar)</button>
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
