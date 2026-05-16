USE secondnest;

-- 1. Cập nhật bảng USERS: Thêm cột role
ALTER TABLE users ADD COLUMN role ENUM('user', 'admin') DEFAULT 'user' AFTER password;

-- Thiết lập một tài khoản admin mẫu (hung_dev làm admin)
UPDATE users SET role = 'admin' WHERE username = 'hung_dev';

-- 2. Cập nhật bảng PRODUCTS: Thêm condition, location, is_premium, images
ALTER TABLE products 
ADD COLUMN `condition` VARCHAR(50) DEFAULT 'Used' AFTER price,
ADD COLUMN `location` VARCHAR(255) DEFAULT 'Vietnam' AFTER `condition`,
ADD COLUMN `is_premium` BOOLEAN DEFAULT FALSE AFTER `location`,
ADD COLUMN `images` JSON DEFAULT NULL AFTER `image_url`;

-- Cập nhật dữ liệu mẫu cho products để có images dạng JSON
UPDATE products SET images = JSON_ARRAY(image_url) WHERE image_url IS NOT NULL;

-- 3. Tạo bảng EVENTS (cho GreenHub)
CREATE TABLE IF NOT EXISTS events (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    user_id     INT NOT NULL,
    title       VARCHAR(255) NOT NULL,
    description TEXT,
    image_url   VARCHAR(500),
    location    VARCHAR(255),
    event_date  DATETIME,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_event_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Tạo bảng REVIEWS (đánh giá người bán)
CREATE TABLE IF NOT EXISTS reviews (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    seller_id    INT NOT NULL,
    reviewer_id  INT NOT NULL,
    rating       INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment      TEXT,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_review_seller   FOREIGN KEY (seller_id)   REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_review_reviewer FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_review (seller_id, reviewer_id)
);

-- 5. Thêm dữ liệu mẫu cho EVENTS
INSERT INTO events (user_id, title, description, image_url, location, event_date) VALUES
(1, 'Workshop Tái Chế Nhựa', 'Cùng học cách biến rác thải nhựa thành vật dụng hữu ích.', 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b', 'GreenHub Center', '2024-06-20 09:00:00'),
(1, 'Ngày Hội Đổi Đồ Cũ', 'Đem đồ không dùng nữa đến đổi lấy những món đồ bạn cần.', 'https://images.unsplash.com/photo-1532347921848-21e441c7365a', 'Hồ Hoàn Kiếm', '2024-06-25 08:00:00');

-- 6. Thêm dữ liệu mẫu cho REVIEWS
INSERT INTO reviews (seller_id, reviewer_id, rating, comment) VALUES
(1, 2, 5, 'Người bán rất nhiệt tình, máy laptop dùng rất tốt.'),
(1, 3, 4, 'Sản phẩm đúng mô tả, giao hàng nhanh.'),
(2, 4, 5, 'Áo còn rất mới, cảm ơn bạn.');
