# ♻️ SecondNest — Web Mua Bán Đồ 2nd Hand

> **Dành cho nhóm mới bắt đầu** — Đọc kỹ từng bước, làm đúng thứ tự!

---

## 📁 Cấu Trúc Thư Mục

```
secondnest/
├── database/           ← File SQL (M1 + M2 phụ trách)
│   ├── schema.sql      ← Tạo cấu trúc database
│   └── seed.sql        ← Chèn dữ liệu mẫu
│
├── backend/            ← Node.js + Express (M1 + M2)
│   ├── server.js
│   ├── config/db.js
│   ├── middleware/
│   ├── routes/
│   └── controllers/
│
└── frontend/           ← React (M3 + M4)
    ├── src/
    │   ├── api/
    │   ├── context/
    │   ├── components/
    │   └── pages/
    └── ...
```

---

## 🔧 Cài Đặt Lần Đầu (Làm 1 Lần Duy Nhất)

### Bước 1: Cài đặt phần mềm

Cài theo thứ tự:
1. [Node.js](https://nodejs.org/) — chọn bản LTS (18 hoặc 20)
2. [MySQL Workbench + MySQL Server](https://dev.mysql.com/downloads/workbench/)
3. [VS Code](https://code.visualstudio.com/)
4. [Git](https://git-scm.com/downloads)
5. [Postman](https://www.postman.com/downloads/)

Kiểm tra đã cài xong:
```bash
node --version    # Phải ra: v18.x.x hoặc cao hơn
npm --version     # Phải ra: 9.x.x hoặc cao hơn
git --version     # Phải ra: git version 2.x.x
```

---

### Bước 2: Tạo Database (M1 làm)

1. Mở **MySQL Workbench**
2. Kết nối vào MySQL Server local
3. Click **File → Open SQL Script** → chọn file `database/schema.sql`
4. Bấm **⚡ Execute** (hoặc Ctrl+Shift+Enter)
5. Mở tiếp `database/seed.sql` → Execute để có dữ liệu mẫu
6. Kiểm tra: bên trái thấy database `secondnest` với 4 bảng là thành công ✅

---

### Bước 3: Cài đặt và chạy Backend (M1 làm)

```bash
# 1. Vào thư mục backend
cd secondnest/backend

# 2. Cài thư viện
npm install

# 3. Tạo file .env (copy từ file mẫu)
# Windows:
copy .env.example .env
# Mac/Linux:
cp .env.example .env

# 4. Mở file .env và điền mật khẩu MySQL của máy bạn vào DB_PASSWORD
# Dùng VS Code: code .env

# 5. Chạy server
npm run dev
```

✅ **Thành công** khi thấy:
```
✅ Server đang chạy tại http://localhost:5000
✅ Kết nối MySQL thành công!
```

**Test nhanh:** Mở trình duyệt, vào `http://localhost:5000` → thấy JSON là OK.

---

### Bước 4: Cài đặt và chạy Frontend (M3 làm)

**Mở terminal MỚI** (để backend vẫn chạy ở terminal kia):

```bash
# 1. Vào thư mục frontend
cd secondnest/frontend

# 2. Cài thư viện
npm install

# 3. Tạo file .env
# Windows:
copy .env.example .env
# Mac/Linux:
cp .env.example .env

# 4. Chạy React app
npm run dev
```

✅ **Thành công** khi thấy:
```
VITE v4.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

Mở trình duyệt vào `http://localhost:5173` → thấy trang SecondNest là xong! 🎉

---

## 🔄 Mỗi Ngày Làm Việc

```bash
# Terminal 1 — Chạy backend
cd secondnest/backend
npm run dev

# Terminal 2 — Chạy frontend
cd secondnest/frontend
npm run dev
```

Luôn chạy **cả hai** cùng lúc mới dùng được đầy đủ!

---

## 🧪 Test API Bằng Postman

Import collection Postman và test theo thứ tự:

### Auth APIs
```
POST http://localhost:5000/api/auth/register
Body (JSON): { "username": "test", "email": "test@mail.com", "password": "123456" }

POST http://localhost:5000/api/auth/login
Body (JSON): { "email": "test@mail.com", "password": "123456" }
→ Copy token từ response để dùng cho các API dưới
```

### Product APIs
```
GET  http://localhost:5000/api/products
GET  http://localhost:5000/api/products?search=laptop&category=1
GET  http://localhost:5000/api/products/1

POST http://localhost:5000/api/products
Header: Authorization: Bearer <token>
Body:  { "title": "Test", "price": 100000, "category_id": 1, "type": "sell" }
```

---

## ❗ Lỗi Thường Gặp & Cách Xử Lý

| Lỗi | Nguyên nhân | Cách xử lý |
|-----|-------------|------------|
| `ER_ACCESS_DENIED_ERROR` | Sai mật khẩu MySQL | Kiểm tra DB_PASSWORD trong file .env |
| `ECONNREFUSED 3306` | MySQL chưa chạy | Khởi động MySQL Server |
| `CORS Error` trên React | Backend chưa config CORS | Kiểm tra FRONTEND_URL trong .env backend |
| `Cannot find module` | Chưa `npm install` | Chạy `npm install` trong thư mục đó |
| Port 5000 bị dùng | Có app khác dùng port | Đổi PORT trong .env thành 5001 |

---

## 📋 Tính Năng Đã Hoàn Thiện

- ✅ Đăng ký / Đăng nhập (JWT Authentication)
- ✅ Xem danh sách sản phẩm (có phân trang)
- ✅ Tìm kiếm theo từ khoá
- ✅ Lọc theo danh mục và loại (bán/thuê)
- ✅ Xem chi tiết sản phẩm
- ✅ Đăng tin mới + upload ảnh
- ✅ Sửa / Xoá tin đã đăng
- ✅ Yêu thích / Bỏ yêu thích sản phẩm
- ✅ Trang quản lý tin của tôi
- ✅ Trang danh sách yêu thích

---

## 👥 Phân Công

| Thành viên | Phụ trách |
|------------|-----------|
| M1 - Hưng  | database/schema.sql · config/db.js · authController · authRoutes · uploadRoutes · middleware |
| M2 - Hà Anh | database/seed.sql · productController · favoriteController · categoryRoutes · productRoutes |
| M3 - Bùi Đức | Navbar · ProductCard · LoginPage · RegisterPage · ProductListPage · ProductDetailPage · PostProductPage |
| M4 - Bảo  | AuthContext · axiosInstance · api/*.js · MyListingsPage · FavoritesPage · README · Deploy |
