# Giao Diện Trang Chủ

## 1. Trạng Thái Chưa Đăng Nhập (Guest)

- **Banner giới thiệu**: Hiển thị các cửa hàng, sản phẩm, dịch vụ và chi nhánh của các cơ sở dịch vụ.
- **Nút “Trở thành Cộng Tác Viên”**: Điều hướng tới màn hình **Đăng ký CTV**.
- **Nút “Quyền lợi CTV”**: Hiển thị mô tả lợi ích khi trở thành CTV.
- **Nút “Hướng dẫn trở thành CTV”**: Cung cấp hướng dẫn chi tiết quy trình đăng ký.

## 2. Trạng Thái Đã Đăng Nhập (CTV)

- **Card Đổi Điểm**: Cho phép CTV quy đổi điểm thành tiền hoặc quà.
- **Banner giới thiệu**: Như trên, nhưng có thể đề xuất các chương trình, khuyến mãi cho CTV.
- **Thống kê**: Tổng quan về điểm, hoa hồng, hoạt động gần đây.
- **Hoạt động**: Danh sách các hoạt động (check‑in, nhận hoa hồng, đổi điểm).

## 3. Mã QR

- Khi **chưa đăng nhập**, hiển thị **Mã QR ảo** (không có giá trị) cùng hướng dẫn:
  - “Cập nhật thông tin cá nhân để nhận mã QR thực tế”.
- Khi **đã đăng nhập**, hiển thị **Mã QR thực** chứa thông tin `ref_code` (có thể kèm các thông tin mở rộng).

## 4. Lịch Sử

- **Chưa đăng nhập**: UI yêu cầu đăng nhập hoặc hiển thị dữ liệu trống.
- **Đã đăng nhập**: Hai tab chính:
  - **Lịch sử Check‑in** – danh sách các lần check‑in tại cửa hàng, cơ sở dịch vụ.
  - **Lịch sử Hoa Hồng** – danh sách các lần nhận hoa hồng từ khách hàng.

## 5. Cá Nhân (Profile)

- Thông tin tài khoản người dùng.
- Thông tin ngân hàng (kèm trạng thái liên kết).
- **Hệ thống cấp bậc**: Đồng, Bạc, Vàng, Kim Cương – hiển thị điểm thăng hạng (định nghĩa chi tiết chưa có).
- **Vai trò & Quyền hạn**: Mô tả quyền hạn của CTV trong hệ thống.
- **Đổi mật khẩu**: Liên hệ Admin (theo Luồng Quên Mật Khẩu).
- **Cài đặt**: Thông báo, ngôn ngữ, chế độ sáng/tối.