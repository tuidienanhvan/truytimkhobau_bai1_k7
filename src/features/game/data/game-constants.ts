
import { Coordinate } from '../types/common';
import { Question } from '../types/entities';

// Hàm tạo tọa độ ngẫu nhiên
export const generateRandomCoordinates = (count: number = 9): Coordinate[] => {
    const coords: Coordinate[] = [{ x: 0, y: 0 }]; // Luôn bắt đầu từ (0,0)
    
    const getRandomCoord = () => {
        // Cập nhật: Giới hạn từ -5 đến 5, làm tròn đến 0.5
        const val = (Math.random() * 10) - 5; 
        return Math.round(val * 2) / 2; 
    };

    const getDistance = (p1: Coordinate, p2: Coordinate) => {
        return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    };

    let attempts = 0;
    while (coords.length < count && attempts < 1000) {
        const candidate = { x: getRandomCoord(), y: getRandomCoord() };
        
        // Kiểm tra khoảng cách tối thiểu với tất cả các điểm đã có (tránh chồng chéo)
        // Khoảng cách tối thiểu là 2 đơn vị để đồ thị thoáng
        const isFarEnough = coords.every(existing => getDistance(candidate, existing) > 2.0);
        
        // Đảm bảo không quá sát biên mới (-5 đến 5)
        // Cập nhật: Cho phép Y lên tới 4.5 vì khung đã vuông
        const isWithinBounds = Math.abs(candidate.x) <= 4.5 && Math.abs(candidate.y) <= 4.5;

        if (isFarEnough && isWithinBounds) {
            coords.push(candidate);
        }
        attempts++;
    }

    // Nếu không tìm đủ điểm do random (hiếm), fill tạm các điểm cơ bản
    while(coords.length < count) {
        coords.push({ x: (coords.length - 4) % 5, y: Math.floor(coords.length / 2) - 2 });
    }

    return coords;
};

// Ngân hàng câu hỏi lớn (Pool)
export const QUESTION_BANK: Question[] = [
  // --- DẠNG 1: ĐỔI PHÂN SỐ/HỖN SỐ RA SỐ THẬP PHÂN ---
  {
      id: 1,
      question: "Viết phân số $\\frac{-3}{2}$ dưới dạng số thập phân.",
      answer: "-1.5",
      hint: "Thực hiện phép chia $3 : 2$ rồi đặt dấu $(-)$ trước kết quả.",
      explanation: "$-3 : 2 = -1.5$"
  },
  {
      id: 2,
      question: "Viết phân số $\\frac{-1}{4}$ dưới dạng số thập phân.",
      answer: "-0.25",
      hint: "Ta biết $\\frac{1}{4} = 0.25$. Vậy $\\frac{-1}{4}$ là số đối của nó.",
      explanation: "$-1 : 4 = -0.25$"
  },
  {
      id: 3,
      question: "Viết hỗn số $1\\frac{1}{2}$ dưới dạng số thập phân.",
      answer: "1.5",
      hint: "Đổi hỗn số về tổng: $1 + \\frac{1}{2} = 1 + 0.5$.",
      explanation: "$1\\frac{1}{2} = 1.5$"
  },
  {
      id: 4,
      question: "Viết phân số $\\frac{4}{5}$ dưới dạng số thập phân.",
      answer: "0.8",
      hint: "Nhân cả tử và mẫu với $2$ để được phân số thập phân $\\frac{8}{10}$.",
      explanation: "$4 : 5 = 0.8$"
  },
  {
      id: 5,
      question: "Viết số hữu tỉ $\\frac{-7}{2}$ dưới dạng số thập phân.",
      answer: "-3.5",
      hint: "Tách phần nguyên: $\\frac{-7}{2} = - (3 + \\frac{1}{2})$.",
      explanation: "$-3.5$"
  },
  {
      id: 6,
      question: "Viết phân số $\\frac{1}{10}$ dưới dạng số thập phân.",
      answer: "0.1",
      hint: "Chia cho $10$ tức là dời dấu phẩy sang trái $1$ chữ số.",
      explanation: "$0.1$"
  },
  {
      id: 7,
      question: "Viết phân số $\\frac{-12}{100}$ dưới dạng số thập phân.",
      answer: "-0.12",
      hint: "Chia cho $100$ tức là dời dấu phẩy sang trái $2$ chữ số.",
      explanation: "$-0.12$"
  },
  {
      id: 8,
      question: "Viết hỗn số $-2\\frac{3}{4}$ dưới dạng số thập phân.",
      answer: "-2.75",
      hint: "Giữ nguyên phần nguyên $-2$, đổi phần phân số $\\frac{3}{4} = 0.75$.",
      explanation: "$-2.75$"
  },
  {
      id: 9,
      question: "Số thập phân của $\\frac{9}{2}$ là bao nhiêu?",
      answer: "4.5",
      hint: "Một nửa của $9$ là bao nhiêu?",
      explanation: "$4.5$"
  },
  {
      id: 10,
      question: "Viết $\\frac{-2}{5}$ dưới dạng số thập phân.",
      answer: "-0.4",
      hint: "Quy đồng mẫu số thành $10$: $\\frac{-2}{5} = \\frac{-4}{10}$.",
      explanation: "$-0.4$"
  },

  // --- DẠNG 2: SỐ ĐỐI ---
  {
      id: 11,
      question: "Tìm số đối của số hữu tỉ $-2.5$.",
      answer: "2.5",
      hint: "Số đối của số âm $x$ là số dương $|x|$.",
      explanation: "Số đối của $-2.5$ là $2.5$"
  },
  {
      id: 12,
      question: "Số đối của $5$ là bao nhiêu?",
      answer: "-5",
      hint: "Hai số đối nhau có tổng bằng $0$. $5 + (?) = 0$.",
      explanation: "$-5$"
  },
  {
      id: 13,
      question: "Số đối của $\\frac{-3}{4}$ là?",
      answer: "3/4",
      hint: "Chỉ cần bỏ dấu âm đi.",
      explanation: "$\\frac{3}{4}$ (hoặc 0.75)"
  },
  {
      id: 14,
      question: "Số đối của số $0$ là số nào?",
      answer: "0",
      hint: "Số nào cộng với $0$ bằng chính nó?",
      explanation: "$0$"
  },
  {
      id: 15,
      question: "Tìm số đối của $1.2$.",
      answer: "-1.2",
      hint: "Thêm dấu trừ vào trước số dương.",
      explanation: "$-1.2$"
  },
  {
      id: 16,
      question: "Số đối của $-(-5)$ là bao nhiêu?",
      answer: "-5",
      hint: "Rút gọn trước: $-(-5) = 5$. Tìm số đối của $5$.",
      explanation: "$-5$"
  },
  {
      id: 17,
      question: "Số đối của $\\frac{1}{3}$ là?",
      answer: "-1/3",
      hint: "Thêm dấu trừ vào tử số hoặc trước phân số.",
      explanation: "$\\frac{-1}{3}$"
  },
  {
      id: 18,
      question: "Tổng của một số và số đối của nó bằng bao nhiêu?",
      answer: "0",
      hint: "Ví dụ: $5 + (-5) = ?$",
      explanation: "Tổng hai số đối nhau luôn bằng $0$."
  },

  // --- DẠNG 3: GIÁ TRỊ TUYỆT ĐỐI ---
  {
      id: 20,
      question: "Tính giá trị tuyệt đối: $| -1.2 | = ?$",
      answer: "1.2",
      hint: "Khoảng cách từ $-1.2$ đến gốc $0$. Kết quả luôn không âm.",
      explanation: "$| -1.2 | = 1.2$"
  },
  {
      id: 21,
      question: "Tính $| -5 | + | 2 | = ?$",
      answer: "7",
      hint: "Tính từng giá trị tuyệt đối trước: $5 + 2$.",
      explanation: "$5 + 2 = 7$"
  },
  {
      id: 22,
      question: "Giá trị tuyệt đối của $0$ là?",
      answer: "0",
      hint: "Khoảng cách từ điểm $0$ đến chính nó.",
      explanation: "$0$"
  },
  {
      id: 23,
      question: "Tính $| -3.5 |$.",
      answer: "3.5",
      hint: "Bỏ dấu trừ của số âm đi.",
      explanation: "$3.5$"
  },
  {
      id: 24,
      question: "Nếu $|x| = 2$ thì $x$ bằng bao nhiêu? (Liệt kê giá trị dương)",
      answer: "2",
      hint: "Có hai số cách gốc $0$ một khoảng bằng $2$. Hãy chọn số dương.",
      explanation: "$x = 2$ hoặc $x = -2$."
  },
  {
      id: 25,
      question: "Tính $| 10 - 15 | = ?$",
      answer: "5",
      hint: "Tính trong ngoặc trước: $10 - 15 = -5$. Sau đó lấy trị tuyệt đối.",
      explanation: "$|-5| = 5$"
  },
  {
      id: 26,
      question: "Giá trị của $| -0.5 |$ là số dương hay âm? (Trả lời: duong/am)",
      answer: "duong",
      hint: "Giá trị tuyệt đối của một số khác $0$ luôn là số dương.",
      explanation: "Dương"
  },
  {
      id: 27,
      question: "Tính $| -\\frac{1}{2} |$ (viết dạng thập phân).",
      answer: "0.5",
      hint: "Đổi phân số ra thập phân trước hoặc sau khi lấy trị tuyệt đối.",
      explanation: "$0.5$"
  },

  // --- DẠNG 4: SO SÁNH ---
  {
      id: 30,
      question: "Điền dấu ($<, >, =$) : $-0.5 \\dots \\frac{-1}{5}$",
      answer: "<",
      hint: "Đổi $\\frac{-1}{5} = -0.2$. So sánh hai số âm: số nào có phần số lớn hơn thì nhỏ hơn.",
      explanation: "$-0.5 < -0.2$"
  },
  {
      id: 31,
      question: "So sánh: $\\frac{-3}{4}$ và $0$. Điền dấu ($<, >, =$).",
      answer: "<",
      hint: "Mọi số hữu tỉ âm đều nhỏ hơn $0$.",
      explanation: "$\\frac{-3}{4} < 0$"
  },
  {
      id: 32,
      question: "Số nào lớn hơn: $-0.75$ hay $-0.8$?",
      answer: "-0.75",
      hint: "Trên trục số, $-0.75$ nằm bên phải $-0.8$.",
      explanation: "$-0.75 > -0.8$"
  },
  {
      id: 33,
      question: "Điền dấu ($<, >, =$) : $1.2 \\dots \\frac{6}{5}$",
      answer: "=",
      hint: "Thực hiện phép chia $6 : 5$.",
      explanation: "$1.2 = 1.2$"
  },
  {
      id: 34,
      question: "Trong các số $-1, -3, 0$, số nào nhỏ nhất?",
      answer: "-3",
      hint: "Tìm số âm nằm xa gốc $0$ nhất về phía bên trái.",
      explanation: "$-3$"
  },
  {
      id: 35,
      question: "Số hữu tỉ dương lớn hơn số hữu tỉ âm đúng hay sai? (dung/sai)",
      answer: "dung",
      hint: "Số dương nằm bên phải số 0, số âm nằm bên trái số 0.",
      explanation: "Đúng."
  },

  // --- DẠNG 5: LÝ THUYẾT & TẬP HỢP ---
  {
      id: 40,
      question: "Kí hiệu tập hợp các số hữu tỉ là gì?",
      answer: "Q",
      hint: "Viết tắt của từ 'Quotient' (Thương).",
      explanation: "$\\mathbb{Q}$"
  },
  {
      id: 41,
      question: "Kí hiệu tập hợp các số nguyên là gì?",
      answer: "Z",
      hint: "Xuất phát từ tiếng Đức 'Zahlen'.",
      explanation: "$\\mathbb{Z}$"
  },
  {
      id: 42,
      question: "Kí hiệu tập hợp các số tự nhiên là gì?",
      answer: "N",
      hint: "Viết tắt của 'Natural numbers'.",
      explanation: "$\\mathbb{N}$"
  },
  {
      id: 43,
      question: "Số $0$ có phải số hữu tỉ không? (co/khong)",
      answer: "co",
      hint: "Số $0$ có viết được dưới dạng phân số $\\frac{0}{1}$ không?",
      explanation: "Có, vì $0$ viết được dưới dạng $\\frac{0}{1}$."
  },
  {
      id: 44,
      question: "Số tự nhiên $n$ có phải là số hữu tỉ không? (co/khong)",
      answer: "co",
      hint: "Mọi số tự nhiên đều có thể viết dưới dạng phân số mẫu là $1$.",
      explanation: "Có, $\\mathbb{N} \\subset \\mathbb{Q}$."
  },
  {
      id: 45,
      question: "Phân số $\\frac{a}{b}$ là số hữu tỉ khi $b$ khác mấy?",
      answer: "0",
      hint: "Phép chia cho số này không xác định.",
      explanation: "$b \\ne 0$"
  },
  {
      id: 46,
      question: "Số $0$ là số hữu tỉ dương hay âm? (duong/am/khong)",
      answer: "khong",
      hint: "Số $0$ là ranh giới giữa số dương và số âm.",
      explanation: "Không dương cũng không âm."
  },

  // --- DẠNG 6: TÍNH TOÁN CƠ BẢN ---
  {
      id: 50,
      question: "Tính: $\\frac{1}{2} + 0.5 = ?$",
      answer: "1",
      hint: "Đổi $\\frac{1}{2}$ thành $0.5$ rồi cộng lại.",
      explanation: "$1$"
  },
  {
      id: 51,
      question: "Tính: $(-2)^2 = ?$",
      answer: "4",
      hint: "Bình phương của một số âm là số dương: $(-2) \\cdot (-2)$.",
      explanation: "$(-2) \\cdot (-2) = 4$"
  },
  {
      id: 52,
      question: "Tính: $(-1)^3 = ?$",
      answer: "-1",
      hint: "Lũy thừa bậc lẻ của số âm vẫn là số âm.",
      explanation: "$(-1) \\cdot (-1) \\cdot (-1) = -1$"
  },
  {
      id: 53,
      question: "Kết quả của phép tính $0.5 \\cdot \\frac{1}{2}$ là?",
      answer: "0.25",
      hint: "Đổi ra phân số $\\frac{1}{2} \\cdot \\frac{1}{2}$ hoặc số thập phân $0.5 \\cdot 0.5$.",
      explanation: "$0.25$"
  },
  {
      id: 54,
      question: "Tính $25\\% - \\frac{1}{4} = ?$",
      answer: "0",
      hint: "Đổi $25\\% = \\frac{25}{100} = \\frac{1}{4}$.",
      explanation: "$0$"
  },
  {
      id: 55,
      question: "Nghịch đảo của $\\frac{-2}{3}$ là?",
      answer: "-3/2",
      hint: "Đảo ngược tử số và mẫu số.",
      explanation: "$\\frac{-3}{2}$"
  },
  {
      id: 56,
      question: "Tích của hai số hữu tỉ âm là số dương hay âm? (duong/am)",
      answer: "duong",
      hint: "Quy tắc dấu: Âm nhân Âm bằng ...?",
      explanation: "Dương."
  },
  {
      id: 57,
      question: "Lũy thừa bậc 0 của mọi số $x \\ne 0$ đều bằng mấy?",
      answer: "1",
      hint: "Quy ước toán học cơ bản về lũy thừa bậc 0.",
      explanation: "$1$"
  }
];

export const QUESTIONS = QUESTION_BANK.slice(0, 8);
