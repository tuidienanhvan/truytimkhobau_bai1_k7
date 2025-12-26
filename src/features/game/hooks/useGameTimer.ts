
import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/useGameStore';
import { GameState } from '../types';
import { saveMinigameResult } from '../data/game-api';
import { playSound } from '../utils/audio-manager';

export const useGameTimer = (addLog: (text: string, type: any) => void) => {
    const gameState = useGameStore(s => s.gameState);
    const actions = useGameStore(s => s.actions);
    
    // FIX #67: Timer chống đổi tab: endTime - Date.now()
    const endTimeRef = useRef<number>(0);
    const rafRef = useRef<number | null>(null);

    // FIX #85: Visibility Change Force Update
    useEffect(() => {
        const handleVis = () => {
            if (!document.hidden && gameState === GameState.PLAYING) {
                // Force check timer immediately when tab becomes visible
                const now = Date.now();
                const msRemaining = endTimeRef.current - now;
                const secondsRemaining = Math.max(0, Math.ceil(msRemaining / 1000));
                
                const currentStoreTime = useGameStore.getState().timeLeft;
                if (secondsRemaining !== currentStoreTime && secondsRemaining >= 0) {
                     actions.setTime(secondsRemaining);
                }
            }
        };
        document.addEventListener('visibilitychange', handleVis);
        return () => document.removeEventListener('visibilitychange', handleVis);
    }, [gameState, actions]);

    useEffect(() => {
        if (gameState === GameState.PLAYING) {
            // 1. Calculate Target End Time.
            const currentTimeLeft = useGameStore.getState().timeLeft;
            endTimeRef.current = Date.now() + (currentTimeLeft * 1000);

            const loop = () => {
                const now = Date.now();
                // 2. Calculate remaining time based on Delta (Target - Now)
                const msRemaining = endTimeRef.current - now;
                const secondsRemaining = Math.max(0, Math.ceil(msRemaining / 1000));

                // 3. Sync with Store
                // FIX #68: Timer UI chỉ update khi "giây đổi"
                const currentStoreTime = useGameStore.getState().timeLeft;
                
                if (secondsRemaining !== currentStoreTime) {
                    // Check Game Over
                    if (secondsRemaining <= 0) {
                        actions.setTime(0);
                        playSound('lose');
                        addLog("NGUY HIỂM: HẾT DƯỠNG KHÍ.", "error");
                        saveMinigameResult(useGameStore.getState().score, 'gameover');
                        actions.setGameState(GameState.GAME_OVER);
                        return; // Stop loop
                    } 
                    
                    // Update Time
                    actions.setTime(secondsRemaining);

                    // Effects & Warnings
                    if (currentStoreTime > 10 && secondsRemaining <= 10) {
                         addLog("CẢNH BÁO: DƯỠNG KHÍ SẮP HẾT - CÒN 10 GIÂY", "warning");
                    }
                    if (secondsRemaining <= 10 && secondsRemaining > 0) {
                        playSound('heartbeat');
                    }
                }

                rafRef.current = requestAnimationFrame(loop);
            };

            // Start the loop
            rafRef.current = requestAnimationFrame(loop);
        } else {
            // Cleanup
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
                rafRef.current = null;
            }
        }

        return () => {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, [gameState, actions, addLog]);
};
