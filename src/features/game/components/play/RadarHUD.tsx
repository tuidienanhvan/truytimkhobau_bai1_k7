
import React from 'react';
import { Radar, Target } from 'lucide-react';
import { Coordinate } from '../../types/common';

interface RadarHUDProps {
    cursorPos: { x: number; y: number };
    nextCoord: Coordinate | null;
}

export const RadarHUD: React.FC<RadarHUDProps> = React.memo(({ cursorPos, nextCoord }) => {
    return (
        <div className="px-8 py-6 border-b border-slate-800 bg-black shrink-0 flex items-center justify-between gap-6 font-mono z-20 shadow-xl relative">
            <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>

            <div className="flex flex-col gap-1 relative z-10 flex-1">
                 <div className="flex items-center gap-3 text-slate-400">
                    <Radar size={28} className="text-neon-blue" />
                    <span className="text-sm uppercase tracking-[0.3em] font-bold">Vị trí</span>
                 </div>
                 {/* FIX: whitespace-nowrap để không xuống dòng, min-w để cố định khung */}
                 <div className="text-neon-blue font-bold text-3xl tracking-wider tabular-nums whitespace-nowrap min-w-[240px]">
                    [{cursorPos.x}, {cursorPos.y}]
                 </div>
            </div>

            <div className="h-12 w-1 bg-slate-800 rounded-full shrink-0"></div>

            <div className="flex flex-col gap-1 items-end relative z-10 flex-1">
                 <div className="flex items-center gap-3 text-slate-400">
                    <span className="text-sm uppercase tracking-[0.3em] font-bold">Mục tiêu</span>
                    <Target size={28} className="text-neon-pink" />
                 </div>
                 {/* FIX: whitespace-nowrap để không xuống dòng */}
                 <div className="text-neon-pink font-bold text-3xl tracking-wider tabular-nums bg-neon-pink/10 px-4 rounded border border-neon-pink/30 shadow-[0_0_15px_rgba(255,0,60,0.2)] whitespace-nowrap min-w-[240px] text-center">
                    {nextCoord ? `[${nextCoord.x}, ${nextCoord.y}]` : '---'}
                 </div>
            </div>
        </div>
    );
});
