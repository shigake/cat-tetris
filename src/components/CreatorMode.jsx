import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    id: 'tspin-double',
    name: 'T-Spin Double',
    emoji: '🌀',
    desc: 'Setup clássico de T-Spin Double',
    board: buildTemplateBoard([
      '..........', '..........', '..........', '..........',
      '..........', '..........', '..........', '..........',
      '..........', '..........', '..........', '..........',
      '..........', '..........', '..........', '..........',
      '..........', '..........',
      'GGG..GGGGG',
      'GG..GGGGGG',
    ]),
    queue: ['T'],
    hint: 'Rotacione o T para encaixar no buraco e faça um T-Spin Double!'
  },
  {
    id: 'tspin-triple',
    name: 'T-Spin Triple',
    emoji: '🔥',
    desc: 'Setup avançado de T-Spin Triple',
    board: buildTemplateBoard([
      '..........', '..........', '..........', '..........',
      '..........', '..........', '..........', '..........',
      '..........', '..........', '..........', '..........',
      '..........', '..........', '..........', '..........',
      '..........', 
      'GGG..GGGGG',
      'GG..GGGGGG',
      'GGG.GGGGGG',
    ]),
    queue: ['T'],
    hint: 'Encaixe o T girando duas vezes para fazer um T-Spin Triple!'
  },
  {
    id: 'tetris-well',
    name: 'Tetris (4 linhas)',
    emoji: '💎',
    desc: 'Pratique Tetris com poço na direita',
    board: buildTemplateBoard([
      '..........', '..........', '..........', '..........',
      '..........', '..........', '..........', '..........',
      '..........', '..........', '..........', '..........',
      '..........', '..........', '..........', '..........',
      'GGGGGGGGG.',
      'GGGGGGGGG.',
      'GGGGGGGGG.',
      'GGGGGGGGG.',
    ]),
    queue: ['I'],
    hint: 'Solte a peça I no poço da direita para limpar 4 linhas!'
  },
  {
    id: 'combo-4',
    name: 'Combo x4',
    emoji: '⚡',
    desc: 'Pratique combos consecutivos',
    board: buildTemplateBoard([
      '..........', '..........', '..........', '..........',
      '..........', '..........', '..........', '..........',
      '..........', '..........', '..........', '..........',
      '..........', '..........', '..........', '..........',
      'GGGGG.GGGG',
      'GGGGG.GGGG',
      'GGGGG.GGGG',
      'GGGGG.GGGG',
    ]),
    queue: ['I', 'I', 'I', 'I'],
    hint: 'Solte as peças I uma a uma na coluna vazia para fazer combo!'
  },
  {
    id: 'perfect-clear',
    name: 'Perfect Clear',
    emoji: '✨',
    desc: 'Tente limpar todo o tabuleiro',
    board: buildTemplateBoard([
      '..........', '..........', '..........', '..........',
      '..........', '..........', '..........', '..........',
      '..........', '..........', '..........', '..........',
      '..........', '..........', '..........', '..........',
      '..........', '..........',
      'GGGG..GGGG',
      'GGGGGGGGGG',
    ]),
    queue: ['O', 'I'],
    hint: 'Coloque o O no buraco e depois use I para limpar tudo!'
  },
  {
    id: 'tspin-mini',
    name: 'T-Spin Mini',
    emoji: '🎯',
    desc: 'T-Spin Mini setup básico',
    board: buildTemplateBoard([
      '..........', '..........', '..........', '..........',
      '..........', '..........', '..........', '..........',
      '..........', '..........', '..........', '..........',
      '..........', '..........', '..........', '..........',
      '..........', '..........', '..........',
      'GGG.GGGGGG',
    ]),
    queue: ['T'],
    hint: 'Gire o T para encaixar no espaço e limpar a linha!'
  },
  {
    id: 'empty',
    name: 'Tela Limpa',
    emoji: '📝',
    desc: 'Comece do zero e crie seu setup',
    board: null,
    queue: [],
    hint: 'Use o editor para montar o tabuleiro que quiser!'
  },
];

function buildTemplateBoard(rows) {
  const board = [];
  for (let y = 0; y < BOARD_H; y++) {
    const row = rows[y] || '..........';
    board.push(
      Array.from(row).map(ch => {
        if (ch === '.' || ch === ' ') return null;
        return { type: 'G', color: PIECE_COLORS[ch] || '#888888', emoji: '⬜' };
      })
    );
  }
  return board;
}

function emptyBoard() {
  return Array(BOARD_H).fill(null).map(() => Array(BOARD_W).fill(null));
}

export default function CreatorMode({ onExit }) {
  const [phase, setPhase] = useState('edit');
  const [board, setBoard] = useState(emptyBoard);
  const [pieceQueue, setPieceQueue] = useState([]);
  const [selectedColor, setSelectedColor] = useState('G');
  const [showTemplates, setShowTemplates] = useState(true);
  const [hint, setHint] = useState('');
  const [activeTemplate, setActiveTemplate] = useState(null);

  const [gameState, setGameState] = useState(null);
  const gameServiceRef = useRef(null);
  const loopRef = useRef(null);
  const lastTimeRef = useRef(0);

  const applyTemplate = useCallback((template) => {
    setBoard(template.board ? template.board.map(r => [...r]) : emptyBoard());
    setPieceQueue([...template.queue]);
    setHint(template.hint || '');
    setActiveTemplate(template.id);
    setShowTemplates(false);
  }, []);

  const toggleCell = useCallback((x, y) => {
    if (phase !== 'edit') return;
    setBoard(prev => {
      const nb = prev.map(r => [...r]);
      if (nb[y][x]) {
        nb[y][x] = null;
      } else {
        nb[y][x] = { type: selectedColor, color: PIECE_COLORS[selectedColor], emoji: '⬜' };
      }
      return nb;
    });
  }, [phase, selectedColor]);

  const fillRow = useCallback((y, gap) => {
    if (phase !== 'edit') return;
    setBoard(prev => {
      const nb = prev.map(r => [...r]);
      for (let x = 0; x < BOARD_W; x++) {
        if (x === gap) {
          nb[y][x] = null;
        } else {
          nb[y][x] = { type: 'G', color: PIECE_COLORS.G, emoji: '⬜' };
        }
      }
      return nb;
    });
  }, [phase]);

  const clearRow = useCallback((y) => {
    if (phase !== 'edit') return;
    setBoard(prev => {
      const nb = prev.map(r => [...r]);
      for (let x = 0; x < BOARD_W; x++) nb[y][x] = null;
      return nb;
    });
  }, [phase]);

  const addToQueue = useCallback((type) => {
    setPieceQueue(prev => [...prev, type]);
  }, []);

  const removeFromQueue = useCallback((idx) => {
    setPieceQueue(prev => prev.filter((_, i) => i !== idx));
  }, []);

  const clearQueue = useCallback(() => setPieceQueue([]), []);

  const startPlay = useCallback(() => {
    const gs = new GameService(
      new PieceFactory(),
      new MovementStrategyFactory(),
      null,
      new ScoringService()
    );
    gs.initializeGame();
    gs.isPlaying = true;

    for (let y = 0; y < BOARD_H; y++) {
      for (let x = 0; x < BOARD_W; x++) {
        if (board[y][x]) {
          gs.board.setCell(x, y, board[y][x]);
        }
      }
    }

    if (pieceQueue.length > 0) {
      const makeP = (type) => {
        const cfg = PIECES[type];
        const pos = type === 'I' ? { x: 3, y: -2 } : { x: 3, y: 0 };
        return new Piece(type, cfg.shape, cfg.color, cfg.emoji, pos, false, 0);
      };
      gs.currentPiece = makeP(pieceQueue[0]);
      gs.nextPieces = pieceQueue.slice(1).map(makeP);
      while (gs.nextPieces.length < 3) {
        gs.nextPieces.push(gs.pieceFactory.createRandomPiece());
      }
    }

    gs._markDirty();
    gameServiceRef.current = gs;
    setGameState(gs.getGameState());
    setPhase('play');
    lastTimeRef.current = 0;
  }, [board, pieceQueue]);

  const resetToEdit = useCallback(() => {
    if (loopRef.current) cancelAnimationFrame(loopRef.current);
    gameServiceRef.current = null;
    setGameState(null);
    setPhase('edit');
    lastTimeRef.current = 0;
  }, []);

  const replaySetup = useCallback(() => {
    if (loopRef.current) cancelAnimationFrame(loopRef.current);
    lastTimeRef.current = 0;
    startPlay();
  }, [startPlay]);

  useEffect(() => {
    if (phase !== 'play') return;

    const loop = (t) => {
      if (!lastTimeRef.current) lastTimeRef.current = t;
      const dt = t - lastTimeRef.current;
      lastTimeRef.current = t;

      const gs = gameServiceRef.current;
      if (!gs) return;

      if (!gs.gameOver && !gs.isPaused) {
        gs.updateGame(dt);
      }

      if (gs.isDirty) {
        setGameState(gs.getGameState());
        gs.clearDirty();
      }

      loopRef.current = requestAnimationFrame(loop);
    };
    loopRef.current = requestAnimationFrame(loop);
    return () => { if (loopRef.current) cancelAnimationFrame(loopRef.current); };
  }, [phase]);

  useEffect(() => {
    if (phase !== 'play') return;
    const handle = (e) => {
      const gs = gameServiceRef.current;
      if (!gs || gs.gameOver) return;
      switch (e.key) {
        case 'ArrowLeft': e.preventDefault(); gs.movePiece('left'); break;
        case 'ArrowRight': e.preventDefault(); gs.movePiece('right'); break;
        case 'ArrowDown': e.preventDefault(); gs.movePiece('down'); break;
        case 'ArrowUp': e.preventDefault(); gs.rotatePiece(); break;
        case 'z': case 'Z': gs.rotatePiece('left'); break;
        case 'c': case 'C': case 'Shift': gs.holdPiece(); break;
        case ' ': e.preventDefault(); gs.hardDrop(); break;
        case 'r': case 'R': replaySetup(); break;
      }
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [phase, replaySetup]);

  const dropPreview = React.useMemo(() => {
    if (phase !== 'play' || !gameState?.currentPiece || gameState?.gameOver) return null;
    try { return gameServiceRef.current?.getDropPreview(); } catch { return null; }
  }, [phase, gameState?.currentPiece?.position?.x, gameState?.currentPiece?.position?.y,
      gameState?.currentPiece?.type, gameState?.currentPiece?.rotationState]);

  if (showTemplates) {
    return (
      <div className="h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 flex flex-col items-center p-4 overflow-auto">
        <div className="flex justify-between items-center w-full max-w-lg mb-4">
          <h1 className="text-2xl font-bold text-white">🎨 Modo Criador</h1>
          <button onClick={onExit} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm font-bold">← Voltar</button>
        </div>

        <p className="text-white/60 text-sm mb-4 text-center max-w-md">
          Escolha um template para praticar ou comece do zero e crie seu próprio setup!
        </p>

        <div className="grid grid-cols-2 gap-3 w-full max-w-lg">
          {TEMPLATES.map(t => (
            <motion.button
              key={t.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => applyTemplate(t)}
              className="flex flex-col items-center p-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] hover:border-white/[0.2] transition-all"
            >
              <span className="text-3xl mb-2">{t.emoji}</span>
              <span className="text-white font-bold text-sm">{t.name}</span>
              <span className="text-white/40 text-xs mt-1 text-center">{t.desc}</span>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  if (phase === 'play') {
    return (
      <div className="h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 flex flex-col items-center p-2 overflow-hidden">
        <div className="flex justify-between items-center w-full max-w-xl mb-2">
          <h1 className="text-lg font-bold text-white">🎨 Criador — Jogando</h1>
          <div className="flex gap-2">
            <button onClick={replaySetup} className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded-lg text-sm font-bold">🔄 Replay (R)</button>
            <button onClick={resetToEdit} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm font-bold">✏️ Editar</button>
            <button onClick={onExit} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm font-bold">← Sair</button>
          </div>
        </div>

        {hint && (
          <div className="bg-yellow-500/20 border border-yellow-500/40 rounded-lg px-4 py-2 mb-2 max-w-xl">
            <p className="text-yellow-200 text-sm text-center">💡 {hint}</p>
          </div>
        )}

        {gameState && (
          <div className="flex gap-3 items-start justify-center">
            <div className="flex flex-col gap-2">
              <HeldPiece heldPiece={gameState.heldPiece} canHold={gameState.canHold} />
              <div className="text-white/50 text-[10px] leading-tight">
                ←→ mover<br/>↑ girar<br/>C segurar<br/>Espaço drop<br/>R replay
              </div>
            </div>
            <TetrisBoard
              board={gameState.board}
              currentPiece={gameState.currentPiece}
              dropPreview={dropPreview}
              gameOver={gameState.gameOver}
            />
            <div className="flex flex-col gap-2">
              <NextPieces pieces={gameState.nextPieces || []} />
              <Scoreboard
                score={gameState.score?.points || 0}
                level={gameState.score?.level || 1}
                lines={gameState.score?.lines || 0}
                combo={gameState.score?.combo || 0}
              />
            </div>
          </div>
        )}

        {gameState?.gameOver && (
          <div className="mt-4 flex gap-3">
            <button onClick={replaySetup} className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold text-lg">🔄 Tentar Novamente</button>
            <button onClick={resetToEdit} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold text-lg">✏️ Voltar ao Editor</button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 flex flex-col items-center p-3 overflow-auto">
      <div className="flex justify-between items-center w-full max-w-2xl mb-3">
        <h1 className="text-xl font-bold text-white">🎨 Editor de Setup</h1>
        <div className="flex gap-2">
          <button onClick={() => setShowTemplates(true)} className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg text-sm font-bold">📋 Templates</button>
          <button onClick={onExit} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm font-bold">← Sair</button>
        </div>
      </div>

      <div className="flex gap-4 items-start justify-center flex-wrap max-w-2xl">
        <div className="flex flex-col gap-2">
          <div className="text-white/60 text-xs font-semibold mb-1">TABULEIRO (clique para editar)</div>
          <BoardEditor board={board} onToggle={toggleCell} onFillRow={fillRow} onClearRow={clearRow} />

          <div className="flex gap-1 items-center mt-1">
            <span className="text-white/50 text-xs mr-1">Cor:</span>
            {PIECE_TYPES.map(t => (
              <button
                key={t}
                onClick={() => setSelectedColor(t)}
                className={`w-6 h-6 rounded border-2 transition-all ${selectedColor === t ? 'border-white scale-110' : 'border-white/20'}`}
                style={{ backgroundColor: PIECE_COLORS[t] }}
                title={t}
              />
            ))}
            <button
              onClick={() => setSelectedColor('G')}
              className={`w-6 h-6 rounded border-2 transition-all ${selectedColor === 'G' ? 'border-white scale-110' : 'border-white/20'}`}
              style={{ backgroundColor: PIECE_COLORS.G }}
              title="Cinza"
            />
          </div>

          <div className="flex gap-2 mt-2">
            <button onClick={() => setBoard(emptyBoard())} className="bg-red-700/60 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-semibold">Limpar Tudo</button>
          </div>
        </div>

        <div className="flex flex-col gap-3 min-w-[160px]">
          <div>
            <div className="text-white/60 text-xs font-semibold mb-2">FILA DE PEÇAS</div>
            <div className="flex flex-wrap gap-1 mb-2">
              {PIECE_TYPES.map(t => (
                <button
                  key={t}
                  onClick={() => addToQueue(t)}
                  className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 transition-all"
                  title={`Adicionar ${t}`}
                >
                  <PieceMini type={t} />
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-1 min-h-[60px] bg-black/30 rounded-lg p-2">
              {pieceQueue.length === 0 ? (
                <span className="text-white/30 text-xs text-center py-2">Clique nas peças acima para montar a fila<br/>(vazio = fila aleatória)</span>
              ) : (
                <div className="flex flex-wrap gap-1">
                  {pieceQueue.map((t, i) => (
                    <button
                      key={i}
                      onClick={() => removeFromQueue(i)}
                      className="flex items-center justify-center w-8 h-8 rounded bg-white/10 hover:bg-red-500/30 border border-white/10 transition-all group relative"
                      title="Clique para remover"
                    >
                      <PieceMini type={t} size={10} />
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] rounded-full w-3 h-3 flex items-center justify-center opacity-0 group-hover:opacity-100">×</span>
                    </button>
                  ))}
                </div>
              )}
              {pieceQueue.length > 0 && (
                <button onClick={clearQueue} className="text-red-400 text-[10px] mt-1 hover:text-red-300">Limpar fila</button>
              )}
            </div>
          </div>

          <button
            onClick={startPlay}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-white font-bold text-lg shadow-lg shadow-emerald-500/25 transition-all active:scale-95"
          >
            ▶ Jogar
          </button>

          {hint && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-3 py-2">
              <p className="text-yellow-200 text-xs">💡 {hint}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BoardEditor({ board, onToggle, onFillRow, onClearRow }) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState(null);
  const cellSize = 22;

  const handlePointerDown = (x, y) => {
    setIsDragging(true);
    const willPlace = !board[y][x];
    setDragMode(willPlace ? 'place' : 'erase');
    onToggle(x, y);
  };

  const handlePointerEnter = (x, y) => {
    if (!isDragging) return;
    const hasBlock = !!board[y][x];
    if (dragMode === 'place' && !hasBlock) onToggle(x, y);
    if (dragMode === 'erase' && hasBlock) onToggle(x, y);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    setDragMode(null);
  };

  useEffect(() => {
    window.addEventListener('pointerup', handlePointerUp);
    return () => window.removeEventListener('pointerup', handlePointerUp);
  }, []);

  return (
    <div
      className="relative bg-black/50 rounded-lg border border-white/10 select-none"
      style={{ width: cellSize * BOARD_W + 2, padding: 1 }}
      onContextMenu={e => e.preventDefault()}
    >
      {board.map((row, y) => (
        <div key={y} className="flex" style={{ height: cellSize }}>
          {row.map((cell, x) => (
            <div
              key={x}
              onPointerDown={() => handlePointerDown(x, y)}
              onPointerEnter={() => handlePointerEnter(x, y)}
              className="cursor-pointer border border-white/[0.04] hover:border-white/20 transition-colors"
              style={{
                width: cellSize,
                height: cellSize,
                backgroundColor: cell ? cell.color : 'transparent',
                opacity: cell ? 0.85 : 1,
              }}
            />
          ))}
          <button
            onClick={() => {
              const filled = row.filter(c => c).length;
              if (filled > 0) clearRow(y);
              else {
                const gap = Math.floor(Math.random() * BOARD_W);
                fillRow(y, gap);
              }
            }}
            className="ml-0.5 text-white/20 hover:text-white/60 text-[9px] w-4 flex items-center justify-center"
            title={row.some(c => c) ? 'Limpar linha' : 'Preencher linha'}
          >
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
  const rows = shape.filter(row => row.some(c => c));
  const trimmed = rows.map(row => {
    const first = row.indexOf(1);
    const last = row.lastIndexOf(1);
    return row.slice(Math.max(0, first), last + 1);
  });
  const maxW = Math.max(...trimmed.map(r => r.length));

  return (
    <div className="flex flex-col items-center">
      {trimmed.map((row, y) => (
        <div key={y} className="flex">
          {Array.from({ length: maxW }, (_, x) => (
            <div
              key={x}
              style={{
                width: size,
                height: size,
                backgroundColor: (row[x]) ? color : 'transparent',
                borderRadius: 1,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
