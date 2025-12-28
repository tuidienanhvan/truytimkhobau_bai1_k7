
import { EventHandler } from './types';
import { OutOfFuelHandler } from './handlers/out-of-fuel.ts';

// Map ID của event (trong game-events.ts) với Handler xử lý
const EVENT_REGISTRY: Record<string, EventHandler> = {
    'out_of_fuel': OutOfFuelHandler,
    // Sau này thêm các event khác vào đây:
    // 'black_hole': BlackHoleHandler,
    // 'alien_attack': AlienAttackHandler,
};

export const getEventHandler = (eventId: string): EventHandler | null => {
    return EVENT_REGISTRY[eventId] || null;
};
