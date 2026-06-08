# Luồng Ứng Dụng Cửa Hàng (Shop App)

## 1. Đăng Nhập

- **Không bắt buộc** đăng nhập để trải nghiệm giao diện cơ bản.
- Đối với **quản lý / nhân viên**, đăng nhập bằng **tài khoản Web Admin** (cùng với chủ cửa hàng hoặc người quản lý chi nhánh).

## 2. Trang Chủ – Tổng Quan

- Hiển thị **thống kê chung**:
  - Doanh thu
  - Số lượng đơn hàng (CTV & KH)
  - Số CTV đang hoạt động
- **Giao diện tổng quan các dịch vụ** hiện có tại cửa hàng.

## 3. Quét Mã QR

### Bước 1: Mở Camera
- Ứng dụng mở camera, quét **Mã QR** của khách hoặc CTV.

### Bước 2: Hiển Thị Popup Thông Tin
- Nếu QR **thuộc Khách (KH)**:
  - Lưu thông tin **khách** cho lần sử dụng tiếp theo (để tính hoa hồng).
  - Gợi ý **“Mời khách trở thành CTV?”** (tùy chọn).
- Nếu QR **thuộc CTV**:
  - Kiểm tra **ref_code** hợp lệ.
  - Nếu hợp lệ, hiển thị **danh sách dịch vụ** cho CTV thực hiện giao dịch.

### Bước 3: Ghi Nhận Dịch Vụ
- Nhân viên chọn dịch vụ đã sử dụng, **gửi lên Web Admin** để ghi nhận.
- Đối với CTV, hệ thống sẽ **tự động trừ điểm** (sau khi Admin duyệt, xem “Luồng Đổi Điểm – CTV”).

## 4. Thông Tin Cửa Hàng

- **Thông tin cơ bản** của cửa hàng được hiển thị (Tên, địa chỉ, liên hệ, logo, …).
- Các **cài đặt** như thời gian làm việc, ưu đãi đặc biệt có thể được cấu hình qua Web Admin.

## 5. Các Tính Năng Khác

- **Quản lý dịch vụ**: Thêm, sửa, tạm đóng dịch vụ (trên Web Admin, phản ánh trong App).
- **Báo cáo**: Xem báo cáo doanh thu theo ngày/tuần/tháng.
- **Cài đặt**: Thay đổi ngôn ngữ, chế độ sáng/tối, thông báo.