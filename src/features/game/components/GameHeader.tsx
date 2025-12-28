
import React from 'react';
import { Trophy, Maximize, Minimize, User, Activity, ShoppingBag, Coins, History } from 'lucide-react';
import { GameState } from '../types/common';
import { useGameHeader } from '../hooks/useGameHeader';

interface GameHeaderProps {
  gameState: GameState;
  isFullscreen: boolean;
  stats: { playCount: number; bestScore: number };
  userName: string;
  onFullscreen: () => void;
}

// Improvement #8: React.memo to prevent re-renders on parent updates (e.g. Timer)
export const GameHeader: React.FC<GameHeaderProps> = React.memo(({ 
  gameState, isFullscreen, stats, userName, onFullscreen
}) => {
  const displayUserName = userName || 'KHÁCH';
  
  // Use Custom Hook
  const { 
      coins, 
      showNavButtons, 
      handleOpenShop, 
      handleOpenHistory 
  } = useGameHeader(gameState);

  return (
    <div className="h-24 pl-8 pr-0 flex items-center bg-space-950 border-b-[3px] border-neon-blue/60 shrink-0 select-none relative z-50 font-tech shadow-2xl overflow-hidden">
      
      {/* BACKGROUND DECORATION */}
      <div className="absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-neon-blue/5 to-transparent skew-x-[-20deg] pointer-events-none"></div>

      {/* 1. BRANDING SECTION (Left) */}
      <div className="flex items-center gap-5 shrink-0 z-10">
        {/* LOGO BOX: Dark background, Neon Blue Logo via Mask */}
        <div className="w-14 h-14 bg-space-900 border border-neon-blue/30 rounded-lg shadow-[0_0_15px_rgba(0,240,255,0.2)] flex items-center justify-center relative overflow-hidden group">
             <div className="absolute inset-0 bg-neon-blue/5 group-hover:bg-neon-blue/10 transition-colors"></div>
             
             {/* The Logo using Mask for Theme Coloring */}
             <div 
                className="w-10 h-10 bg-neon-blue shadow-[0_0_10px_rgba(0,240,255,0.8)]"
                style={{
                    maskImage: `url(https://piai-embed-engine.vercel.app/public/logo-optimized.svg)`,
                    maskSize: 'contain',
                    maskRepeat: 'no-repeat',
                    maskPosition: 'center',
                    WebkitMaskImage: `url(https://piai-embed-engine.vercel.app/public/logo-optimized.svg)`,
                    WebkitMaskSize: 'contain',
                    WebkitMaskRepeat: 'no-repeat',
                    WebkitMaskPosition: 'center',
                }}
             />
        </div>

        <div className="flex flex-col justify-center">
          {/* Updated Text Color: Slate-500 -> Neon Blue / White */}
          <span className="text-sm font-bold tracking-[0.3em] text-neon-blue uppercase leading-none mb-1.5 drop-shadow-[0_0_5px_rgba(0,240,255,0.5)]">PiStudy</span>
          <span className="text-4xl font-black text-white tracking-wider uppercase leading-none drop-shadow-[0_0_10px_rgba(0,240,255,0.3)]">
            SĂN <span className="text-neon-blue">SAO</span>
          </span>
        </div>
      </div>

      {/* 2. CREATIVE STATS HUD (Center/Right) */}
      <div className="flex-1 flex items-center justify-end mr-8 gap-8 z-10">
        
        {/* NAVIGATION BUTTONS (Only in Welcome) */}
        {showNavButtons && (
            <div className="flex items-center gap-4 mr-4">
                <button 
                    onClick={handleOpenHistory}
                    className="flex items-center gap-2 bg-space-800 border border-slate-600 text-slate-300 px-5 py-2 rounded skew-x-[-10deg] hover:bg-slate-700 hover:text-white hover:border-white transition-all group"
                >
                    <History size={18} className="skew-x-[10deg]" />
                    <span className="font-bold tracking-widest skew-x-[10deg] text-sm">LỊCH SỬ</span>
                </button>

                <button 
                    onClick={handleOpenShop}
                    className="flex items-center gap-2 bg-neon-blue/10 border border-neon-blue/50 text-neon-blue px-5 py-2 rounded skew-x-[-10deg] hover:bg-neon-blue hover:text-black hover:shadow-[0_0_20px_rgba(0,240,255,0.5)] transition-all group"
                >
                    <ShoppingBag size={18} className="skew-x-[10deg]" />
                    <span className="font-bold tracking-widest skew-x-[10deg] text-sm">KHO VŨ KHÍ</span>
                </button>
            </div>
        )}

        {/* COINS DISPLAY (Always visible) */}
        <div className="flex items-center gap-3 bg-black/40 border border-neon-yellow/30 px-5 py-2 rounded-full shadow-[0_0_15px_rgba(252,238,10,0.1)]">
            <Coins size={18} className="text-neon-yellow" />
            <span className="text-neon-yellow font-mono font-bold text-xl tracking-wider">{coins.toLocaleString()}</span>
        </div>

        {/* SEPARATOR */}
        <div className="h-12 w-px bg-gradient-to-b from-transparent via-slate-700 to-transparent skew-x-[-20deg]"></div>

        {/* PILOT IDENTITY */}
        <div className="group flex items-center gap-4 relative pl-6 pr-2 py-2">
            {/* Decoration Lines */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-neon-blue/50"></div>
            <div className="absolute left-2 top-0 w-2 h-2 border-t border-l border-neon-blue"></div>
            <div className="absolute left-2 bottom-0 w-2 h-2 border-b border-l border-neon-blue"></div>
            
            <div className="text-right">
                <div className="text-[10px] text-neon-blue uppercase tracking-[0.2em] font-bold opacity-70 group-hover:opacity-100 transition-opacity">
                    Chỉ huy
                </div>
                <div className="text-2xl text-white font-bold tracking-wide drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">
                    {displayUserName}
                </div>
            </div>
            <div className="relative">
                <div className="w-12 h-12 rounded-full bg-space-800 border-2 border-neon-blue/30 flex items-center justify-center text-neon-blue shadow-[0_0_15px_rgba(0,240,255,0.2)] group-hover:border-neon-blue group-hover:shadow-[0_0_20px_rgba(0,240,255,0.5)] transition-all">
                    <User size={24} />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-neon-green rounded-full border-2 border-black"></div>
            </div>
        </div>

        {/* MISSION STATS (Play Count) */}
        <div className="flex flex-col items-center">
             <div className="flex items-center gap-2 text-slate-400 mb-1">
                 <Activity size={14} />
                 <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Nhiệm vụ</span>
             </div>
             <div className="px-6 py-1 bg-space-900/80 border border-slate-700 rounded-sm skew-x-[-10deg]">
                 <span className="block skew-x-[10deg] text-xl font-mono text-slate-200 font-bold">
                    {stats.playCount.toString().padStart(3, '0')}
                 </span>
             </div>
        </div>

        {/* RECORD (Best Score) */}
        <div className="flex flex-col items-center relative">
             <div className="absolute -inset-2 bg-neon-yellow/5 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <div className="flex items-center gap-2 text-neon-yellow mb-1">
                 <Trophy size={14} />
                 <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Kỷ lục</span>
             </div>
             <div className="px-6 py-1 bg-neon-yellow/10 border border-neon-yellow/50 rounded-sm skew-x-[-10deg] shadow-[0_0_10px_rgba(252,238,10,0.1)]">
                 <span className="block skew-x-[10deg] text-xl font-mono text-neon-yellow font-bold drop-shadow-[0_0_5px_rgba(252,238,10,0.6)]">
                    {stats.bestScore.toLocaleString()}
                 </span>
             </div>
        </div>

      </div>

      {/* 3. FULLSCREEN BUTTON (Rightmost) */}
      <div className="ml-4 h-full flex items-center relative z-10">
        <button 
          onClick={onFullscreen} 
          className="w-24 h-24 flex items-center justify-center text-neon-blue hover:text-white hover:bg-white/5 transition-all group"
          title="Toàn màn hình"
        >
          {isFullscreen ? (
            <Minimize size={40} strokeWidth={2} className="group-hover:scale-90 transition-transform" />
          ) : (
            <Maximize size={40} strokeWidth={2} className="group-hover:scale-110 transition-transform" />
          )}
        </button>
      </div>
    </div>
  );
});
