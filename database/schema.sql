-- 1. Xóa và tạo mới Database
DROP DATABASE IF EXISTS ecomarkethub;
CREATE DATABASE ecomarkethub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ecomarkethub;

-- 2. Tạo bảng USERS
CREATE TABLE users (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    username     VARCHAR(50) NOT NULL UNIQUE,
    email        VARCHAR(100) NOT NULL UNIQUE,
    password     VARCHAR(255) NOT NULL,
    role         ENUM('user', 'admin') DEFAULT 'user',
    green_points INT DEFAULT 0,
    avatar_url   VARCHAR(500) DEFAULT NULL,
    is_verified  BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255) DEFAULT NULL,
    reset_password_token VARCHAR(255) DEFAULT NULL,
    reset_password_expires DATETIME DEFAULT NULL,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tạo bảng CATEGORIES
CREATE TABLE categories (
    id    INT AUTO_INCREMENT PRIMARY KEY,
    name  VARCHAR(100) NOT NULL UNIQUE
);

-- 4. Tạo bảng PRODUCTS
CREATE TABLE products (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    user_id        INT NOT NULL,
    category_id    INT NULL,
    title          VARCHAR(200) NOT NULL,
    description    TEXT,
    price          DECIMAL(15, 0) NOT NULL,
    `condition`    VARCHAR(50) DEFAULT 'Used',
    location       VARCHAR(255) DEFAULT 'Vietnam',
    is_premium     BOOLEAN DEFAULT FALSE,
    is_upcycled    BOOLEAN DEFAULT FALSE,
    stock_quantity INT DEFAULT 1,
    image_url      VARCHAR(500) DEFAULT NULL,
    images         JSON DEFAULT NULL,
    type           ENUM('sell', 'rent') DEFAULT 'sell',
    status         ENUM('active', 'sold', 'hidden') DEFAULT 'active',
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_product_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_product_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- 5. Tạo bảng FAVORITES
CREATE TABLE favorites (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    user_id     INT NOT NULL,
    product_id  INT NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_favorite (user_id, product_id),
    CONSTRAINT fk_fav_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_fav_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 6. Tạo bảng RENTALS
CREATE TABLE rentals (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    user_id    INT NOT NULL,
    start_date DATE NOT NULL,
    end_date   DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_rental_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    CONSTRAINT fk_rental_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 7. Tạo bảng EVENTS (cho GreenHub)
CREATE TABLE events (
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

-- 8. Tạo bảng REVIEWS (đánh giá người bán)
CREATE TABLE reviews (
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

-- 9. Tạo bảng PURCHASES (lịch sử mua hàng)
CREATE TABLE purchases (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    buyer_id    INT NOT NULL,
    seller_id   INT NOT NULL,
    product_id  INT NOT NULL,
    quantity    INT DEFAULT 1,
    price       DECIMAL(15, 0) NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_purchase_buyer FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_purchase_seller FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_purchase_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

