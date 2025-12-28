
import React from 'react';
import { useHistoryScreen } from '../features/game/hooks/history/useHistoryScreen';
import { HistoryHeader } from '../features/game/components/history/HistoryHeader';
import { HistoryList } from '../features/game/components/history/HistoryList';

export default function HistoryScreen() {
    const { 
        gameHistory, 
        handleBack, 
        handleClear,
        formatDuration, 
        formatDate 
    } = useHistoryScreen();

    return (
        <div className="w-full h-full flex flex-col bg-space-950 font-tech relative overflow-hidden select-none">
            {/* BACKGROUND */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(10,20,40,0)_0%,rgba(5,7,10,1)_90%)]"></div>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] opacity-20"></div>

            {/* HEADER */}
            <HistoryHeader onBack={handleBack} onClear={handleClear} />

            {/* CONTENT */}
            <HistoryList 
                history={gameHistory}
                formatDuration={formatDuration}
                formatDate={formatDate}
            />
        </div>
    );
}
