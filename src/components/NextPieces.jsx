import React from 'react';
import { motion } from 'framer-motion';
import { getPieceColor } from '../utils/PieceGenerator';

const NextPieces = ({ pieces }) => {
  const renderPiece = (piece, index) => {
    if (!piece) return null;

    const maxWidth = Math.max(...piece.shape.map(row => row.length));
    const maxHeight = piece.shape.length;

    return (
      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        className="bg-gray-800/50 p-3 rounded-lg border border-white/20"
      >
        <div className="text-center mb-3">
          <span className="text-xs text-white/70 font-medium">Próxima {index + 1}</span>
        </div>
        
        <div className="flex justify-center">
          <div 
            className="grid gap-1" 
            style={{
              gridTemplateColumns: `repeat(${maxWidth}, 1fr)`,
              gridTemplateRows: `repeat(${maxHeight}, 1fr)`
            }}
          >
            {piece.shape.map((row, y) =>
              row.map((cell, x) => (
                <div
                  key={`${x}-${y}`}
                  className={`w-5 h-5 rounded-sm flex items-center justify-center ${
                    cell ? 'border border-white/40 shadow-sm' : ''
                  }`}
                  style={{
                    backgroundColor: cell ? getPieceColor(piece.color) : 'transparent'
                  }}
                >
                  {cell && cell !== 0 ? (
                    <span className="text-xs leading-none">{piece.emoji}</span>
                  ) : null}
                </div>
              ))
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-900/50 p-4 rounded-xl border-2 border-white/20 shadow-2xl min-w-[220px]"
    >
      <h2 className="text-xl font-cat font-bold text-white mb-4 text-center flex items-center justify-center gap-2">
        <span>🔮</span>
        <span>Próximas Peças</span>
      </h2>
      
      <div className="space-y-3">
        {pieces.map((piece, index) => renderPiece(piece, index))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-white/20">
        <div className="text-center text-white/60 text-sm space-y-1">
          <p className="flex items-center justify-center gap-1">
            <span>👀</span>
            <span>Prepare sua estratégia!</span>
          </p>
          <p className="flex items-center justify-center gap-1">
            <span>🎯</span>
            <span>Planeje os próximos movimentos</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default NextPieces; 