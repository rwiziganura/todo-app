import db from "./db.confi.js";

export async function initializeDatabase() {
  try {
    // Create users table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Add user_id column to todo table if it doesn't exist
    const [cols] = await db.query(`SHOW COLUMNS FROM todo LIKE 'user_id'`);
    if (cols.length === 0) {
      await db.query(`ALTER TABLE todo ADD COLUMN user_id INT, ADD FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE`);
      console.log("Added user_id column to todo table");
    }

    console.log("Database migration completed successfully");
  } catch (error) {
    console.error("Database migration error:", error.message);
  }
}
