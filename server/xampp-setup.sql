-- XAMPP MySQL Database Setup Script
-- Run this in phpMyAdmin or MySQL command line

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS `todo-app2`;

-- Use the database
USE `todo-app2`;

-- Create todo table
CREATE TABLE IF NOT EXISTS `todo` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO `todo` (`title`) VALUES 
('Sample todo 1'),
('Sample todo 2'),
('Sample todo 3')
ON DUPLICATE KEY UPDATE title=VALUES(title);
