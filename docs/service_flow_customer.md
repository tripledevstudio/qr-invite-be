# Luồng Sử Dụng Dịch Vụ – Khách Hàng Vãng Lai (KH)

## Mục Đích
Khách hàng không phải CTV, chỉ muốn sử dụng dịch vụ tại cửa hàng và tích lũy điểm cho CTV giới thiệu.

## Cách 1 – Xử Lý Trên App (Tự Động)

### Bước 1: Quét Mã QR
- Khách hàng sử dụng **App Moki** (hoặc bất kỳ ứng dụng quét QR nào) để quét **Mã QR** của mình tại cửa hàng.

### Bước 2: Hiển Thị Popup Dịch Vụ
- Ứng dụng hiển thị một **popup** chứa danh sách **các dịch vụ** hiện có trong cửa hàng.

### Bước 3: Lựa Chọn Dịch Vụ
- Khách hàng chọn các dịch vụ đã sử dụng (ví dụ: *Dịch vụ 1 + Dịch vụ 2*).
- Hệ thống **tự động tính toán** tổng tiền và hiển thị cho khách.

### Bước 4: Đồng Bộ Dữ Liệu
- Ứng dụng **gửi toàn bộ thông tin đơn hàng** (danh sách dịch vụ, tổng tiền) lên **Web Admin** thông qua API, kèm `ref_code` của QR.

### Bước 5: Backend Xử Lý
- **BE** nhận thông tin, thực hiện:
  - Kiểm tra hợp lệ.
  - Thêm **điểm thưởng** vào tài khoản CTV (người giới thiệu) dựa trên cấu hình điểm thưởng.

## Cách 2 – Xử Lý Trên Web Admin (Thủ Công)

### Bước 1: Quét Mã QR
- Nhân viên cửa hàng dùng **App trên điện thoại** để quét **Mã QR** của khách.

### Bước 2: Ghi Nhận Lượt Quét
- Thông tin **lượt quét** được tự động gửi lên **Web Admin**, hiển thị trong danh sách **đơn hàng chờ xử lý**.

### Bước 3: Cập Nhật Dịch Vụ
- **Admin** đăng nhập Web Admin, mở chi tiết **Mã QR** vừa quét.
- Thêm **các dịch vụ** mà khách đã sử dụng (thủ công) vào đơn hàng.

### Bước 4: Phê Duyệt Đơn Hàng
- Admin kiểm tra lại thông tin và **bấm nút “Tự duyệt”**.
- Hệ thống chuyển trạng thái **đã duyệt**, tính toán **điểm thưởng** và cộng cho CTV.

## Ghi chú
- **Cách 1** phù hợp khi danh sách dịch vụ ít và tính toán đơn giản.
- **Cách 2** được dùng khi quy trình dịch vụ phức tạp, yêu cầu kiểm duyệt kỹ lưỡng hoặc khi cần can thiệp thủ công.
- Điểm thưởng được cộng cho **CTV giới thiệu** (được xác định qua `ref_code` trong QR).