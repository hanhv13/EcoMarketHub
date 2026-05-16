USE secondnest;
SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE reviews;
TRUNCATE TABLE events;
TRUNCATE TABLE favorites;
TRUNCATE TABLE products;
TRUNCATE TABLE categories;
TRUNCATE TABLE users;

SET FOREIGN_KEY_CHECKS = 1;

-- 1. Create Users
-- Password for both: password123 (hashed)
INSERT INTO users (id, username, email, password, role) VALUES 
(1, 'hung_dev', 'hung@example.com', '$2a$10$7R8WXY/B2pBvMVX.tY7mhuS6V2K5Z9XU7QZ6hVz1z5z5z5z5z5z5z', 'admin'),
(2, 'user_test', 'user@example.com', '$2a$10$7R8WXY/B2pBvMVX.tY7mhuS6V2K5Z9XU7QZ6hVz1z5z5z5z5z5z5z', 'user');

-- 2. Create Categories
INSERT INTO categories (id, name) VALUES 
(1, 'Electronics & Tech'),
(2, 'Fashion & Apparel'),
(3, 'Home & Living'),
(4, 'Books & Stationery'),
(5, 'Furniture'),
(6, 'Vehicles'),
(7, 'Sports & Outdoor'),
(8, 'Others');

-- 3. Create Sample Products
INSERT INTO products (user_id, category_id, title, description, price, type, `condition`, location, is_premium, status, image_url) VALUES 
(2, 1, 'MacBook Pro M1 2020', 'Space Gray, 16GB RAM, 512GB SSD. Perfect condition.', 25000000, 'sell', 'Like New', 'Hanoi', 1, 'active', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000&auto=format&fit=crop'),
(2, 6, 'Vintage Vespa Sprint', 'Restored 1974 model. Runs smoothly. Classic red color.', 45000000, 'sell', 'Restored', 'Ho Chi Minh City', 0, 'active', 'https://images.unsplash.com/photo-1558981403-c5f97cb92751?q=80&w=1000&auto=format&fit=crop'),
(1, 3, 'Retro Coffee Table', 'Solid wood, mid-century modern design.', 120000, 'rent', 'Good', 'Da Nang', 0, 'active', 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=1000&auto=format&fit=crop');

-- 4. Create Sample Events
INSERT INTO events (user_id, title, description, location, event_date, image_url) VALUES 
(1, 'Plastic Recycling Workshop', 'Join us to learn how to upcycle plastic bottles into art.', 'GreenHub Hanoi', '2026-06-15 09:00:00', 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=1000&auto=format&fit=crop'),
(1, 'Eco-Market Festival', 'Huge exchange market for second-hand items and eco-friendly products.', 'Reunion Park', '2026-07-20 10:00:00', 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?q=80&w=1000&auto=format&fit=crop');

-- 5. Create Sample Reviews
INSERT INTO reviews (seller_id, reviewer_id, rating, comment) VALUES 
(1, 2, 5, 'Great seller, highly professional!'),
(2, 1, 4, 'Very helpful and friendly buyer.');
