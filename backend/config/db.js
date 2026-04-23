// ============================================================
// FILE: backend/config/db.js
// CHỨC NĂNG: Tạo kết nối tới MySQL database
//            Được import vào các controller để chạy SQL
// NGƯỜI PHỤ TRÁCH: M1
// ============================================================

const mysql = require('mysql2');  // Thư viện kết nối MySQL

// Tạo "pool" kết nối — thay vì mở/đóng kết nối mỗi lần,
// pool giữ sẵn nhiều kết nối để dùng lại, tốt hơn về hiệu năng
const pool = mysql.createPool({
    host:     process.env.DB_HOST || 'localhost',  // Địa chỉ MySQL server
    user:     process.env.DB_USER || 'root',       // Tên đăng nhập MySQL
    password: process.env.DB_PASSWORD || '',       // Mật khẩu MySQL (lấy từ .env)
    database: process.env.DB_NAME || 'secondnest', // Tên database
    port:     process.env.DB_PORT || 3306,         // Cổng MySQL mặc định
    waitForConnections: true,   // Chờ nếu hết kết nối trong pool
    connectionLimit: 10,        // Tối đa 10 kết nối đồng thời
    charset: 'utf8mb4',         // Hỗ trợ emoji và tiếng Việt
});

// Chuyển pool sang dạng "promise" để dùng async/await
// Thay vì dùng callback (phức tạp hơn), ta dùng await cho gọn
const promisePool = pool.promise();

// Kiểm tra kết nối khi server khởi động
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Không kết nối được MySQL:', err.message);
        console.error('💡 Kiểm tra lại: DB_HOST, DB_USER, DB_PASSWORD trong file .env');
    } else {
        console.log('✅ Kết nối MySQL thành công!');
        connection.release(); // Trả kết nối về pool sau khi kiểm tra xong
    }
});

// Export pool để các file khác dùng: const db = require('./config/db')
module.exports = promisePool;
