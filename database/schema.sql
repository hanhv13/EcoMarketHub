-- 1. Xóa và tạo mới Database
DROP DATABASE IF EXISTS secondnest;
CREATE DATABASE secondnest CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE secondnest;

-- 2. Tạo bảng USERS (Phải có trước để products tham chiếu tới)
CREATE TABLE users (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    username    VARCHAR(50) NOT NULL UNIQUE,
    email       VARCHAR(100) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    avatar_url  VARCHAR(500) DEFAULT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tạo bảng CATEGORIES (Phải có trước để products tham chiếu tới)
CREATE TABLE categories (
    id    INT AUTO_INCREMENT PRIMARY KEY,
    name  VARCHAR(100) NOT NULL UNIQUE
);

-- 4. Tạo bảng PRODUCTS (Chứa khóa ngoại trỏ tới users và categories)
CREATE TABLE products (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    user_id      INT NOT NULL,
    category_id  INT NULL,                       -- Cho phép NULL để khớp với ON DELETE SET NULL
    title        VARCHAR(200) NOT NULL,
    description  TEXT,
    price        DECIMAL(15, 0) NOT NULL,
    image_url    VARCHAR(500) DEFAULT NULL,
    type         ENUM('sell', 'rent') DEFAULT 'sell',
    status       ENUM('active', 'sold', 'hidden') DEFAULT 'active',
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

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