// ============================================================
// FILE: backend/routes/uploadRoutes.js
// CHỨC NĂNG: Nhận file ảnh từ React, lưu vào thư mục uploads/
// NGƯỜI PHỤ TRÁCH: M1
// ============================================================
const express = require('express');
const router  = express.Router();
const multer  = require('multer');   // Thư viện xử lý upload file
const path    = require('path');
const authMiddleware = require('../middleware/authMiddleware');

// Cấu hình nơi lưu file và tên file
const storage = multer.diskStorage({
    // Lưu file vào thư mục uploads/
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads/'));
    },
    // Đặt tên file: timestamp + tên gốc (để tránh trùng tên)
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname); // Lấy đuôi file: .jpg, .png
        cb(null, `product-${uniqueSuffix}${ext}`);
    }
});

// Chỉ chấp nhận file ảnh
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);  // Chấp nhận
    } else {
        cb(new Error('Chỉ chấp nhận file ảnh (jpg, png, webp).'), false); // Từ chối
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Giới hạn 5MB
});

// POST /api/upload — Nhận file, lưu vào server, trả về URL
router.post('/', authMiddleware, upload.single('image'), (req, res) => {
    // upload.single('image') — chỉ nhận 1 file, tên field là 'image'
    // Sau khi multer xử lý, file info nằm ở req.file

    if (!req.file) {
        return res.status(400).json({ message: 'Không có file nào được upload.' });
    }

    // Tạo URL để truy cập ảnh từ trình duyệt
    // VD: http://localhost:5000/uploads/product-1234567890.jpg
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    res.json({
        message: 'Upload ảnh thành công!',
        imageUrl,
        filename: req.file.filename
    });
});

// Xử lý lỗi multer
router.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'File quá lớn. Tối đa 5MB.' });
        }
    }
    res.status(400).json({ message: err.message });
});

module.exports = router;