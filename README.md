# Chinese Shadowing Studio — PWA

Phiên bản: **2026.10.22.1**. Bản này giữ nguyên giao diện và mã chức năng từ `Chinese_Shadowing_Studio_V3_Kokoro_Pinyin.html`; bổ sung khả năng cài đặt và bộ nhớ đệm PWA.

## Các tệp

- `index.html`: giao diện Shadowing, nhập CSV, quản lý bài, Pinyin, từ vựng, giọng hệ thống, Kokoro AI, sao lưu/khôi phục.
- `manifest.webmanifest`: tên ứng dụng, màn hình khởi động và biểu tượng.
- `sw.js`: lưu bộ khung và các tài nguyên tải thành công để dùng ngoại tuyến.
- `pwa.js`: đăng ký Service Worker và thông báo khi có bản mới.
- `icon.svg`, `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`: biểu tượng cài đặt.

## Đưa lên GitHub Pages

1. Tạo repository mới hoặc mở repository có sẵn.
2. Tải **toàn bộ tệp trong thư mục ZIP** lên **thư mục gốc** của nhánh xuất bản (không đặt nguyên ZIP hoặc thư mục bao ngoài).
3. Vào **Settings → Pages → Build and deployment → Deploy from a branch**, chọn `main` và `/(root)`, rồi Save.
4. Mở địa chỉ `https://TEN-TAI-KHOAN.github.io/TEN-REPO/` bằng HTTPS. Đường dẫn trong ứng dụng đều tương đối, phù hợp với GitHub Pages ở thư mục con.
5. Chờ trang xuất bản và tải một lần khi có mạng trước khi thử offline.

## Cài ứng dụng

- **iPhone (Safari):** mở URL GitHub Pages → Chia sẻ → **Thêm vào Màn hình chính** → Thêm. iOS Chrome có thể có lựa chọn tương tự tùy phiên bản, Safari là lựa chọn ổn định.
- **Android (Chrome):** mở URL → menu ⋮ → **Cài đặt ứng dụng** hoặc **Thêm vào màn hình chính**.
- **Máy tính (Chrome/Edge):** mở URL → biểu tượng Cài đặt trên thanh địa chỉ hoặc menu → Cài đặt ứng dụng.

## Dữ liệu và ngoại tuyến

- Bài học, câu, Pinyin và từ vựng lưu trong **localStorage**; âm thanh Kokoro đã tạo lưu trong **IndexedDB**. Đóng/mở lại ứng dụng không xóa dữ liệu nếu trình duyệt không tự dọn dữ liệu trang.
- Xuất **Sao lưu JSON** định kỳ cho bài học/từ vựng. Âm thanh Kokoro cần xuất riêng qua **Xuất bài + âm thanh AI**; JSON sao lưu thường **không chứa** âm thanh Kokoro trong IndexedDB.
- Khi tải trang lần đầu thành công, bộ khung ứng dụng được cache để mở ngoại tuyến. Các chức năng không cần mạng (quản lý bài, luyện tập với nội dung đã lưu, CSV, phát WAV/MP3 đã lưu, phát WAV Kokoro đã tạo) có thể hoạt động ngoại tuyến.
- **Tự tạo Pinyin:** mã nguồn hiện tại tải `pinyin-pro` từ CDN. Cần mạng lần đầu; có thể dùng offline sau khi CDN được cache thành công, nhưng không bảo đảm khi trình duyệt dọn cache.
- **Kokoro AI:** mô hình, thư viện và các tệp giọng cần tải từ Internet. Không bảo đảm tạo âm thanh offline ngay cả sau lần chạy đầu (mô hình lớn, trình duyệt/thiết bị khác nhau và hạn mức cache). Nên **tạo trước và lưu âm thanh khi có mạng**; âm thanh đã lưu có thể phát offline. iPhone có thể không đủ bộ nhớ để tạo AI trực tiếp.
- **Giọng hệ thống:** có thể hoạt động ngoại tuyến nếu thiết bị đã cài giọng tiếng Trung chạy cục bộ; một số giọng mạng không hoạt động offline.
- Không xóa dữ liệu website, không dùng chế độ riêng tư, không gỡ ứng dụng khi chưa sao lưu. GitHub Pages không tự đồng bộ dữ liệu giữa thiết bị.

## Cập nhật phiên bản

1. Thay `index.html`/các tệp tính năng theo nhu cầu nhưng **giữ nguyên khóa lưu trữ dữ liệu** (`chinese-chinese-shadowing-studio-v1`) và schema trừ khi có bước chuyển đổi dữ liệu.
2. Đổi `VERSION` trong `sw.js` thành số mới, ví dụ `2026.10.22.2`.
3. Upload/commit các tệp thay đổi lên GitHub Pages.
4. Người dùng mở app khi có mạng, ứng dụng sẽ phát hiện Service Worker mới và hiển thị nút **Cập nhật**; nhấn để tải lại. Dữ liệu localStorage và IndexedDB không bị xóa khi cache đổi phiên bản.
5. Nên sao lưu JSON trước các thay đổi lớn. Không sửa mã ứng dụng trực tiếp trên thiết bị nếu muốn duy trì cập nhật.

## Kiểm tra sau triển khai

- Tạo bài học, nhập câu Trung/Pinyin/nghĩa, đổi thứ tự, sửa/xóa, CSV nhập/xuất, lưu từ, học Shadowing, phát/dừng, đổi câu.
- Đóng/mở lại ứng dụng: dữ liệu vẫn còn.
- Mở DevTools → Application → Manifest/Service Workers; kiểm tra đăng ký thành công. Chuyển Offline và tải lại để kiểm tra shell.
- Tạo và phát Kokoro khi online, sau đó thử offline với câu đã tạo. Thử riêng Pinyin và giọng hệ thống khi offline.
- Commit phiên bản mới và xác nhận thông báo cập nhật.

**Giới hạn kiểm thử:** gói được kiểm tra tĩnh về cấu trúc và đường dẫn; không thể xác nhận thực tế tải mô hình Kokoro, phát âm thanh hoặc thao tác cài đặt trên từng thiết bị khi chưa chạy trên GitHub Pages/HTTPS. Tài nguyên CDN và mô hình không được đóng gói sẵn do không có quyền truy cập tải trực tiếp tại thời điểm tạo gói.
