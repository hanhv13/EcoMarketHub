// ============================================================
// FILE: backend/server.js
// CHỨC NĂNG: Điểm khởi động của server Node.js
//            Cấu hình Express, CORS, và kết nối các routes
// NGƯỜI PHỤ TRÁCH: M1
// ============================================================

// Bước 1: Load các thư viện cần dùng
const express = require('express'); // Framework tạo web server
const cors = require('cors');       // Cho phép React (port 5173) gọi vào server này (port 5000)
const path = require('path');       // Xử lý đường dẫn file
require('dotenv').config();         // Đọc file .env vào process.env

// Bước 2: Tạo app Express
const app = express();

// Bước 3: Cấu hình middleware (chạy trước mọi request)

// Cho phép các tên miền khác gọi API vào đây (CORS)
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Chỉ cho phép từ React app
    credentials: true,  // Cho phép gửi cookie/header xác thực
}));

// Tự động parse JSON trong body của request
// Không có dòng này thì req.body sẽ bị undefined
app.use(express.json());

// Cho phép truy cập ảnh đã upload qua URL: /uploads/ten-anh.jpg
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Bước 4: Kết nối các file routes (định nghĩa các đường dẫn API)
const authRoutes     = require('./routes/authRoutes');
const productRoutes  = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const uploadRoutes   = require('./routes/uploadRoutes');
const eventRoutes    = require('./routes/eventRoutes');
const reviewRoutes   = require('./routes/reviewRoutes');
const rentalRoutes   = require('./routes/rentalRoutes');


// Gắn routes vào app với prefix URL tương ứng
app.use('/api/auth',       authRoutes);      // /api/auth/register, /api/auth/login
app.use('/api/products',   productRoutes);   // /api/products, /api/products/:id
app.use('/api/categories', categoryRoutes);  // /api/categories
app.use('/api/favorites',  favoriteRoutes);  // /api/favorites
app.use('/api/upload',     uploadRoutes);    // /api/upload
app.use('/api/events',     eventRoutes);     // /api/events
app.use('/api/reviews',    reviewRoutes);    // /api/reviews
app.use('/api/rentals',    rentalRoutes);    // /api/rentals

// Bước 5: Route kiểm tra server có chạy không
app.get('/', (req, res) => {
    res.json({
        message: '🚀 SecondNest API đang chạy!',
        version: '1.0.0',
        endpoints: ['/api/auth', '/api/products', '/api/categories', '/api/favorites', '/api/upload']
    });
});

// Bước 6: Xử lý lỗi 404 khi truy cập URL không tồn tại
app.use((req, res) => {
    res.status(404).json({ message: `Không tìm thấy route: ${req.method} ${req.path}` });
});

// Bước 7: Xử lý lỗi toàn cục (tránh server bị crash)
app.use((err, req, res, next) => {
    console.error('❌ Lỗi server:', err.stack);
    res.status(500).json({ message: 'Lỗi server, vui lòng thử lại sau.' });
});

// Bước 8: Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
    console.log(`📁 Database: ${process.env.DB_NAME}`);
    console.log(`🌐 CORS cho phép: ${process.env.FRONTEND_URL}`);
});
