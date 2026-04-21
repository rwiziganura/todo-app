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

    // Add user_id and is_done if they don't exist
    const [columns] = await db.query("SHOW COLUMNS FROM todo");
    const hasUserId = columns.some(col => col.Field === 'user_id');
    const hasIsDone = columns.some(col => col.Field === 'is_done');

    if (!hasUserId) {
      await db.query(`ALTER TABLE todo ADD COLUMN user_id INT, ADD FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE`);
      console.log("Added user_id column to todo table");
    }

    if (!hasIsDone) {
      await db.query(`ALTER TABLE todo ADD COLUMN is_done BOOLEAN DEFAULT FALSE`);
      console.log("Added is_done column to todo table");
    }

    console.log("Database migration completed successfully");
  } catch (error) {
    console.error("Database migration error:", error.message);
  }
}
