import React from 'react';
import { motion } from 'framer-motion';
import { getPieceColor } from '../utils/PieceGenerator';

const NextPieces = ({ pieces }) => {
  const renderPiece = (piece, index) => {
    if (!piece) return null;

    return (
      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.1 }}
        className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20"
      >
        <div className="text-center mb-2">
          <span className="text-sm text-white/80">Próxima {index + 1}</span>
        </div>
        
        <div className="flex justify-center">
          <div className="grid gap-0.5" style={{
            gridTemplateColumns: `repeat(${piece.shape[0].length}, 1fr)`
          }}>
            {piece.shape.map((row, y) =>
              row.map((cell, x) => (
                <div
                  key={`${x}-${y}`}
                  className={`w-4 h-4 rounded-sm flex items-center justify-center text-xs ${
                    cell ? 'cat-block' : 'bg-transparent'
                  }`}
                  style={{
                    '--cat-color': getPieceColor(piece.color),
                    '--cat-color-light': getPieceColor(piece.color) + '80',
                    backgroundColor: cell ? getPieceColor(piece.color) : 'transparent',
                    border: cell ? '1px solid rgba(255, 255, 255, 0.3)' : 'none'
                  }}
                >
                  {cell && <span className="text-xs">{piece.emoji}</span>}
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="text-center mt-2">
          <span className="text-xs text-white/60 font-cat">
            {piece.name}
          </span>
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white/10 backdrop-blur-sm rounded-xl p-3 lg:p-4 border border-white/20"
    >
      <h2 className="text-lg lg:text-xl font-cat font-bold text-white mb-3 lg:mb-4 text-center">
        🎯 Próximas Peças
      </h2>
      
      <div className="space-y-2 lg:space-y-3">
        {pieces.map((piece, index) => renderPiece(piece, index))}
      </div>
      
      {/* Dica */}
      <div className="mt-4 text-center">
        <p className="text-xs text-white/50">
          💡 Planeje suas jogadas com antecedência!
        </p>
      </div>
    </motion.div>
  );
};

export default NextPieces; 