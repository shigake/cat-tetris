import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PIECES } from '../utils/PieceGenerator';
import { GameService } from '../core/services/GameService';
import { PieceFactory, MovementStrategyFactory } from '../patterns/Factory';
import { ScoringService } from '../core/services/ScoringService';
import { Piece } from '../core/entities/Piece';
import { AIOpponentService } from '../core/services/AIOpponentService';
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

const ACTION_LABELS = {
  hold:   { icon: '🔄', key: 'C',      label: 'Hold' },
  rotate: { icon: '↻',  key: '↑',      label: 'Girar' },
  left:   { icon: '←',  key: '←',      label: 'Esq' },
  right:  { icon: '→',  key: '→',      label: 'Dir' },
  down:   { icon: '↓',  key: '↓',      label: 'Baixo' },
  drop:   { icon: '⬇',  key: 'Espaço', label: 'Drop' },
};

const TEMPLATES = [
  {
    id: 'tsd-basic',
    name: 'T-Spin Double',
    emoji: '🌀',
    desc: 'Setup clássico — encaixe o T no buraco',
    board: [
      '..........','..........','..........','..........','..........',
      '..........','..........','..........','..........','..........',
      '..........','..........','..........','..........','..........',
      '..........','..........','..........',
      'GGG..GGGGG',
      'GG..GGGGGG',
    ],
    queue: ['T'],
    hint: 'Gire o T 2x e encaixe na cavidade para T-Spin Double!'
  },
  {
    id: 'tst',
    name: 'T-Spin Triple',
    emoji: '🔥',
    desc: 'Setup avançado de 3 linhas',
    board: [
      '..........','..........','..........','..........','..........',
      '..........','..........','..........','..........','..........',
      '..........','..........','..........','..........','..........',
      '..........','..........',
      'GGG..GGGGG',
      'GG..GGGGGG',
      'GGG.GGGGGG',
    ],
    queue: ['T'],
    hint: 'Gire o T duas vezes para encaixar e limpar 3 linhas!'
  },
  {
    id: 'tsd-left',
    name: 'TSD Esquerda',
    emoji: '🌀',
    desc: 'T-Spin Double espelhado',
    board: [
      '..........','..........','..........','..........','..........',
      '..........','..........','..........','..........','..........',
      '..........','..........','..........','..........','..........',
      '..........','..........','..........',
      'GGGGG..GGG',
      'GGGGGG..GG',
    ],
    queue: ['T'],
    hint: 'Mesmo TSD, mas espelhado na esquerda. Gire o T para encaixar!'
  },
  {
    id: 'tsm',
    name: 'T-Spin Mini',
    emoji: '🎯',
    desc: 'T-Spin Mini — o mais simples',
    board: [
      '..........','..........','..........','..........','..........',
      '..........','..........','..........','..........','..........',
      '..........','..........','..........','..........','..........',
      '..........','..........','..........','..........',
      'GGG.GGGGGG',
    ],
    queue: ['T'],
    hint: 'Gire o T e encaixe no espaço. Limpa 1 linha com T-Spin Mini!'
  },
  {
    id: 'tetris-right',
    name: 'Tetris (4 linhas)',
    emoji: '💎',
    desc: 'Poço na direita para peça I',
    board: [
      '..........','..........','..........','..........','..........',
      '..........','..........','..........','..........','..........',
      '..........','..........','..........','..........','..........',
      '..........',
      'GGGGGGGGG.',
      'GGGGGGGGG.',
      'GGGGGGGGG.',
      'GGGGGGGGG.',
    ],
    queue: ['I'],
    hint: 'Solte a peça I no poço da direita para limpar 4 linhas!'
  },
  {
    id: 'tetris-left',
    name: 'Tetris Esquerda',
    emoji: '💎',
    desc: 'Poço na esquerda para peça I',
    board: [
      '..........','..........','..........','..........','..........',
      '..........','..........','..........','..........','..........',
      '..........','..........','..........','..........','..........',
      '..........',
      '.GGGGGGGGG',
      '.GGGGGGGGG',
      '.GGGGGGGGG',
      '.GGGGGGGGG',
    ],
    queue: ['I'],
    hint: 'Mova a peça I para a esquerda e limpe 4 linhas!'
  },
  {
    id: 'combo-4w',
    name: 'Combo 4-Wide',
    emoji: '⚡',
    desc: '4 colunas vazias para combos',
    board: [
      '..........','..........','..........','..........','..........',
      '..........','..........','..........','..........','..........',
      '..........','..........','..........','..........','..........',
      '..........',
      'GGGGG.GGGG',
      'GGGGG.GGGG',
      'GGGGG.GGGG',
      'GGGGG.GGGG',
    ],
    queue: ['I', 'I', 'I', 'I'],
    hint: 'Solte as peças I na coluna vazia — cada uma gera um combo!'
  },
  {
    id: 'pc-simple',
    name: 'Perfect Clear',
    emoji: '✨',
    desc: 'Limpe 100% do tabuleiro',
    board: [
      '..........','..........','..........','..........','..........',
      '..........','..........','..........','..........','..........',
      '..........','..........','..........','..........','..........',
      '..........','..........','..........',
      'GGGG..GGGG',
      'GGGGGGGGGG',
    ],
    queue: ['O', 'I'],
    hint: 'Coloque o O no buraco, depois use I para limpar tudo!'
  },
  {
    id: 'dsd',
    name: 'Double-Single-Double',
    emoji: '🔁',
    desc: 'Encadeie T-Spins consecutivos',
    board: [
      '..........','..........','..........','..........','..........',
      '..........','..........','..........','..........','..........',
      '..........','..........','..........','..........',
      'GG...GGGGG',
      'GGG..GGGGG',
      'GG..GGGGGG',
      'GGG..GGGGG',
      'GG..GGGGGG',
      'GGG.GGGGGG',
    ],
    queue: ['T', 'T', 'T'],
    hint: 'Encaixe 3 T-Spins seguidos de cima para baixo!'
  },
  {
    id: 'stsd',
    name: 'STSD',
    emoji: '🏆',
    desc: 'Super T-Spin Double — avançado',
    board: [
      '..........','..........','..........','..........','..........',
      '..........','..........','..........','..........','..........',
      '..........','..........','..........','..........','..........',
      '..........','..........',
      '.GG.GGGGGG',
      'GG..GGGGGG',
      'GGG.GGGGGG',
    ],
    queue: ['T', 'T'],
    hint: 'O primeiro T abre espaço para o segundo!'
  },
];

function parseBoard(rows) {
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

function cloneBoard(b) {
  return b.map(r => r.map(c => c ? { ...c } : null));
}

function makeGameService(boardData, queue) {
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
      if (boardData[y][x]) {
        gs.board.setCell(x, y, boardData[y][x]);
      }
    }
  }

  if (queue.length > 0) {
    const makeP = (type) => {
      const cfg = PIECES[type];
      const pos = type === 'I' ? { x: 3, y: -2 } : { x: 3, y: 0 };
      return new Piece(type, cfg.shape, cfg.color, cfg.emoji, pos, false, 0);
    };
    gs.currentPiece = makeP(queue[0]);
    gs.nextPieces = queue.slice(1).map(makeP);
    while (gs.nextPieces.length < 3) {
      gs.nextPieces.push(gs.pieceFactory.createRandomPiece());
    }
  }

  gs._markDirty();
  return gs;
}

export default function CreatorMode({ onExit }) {
  const [screen, setScreen] = useState('menu');
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [isAIDemo, setIsAIDemo] = useState(false);

  const [customBoard, setCustomBoard] = useState(emptyBoard);
  const [customQueue, setCustomQueue] = useState([]);
  const [selectedColor, setSelectedColor] = useState('G');

  const startTemplate = useCallback((tmpl, aiMode) => {
    setActiveTemplate(tmpl);
    setIsAIDemo(aiMode);
    setScreen('play');
  }, []);

  const startCustom = useCallback((aiMode) => {
    setActiveTemplate({
      id: 'custom',
      name: 'Setup Personalizado',
      emoji: '🎨',
      board: null,
      queue: [...customQueue],
      hint: '',
      _rawBoard: cloneBoard(customBoard),
    });
    setIsAIDemo(aiMode);
    setScreen('play');
  }, [customBoard, customQueue]);

  if (screen === 'play' && activeTemplate) {
    return (
      <PlayScreen
        template={activeTemplate}
        aiDemo={isAIDemo}
        onBack={() => setScreen(activeTemplate.id === 'custom' ? 'editor' : 'menu')}
        onExit={onExit}
      />
    );
  }

  if (screen === 'editor') {
    return (
      <EditorScreen
        board={customBoard}
        setBoard={setCustomBoard}
        queue={customQueue}
        setQueue={setCustomQueue}
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
        onPlay={() => startCustom(false)}
        onAIDemo={() => startCustom(true)}
        onBack={() => setScreen('menu')}
        onExit={onExit}
      />
    );
  }

  return (
    <div className="h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 flex flex-col items-center p-4 overflow-auto">
      <div className="flex justify-between items-center w-full max-w-lg mb-4">
        <h1 className="text-2xl font-bold text-white">🎨 Modo Criador</h1>
        <button onClick={onExit} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm font-bold">← Voltar</button>
      </div>

      <p className="text-white/50 text-sm mb-4 text-center max-w-md">
        Pratique setups clássicos ou crie o seu!
      </p>

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setScreen('editor')}
        className="w-full max-w-lg mb-4 p-4 rounded-xl bg-gradient-to-r from-violet-600/30 to-fuchsia-600/30 hover:from-violet-600/40 hover:to-fuchsia-600/40 border border-violet-500/30 hover:border-violet-500/50 transition-all flex items-center gap-4"
      >
        <span className="text-4xl">🛠️</span>
        <div className="text-left">
          <div className="text-white font-bold text-base">Criar Meu Setup</div>
          <div className="text-white/40 text-xs">Monte o tabuleiro e a fila de peças do zero</div>
        </div>
      </motion.button>

      <div className="text-white/40 text-xs font-semibold uppercase tracking-wide mb-3">Templates Prontos</div>

      <div className="grid grid-cols-1 gap-2 w-full max-w-lg">
        {TEMPLATES.map(t => (
          <TemplateCard key={t.id} template={t} onPlay={() => startTemplate(t, false)} onAI={() => startTemplate(t, true)} />
        ))}
      </div>
    </div>
  );
}

function TemplateCard({ template, onPlay, onAI }) {
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
        <div className="flex items-center gap-1.5 mt-1.5">
          <span className="text-white/30 text-[10px]">Peças:</span>
          {template.queue.map((t, i) => (
            <span key={i} className="inline-block w-4 h-4 rounded" style={{ backgroundColor: PIECE_COLORS[t] }} title={t} />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-1.5 shrink-0">
        <button onClick={onPlay} className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors">
          🎮 Jogar
        </button>
        <button onClick={onAI} className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors">
          🤖 IA Demo
        </button>
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

function PlayScreen({ template, aiDemo, onBack, onExit }) {
  const [gameState, setGameState] = useState(null);
  const [playId, setPlayId] = useState(0);
  const [aiActions, setAiActions] = useState([]);
  const [currentAction, setCurrentAction] = useState(null);

  const gsRef = useRef(null);
  const loopRef = useRef(null);
  const lastTimeRef = useRef(0);
  const aiRef = useRef(null);
  const aiTimerRef = useRef(null);

  const boardData = useMemo(() => {
    if (template._rawBoard) return cloneBoard(template._rawBoard);
    return parseBoard(template.board);
  }, [template]);

  const initGame = useCallback(() => {
    if (loopRef.current) cancelAnimationFrame(loopRef.current);
    if (aiTimerRef.current) clearTimeout(aiTimerRef.current);

    const gs = makeGameService(boardData, template.queue);
    gsRef.current = gs;
    setGameState(gs.getGameState());
    setAiActions([]);
    setCurrentAction(null);
    lastTimeRef.current = 0;
    setPlayId(p => p + 1);

    if (aiDemo) {
      const ai = new AIOpponentService();
      ai.setDifficulty('hard');
      ai.setVisualMode(true);
      aiRef.current = ai;
    }
  }, [boardData, template.queue, aiDemo]);

  useEffect(() => { initGame(); }, [initGame]);

  useEffect(() => {
    const loop = (t) => {
      if (!lastTimeRef.current) lastTimeRef.current = t;
      const dt = t - lastTimeRef.current;
      lastTimeRef.current = t;
      const gs = gsRef.current;
      if (!gs) return;
      if (!gs.gameOver && !gs.isPaused) gs.updateGame(dt);
      if (gs.isDirty) {
        setGameState(gs.getGameState());
        gs.clearDirty();
      }
      loopRef.current = requestAnimationFrame(loop);
    };
    loopRef.current = requestAnimationFrame(loop);
    return () => { if (loopRef.current) cancelAnimationFrame(loopRef.current); };
  }, [playId]);

  useEffect(() => {
    if (!aiDemo) return;
    const AI_STEP_DELAY = 300;
    let cancelled = false;

    const step = () => {
      if (cancelled) return;
      const gs = gsRef.current;
      const ai = aiRef.current;
      if (!gs || !ai || gs.gameOver) return;

      const state = gs.getGameState();
      const action = ai.decideNextMove(state);
      if (action) {
        setCurrentAction(action.action);
        setAiActions(prev => {
          const next = [...prev, action.action];
          return next.length > 12 ? next.slice(-12) : next;
        });

        switch (action.action) {
          case 'left': gs.movePiece('left'); break;
          case 'right': gs.movePiece('right'); break;
          case 'down': gs.movePiece('down'); break;
          case 'rotate': gs.rotatePiece(); break;
          case 'hold': gs.holdPiece(); break;
          case 'drop': gs.hardDrop(); break;
        }

        setTimeout(() => { if (!cancelled) setCurrentAction(null); }, 200);
      }

      aiTimerRef.current = setTimeout(step, AI_STEP_DELAY);
    };

    aiTimerRef.current = setTimeout(step, 600);
    return () => { cancelled = true; if (aiTimerRef.current) clearTimeout(aiTimerRef.current); };
  }, [aiDemo, playId]);

  useEffect(() => {
    if (aiDemo) return;
    const handle = (e) => {
      const gs = gsRef.current;
      if (!gs || gs.gameOver) return;
      switch (e.key) {
        case 'ArrowLeft': e.preventDefault(); gs.movePiece('left'); break;
        case 'ArrowRight': e.preventDefault(); gs.movePiece('right'); break;
        case 'ArrowDown': e.preventDefault(); gs.movePiece('down'); break;
        case 'ArrowUp': e.preventDefault(); gs.rotatePiece(); break;
        case 'z': case 'Z': gs.rotatePiece('left'); break;
        case 'c': case 'C': case 'Shift': gs.holdPiece(); break;
        case ' ': e.preventDefault(); gs.hardDrop(); break;
        case 'r': case 'R': initGame(); break;
      }
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [aiDemo, initGame]);

  const dropPreview = useMemo(() => {
    if (!gameState?.currentPiece || gameState?.gameOver) return null;
    try { return gsRef.current?.getDropPreview(); } catch { return null; }
  }, [gameState?.currentPiece?.position?.x, gameState?.currentPiece?.position?.y,
      gameState?.currentPiece?.type, gameState?.currentPiece?.rotationState]);

  return (
    <div className="h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 flex flex-col items-center p-2 overflow-hidden">
      <div className="flex justify-between items-center w-full max-w-xl mb-2">
        <h1 className="text-lg font-bold text-white truncate">
          {template.emoji} {template.name} {aiDemo && <span className="text-blue-400 text-sm ml-1">— IA Demo</span>}
        </h1>
        <div className="flex gap-2">
          <button onClick={initGame} className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded-lg text-xs font-bold">🔄 Replay</button>
          <button onClick={onBack} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-xs font-bold">← Voltar</button>
          <button onClick={onExit} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-xs font-bold">Sair</button>
        </div>
      </div>

      {template.hint && (
        <div className="bg-yellow-500/15 border border-yellow-500/30 rounded-lg px-4 py-1.5 mb-2 max-w-xl">
          <p className="text-yellow-200 text-xs text-center">💡 {template.hint}</p>
        </div>
      )}

      {gameState && (
        <div className="flex gap-3 items-start justify-center">
          <div className="flex flex-col gap-2">
            <HeldPiece heldPiece={gameState.heldPiece} canHold={gameState.canHold} />
            {!aiDemo && (
              <div className="text-white/50 text-[10px] leading-tight">
                ←→ mover<br/>↑ girar<br/>C hold<br/>Espaço drop<br/>R replay
              </div>
            )}
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

      {aiDemo && (
        <div className="mt-3 w-full max-w-md">
          <div className="text-white/40 text-[10px] font-semibold uppercase tracking-wide mb-1.5 text-center">Botões da IA</div>
          <div className="flex justify-center gap-1.5 mb-2">
            {['hold', 'left', 'right', 'rotate', 'drop'].map(a => {
              const info = ACTION_LABELS[a];
              const isActive = currentAction === a;
              return (
                <div key={a} className={`flex flex-col items-center px-2.5 py-1.5 rounded-lg border transition-all duration-150 ${
                  isActive
                    ? 'bg-yellow-400/30 border-yellow-400/60 scale-110'
                    : 'bg-white/[0.04] border-white/[0.08]'
                }`}>
                  <span className={`text-lg ${isActive ? 'text-yellow-300' : 'text-white/60'}`}>{info.icon}</span>
                  <span className={`text-[9px] font-bold ${isActive ? 'text-yellow-200' : 'text-white/30'}`}>{info.key}</span>
                </div>
              );
            })}
          </div>
          <div className="flex flex-wrap justify-center gap-0.5">
            {aiActions.map((a, i) => {
              const info = ACTION_LABELS[a];
              return (
                <span key={i} className={`text-[10px] px-1.5 py-0.5 rounded ${
                  i === aiActions.length - 1
                    ? 'bg-yellow-500/30 text-yellow-200 font-bold'
                    : 'bg-white/[0.05] text-white/30'
                }`}>{info?.key || a}</span>
              );
            })}
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

function EditorScreen({ board, setBoard, queue, setQueue, selectedColor, setSelectedColor, onPlay, onAIDemo, onBack, onExit }) {

  const toggleCell = useCallback((x, y) => {
    setBoard(prev => {
      const nb = prev.map(r => [...r]);
      if (nb[y][x]) {
        nb[y][x] = null;
      } else {
        nb[y][x] = { type: selectedColor, color: PIECE_COLORS[selectedColor], emoji: '⬜' };
      }
      return nb;
    });
  }, [selectedColor, setBoard]);

  const fillRow = useCallback((y, gap) => {
    setBoard(prev => {
      const nb = prev.map(r => [...r]);
      for (let x = 0; x < BOARD_W; x++) {
        nb[y][x] = x === gap ? null : { type: 'G', color: PIECE_COLORS.G, emoji: '⬜' };
      }
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

          <button onClick={() => setBoard(emptyBoard())} className="bg-red-700/60 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-semibold mt-1 w-fit">Limpar Tudo</button>
        </div>

        <div className="flex flex-col gap-3 min-w-[160px]">
          <div>
            <div className="text-white/60 text-xs font-semibold mb-2">FILA DE PEÇAS</div>
            <div className="flex flex-wrap gap-1 mb-2">
              {PIECE_TYPES.map(t => (
                <button
                  key={t}
                  onClick={() => setQueue(q => [...q, t])}
                  className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 transition-all"
                  title={`Adicionar ${t}`}
                >
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
                    <button
                      key={i}
                      onClick={() => setQueue(q => q.filter((_, j) => j !== i))}
                      className="flex items-center justify-center w-8 h-8 rounded bg-white/10 hover:bg-red-500/30 border border-white/10 transition-all group relative"
                      title="Remover"
                    >
                      <PieceMini type={t} size={10} />
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] rounded-full w-3 h-3 flex items-center justify-center opacity-0 group-hover:opacity-100">×</span>
                    </button>
                  ))}
                </div>
              )}
              {queue.length > 0 && (
                <button onClick={() => setQueue([])} className="text-red-400 text-[10px] mt-1 hover:text-red-300">Limpar fila</button>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={onPlay}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-white font-bold text-base shadow-lg shadow-emerald-500/25 transition-all active:scale-95"
            >
              🎮 Jogar
            </button>
            <button
              onClick={onAIDemo}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all active:scale-95"
            >
              🤖 IA Demo
            </button>
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

  const handlePointerDown = (x, y) => {
    setIsDragging(true);
    setDragMode(!board[y][x] ? 'place' : 'erase');
    onToggle(x, y);
  };

  const handlePointerEnter = (x, y) => {
    if (!isDragging) return;
    const hasBlock = !!board[y][x];
    if (dragMode === 'place' && !hasBlock) onToggle(x, y);
    if (dragMode === 'erase' && hasBlock) onToggle(x, y);
  };

  const handlePointerUp = () => { setIsDragging(false); setDragMode(null); };

  useEffect(() => {
    window.addEventListener('pointerup', handlePointerUp);
    return () => window.removeEventListener('pointerup', handlePointerUp);
  }, []);

  return (
    <div className="relative bg-black/50 rounded-lg border border-white/10 select-none" style={{ width: cellSize * BOARD_W + 2, padding: 1 }} onContextMenu={e => e.preventDefault()}>
      {board.map((row, y) => (
        <div key={y} className="flex" style={{ height: cellSize }}>
          {row.map((cell, x) => (
            <div
              key={x}
              onPointerDown={() => handlePointerDown(x, y)}
              onPointerEnter={() => handlePointerEnter(x, y)}
              className="cursor-pointer border border-white/[0.04] hover:border-white/20 transition-colors"
              style={{ width: cellSize, height: cellSize, backgroundColor: cell ? cell.color : 'transparent', opacity: cell ? 0.85 : 1 }}
            />
          ))}
          <button
            onClick={() => {
              if (row.some(c => c)) onClearRow(y);
              else onFillRow(y, Math.floor(Math.random() * BOARD_W));
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
            <div key={x} style={{ width: size, height: size, backgroundColor: row[x] ? color : 'transparent', borderRadius: 1 }} />
          ))}
        </div>
      ))}
    </div>
  );
}
