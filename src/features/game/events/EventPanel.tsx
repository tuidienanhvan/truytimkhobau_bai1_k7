
import React from 'react';
import { AlertTriangle, Radio, Fuel, Zap, Skull, Gift } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';

export const EventPanel: React.FC = () => {
    const activeEvent = useGameStore(s => s.activeEvent);

    // Helper chọn icon
    const getIcon = () => {
        if (!activeEvent) return <Radio size={20} className="text-neon-blue animate-pulse" />;
        switch (activeEvent.icon) {
            case 'fuel': return <Fuel size={24} className="text-neon-pink animate-bounce" />;
            case 'alien': case 'skull': return <Skull size={24} className="text-neon-pink" />;
            case 'gem': return <Gift size={24} className="text-neon-yellow" />;
            default: return <AlertTriangle size={24} className="text-neon-pink" />;
        }
    };

    const isAlert = !!activeEvent;

    return (
        <div className={`
            px-6 py-4 border-b shrink-0 transition-colors duration-500 relative overflow-hidden flex flex-col justify-center min-h-[120px]
            ${isAlert ? 'bg-neon-pink/10 border-neon-pink/50' : 'bg-space-900 border-slate-800'}
        `}>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-grid-pattern"></div>
            
            {/* Header Line - /GAME/EVENTS */}
            <div className="flex items-center justify-between mb-3 relative z-10">
                <div className="flex items-center gap-2">
                    <span className={`text-sm font-black uppercase tracking-[0.2em] font-mono ${isAlert ? 'text-neon-pink' : 'text-neon-blue'}`}>
                        /GAME/EVENTS
                    </span>
                </div>
                {/* Trạng thái nhỏ bên cạnh */}
                <div className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${isAlert ? 'bg-neon-pink/20 border-neon-pink text-neon-pink animate-pulse' : 'bg-neon-blue/10 border-neon-blue/30 text-neon-blue'}`}>
                    {isAlert ? 'CRITICAL ERROR' : 'SYSTEM IDLE'}
                </div>
            </div>

            {/* Content */}
            <div className="relative z-10 flex gap-4 items-center">
                <div className={`w-12 h-12 flex items-center justify-center rounded border bg-black/30 ${isAlert ? 'border-neon-pink/50' : 'border-slate-700'}`}>
                    {getIcon()}
                </div>

                <div className="flex-1 min-w-0">
                    {activeEvent ? (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <h3 className="text-white font-bold uppercase tracking-wider text-sm mb-1 drop-shadow-md truncate">
                                {activeEvent.title}
                            </h3>
                            <p className="text-slate-300 text-xs font-mono leading-relaxed line-clamp-2">
                                {activeEvent.description}
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2 opacity-30">
                            <div className="h-1.5 w-full bg-slate-500 rounded-full"></div>
                            <div className="h-1.5 w-2/3 bg-slate-500 rounded-full"></div>
                        </div>
                    )}
                </div>
            </div>

            {/* Decoration Effects */}
            {isAlert && (
                <>
                    <div className="absolute top-0 right-0 w-16 h-16 bg-neon-pink/20 blur-xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-neon-pink animate-[pulse_0.5s_infinite]"></div>
                </>
            )}
        </div>
    );
};
