import { ChatConversation, QuickReplyMacro } from '@/types';

export const DEFAULT_QUICK_REPLIES: QuickReplyMacro[] = [
  {
    id: 'macro_1',
    title: 'Tư vấn Gói Gian Hàng Shopee Mall',
    category: 'Gói Dịch Vụ',
    content: 'Chào bạn, gói Dịch Vụ Vận Hành Gian Hàng Shopee Mall của GGBingo bao gồm: Thiết kế trang trí gian hàng chuẩn SEO, Đăng tải 50+ sản phẩm, Tối ưu từ khóa Ads và Cam kết GMV tăng trưởng 200%. Bạn có muốn nhận file báo giá chi tiết không ạ?',
  },
  {
    id: 'macro_2',
    title: 'Gửi Bảng Giá Dịch Vụ TikTok Shop',
    category: 'Báo Giá',
    content: 'Dạ xin gửi bạn Báo giá Gói TikTok Shop Partner (TSP): Phí khởi tạo 15.000.000đ/tháng (gồm 8 Video ngắn/tháng + 4 Phiên Livestream chuyên nghiệp). Bạn cho bên mình xin SĐT để chuyên viên gọi tư vấn nhé!',
  },
  {
    id: 'macro_3',
    title: 'Hướng Dẫn Quy Trình Ký Hợp Đồng',
    category: 'Hợp Đồng',
    content: 'Chào anh/chị, quy trình ký HĐLĐ/Hợp đồng Dịch vụ tại GGBingo rất nhanh chóng: 1. Xem trước file PDF Cloudflare R2 ➔ 2. Ký số điện tử ➔ 3. Hệ thống tự động kích hoạt tài khoản CRM và gửi bản sao qua Email ạ.',
  },
  {
    id: 'macro_4',
    title: 'Hỗ Trợ Gian Hàng GGBingoVN Platform',
    category: 'Hỗ Trợ Gian Hàng',
    content: 'Xin chào, để mở gian hàng chính thức trên nền tảng GGBingoVN E-Commerce, anh/chị chỉ cần cung cấp Giấy ĐKKD hoặc CCCD chính chủ. Em sẽ hỗ trợ duyệt nhanh trong 15 phút ạ!',
  },
];

export const INITIAL_CHAT_CONVERSATIONS: ChatConversation[] = [];
