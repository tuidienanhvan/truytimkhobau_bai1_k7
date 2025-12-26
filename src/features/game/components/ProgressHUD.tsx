
import React from 'react';
import { Clock, ShieldAlert, BatteryCharging } from 'lucide-react';

interface ProgressHUDProps {
    progress: number;
    timeLeft: number;
    lives: number;
}

export const ProgressHUD: React.FC<ProgressHUDProps> = React.memo(({ progress, timeLeft, lives }) => {
    const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const seconds = (timeLeft % 60).toString().padStart(2, '0');
    const isCriticalTime = timeLeft <= 30;

    return (
        <div className="px-8 py-8 border-b border-white/10 bg-space-900 shrink-0 font-tech relative overflow-hidden z-30">
             
             <div className="flex items-end justify-between mt-4 mb-6">
                <div className={`flex items-center gap-4 px-5 py-3 border-2 rounded transition-all shadow-lg ${isCriticalTime ? 'bg-neon-pink/20 border-neon-pink animate-pulse' : 'bg-black border-slate-600'}`}>
                    <Clock size={24} className={isCriticalTime ? 'text-neon-pink' : 'text-neon-blue'} />
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Thời gian</span>
                        <span className={`text-3xl font-mono font-bold leading-none tracking-[0.1em] ${isCriticalTime ? 'text-neon-pink' : 'text-white'}`}>
                            {minutes}:{seconds}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2 text-neon-green text-xs uppercase tracking-[0.2em] font-bold">
                        <ShieldAlert size={16} /> Khiên chắn
                    </div>
                    <div className="flex gap-2">
                        {[1, 2, 3].map((i) => (
                            <div 
                                key={i}
                                className={`w-12 h-4 skew-x-[-20deg] border-2 transition-all duration-300
                                    ${i <= lives 
                                        ? 'bg-neon-green border-neon-green shadow-[0_0_10px_rgba(10,255,96,0.6)]' 
                                        : 'bg-transparent border-slate-800 opacity-20'
                                    }`}
                            ></div>
                        ))}
                    </div>
                </div>
             </div>

             <div className="relative mt-2">
                 <div className="flex justify-between items-end mb-3">
                    <span className="text-sm text-neon-blue uppercase tracking-[0.3em] font-bold flex items-center gap-2">
                        <BatteryCharging size={20} /> NĂNG LƯỢNG
                    </span>
                    <span className="text-4xl text-white font-mono font-bold tracking-widest">
                        {Math.round(progress)}%
                    </span>
                 </div>

                 <div className="h-8 w-full bg-black border-2 border-slate-700 relative overflow-hidden rounded-sm skew-x-[-5deg]">
                     <div 
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-neon-blue to-neon-pink origin-left transition-transform duration-700 ease-out" 
                        style={{ transform: `scaleX(${progress / 100})`, width: '100%' }}
                     ></div>
                 </div>
             </div>
         </div>
    );
});
