
export interface Question {
  id: number;
  question: string;
  answer: string;
  hint: string;
  explanation: string;
}

export interface GameStats {
  playCount: number;
  bestScore: number;
}

export interface GameHistoryEntry {
    id: string;
    timestamp: number;
    score: number;
    result: 'victory' | 'gameover';
    duration: number; // seconds
    totalSteps: number;
    accuracy: number; // percentage (optional context)
}
