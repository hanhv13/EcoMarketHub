# ♻️ EcoMarketHub 
---

## 📁 Cấu Trúc Thư Mục

```text
ecomarkethub/
├── database/           ← Chứa file SQL khởi tạo (Schema & Seed)
│   ├── schema.sql      ← Cấu trúc các bảng (users, products, events, reviews...)
│   └── clean_database.sql ← Xóa & Chèn dữ liệu mẫu
│
├── backend/            ← Node.js + Express
│   ├── server.js       ← Điểm vào của server
│   ├── config/db.js    ← Kết nối MySQL
│   ├── middleware/     ← Xác thực token JWT
│   ├── routes/         ← Chứa các endpoint (auth, product, rental, event, review...)
│   └── controllers/    ← Xử lý logic API tương ứng với các route
│
└── frontend/           ← React (Vite)
    ├── src/
    │   ├── api/        ← Các hàm gọi API thông qua Axios
    │   ├── components/ ← Component dùng chung (Navbar, Footer, ProductCard...)
    │   └── pages/      ← Các trang giao diện chính (Home, Product Detail, Cart, Rewards...)
```

---

## 🐳 Khởi Chạy Nhanh Bằng Docker (Khuyên Dùng)

Cách nhanh nhất để chạy toàn bộ dự án mà không cần cài đặt Node.js hay MySQL trên máy.

1. Cài đặt **[Docker Desktop](https://www.docker.com/products/docker-desktop)**.
2. Mở Terminal tại thư mục gốc của dự án (`ecomarkethub/`) và chạy:
   ```bash
   docker compose up -d
   ```
3. Chờ một lát để Docker tải image và tự động khởi tạo Database kèm dữ liệu mẫu. Sau đó truy cập:
   - **Frontend (Giao diện Web):** [http://localhost:5173](http://localhost:5173)
   - **Backend (API):** [http://localhost:5000](http://localhost:5000)

*(Để xem log nếu có lỗi, chạy: `docker compose logs -f`. Để dừng toàn bộ server, chạy: `docker compose down`)*

---

## 🔧 Hướng Dẫn Cài Đặt Thủ Công (Không dùng Docker)

### Bước 1: Yêu cầu phần mềm
- **Node.js** (v18 hoặc v20 - bản LTS)
- **MySQL Server** và **MySQL Workbench**
- **Git** & **VS Code**

### Bước 2: Khởi tạo Database
1. Mở **MySQL Workbench** và kết nối vào MySQL Server local.
2. Tạo schema mới bằng lệnh: `CREATE DATABASE secondnest;`
3. Mở và chạy file `database/schema.sql` (bấm nút ⚡ Execute) để tạo cấu trúc các bảng.
4. Mở và chạy file `database/clean_database.sql` (bấm nút ⚡ Execute) để thêm dữ liệu mẫu.
*(Kiểm tra cột bên trái, nếu thấy database `secondnest` có đủ các bảng là thành công)*

### Bước 3: Cài đặt Backend
```bash
# 1. Di chuyển vào thư mục backend
cd backend

# 2. Cài đặt các thư viện cần thiết
npm install

# 3. Tạo file cấu hình môi trường
# Trên Windows:
copy .env.example .env
# Trên Mac/Linux:
cp .env.example .env
```
- Mở file `.env` vừa tạo, cập nhật thông tin `DB_PASSWORD` cho đúng với mật khẩu MySQL của máy bạn.
- Chạy backend: 
```bash
npm run dev
```
✅ **Thành công** khi thấy dòng chữ: `Server đang chạy tại http://localhost:5000` và `Kết nối MySQL thành công!`

### Bước 4: Cài đặt Frontend
*(Mở một terminal MỚI để backend vẫn tiếp tục chạy)*
```bash
# 1. Di chuyển vào thư mục frontend
cd frontend

# 2. Cài đặt các thư viện cần thiết
npm install

# 3. Tạo file cấu hình môi trường
# Trên Windows:
copy .env.example .env
# Trên Mac/Linux:
cp .env.example .env
```
- Chạy frontend:
```bash
npm run dev
```
✅ **Thành công** khi có link Localhost (thường là `http://localhost:5173`). Mở trình duyệt và trải nghiệm!

---

## 🌟 Các Tính Năng Đã Hoàn Thiện

1. **Xác thực Người Dùng:**
   - Đăng ký, Đăng nhập bảo mật bằng JWT.
   - Phân quyền User và Admin.
2. **Quản lý & Hiển thị Sản phẩm:** 
   - Đăng tin bán / cho thuê sản phẩm (có upload ảnh).
   - Quản lý kho hàng cá nhân (Sửa/Xóa tin).
3. **Trải nghiệm Mua Sắm & Tìm Kiếm:**
   - Hiển thị danh mục nổi bật (Top 4 Category).
   - Tìm kiếm, lọc theo danh mục, sắp xếp giá (Thấp -> Cao, Cao -> Thấp).
   - Đánh dấu sản phẩm yêu thích (Favorites).
   - Giỏ hàng (Cart) và quy trình Checkout.
4. **Hệ Thống Thuê Mượn (Rental Scheduling):**
   - Đặt lịch thuê sản phẩm theo ngày.
   - Tự động chặn các ngày đã có người đặt trước để tránh trùng lặp.
5. **Cộng đồng & Sự kiện (GreenHub):**
   - Xem và tham gia các Workshop, sự kiện trao đổi đồ cũ.
   - Hệ thống điểm thưởng (Rewards).
6. **Đánh giá & Phản hồi (Reviews):**
   - Cho phép người mua đánh giá người bán (Rating từ 1-5 sao và Comment).

---

## 🧪 Test API Cơ Bản Bằng Postman

**1. Authentication:**
- `POST http://localhost:5000/api/auth/register`
  *Body (JSON):* `{ "username": "testuser", "email": "test@mail.com", "password": "123456" }`
- `POST http://localhost:5000/api/auth/login`
  *Body (JSON):* `{ "email": "test@mail.com", "password": "123456" }`
  *(Copy Token trong Response trả về để dùng cho các API yêu cầu xác thực)*

**2. Products:**
- `GET http://localhost:5000/api/products` (Lấy tất cả sản phẩm)
- `GET http://localhost:5000/api/products?search=laptop&category=1&sort=price_asc` (Tìm kiếm & Lọc)

**3. Rentals (Yêu cầu Token):**
- `POST http://localhost:5000/api/rentals/book`
  *Header:* `Authorization: Bearer <token>`
  *Body (JSON):* `{ "product_id": 1, "start_date": "2026-06-01", "end_date": "2026-06-05" }`

**4. Events (Sự kiện GreenHub):**
- `GET http://localhost:5000/api/events`
