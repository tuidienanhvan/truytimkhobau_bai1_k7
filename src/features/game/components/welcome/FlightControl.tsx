
import React from 'react';
import { Cpu, Zap, Loader2, Crosshair } from 'lucide-react';
import { RocketStyle } from '../../data/game-skin-rocket';

interface FlightControlProps {
  currentSkin: RocketStyle;
  isStarting: boolean;
  onStart: () => void;
}

export const FlightControl: React.FC<FlightControlProps> = ({ 
  currentSkin, isStarting, onStart 
}) => {
  const themeColor = currentSkin.primaryColor;

  return (
    <div className="col-span-3 flex flex-col justify-center space-y-4">
        
        {/* Specs Panel */}
        <div className="bg-space-900/40 border border-slate-700/50 p-8 rounded-xl backdrop-blur-sm relative overflow-hidden mb-4">
             {/* Decorative Header */}
             <div className="flex justify-between items-center border-b border-slate-700 pb-4 mb-6">
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500">Thông số kỹ thuật</span>
                <Cpu size={16} className="text-slate-500" />
             </div>
             
             {/* Stats List */}
             <div className="space-y-6 font-mono text-sm">
                <div className="flex justify-between items-center">
                    <span className="text-slate-400">Hệ màu</span>
                    <div className="flex items-center gap-2">
                        <span className="font-bold uppercase" style={{ color: themeColor }}>{themeColor}</span>
                        <div className="w-3 h-3 rounded-full" style={{backgroundColor: themeColor, boxShadow: `0 0 10px ${themeColor}`}}></div>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-slate-400">Động cơ</span>
                    <span className="text-white font-bold flex items-center gap-2">
                        <Zap size={14} className="text-neon-yellow" /> Ion-Drive V2
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-slate-400">Tầm hoạt động</span>
                    <span className="text-white font-bold">Vô cực</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-slate-400">Mô tả</span>
                    <span className="text-slate-300 italic text-right max-w-[150px] truncate">{currentSkin.description}</span>
                </div>
             </div>
        </div>
        
        {/* START BUTTON */}
        <div className="relative group">
            <div 
                className="absolute -inset-1 rounded-lg opacity-20 group-hover:opacity-60 blur-lg transition duration-500"
                style={{ backgroundColor: themeColor }}
            ></div>
            
            <button 
                onClick={onStart} 
                disabled={isStarting}
                className="w-full text-2xl py-6 tracking-[0.2em] relative overflow-hidden border transition-all duration-300 flex items-center justify-center gap-3 font-black group bg-black/40 hover:bg-white/5 outline-none"
                style={{ 
                    borderColor: themeColor,
                    color: themeColor,
                    boxShadow: `0 0 20px ${themeColor}20`
                }}
            >
                <div className="absolute inset-0" style={{ clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)' }}></div>
                
                {isStarting ? (
                    <span className="flex items-center justify-center gap-3 animate-pulse relative z-10">
                        <Loader2 className="animate-spin" />
                        KHỞI TẠO...
                    </span>
                ) : (
                    <span className="relative z-10 flex items-center justify-center gap-3">
                        <Crosshair strokeWidth={3} />
                        KHỞI ĐỘNG
                    </span>
                )}
            </button>
        </div>
    </div>
  );
};
