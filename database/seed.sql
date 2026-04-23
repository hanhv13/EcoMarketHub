-- ============================================================
-- FILE: database/seed.sql
-- CHỨC NĂNG: Chèn dữ liệu mẫu để test app
-- CÁCH DÙNG: Chạy SAU schema.sql
-- NGƯỜI PHỤ TRÁCH: M2
-- ============================================================

USE secondnest;

-- ============================================================
-- Dữ liệu mẫu cho bảng categories
-- ============================================================
INSERT INTO categories (name) VALUES
('Điện tử & Công nghệ'),
('Quần áo & Thời trang'),
('Đồ gia dụng'),
('Sách & Văn phòng phẩm'),
('Thể thao & Dã ngoại'),
('Xe cộ & Phụ kiện'),
('Nội thất'),
('Khác');

-- ============================================================
-- Dữ liệu mẫu cho bảng users
-- Lưu ý: password ở đây là 'password123' đã được hash bằng bcrypt
-- Khi chạy thật, password sẽ do backend tự hash khi đăng ký
-- ============================================================
INSERT INTO users (username, email, password) VALUES
('hung_dev',   'hung@example.com',   '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('ha_anh',     'haanh@example.com',  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('bui_duc',    'buiduc@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('bao_fe',     'bao@example.com',    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- ============================================================
-- Dữ liệu mẫu cho bảng products
-- ============================================================
INSERT INTO products (user_id, category_id, title, description, price, type) VALUES
(1, 1, 'Laptop Dell XPS 13 2020', 'Máy còn 85%, pin 4 tiếng, kèm sạc zin. Lý do bán: mua máy mới.', 12000000, 'sell'),
(1, 1, 'iPhone 13 Pro 128GB', 'Màu Sierra Blue, fullbox, không trầy. Mua 12/2022.', 18000000, 'sell'),
(2, 2, 'Áo thun Uniqlo size M', 'Màu trắng, mặc 3 lần, còn mới 95%. Không vừa nên bán lại.', 150000, 'sell'),
(2, 4, 'Bộ sách Clean Code + Design Patterns', '2 cuốn tiếng Anh, còn mới, không ghi chú.', 280000, 'sell'),
(3, 3, 'Nồi cơm điện Toshiba 1.8L', 'Dùng 1 năm, còn tốt. Kèm xửng hấp.', 350000, 'sell'),
(3, 7, 'Bàn học gỗ 120x60cm', 'Gỗ MDF, màu walnut. Tháo rời được. Tự vận chuyển.', 800000, 'sell'),
(4, 5, 'Xe đạp Giant ATX 810', 'Size M, đã thay líp và xích mới. Phù hợp đi núi.', 4500000, 'sell'),
(4, 1, 'Máy ảnh Sony A6000 + kit 16-50', 'Chụp đẹp, body 8/10. Kèm 2 pin, túi đựng.', 7000000, 'sell'),
(1, 6, 'Xe máy Honda Wave 110', 'Biển HN, đời 2019, đăng kiểm còn 1 năm. Ít đi.', 15000000, 'sell'),
(2, 1, 'Màn hình Dell 24inch Full HD', 'IPS, 60Hz, cổng HDMI + VGA. Không pixel chết.', 2200000, 'sell');

-- ============================================================
-- Dữ liệu mẫu cho bảng favorites (ai yêu thích sản phẩm nào)
-- ============================================================
INSERT INTO favorites (user_id, product_id) VALUES
(2, 1),  -- ha_anh yêu thích laptop của hung_dev
(3, 2),  -- bui_duc yêu thích iPhone của hung_dev
(4, 3),  -- bao_fe yêu thích áo của ha_anh
(1, 8);  -- hung_dev yêu thích máy ảnh của bao_fe

-- Kiểm tra dữ liệu đã vào chưa
SELECT 'Categories:' AS '', COUNT(*) AS total FROM categories;
SELECT 'Users:' AS '', COUNT(*) AS total FROM users;
SELECT 'Products:' AS '', COUNT(*) AS total FROM products;
SELECT 'Favorites:' AS '', COUNT(*) AS total FROM favorites;
