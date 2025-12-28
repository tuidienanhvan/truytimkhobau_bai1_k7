
export type EventType = 'instant_loss' | 'instant_win' | 'bonus_coin' | 'lose_coin' | 'nothing';
export type AnimationType = 'crash_land' | 'abduction' | 'wormhole';

export interface GameEvent {
    id: string;
    title: string;
    description: string;
    type: EventType;
    probability: number; // 0.0 to 1.0 (e.g. 0.05 is 5%)
    effectValue?: number; // Amount of coins, etc.
    icon?: string; // Icon identifier
    animationType?: AnimationType;
}
