-- Create database
CREATE DATABASE IF NOT EXISTS shoes_phones_shop;
USE shoes_phones_shop;

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category ENUM('shoe', 'phone') NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    featured BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer JSON NOT NULL,
    items JSON NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Sample data
INSERT INTO products (name, category, price, description, image_url, featured) VALUES
('Running Shoes', 'shoe', 89.99, 'Comfortable running shoes for all terrains', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff', TRUE),
('Basketball Shoes', 'shoe', 119.99, 'High-performance basketball shoes', 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28', FALSE),
('Smartphone X', 'phone', 699.99, 'Latest smartphone with advanced features', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9', TRUE),
('Wireless Earbuds', 'phone', 129.99, 'Premium sound quality wireless earbuds', 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df', FALSE),
('Casual Sneakers', 'shoe', 59.99, 'Stylish casual sneakers for everyday wear', 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519', FALSE),
('Smartphone Y', 'phone', 499.99, 'Mid-range smartphone with great camera', 'https://images.unsplash.com/photo-1580913428735-bd3c269d6a82', TRUE);