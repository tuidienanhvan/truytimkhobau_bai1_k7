
import { StateCreator } from 'zustand';
import { Coordinate, GameState } from '../../types/common';
import { Question } from '../../types/entities';
import { GameEvent } from '../../types/events';
import { rollForEvent } from '../../data/game-events';

// Imports types for dependency injection
import { SystemSlice } from './createSystemSlice';
import { PlayerSlice } from './createPlayerSlice';

interface InputState {
    answer: string;
    isSubmitting: boolean;
}

export interface GameSessionSlice {
    // --- SESSION STATE ---
    currentLevel: number;
    score: number;
    lives: number;
    timeLeft: number;
    
    // --- DATA ASSETS ---
    questions: Question[];
    coordinates: Coordinate[];
    
    // --- INPUT ---
    inputState: InputState;
    
    // --- EVENTS ---
    activeEvent: GameEvent | null;
    eventStage: 'init' | 'animating' | 'modal' | null;

    // --- ACTIONS ---
    startGame: (questions: Question[], coordinates: Coordinate[]) => void;
    resetGame: () => void;
    
    // Session Modifiers
    setScore: (score: number) => void;
    setTime: (time: number) => void;
    decrementLives: () => void;
    setCurrentStep: (step: number) => void;
    
    // Input Handling
    setInputAnswer: (ans: string) => void;
    setInputSubmitting: (isSubmitting: boolean) => void;
    
    // Event System
    triggerEventCheck: () => boolean;
    setEventStage: (stage: 'init' | 'animating' | 'modal' | null) => void;
    resolveActiveEvent: () => void;
}

// Slice này phụ thuộc vào SystemSlice (để setGameState, clearLogs) và PlayerSlice (để update stats, coins)
export const createGameSessionSlice: StateCreator<
    GameSessionSlice & SystemSlice & PlayerSlice,
    [],
    [],
    GameSessionSlice
> = (set, get) => ({
    currentLevel: 0,
    score: 0,
    lives: 3,
    timeLeft: 300,
    questions: [],
    coordinates: [],
    inputState: { answer: '', isSubmitting: false },
    activeEvent: null,
    eventStage: null,

    startGame: (questions, coordinates) => {
        // 1. Reset System UI
        get().clearLogs();
        get().setShowConfetti(false);
        get().setModalState(false);
        get().setGameState(GameState.PLAYING);

        // 2. Update Player Stats (Play Count)
        const currentUser = get().userInfo;
        get().setUserInfo({
            stats: {
                ...currentUser.stats,
                playCount: currentUser.stats.playCount + 1
            }
        });

        // 3. Init Session State
        set({
            currentLevel: 0,
            score: 0,
            lives: 3,
            timeLeft: 300,
            questions,
            coordinates,
            activeEvent: null,
            eventStage: null,
            inputState: { answer: '', isSubmitting: false },
        });
    },

    resetGame: () => {
        get().setShowConfetti(false);
        get().setGameState(GameState.WELCOME);
    },

    setScore: (score) => set({ score }),
    setTime: (timeLeft) => set({ timeLeft }),
    decrementLives: () => set((s) => ({ lives: Math.max(0, s.lives - 1) })),
    setCurrentStep: (currentLevel) => set({ currentLevel }),

    setInputAnswer: (answer) => set((s) => ({
        inputState: { ...s.inputState, answer }
    })),

    setInputSubmitting: (isSubmitting) => set((s) => ({
        inputState: { ...s.inputState, isSubmitting }
    })),

    triggerEventCheck: () => {
        const event = rollForEvent();
        if (event) {
            // Apply immediate effects to Player Economy
            if (event.type === 'bonus_coin' && event.effectValue) {
                get().modifyCoins(event.effectValue);
            }
            if (event.type === 'lose_coin' && event.effectValue) {
                get().modifyCoins(-event.effectValue);
            }

            set({
                activeEvent: event,
                eventStage: 'init'
            });
            return true;
        }
        return false;
    },

    setEventStage: (stage) => set({ eventStage: stage }),
    resolveActiveEvent: () => set({ activeEvent: null, eventStage: null }),
});
