
import { useEffect } from 'react';
import { useGameStore, gameActions } from '../../store/useGameStore';

export const useMissionLog = () => {
    const currentLevel = useGameStore(s => s.currentLevel);
    const logsLength = useGameStore(s => s.logs.length);

    useEffect(() => {
        if (currentLevel === 0 && logsLength === 0) {
            gameActions.addLog("KHỞI ĐỘNG HỆ THỐNG...", "system");
            setTimeout(() => gameActions.addLog("Đang tải các mô-đun cốt lõi...", "info"), 200);
            setTimeout(() => gameActions.addLog("Đang kết nối vệ tinh...", "info"), 400);
            setTimeout(() => gameActions.addLog("Kết nối thành công (12ms).", "success"), 700);
            setTimeout(() => gameActions.addLog("Trạng thái động cơ: ỔN ĐỊNH", "success"), 900);
            setTimeout(() => gameActions.addLog("Đang chờ lệnh từ phi công...", "warning"), 1200);
        }
    }, []);
};
