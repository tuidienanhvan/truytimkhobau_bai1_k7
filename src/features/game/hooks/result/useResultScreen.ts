
import { useGameStore, gameActions } from '../../store/useGameStore';
import { GameState } from '../../types/common';

export const useResultScreen = () => {
  const gameState = useGameStore(s => s.gameState);
  const score = useGameStore(s => s.score);
  
  const isVictory = gameState === GameState.VICTORY;

  const handleReset = () => {
      gameActions.resetGame();
  };

  return {
      isVictory,
      score,
      handleReset
  };
};
