
import { StateCreator } from 'zustand';
import { GameState, LogEntry } from '../../types/common';

interface ModalState {
    isOpen: boolean;
    position: { x: number; y: number };
}

export interface SystemSlice {
    // --- APP STATE ---
    gameState: GameState;
    
    // --- GLOBAL UI STATE ---
    logs: LogEntry[];
    modalState: ModalState;
    showConfetti: boolean;
    previewSkinId: string; // Trạng thái UI tạm thời khi xem skin (chưa mua/chưa chọn)

    // --- ACTIONS ---
    setGameState: (state: GameState) => void;
    
    // Logs
    addLog: (text: string, type: LogEntry['type']) => void;
    clearLogs: () => void;
    
    // UI Helpers
    setModalState: (isOpen: boolean, position?: { x: number; y: number }) => void;
    setShowConfetti: (show: boolean) => void;
    setPreviewSkinId: (id: string) => void;
}

export const createSystemSlice: StateCreator<SystemSlice> = (set) => ({
    gameState: GameState.WELCOME,
    logs: [],
    modalState: { isOpen: false, position: { x: 0, y: 0 } },
    showConfetti: false,
    previewSkinId: 'apollo',

    setGameState: (state) => set({ gameState: state }),

    addLog: (text, type) => set((s) => {
        const newLog: LogEntry = {
            id: Date.now().toString() + Math.random(),
            text,
            type,
            timestamp: new Date().toLocaleTimeString('en-GB', { hour12: false })
        };
        // Keep last 50 logs
        return { logs: [newLog, ...s.logs].slice(0, 50) };
    }),

    clearLogs: () => set({ logs: [] }),

    setModalState: (isOpen, position) => set((s) => ({
        modalState: {
            isOpen,
            position: position || s.modalState.position
        }
    })),

    setShowConfetti: (showConfetti) => set({ showConfetti }),

    setPreviewSkinId: (previewSkinId) => set({ previewSkinId }),
});
