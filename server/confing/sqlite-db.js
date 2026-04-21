import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create SQLite database file
const dbPath = path.join(__dirname, '..', 'todos.db');
const db = new Database(dbPath);

// Initialize database and create table if it doesn't exist
function initializeDatabase() {
  try {
    // Create todo table
    db.exec(`
      CREATE TABLE IF NOT EXISTS todo (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert sample data if table is empty
    const count = db.prepare('SELECT COUNT(*) as count FROM todo').get();
    if (count.count === 0) {
      const insert = db.prepare('INSERT INTO todo (title) VALUES (?)');
      insert.run('Sample todo 1');
      insert.run('Sample todo 2');
      insert.run('Sample todo 3');
      console.log('Sample data inserted into SQLite database');
    }
    
    console.log('SQLite database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

// Initialize the database
initializeDatabase();

// Create a mock interface that matches the MySQL interface
const sqliteDb = {
  query: async (sql, params = []) => {
    return new Promise((resolve, reject) => {
      try {
        console.log('SQLite Query:', sql, params);
        
        if (sql.includes('SELECT')) {
          const rows = db.prepare(sql).all(params);
          resolve([rows]);
        } else if (sql.includes('INSERT')) {
          const result = db.prepare(sql).run(params);
          resolve([{ insertId: result.lastInsertRowid }]);
        } else if (sql.includes('DELETE')) {
          const result = db.prepare(sql).run(params);
          resolve([{ affectedRows: result.changes }]);
        } else {
          const result = db.prepare(sql).run(params);
          resolve([result]);
        }
      } catch (error) {
        reject(error);
      }
    });
  }
};

export default sqliteDb;
