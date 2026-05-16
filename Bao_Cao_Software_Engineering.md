# BÁO CÁO KỸ THUẬT - MÔN SOFTWARE ENGINEERING
**Dự án:** SecondNest (EcoHubMarket) - Nền tảng Thương mại điện tử Mua bán và Cho thuê đồ cũ.

---

## 1. Kiến trúc hệ thống tổng quan (System Architecture)
Dự án được xây dựng dựa trên mô hình **Client - Server (Frontend - Backend)** tách biệt.
- **Frontend (Client-side):** Sử dụng **ReactJS** (công cụ build Vite), quản lý state cục bộ, hiển thị giao diện động và gọi API.
- **Backend (Server-side):** Sử dụng **Node.js** với framework **Express.js**, làm nhiệm vụ nhận request từ client, xử lý logic nghiệp vụ và truy vấn cơ sở dữ liệu.
- **Database:** **MySQL**, lưu trữ dữ liệu có cấu trúc (Relational Database) bao gồm Người dùng, Sản phẩm, Đơn thuê, Yêu thích.

## 2. Cơ chế giao tiếp giữa Frontend và Backend (FE - BE Communication)
Giao tiếp giữa Frontend và Backend tuân theo chuẩn **RESTful API** và sử dụng giao thức **HTTP/HTTPS**.

### 2.1. Cách thức gửi và nhận dữ liệu
- **Công cụ Frontend:** Sử dụng thư viện `Axios` (`axiosInstance.js`) để tạo các HTTP Request (GET, POST, PUT, DELETE) gửi tới Backend.
- **Định dạng dữ liệu:** Trao đổi dữ liệu chủ yếu qua định dạng **JSON** (`application/json`). Riêng với chức năng upload ảnh, hệ thống sử dụng định dạng `multipart/form-data`.
- **CORS (Cross-Origin Resource Sharing):** Do FE chạy ở port `5173` và BE chạy ở port `5000`, Backend sử dụng middleware `cors` để cấp quyền cho Frontend được phép gọi API xuyên domain.

### 2.2. Cơ chế xác thực (Authentication Mechanism)
- Hệ thống sử dụng **JWT (JSON Web Token)**.
- Khi người dùng đăng nhập thành công, Backend tạo một chuỗi Token và gửi về Frontend.
- Frontend lưu Token này vào `localStorage`.
- Ở các request tiếp theo yêu cầu quyền bảo mật (như tạo sản phẩm, thêm yêu thích, thuê hàng), Frontend đính kèm Token này vào **HTTP Header** (`Authorization: Bearer <token>`).
- Backend có một middleware `verifyToken` chặn trước các endpoint bảo mật, giải mã Token để xác minh danh tính người dùng trước khi cho phép thực thi logic.

---

## 3. Danh sách RESTful API chi tiết (API Specification)

Dưới đây là các API cốt lõi cấu thành nên hệ thống SecondNest:

### 3.1. Authentication APIs (`/api/auth`)
- `POST /api/auth/register`: Đăng ký tài khoản mới (Body: username, email, password).
- `POST /api/auth/login`: Đăng nhập, trả về JWT Token và thông tin user.
- `GET /api/auth/me`: Lấy thông tin user hiện tại (Yêu cầu Header chứa Token).

### 3.2. Product APIs (`/api/products`)
- `GET /api/products`: Lấy danh sách sản phẩm. Hỗ trợ query string để phân trang, tìm kiếm và lọc (`?search=...&category=...&type=...&page=...`).
- `GET /api/products/:id`: Lấy thông tin chi tiết của một sản phẩm kèm thông tin người bán.
- `POST /api/products`: Đăng bán/cho thuê sản phẩm mới (Yêu cầu Token).
- `PUT /api/products/:id`: Chỉnh sửa thông tin sản phẩm (Yêu cầu Token + Quyền chủ sở hữu).
- `DELETE /api/products/:id`: Xóa sản phẩm (Yêu cầu Token + Quyền chủ sở hữu).

### 3.3. Rental APIs (`/api/rentals`) - Tính năng cho thuê
- `POST /api/rentals`: Tạo một yêu cầu thuê đồ. (Yêu cầu Token). Body chứa `product_id`, `start_date`, `end_date`. Backend xử lý logic chặn chọn ngày quá 1 tháng và chặn các khoảng ngày bị trùng lặp.
- `GET /api/rentals/:productId`: Lấy danh sách các khoảng thời gian (`start_date`, `end_date`) đã bị đặt của một sản phẩm, để Frontend chặn các ngày này trên bộ chọn lịch.

### 3.4. Upload APIs (`/api/upload`)
- `POST /api/upload`: Upload file hình ảnh lên server thông qua `multer`. Trả về đường dẫn tĩnh của ảnh để Frontend lưu vào cơ sở dữ liệu.

### 3.5. Favorite APIs (`/api/favorites`)
- `GET /api/favorites`: Lấy danh sách sản phẩm yêu thích của user. (Yêu cầu Token).
- `POST /api/favorites/:productId`: Thêm sản phẩm vào danh sách yêu thích. (Yêu cầu Token).
- `DELETE /api/favorites/:productId`: Xóa sản phẩm khỏi danh sách yêu thích.

---

## 4. Phân chia công việc (Task Breakdown)
Quy mô nhóm: 4 thành viên (2 Frontend, 2 Backend). Phân chia theo hướng chuyên môn hóa và phát triển module song song (Agile/Scrum).

### 👨‍💻 Backend Developer 1 (BE1) - Core System & Auth
- **Thiết kế Database:** Thiết kế sơ đồ ERD (Entity Relationship Diagram), viết script SQL tạo các bảng `users`, `products`, `categories`.
- **Hệ thống cốt lõi:** Khởi tạo server Node.js, cấu hình Express, CORS, xử lý biến môi trường (`.env`).
- **Module Authentication:** Viết logic mã hóa mật khẩu (Bcrypt), tạo JWT, middleware xác thực (`verifyToken`), API Login/Register.
- **Module Upload:** Thiết lập thư viện Multer để xử lý lưu trữ file tĩnh cục bộ.

### 👨‍💻 Backend Developer 2 (BE2) - Business Logic & Modules
- **Module Products:** Xử lý logic truy vấn SQL phức tạp (JOIN bảng), xây dựng các API CRUD sản phẩm, thuật toán phân trang (pagination) và lọc (filter, search).
- **Module Rentals:** Xây dựng bảng `rentals`, thiết kế thuật toán kiểm tra sự trùng lặp ngày thuê (overlapping dates logic), kiểm tra giới hạn 30 ngày.
- **Module Favorites & Reviews:** Xây dựng API thả tim sản phẩm và quản lý đánh giá người bán.

### 🎨 Frontend Developer 1 (FE1) - Core UI & User Flow
- **Base Architecture:** Khởi tạo dự án Vite-React, thiết lập React Router cho điều hướng trang, cấu hình Axios (`axiosInstance.js`) để tự động đính kèm Token.
- **Pages & Components:** Code giao diện trang chủ, thanh điều hướng (Navbar), Footer, các trang Đăng nhập / Đăng ký.
- **API Integration:** Gọi API xác thực để quản lý trạng thái đăng nhập (Context API/Zustand), hiển thị lỗi Validation. Gọi API để render danh sách Categories và các sản phẩm nổi bật ở trang chủ.

### 🎨 Frontend Developer 2 (FE2) - Complex Logic & Features
- **Trang Product List & Filter:** Code giao diện trang danh sách sản phẩm, tích hợp các bộ lọc (giá, loại, danh mục) và đồng bộ với query string.
- **Trang Product Detail & Calendar:** Xây dựng giao diện chi tiết sản phẩm. Tích hợp thư viện `react-datepicker`, gọi API Rentals để vô hiệu hóa (block) các ngày đã có người thuê, xử lý logic chọn ngày hợp lệ.
- **User Dashboard:** Giao diện quản lý "Tin đăng của tôi" (My Listings), trang danh sách Yêu thích (Favorites) và gọi API tương ứng.

---

## 5. Lộ trình thực hiện chi tiết trong 8 tuần (8-Week Implementation Plan)

### Tuần 1: Lên ý tưởng & Thiết kế hệ thống (Ideation & System Design)
- **Cả nhóm:** Họp chốt yêu cầu bài toán (Requirements), xác định các tính năng cốt lõi (MVP).
- **BE1 & BE2:** Thiết kế cơ sở dữ liệu (ERD), viết file thiết kế API (API Specs/Swagger nháp).
- **FE1 & FE2:** Thiết kế Wireframe/UI Mockup trên Figma cho các trang chính (Home, Detail, Login). Khởi tạo dự án React (Vite) và cài đặt thư viện cơ bản.

### Tuần 2: Xây dựng nền tảng & Authentication (Foundation & Auth)
- **BE1:** Cài đặt Node.js/Express, kết nối MySQL, xây dựng API Đăng nhập/Đăng ký (JWT).
- **FE1:** Code giao diện Login/Register, tích hợp API Auth, quản lý state đăng nhập (Context/Redux hoặc lưu localStorage).
- **BE2:** Thiết lập cấu trúc thư mục controllers/routes, chuẩn bị file cấu trúc dữ liệu cho Products.
- **FE2:** Code layout chuẩn (Header, Footer, Navigation) và các thành phần UI dùng chung (Buttons, Cards).

### Tuần 3: Quản lý Sản phẩm (Product Management - Phase 1)
- **BE2:** Xây dựng API CRUD cho Sản phẩm (Tạo, Sửa, Xóa, Lấy chi tiết).
- **BE1:** Xây dựng API Upload ảnh (Multer) tích hợp vào quá trình tạo sản phẩm.
- **FE2:** Code giao diện trang Chi tiết sản phẩm (Product Detail) và hiển thị dữ liệu tĩnh.
- **FE1:** Code trang "Đăng tin mới" (Post Product), kết nối API Upload ảnh và API Tạo sản phẩm.

### Tuần 4: Hiển thị & Tìm kiếm Sản phẩm (Product Display & Search)
- **BE2:** Cập nhật API Get Products hỗ trợ phân trang (Pagination), lọc (Filter by Category, Type), tìm kiếm (Search).
- **FE2:** Code trang Danh sách sản phẩm (Product List), tích hợp các bộ lọc và tìm kiếm gọi API tương ứng.
- **FE1:** Hoàn thiện giao diện Trang chủ (Home), hiển thị "Sản phẩm nổi bật" và "Danh mục".
- **BE1:** Hỗ trợ BE2 tối ưu hóa truy vấn cơ sở dữ liệu (SQL Joins, Indexes).

### Tuần 5: Tính năng Cho thuê hàng hóa (Rental Feature)
- **BE2:** Tạo bảng `rentals`, viết API tạo đơn thuê (kiểm tra block lịch, giới hạn 30 ngày) và API lấy lịch đã thuê.
- **FE2:** Tích hợp `react-datepicker` vào trang Chi tiết sản phẩm (đối với hàng cho thuê), xử lý logic vô hiệu hóa ngày đã thuê.
- **BE1:** Viết API quản lý Categories (kèm số lượng sản phẩm).
- **FE1:** Tối ưu hóa UI/UX cho lịch chọn ngày, hỗ trợ kiểm tra lỗi nhập liệu từ người dùng.

### Tuần 6: Tính năng mở rộng (Yêu thích, Đánh giá) & Quản lý User
- **BE2:** Xây dựng API Favorites (Thích sản phẩm) và Reviews (Đánh giá người bán).
- **FE2:** Tích hợp nút thả tim (Favorite) trên Product Card, làm trang "Danh sách Yêu thích".
- **FE1:** Xây dựng trang Quản lý tin đăng (My Listings) cho người bán.
- **BE1:** Xây dựng API lấy thông tin người bán (Seller Profile) và API lấy tin đăng theo User.

### Tuần 7: Kiểm thử & Sửa lỗi (Testing & Bug Fixing)
- **Cả nhóm:** Tiến hành kiểm thử chéo (Cross-testing). Frontend test API bằng Postman/Swagger, Backend test UI/UX trên trình duyệt.
- **BE1 & BE2:** Sửa các lỗi liên quan đến logic, chuẩn hóa mã lỗi HTTP (400, 404, 500) và validate dữ liệu đầu vào.
- **FE1 & FE2:** Sửa lỗi giao diện (Responsive trên điện thoại), xử lý trạng thái Loading/Error khi gọi API.

### Tuần 8: Triển khai & Viết báo cáo (Deployment & Documentation)
- **BE1 & BE2:** Chuẩn bị file SQL khởi tạo Database hoàn chỉnh, dọn dẹp code rác, (Tùy chọn: Deploy backend lên Render/VPS).
- **FE1 & FE2:** Chạy build frontend (`npm run build`), kiểm tra hiệu năng, (Tùy chọn: Deploy lên Vercel/Netlify).
- **Cả nhóm:** Hoàn thành tài liệu báo cáo kỹ thuật (Software Engineering Report), quay video demo, chuẩn bị slide thuyết trình bảo vệ đồ án.

---
*Báo cáo này phản ánh kiến trúc thực tế của hệ thống và tuân thủ các nguyên lý thiết kế phần mềm hiện đại (Tách biệt mối quan tâm - Separation of Concerns).*
