import React from 'react';
import { getPieceColor, getBlockShape } from '../utils/PieceGenerator';
import { getThemedCellStyle } from '../utils/BlockShapes';
import { useI18n } from '../hooks/useI18n';

const HeldPiece = ({ heldPiece, canHold }) => {
 const { t } = useI18n();
 const renderHeldPiece = () => {
 if (!heldPiece) {
 return (
 <div className="bg-gray-800/50 p-2 lg:p-4 rounded-lg border-2 border-dashed border-white/20 flex items-center justify-center">
 <span className="text-white/40 text-xs lg:text-sm">{t('game.heldEmpty')}</span>
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
 row.map((cell, x) => {
 const color = cell ? getPieceColor(heldPiece.color) : null;
 const themeStyle = cell ? getThemedCellStyle(getBlockShape(), color) : {};
 return (
 <div
 key={`${x}-${y}`}
 className={`w-5 h-5 flex items-center justify-center`}
 style={cell ? themeStyle : { backgroundColor: 'transparent' }}
 />
 );
 })
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
 <span>{t('game.held')}</span>
 </h2>

 <div>
 {renderHeldPiece()}
 </div>
 </div>
 );
};

export default React.memo(HeldPiece);
