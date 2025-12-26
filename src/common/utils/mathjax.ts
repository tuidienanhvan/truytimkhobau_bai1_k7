
/**
 * Utility xử lý hiển thị công thức toán học bằng MathJax
 * Giúp tách biệt logic gọi window.MathJax khỏi các React Component
 */

export const renderMath = (element: HTMLElement | null): Promise<void> => {
  // 1. Nếu không có element, không làm gì cả
  if (!element) return Promise.resolve();
  
  // 2. Lấy đối tượng MathJax từ window
  const MathJax = (window as any).MathJax;

  // 3. Kiểm tra MathJax đã sẵn sàng chưa
  if (!MathJax || !MathJax.typesetPromise) {
    // Nếu chưa load xong script MathJax, ta bỏ qua (hoặc có thể retry logic nếu cần thiết)
    return Promise.resolve();
  }

  // 4. Thực hiện render (typeset)
  // MathJax.typesetPromise nhận vào mảng các element cần render
  return MathJax.typesetPromise([element])
    .catch((err: any) => {
      console.warn('[MathJax Utility] Rendering error:', err);
    });
};
