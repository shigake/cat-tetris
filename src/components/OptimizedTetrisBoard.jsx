import React, { memo, useMemo, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * Optimized cell component that only re-renders when its content changes
 */
const OptimizedCell = memo(({ cell, x, y, isGhost }) => {
  const cellStyle = useMemo(() => {
    if (!cell) {
      return {
        backgroundColor: 'transparent',
        border: '1px solid rgba(255, 255, 255, 0.05)'
      };
    }

    return {
      backgroundColor: isGhost ? 'transparent' : cell.color,
      border: isGhost 
        ? `2px dashed ${cell.color}60`
        : `1px solid ${cell.color}`,
      opacity: isGhost ? 0.3 : 1
    };
  }, [cell, isGhost]);

  return (
    <motion.div
      className="aspect-square flex items-center justify-center text-sm font-bold rounded-sm"
      style={cellStyle}
      layout
      transition={{ duration: 0.1 }}
      key={`${x}-${y}`}
    >
      {cell?.emoji && !isGhost && (
        <span className="text-xs">{cell.emoji}</span>
      )}
    </motion.div>
  );
});

OptimizedCell.displayName = 'OptimizedCell';

/**
 * Board diffing utility - calculates which cells changed
 * Complexity: O(h*w) but only runs when board actually changes
 */
function calculateBoardDiff(currentBoard, previousBoard) {
  if (!previousBoard) {
    // First render - all cells are "changed"
    return Array.from({ length: currentBoard.length }, (_, y) =>
      Array.from({ length: currentBoard[y].length }, (_, x) => ({ x, y }))
    ).flat();
  }

  const changes = [];
  
  for (let y = 0; y < currentBoard.length; y++) {
    for (let x = 0; x < currentBoard[y].length; x++) {
      const current = currentBoard[y][x];
      const previous = previousBoard[y]?.[x];
      
      // Deep comparison for cell content
      if (
        (current === null) !== (previous === null) ||
        (current && previous && (
          current.type !== previous.type ||
          current.color !== previous.color ||
          current.emoji !== previous.emoji
        ))
      ) {
        changes.push({ x, y });
      }
    }
  }
  
  return changes;
}

/**
 * Optimized Tetris Board with differential rendering
 * Only re-renders cells that actually changed
 */
export const OptimizedTetrisBoard = memo(({ 
  board, 
  currentPiece, 
  ghostPiece,
  className = '',
  showPerformanceInfo = false 
}) => {
  const previousBoardRef = useRef(null);
  const renderCountRef = useRef(0);
  const lastRenderTimeRef = useRef(0);

  // Calculate board differences
  const { changedCells, renderStats } = useMemo(() => {
    const startTime = performance.now();
    const changes = calculateBoardDiff(board, previousBoardRef.current);
    const endTime = performance.now();
    
    renderCountRef.current++;
    lastRenderTimeRef.current = endTime - startTime;
    
    // Store current board for next comparison
    previousBoardRef.current = board.map(row => [...row]);
    
    return {
      changedCells: changes,
      renderStats: {
        changedCellCount: changes.length,
        totalCells: board.length * board[0].length,
        diffCalculationTime: parseFloat((endTime - startTime).toFixed(2)),
        renderCount: renderCountRef.current
      }
    };
  }, [board]);

  // Get ghost piece cells for rendering
  const ghostCells = useMemo(() => {
    if (!ghostPiece) return new Set();
    
    const cells = new Set();
    ghostPiece.getCells().forEach(cell => {
      cells.add(`${cell.x}-${cell.y}`);
    });
    return cells;
  }, [ghostPiece]);

  // Get current piece cells for rendering
  const currentPieceCells = useMemo(() => {
    if (!currentPiece) return new Set();
    
    const cells = new Set();
    currentPiece.getCells().forEach(cell => {
      cells.add(`${cell.x}-${cell.y}`);
    });
    return cells;
  }, [currentPiece]);

  // Render the board with optimizations
  const boardContent = useMemo(() => {
    return board.map((row, y) => (
      <div key={y} className="flex">
        {row.map((cell, x) => {
          const cellKey = `${x}-${y}`;
          const isGhost = ghostCells.has(cellKey);
          const isCurrentPiece = currentPieceCells.has(cellKey);
          
          // Prioritize current piece > ghost > board cell
          let displayCell = cell;
          if (isCurrentPiece && currentPiece) {
            const pieceCell = currentPiece.getCells().find(c => c.x === x && c.y === y);
            if (pieceCell) displayCell = pieceCell;
          } else if (isGhost && !cell && ghostPiece) {
            const pieceCell = ghostPiece.getCells().find(c => c.x === x && c.y === y);
            if (pieceCell) displayCell = pieceCell;
          }
          
          return (
            <OptimizedCell
              key={cellKey}
              cell={displayCell}
              x={x}
              y={y}
              isGhost={isGhost && !isCurrentPiece}
            />
          );
        })}
      </div>
    ));
  }, [board, currentPiece, ghostPiece, ghostCells, currentPieceCells]);

  return (
    <div className={`relative ${className}`}>
      {/* Performance info overlay */}
      {showPerformanceInfo && (
        <div className="absolute top-0 right-0 bg-black bg-opacity-75 text-white text-xs p-2 rounded-bl z-10">
          <div>Changed: {renderStats.changedCellCount}/{renderStats.totalCells}</div>
          <div>Diff: {renderStats.diffCalculationTime}ms</div>
          <div>Renders: {renderStats.renderCount}</div>
        </div>
      )}
      
      {/* Board grid */}
      <div className="grid grid-cols-10 gap-px bg-gray-800 p-2 rounded-lg border-2 border-gray-600">
        {boardContent}
      </div>
    </div>
  );
});

OptimizedTetrisBoard.displayName = 'OptimizedTetrisBoard'; 