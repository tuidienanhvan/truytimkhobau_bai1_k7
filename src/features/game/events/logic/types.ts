
import { Coordinate } from '../../../types/common';

export interface EventHandlerContext {
    board: any;           // JSXGraph board instance
    rocket: any;          // Rocket object (JSXGraph element)
    startCoord: Coordinate;
    endCoord: Coordinate;
    onFinish: () => void; // Callback khi animation kết thúc (để trigger Game Over hoặc Next Level)
}

export interface EventHandler {
    animate: (context: EventHandlerContext) => void;
}
