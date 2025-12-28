
import { GameEvent } from '../types/events';

/**
 * DANH SÁCH SỰ KIỆN NGẪU NHIÊN
 * Để thêm sự kiện mới, chỉ cần copy object và sửa nội dung.
 */
export const RANDOM_EVENTS: GameEvent[] = [
    {
        id: 'out_of_fuel',
        title: 'HẾT XĂNG GIỮA ĐƯỜNG',
        description: 'Đang bay thì phi thuyền báo đèn đỏ. Bạn chợt nhớ ra sáng nay quên đổ xăng ở trạm Vũ trụ 59. Tàu trôi tự do vô định...',
        type: 'instant_loss',
        probability: 1, // Tỷ lệ 20% mỗi lượt đi
        icon: 'fuel',
        animationType: 'crash_land'
    }
];

// Hàm random chọn sự kiện
export const rollForEvent = (): GameEvent | null => {
    const roll = Math.random();
    
    // Cộng dồn xác suất để check
    let cumulativeProbability = 0;
    
    for (const event of RANDOM_EVENTS) {
        cumulativeProbability += event.probability;
        if (roll < cumulativeProbability) {
            return event;
        }
    }
    
    return null; // Không có sự kiện gì xảy ra
};
