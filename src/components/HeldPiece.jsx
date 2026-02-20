import React from 'react';
import { getPieceColor } from '../utils/PieceGenerator';

const HeldPiece = ({ heldPiece, canHold }) => {
  const renderHeldPiece = () => {
    if (!heldPiece) {
      return (
        <div className="bg-gray-800/50 p-2 lg:p-4 rounded-lg border-2 border-dashed border-white/20 flex items-center justify-center">
          <span className="text-white/40 text-xs lg:text-sm">Vazio</span>
        </div>
      );
    }

    const maxWidth = Math.max(...heldPiece.shape.map(row => row.length));
    const maxHeight = heldPiece.shape.length;

    return (
      <div
        className="bg-gray-800/50 p-1.5 rounded-lg border border-white/20"
      >
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
      </div>
    );
  };

  return (
    <div
      className="bg-gray-900/50 p-2 rounded-xl border-2 border-white/20 shadow-2xl w-24"
    >
      <h2 className="text-xs font-bold text-white mb-1 text-center flex items-center justify-center gap-1">
        <span>💾</span>
        <span className="hidden lg:inline">Guardada</span>
      </h2>

      <div>
        {renderHeldPiece()}
      </div>
    </div>
  );
};

export default HeldPiece;
