# Luồng Sử Dụng Điểm – Cộng Tác Viên (CTV) Đổi Dịch Vụ

## 1. Truy Cập Tính Năng “Đổi Điểm”

- CTV vào **Màn hình Đổi Quà / Đổi Điểm** trong App.
- Hệ thống hiển thị danh sách **dịch vụ / sản phẩm** có thể đổi, dựa trên **điểm hiện có** và **điều kiện**.

## 2. Chọn Dịch Vụ Đổi Điểm

- CTV lựa chọn **một hoặc nhiều dịch vụ** muốn đổi.
- Hệ thống hiển thị **điểm cần** cho mỗi dịch vụ và tổng điểm cần thiết cho lần đổi.

## 3. Tạo Mã QR Tham Chiếu (ref_code)

- Khi CTV **xác nhận** danh sách dịch vụ, hệ thống tạo một **Mã QR** chứa `ref_code` duy nhất cho giao dịch này.
- **QR Code** hiển thị trong App và có thể được **quét bởi nhân viên** tại cửa hàng hoặc Admin.

## 4. Gửi Yêu Cầu Đến Admin (Chờ Duyệt)

- CTV đưa **QR Code** cho nhân viên tại quầy hoặc Admin.
- **Admin** quét QR, yêu cầu **phê duyệt** trên **Web Admin**.
- Đơn hàng chuyển sang trạng thái **“Chờ duyệt”**.

## 5. Phê Duyệt & Trừ Điểm

- Khi Admin **bấm Duyệt**, backend thực hiện:
  - **Kiểm tra trạng thái** và **số điểm còn lại**.
  - **Trừ điểm** tương ứng từ tài khoản CTV.
  - Ghi nhận **dịch vụ đã được sử dụng** và **cập nhật lịch sử**.

## 6. Kết Quả

- CTV nhận thông báo **đổi điểm thành công**.
- Dịch vụ/ sản phẩm được **cung cấp** cho CTV tại cửa hàng (hoặc qua QR).
- Lịch sử giao dịch sẽ hiển thị trong **Màn hình Lịch Sử** của App.

## Ghi chú

- Nếu Admin **từ chối** (lý do: điểm không đủ, thông tin không hợp lệ...), CTV sẽ nhận thông báo và không bị trừ điểm.
- **QR Code** khi chưa được duyệt chỉ là **mã tạm**, không có giá trị thực tế.
- Hệ thống có thể hỗ trợ **các mã QR dự phòng** trong trường hợp lỗi, nhưng quy trình tương tự.