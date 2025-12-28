
export enum GameState {
  WELCOME = 'WELCOME',
  SHOP = 'SHOP',
  PLAYING = 'PLAYING',
  VICTORY = 'VICTORY',
  GAME_OVER = 'GAME_OVER',
  HISTORY = 'HISTORY'
}

export interface Coordinate {
  x: number;
  y: number;
}

export interface LogEntry {
    id: string;
    text: string;
    type: 'info' | 'success' | 'warning' | 'error' | 'system' | 'hint';
    timestamp: string;
}
