
import React from 'react';
import { Coordinate } from '../../types/common';
import { useGraphBoard } from '../../hooks/play/useGraphBoard';

interface GraphBoardProps {
  currentStep: number;
  coordinates: Coordinate[]; 
  onCursorMove: (x: number, y: number) => void;
  onPointClick: (index: number, x: number, y: number) => void;
}

export const GraphBoard: React.FC<GraphBoardProps> = React.memo(({ 
  currentStep, coordinates, onCursorMove, onPointClick 
}) => {
  const { boxRef } = useGraphBoard(currentStep, coordinates, onCursorMove, onPointClick);

  return (
    <div className="w-full h-full relative bg-[#020408] overflow-hidden flex items-center justify-center group transform-gpu">
      
      {/* 1. DEEP SPACE BACKGROUND */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#0f172a_0%,#000000_100%)] z-0 pointer-events-none"></div>

      {/* 2. HOLOGRAPHIC GRID */}
      {/* FIX: Centered grid lines to match CSS center */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"
           style={{
             backgroundImage: `
               linear-gradient(transparent 24.5px, rgba(0, 240, 255, 0.3) 24.5px, rgba(0, 240, 255, 0.3) 25.5px, transparent 25.5px),
               linear-gradient(90deg, transparent 24.5px, rgba(0, 240, 255, 0.3) 24.5px, rgba(0, 240, 255, 0.3) 25.5px, transparent 25.5px)
             `,
             backgroundSize: '50px 50px',
             backgroundPosition: 'center center',
             maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)', 
           }}
      ></div>

      {/* 3. MOVING SCANLINE EFFECT */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-scanline bg-[length:100%_4px] opacity-10"></div>
      
      {/* 4. MAIN BOARD CONTAINER - GPU Optimized */}
      <div className="relative w-full h-full z-10 contain-strict" style={{ transform: 'translateZ(0)', perspective: '1000px' }}>
          <div id="jxgbox" ref={boxRef} className="w-full h-full block outline-none touch-none" style={{ imageRendering: '-webkit-optimize-contrast' }} />
          
          {/* 5. HUD OVERLAY */}
          <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-neon-blue/10 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-neon-blue/50 rounded-full relative z-10"></div>
                  <div className="absolute top-1/2 left-0 w-full h-[1px] bg-neon-blue/20 -translate-y-1/2"></div>
                  <div className="absolute left-1/2 top-0 h-full w-[1px] bg-neon-blue/20 -translate-x-1/2"></div>
              </div>

              <div className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-neon-blue opacity-50 rounded-tl-lg"></div>
              <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-neon-blue opacity-50 rounded-tr-lg"></div>
              <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-neon-blue opacity-50 rounded-bl-lg"></div>
              <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-neon-blue opacity-50 rounded-br-lg"></div>
          </div>
      </div>
    </div>
  );
});
