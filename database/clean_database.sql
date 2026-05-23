USE ecomarkethub;
SET FOREIGN_KEY_CHECKS = 0;

DELETE FROM reviews;
ALTER TABLE reviews AUTO_INCREMENT = 1;

DELETE FROM events;
ALTER TABLE events AUTO_INCREMENT = 1;

DELETE FROM favorites;
ALTER TABLE favorites AUTO_INCREMENT = 1;

DELETE FROM products;
ALTER TABLE products AUTO_INCREMENT = 1;

DELETE FROM categories;
ALTER TABLE categories AUTO_INCREMENT = 1;

DELETE FROM users;
ALTER TABLE users AUTO_INCREMENT = 1;

SET FOREIGN_KEY_CHECKS = 1;

-- 1. Create Users
-- Password for both: password123 (hashed)
INSERT INTO users (id, username, email, password, role, is_verified) VALUES 
-- admin: hung@example.com - admin123
(1, 'hung_dev', 'hung@example.com', '$2a$10$ko/TrI4JItGWmcyRT9gTze2FzW.ZMFvK78Ga5VE6VHXuQ4O6nujxi', 'admin', 1),
(2, 'user_test', 'user@example.com', '$2a$10$MybM3SZabopEZ.//K0x9vuizCICr670zdjm1wAMvVBV0VhUxpXyb2', 'user', 1);

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

-- 3. Create Sample Products (30 Products)
INSERT INTO products (user_id, category_id, title, description, price, type, `condition`, location, is_premium, is_upcycled, stock_quantity, status, image_url) VALUES 
(2, 1, 'MacBook Pro M1 2020', 'Space Gray, 16GB RAM, 512GB SSD. Perfect condition.', 25000000, 'sell', 'Like New', 'Hanoi', 1, 0, 1, 'active', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80'),
(2, 6, 'Vintage Vespa Sprint', 'Restored 1974 model. Runs smoothly. Classic red color.', 45000000, 'sell', 'Restored', 'Ho Chi Minh City', 0, 0, 1, 'active', 'https://images.unsplash.com/photo-1558981403-c5f97cb92751?w=800&q=80'),
(1, 3, 'Retro Coffee Table', 'Solid wood, mid-century modern design.', 120000, 'rent', 'Good', 'Da Nang', 0, 0, 1, 'active', 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800&q=80'),
(1, 3, 'Upcycled Pallet Sofa', 'Handmade sofa made from recycled wooden pallets. Cushions included.', 1500000, 'sell', 'New', 'Hanoi', 1, 1, 5, 'active', 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80'),
(2, 2, 'Vintage Denim Jacket', 'Classic 90s Levi jacket, slightly faded but great condition.', 450000, 'sell', 'Good', 'Hai Phong', 0, 0, 1, 'active', 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800&q=80'),
(1, 2, 'Recycled Tote Bags', 'Eco-friendly tote bags made from 100% recycled cotton.', 85000, 'sell', 'New', 'Hanoi', 0, 1, 50, 'active', 'https://images.unsplash.com/photo-1597484662317-9bd7bdda2907?w=800&q=80'),
(2, 1, 'Sony A7III Camera Body', 'Used for 2 years, shutter count 25k. Works perfectly.', 28000000, 'rent', 'Good', 'Ho Chi Minh City', 1, 0, 1, 'active', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80'),
(1, 5, 'Upcycled Oil Drum Chair', 'Unique armchair made from an upcycled oil drum. Industrial style.', 2200000, 'sell', 'New', 'Da Nang', 1, 1, 3, 'active', 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80'),
(2, 4, 'Harry Potter Complete Set', 'First edition hardcover books. Slightly yellowed pages.', 1200000, 'sell', 'Acceptable', 'Can Tho', 0, 0, 1, 'active', 'https://images.unsplash.com/photo-1626618012641-bfbca5a31239?w=800&q=80'),
(1, 4, 'Recycled Paper Notebook', 'Hand-bound notebook with 100% recycled paper.', 45000, 'sell', 'New', 'Hanoi', 0, 1, 100, 'active', 'https://images.unsplash.com/photo-1531346878377-a541e4a115fa?w=800&q=80'),
(2, 7, 'Used Trek Mountain Bike', 'Great for off-road trails. Maintained regularly.', 5500000, 'rent', 'Good', 'Da Lat', 0, 0, 1, 'active', 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80'),
(1, 3, 'Glass Bottle Lamp', 'Table lamp made from upcycled wine bottles. Warm LED bulb included.', 350000, 'sell', 'New', 'Hanoi', 0, 1, 15, 'active', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80'),
(2, 1, 'iPhone 13 Pro Max 256GB', 'Battery health 88%. Minor scratch on the back.', 14500000, 'sell', 'Good', 'Ho Chi Minh City', 1, 0, 1, 'active', 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800&q=80'),
(1, 2, 'Upcycled Patchwork Skirt', 'Made from leftover denim scraps. Unique design.', 550000, 'sell', 'New', 'Hanoi', 0, 1, 4, 'active', 'https://images.unsplash.com/photo-1582142407894-ec85a1260a46?w=800&q=80'),
(2, 5, 'Antique Wooden Wardrobe', '100 year old wardrobe. Beautiful carving.', 8500000, 'sell', 'Restored', 'Hue', 1, 0, 1, 'active', 'https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?w=800&q=80'),
(1, 8, 'Tire Planter Pots', 'Colorful planters made from upcycled car tires.', 150000, 'sell', 'New', 'Da Nang', 0, 1, 20, 'active', 'https://images.unsplash.com/photo-1416879598553-33e3872cfdbb?w=800&q=80'),
(2, 7, 'Camping Tent 4-Person', 'Used twice. No tears, all pegs included.', 150000, 'rent', 'Like New', 'Hanoi', 0, 0, 1, 'active', 'https://images.unsplash.com/photo-1504280390224-11883be7ebaf?w=800&q=80'),
(1, 3, 'Plastic Waste Coasters', 'Set of 4 coasters made from melted plastic caps.', 80000, 'sell', 'New', 'Hanoi', 0, 1, 30, 'active', 'https://images.unsplash.com/photo-1605333396914-2323f4625b15?w=800&q=80'),
(2, 1, 'Samsung Galaxy S22 Ultra', 'Used, minor scratches. With box and charger.', 11000000, 'sell', 'Good', 'Ho Chi Minh City', 0, 0, 1, 'active', 'https://images.unsplash.com/photo-1644982647844-5ee1bdc5b114?w=800&q=80'),
(1, 6, 'Upcycled Skateboard Shelf', 'Wall shelf made from an old broken skateboard.', 450000, 'sell', 'New', 'Da Nang', 1, 1, 5, 'active', 'https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?w=800&q=80'),
(2, 2, 'Nike Air Jordan 1 Retro', 'Worn a few times. Box included. Size 42.', 3200000, 'sell', 'Like New', 'Hanoi', 1, 0, 1, 'active', 'https://images.unsplash.com/photo-1552346154-21d32810baa3?w=800&q=80'),
(1, 4, 'Recycled Cardboard Desk Organizer', 'Sturdy and eco-friendly desk organizer.', 120000, 'sell', 'New', 'Hanoi', 0, 1, 40, 'active', 'https://images.unsplash.com/photo-1505322022026-b51f08e92f25?w=800&q=80'),
(2, 3, 'Persian Rug 2x3m', 'Handwoven, needs dry cleaning but otherwise perfect.', 4500000, 'sell', 'Acceptable', 'Ho Chi Minh City', 1, 0, 1, 'active', 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=800&q=80'),
(1, 5, 'Upcycled Cassette Tape Lamp', 'Retro desk lamp made from old cassette tapes.', 550000, 'sell', 'New', 'Hanoi', 0, 1, 8, 'active', 'https://images.unsplash.com/photo-1533618698502-39cfa341352f?w=800&q=80'),
(2, 7, 'Tennis Racket Wilson Pro', 'Strung last month. Grip is slightly worn.', 1800000, 'sell', 'Good', 'Da Nang', 0, 0, 1, 'active', 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&q=80'),
(1, 2, 'Recycled Nylon Backpack', 'Waterproof backpack made from recycled fishing nets.', 950000, 'sell', 'New', 'Ho Chi Minh City', 1, 1, 15, 'active', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80'),
(2, 1, 'Mechanical Keyboard Custom', 'Built with Gateron Yellows. Excellent sound.', 2500000, 'sell', 'Like New', 'Hanoi', 0, 0, 1, 'active', 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80'),
(1, 3, 'Upcycled Vinyl Record Clock', 'Wall clock made from an old vinyl record.', 320000, 'sell', 'New', 'Hanoi', 0, 1, 25, 'active', 'https://images.unsplash.com/photo-1619983081563-430f63602796?w=800&q=80'),
(2, 6, 'Honda Super Cub 50cc', 'Classic bike. Engine rebuilt recently.', 12000000, 'sell', 'Restored', 'Hue', 1, 0, 1, 'active', 'https://images.unsplash.com/photo-1558981403-c5f97cb92751?w=800&q=80'),
(1, 8, 'Upcycled Cereal Box Journal', 'Cute pocket journals made from cereal boxes.', 35000, 'sell', 'New', 'Hanoi', 0, 1, 60, 'active', 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80');

-- 4. Create Sample Events
INSERT INTO events (user_id, title, description, location, event_date, image_url) VALUES 
(1, 'Plastic Recycling Workshop', 'Join us to learn how to upcycle plastic bottles into art.', 'GreenHub Hanoi', '2026-06-15 09:00:00', 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=1000&auto=format&fit=crop'),
(1, 'Eco-Market Festival', 'Huge exchange market for second-hand items and eco-friendly products.', 'Reunion Park', '2026-07-20 10:00:00', 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?q=80&w=1000&auto=format&fit=crop');

-- 5. Create Sample Reviews
INSERT INTO reviews (seller_id, reviewer_id, rating, comment) VALUES 
(1, 2, 5, 'Great seller, highly professional!'),
(2, 1, 4, 'Very helpful and friendly buyer.');
