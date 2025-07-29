import React from 'react';
import { motion } from 'framer-motion';
import { getPieceColor } from '../utils/PieceGenerator';

const HeldPiece = ({ heldPiece, canHold }) => {
  const renderHeldPiece = () => {
    if (!heldPiece) {
      return (
        <div className="bg-gray-800/50 p-4 rounded-lg border-2 border-dashed border-white/20 flex items-center justify-center">
          <span className="text-white/40 text-sm">Vazio</span>
        </div>
      );
    }

    const maxWidth = Math.max(...heldPiece.shape.map(row => row.length));
    const maxHeight = heldPiece.shape.length;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-800/50 p-3 rounded-lg border border-white/20"
      >
        <div className="text-center mb-3">
          <span className="text-xs text-white/70 font-medium">Guardada</span>
        </div>
        
        <div className="flex justify-center">
          <div 
            className="grid gap-1" 
            style={{
              gridTemplateColumns: `repeat(${maxWidth}, 1fr)`,
              gridTemplateRows: `repeat(${maxHeight}, 1fr)`
            }}
          >
            {heldPiece.shape.map((row, y) =>
              row.map((cell, x) => (
                <div
                  key={`${x}-${y}`}
                  className={`w-5 h-5 rounded-sm flex items-center justify-center ${
                    cell ? 'border border-white/40 shadow-sm' : ''
                  }`}
                  style={{
                    backgroundColor: cell ? getPieceColor(heldPiece.color) : 'transparent'
                  }}
                >
                  {cell && cell !== 0 ? (
                    <span className="text-xs leading-none">{heldPiece.emoji}</span>
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
        <span>💾</span>
        <span>Peça Guardada</span>
      </h2>
      
      <div className="space-y-3">
        {renderHeldPiece()}
        
        <div className={`text-center p-2 rounded-lg ${
          canHold 
            ? 'bg-green-500/20 border border-green-400/30' 
            : 'bg-red-500/20 border border-red-400/30'
        }`}>
          <span className={`text-sm font-medium ${
            canHold ? 'text-green-400' : 'text-red-400'
          }`}>
            {canHold ? '✅ Pode guardar' : '❌ Já guardou'}
          </span>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-white/20">
        <div className="text-center text-white/60 text-sm space-y-1">
          <p className="flex items-center justify-center gap-1">
            <span>💾</span>
            <span>Guarde uma peça para usar depois</span>
          </p>
          <p className="flex items-center justify-center gap-1">
            <span>🔄</span>
            <span>Só pode guardar uma vez por peça</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default HeldPiece; 