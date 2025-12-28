
/**
 * SCORE ENGINE - Centralized scoring logic
 */

export const SCORE_CONFIG = {
  CORRECT_ANSWER: 100,
  VICTORY_BONUS: 600,
  XP_MULTIPLIER: 10,
  GOLD_MULTIPLIER: 5,
};

/**
 * Tính toán XP dựa trên điểm số
 */
export const calculateXP = (score: number): number => score * SCORE_CONFIG.XP_MULTIPLIER;

/**
 * Tính toán Gold dựa trên điểm số
 */
export const calculateGold = (score: number): number => score * SCORE_CONFIG.GOLD_MULTIPLIER;

/**
 * Interface cho dữ liệu kết quả game theo chuẩn PiStudy
 */
export interface GameResultData {
  gameKey: string;
  score: number;
  result: 'victory' | 'gameover' | 'stop';
  xp: number;
  gold: number;
}

/**
 * Tạo payload kết quả game hoàn chỉnh
 */
export const formatGameResult = (
  score: number, 
  result: 'victory' | 'gameover' | 'stop'
): GameResultData => {
  return {
    gameKey: "minigame-san-nhung-vi-sao",
    score: score,
    result: result,
    xp: calculateXP(score),
    gold: calculateGold(score)
  };
};
