import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getPieceColor } from '../utils/PieceGenerator';
import { gameEvents } from '../patterns/Observer.js';
import ParticleEffect from './ParticleEffect';

const TetrisBoard = ({ board, currentPiece, dropPreview, gameOver }) => {
  const [clearingLines, setClearingLines] = useState([]);
  const [tSpinEffect, setTSpinEffect] = useState(false);
  const [particleEffect, setParticleEffect] = useState({ isActive: false, position: { x: 0, y: 0 } });

  // Debug: Log current piece changes (simplified)
  useEffect(() => {
    if (currentPiece) {
      console.log('🎮 TetrisBoard updated - Piece:', currentPiece.type, 'at', currentPiece.position);
    }
  }, [currentPiece]);

  useEffect(() => {
    const checkForClearingLines = () => {
      const linesToClear = [];
      
      for (let y = 0; y < board.length; y++) {
        if (board[y] && board[y].every(cell => cell !== null)) {
          linesToClear.push(y);
        }
      }
      
      if (linesToClear.length > 0) {
        setClearingLines(linesToClear);
        
        setTimeout(() => {
          setClearingLines([]);
        }, 1000);
      }
    };

    checkForClearingLines();
  }, [board]);

  useEffect(() => {
    const handleTSpin = () => {
      setTSpinEffect(true);
      setTimeout(() => {
        setTSpinEffect(false);
      }, 1500);
    };

    gameEvents.on('t_spin', handleTSpin);
    return () => gameEvents.off('t_spin', handleTSpin);
  }, []);

  useEffect(() => {
    const handleLineClear = (data) => {
      if (data.linesCleared > 0) {
        setParticleEffect({
          isActive: true,
          position: { x: 100, y: 200 }
        });
        
        setTimeout(() => {
          setParticleEffect({ isActive: false, position: { x: 0, y: 0 } });
        }, 1500);
      }
    };

    gameEvents.on('line_cleared', handleLineClear);
    return () => gameEvents.off('line_cleared', handleLineClear);
  }, []);

  const renderCell = (cell, x, y) => {
    let currentPieceCell = null;
    let dropPreviewCell = null;
    const isClearing = clearingLines.includes(y);

    if (currentPiece) {
      const pieceX = currentPiece.position.x;
      const pieceY = currentPiece.position.y;
      
      for (let py = 0; py < currentPiece.shape.length; py++) {
        for (let px = 0; px < currentPiece.shape[py].length; px++) {
          if (currentPiece.shape[py][px] && 
              pieceX + px === x && pieceY + py === y) {
            currentPieceCell = currentPiece;
            break;
          }
        }
        if (currentPieceCell) break;
      }
    }

    if (dropPreview && dropPreview !== currentPiece) {
      const previewX = dropPreview.position.x;
      const previewY = dropPreview.position.y;
      
      for (let py = 0; py < dropPreview.shape.length; py++) {
        for (let px = 0; px < dropPreview.shape[py].length; px++) {
          if (dropPreview.shape[py][px] && 
              previewX + px === x && previewY + py === y) {
            dropPreviewCell = dropPreview;
            break;
          }
        }
        if (dropPreviewCell) break;
      }
    }

    if (currentPieceCell) {
      return (
        <div
          key={`current-${currentPieceCell.type}-${x}-${y}`}
          className="cat-block tetris-cell rounded-sm flex items-center justify-center text-sm font-bold border-2 border-white/50"
          style={{
            '--cat-color': getPieceColor(currentPieceCell.color),
            '--cat-color-light': getPieceColor(currentPieceCell.color) + '80',
            backgroundColor: getPieceColor(currentPieceCell.color),
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
          }}
        >
          <span className="text-xs">{currentPieceCell.emoji}</span>
        </div>
      );
    }

    if (dropPreviewCell) {
      return (
        <div
          key={`${x}-${y}`}
          className="tetris-cell rounded-sm flex items-center justify-center text-sm font-bold border-2 border-dashed border-white/30"
          style={{
            backgroundColor: getPieceColor(dropPreviewCell.color) + '20',
            boxShadow: 'inset 0 0 10px rgba(255, 255, 255, 0.1)'
          }}
        >
          <span className="text-xs opacity-50">{dropPreviewCell.emoji}</span>
        </div>
      );
    }

    if (cell) {
      return (
        <motion.div
          key={`${x}-${y}`}
          initial={{ scale: 0 }}
          animate={{ 
            scale: isClearing ? [1, 1.3, 0.8, 1] : 1,
            opacity: isClearing ? [1, 0.5, 1] : 1,
            rotate: isClearing ? [0, 5, -5, 0] : 0
          }}
          transition={{ 
            duration: isClearing ? 1 : 0.2,
            ease: "easeInOut",
            times: isClearing ? [0, 0.3, 0.7, 1] : undefined
          }}
          className="cat-block tetris-cell rounded-sm flex items-center justify-center text-sm font-bold"
          style={{
            '--cat-color': getPieceColor(cell.color),
            '--cat-color-light': getPieceColor(cell.color) + '80',
            backgroundColor: isClearing ? '#ffff00' : getPieceColor(cell.color),
            borderColor: 'rgba(255, 255, 255, 0.5)',
            boxShadow: isClearing 
              ? '0 0 30px rgba(255, 255, 0, 1), 0 0 60px rgba(255, 255, 0, 0.8), 0 2px 4px rgba(0, 0, 0, 0.3)'
              : '0 2px 4px rgba(0, 0, 0, 0.3)',
            zIndex: isClearing ? 10 : 1
          }}
        >
          <span className="text-xs">{cell.emoji}</span>
        </motion.div>
      );
    }
    
    return (
      <div
        key={`${x}-${y}`}
        className="tetris-cell border border-gray-300/20 rounded-sm bg-gray-100/10"
      />
    );
  };

  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative bg-gray-900/50 p-4 rounded-xl border-2 border-white/20 shadow-2xl"
      >
        <div className="relative">
          <div className="tetris-grid">
            {board.map((row, y) =>
              row.map((cell, x) => renderCell(cell, x, y))
            )}
          </div>
          
          {clearingLines.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1 }}
              className="absolute inset-0 pointer-events-none"
            >
              {clearingLines.map((lineY, index) => (
                <motion.div
                  key={`clearing-${lineY}`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0]
                  }}
                  transition={{ 
                    duration: 1,
                    delay: index * 0.1
                  }}
                  className="absolute left-0 right-0 h-5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"
                  style={{
                    top: `${lineY * 20}px`,
                    transform: 'translateY(-2px)',
                    boxShadow: '0 0 20px rgba(255, 255, 0, 0.8)',
                    zIndex: 20
                  }}
                />
              ))}
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.3, 0] }}
                transition={{ duration: 1 }}
                className="absolute inset-0 bg-yellow-400/20"
                style={{ zIndex: 15 }}
              />
            </motion.div>
          )}
          
          <ParticleEffect 
            isActive={particleEffect.isActive} 
            position={particleEffect.position} 
          />
          
          {tSpinEffect && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0, 1.2, 0]
              }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 pointer-events-none flex items-center justify-center"
              style={{ zIndex: 30 }}
            >
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.5, 1]
                }}
                transition={{ 
                  duration: 1.5,
                  ease: "easeInOut"
                }}
                className="text-6xl font-bold text-purple-400 drop-shadow-lg"
                style={{
                  textShadow: '0 0 20px rgba(168, 85, 247, 0.8)'
                }}
              >
                T-SPIN!
              </motion.div>
            </motion.div>
          )}
          
          {gameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-red-500/20 flex items-center justify-center rounded-lg"
            >
              <div className="text-center">
                <div className="text-4xl mb-2">😿</div>
                <div className="text-white font-bold text-lg">Game Over!</div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
      
      <div className="mt-4 text-center text-white/70 text-sm">
        <p>Use as setas para mover e girar</p>
        <p>Espaço para drop instantâneo</p>
        <p>Shift para guardar peça</p>
      </div>
    </div>
  );
};

export default TetrisBoard; 