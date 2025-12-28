
import React from 'react';
import { ArrowLeft, History, Trash2 } from 'lucide-react';

interface HistoryHeaderProps {
    onBack: () => void;
    onClear: () => void;
}

export const HistoryHeader: React.FC<HistoryHeaderProps> = React.memo(({ onBack, onClear }) => {
    return (
        <div className="relative z-10 px-12 py-6 flex items-center justify-between border-b border-white/5 shrink-0 bg-space-900/90 backdrop-blur-sm">
            <div className="flex items-center gap-4">
                 <button 
                    onClick={onBack}
                    className="p-3 bg-space-800 border border-slate-700 rounded hover:bg-white/10 hover:border-white transition-all group shadow-lg"
                 >
                     <ArrowLeft size={24} className="text-slate-400 group-hover:text-white" />
                 </button>
                 <div>
                    <div className="text-xs text-neon-blue font-bold tracking-[0.3em] uppercase mb-1">Dữ liệu chuyến bay</div>
                    <h1 className="text-4xl text-white font-black uppercase tracking-wider drop-shadow-lg">NHẬT KÝ CHIẾN DỊCH</h1>
                 </div>
            </div>
            
            <div className="flex items-center gap-4">
                 <div className="flex gap-1 mr-8 opacity-50">
                    <div className="w-12 h-1 bg-neon-blue/20 skew-x-[-20deg]"></div>
                    <div className="w-8 h-1 bg-neon-blue/10 skew-x-[-20deg]"></div>
                    <div className="w-4 h-1 bg-neon-blue/5 skew-x-[-20deg]"></div>
                </div>

                <button 
                    onClick={onClear}
                    className="flex items-center gap-2 text-red-500 hover:text-red-400 bg-red-500/10 hover:bg-red-500/20 px-4 py-2 rounded border border-red-500/30 transition-all text-xs font-bold uppercase tracking-wider"
                >
                    <Trash2 size={16} />
                    Xóa nhật ký
                </button>
            </div>
        </div>
    );
});
