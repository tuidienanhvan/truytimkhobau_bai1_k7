
import React from 'react';
import { Lightbulb } from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';

interface SidebarControlsProps {
    handleHint: () => void;
    isVictoryPhase: boolean;
}

export const SidebarControls: React.FC<SidebarControlsProps> = ({
    handleHint,
    isVictoryPhase
}) => {
    const isSubmitting = useGameStore(s => s.inputState.isSubmitting);

    return (
        <div className="p-6 bg-space-950 border-t border-neon-blue/20 z-20 shrink-0">
             <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-1">
                    <span>Hệ thống hỗ trợ</span>
                    <span className={isVictoryPhase ? "text-neon-yellow" : "text-neon-blue"}>
                        {isVictoryPhase ? "CHỜ" : "SẴN SÀNG"}
                    </span>
                </div>

                <button 
                    type="button" 
                    onClick={handleHint}
                    disabled={isVictoryPhase || isSubmitting}
                    className={`w-full font-bold uppercase tracking-[0.3em] py-6 text-xl transition-all flex items-center justify-center gap-4 group disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden
                        ${isVictoryPhase 
                            ? 'border border-slate-700 text-slate-700 bg-transparent' 
                            : 'bg-neon-yellow/5 border border-neon-yellow/50 text-neon-yellow hover:bg-neon-yellow hover:text-black shadow-[0_0_15px_rgba(252,238,10,0.1)] hover:shadow-[0_0_30px_rgba(252,238,10,0.5)]'
                        }`}
                >
                    {!isVictoryPhase && (
                         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1s_infinite]"></div>
                    )}
                    
                    <Lightbulb size={28} className={!isVictoryPhase ? "group-hover:animate-bounce" : ""} />
                    <span>HỆ THỐNG GỢI Ý</span>
                </button>
                
                {!isVictoryPhase && (
                    <div className="text-center text-xs text-slate-600 font-mono">
                        * Sử dụng gợi ý không bị trừ điểm
                    </div>
                )}
             </div>
         </div>
    );
};
