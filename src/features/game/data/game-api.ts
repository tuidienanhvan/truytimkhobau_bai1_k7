
import { formatGameResult } from '../utils/score-engine';

export async function saveMinigameResult(score: number, result: 'victory' | 'gameover' | 'stop') {
  // Sử dụng Score Engine để format dữ liệu
  const resultData = formatGameResult(score, result);

  // Log ra console đúng format yêu cầu
  console.log("[Game] Gửi kết quả ra Bridge:", resultData);

  const payload = {
    type: 'MINIGAME_ACTION',
    action: 'SAVE_RESULT',
    data: resultData
  };

  if (window.parent && window.parent !== window) {
    window.parent.postMessage(payload, '*');
  } else {
    console.log("⚠️ [Dev Mode] Result Saved:", JSON.stringify(payload, null, 2));
  }
}
