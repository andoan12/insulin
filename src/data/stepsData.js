export const STEPS_DATA = [
  {
    id: 1,
    shortTitle: '1. Tách chiết Plasmid',
    subtitle: 'Tách thể truyền Plasmid từ vi khuẩn E. coli & Gen Insulin người',
    badge: 'BƯỚC 1 / 5 • TÁCH CHIẾT ADN',
    color: 'emerald',
    accentHex: '#10b981',
    actionLabelBefore: 'Nhấp vào Plasmid 3D hoặc bấm để Tách Plasmid',
    actionLabelAfter: 'Đã tách Plasmid & phân lập Gen Insulin thành công!',
    headline: 'Tách Plasmid khỏi vi khuẩn E. coli làm thể truyền (Vector)',
    presentationPoints: [
      'Vi khuẩn E. coli chứa ADN vùng nhân (lớn) và các phân tử ADN dạng vòng nhỏ gọi là Plasmid.',
      'Plasmid có khả năng tự nhân đôi độc lập, được tách ra khỏi tế bào E. coli để làm thể truyền (vector).',
      'Đồng thời, phân lập đoạn ADN mang Gen quy định tổng hợp hormone Insulin từ tế bào tuyến tụy người.'
    ],
    keyTerms: [
      { term: 'Plasmid', desc: 'ADN vòng nhỏ nằm trong tế bào chất của vi khuẩn, tự nhân đôi độc lập.' },
      { term: 'Gen cần chuyển', desc: 'Gen mã hóa hormone Insulin người (điều hòa đường huyết).' }
    ],
    hint3D: 'Nhấp trực tiếp vào tế bào vi khuẩn E. coli hoặc vòng Plasmid phát sáng để tách Plasmid ra ngoài!'
  },
  {
    id: 2,
    shortTitle: '2. Cắt ADN (Restrictase)',
    subtitle: 'Dùng cùng một loại Enzyme giới hạn cắt mở vòng Plasmid & Gen Insulin',
    badge: 'BƯỚC 2 / 5 • CẮT GIỚI HẠN',
    color: 'amber',
    accentHex: '#f59e0b',
    actionLabelBefore: 'Kích hoạt "Kéo phân tử" Enzyme Restrictase cắt ADN',
    actionLabelAfter: 'Đã cắt mở vòng Plasmid & tạo các đầu dính bổ sung!',
    headline: 'Enzyme giới hạn (Restrictase) cắt đặc hiệu tạo các "Đầu dính"',
    presentationPoints: [
      'Sử dụng CÙNG MỘT LOẠI enzyme giới hạn (ví dụ: EcoRI) làm "kéo sinh học" để cắt mở vòng Plasmid.',
      'Enzyme này cũng cắt hai đầu đoạn Gen Insulin người tại trình tự nucleotide xác định.',
      'Tạo ra các "đầu dính" (Sticky ends) có trình tự các nucleotide mạch đơn bổ sung khớp nhau (A-T, G-X).'
    ],
    keyTerms: [
      { term: 'Enzyme Restrictase', desc: 'Kéo phân tử nhận biết và cắt ADN tại trình tự đặc hiệu.' },
      { term: 'Đầu dính (Sticky ends)', desc: 'Đoạn mạch đơn nhô ra giúp 2 phân tử ADN dễ bắt cặp bổ sung.' }
    ],
    hint3D: 'Nhấp vào phân tử Enzyme Restrictase (màu vàng cam) hoặc nút bấm để cắt mở vòng Plasmid!'
  },
  {
    id: 3,
    shortTitle: '3. Tạo ADN Tái tổ hợp',
    subtitle: 'Dùng Enzyme DNA Ligase gắn Gen Insulin vào Plasmid',
    badge: 'BƯỚC 3 / 5 • NỐI GEN (RECOMBINE)',
    color: 'rose',
    accentHex: '#f43f5e',
    actionLabelBefore: 'Sử dụng Enzyme DNA Ligase ghép nối tạo ADN tái tổ hợp',
    actionLabelAfter: 'Đã hình thành phân tử Plasmid tái tổ hợp hoàn chỉnh!',
    headline: 'Enzyme DNA Ligase "hàn" Gen Insulin vào vòng Plasmid',
    presentationPoints: [
      'Đoạn Gen Insulin người di chuyển vào vị trí mở của Plasmid nhờ các liên kết hydro giữa 2 đầu dính bổ sung.',
      'Enzyme DNA Ligase đóng vai trò "hồ dán phân tử", xúc tác hình thành liên kết phosphodiester bền vững.',
      'Kết quả tạo thành phân tử ADN tái tổ hợp (Plasmid tái tổ hợp mang Gen Insulin người).'
    ],
    keyTerms: [
      { term: 'ADN tái tổ hợp', desc: 'Phân tử ADN nhỏ được lắp ghép từ ADN của 2 loài khác nhau (Người + E. coli).' },
      { term: 'Enzyme DNA Ligase', desc: 'Xúc tác nối liền khung đường - phosphate giữa Gen Insulin và Plasmid.' }
    ],
    hint3D: 'Nhấp vào đoạn Gen Insulin (màu hồng đỏ) hoặc nút bấm để ghép vào Plasmid nhờ Enzyme Ligase!'
  },
  {
    id: 4,
    shortTitle: '4. Biến nạp vào E. coli',
    subtitle: 'Đưa ADN tái tổ hợp vào tế bào nhận E. coli',
    badge: 'BƯỚC 4 / 5 • BIẾN NẠP (TRANSFORM)',
    color: 'cyan',
    accentHex: '#06b6d4',
    actionLabelBefore: 'Thực hiện biến nạp Plasmid tái tổ hợp vào E. coli',
    actionLabelAfter: 'Biến nạp thành công! E. coli đã mang Gen Insulin người',
    headline: 'Đưa Plasmid tái tổ hợp xâm nhập vào tế bào chủ E. coli',
    presentationPoints: [
      'Xử lý màng tế bào vi khuẩn E. coli bằng dung dịch CaCl₂ và xung nhiệt (sốc nhiệt) để làm giãn màng sinh chất.',
      'Plasmid tái tổ hợp đi qua màng tế bào vào bên trong tế bào chất của vi khuẩn nhận.',
      'Chọn lọc các dòng vi khuẩn E. coli đã nhận được Plasmid tái tổ hợp thông qua gen đánh dấu (kháng kháng sinh).'
    ],
    keyTerms: [
      { term: 'Biến nạp (Transformation)', desc: 'Đưa phân tử ADN tái tổ hợp từ môi trường ngoài vào tế bào nhận.' },
      { term: 'Tế bào nhận E. coli', desc: 'Sinh sản rất nhanh (20-30 phút/lần), dễ nuôi cấy, chi phí thấp.' }
    ],
    hint3D: 'Nhấp vào Plasmid tái tổ hợp hoặc tế bào E. coli để đưa Plasmid xuyên qua màng tế bào!'
  },
  {
    id: 5,
    shortTitle: '5. Lên men & Thu Insulin',
    subtitle: 'Nuôi cấy E. coli trong nồi lên men sinh học & tinh sạch Insulin',
    badge: 'BƯỚC 5 / 5 • SẢN XUẤT CÔNG NGHIỆP',
    color: 'violet',
    accentHex: '#8b5cf6',
    actionLabelBefore: 'Khởi động Nồi lên men sinh học (Bioreactor) & Chiết xuất',
    actionLabelAfter: 'Đang nhân sinh khối E. coli & thu hoạch tinh thể Insulin!',
    headline: 'Nhân bản E. coli trong Bioreactor & tinh sạch thuốc Insulin',
    presentationPoints: [
      'Nuôi cấy chủng E. coli mang gen tái tổ hợp trong hệ thống nồi lên men (Bioreactor) với điều kiện tối ưu.',
      'Vi khuẩn E. coli phân đôi cấp số nhân, đồng thời nhân bản Plasmid và tổng hợp lượng lớn protein Insulin người.',
      'Tách chiết, tinh sạch hormone Insulin từ dịch nuôi cấy để đóng lọ điều trị bệnh tiểu đường (đái tháo đường).'
    ],
    keyTerms: [
      { term: 'Bioreactor (Nồi lên men)', desc: 'Thiết bị nuôi cấy vi sinh vật quy mô lớn kiểm soát nhiệt độ, pH, oxy.' },
      { term: 'Ý nghĩa thực tiễn', desc: 'Giúp sản xuất Insulin người tinh khiết, giá thành rẻ, không gây dị ứng.' }
    ],
    hint3D: 'Nhấp vào Nồi lên men sinh học 3D để tăng tốc nhân đôi vi khuẩn và giải phóng các hạt Insulin phát sáng!'
  }
];

export const QUIZ_QUESTIONS = [
  {
    question: 'Trong công nghệ gen sản xuất Insulin, cấu trúc nào của vi khuẩn E. coli được dùng làm thể truyền (vector)?',
    options: [
      'A. ADN dạng vòng nhỏ gọi là Plasmid',
      'B. Tiên mao (lông roi) của vi khuẩn',
      'C. Thành tế bào bằng Peptidoglycan',
      'D. Không bào co bóp'
    ],
    correctIndex: 0,
    explanation: 'Plasmid là phân tử ADN dạng vòng nhỏ nằm trong tế bào chất của vi khuẩn, có khả năng tự nhân đôi độc lập với ADN vùng nhân.'
  },
  {
    question: 'Loại enzyme nào đóng vai trò như "kéo phân tử" và "hồ dán phân tử" khi tạo ADN tái tổ hợp?',
    options: [
      'A. Amylase (cắt) và Pepsin (nối)',
      'B. Restrictase (cắt) và DNA Ligase (nối)',
      'C. Helicase (cắt) và Catalase (nối)',
      'D. Lipase (cắt) và RNA Polymerase (nối)'
    ],
    correctIndex: 1,
    explanation: 'Enzyme giới hạn (Restrictase) cắt ADN tạo đầu dính bổ sung, còn Enzyme DNA Ligase xúc tác nối các đoạn ADN tạo ADN tái tổ hợp.'
  },
  {
    question: 'Vì sao người ta chọn vi khuẩn E. coli làm tế bào nhận để sản xuất Insulin người?',
    options: [
      'A. Vì E. coli có kích thước khổng lồ nhìn thấy bằng mắt thường',
      'B. Vì E. coli có khả năng quang hợp tạo ra đường glucose',
      'C. Vì E. coli sinh sản rất nhanh (20-30 phút/lần), dễ nuôi cấy, giúp tổng hợp lượng lớn Insulin trong thời gian ngắn',
      'D. Vì E. coli tự nhiên đã có sẵn gen Insulin của người'
    ],
    correctIndex: 2,
    explanation: 'Vi khuẩn E. coli nhân đôi rất nhanh trong nồi lên men sinh học, giúp nhân bản gen tái tổ hợp và sản xuất sinh khối Insulin quy mô công nghiệp với chi phí thấp.'
  }
];
