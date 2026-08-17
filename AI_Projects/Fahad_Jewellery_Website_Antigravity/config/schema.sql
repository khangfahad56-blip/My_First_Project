-- ============================================================
-- Fahad Jewellery Phase 2 Updated Database Schema
-- Run this in phpMyAdmin: http://localhost/phpmyadmin
-- ============================================================

CREATE DATABASE IF NOT EXISTS fahad_jewellery_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE fahad_jewellery_db;

DROP TABLE IF EXISTS gold_rates;
DROP TABLE IF EXISTS products;

-- Gold & Silver Daily Rates (24K, 21K Gold and Normal, Italian Silver)
CREATE TABLE gold_rates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    gold_24k DECIMAL(10,2) NOT NULL COMMENT 'PKR per Tola',
    gold_21k DECIMAL(10,2) NOT NULL COMMENT 'PKR per Tola',
    silver_normal DECIMAL(10,2) NOT NULL COMMENT 'PKR per Tola',
    silver_italian DECIMAL(10,2) NOT NULL COMMENT 'PKR per Tola',
    rate_date DATE NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_date (rate_date)
);

-- Insert today's initial rates
INSERT INTO gold_rates (gold_24k, gold_21k, silver_normal, silver_italian, rate_date)
VALUES (329500.00, 288300.00, 3600.00, 4800.00, CURDATE())
ON DUPLICATE KEY UPDATE 
    gold_24k=VALUES(gold_24k), 
    gold_21k=VALUES(gold_21k), 
    silver_normal=VALUES(silver_normal), 
    silver_italian=VALUES(silver_italian);

-- Calculator Variables & Store Settings
CREATE TABLE IF NOT EXISTS settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(50) UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO settings (setting_key, setting_value) VALUES
('buy_cut_default', '9.5'),
('buy_divisor', '12.150'),
('sell_divisor', '12'),
('store_hours', 'Saturday – Thursday: 10:00 AM – 7:00 PM | Friday: Closed'),
('store_phone_primary', '0333-9013157'),
('store_phone_secondary', '0314-9653366'),
('store_whatsapp', '923339013157'),
('store_address', 'Fahad Jewellery, Main Market, Nowshera, KPK, Pakistan')
ON DUPLICATE KEY UPDATE setting_value=VALUES(setting_value);

-- Products Table (24K, 21K, Normal Silver, Italian Silver)
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category ENUM('gold_bridal','gold_bangles','gold_chains','gold_rings','earrings','silver') NOT NULL,
    description TEXT,
    weight_tola DECIMAL(8,3) COMMENT 'Weight in Tola',
    purity ENUM('24K Gold','21K Gold','Normal Silver','Italian Silver') DEFAULT '21K Gold',
    price_pkr DECIMAL(12,2),
    image VARCHAR(255),
    is_featured TINYINT(1) DEFAULT 0,
    is_available TINYINT(1) DEFAULT 1,
    views_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6 Expanded Realistic Products per Category (36 products total)
INSERT INTO products (name, category, description, weight_tola, purity, price_pkr, image, is_featured) VALUES

-- 1. BRIDAL GOLD SETS (6 items)
('Gul-e-Rana 21K Bridal Gold Set', 'gold_bridal', 'Luxurious 21K gold bridal haar with matching jhumkas, maatha patti and 4 bangles. Handcrafted for Pakistani wedding ceremonies.', 5.500, '21K Gold', 1585650.00, 'hero.png', 1),
('Shahi Darbar 24K Pure Gold Set', 'gold_bridal', 'Premium 24K pure gold heavy bridal choker set with traditional filigree work. Certified weight and hallmark purity.', 6.200, '24K Gold', 2042900.00, 'hero.png', 1),
('Khyber Queen 21K Bridal Collection', 'gold_bridal', 'Royal Pashtun style 21K gold bridal necklace set with intricate floral drops and matching rings.', 4.800, '21K Gold', 1383840.00, 'hero.png', 1),
('Noor Mahal 21K Gold Haar Set', 'gold_bridal', 'Elegant 21K gold light-weight bridal set designed for modern walima brides.', 3.500, '21K Gold', 1009050.00, 'hero.png', 0),
('Chaman 21K Gold Bridal Set', 'gold_bridal', 'Classic KPK traditional design gold set with gold bead clusters and adjustable silk cord.', 4.200, '21K Gold', 1220850.00, 'hero.png', 0),
('Al-Hayat 24K Custom Bridal Haar', 'gold_bridal', 'Heavy 24K solid gold ceremonial bridal set crafted on custom order.', 7.000, '24K Gold', 2306500.00, 'hero.png', 0),

-- 2. GOLD BANGLES / KARA (6 items)
('Lalazar 21K Solid Gold Kara (Pair)', 'gold_bangles', 'Pair of solid 21K gold bangles with traditional machine carving and hinged security lock.', 2.500, '21K Gold', 720750.00, 'gold_bangle.png', 1),
('Zarin 21K Gold Bangle Set (4 Pcs)', 'gold_bangles', 'Set of 4 thin 21K gold bangles with diamond-cut pattern giving intense shine.', 3.000, '21K Gold', 864900.00, 'gold_bangle.png', 1),
('Nowshera Special 24K Solid Kara', 'gold_bangles', 'Single heavy 24K solid gold kara for ladies with traditional floral embossing.', 2.000, '24K Gold', 659000.00, 'gold_bangle.png', 1),
('Kangan 21K Daily Wear Bangles', 'gold_bangles', 'Pair of smooth, durable 21K gold bangles suitable for everyday wear.', 1.800, '21K Gold', 518940.00, 'gold_bangle.png', 0),
('Shahzadi 21K Broad Gold Cuff', 'gold_bangles', 'Broad single gold cuff bangle with openable clasp in 21K yellow gold.', 2.200, '21K Gold', 634260.00, 'gold_bangle.png', 0),
('Fahad Classic 24K Heavy Gold Kara', 'gold_bangles', 'Extra heavy 24K pure gold investment kara pair.', 4.000, '24K Gold', 1318000.00, 'gold_bangle.png', 0),

-- 3. GOLD CHAINS / MALA (6 items)
('Rope Design 21K Gold Mala', 'gold_chains', 'Classic 21K gold twist rope chain (Mala) with strong lobster clasp. Durable for daily or event wear.', 1.500, '21K Gold', 432450.00, 'hero.png', 1),
('Sultan 24K Solid Gold Chain', 'gold_chains', 'Heavy 24K pure gold flat link chain with high-shine polished finish.', 2.000, '24K Gold', 659000.00, 'hero.png', 1),
('Zargari 21K Fancy Pendant Chain', 'gold_chains', 'Delicate 21K gold box chain with micro-bead embellishments.', 0.800, '21K Gold', 230640.00, 'hero.png', 0),
('Peshawari 21K Gold Coin Mala', 'gold_chains', 'Traditional Pashtun style gold coin chain (Pehli Mala) crafted in 21K gold.', 2.800, '21K Gold', 807240.00, 'hero.png', 0),
('Gulzar 21K Lightweight Gold Chain', 'gold_chains', 'Slender 21K gold chain suitable for young ladies and girls.', 0.600, '21K Gold', 172980.00, 'hero.png', 0),
('Khyber 24K Investment Gold Bar Chain', 'gold_chains', 'Solid 24K gold chain with attached hallmark bar.', 3.200, '24K Gold', 1054400.00, 'hero.png', 0),

-- 4. GOLD RINGS (6 items)
('Fahad Signature 21K Gold Ring', 'gold_rings', 'Traditional 21K gold ladies ring with intricate lattice work and polished center motif.', 0.500, '21K Gold', 144150.00, 'hero.png', 1),
('Saraf 24K Pure Gold Coin Ring', 'gold_rings', 'Classic 24K pure gold coin ring featuring traditional geometric engraving.', 0.700, '24K Gold', 230650.00, 'hero.png', 1),
('Shahana 21K Adjustable Gold Ring', 'gold_rings', 'Modern 21K gold adjustable ring with leaf design.', 0.400, '21K Gold', 115320.00, 'hero.png', 0),
('Nageena 21K Gold Solitaire Band', 'gold_rings', 'Smooth 21K gold band ring with polished edges.', 0.600, '21K Gold', 172980.00, 'hero.png', 0),
('Bibi 21K Traditional Floral Ring', 'gold_rings', 'Classic vintage Pakistani floral ring in 21K gold.', 0.800, '21K Gold', 230640.00, 'hero.png', 0),
('KPK Royal 24K Heavy Gold Gents Ring', 'gold_rings', 'Solid 24K gents gold ring with flat top face.', 1.000, '24K Gold', 329500.00, 'hero.png', 0),

-- 5. EARRINGS & JHUMKE (6 items)
('Peshawari 21K Gold Jhumka Earrings', 'earrings', 'Authentic Pashtun style 21K gold jhumke with hanging gold drop beads.', 1.200, '21K Gold', 345960.00, 'emerald_earrings.png', 1),
('Gulzar 21K Gold Bali Earrings', 'earrings', 'Traditional round 21K gold hoop earrings (Bali) with textured finish.', 0.600, '21K Gold', 172980.00, 'emerald_earrings.png', 1),
('Chandbali 21K Gold Drop Earrings', 'earrings', 'Moon-shaped 21K gold chandbali earrings for weddings and festive occasions.', 1.500, '21K Gold', 432450.00, 'emerald_earrings.png', 0),
('Kiran 21K Gold Stud Earrings', 'earrings', 'Lightweight 21K gold stud earrings for daily wear.', 0.350, '21K Gold', 100905.00, 'emerald_earrings.png', 0),
('Royal 24K Pure Gold Hanging Jhumke', 'earrings', 'Heavy 24K gold jhumke with 3-tier drop design.', 2.000, '24K Gold', 659000.00, 'emerald_earrings.png', 0),
('Zari 21K Gold Tops', 'earrings', 'Classic flower tops in 21K yellow gold with screw back.', 0.500, '21K Gold', 144150.00, 'emerald_earrings.png', 0),

-- 6. SILVER COLLECTION (Normal & Italian Silver) (6 items)
('Milano Italian Silver Bracelet', 'silver', 'Anti-oxidation Italian silver chain bracelet with rhodium-coated mirror shine finish.', 2.500, 'Italian Silver', 12000.00, 'sapphire_pendant.png', 1),
('Chandi 925 Normal Silver Anklet (Payal)', 'silver', 'Traditional Pakistani silver anklet pair with gentle chime beads.', 4.000, 'Normal Silver', 14400.00, 'sapphire_pendant.png', 1),
('Roma Italian Silver Ring (Gents)', 'silver', 'Sleek Italian anti-tarnish silver ring for men.', 1.200, 'Italian Silver', 5760.00, 'sapphire_pendant.png', 0),
('Peshawar Normal Silver Kara', 'silver', 'Solid 100% pure local silver kara for men and boys.', 5.000, 'Normal Silver', 18000.00, 'sapphire_pendant.png', 0),
('Venetian Italian Silver Chain', 'silver', 'Premium Italian anti-oxidation silver chain with snake-link weave.', 2.000, 'Italian Silver', 9600.00, 'sapphire_pendant.png', 0),
('Gul Chandi Normal Silver Ring', 'silver', 'Hand-carved local silver ladies ring.', 0.800, 'Normal Silver', 2880.00, 'sapphire_pendant.png', 0);

-- Customer Enquiries Table
CREATE TABLE IF NOT EXISTS enquiries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(150),
    service ENUM('gold_buying','gold_selling','repair','polishing','resize','custom_order','general') DEFAULT 'general',
    message TEXT NOT NULL,
    status ENUM('pending','completed','cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Analytics & Tracking Tables
CREATE TABLE IF NOT EXISTS page_views (
    id INT AUTO_INCREMENT PRIMARY KEY,
    page_name VARCHAR(100) NOT NULL,
    visitor_ip VARCHAR(45),
    view_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    note_text TEXT NOT NULL,
    is_completed TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Financial Records Table (Admin Panel)
CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type ENUM('sale','purchase','expense') NOT NULL,
    customer_name VARCHAR(150),
    amount_pkr DECIMAL(12,2) NOT NULL,
    gold_weight_tola DECIMAL(8,3),
    description TEXT,
    transaction_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admins Table
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT IGNORE INTO admins (username, password_hash)
VALUES ('fahad', '$2y$12$LbcHJo2yYL7C9ZCvOGFqbOXB3YJDqFDQVVbMU4y8BkP.g0kJjqxoW');

-- Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    location VARCHAR(100) DEFAULT 'Nowshera',
    rating TINYINT DEFAULT 5,
    review TEXT NOT NULL,
    is_approved TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

TRUNCATE TABLE testimonials;

INSERT INTO testimonials (customer_name, location, rating, review) VALUES
('Muhammad Tariq', 'Nowshera', 5, 'Gul Nawaz Khan bhai ka karobar bohat honest hai. 21K Gold bridal set khareeda. Wajan poora tha aur rate fair tha.'),
('Saima Bibi', 'Nowshera Kalan', 5, 'Fahad Jewellery se bangles aur ring khareedi. Italian silver bhi boht achi quality ka mila.'),
('Haji Rashid Khan', 'Pabbi', 5, 'Gold buying service par poora rate diya. 12.150 aur cut formula bilkul saaf samjha kar rate lagaya. Honesty 100% hai.'),
('Fatima Noor', 'Nowshera', 5, 'Ring resize aur polish karwai thi. Waqt par tayar ki aur shine naye jaisi ho gayi.'),
('Imran ul Haq', 'Akora Khattak', 5, 'Italian anti-oxidation silver bracelet liya. Tarnish nahi hota aur look 100% white gold jaisa hai.');
