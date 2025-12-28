
import { useGameStore, gameActions } from '../../store/useGameStore';

// Import smaller hooks (Same folder)
import { useMissionLog } from './useMissionLog';
import { useProgressHUD } from './useProgressHUD';
import { useRadarHUD } from './useRadarHUD';
import { useInputTerminal } from './useInputTerminal';
import { useGameTimer } from './useGameTimer';
import { useGameAudio } from './useGameAudio';
import { useQuestionModal } from './useQuestionModal';

export const usePlayScreen = () => {
    const currentLevel = useGameStore(s => s.currentLevel);
    const coordinates = useGameStore(s => s.coordinates);
    const questions = useGameStore(s => s.questions);

    useMissionLog();
    useGameTimer(gameActions.addLog);
    useGameAudio();

    const { progressWidth, timeLeft, lives } = useProgressHUD();
    const { cursorPos, nextCoord, handleCursorMove } = useRadarHUD();
    const { handlePointClick, closeModal } = useQuestionModal(currentLevel);

    const question = questions[currentLevel] || {
        id: -1,
        question: "System Processing...",
        answer: "",
        hint: "Please wait",
        explanation: ""
    };
    
    const totalSteps = coordinates.length > 0 ? coordinates.length - 1 : 1;
    const isVictoryPhase = currentLevel >= totalSteps;

    const { handleSubmit, handleHint } = useInputTerminal({
        isVictoryPhase,
        question,
        onSuccess: closeModal
    });

    return {
        currentStep: currentLevel,
        coordinates,
        handleCursorMove,
        handlePointClick,
        progressWidth,
        timeLeft,
        lives,
        cursorPos,
        nextCoord,
        question,
        isVictoryPhase,
        handleSubmit,
        handleHint
    };
};
