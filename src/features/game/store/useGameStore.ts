
import { create } from 'zustand';
import { GameState, Question, Coordinate, LogEntry } from '../types';

interface UserStats {
  playCount: number;
  bestScore: number;
}

interface UserInfo {
  name: string;
  stats: UserStats;
}

interface ModalState {
    isOpen: boolean;
    position: { x: number; y: number };
}

interface InputState {
    answer: string;
    isSubmitting: boolean;
}

interface GameStoreState {
  // --- CORE STATES ---
  gameState: GameState;
  currentLevel: number; 
  score: number;
  lives: number;
  timeLeft: number;
  
  // --- STORE / ECONOMY ---
  coins: number;
  selectedRocketId: string;
  previewSkinId: string; 
  ownedSkins: string[]; 
  
  // --- SESSION DATA ---
  questions: Question[];
  coordinates: Coordinate[];
  
  // --- UI/UX GLOBAL STATES ---
  userInfo: UserInfo;
  showConfetti: boolean;
  
  // NEW: OPTIMIZED UI STATES (Moved from local to global)
  logs: LogEntry[];
  modalState: ModalState;
  inputState: InputState;

  // --- ACTIONS ---
  actions: {
    startGame: (questions: Question[], coordinates: Coordinate[]) => void;
    setGameState: (s: GameState) => void;
    setUserInfo: (info: { name: string; stats?: Partial<UserStats> }) => void;
    setScore: (s: number) => void;
    setCurrentStep: (s: number) => void;
    decrementLives: () => void;
    setTime: (seconds: number) => void;
    setShowConfetti: (show: boolean) => void;
    
    setSelectedSkin: (id: string) => void;
    setPreviewSkinId: (id: string) => void;
    buySkin: (id: string, cost: number) => boolean; 
    
    resetGame: () => void;

    // New Actions
    addLog: (text: string, type: LogEntry['type']) => void;
    setModalState: (isOpen: boolean, position?: { x: number, y: number }) => void;
    setInputAnswer: (ans: string) => void;
    setInputSubmitting: (isSubmitting: boolean) => void;
  };
}

const INITIAL_LIVES = 3;
const INITIAL_TIME = 300; 

export const useGameStore = create<GameStoreState>((set, get) => ({
  gameState: GameState.WELCOME,
  currentLevel: 0,
  score: 0,
  lives: INITIAL_LIVES,
  timeLeft: INITIAL_TIME,
  
  // Economy defaults
  coins: 100000, 
  selectedRocketId: 'apollo',
  previewSkinId: 'apollo',
  ownedSkins: ['apollo'],
  
  questions: [],
  coordinates: [],
  showConfetti: false,
  userInfo: {
    name: 'PHI CÔNG',
    stats: { playCount: 0, bestScore: 0 }
  },

  // Initial Optimized States
  logs: [],
  modalState: { isOpen: false, position: { x: 0, y: 0 } },
  inputState: { answer: '', isSubmitting: false },

  actions: {
    startGame: (questions, coordinates) => set({ 
      gameState: GameState.PLAYING,
      currentLevel: 0,
      score: 0,
      lives: INITIAL_LIVES,
      timeLeft: INITIAL_TIME,
      questions,
      coordinates,
      showConfetti: false,
      // Reset UI states
      logs: [],
      modalState: { isOpen: false, position: { x: 0, y: 0 } },
      inputState: { answer: '', isSubmitting: false }
    }),

    setGameState: (s) => set({ gameState: s }),

    setUserInfo: (info) => set((state) => ({
      userInfo: {
        name: info.name,
        stats: { ...state.userInfo.stats, ...info.stats }
      }
    })),

    setScore: (s) => set({ score: s }),
    setCurrentStep: (s) => set({ currentLevel: s }),
    setSelectedSkin: (id) => set({ selectedRocketId: id }),
    setPreviewSkinId: (id) => set({ previewSkinId: id }),
    
    buySkin: (id, cost) => {
        const state = get();
        if (state.coins >= cost && !state.ownedSkins.includes(id)) {
            set({ 
                coins: state.coins - cost,
                ownedSkins: [...state.ownedSkins, id]
            });
            return true;
        }
        return false;
    },

    decrementLives: () => {
      const current = get().lives;
      if (current > 0) set({ lives: current - 1 });
    },

    setTime: (seconds) => set({ timeLeft: Math.max(0, seconds) }),
    setShowConfetti: (show) => set({ showConfetti: show }),

    resetGame: () => set({ 
      gameState: GameState.WELCOME,
      currentLevel: 0,
      score: 0,
      lives: INITIAL_LIVES,
      timeLeft: INITIAL_TIME,
      showConfetti: false,
      logs: [],
      modalState: { isOpen: false, position: { x: 0, y: 0 } },
      inputState: { answer: '', isSubmitting: false }
    }),

    // --- NEW ACTIONS IMPLEMENTATION ---
    addLog: (text, type) => {
        const now = new Date();
        const timeString = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}`;
        const newLog: LogEntry = {
            id: Date.now().toString() + Math.random(),
            text,
            type,
            timestamp: timeString
        };
        set(state => ({ logs: [...state.logs.slice(-30), newLog] }));
    },

    setModalState: (isOpen, position) => set(state => ({
        modalState: {
            isOpen,
            position: position || state.modalState.position
        },
        // Reset input when opening new modal
        inputState: isOpen ? { answer: '', isSubmitting: false } : state.inputState
    })),

    setInputAnswer: (ans) => set(state => ({
        inputState: { ...state.inputState, answer: ans }
    })),

    setInputSubmitting: (isSubmitting) => set(state => ({
        inputState: { ...state.inputState, isSubmitting }
    }))
  }
}));

export const gameActions = useGameStore.getState().actions;
