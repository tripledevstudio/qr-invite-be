# Luồng Quên Mật Khẩu (CTV)

## 1. Cách 1 – Dùng Email hoặc Số Điện Thoại

1. **Yêu cầu**: Người dùng nhập **Email** hoặc **Số điện thoại** đã đăng ký.
2. Hệ thống gửi **Mã xác thực** (OTP) tới Email hoặc SMS.
3. Người dùng nhập **Mã OTP** để xác thực.
4. Sau khi OTP hợp lệ, hiển thị màn hình **Nhập mật khẩu cũ + mật khẩu mới**.
5. Người dùng nhập **Mật khẩu cũ** và **Mật khẩu mới**, rồi xác nhận.
6. Hệ thống cập nhật mật khẩu và thông báo **Thành công**.

## 2. Cách 2 – Liên Hệ Admin Hỗ Trợ

1. Người dùng **Liên hệ Admin** (qua kênh hỗ trợ trong App) yêu cầu tạo lại mật khẩu.
2. App gửi **Request** tới **Web Admin** bao gồm:
   - Số điện thoại
   - Tên người dùng (username)
3. Admin nhận yêu cầu, kiểm tra thông tin và **cấp lại mật khẩu mới**.
4. *Lưu ý*: Nếu không có kênh SMS, mật khẩu mới sẽ được cung cấp:
   - **Thủ công** qua cửa hàng hoặc chủ cơ sở dịch vụ.
   - Hoặc **bằng cách** Admin gửi mật khẩu qua email (nếu email đã đăng ký).

## 3. Ghi chú

- Khi Admin tạo lại mật khẩu, người dùng **không cần nhập mật khẩu cũ**.
- Quá trình này yêu cầu **kiểm soát quyền** để tránh lạm dụng, nên chỉ Admin có quyền thực hiện.
- Sau khi mật khẩu mới được cấp, người dùng **đăng nhập lại** bằng thông tin mới.