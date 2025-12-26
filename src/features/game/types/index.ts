
export enum GameState {
  WELCOME = 'WELCOME',
  SHOP = 'SHOP',
  PLAYING = 'PLAYING',
  VICTORY = 'VICTORY',
  GAME_OVER = 'GAME_OVER'
}

export interface Question {
  id: number;
  question: string;
  answer: string;
  hint: string;
  explanation: string;
}

export interface Coordinate {
  x: number;
  y: number;
}

export interface GameStats {
  playCount: number;
  bestScore: number;
}

// Moved from MissionLog component
export interface LogEntry {
    id: string;
    text: string;
    type: 'info' | 'success' | 'warning' | 'error' | 'system' | 'hint';
    timestamp: string;
}
