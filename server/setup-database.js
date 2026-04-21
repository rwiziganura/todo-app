import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function setupDatabase() {
  try {
    // Connect to MySQL without specifying database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
    });

    console.log('Connected to MySQL server');

    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'todo-app2'}\``);
    console.log('Database created or already exists');

    // Switch to the database
    await connection.query(`USE \`${process.env.DB_NAME || 'todo-app2'}\``);

    // Create todo table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS todo (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('Todo table created or already exists');

    // Insert some sample data
    await connection.query(`
      INSERT IGNORE INTO todo (title) VALUES 
      ('Sample todo 1'),
      ('Sample todo 2'),
      ('Sample todo 3')
    `);
    console.log('Sample data inserted');

    await connection.end();
    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Database setup failed:', error.message);
    process.exit(1);
  }
}

setupDatabase();
