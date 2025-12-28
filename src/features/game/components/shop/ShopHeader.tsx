
import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface ShopHeaderProps {
    onBack: () => void;
}

export const ShopHeader: React.FC<ShopHeaderProps> = React.memo(({ onBack }) => {
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
                    <div className="text-xs text-neon-blue font-bold tracking-[0.3em] uppercase mb-1">Hệ thống hậu cần</div>
                    <h1 className="text-4xl text-white font-black uppercase tracking-wider drop-shadow-lg">KHO TÀU VŨ TRỤ</h1>
                 </div>
            </div>
            
            {/* Decoration Lines (Optional) */}
            <div className="flex gap-1">
                <div className="w-12 h-1 bg-neon-blue/20 skew-x-[-20deg]"></div>
                <div className="w-8 h-1 bg-neon-blue/10 skew-x-[-20deg]"></div>
                <div className="w-4 h-1 bg-neon-blue/5 skew-x-[-20deg]"></div>
            </div>
        </div>
    );
});
