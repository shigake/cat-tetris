import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TetrisBoard from './components/TetrisBoard';
import Scoreboard from './components/Scoreboard';
import Controls from './components/Controls';
import GameOverScreen from './components/GameOverScreen';
import NextPieces from './components/NextPieces';
import HeldPiece from './components/HeldPiece';
import ErrorBoundary from './components/ErrorBoundary';
import { createEmptyBoard, checkGameOver, getLevel, getDropTime } from './utils/GameLogic';
import { generateRandomPiece, generateNextPieces } from './utils/PieceGenerator';
import useSound from 'use-sound';
import { createMockSound } from './utils/soundUtils';

function App() {
  // Estados do jogo
  const [board, setBoard] = useState(createEmptyBoard());
  const [currentPiece, setCurrentPiece] = useState(null);
  const [nextPieces, setNextPieces] = useState([]);
  const [heldPiece, setHeldPiece] = useState(null);
  const [canHold, setCanHold] = useState(true);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lines, setLines] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [combo, setCombo] = useState(0);
  const [dropTime, setDropTime] = useState(1000);
  const [lastDropTime, setLastDropTime] = useState(0);

  // Refs
  const gameLoopRef = useRef();
  const lastTimeRef = useRef(0);

  // Sons (usando sons simulados por padrão)
  const [playMeow] = useSound('/sounds/meow.mp3', { volume: 0.5 }, { 
    onloaderror: () => console.log('Som de miado não encontrado, usando simulado')
  });
  const [playLineClear] = useSound('/sounds/line-clear.mp3', { volume: 0.7 }, {
    onloaderror: () => console.log('Som de linha não encontrado, usando simulado')
  });
  const [playGameOver] = useSound('/sounds/game-over.mp3', { volume: 0.8 }, {
    onloaderror: () => console.log('Som de game over não encontrado, usando simulado')
  });

  // Inicializar o jogo
  const initializeGame = useCallback(() => {
    setBoard(createEmptyBoard());
    setScore(0);
    setLevel(1);
    setLines(0);
    setGameOver(false);
    setIsPaused(false);
    setIsPlaying(true);
    setCombo(0);
    setDropTime(1000);
    setHeldPiece(null);
    setCanHold(true);
    
    const initialPiece = generateRandomPiece();
    setCurrentPiece(initialPiece);
    setNextPieces(generateNextPieces(3));
  }, []);

  // Função para obter a próxima peça
  const getNextPiece = useCallback(() => {
    const newPieces = [...nextPieces];
    const nextPiece = newPieces.shift();
    newPieces.push(generateRandomPiece());
    setNextPieces(newPieces);
    return nextPiece;
  }, [nextPieces]);

  // Função para guardar peça (hold)
  const holdPiece = useCallback(() => {
    if (!currentPiece || !canHold || gameOver || isPaused) return;

    if (heldPiece) {
      // Trocar peça atual pela guardada
      const newHeldPiece = { ...currentPiece, position: { x: 3, y: 0 } };
      setHeldPiece(newHeldPiece);
      setCurrentPiece({ ...heldPiece, position: { x: 3, y: 0 } });
    } else {
      // Guardar peça atual e pegar próxima
      setHeldPiece({ ...currentPiece, position: { x: 3, y: 0 } });
      const nextPiece = getNextPiece();
      setCurrentPiece(nextPiece);
    }
    
    setCanHold(false);
  }, [currentPiece, heldPiece, canHold, gameOver, isPaused, getNextPiece]);

  // Função para verificar e limpar linhas
  const checkAndClearLines = useCallback(() => {
    setBoard(prevBoard => {
      const newBoard = [];
      let linesCleared = 0;
      
      for (let y = 0; y < prevBoard.length; y++) {
        const isLineFull = prevBoard[y].every(cell => cell !== 0);
        
        if (isLineFull) {
          linesCleared++;
        } else {
          newBoard.push([...prevBoard[y]]);
        }
      }
      
      // Adicionar linhas vazias no topo
      while (newBoard.length < 20) {
        newBoard.unshift(Array(10).fill(0));
      }
      
      // Atualizar pontuação e combo
      if (linesCleared > 0) {
        playLineClear();
        setLines(prev => prev + linesCleared);
        setCombo(prev => prev + 1);
        
        // Calcular pontuação
        const baseScores = { 1: 100, 2: 300, 3: 500, 4: 800 };
        const baseScore = baseScores[linesCleared] || 0;
        const comboBonus = combo * 50;
        const totalScore = (baseScore * level) + comboBonus;
        
        setScore(prev => prev + totalScore);
      } else {
        setCombo(0);
      }
      
      return newBoard;
    });
  }, [level, combo, playLineClear]);

  // Função auxiliar para colocar peça no tabuleiro
  const placePieceOnBoard = useCallback((piece) => {
    if (!piece) return;

    setBoard(prevBoard => {
      const newBoard = prevBoard.map(row => [...row]);
      
      piece.shape.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell) {
            const boardX = piece.position.x + x;
            const boardY = piece.position.y + y;
            if (boardX >= 0 && boardX < 10 && boardY >= 0 && boardY < 20) {
              newBoard[boardY][boardX] = {
                type: piece.type,
                color: piece.color,
                emoji: piece.emoji
              };
            }
          }
        });
      });
      
      return newBoard;
    });

    // Tocar som de miado
    playMeow();

    // Verificar linhas completas
    setTimeout(() => {
      checkAndClearLines();
    }, 100);

    // Obter próxima peça
    const nextPiece = getNextPiece();
    setCurrentPiece(nextPiece);
    setCanHold(true);

    // Verificar game over
    setTimeout(() => {
      setBoard(currentBoard => {
        const isGameOver = checkGameOver(currentBoard);
        if (isGameOver) {
          setGameOver(true);
          setIsPlaying(false);
          playGameOver();
        }
        return currentBoard;
      });
    }, 100);
  }, [getNextPiece, playMeow, checkAndClearLines, checkGameOver, playGameOver]);

  // Função para mover peça
  const movePiece = useCallback((direction) => {
    if (!currentPiece || gameOver || isPaused) return;

    setCurrentPiece(prevPiece => {
      if (!prevPiece) return prevPiece;
      
      const newX = prevPiece.position.x + (direction === 'left' ? -1 : direction === 'right' ? 1 : 0);
      const newY = prevPiece.position.y + (direction === 'down' ? 1 : 0);
      
      // Verificar colisão
      const canMove = prevPiece.shape.every((row, y) =>
        row.every((cell, x) => {
          if (!cell) return true;
          const boardX = newX + x;
          const boardY = newY + y;
          return boardX >= 0 && boardX < 10 && boardY >= 0 && boardY < 20 && !board[boardY][boardX];
        })
      );
      
      if (canMove) {
        return { ...prevPiece, position: { x: newX, y: newY } };
      }
      
      // Se não pode mover para baixo, colocar a peça
      if (direction === 'down') {
        placePieceOnBoard(prevPiece);
        return null;
      }
      
      return prevPiece;
    });
  }, [currentPiece, gameOver, isPaused, board, placePieceOnBoard]);

  // Função para rotacionar peça
  const rotatePiece = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return;

    setCurrentPiece(prevPiece => {
      if (!prevPiece) return prevPiece;
      
      // Rotacionar a matriz da peça
      const rotated = prevPiece.shape[0].map((_, index) =>
        prevPiece.shape.map(row => row[index]).reverse()
      );
      
      // Verificar se a rotação é válida
      const canRotate = rotated.every((row, y) =>
        row.every((cell, x) => {
          if (!cell) return true;
          const boardX = prevPiece.position.x + x;
          const boardY = prevPiece.position.y + y;
          return boardX >= 0 && boardX < 10 && boardY >= 0 && boardY < 20 && !board[boardY][boardX];
        })
      );
      
      if (canRotate) {
        return { ...prevPiece, shape: rotated };
      }
      
      return prevPiece;
    });
  }, [currentPiece, gameOver, isPaused, board]);

  // Função para hard drop
  const hardDrop = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return;

    let droppedPiece = { ...currentPiece };
    let dropDistance = 0;
    
    while (true) {
      const newY = droppedPiece.position.y + 1;
      const canDrop = droppedPiece.shape.every((row, y) =>
        row.every((cell, x) => {
          if (!cell) return true;
          const boardX = droppedPiece.position.x + x;
          const boardY = newY + y;
          return boardX >= 0 && boardX < 10 && boardY >= 0 && boardY < 20 && !board[boardY][boardX];
        })
      );
      
      if (canDrop) {
        droppedPiece.position.y = newY;
        dropDistance++;
      } else {
        break;
      }
    }
    
    // Adicionar pontos pelo hard drop
    setScore(prev => prev + dropDistance * 2);
    
    placePieceOnBoard(droppedPiece);
  }, [currentPiece, gameOver, isPaused, board, placePieceOnBoard]);

  // Game loop
  useEffect(() => {
    if (!isPlaying || gameOver || isPaused) {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = null;
      }
      return;
    }

    const gameLoop = (currentTime) => {
      if (currentTime - lastTimeRef.current > dropTime) {
        movePiece('down');
        lastTimeRef.current = currentTime;
      }
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    };
  }, [isPlaying, gameOver, isPaused, dropTime, movePiece]);

  // Atualizar nível e velocidade
  useEffect(() => {
    const newLevel = getLevel(score);
    if (newLevel !== level) {
      setLevel(newLevel);
      setDropTime(getDropTime(newLevel));
    }
  }, [score, level]);

  // Controles de teclado
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameOver) return;

      switch (e.code) {
        case 'ArrowLeft':
          e.preventDefault();
          movePiece('left');
          break;
        case 'ArrowRight':
          e.preventDefault();
          movePiece('right');
          break;
        case 'ArrowDown':
          e.preventDefault();
          movePiece('down');
          break;
        case 'ArrowUp':
          e.preventDefault();
          rotatePiece();
          break;
        case 'Space':
          e.preventDefault();
          hardDrop();
          break;
        case 'KeyP':
          e.preventDefault();
          setIsPaused(prev => !prev);
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          e.preventDefault();
          holdPiece();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameOver, movePiece, rotatePiece, hardDrop]);

  // Inicializar jogo na montagem
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Verificação de segurança para evitar travamento
  useEffect(() => {
    const safetyCheck = setInterval(() => {
      if (isPlaying && !gameOver && !isPaused && !currentPiece) {
        console.warn('Jogo travado - reiniciando...');
        initializeGame();
      }
    }, 5000); // Verificar a cada 5 segundos

    return () => clearInterval(safetyCheck);
  }, [isPlaying, gameOver, isPaused, currentPiece, initializeGame]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen cat-bg flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="game-container rounded-2xl p-6 shadow-2xl"
        >
        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-6xl font-cat font-bold text-white mb-2">
            🐱 Cat Tetris 🐱
          </h1>
          <p className="text-white/80 text-lg">Jogue com seus amigos felinos!</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start justify-center">
          {/* Layout Desktop: Esquerda | Centro | Direita */}
          <div className="hidden lg:flex lg:flex-row gap-6 items-start justify-center w-full">
            {/* Painel esquerdo - Peças */}
            <div className="flex flex-col gap-6 min-w-[200px]">
              <HeldPiece 
                heldPiece={heldPiece}
                canHold={canHold}
              />
              
              <NextPieces pieces={nextPieces} />
            </div>

            {/* Área central do jogo */}
            <div className="flex flex-col items-center">
              <TetrisBoard 
                board={board} 
                currentPiece={currentPiece}
                gameOver={gameOver}
              />
              
              <Controls 
                onMove={movePiece}
                onRotate={rotatePiece}
                onHardDrop={hardDrop}
                onPause={() => setIsPaused(prev => !prev)}
                onHold={holdPiece}
                isPaused={isPaused}
                gameOver={gameOver}
                canHold={canHold}
              />
            </div>

            {/* Painel direito - Pontuação */}
            <div className="flex flex-col gap-6 min-w-[200px]">
              <Scoreboard 
                score={score}
                level={level}
                lines={lines}
                combo={combo}
              />
            </div>
          </div>

          {/* Layout Mobile: Centro | Pontuação | Peças */}
          <div className="lg:hidden flex flex-col gap-6 items-center">
            {/* Área central do jogo */}
            <div className="flex flex-col items-center">
              <TetrisBoard 
                board={board} 
                currentPiece={currentPiece}
                gameOver={gameOver}
              />
              
              <Controls 
                onMove={movePiece}
                onRotate={rotatePiece}
                onHardDrop={hardDrop}
                onPause={() => setIsPaused(prev => !prev)}
                onHold={holdPiece}
                isPaused={isPaused}
                gameOver={gameOver}
                canHold={canHold}
              />
            </div>

            {/* Pontuação e Peças em linha no mobile */}
            <div className="flex flex-row gap-3 justify-center max-w-full overflow-x-auto">
              <Scoreboard 
                score={score}
                level={level}
                lines={lines}
                combo={combo}
              />
              
              <div className="flex flex-col gap-3">
                <HeldPiece 
                  heldPiece={heldPiece}
                  canHold={canHold}
                />
                
                <NextPieces pieces={nextPieces} />
              </div>
            </div>
          </div>
        </div>

        {/* Tela de Game Over */}
        <AnimatePresence>
          {gameOver && (
            <GameOverScreen 
              score={score}
              onRestart={initializeGame}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
    </ErrorBoundary>
  );
}

export default App; 