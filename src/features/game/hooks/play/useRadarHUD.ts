
import { useState, useCallback } from 'react';
import { useGameStore } from '../../store/useGameStore';

export const useRadarHUD = () => {
    const currentLevel = useGameStore(s => s.currentLevel);
    const coordinates = useGameStore(s => s.coordinates);
    
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

    const nextCoord = coordinates[currentLevel + 1] || null;

    const handleCursorMove = useCallback((x: number, y: number) => {
        setCursorPos({ x, y });
    }, []);

    return {
        cursorPos,
        nextCoord,
        handleCursorMove
    };
};
