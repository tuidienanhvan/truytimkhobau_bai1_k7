
import { useGameStore } from '../store/useGameStore';

// Import smaller hooks
import { useMissionLog } from './useMissionLog';
import { useProgressHUD } from './useProgressHUD';
import { useRadarHUD } from './useRadarHUD';
import { useInputTerminal } from './useInputTerminal';
import { useGameTimer } from './useGameTimer';
import { useGameAudio } from './useGameAudio';
import { useQuestionModal } from './useQuestionModal';
import { gameActions } from '../store/useGameStore';

export const usePlayScreen = () => {
    // 1. Shared Data (Atomic Selectors)
    const currentLevel = useGameStore(s => s.currentLevel);
    const coordinates = useGameStore(s => s.coordinates);
    const questions = useGameStore(s => s.questions);

    // 2. Init Side Effects (Boot logs, Timer, Audio)
    useMissionLog();
    useGameTimer(gameActions.addLog);
    useGameAudio();

    // 3. Component Specific Hooks
    const { progressWidth, timeLeft, lives } = useProgressHUD();
    const { cursorPos, nextCoord, handleCursorMove } = useRadarHUD();
    const { handlePointClick, closeModal } = useQuestionModal(currentLevel);

    // Safe fallback for question data
    const question = questions[currentLevel] || {
        id: -1,
        question: "System Processing...",
        answer: "",
        hint: "Please wait",
        explanation: ""
    };
    
    const totalSteps = coordinates.length > 0 ? coordinates.length - 1 : 1;
    const isVictoryPhase = currentLevel >= totalSteps;

    // 4. Input Logic
    const { handleSubmit, handleHint } = useInputTerminal({
        isVictoryPhase,
        question,
        onSuccess: closeModal
    });

    return {
        // GraphBoard
        currentStep: currentLevel,
        coordinates,
        handleCursorMove,
        handlePointClick,

        // Status
        progressWidth,
        timeLeft,
        lives,

        // Radar
        cursorPos,
        nextCoord,

        // Question Data
        question,
        isVictoryPhase,
        
        // Input Logic
        handleSubmit,
        handleHint
    };
};
