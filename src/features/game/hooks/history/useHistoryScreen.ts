
import { useCallback } from 'react';
import { useGameStore, gameActions } from '../../store/useGameStore';
import { GameState } from '../../types/common';
import { playSound } from '../../utils/audio-manager';

export const useHistoryScreen = () => {
    const gameHistory = useGameStore(s => s.gameHistory);
    const userInfo = useGameStore(s => s.userInfo);

    const handleBack = useCallback(() => {
        playSound('click');
        gameActions.setGameState(GameState.WELCOME);
    }, []);

    const handleClear = useCallback(() => {
        playSound('click');
        if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử bay?')) {
            gameActions.clearHistory();
        }
    }, []);

    const formatDuration = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}m ${s}s`;
    };

    const formatDate = (ts: number) => {
        return new Date(ts).toLocaleString('vi-VN', { 
            hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' 
        });
    };

    return {
        gameHistory,
        userInfo,
        handleBack,
        handleClear,
        formatDuration,
        formatDate
    };
};
