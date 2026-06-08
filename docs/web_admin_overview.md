# Tổng Quan Web Admin

## 1. Đăng Nhập

- **Super Admin** (chủ sở hữu) có thể tạo **Admin** cho các chi nhánh, cửa hàng, và người quản lý.
- Admin đăng nhập bằng **tài khoản Web Admin** (email + mật khẩu).

## 2. Trang Tổng Quan (Dashboard)

- **Thống kê doanh thu**, **đơn hàng**, **CTV**, **khách vãng lai**.
- Biểu đồ **doanh thu theo thời gian**, **số điểm thưởng**, **hoa hồng đã chi**.
- Các **KPIs** chính cho quản lý nhanh.

## 3. Quản Lý CTV

- **Danh sách CTV**: Hiển thị thông tin cơ bản, trạng thái duyệt, cửa hàng liên kết.
- **Tạo CTV**: Form nhập thông tin (tương tự luồng đăng ký CTV) cho phép **Admin** tạo CTV trực tiếp.
- **Tìm kiếm & Lọc**: Theo tên, số điện thoại, cửa hàng, trạng thái.
- **Thao tác**:
  - **Duyệt** / **Reject** đăng ký CTV.
  **Block** CTV (khi vi phạm).
  - **Chi tiết**: Xem lịch sử hoạt động, điểm, giao dịch rút tiền.

## 4. Quản Lý Đơn Hàng

- **Danh sách Đơn Hàng**:
  - Đơn hàng **CTV gửi lên** (đổi điểm, mua dịch vụ).
  - Đơn hàng **KH vãng lai** (được tạo qua QR và chọn dịch vụ).
- **Xem chi tiết**, **phê duyệt**, **từ chối**.
- **Export Excel**: Xuất danh sách đơn hàng cho báo cáo.

## 5. Quản Lý Dịch Vụ

- **Danh sách Dịch Vụ**: Thêm, sửa, tạm đóng dịch vụ.
- **Cấu hình điểm thưởng** cho từng dịch vụ.
- **Kiểm soát khả dụng** (đặt trạng thái Active/Inactive).

## 6. Cài Đặt (Settings)

- Thông tin **cơ bản** của hệ thống (tên, logo, thông tin liên hệ).
- **Quản lý quyền**: Phân cấp quyền cho Super Admin, Admin, Manager.
- **Cấu hình mức điểm** cho các bậc thành viên (Đồng, Bạc, Vàng, Kim Cương).
- **Cấu hình email/SMS** cho việc gửi OTP, thông báo đăng ký, đổi mật khẩu.

## 7. Các Quy Trình Liên Quan

### 7.1 Duyệt Đăng Ký CTV
1. Nhận yêu cầu đăng ký từ App.
2. Kiểm tra thông tin (đúng/đầy đủ).
3. **Duyệt** → gửi thông báo (SMS/Email) cho CTV.
4. **Reject** → gửi lý do từ chối.

### 7.2 Xét Duyệt Ngân Hàng CTV
1. Nhận yêu cầu liên kết tài khoản ngân hàng.
2. Kiểm tra thông tin (số tài khoản, tên chủ, ngân hàng, QR code).
3. **Chấp nhận** → trạng thái “Liên kết thành công”.
4. **Từ chối** → gửi lý do.

### 7.3 Xử Lý Đơn Hàng Dịch Vụ
- **Khách (KH)**: Nhận thông tin từ App → Admin duyệt → cộng điểm cho CTV giới thiệu.
- **CTV Đổi Điểm**: Nhận yêu cầu QR → Admin phê duyệt → trừ điểm.

### 7.4 Rút Tiền (Cash‑Out) CTV
1. CTV gửi yêu cầu rút tiền.
2. Admin/Kế toán kiểm tra tài khoản ngân hàng và số điểm.
3. Thực hiện chuyển khoản thủ công.
4. Cập nhật trạng thái và thông báo CTV.

## 8. Báo Cáo & Xuất Dữ Liệu

- **Báo cáo doanh thu**, **hoa hồng**, **điểm thưởng**, **đơn hàng**.
- Khả năng **export CSV/Excel** cho các báo cáo này.