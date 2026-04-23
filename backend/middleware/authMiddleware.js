// ============================================================
// FILE: backend/middleware/authMiddleware.js
// CHỨC NĂNG: Kiểm tra token JWT trong header của request
//            Nếu hợp lệ → cho qua, nếu không → trả lỗi 401
// CÁCH DÙNG: Thêm vào trước route handler cần bảo vệ
// NGƯỜI PHỤ TRÁCH: M1
// ============================================================

const jwt = require('jsonwebtoken'); // Thư viện tạo và kiểm tra JWT token

// Đây là một "middleware" — hàm chạy ở giữa request và response
// Nhận vào: req (request), res (response), next (hàm gọi middleware tiếp theo)
const authMiddleware = (req, res, next) => {
    // Bước 1: Lấy token từ header Authorization
    // React sẽ gửi header dạng: Authorization: Bearer eyJhbGci...
    const authHeader = req.headers['authorization'];

    // Nếu không có header Authorization → từ chối
    if (!authHeader) {
        return res.status(401).json({ message: 'Không có token, vui lòng đăng nhập.' });
    }

    // Header có dạng "Bearer TOKEN" → tách lấy phần TOKEN
    const token = authHeader.split(' ')[1]; // ['Bearer', 'TOKEN'][1] → 'TOKEN'

    if (!token) {
        return res.status(401).json({ message: 'Token không đúng định dạng.' });
    }

    // Bước 2: Xác minh token có hợp lệ không
    try {
        // jwt.verify sẽ giải mã token và kiểm tra chữ ký
        // Nếu token hết hạn hoặc bị giả mạo → throw error
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Lưu thông tin user vào req để các controller sau dùng được
        // decoded sẽ là object { id: 1, email: 'user@example.com', iat: ..., exp: ... }
        req.user = decoded;

        // Gọi next() để chuyển sang handler tiếp theo
        next();
    } catch (error) {
        // Token sai hoặc hết hạn
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token đã hết hạn, vui lòng đăng nhập lại.' });
        }
        return res.status(401).json({ message: 'Token không hợp lệ.' });
    }
};

module.exports = authMiddleware;
