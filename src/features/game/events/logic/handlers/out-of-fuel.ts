
import { EventHandler, EventHandlerContext } from '../types';

export const OutOfFuelHandler: EventHandler = {
    animate: ({ board, rocket, startCoord, endCoord, onFinish }: EventHandlerContext) => {
        
        // 1. Tính toán điểm giữa đường (nơi xảy ra sự cố)
        const midX = (startCoord.x + endCoord.x) / 2;
        const midY = (startCoord.y + endCoord.y) / 2;

        // 2. Tính góc quay để đầu tàu hướng về phía trước
        const dx = (endCoord.x - startCoord.x) * board.unitX;
        const dy = (endCoord.y - startCoord.y) * -board.unitY; // JSXGraph y-axis invert
        const rotationDeg = (Math.atan2(dy, dx) * (180 / Math.PI)) + 90;

        // Apply góc quay ban đầu
        if (rocket.rendNode) {
            rocket.rendNode.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'; 
            rocket.rendNode.style.transform = `rotate(${rotationDeg}deg)`;
        }

        // 3. Giai đoạn 1: Bay bình thường đến điểm giữa
        rocket.moveTo([midX, midY], 1000, {
            effect: '<>', // Ease in-out
            callback: () => {
                
                // 4. Giai đoạn 2: Sự cố xảy ra!
                // Hiệu ứng rơi tự do xuống đáy màn hình (y = -6)
                
                if (rocket.rendNode) {
                    // Xoay vòng vòng mất kiểm soát
                    rocket.rendNode.style.transition = 'transform 1.5s ease-in';
                    rocket.rendNode.style.transform = `rotate(${rotationDeg + 720}deg) scale(0.5)`;
                    rocket.rendNode.style.filter = 'grayscale(100%) brightness(0.5)'; // Tàu mất điện
                }

                // Rơi xuống
                rocket.moveTo([midX, -6], 1500, {
                    effect: '<>', // Ease in (rơi nhanh dần)
                    callback: () => {
                        // Animation xong, gọi callback để xử lý Game Over
                        onFinish();
                    }
                });
            }
        });
    }
};
