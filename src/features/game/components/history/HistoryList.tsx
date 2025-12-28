
import React from 'react';
import { GameHistoryEntry } from '../../types/entities';
import { HistoryItem } from './HistoryItem';
import { FileClock } from 'lucide-react';

interface HistoryListProps {
    history: GameHistoryEntry[];
    formatDuration: (s: number) => string;
    formatDate: (ts: number) => string;
}

export const HistoryList: React.FC<HistoryListProps> = ({ history, formatDuration, formatDate }) => {
    
    if (history.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                <div className="w-20 h-20 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
                    <FileClock size={40} className="opacity-50" />
                </div>
                <div className="text-xl font-bold uppercase tracking-wider mb-2">Chưa có dữ liệu</div>
                <p className="text-sm font-mono">Hoàn thành nhiệm vụ để ghi lại lịch sử.</p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto custom-scrollbar p-12 space-y-3">
             {history.map((entry) => (
                 <HistoryItem 
                    key={entry.id} 
                    entry={entry} 
                    formatDuration={formatDuration}
                    formatDate={formatDate}
                 />
             ))}
             
             <div className="text-center py-8 text-slate-600 text-xs font-mono uppercase tracking-widest">
                 --- Hết dữ liệu hiển thị (Giới hạn 50) ---
             </div>
        </div>
    );
};
