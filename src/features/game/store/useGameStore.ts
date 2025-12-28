
import { create } from 'zustand';
import { GameState, LogEntry } from '../types/common';
import { Question, GameHistoryEntry } from '../types/entities';
import { Coordinate } from '../types/common';
import { UserInfo } from './slices/createPlayerSlice';

// Import New Data-Driven Slices
import { createSystemSlice, SystemSlice } from './slices/createSystemSlice';
import { createPlayerSlice, PlayerSlice } from './slices/createPlayerSlice';
import { createGameSessionSlice, GameSessionSlice } from './slices/createGameSessionSlice';

// Combine Types
export type GameStoreState = SystemSlice & PlayerSlice & GameSessionSlice;

// Create Store using Slice Pattern
export const useGameStore = create<GameStoreState>()((...a) => ({
  ...createSystemSlice(...a),
  ...createPlayerSlice(...a),
  ...createGameSessionSlice(...a),
}));

/**
 * HELPER: gameActions
 * Mapping actions để dùng ngoài React Component (giữ tính tương thích)
 */
export const gameActions = {
    // SYSTEM ACTIONS
    setGameState: (s: GameState) => useGameStore.getState().setGameState(s),
    addLog: (t: string, type: LogEntry['type']) => useGameStore.getState().addLog(t, type),
    setModalState: (o: boolean, p?: {x: number, y: number}) => useGameStore.getState().setModalState(o, p),
    setShowConfetti: (s: boolean) => useGameStore.getState().setShowConfetti(s),
    setPreviewSkinId: (id: string) => useGameStore.getState().setPreviewSkinId(id),

    // PLAYER ACTIONS
    setUserInfo: (i: Partial<UserInfo>) => useGameStore.getState().setUserInfo(i),
    setSelectedSkin: (id: string) => useGameStore.getState().setSelectedSkin(id),
    buySkin: (id: string, price: number) => useGameStore.getState().buySkin(id, price),
    addToHistory: (e: GameHistoryEntry) => useGameStore.getState().addToHistory(e),
    clearHistory: () => useGameStore.getState().clearHistory(),

    // GAME SESSION ACTIONS
    startGame: (q: Question[], c: Coordinate[]) => useGameStore.getState().startGame(q, c),
    resetGame: () => useGameStore.getState().resetGame(),
    setScore: (s: number) => useGameStore.getState().setScore(s),
    setTime: (t: number) => useGameStore.getState().setTime(t),
    decrementLives: () => useGameStore.getState().decrementLives(),
    setCurrentStep: (s: number) => useGameStore.getState().setCurrentStep(s),
    setInputAnswer: (a: string) => useGameStore.getState().setInputAnswer(a),
    setInputSubmitting: (s: boolean) => useGameStore.getState().setInputSubmitting(s),
    
    // EVENTS
    triggerEventCheck: () => useGameStore.getState().triggerEventCheck(),
    setEventStage: (s: 'init' | 'animating' | 'modal' | null) => useGameStore.getState().setEventStage(s),
    resolveActiveEvent: () => useGameStore.getState().resolveActiveEvent(),
};
