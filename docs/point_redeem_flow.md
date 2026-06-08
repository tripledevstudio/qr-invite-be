# Luồng Đổi Điểm – CTV Đổi Điểm Thành Tiền (Cash‑Out)

## 1. Truy Cập Tính Năng “Đổi Điểm Ra Tiền”

- CTV vào **Mục Tài Khoản**, chọn tính năng **“Đổi điểm ra tiền”**.

## 2. Nhập Số Điểm Muốn Đổi

- Giao diện yêu cầu **Nhập số điểm** muốn quy đổi.
- Hệ thống **tự động tính toán** số tiền tương ứng dựa trên cấu hình tỷ lệ chuyển đổi (ví dụ: 1000 điểm = 10,000 VND).

## 3. Gửi Yêu Cầu Rút Tiền

- CTV **bấm “Gửi yêu cầu”**.
- Hệ thống tạo **Yêu cầu Rút tiền** và đặt trạng thái **“Chờ duyệt” (Pending)**.

## 4. Xử Lý Yêu Cầu Tại Web Admin

- Yêu cầu được gửi tới **Web Admin**, nơi **Kế toán / Admin** sẽ:
  - Kiểm tra tính hợp lệ (đủ điểm, tài khoản ngân hàng đã liên kết, không có tranh chấp).
  - Thực hiện **chuyển khoản** thủ công tới tài khoản ngân hàng của CTV.

## 5. Phản Hồi Kết Quả

- Khi chuyển khoản thành công, Admin cập nhật trạng thái **“Đã duyệt”** và thông báo cho CTV (qua tin nhắn SMS hoặc trong App).
- Nếu có vấn đề (tài khoản ngân hàng không hợp lệ, số tiền vượt quá hạn mức...), Admin **từ chối** và gửi lý do cho CTV.

## 6. Lưu Trữ Lịch Sử

- Tất cả các yêu cầu rút tiền được ghi lại trong **Lịch Sử Rút Tiền** của CTV, hiển thị:
  - Số điểm đã đổi
  - Số tiền nhận được
  - Ngày/giờ yêu cầu
  - Trạng thái (Đang chờ, Đã duyệt, Từ chối)