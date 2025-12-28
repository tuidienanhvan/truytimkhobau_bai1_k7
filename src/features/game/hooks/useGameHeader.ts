
import { useGameStore, gameActions } from '../store/useGameStore';
import { GameState } from '../types/common';
import { playSound } from '../utils/audio-manager';

export const useGameHeader = (gameState: GameState) => {
    const coins = useGameStore(s => s.coins);

    const handleOpenShop = () => {
        playSound('click');
        gameActions.setGameState(GameState.SHOP);
    };

    const handleOpenHistory = () => {
        playSound('click');
        gameActions.setGameState(GameState.HISTORY);
    };

    const showNavButtons = gameState === GameState.WELCOME;

    return {
        coins,
        showNavButtons,
        handleOpenShop,
        handleOpenHistory
    };
};
