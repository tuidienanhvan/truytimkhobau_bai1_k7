
import { StateCreator } from 'zustand';
import { GameHistoryEntry } from '../../types/entities';

export interface UserStats {
    playCount: number;
    bestScore: number;
}

export interface UserInfo {
    name: string;
    stats: UserStats;
}

export interface PlayerSlice {
    // --- USER PROFILE ---
    userInfo: UserInfo;
    
    // --- INVENTORY & ECONOMY ---
    coins: number;
    ownedSkins: string[];
    selectedRocketId: string;
    
    // --- HISTORY ---
    gameHistory: GameHistoryEntry[];

    // --- ACTIONS ---
    setUserInfo: (info: Partial<UserInfo>) => void;
    
    // Economy
    modifyCoins: (amount: number) => void;
    buySkin: (id: string, price: number) => boolean;
    setSelectedSkin: (id: string) => void;
    
    // History
    addToHistory: (entry: GameHistoryEntry) => void;
    clearHistory: () => void;
}

export const createPlayerSlice: StateCreator<PlayerSlice> = (set, get) => ({
    userInfo: {
        name: 'Guest',
        stats: { playCount: 0, bestScore: 0 }
    },
    
    coins: 1000,
    ownedSkins: ['apollo'],
    selectedRocketId: 'apollo',
    
    gameHistory: [],

    setUserInfo: (info) => set((s) => ({
        userInfo: { ...s.userInfo, ...info }
    })),

    modifyCoins: (amount) => set((s) => ({ 
        coins: Math.max(0, s.coins + amount) 
    })),

    buySkin: (id, price) => {
        const { coins, ownedSkins } = get();
        if (ownedSkins.includes(id)) return true;
        if (coins >= price) {
            set({
                coins: coins - price,
                ownedSkins: [...ownedSkins, id]
            });
            return true;
        }
        return false;
    },

    setSelectedSkin: (selectedRocketId) => set({ selectedRocketId }),

    addToHistory: (entry) => set((s) => {
        const currentBest = s.userInfo.stats.bestScore;
        const newBest = Math.max(currentBest, entry.score);
        
        // Auto update best score
        let updatedUserInfo = s.userInfo;
        if (newBest > currentBest) {
            updatedUserInfo = {
                ...s.userInfo,
                stats: {
                    ...s.userInfo.stats,
                    bestScore: newBest
                }
            };
        }

        return {
            gameHistory: [entry, ...s.gameHistory].slice(0, 50),
            userInfo: updatedUserInfo
        };
    }),

    clearHistory: () => set({ gameHistory: [] }),
});
