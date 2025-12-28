
import { useEffect, useRef } from 'react';
import { useGameStore, gameActions } from '../../store/useGameStore';
import { GameState } from '../../types/common';
import { saveMinigameResult } from '../../data/game-api';
import { playSound } from '../../utils/audio-manager';

// 69, 70. Timer Architecture with endTime (No setInterval)
export const useGameTimer = (addLog: (text: string, type: any) => void) => {
    const gameState = useGameStore(s => s.gameState);
    const score = useGameStore(s => s.score);
    
    const endTimeRef = useRef<number>(0);
    const rafRef = useRef<number | null>(null);

    // 71. Auto-sync on visibility change
    useEffect(() => {
        const handleVis = () => {
            if (!document.hidden && gameState === GameState.PLAYING) {
                // Force update immediately
                const msRemaining = endTimeRef.current - Date.now();
                const secondsRemaining = Math.max(0, Math.ceil(msRemaining / 1000));
                
                const currentStoreTime = useGameStore.getState().timeLeft;
                if (secondsRemaining !== currentStoreTime && secondsRemaining >= 0) {
                     gameActions.setTime(secondsRemaining);
                }
            }
        };
        document.addEventListener('visibilitychange', handleVis);
        return () => document.removeEventListener('visibilitychange', handleVis);
    }, [gameState]);

    useEffect(() => {
        if (gameState !== GameState.PLAYING) {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
                rafRef.current = null;
            }
            return;
        }

        // Set end time ONCE when game starts/resumes
        const currentTimeLeft = useGameStore.getState().timeLeft;
        endTimeRef.current = Date.now() + (currentTimeLeft * 1000);

        const loop = () => {
            const msRemaining = endTimeRef.current - Date.now();
            const secondsRemaining = Math.max(0, Math.ceil(msRemaining / 1000));

            const currentStoreTime = useGameStore.getState().timeLeft;
            
            // 48. Update UI only when second changes
            if (secondsRemaining !== currentStoreTime) {
                // 72. Game Over Check
                if (secondsRemaining <= 0) {
                    gameActions.setTime(0);
                    playSound('lose');
                    addLog("HẾT GIỜ.", "error");
                    
                    // History Record
                    const state = useGameStore.getState();
                    gameActions.addToHistory({
                        id: Date.now().toString(),
                        timestamp: Date.now(),
                        score: state.score,
                        result: 'gameover',
                        duration: 300, 
                        totalSteps: state.coordinates.length > 0 ? state.coordinates.length - 1 : 1,
                        accuracy: Math.round((state.currentLevel / (state.coordinates.length - 1 || 1)) * 100)
                    });

                    saveMinigameResult(state.score, 'gameover');
                    gameActions.setGameState(GameState.GAME_OVER);
                    return; // Stop loop
                } 
                
                gameActions.setTime(secondsRemaining);

                if (currentStoreTime > 10 && secondsRemaining <= 10) {
                     addLog("CẢNH BÁO: CÒN 10 GIÂY", "warning");
                }
                if (secondsRemaining <= 10 && secondsRemaining > 0) {
                    playSound('heartbeat');
                }
            }

            rafRef.current = requestAnimationFrame(loop);
        };

        rafRef.current = requestAnimationFrame(loop);

        return () => {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, [gameState, addLog]);
};
