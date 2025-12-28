
import React from 'react';
import { GameHistoryEntry } from '../../types/entities';
import { Trophy, AlertTriangle, Clock, Target, Calendar } from 'lucide-react';

interface HistoryItemProps {
    entry: GameHistoryEntry;
    formatDuration: (s: number) => string;
    formatDate: (ts: number) => string;
}

export const HistoryItem: React.FC<HistoryItemProps> = React.memo(({ entry, formatDuration, formatDate }) => {
    const isWin = entry.result === 'victory';
    
    return (
        <div className="group relative p-4 bg-black/40 border border-white/5 rounded-lg hover:bg-white/5 transition-all flex items-center gap-6 overflow-hidden">
             {/* Left Status Bar */}
             <div className={`absolute left-0 top-0 bottom-0 w-1 ${isWin ? 'bg-neon-yellow' : 'bg-neon-pink'}`}></div>

             {/* Icon */}
             <div className={`w-12 h-12 shrink-0 rounded flex items-center justify-center border ${isWin ? 'bg-neon-yellow/10 border-neon-yellow/30 text-neon-yellow' : 'bg-neon-pink/10 border-neon-pink/30 text-neon-pink'}`}>
                 {isWin ? <Trophy size={20} /> : <AlertTriangle size={20} />}
             </div>

             {/* Main Info */}
             <div className="flex-1 min-w-0 grid grid-cols-12 gap-4 items-center">
                 
                 {/* Result & Score */}
                 <div className="col-span-3">
                     <div className={`text-lg font-black uppercase tracking-wider ${isWin ? 'text-white' : 'text-slate-400'}`}>
                         {isWin ? 'HOÀN THÀNH' : 'THẤT BẠI'}
                     </div>
                     <div className={`text-2xl font-mono font-bold leading-none ${isWin ? 'text-neon-yellow' : 'text-neon-pink'}`}>
                         {entry.score.toLocaleString()} <span className="text-xs text-slate-500">PTS</span>
                     </div>
                 </div>

                 {/* Date */}
                 <div className="col-span-3 flex flex-col justify-center">
                      <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
                          <Calendar size={12} /> Thời gian
                      </div>
                      <div className="text-slate-300 font-mono text-sm">
                          {formatDate(entry.timestamp)}
                      </div>
                 </div>

                 {/* Duration */}
                 <div className="col-span-3 flex flex-col justify-center">
                      <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
                          <Clock size={12} /> Thời lượng
                      </div>
                      <div className="text-slate-300 font-mono text-sm">
                          {formatDuration(entry.duration)}
                      </div>
                 </div>

                 {/* Accuracy/Steps */}
                 <div className="col-span-3 flex flex-col justify-center">
                      <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
                          <Target size={12} /> Tiến độ
                      </div>
                      <div className="flex items-center gap-2">
                           <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                               <div 
                                   className={`h-full ${isWin ? 'bg-neon-green' : 'bg-neon-pink'}`} 
                                   style={{ width: `${entry.accuracy}%` }}
                               ></div>
                           </div>
                           <span className="text-xs font-mono text-slate-400">{entry.accuracy}%</span>
                      </div>
                 </div>

             </div>
        </div>
    );
});
