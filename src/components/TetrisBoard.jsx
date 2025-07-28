import React from 'react';
import { motion } from 'framer-motion';
import { getPieceColor } from '../utils/PieceGenerator';

const TetrisBoard = ({ board, currentPiece, gameOver }) => {
  // Função para renderizar uma célula
  const renderCell = (cell, x, y) => {
    // Verificar se há uma peça atual nesta posição
    let currentPieceCell = null;
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

    if (currentPieceCell) {
      return (
        <motion.div
          key={`${x}-${y}`}
          initial={{ scale: 0.8, opacity: 0.7 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="cat-block tetris-cell rounded-sm flex items-center justify-center text-sm font-bold border-2 border-white/50"
          style={{
            '--cat-color': getPieceColor(currentPieceCell.color),
            '--cat-color-light': getPieceColor(currentPieceCell.color) + '80',
            backgroundColor: getPieceColor(currentPieceCell.color),
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
          }}
        >
          <span className="text-xs">{currentPieceCell.emoji}</span>
        </motion.div>
      );
    }

    if (cell) {
      return (
        <motion.div
          key={`${x}-${y}`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
          className="cat-block tetris-cell rounded-sm flex items-center justify-center text-sm font-bold"
          style={{
            '--cat-color': getPieceColor(cell.color),
            '--cat-color-light': getPieceColor(cell.color) + '80',
            backgroundColor: getPieceColor(cell.color),
            borderColor: 'rgba(255, 255, 255, 0.5)',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
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
        {/* Grid do tabuleiro */}
        <div className="relative">
          <div className="tetris-grid">
            {board.map((row, y) =>
              row.map((cell, x) => renderCell(cell, x, y))
            )}
          </div>
          
          {/* Overlay de Game Over */}
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
      
      {/* Instruções */}
      <div className="mt-4 text-center text-white/70 text-sm">
        <p>Use as setas para mover e girar</p>
        <p>Espaço para drop instantâneo</p>
        <p>Shift para guardar peça</p>
      </div>
    </div>
  );
};

export default TetrisBoard; 