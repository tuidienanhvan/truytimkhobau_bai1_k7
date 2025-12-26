
import React from 'react';
import { useGameStore, gameActions } from '../store/useGameStore';
import { GameState } from '../types';
import { playSound } from '../utils/audio-manager';
import { saveMinigameResult } from '../data/game-api';
import { SCORE_CONFIG } from '../utils/score-engine';

interface UseInputTerminalProps {
    isVictoryPhase: boolean;
    question: { answer: string; hint: string };
    onSuccess?: () => void;
}

export const useInputTerminal = ({ isVictoryPhase, question, onSuccess }: UseInputTerminalProps) => {
    const currentLevel = useGameStore(s => s.currentLevel);
    const score = useGameStore(s => s.score);
    const coordinates = useGameStore(s => s.coordinates);
    const lives = useGameStore(s => s.lives);
    
    // Select input state directly from store inside logic if needed, 
    // but usually we just need to read it on submit.
    const inputState = useGameStore(s => s.inputState);

    const totalSteps = coordinates.length > 0 ? coordinates.length - 1 : 1;
    const normalizeAns = (a: string) => a ? a.trim().toLowerCase() : '';

    const onAnswerCorrect = () => {
        playSound('correct');
        const newScore = score + SCORE_CONFIG.CORRECT_ANSWER;
        gameActions.setScore(newScore);
        
        const nextStep = currentLevel + 1;
        if (onSuccess) onSuccess();

        if (nextStep >= totalSteps) {
            gameActions.setCurrentStep(nextStep);
            setTimeout(() => {
                gameActions.addLog("ĐÃ ĐẾN ĐÍCH.", "success");
                gameActions.addLog("Nhiệm vụ hoàn thành.", "system");
                playSound('win');
                gameActions.setGameState(GameState.VICTORY);
                gameActions.setShowConfetti(true);
                
                const finalScore = newScore + SCORE_CONFIG.VICTORY_BONUS;
                gameActions.setScore(finalScore);
                saveMinigameResult(finalScore, 'victory');
            }, 1500);
        } else {
            gameActions.setCurrentStep(nextStep);
        }
    };

    const onAnswerWrong = () => {
        playSound('wrong');
        
        if (lives > 1) {
            gameActions.decrementLives();
            gameActions.addLog(`LỖI: Tính toán sai!`, "error");
            gameActions.addLog(`CẢNH BÁO: Khiên chắn suy giảm.`, "warning");
        } else {
            gameActions.decrementLives();
            playSound('lose');
            gameActions.addLog("THẤT BẠI: Khiên chắn hỏng.", "error");
            saveMinigameResult(score, 'gameover');
            gameActions.setGameState(GameState.GAME_OVER);
        }
    };

    const handleSubmit = (e?: React.FormEvent) => {
        if(e) e.preventDefault();
        
        const answer = useGameStore.getState().inputState.answer;
        const isSubmitting = useGameStore.getState().inputState.isSubmitting;

        if (!answer.trim() || isSubmitting || isVictoryPhase) return;

        gameActions.setInputSubmitting(true);
        gameActions.addLog(`Đã nhận lệnh: "${answer}"`, "info");
        gameActions.addLog(`Đang xác thực tọa độ...`, "system");

        const userAns = normalizeAns(answer);
        const correctAns = normalizeAns(question.answer);

        setTimeout(() => {
            if (userAns === correctAns) {
                gameActions.addLog("Tọa độ ĐÃ XÁC NHẬN.", "success");
                gameActions.addLog("Kích hoạt động cơ đẩy...", "info");
                onAnswerCorrect();
                setTimeout(() => {
                    gameActions.setInputAnswer('');
                    gameActions.setInputSubmitting(false);
                }, 1000);
            } else {
                onAnswerWrong();
                setTimeout(() => gameActions.setInputSubmitting(false), 500);
            }
        }, 600);
    };

    const handleHint = () => {
        const isSubmitting = useGameStore.getState().inputState.isSubmitting;
        if (isVictoryPhase || isSubmitting) return;
        playSound('select');
        gameActions.addLog(`GỢI Ý: ${question.hint}`, "hint");
    };

    return {
        handleSubmit,
        handleHint
    };
};
