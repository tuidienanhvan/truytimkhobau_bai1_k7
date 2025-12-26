
import { useCallback } from 'react';
import { gameActions } from '../store/useGameStore';

export const useQuestionModal = (currentLevel: number) => {
    // Handler: When clicking a point on the graph
    const handlePointClick = useCallback((index: number, x: number, y: number) => {
        // Only open modal if the clicked point is the NEXT target
        if (index === currentLevel + 1) {
            gameActions.setModalState(true, { x, y });
        }
    }, [currentLevel]);

    const closeModal = useCallback(() => {
        gameActions.setModalState(false);
    }, []);

    return {
        handlePointClick,
        closeModal
    };
};
