
import { useCallback } from 'react';
import { gameActions } from '../../store/useGameStore';

export const useQuestionModal = (currentLevel: number) => {
    const handlePointClick = useCallback((index: number, x: number, y: number) => {
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
