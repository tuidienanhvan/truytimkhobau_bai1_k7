
import React from 'react';
import { Coordinate } from '../types';
import { useGraphBoard } from '../hooks/useGraphBoard';

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
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"
           style={{
             backgroundImage: `
               linear-gradient(rgba(0, 240, 255, 0.3) 1px, transparent 1px),
               linear-gradient(90deg, rgba(0, 240, 255, 0.3) 1px, transparent 1px)
             `,
             backgroundSize: '50px 50px',
             backgroundPosition: 'center center',
             maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)', 
           }}
      ></div>

      {/* 3. MOVING SCANLINE EFFECT */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-scanline bg-[length:100%_4px] opacity-10"></div>
      
      {/* 4. MAIN BOARD CONTAINER - GPU Optimized */}
      {/* FIX #55: contain: strict for performance isolation */}
      {/* FIX: Added pb-8 to lift the board up from bottom edge (padding) */}
      <div className="relative w-full h-full z-10 contain-strict pb-8" style={{ transform: 'translateZ(0)', perspective: '1000px' }}>
          <div id="jxgbox" ref={boxRef} className="w-full h-full block outline-none touch-none" style={{ imageRendering: '-webkit-optimize-contrast' }} />
          
          {/* 5. HUD OVERLAY */}
          <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
              
              {/* Central Crosshair */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-neon-blue/10 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-neon-blue/50 rounded-full"></div>
                  <div className="absolute w-full h-[1px] bg-neon-blue/20"></div>
                  <div className="absolute h-full w-[1px] bg-neon-blue/20"></div>
              </div>

              {/* Corner Brackets */}
              <div className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-neon-blue opacity-50 rounded-tl-lg"></div>
              <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-neon-blue opacity-50 rounded-tr-lg"></div>
              <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-neon-blue opacity-50 rounded-bl-lg"></div>
              <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-neon-blue opacity-50 rounded-br-lg"></div>
          </div>
      </div>
    </div>
  );
});
