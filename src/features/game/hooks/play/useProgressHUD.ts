
import { useGameStore } from '../../store/useGameStore';

export const useProgressHUD = () => {
    const currentLevel = useGameStore(s => s.currentLevel);
    const coordinates = useGameStore(s => s.coordinates);
    const timeLeft = useGameStore(s => s.timeLeft);
    const lives = useGameStore(s => s.lives);
    
    const totalSteps = coordinates.length > 0 ? coordinates.length - 1 : 1;
    const progressWidth = Math.min(100, (currentLevel / totalSteps) * 100);

    return {
        progressWidth,
        timeLeft,
        lives,
        currentLevel,
        totalSteps
    };
};
