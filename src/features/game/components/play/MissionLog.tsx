
import React, { useEffect, useRef } from 'react';
import { renderMath } from '../../../../common/utils/mathjax';
import { useGameStore } from '../../store/useGameStore';
import { LogEntry } from '../../types/common';

export const MissionLog: React.FC = React.memo(() => {
    const logs = useGameStore(s => s.logs);
    
    const bottomRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [logs.length]);

    useEffect(() => {
        renderMath(containerRef.current);
    }, [logs]);

    const getColor = (type: LogEntry['type']) => {
        switch (type) {
            case 'success': return 'text-neon-green drop-shadow-[0_0_5px_rgba(10,255,96,0.5)]';
            case 'warning': return 'text-neon-yellow';
            case 'error': return 'text-neon-pink drop-shadow-[0_0_5px_rgba(255,0,60,0.5)]';
            case 'system': return 'text-neon-blue font-bold';
            case 'hint': return 'text-neon-pink drop-shadow-[0_0_5px_rgba(255,0,60,0.4)] italic'; 
            default: return 'text-slate-300';
        }
    };

    return (
        <div className="flex flex-col h-full bg-space-950/90 font-mono relative overflow-hidden group border-t border-slate-800">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-3 bg-slate-900/80 border-b border-slate-700/50 shrink-0 relative z-20 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                     <div className="flex flex-col gap-1">
                        <div className="w-12 h-1 bg-neon-blue/50"></div>
                        <div className="w-8 h-1 bg-neon-blue/30"></div>
                     </div>
                     <span className="uppercase tracking-[0.2em] text-slate-400 font-bold text-sm shadow-black drop-shadow-md">Nhật ký lệnh // TERMINAL_01</span>
                </div>
                <div className="flex gap-3 items-center bg-black/40 px-4 py-1.5 rounded-sm border border-slate-700/50">
                    <div className="w-2.5 h-2.5 rounded-full bg-neon-green animate-pulse shadow-[0_0_8px_#0AFF60]"></div>
                    <span className="text-neon-green text-xs font-bold tracking-widest">TRỰC TIẾP</span>
                </div>
            </div>

            {/* Content with Group A: GPU Isolation */}
            <div 
                className="flex-1 overflow-y-auto custom-scrollbar p-4 relative z-10 bg-black/40 font-mono overscroll-contain will-change-transform isolation-isolate transform-gpu"
                style={{ transform: 'translateZ(0)', contain: 'paint' }}
            >
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none opacity-30"></div>

                <div ref={containerRef} className="flex flex-col gap-2">
                    {logs.map((log) => (
                        <div key={log.id} className="flex gap-4 items-baseline hover:bg-white/5 pl-3 pr-2 py-1 rounded-sm transition-colors group/line">
                            <span className="text-slate-500 shrink-0 text-sm font-mono tabular-nums w-24 text-right opacity-70 group-hover/line:opacity-100 group-hover/line:text-neon-blue transition-all">
                                {log.timestamp}
                            </span>
                            <span className={`${getColor(log.type)} flex-1 leading-snug tracking-wide break-words text-xl font-mono`}>
                                {log.type === 'system' && <span className="mr-2 text-neon-blue font-bold">›</span>}
                                {log.type === 'error' && <span className="mr-2 text-neon-pink font-bold">×</span>}
                                {log.type === 'success' && <span className="mr-2 text-neon-green font-bold">✓</span>}
                                {log.type === 'warning' && <span className="mr-2 text-neon-yellow font-bold">!</span>}
                                {log.type === 'hint' && <span className="mr-2 text-neon-pink font-bold">?</span>}
                                {log.type === 'info' && <span className="mr-2 text-slate-500 font-bold">-</span>}
                                {log.text}
                            </span>
                        </div>
                    ))}

                     <div className="flex gap-4 items-center pl-3 opacity-70 mt-2">
                        <span className="text-slate-600 text-sm font-mono tabular-nums w-24 text-right">
                            --:--:--
                        </span>
                        <div className="flex items-center gap-2">
                            <span className="text-neon-blue text-lg font-bold">›</span>
                            <div className="w-3 h-6 bg-neon-blue/80 animate-[pulse_0.8s_steps(2)_infinite]"></div>
                        </div>
                    </div>
                </div>

                <div ref={bottomRef} />
            </div>
            
            <div className="absolute inset-0 bg-scanline bg-[length:100%_4px] opacity-10 pointer-events-none z-20"></div>
        </div>
    );
});
